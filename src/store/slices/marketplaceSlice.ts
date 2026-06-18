import type { StateCreator } from "zustand";
import type { AppStore, MarketTabType, Moment } from "../types";
import { MOCK_MOMENTS, MOCK_MY_CAPTURES } from "@/data/mockData";

export interface MarketSlice {
  moments: Moment[];
  myCaptures: Moment[];
  selectedClubFilter: string;
  setSelectedClubFilter: (filter: string) => void;
  marketTab: MarketTabType;
  setMarketTab: (tab: MarketTabType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const createMarketSlice: StateCreator<AppStore, [], [], MarketSlice> = (
  set
) => ({
  moments: MOCK_MOMENTS,
  myCaptures: MOCK_MY_CAPTURES,
  selectedClubFilter: "ALL",
  setSelectedClubFilter: (selectedClubFilter) => set({ selectedClubFilter }),
  marketTab: "FOR_YOU",
  setMarketTab: (marketTab) => set({ marketTab }),
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
});
