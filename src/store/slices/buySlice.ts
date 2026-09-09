import type { StateCreator } from "zustand";
import type { AppStore, Moment } from "../types";
import { playSound } from "../utils";

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
      buyStatus: "Confirming your local collection...",
    });

    try {
      const txnHash = await purchaseOnChain(moment);
      const user = get().userWallet;
      const purchased = {
        ...moment,
        txnHash,
        isListed: false,
        owner: { username: user.username, avatar: user.avatar, address: user.address },
      };
      set({ isBuying: false, buySuccess: true });
      get().setPersistedMoment(purchased);
      set((state) => ({
        collectedMoments: [purchased, ...state.collectedMoments.filter((item) => item.id !== purchased.id)],
      }));
      playSound("success");
    } catch {
      set({ isBuying: false, buyStatus: "Purchase could not be saved. Please try again." });
    }
  },
});
