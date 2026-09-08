"use client";

import { PrivyProvider, usePrivy, useWallets } from "@privy-io/react-auth";
import { ReactNode } from "react";
import { useEffect } from "react";
import { useAppStore } from "@/store";
import { chilizSpicy, getChzBalance } from "@/lib/chiliz";
import { authenticatedFetch } from "@/lib/authenticatedFetch";

function PrivySessionSync() {
  const { authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const setAuthenticatedUser = useAppStore((state) => state.setAuthenticatedUser);
  const hydrateMarketplace = useAppStore((state) => state.hydrateMarketplace);
  const hydrateUserMoments = useAppStore((state) => state.hydrateUserMoments);
  const setChzBalance = useAppStore((state) => state.setChzBalance);

  useEffect(() => {
    if (!authenticated || !user) return;

    const email = user.email?.address;
    // Prefer a connected external wallet when one is present. It is the wallet
    // the user controls and the one used for CHZ balances and transactions.
    const activeWallet =
      wallets.find((wallet) => wallet.walletClientType !== "privy") ||
      wallets.find((wallet) => wallet.walletClientType === "privy");
    const walletAddress = activeWallet?.address || user.wallet?.address;
    const username = email?.split("@")[0] || walletAddress?.slice(0, 10);

    setAuthenticatedUser({
      privyUserId: user.id,
      username,
      address: walletAddress,
    });

    if (walletAddress?.startsWith("0x")) {
      void getChzBalance(walletAddress as `0x${string}`)
        .then(setChzBalance)
        .catch(() => {
          // The UI remains usable if the public testnet RPC is temporarily unavailable.
        });
    }

    void (async () => {
      try {
        const response = await authenticatedFetch("/api/users/upsert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            privyId: user.id,
            email,
            username,
            walletAddress,
          }),
        });
        if (!response.ok) return;

        await Promise.all([
          hydrateMarketplace(),
          hydrateUserMoments(`user_${user.id}`),
        ]);
      } catch {
        // Keep the local session usable when the database is not configured yet.
      }
    })();
  }, [authenticated, hydrateMarketplace, hydrateUserMoments, setAuthenticatedUser, setChzBalance, user, wallets]);

  return null;
}

function MarketplaceSync() {
  const hydrateMarketplace = useAppStore((state) => state.hydrateMarketplace);

  useEffect(() => {
    void hydrateMarketplace();
  }, [hydrateMarketplace]);

  return null;
}

export default function PrivyProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["email", "wallet"],
        supportedChains: [chilizSpicy],
        defaultChain: chilizSpicy,
        appearance: {
          theme: "dark",
          accentColor: "#ff5540",
          logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBp67mGs7ImnLNJD0V0Ci05zU2cTmKt2NfS7-7udAD1i5tO3WjJ-mWTDNbsvMKXWCpoFUUw0F6_aLSiAbub-95mqjr8lzJJXsofsEprLtF3_zibHLYJJ8Z2yZrOk3rAXMF7-b672eJkEtXVtoFIPFXYJ_1FMR5n_Z4aO2q_QpDqbz_nRC-3VM6iPK7j6N5qIbHEdzOVFbGo9PuB2_Ud2xsmM4Pkq2bGp43XOQhxqMQxqBw2cws8XoDL30LfwlSfor33gxLLhszE190",
          showWalletLoginFirst: false,
          walletChainType: "ethereum-only",
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      <MarketplaceSync />
      <PrivySessionSync />
      {children}
    </PrivyProvider>
  );
}
