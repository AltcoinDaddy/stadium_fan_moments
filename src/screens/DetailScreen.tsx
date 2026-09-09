"use client";

import { useRouter, useSearchParams } from "@/lib/router-compat";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store";
import type { Moment } from "@/data/mockData";
import { playSound } from "@/store/utils";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { categoryIcon, categoryPastel } from "@/lib/ui";

export default function DetailScreen({
  requestedMomentId: routeMomentId,
  initialMomentPromise,
}: {
  requestedMomentId?: string;
  initialMomentPromise?: Promise<{ moment: Moment } | null>;
}) {
  const selectedMoment = useAppStore((s) => s.selectedMoment);
  const setSelectedMoment = useAppStore((s) => s.setSelectedMoment);
  const setBuySuccess = useAppStore((s) => s.setBuySuccess);
  const userWallet = useAppStore((s) => s.userWallet);
  const isBuying = useAppStore((s) => s.isBuying);
  const buyStatus = useAppStore((s) => s.buyStatus);
  const buySuccess = useAppStore((s) => s.buySuccess);
  const handleBuyNFT = useAppStore((s) => s.handleBuyNFT);
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedMomentId = routeMomentId ?? searchParams.get("id");
  const [isManagingListing, setIsManagingListing] = useState(false);
  const [listingStatus, setListingStatus] = useState("");
  const [isLoadingMoment, setIsLoadingMoment] = useState(Boolean(requestedMomentId));

  useEffect(() => {
    let cancelled = false;

    const loadMoment = async () => {
      if (!requestedMomentId) {
        if (!selectedMoment) router.replace("/marketplace");
        setIsLoadingMoment(false);
        return;
      }
      if (selectedMoment?.id === requestedMomentId) {
        setIsLoadingMoment(false);
        return;
      }

      setIsLoadingMoment(true);
      try {
        if (initialMomentPromise) {
          const initial = await initialMomentPromise;
          if (initial?.moment && !cancelled) {
            setSelectedMoment(initial.moment);
            return;
          }
        }
        const response = await fetch(`/api/moments/${encodeURIComponent(requestedMomentId)}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Moment not found");
        const data = (await response.json()) as { moment: NonNullable<typeof selectedMoment> };
        if (!cancelled) setSelectedMoment(data.moment);
      } catch {
        if (!cancelled) router.replace("/marketplace");
      } finally {
        if (!cancelled) setIsLoadingMoment(false);
      }
    };

    void loadMoment();
    return () => {
      cancelled = true;
    };
  }, [initialMomentPromise, requestedMomentId, router, selectedMoment, setSelectedMoment]);

  if (!selectedMoment) {
    return isLoadingMoment ? (
      <div className="relative min-h-[100dvh]">
        <LoadingOverlay title="Loading Moment" status="Fetching collectible..." />
      </div>
    ) : null;
  }

  const purchaseOnChain = async () => `local-${Date.now().toString(16)}`;

  const handleListingAction = async () => {
    const shouldList = !selectedMoment.isListed;
    let price = selectedMoment.price;

    if (shouldList) {
      const input = window.prompt("Set resale price in whole CHZ", String(selectedMoment.price));
      if (input === null) return;
      price = Number(input);
      if (!Number.isInteger(price) || price < 1) {
        window.alert("Enter a whole-number resale price of at least 1 CHZ.");
        return;
      }
    }

    setIsManagingListing(true);
    try {
      const updatedMoment = { ...selectedMoment, isListed: shouldList, price };
      useAppStore.getState().setPersistedMoment(updatedMoment);
      setSelectedMoment(updatedMoment);
      setListingStatus(shouldList ? "Moment listed locally." : "Moment delisted locally.");
      playSound("success");
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "The listing transaction was not completed.";
      setListingStatus(message);
      window.alert(message);
    } finally {
      setIsManagingListing(false);
    }
  };

  const isOwner =
    userWallet.address.startsWith("0x") &&
    selectedMoment.owner.address.toLowerCase() === userWallet.address.toLowerCase();
  const canManageListing = isOwner && Boolean(selectedMoment.tokenId);

  return (
    <div className="relative flex min-h-full flex-col bg-background">
      <header className="flex items-center justify-between px-5 pt-5">
        <button
          onClick={() => {
            router.back();
            setBuySuccess(false);
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-ink active:scale-90"
        >
          <span className="material-symbols-outlined text-[22px]">chevron_left</span>
        </button>
        <h1 className="text-[15px] font-semibold text-ink">Event details</h1>
        <button
          onClick={() => playSound("click")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-ink active:scale-90"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>
      </header>

      <div className="mt-6 px-5">
        <div
          className="relative rounded-[32px] px-5 pb-8 pt-8"
          style={{ backgroundColor: categoryPastel(selectedMoment.category) }}
        >
          <button
            type="button"
            className="absolute right-4 top-4 text-ink/40"
            onClick={() => playSound("click")}
          >
            <span className="material-symbols-outlined">more_vert</span>
          </button>
          <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full bg-white/80">
            {selectedMoment.imageUrl ? (
              <img src={selectedMoment.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-[28px] text-ink">
                {categoryIcon(selectedMoment.category)}
              </span>
            )}
          </div>
          <h2 className="mt-5 text-center text-[26px] font-extrabold leading-tight tracking-[-0.03em] text-ink">
            {selectedMoment.title}
          </h2>
          <p className="mt-2 text-center text-[13px] font-medium text-ink/55">
            Created {new Date(selectedMoment.timestamp).toLocaleDateString()}
          </p>
        </div>

        <div className="relative z-10 -mt-5 rounded-[24px] bg-sky px-4 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedMoment.owner.avatar}
                alt="Owner avatar"
                className="h-10 w-10 rounded-full object-cover"
              />
              <p className="text-[15px] font-bold text-ink">
                {isOwner ? "You" : selectedMoment.owner.username}
              </p>
            </div>
            <span className="flex items-center gap-1 text-[15px] font-bold text-ink">
              {selectedMoment.price}x
              <span className="material-symbols-outlined text-[16px]">sports_soccer</span>
            </span>
          </div>
        </div>
      </div>

      <section className="mt-7 px-5 pb-32">
        <p className="text-[12px] font-semibold tracking-[0.08em] text-muted">GROUP TOKENS</p>
        <div className="mt-3 flex flex-col">
          {[
            { name: selectedMoment.creator.username, role: "Creator", icon: categoryIcon(selectedMoment.category), color: categoryPastel(selectedMoment.category) },
            { name: selectedMoment.owner.username, role: "Owner", icon: "person", color: "#CDE4F4" },
          ].map((row) => (
            <div key={row.role} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: row.color }}
                >
                  <span className="material-symbols-outlined text-[20px] text-ink">{row.icon}</span>
                </div>
                <p className="text-[15px] font-semibold text-ink">{row.name}</p>
              </div>
              <span className="material-symbols-outlined text-ink/30">more_vert</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[14px] leading-relaxed text-muted">{selectedMoment.description}</p>
      </section>

      <div className="sticky bottom-0 z-40 mt-auto flex items-center justify-between gap-4 bg-background px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div>
          <p className="text-[12px] text-muted">Trading value</p>
          <p className="text-[22px] font-extrabold leading-none text-ink">
            {selectedMoment.price}
            <span className="ml-1 text-[13px] font-semibold text-muted">{selectedMoment.tokenSymbol}</span>
          </p>
        </div>

        {canManageListing ? (
          <button
            onClick={() => void handleListingAction()}
            disabled={isManagingListing}
            className="flex h-12 items-center justify-center rounded-full bg-ink px-6 text-[14px] font-bold text-white disabled:opacity-50"
          >
            {isManagingListing
              ? "Updating..."
              : selectedMoment.isListed
              ? "Delist moment"
              : "List for resale"}
          </button>
        ) : isOwner ? (
          <div className="flex h-12 items-center justify-center rounded-full bg-mint px-6 text-[14px] font-bold text-ink">
            You own this
          </div>
        ) : buySuccess ? (
          <div className="flex h-12 items-center justify-center rounded-full bg-lime px-6 text-[14px] font-bold text-ink">
            Purchased
          </div>
        ) : (
          <button
            onClick={() => void handleBuyNFT(selectedMoment, purchaseOnChain)}
            disabled={isBuying}
            className="flex h-12 items-center justify-center rounded-full bg-lime px-8 text-[14px] font-bold text-ink disabled:opacity-50"
          >
            {isBuying ? "Buying..." : "Buy moment"}
          </button>
        )}
      </div>

      {isBuying && <LoadingOverlay title="Processing Exchange" status={buyStatus} />}
      {isManagingListing && <LoadingOverlay title="Managing Listing" status={listingStatus} />}
    </div>
  );
}
