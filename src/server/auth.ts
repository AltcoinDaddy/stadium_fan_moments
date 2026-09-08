import { PrivyClient } from "@privy-io/node";
import type { Context } from "hono";

let privyClient: PrivyClient | undefined;

function getPrivyClient() {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;
  if (!appId || !appSecret) {
    throw new Error("Privy server authentication is not configured");
  }
  if (!privyClient) privyClient = new PrivyClient({ appId, appSecret });
  return privyClient;
}

export async function requirePrivyUserId(c: Context) {
  const authorization = c.req.header("Authorization");
  const accessToken = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : undefined;
  if (!accessToken) return null;

  try {
    return (await getPrivyClient().utils().auth().verifyAccessToken(accessToken)).user_id;
  } catch {
    return null;
  }
}

export function authConfigurationError() {
  return !process.env.NEXT_PUBLIC_PRIVY_APP_ID || !process.env.PRIVY_APP_SECRET;
}
