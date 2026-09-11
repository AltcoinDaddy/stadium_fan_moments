import { Hono } from "hono";
import { and, desc, eq, gt, isNull, ne } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { createPublicClient, decodeEventLog, decodeFunctionData, formatEther, http, isAddress, parseEther, type Hex } from "viem";
import { getDb } from "./db";
import { moments, stadiumCheckins, users } from "./db/schema";
import { authConfigurationError, requirePrivyUserId } from "./auth";
import { chilizSpicy } from "@/lib/chiliz";
import { matchdayContractAddress, matchdayMomentsAbi } from "@/lib/matchdayContract";
import { createCheckinToken, findStadiumCheckin, getVenueMatch, stadiums, verifyCheckinToken } from "./stadium";

const api = new Hono().basePath("/api");
const ownerUsers = alias(users, "moment_owner");
const pinataGateway = "https://gateway.pinata.cloud/ipfs";
const chainClient = createPublicClient({
  chain: chilizSpicy,
  transport: http(process.env.NEXT_PUBLIC_CHILIZ_RPC_URL || chilizSpicy.rpcUrls.default.http[0]),
});

type AuthenticatedUser = { id: string; privyId: string; walletAddress: `0x${string}` };
type ContractEvent = { eventName: string; args: Record<string, unknown> };

async function getAuthenticatedUser(c: Parameters<typeof requirePrivyUserId>[0]) {
  const privyId = await requirePrivyUserId(c);
  if (!privyId) return null;
  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.privyId, privyId)).limit(1);
  if (!user?.walletAddress || !isAddress(user.walletAddress)) return null;
  return { id: user.id, privyId, walletAddress: user.walletAddress } as AuthenticatedUser;
}

function authError(c: Parameters<typeof requirePrivyUserId>[0]) {
  return authConfigurationError()
    ? c.json({ error: "Privy server authentication is not configured" }, 503)
    : c.json({ error: "Authentication required" }, 401);
}

function findContractEvent(receipt: Awaited<ReturnType<typeof chainClient.waitForTransactionReceipt>>, eventName: string) {
  for (const log of receipt.logs) {
    if (log.address.toLowerCase() !== matchdayContractAddress?.toLowerCase()) continue;
    try {
      const event = decodeEventLog({
        abi: matchdayMomentsAbi,
        data: log.data,
        topics: log.topics,
      }) as unknown as ContractEvent;
      if (event.eventName === eventName) return event;
    } catch {
      // Ignore logs from other contracts and unrelated events.
    }
  }
  return null;
}

async function verifiedTransaction(hash: string, walletAddress: `0x${string}`) {
  if (!matchdayContractAddress || !/^0x[a-fA-F0-9]{64}$/.test(hash)) return null;
  try {
    const [transaction, receipt] = await Promise.all([
      chainClient.getTransaction({ hash: hash as Hex }),
      chainClient.getTransactionReceipt({ hash: hash as Hex }),
    ]);
    if (
      receipt.status !== "success" ||
      !transaction.to ||
      transaction.to.toLowerCase() !== matchdayContractAddress.toLowerCase() ||
      transaction.from.toLowerCase() !== walletAddress.toLowerCase()
    ) {
      return null;
    }
    return { transaction, receipt };
  } catch {
    return null;
  }
}

async function uploadToPinata(file: File) {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) throw new Error("PINATA_JWT is not configured");

  const form = new FormData();
  form.append("network", "public");
  form.append("file", file, file.name);
  const response = await fetch("https://uploads.pinata.cloud/v3/files", {
    method: "POST",
    headers: { Authorization: `Bearer ${jwt}` },
    body: form,
  });

  if (!response.ok) throw new Error("Pinata upload failed");
  const result = (await response.json()) as { data?: { cid?: string } };
  if (!result.data?.cid) throw new Error("Pinata did not return a CID");

  return result.data.cid;
}

