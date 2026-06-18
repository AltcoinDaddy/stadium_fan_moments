import type { StateCreator } from "zustand";
import type { AppStore } from "../types";

export interface NavigationSlice {
  navigateTo: string | null;
  setNavigateTo: (url: string | null) => void;
}

export const createNavigationSlice: StateCreator<
  AppStore,
  [],
  [],
  NavigationSlice
> = (set) => ({
  navigateTo: null,
  setNavigateTo: (navigateTo) => set({ navigateTo }),
});
