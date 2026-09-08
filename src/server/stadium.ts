import { createHash, createHmac, timingSafeEqual } from "crypto";

export const stadiums = [
  { id: "emirates", name: "Emirates Stadium", latitude: 51.554888, longitude: -0.108438, radiusMeters: 750 },
  { id: "etihad", name: "Etihad Stadium", latitude: 53.483138, longitude: -2.200394, radiusMeters: 750 },
  { id: "parc-des-princes", name: "Parc des Princes", latitude: 48.841389, longitude: 2.253056, radiusMeters: 750 },
  { id: "san-siro", name: "San Siro", latitude: 45.478056, longitude: 9.124, radiusMeters: 900 },
] as const;

type CheckinPayload = { userId: string; venueId: string; nonce: string; expiresAt: number };

function distanceInMeters(latitude: number, longitude: number, stadium: (typeof stadiums)[number]) {
  const radians = Math.PI / 180;
  const dLat = (stadium.latitude - latitude) * radians;
  const dLng = (stadium.longitude - longitude) * radians;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(latitude * radians) * Math.cos(stadium.latitude * radians) * Math.sin(dLng / 2) ** 2;
  return 6_371_000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findStadiumCheckin(latitude: number, longitude: number) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  const nearest = stadiums
    .map((stadium) => ({ stadium, distance: distanceInMeters(latitude, longitude, stadium) }))
    .sort((a, b) => a.distance - b.distance)[0];
  return nearest && nearest.distance <= nearest.stadium.radiusMeters ? nearest : null;
}

function signingSecret() {
  const secret = process.env.PRIVY_APP_SECRET;
  if (!secret) throw new Error("Stadium verification is not configured");
  return secret;
}

function encode(payload: CheckinPayload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", signingSecret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

export function createCheckinToken(payload: CheckinPayload) {
  const token = encode(payload);
  return { token, tokenHash: createHash("sha256").update(token).digest("hex") };
}

export function verifyCheckinToken(token: string, userId: string) {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = createHmac("sha256", signingSecret()).update(encoded).digest("base64url");
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as CheckinPayload;
    if (payload.userId !== userId || payload.expiresAt <= Date.now()) return null;
    return { payload, tokenHash: createHash("sha256").update(token).digest("hex") };
  } catch {
    return null;
  }
}

export async function getVenueMatch(venueName: string) {
  try {
    const date = new Date().toISOString().slice(0, 10);
    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/123/eventsday.php?d=${date}&s=Soccer`,
      { signal: AbortSignal.timeout(5000) }
    );
    const data = (await response.json()) as { events?: Array<Record<string, string | null>> };
    const event = data.events?.find((item) =>
      item.strVenue?.toLowerCase().includes(venueName.toLowerCase())
    );
    if (!event) return null;
    return {
      match: `${event.strHomeTeam || "Home"} vs ${event.strAwayTeam || "Away"}`,
      minute: event.strStatus || event.strTimeLocal || "Live",
    };
  } catch {
    return null;
  }
}