async function getPrivateDownloadUrl(cid: string) {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) throw new Error("PINATA_JWT is not configured");

  const gatewaysResponse = await fetch("https://api.pinata.cloud/v3/gateways", {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  const gateways = (await gatewaysResponse.json()) as {
    data?: { rows?: Array<{ domain?: string }> };
  };
  const domain = gateways.data?.rows?.[0]?.domain;
  if (!domain) throw new Error("No Pinata gateway is configured");

  const response = await fetch(
    "https://api.pinata.cloud/v3/files/private/download_link",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: `https://${domain}.mypinata.cloud/files/${cid}`,
        expires: 120,
        date: Math.floor(Date.now() / 1000),
        method: "GET",
      }),
    }
  );
  const result = (await response.json()) as { data?: string };
  if (!response.ok || !result.data) throw new Error("Private media link failed");
  return result.data;
}

const dbUnavailable = () =>
  process.env.DATABASE_URL
    ? null
    : { error: "DATABASE_URL is not configured" };

const momentSelection = {
  id: moments.id,
  userId: moments.userId,
  ownerId: moments.ownerId,
  title: moments.title,
  description: moments.description,
  mediaUrl: moments.mediaUrl,
  mediaType: moments.mediaType,
  category: moments.category,
  rarity: moments.rarity,
  price: moments.price,
  tokenSymbol: moments.tokenSymbol,
  match: moments.match,
  minute: moments.minute,
  location: moments.location,
  tokenId: moments.tokenId,
  txnHash: moments.txnHash,
  serial: moments.serial,
  maxSerial: moments.maxSerial,
  likes: moments.likes,
  views: moments.views,
  isListed: moments.isListed,
  createdAt: moments.createdAt,
  creator: {
    username: users.username,
    avatar: users.avatar,
    address: users.walletAddress,
  },
  owner: {
    username: ownerUsers.username,
    avatar: ownerUsers.avatar,
    address: ownerUsers.walletAddress,
  },
};

type MomentRow = {
  id: string;
  userId: string;
  ownerId: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: string;
  category: string;
  rarity: string;
  price: number;
  tokenSymbol: string;
  match: string;
  minute: string;
  location: string;
  tokenId: string | null;
  txnHash: string | null;
  serial: number;
  maxSerial: number;
  likes: number;
  views: number;
  isListed: number;
  createdAt: Date;
  creator: { username: string; avatar: string | null; address: string | null };
  owner: { username: string; avatar: string | null; address: string | null };
};

function toClientMoment(row: MomentRow) {
  return {
    id: row.id,
    userId: row.userId,
    ownerId: row.ownerId,
    title: row.title,
    description: row.description,
    imageUrl: row.mediaUrl.startsWith(`${pinataGateway}/`)
      ? `/api/media/${row.mediaUrl.slice(`${pinataGateway}/`.length)}`
      : row.mediaUrl,
    mediaType: row.mediaType === "video" ? "video" : "image",
    category: row.category,
    rarity: row.rarity,
    price: row.price,
    tokenSymbol: row.tokenSymbol,
    match: row.match,
    minute: row.minute,
    location: row.location,
    tokenId: row.tokenId || undefined,
    creator: {
      username: row.creator.username,
      avatar: row.creator.avatar || "",
      address: row.creator.address || "Unknown",
    },
    owner: {
      username: row.owner.username,
      avatar: row.owner.avatar || "",
      address: row.owner.address || "Unknown",
    },
    serial: row.serial,
    maxSerial: row.maxSerial,
    timestamp: row.createdAt.toISOString(),
    txnHash: row.txnHash || "Pending confirmation",
    likes: row.likes,
    views: row.views,
    isListed: row.isListed === 1,
  };
}

