"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@/lib/router-compat";
import { useAppStore } from "@/store";
import { MOCK_MATCHES, type Match } from "@/data/mockData";

const VENUE_IMAGE = "/marketplace-stadium-hero.png";

type Venue = {
  id: string;
  name: string;
  location: string;
  distance: string;
  match: Match;
};

function VenueCard({ venue, compact, onOpen }: { venue: Venue; compact?: boolean; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`${compact ? "w-[72%]" : "w-full"} shrink-0 overflow-hidden rounded-[22px] border border-white/10 bg-[#191920] text-left shadow-[0_14px_28px_rgba(0,0,0,0.24)] active:scale-[0.98]`}
    >
      <div className={`${compact ? "h-28" : "h-44"} relative overflow-hidden bg-[#223a9a]`}>
        <img src={VENUE_IMAGE} alt="" className="h-full w-full object-cover object-[52%_69%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#16161d] via-transparent to-transparent" />
      </div>
      <div className="p-3.5">
        <p className="truncate text-[15px] font-extrabold text-white">{venue.name}</p>
        <p className="mt-1 truncate text-[12px] font-medium text-white/45">{venue.location}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[12px] font-bold text-lime">{venue.distance}</span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/70">{venue.match.status === "LIVE" ? "LIVE" : venue.match.time}</span>
        </div>
      </div>
    </button>
  );
}

export default function TrendingScreen({ initialMatches = [] }: { initialMatches?: Match[] }) {
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const setSuggestedCheckIn = useAppStore((s) => s.setSuggestedCheckIn);
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [liveOnly, setLiveOnly] = useState(false);

  useEffect(() => {
    void fetch("/api/sports/matches")
      .then((response) => (response.ok ? response.json() : { matches: [] }))
      .then((data) => setMatches(data.matches?.length ? data.matches : (initialMatches.length ? initialMatches : MOCK_MATCHES)))
      .catch(() => setMatches(MOCK_MATCHES));
  }, [initialMatches]);

  const venues = useMemo<Venue[]>(() => {
    const source = matches.length ? matches : MOCK_MATCHES;
    return source.map((match, index) => ({
      id: match.id,
      name: match.location,
      location: `${match.teamHome} vs ${match.teamAway}`,
      distance: index === 0 ? "1.2 km away" : `${index + 2}.4 km away`,
      match,
    }));
  }, [matches]);

  const filteredVenues = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return venues.filter((venue) => {
      const matchesSearch = !query || `${venue.name} ${venue.location}`.toLowerCase().includes(query);
      return matchesSearch && (!liveOnly || venue.match.status === "LIVE");
    });
  }, [liveOnly, searchQuery, venues]);

  const openVenue = (venue: Venue) => {
    setSuggestedCheckIn(`${venue.name} (${venue.match.teamHomeSymbol} vs ${venue.match.teamAwaySymbol})`);
    router.push("/snap");
  };

  return (
    <div className="min-h-full bg-[#08080f] px-5 pb-7 pt-5 text-white">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Back to home" onClick={() => router.push("/marketplace")} className="flex h-10 w-8 items-center justify-center text-white active:scale-95">
            <span className="material-symbols-outlined text-[26px]">arrow_back</span>
          </button>
          <h1 className="text-[25px] font-extrabold tracking-[-0.04em]">Explore</h1>
        </div>
        <button type="button" onClick={() => setLiveOnly((active) => !active)} className={`flex h-10 items-center gap-1.5 rounded-full px-3 text-[12px] font-bold ${liveOnly ? "bg-lime text-[#08080f]" : "bg-white/10 text-lime"}`}>
          <span className="material-symbols-outlined text-[17px]">location_on</span>
          Nearby
        </button>
      </header>

      <div className="mt-5 flex h-14 items-center gap-3 rounded-[18px] bg-[#1d1d22] px-4">
        <span className="material-symbols-outlined text-[24px] text-white/60">search</span>
        <input
          type="search"
          aria-label="Search venues or clubs"
          placeholder="Search venue or club"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-white outline-none placeholder:text-white/40"
        />
        <button type="button" onClick={() => setLiveOnly((active) => !active)} className={`rounded-full px-3 py-2 text-[11px] font-extrabold ${liveOnly ? "bg-lime text-[#08080f]" : "bg-white text-[#121218]"}`}>
          Venues
        </button>
      </div>

      <section className="mt-8">
        <h2 className="text-[19px] font-extrabold tracking-[-0.03em]">Featured venues</h2>
        <div className="-mx-5 mt-4 flex gap-3 overflow-x-auto px-5 pb-1 no-scrollbar">
          {venues.slice(0, 2).map((venue) => <VenueCard key={venue.id} venue={venue} compact onOpen={() => openVenue(venue)} />)}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[19px] font-extrabold tracking-[-0.03em]">Venues near you</h2>
          <span className="text-[12px] font-semibold text-white/45">{filteredVenues.length} found</span>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {filteredVenues.map((venue) => <VenueCard key={venue.id} venue={venue} onOpen={() => openVenue(venue)} />)}
          {!filteredVenues.length && (
            <div className="rounded-[22px] border border-dashed border-white/15 bg-[#14141b] px-5 py-10 text-center">
              <p className="text-[15px] font-bold text-white">No venues match that search.</p>
              <button type="button" onClick={() => setSearchQuery("")} className="mt-3 text-[13px] font-bold text-lime">Clear search</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
