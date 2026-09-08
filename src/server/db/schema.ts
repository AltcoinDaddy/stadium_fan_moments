import {
  integer,
  pgTable,
  text,
  timestamp,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  privyId: text("privy_id").notNull().unique(),
  email: text("email"),
  username: text("username").notNull(),
  avatar: text("avatar"),
  walletAddress: text("wallet_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const moments = pgTable("moments", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  ownerId: text("owner_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  mediaUrl: text("media_url").notNull(),
  mediaType: text("media_type").notNull().default("image"),
  metadataUrl: text("metadata_url"),
  category: text("category").notNull(),
  rarity: text("rarity").notNull(),
  price: integer("price").notNull(),
  tokenSymbol: text("token_symbol").notNull(),
  match: text("match").notNull(),
  minute: text("minute").notNull(),
  location: text("location").notNull(),
  tokenId: text("token_id"),
  txnHash: text("txn_hash"),
  serial: integer("serial").notNull().default(1),
  maxSerial: integer("max_serial").notNull().default(2500),
  likes: integer("likes").notNull().default(0),
  views: integer("views").notNull().default(0),
  isListed: integer("is_listed").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const stadiumCheckins = pgTable("stadium_checkins", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  venueId: text("venue_id").notNull(),
  venueName: text("venue_name").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
