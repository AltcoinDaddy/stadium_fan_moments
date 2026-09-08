import type { StateCreator } from "zustand";
import type { AppStore, Moment } from "../types";
import { playSound } from "../utils";
import { authenticatedFetch } from "@/lib/authenticatedFetch";

export interface BuySlice {
  isBuying: boolean;
  buyStatus: string;
  buySuccess: boolean;
  setBuySuccess: (success: boolean) => void;
  handleBuyNFT: (moment: Moment, purchaseOnChain: (moment: Moment) => Promise<string>) => Promise<void>;
}

export const createBuySlice: StateCreator<AppStore, [], [], BuySlice> = (
  set,
  get
) => ({
  isBuying: false,
  buyStatus: "",
  buySuccess: false,
  setBuySuccess: (buySuccess) => set({ buySuccess }),

  handleBuyNFT: async (moment, purchaseOnChain) => {
    set({
      isBuying: true,
      buyStatus: "Waiting for wallet signature...",
    });

    const state = get();
    if (!state.privyUserId) {
      set({ isBuying: false, buyStatus: "Sign in to complete this purchase." });
      return;
    }

    try {
      const txnHash = await purchaseOnChain(moment);
      set({ buyStatus: "On-chain purchase confirmed. Updating collection..." });
      const response = await authenticatedFetch(`/api/moments/${moment.id}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txnHash }),
      });
      if (!response.ok) throw new Error("Purchase could not be saved");

      const data = (await response.json()) as { moment: Moment };
      set({ isBuying: false, buySuccess: true });
      get().setPersistedMoment(data.moment);
      await Promise.all([
        get().hydrateMarketplace(),
        get().hydrateUserMoments(`user_${state.privyUserId}`),
      ]);
      playSound("success");
    } catch {
      set({ isBuying: false, buyStatus: "Purchase could not be saved. Please try again." });
    }
  },
});
