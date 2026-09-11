"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "@/lib/router-compat";
import { useAppStore } from "@/store";
import type { Moment } from "@/data/mockData";
import ExploreMomentCard from "@/components/ExploreMomentCard";

export default function TrendingScreen() {
  const moments = useAppStore((s) => s.moments);
  const hydrateMarketplace = useAppStore((s) => s.hydrateMarketplace);
  const setSelectedMoment = useAppStore((s) => s.setSelectedMoment);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const router = useRouter();

  useEffect(() => {
    void hydrateMarketplace();
  }, [hydrateMarketplace]);

  const filteredMoments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return moments.filter((moment) => {
      if (!query) return true;
      return (
        moment.title.toLowerCase().includes(query) ||
        moment.description.toLowerCase().includes(query) ||
        moment.category.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, moments]);

  const openMoment = (moment: Moment) => {
    setSelectedMoment(moment);
    router.push(`/detail?id=${encodeURIComponent(moment.id)}`);
  };

  return (
    <div className="min-h-[100dvh] bg-[#08080f] px-5 pb-7 pt-5 text-white">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Back to home"
            onClick={() => router.push("/marketplace")}
            className="flex h-10 w-8 items-center justify-center text-white active:scale-95"
          >
            <span className="material-symbols-outlined text-[26px]">arrow_back</span>
          </button>
          <h1 className="text-[25px] font-extrabold tracking-[-0.04em]">Explore</h1>
        </div>
      </header>

      <div className="mt-5 flex h-14 items-center gap-3 rounded-[18px] bg-[#1d1d22] px-4">
        <span className="material-symbols-outlined text-[24px] text-white/60">search</span>
        <input
          type="search"
          aria-label="Search moments"
          placeholder="Search moments or categories"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-white outline-none placeholder:text-white/40"
        />
      </div>

      <section className="mt-8">
        <h2 className="text-[19px] font-extrabold tracking-[-0.03em]">Trending moments</h2>
        <div className="-mx-5 mt-4 flex gap-3 overflow-x-auto px-5 pb-1 no-scrollbar">
          {filteredMoments.slice(0, 3).map((moment) => (
            <ExploreMomentCard key={moment.id} moment={moment} compact onOpen={() => openMoment(moment)} />
          ))}
          {filteredMoments.length === 0 && (
             <p className="text-[13px] text-white/40">No trending moments found.</p>
          )}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[19px] font-extrabold tracking-[-0.03em]">All captures</h2>
          <span className="text-[12px] font-semibold text-white/45">{filteredMoments.length} found</span>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {filteredMoments.map((moment) => (
            <ExploreMomentCard key={moment.id} moment={moment} onOpen={() => openMoment(moment)} />
          ))}
          {filteredMoments.length === 0 && (
            <div className="rounded-[22px] border border-dashed border-white/15 bg-[#14141b] px-5 py-10 text-center">
              <p className="text-[15px] font-bold text-white">No moments match that search.</p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-3 text-[13px] font-bold text-lime"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
