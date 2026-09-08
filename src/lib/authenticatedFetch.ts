"use client";

import { getAccessToken } from "@privy-io/react-auth";

export async function authenticatedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("Sign in to continue.");

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  return fetch(input, { ...init, headers });
}
