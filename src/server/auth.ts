import type { Context } from "hono";
import { PrivyClient } from "@privy-io/node";

let client: PrivyClient | undefined;
export async function requirePrivyUserId(c: Context) {
  const token = c.req.header("Authorization")?.replace(/^Bearer\s+/, "");
  if (!token || !process.env.NEXT_PUBLIC_PRIVY_APP_ID || !process.env.PRIVY_APP_SECRET) return null;
  try {
    client ??= new PrivyClient({ appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID, appSecret: process.env.PRIVY_APP_SECRET });
    return (await client.utils().auth().verifyAccessToken(token)).user_id;
  } catch { return null; }
}

export function authConfigurationError() {
  return !process.env.NEXT_PUBLIC_PRIVY_APP_ID || !process.env.PRIVY_APP_SECRET;
}
