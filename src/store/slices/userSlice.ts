import type { StateCreator } from "zustand";
import type { AppStore } from "../types";
import { MOCK_USER } from "@/data/mockData";
import { initAudio } from "../utils";

export interface UserSlice {
  userWallet: typeof MOCK_USER;
  isWalletGenerating: boolean;
  walletGenStatus: string;
  handleSocialLogin: () => void;
}

export const createUserSlice: StateCreator<AppStore, [], [], UserSlice> = (
  set
) => ({
  userWallet: MOCK_USER,
  isWalletGenerating: false,
  walletGenStatus: "",

  handleSocialLogin: () => {
    initAudio();
    set({
      isWalletGenerating: true,
      walletGenStatus: "Verifying OAuth credentials...",
    });

    setTimeout(() => {
      set({ walletGenStatus: "Securing MPC key shares..." });
      setTimeout(() => {
        set({
          walletGenStatus: "Deploying gasless relayer smart contract...",
        });
        setTimeout(() => {
          set({
            walletGenStatus: "Wallet generated! Address: 0x71C4B...8921df4",
          });
          setTimeout(() => {
            set({ isWalletGenerating: false, navigateTo: "/marketplace" });
          }, 1000);
        }, 1200);
      }, 1000);
    }, 800);
  },
});