async function findMoments(conditions: ReturnType<typeof eq>[] = []) {
  const db = getDb();
  const rows = await db
    .select(momentSelection)
    .from(moments)
    .innerJoin(users, eq(moments.userId, users.id))
    .innerJoin(ownerUsers, eq(moments.ownerId, ownerUsers.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(moments.createdAt));

  return rows.map((row) => toClientMoment(row as MomentRow));
}

api.get("/health", (c) => c.json({ ok: true }));

api.post("/stadium-check-in", async (c) => {
  const unavailable = dbUnavailable();
  if (unavailable) return c.json(unavailable, 503);
  const authenticatedUser = await getAuthenticatedUser(c);
  if (!authenticatedUser) return authError(c);

  const { latitude, longitude, accuracy } = await c.req.json<{
    latitude?: number;
    longitude?: number;
    accuracy?: number;
  }>();
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || !Number.isFinite(accuracy) || accuracy! > 100) {
    return c.json({ error: "A high-accuracy device location is required" }, 422);
  }
  // Local desktop previews do not reliably expose a hardware location source.
  // Bypass the strict stadium geo-fence check entirely in development mode.
  const localPreview = process.env.NODE_ENV !== "production";
  const checkin = localPreview
    ? { stadium: stadiums[0], distance: 0 }
    : findStadiumCheckin(latitude!, longitude!);
  if (!checkin) return c.json({ error: "You are outside a supported stadium check-in zone" }, 403);

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const { token, tokenHash } = createCheckinToken({
    userId: authenticatedUser.id,
    venueId: checkin.stadium.id,
    nonce: crypto.randomUUID(),
    expiresAt: expiresAt.getTime(),
  });
  await getDb().insert(stadiumCheckins).values({
    id: crypto.randomUUID(),
    userId: authenticatedUser.id,
    venueId: checkin.stadium.id,
    venueName: checkin.stadium.name,
    latitude: latitude!,
    longitude: longitude!,
    tokenHash,
    expiresAt,
  });
  const match = await getVenueMatch(checkin.stadium.name);
  return c.json({
    venueName: checkin.stadium.name,
    match: match?.match || "Verified stadium capture",
    minute: match?.minute || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    token,
    expiresAt: expiresAt.toISOString(),
  }, 201);
});

api.get("/users/:id/stats", async (c) => {
  const unavailable = dbUnavailable();
  if (unavailable) return c.json(unavailable, 503);
  const authenticatedUser = await getAuthenticatedUser(c);
  if (!authenticatedUser) return authError(c);
  if (c.req.param("id") !== authenticatedUser.id) return c.json({ error: "Forbidden" }, 403);

  const created = await getDb()
    .select({ txnHash: moments.txnHash, createdAt: moments.createdAt })
    .from(moments)
    .where(eq(moments.userId, authenticatedUser.id))
    .orderBy(moments.createdAt);
  const seen = new Set<string>();
  const incomeEvents: Array<{ value: number; createdAt: Date }> = [];
  let momentsSold = 0;
  let royaltyIncome = 0;

  for (const moment of created) {
    if (!moment.txnHash || seen.has(moment.txnHash)) continue;
    seen.add(moment.txnHash);
    try {
      const receipt = await chainClient.getTransactionReceipt({ hash: moment.txnHash as Hex });
      const sale = findContractEvent(receipt, "MomentPurchased");
      if (!sale) continue;
      const price = Number(formatEther(sale.args.price as bigint));
      const royalty = Number(formatEther(sale.args.royaltyPaid as bigint));
      const seller = String(sale.args.seller).toLowerCase();
      const isSeller = seller === authenticatedUser.walletAddress.toLowerCase();
      const income = isSeller ? price : royalty;
      if (isSeller) momentsSold += 1;
      if (!isSeller) royaltyIncome += royalty;
      incomeEvents.push({ value: income, createdAt: moment.createdAt });
    } catch {
      // A missing or unrelated transaction is not part of the income history.
    }
  }

  let runningIncome = 0;
  const incomeSeries = incomeEvents.map((event) => {
    runningIncome += event.value;
    return Number(runningIncome.toFixed(4));
  });
  return c.json({
    totalIncome: Number(runningIncome.toFixed(4)),
    momentsSold,
    royaltyIncome: Number(royaltyIncome.toFixed(4)),
    incomeSeries,
  });
});

