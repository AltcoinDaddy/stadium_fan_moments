import type { StateCreator } from "zustand";
import type { AppStore } from "../types";

const defaultUserWallet = {
  username: "Fan",
  avatar: "/globe.svg",
  address: "Not connected",
  chzBalance: 0,
  ftBalances: {} as Record<string, number>,
};

export interface UserSlice {
  userWallet: typeof defaultUserWallet;
  privyUserId: string | null;
  setAuthenticatedUser: (profile: {
    privyUserId?: string;
    username?: string;
    avatar?: string;
    address?: string;
  }) => void;
  clearAuthenticatedUser: () => void;
  setChzBalance: (balance: number) => void;
}

export const createUserSlice: StateCreator<AppStore, [], [], UserSlice> = (
  set
) => ({
  userWallet: defaultUserWallet,
  privyUserId: null,

  setAuthenticatedUser: (profile) =>
    set((state) => ({
      userWallet: {
        ...state.userWallet,
        username: profile.username || state.userWallet.username,
        avatar: profile.avatar || state.userWallet.avatar,
        address: profile.address || state.userWallet.address,
      },
      privyUserId: profile.privyUserId || state.privyUserId,
    })),
  clearAuthenticatedUser: () =>
    set({
      userWallet: { ...defaultUserWallet, ftBalances: {} },
      privyUserId: null,
    }),
  setChzBalance: (balance) =>
    set((state) => ({
      userWallet: { ...state.userWallet, chzBalance: balance },
    })),
});
