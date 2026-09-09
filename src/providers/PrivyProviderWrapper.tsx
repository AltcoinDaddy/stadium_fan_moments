"use client";

import { PrivyProvider, usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, type ReactNode } from "react";
import { useAppStore } from "@/store";
import { chilizSpicy, getChzBalance } from "@/lib/chiliz";
import { authenticatedFetch } from "@/lib/authenticatedFetch";

function SessionSync() {
  const { authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const setAuthenticatedUser = useAppStore((state) => state.setAuthenticatedUser);
  const setChzBalance = useAppStore((state) => state.setChzBalance);

  useEffect(() => {
    if (!authenticated || !user) return;
    const wallet = wallets.find((item) => item.walletClientType !== "privy") || wallets.find((item) => item.walletClientType === "privy");
    const address = wallet?.address || user.wallet?.address;
    const email = user.email?.address;
    setAuthenticatedUser({ privyUserId: user.id, username: email?.split("@")[0] || address?.slice(0, 10), address });
    if (address?.startsWith("0x")) void getChzBalance(address as `0x${string}`).then(setChzBalance).catch(() => {});
    void authenticatedFetch("/api/users/upsert", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ privyId: user.id, email, username: email?.split("@")[0] || address?.slice(0, 10), walletAddress: address }) }).catch(() => {});
  }, [authenticated, user, wallets, setAuthenticatedUser, setChzBalance]);
  return null;
}

export default function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider appId={import.meta.env.VITE_PRIVY_APP_ID || ""} config={{ loginMethods: ["email", "wallet"], supportedChains: [chilizSpicy], defaultChain: chilizSpicy, embeddedWallets: { ethereum: { createOnLogin: "users-without-wallets" } } }}>
      <SessionSync />
      {children}
    </PrivyProvider>
  );
}
