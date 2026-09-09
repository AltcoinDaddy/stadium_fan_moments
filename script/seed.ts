import "dotenv/config";
import { getDb } from "../src/server/db";
import { users, moments } from "../src/server/db/schema";
import { MOCK_USER, MOCK_MOMENTS, MOCK_MY_CAPTURES } from "../src/data/mockData";
import { randomUUID } from "crypto";

async function main() {
  const db = getDb();
  
  console.log("Seeding database...");

  // Collect all unique users from mock data
  type SeedUser = {
    id: string;
    privyId: string;
    username: string;
    avatar: string;
    address?: string;
    walletAddress?: string;
  };
  const uniqueUsersMap = new Map<string, SeedUser>();
  
  const addUser = (u: Omit<SeedUser, "id" | "privyId">) => {
    if (!uniqueUsersMap.has(u.username)) {
      uniqueUsersMap.set(u.username, {
        id: randomUUID(),
        privyId: `privy_${randomUUID()}`,
        username: u.username,
        avatar: u.avatar,
        walletAddress: u.address || u.walletAddress,
      });
    }
  };

  addUser(MOCK_USER);

  [...MOCK_MOMENTS, ...MOCK_MY_CAPTURES].forEach((moment) => {
    if (moment.creator) addUser(moment.creator);
    if (moment.owner) addUser(moment.owner);
  });

  const insertedUsers = Array.from(uniqueUsersMap.values());

  for (const u of insertedUsers) {
    try {
      await db.insert(users).values(u).onConflictDoNothing({ target: users.privyId });
      console.log(`Inserted user: ${u.username}`);
    } catch (error) {
      console.error(`Failed to insert user ${u.username}`, error);
    }
  }

  const allMoments = [...MOCK_MOMENTS, ...MOCK_MY_CAPTURES];
  
  for (const m of allMoments) {
    try {
      const creator = insertedUsers.find((u) => u.username === m.creator?.username);
      const owner = insertedUsers.find((u) => u.username === m.owner?.username);

      if (!creator || !owner) {
        console.warn(`Skipping moment ${m.id} due to missing user`);
        continue;
      }

      await db.insert(moments).values({
        id: m.id,
        userId: creator.id,
        ownerId: owner.id,
        title: m.title,
        description: m.description,
        mediaUrl: m.imageUrl,
        mediaType: m.mediaType || "image",
        category: m.category,
        rarity: m.rarity,
        price: m.price,
        tokenSymbol: m.tokenSymbol,
        match: m.match,
        minute: m.minute,
        location: m.location,
        tokenId: m.tokenId,
        txnHash: m.txnHash,
        serial: m.serial,
        maxSerial: m.maxSerial,
        likes: m.likes,
        views: m.views,
        isListed: m.isListed ? 1 : 0,
      }).onConflictDoNothing({ target: moments.id });
      
      console.log(`Inserted moment: ${m.title}`);
    } catch (error) {
      console.error(`Failed to insert moment ${m.id}`, error);
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
