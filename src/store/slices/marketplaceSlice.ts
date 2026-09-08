import type { StateCreator } from "zustand";
import type { AppStore, MarketTabType, Moment } from "../types";

export interface MarketSlice {
  moments: Moment[];
  myCaptures: Moment[];
  collectedMoments: Moment[];
  selectedClubFilter: string;
  setSelectedClubFilter: (filter: string) => void;
  marketTab: MarketTabType;
  setMarketTab: (tab: MarketTabType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  hydrateMarketplace: () => Promise<void>;
  hydrateUserMoments: (userId: string) => Promise<void>;
  clearUserMoments: () => void;
  setPersistedMoment: (moment: Moment) => void;
}

export const createMarketSlice: StateCreator<AppStore, [], [], MarketSlice> = (
  set
) => ({
  moments: [],
  myCaptures: [],
  collectedMoments: [],
  selectedClubFilter: "ALL",
  setSelectedClubFilter: (selectedClubFilter) => set({ selectedClubFilter }),
  marketTab: "FOR_YOU",
  setMarketTab: (marketTab) => set({ marketTab }),
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  hydrateMarketplace: async () => {
    try {
      const response = await fetch("/api/moments?listed=true", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as { moments: Moment[] };
      set({ moments: data.moments });
    } catch {
      // Keep the current server-backed state if the request cannot complete.
    }
  },

  hydrateUserMoments: async (userId) => {
    try {
      const response = await fetch(`/api/users/${encodeURIComponent(userId)}/moments`, {
        cache: "no-store",
      });
      if (!response.ok) return;
      const data = (await response.json()) as {
        captures: Moment[];
        collection: Moment[];
      };
      set({ myCaptures: data.captures, collectedMoments: data.collection });
    } catch {
      // The profile keeps its current local state if the request cannot complete.
    }
  },

  clearUserMoments: () => set({ myCaptures: [], collectedMoments: [] }),

  setPersistedMoment: (moment) =>
    set((state) => {
      const replace = (items: Moment[]) =>
        items.some((item) => item.id === moment.id)
          ? items.map((item) => (item.id === moment.id ? moment : item))
          : [moment, ...items];

      return {
        moments: moment.isListed
          ? replace(state.moments)
          : state.moments.filter((item) => item.id !== moment.id),
        myCaptures: replace(state.myCaptures),
        collectedMoments: replace(state.collectedMoments),
        selectedMoment:
          state.selectedMoment?.id === moment.id
            ? moment
            : state.selectedMoment,
      };
    }),
});
