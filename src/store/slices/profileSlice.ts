import type { StateCreator } from "zustand";
import type { AppStore, ProfileTabType } from "../types";

export interface ProfileSlice {
  profileTab: ProfileTabType;
  setProfileTab: (tab: ProfileTabType) => void;
}

export const createProfileSlice: StateCreator<
  AppStore,
  [],
  [],
  ProfileSlice
> = (set) => ({
  profileTab: "CAPTURES",
  setProfileTab: (profileTab) => set({ profileTab }),
});