api.get("/sports/matches", async (c) => {
  const date = new Date().toISOString().slice(0, 10);
  try {
    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/123/eventsday.php?d=${date}&s=Soccer`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!response.ok) throw new Error("Sports feed unavailable");
    const data = (await response.json()) as { events?: Array<Record<string, string | number | null>> };
    const matches = (data.events || []).slice(0, 10).map((event) => ({
      id: String(event.idEvent),
      teamHome: String(event.strHomeTeam || "Home"),
      teamAway: String(event.strAwayTeam || "Away"),
      teamHomeSymbol: String(event.strHomeTeam || "H").slice(0, 3).toUpperCase(),
      teamAwaySymbol: String(event.strAwayTeam || "A").slice(0, 3).toUpperCase(),
      teamHomeLogo: String(event.strHomeTeamBadge || event.strLeagueBadge || "/globe.svg"),
      teamAwayLogo: String(event.strAwayTeamBadge || event.strLeagueBadge || "/globe.svg"),
      scoreHome: Number(event.intHomeScore || 0),
      scoreAway: Number(event.intAwayScore || 0),
      status: event.strStatus === "FT" ? "COMPLETED" : event.strStatus === "NS" ? "UPCOMING" : "LIVE",
      time: String(event.strTimeLocal || event.strTime || "TBD").slice(0, 5),
      activeCapturers: 0,
      suggestionTags: [],
      location: String(event.strVenue || event.strLeague || "Stadium"),
      stadiumImageUrl: event.strThumb ? String(event.strThumb) : undefined,
    }));
    return c.json({ matches });
  } catch {
    return c.json({ matches: [], error: "Sports data is temporarily unavailable" }, 502);
  }
});

api.get("/leaderboard", async (c) => {
  const unavailable = dbUnavailable();
  if (unavailable) return c.json(unavailable, 503);
  const db = getDb();
  const rows = await db
    .select({ username: users.username, avatar: users.avatar, captures: moments.id })
    .from(users)
    .leftJoin(moments, eq(moments.userId, users.id));
  const ranked = Object.values(rows.reduce<Record<string, { username: string; avatar: string; captures: number }>>((all, row) => {
    const key = row.username;
    const entry = all[key] || { username: row.username, avatar: row.avatar || "/globe.svg", captures: 0 };
    if (row.captures) entry.captures += 1;
    all[key] = entry;
    return all;
  }, {})).sort((a, b) => b.captures - a.captures).slice(0, 2);
  return c.json({ leaderboard: ranked });
});

api.get("/media/:cid", async (c) => {
  const cid = c.req.param("cid");
  if (!/^[a-zA-Z0-9]+$/.test(cid)) {
    return c.json({ error: "Invalid IPFS CID" }, 400);
  }

  let response: Response | null = null;
  try {
    response = await fetch(`${pinataGateway}/${cid}`, {
      signal: AbortSignal.timeout(6000),
    });
  } catch {
    // Private IPFS files are not available from the public gateway.
  }

  if (!response?.ok || !response.body) {
    try {
      response = await fetch(await getPrivateDownloadUrl(cid));
    } catch {
      response = null;
    }
  }

  if (!response?.ok || !response.body) {
    return c.json({ error: "Media could not be retrieved" }, 502);
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": response.headers.get("content-type") || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
});

api.post("/users/upsert", async (c) => {
  const unavailable = dbUnavailable();
  if (unavailable) return c.json(unavailable, 503);

  const authenticatedPrivyId = await requirePrivyUserId(c);
  if (!authenticatedPrivyId) return authError(c);

  const body = await c.req.json<{
    email?: string;
    username: string;
    avatar?: string;
    walletAddress?: string;
  }>();

  if (!body.username || (body.walletAddress && !isAddress(body.walletAddress))) {
    return c.json({ error: "A username and valid wallet address are required" }, 400);
  }

  const db = getDb();
  const id = `user_${authenticatedPrivyId}`;
  const [user] = await db
    .insert(users)
    .values({
      id,
      privyId: authenticatedPrivyId,
      email: body.email,
      username: body.username,
      avatar: body.avatar,
      walletAddress: body.walletAddress,
    })
    .onConflictDoUpdate({
      target: users.privyId,
      set: {
        email: body.email,
        username: body.username,
        avatar: body.avatar,
        walletAddress: body.walletAddress,
        updatedAt: new Date(),
      },
    })
    .returning();

  return c.json({ user });
});

api.get("/moments", async (c) => {
  const unavailable = dbUnavailable();
  if (unavailable) return c.json(unavailable, 503);

  const conditions = [] as ReturnType<typeof eq>[];
  if (c.req.query("listed") === "true") conditions.push(eq(moments.isListed, 1));
  if (c.req.query("creatorId")) conditions.push(eq(moments.userId, c.req.query("creatorId")!));
  if (c.req.query("ownerId")) conditions.push(eq(moments.ownerId, c.req.query("ownerId")!));

  return c.json({ moments: await findMoments(conditions) });
});

api.get("/users/:id/moments", async (c) => {
  const unavailable = dbUnavailable();
  if (unavailable) return c.json(unavailable, 503);

  const userId = c.req.param("id");
  const [created, owned] = await Promise.all([
    findMoments([eq(moments.userId, userId)]),
    findMoments([eq(moments.ownerId, userId)]),
  ]);

  return c.json({
    captures: created,
    collection: owned.filter((moment) => moment.userId !== userId),
  });
});

api.post("/moments", async (c) => {
  const unavailable = dbUnavailable();
  if (unavailable) return c.json(unavailable, 503);

  const authenticatedUser = await getAuthenticatedUser(c);
  if (!authenticatedUser) return authError(c);
  const body = await c.req.json<typeof moments.$inferInsert & { stadiumCheckInToken?: string }>();
  if (!body.id || !body.title || !body.mediaUrl || !body.tokenId || !body.txnHash || !Number.isInteger(body.price)) {
    return c.json({ error: "id, title, mediaUrl, tokenId, price, and txnHash are required" }, 400);
  }
  if (!body.stadiumCheckInToken) return c.json({ error: "A verified stadium check-in is required" }, 403);
  const checkinToken = verifyCheckinToken(body.stadiumCheckInToken, authenticatedUser.id);
  if (!checkinToken) return c.json({ error: "Stadium check-in has expired or is invalid" }, 403);

  const verified = await verifiedTransaction(body.txnHash, authenticatedUser.walletAddress);
  if (!verified) return c.json({ error: "Mint transaction could not be verified" }, 422);
  try {
    const call = decodeFunctionData({ abi: matchdayMomentsAbi, data: verified.transaction.input });
    const minted = findContractEvent(verified.receipt, "MomentMinted");
    if (
      call.functionName !== "mintMoment" ||
      call.args[1] !== parseEther(String(body.price)) ||
      !minted ||
      String(minted.args.tokenId) !== body.tokenId ||
      String(minted.args.creator).toLowerCase() !== authenticatedUser.walletAddress.toLowerCase() ||
      minted.args.initialPrice !== parseEther(String(body.price))
    ) {
      return c.json({ error: "Mint transaction does not match this moment" }, 422);
    }
  } catch {
    return c.json({ error: "Mint transaction data is invalid" }, 422);
  }

  const db = getDb();
  const [checkin] = await db
    .update(stadiumCheckins)
    .set({ usedAt: new Date() })
    .where(
      and(
        eq(stadiumCheckins.userId, authenticatedUser.id),
        eq(stadiumCheckins.tokenHash, checkinToken.tokenHash),
        isNull(stadiumCheckins.usedAt),
        gt(stadiumCheckins.expiresAt, new Date())
      )
    )
    .returning();
  if (!checkin) return c.json({ error: "Stadium check-in has already been used or expired" }, 409);
  const [moment] = await db
    .insert(moments)
    .values({
      ...body,
      mediaType: body.mediaType === "video" ? "video" : "image",
      userId: authenticatedUser.id,
      ownerId: authenticatedUser.id,
      location: checkin.venueName,
    })
    .returning();
  return c.json({ moment }, 201);
});

api.post("/moments/:id/purchase", async (c) => {
  const unavailable = dbUnavailable();
  if (unavailable) return c.json(unavailable, 503);

  const authenticatedUser = await getAuthenticatedUser(c);
  if (!authenticatedUser) return authError(c);
  const { txnHash } = await c.req.json<{ txnHash?: string }>();
  if (!txnHash) return c.json({ error: "txnHash is required" }, 400);

  const db = getDb();
  const [existing] = await db.select().from(moments).where(eq(moments.id, c.req.param("id"))).limit(1);
  if (!existing?.tokenId) return c.json({ error: "Moment is not minted on-chain" }, 409);
  const verified = await verifiedTransaction(txnHash, authenticatedUser.walletAddress);
  if (!verified) return c.json({ error: "Purchase transaction could not be verified" }, 422);
  try {
    const call = decodeFunctionData({ abi: matchdayMomentsAbi, data: verified.transaction.input });
    const purchased = findContractEvent(verified.receipt, "MomentPurchased");
    const onChainOwner = await chainClient.readContract({
      address: matchdayContractAddress!,
      abi: matchdayMomentsAbi,
      functionName: "ownerOf",
      args: [BigInt(existing.tokenId)],
    });
    if (
      call.functionName !== "purchase" ||
      String(call.args[0]) !== existing.tokenId ||
      verified.transaction.value !== parseEther(String(existing.price)) ||
      !purchased ||
      String(purchased.args.tokenId) !== existing.tokenId ||
      String(purchased.args.buyer).toLowerCase() !== authenticatedUser.walletAddress.toLowerCase() ||
      onChainOwner.toLowerCase() !== authenticatedUser.walletAddress.toLowerCase()
    ) {
      return c.json({ error: "Purchase transaction does not match this moment" }, 422);
    }
  } catch {
    return c.json({ error: "Purchase transaction data is invalid" }, 422);
  }
  const [moment] = await db
    .update(moments)
    .set({ ownerId: authenticatedUser.id, isListed: 0, txnHash })
    .where(and(eq(moments.id, c.req.param("id")), ne(moments.ownerId, authenticatedUser.id)))
    .returning();

  if (!moment) return c.json({ error: "Moment is unavailable" }, 409);
  const [updated] = await findMoments([eq(moments.id, moment.id)]);
  return c.json({ moment: updated });
});

api.post("/moments/:id/listing", async (c) => {
  const unavailable = dbUnavailable();
  if (unavailable) return c.json(unavailable, 503);

  const authenticatedUser = await getAuthenticatedUser(c);
  if (!authenticatedUser) return authError(c);
  const { price, isListed, txnHash } = await c.req.json<{
    price?: number;
    isListed?: boolean;
    txnHash?: string;
  }>();
  if (typeof isListed !== "boolean" || !txnHash) {
    return c.json({ error: "isListed and txnHash are required" }, 400);
  }
  if (isListed && (!Number.isInteger(price) || price! < 1)) {
    return c.json({ error: "A whole-number CHZ price is required" }, 400);
  }

  const db = getDb();
  const [existing] = await db.select().from(moments).where(eq(moments.id, c.req.param("id"))).limit(1);
  if (!existing?.tokenId || existing.ownerId !== authenticatedUser.id) {
    return c.json({ error: "Moment is no longer owned by this user" }, 409);
  }
  const verified = await verifiedTransaction(txnHash, authenticatedUser.walletAddress);
  if (!verified) return c.json({ error: "Listing transaction could not be verified" }, 422);
  try {
    const call = decodeFunctionData({ abi: matchdayMomentsAbi, data: verified.transaction.input });
    const event = findContractEvent(verified.receipt, isListed ? "MomentListed" : "MomentDelisted");
    const expectedFunction = isListed ? "listMoment" : "delistMoment";
    const onChainOwner = await chainClient.readContract({
      address: matchdayContractAddress!,
      abi: matchdayMomentsAbi,
      functionName: "ownerOf",
      args: [BigInt(existing.tokenId)],
    });
    if (
      call.functionName !== expectedFunction ||
      String(call.args[0]) !== existing.tokenId ||
      !event ||
      String(event.args.tokenId) !== existing.tokenId ||
      String(event.args.seller).toLowerCase() !== authenticatedUser.walletAddress.toLowerCase() ||
      onChainOwner.toLowerCase() !== authenticatedUser.walletAddress.toLowerCase() ||
      (isListed && (call.args[1] !== parseEther(String(price)) || event.args.price !== parseEther(String(price))))
    ) {
      return c.json({ error: "Listing transaction does not match this moment" }, 422);
    }
  } catch {
    return c.json({ error: "Listing transaction data is invalid" }, 422);
  }
  const [moment] = await db
    .update(moments)
    .set({
      isListed: isListed ? 1 : 0,
      ...(isListed ? { price } : {}),
      txnHash: txnHash || undefined,
    })
    .where(and(eq(moments.id, c.req.param("id")), eq(moments.ownerId, authenticatedUser.id)))
    .returning();

  if (!moment) return c.json({ error: "Moment is no longer owned by this user" }, 409);
  const [updated] = await findMoments([eq(moments.id, moment.id)]);
  return c.json({ moment: updated });
});

api.post("/moments/:id/repin", async (c) => {
  const unavailable = dbUnavailable();
  if (unavailable) return c.json(unavailable, 503);

  const authenticatedUser = await getAuthenticatedUser(c);
  if (!authenticatedUser) return authError(c);

  const db = getDb();
  const [moment] = await db
    .select()
    .from(moments)
    .where(eq(moments.id, c.req.param("id")))
    .limit(1);
  if (!moment) return c.json({ error: "Moment not found" }, 404);
  if (moment.ownerId !== authenticatedUser.id) return c.json({ error: "Moment is not owned by this user" }, 403);
  try {
    const cid = moment.mediaUrl.match(/\/ipfs\/([a-zA-Z0-9]+)/)?.[1];
    const sourceUrl = moment.mediaUrl.startsWith("data:")
      ? moment.mediaUrl
      : cid
      ? await getPrivateDownloadUrl(cid)
      : null;
    if (!sourceUrl) return c.json({ error: "Moment media cannot be re-pinned" }, 400);

    const blob = await fetch(sourceUrl).then((response) => response.blob());
    const publicCid = await uploadToPinata(
      new File([blob], `moment-${moment.id}.${blob.type.split("/")[1] || "bin"}`, {
        type: blob.type,
      })
    );
    const mediaUrl = `${pinataGateway}/${publicCid}`;
    await db.update(moments).set({ mediaUrl }).where(eq(moments.id, moment.id));
    return c.json({ cid: publicCid, url: `/api/media/${publicCid}` });
  } catch {
    return c.json({ error: "Pinata upload failed" }, 502);
  }
});

api.get("/moments/:id", async (c) => {
  const unavailable = dbUnavailable();
  if (unavailable) return c.json(unavailable, 503);

  const db = getDb();
  const [stored] = await db.select().from(moments).where(eq(moments.id, c.req.param("id"))).limit(1);
  if (stored) await db.update(moments).set({ views: stored.views + 1 }).where(eq(moments.id, stored.id));
  const [moment] = await findMoments([eq(moments.id, c.req.param("id"))]);
  if (!moment) return c.json({ error: "Moment not found" }, 404);
  return c.json({ moment });
});

api.post("/uploads", async (c) => {
  const authenticatedPrivyId = await requirePrivyUserId(c);
  if (!authenticatedPrivyId) return authError(c);
  const body = await c.req.parseBody();
  const file = body.file;
  if (!(file instanceof File)) return c.json({ error: "file is required" }, 400);

  try {
    const cid = await uploadToPinata(file);
    return c.json({ cid, url: `/api/media/${cid}` }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pinata upload failed";
    const status = message === "PINATA_JWT is not configured" ? 503 : 502;
    return c.json({ error: message }, status);
  }
});

api.post("/metadata", async (c) => {
  const authenticatedPrivyId = await requirePrivyUserId(c);
  if (!authenticatedPrivyId) return authError(c);
  const body = await c.req.json<Record<string, unknown>>();
  try {
    const file = new File([JSON.stringify(body)], "matchday-metadata.json", {
      type: "application/json",
    });
    const cid = await uploadToPinata(file);
    return c.json({ cid, uri: `ipfs://${cid}` }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pinata upload failed";
    return c.json({ error: message }, message === "PINATA_JWT is not configured" ? 503 : 502);
  }
});

export default api;
