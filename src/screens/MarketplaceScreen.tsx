"use client";

import { useMemo } from "react";
import { useAppStore } from "@/store";
import MomentCard from "@/components/MomentCard";

export default function MarketplaceScreen() {
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const selectedClubFilter = useAppStore((s) => s.selectedClubFilter);
  const setSelectedClubFilter = useAppStore((s) => s.setSelectedClubFilter);
  const marketTab = useAppStore((s) => s.marketTab);
  const setMarketTab = useAppStore((s) => s.setMarketTab);
  const moments = useAppStore((s) => s.moments);

  const filteredMoments = useMemo(
    () =>
      moments.filter((m) => {
        if (
          selectedClubFilter !== "ALL" &&
          m.tokenSymbol !== selectedClubFilter
        )
          return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            m.title.toLowerCase().includes(q) ||
            m.match.toLowerCase().includes(q) ||
            m.location.toLowerCase().includes(q)
          );
        }
        if (marketTab === "TRENDING")
          return m.rarity === "EPIC" || m.rarity === "LEGENDARY";
        if (marketTab === "LIVE") return m.category === "GOAL";
        return true;
      }),
    [moments, selectedClubFilter, searchQuery, marketTab]
  );


  return (
    <div className="p-4 flex flex-col gap-4 animate-fade">
      <div className="flex gap-2 w-full">
        <div className="flex-1 bg-[#1d2023] border border-white/10 rounded-full h-11 flex items-center px-4 gap-2.5 focus-within:border-[#00eefc]/50 transition-colors">
          <span className="material-symbols-outlined text-[#c2c7d0] text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search moments, matches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-[#c2c7d0] border-none outline-none w-full"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 py-1 select-none">
        {["ALL", "BAR", "PSG", "ACM", "CITY"].map((club) => (
          <button
            key={club}
            onClick={() => setSelectedClubFilter(club)}
            className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 ${
              selectedClubFilter === club
                ? "bg-[#00eefc]/10 border-[#00eefc] text-[#00eefc] shadow-[0_0_10px_rgba(0,238,252,0.15)]"
                : "bg-[#1d2023] border-white/10 text-[#c2c7d0] hover:border-white/30"
            }`}
          >
            {club === "ALL" ? "All Clubs" : club}
          </button>
        ))}
      </div>

      <div className="flex border-b border-white/10 pb-1 mt-1">
        {(["FOR_YOU", "TRENDING", "LIVE"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMarketTab(tab)}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest text-center transition-colors relative ${
              marketTab === tab ? "text-[#ffb4a8]" : "text-[#c2c7d0] hover:text-white"
            }`}
          >
            {tab.replace("_", " ")}
            {marketTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ffb4a8] rounded-full"></div>
            )}
            {tab === "LIVE" && (
              <span className="w-1.5 h-1.5 bg-[#ff5540] rounded-full absolute top-0 right-8 animate-ping"></span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-8">
        {filteredMoments.length > 0 ? (
          filteredMoments.map((moment) => (
            <MomentCard key={moment.id} moment={moment} />
          ))
        ) : (
          <div className="col-span-full text-center py-16 flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-4xl text-[#c2c7d0]">
              search_off
            </span>
            <p className="text-sm text-[#c2c7d0] font-semibold uppercase tracking-wider">
              No moments found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
