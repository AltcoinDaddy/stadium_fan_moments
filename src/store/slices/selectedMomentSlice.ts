import type { StateCreator } from "zustand";
import type { AppStore, Moment } from "../types";

export interface SelectedMomentSlice {
  selectedMoment: Moment | null;
  setSelectedMoment: (moment: Moment | null) => void;
}

export const createSelectedMomentSlice: StateCreator<
  AppStore,
  [],
  [],
  SelectedMomentSlice
> = (set) => ({
  selectedMoment: null,
  setSelectedMoment: (selectedMoment) => set({ selectedMoment }),
});
