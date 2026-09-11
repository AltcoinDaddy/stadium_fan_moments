"use client";

import { useMemo } from "react";
import { useRouter } from "@/lib/router-compat";
import { useAppStore } from "@/store";
import { MOCK_MATCHES, type Match, type Moment } from "@/data/mockData";
import ExploreMomentCard from "@/components/ExploreMomentCard";

const HERO_IMAGE = "/marketplace-stadium-hero.png";

const shortcuts = [
  { label: "Captures", icon: "photo_camera", route: "/profile" },
  { label: "Explore", icon: "explore", route: "/trending" },
  { label: "Stadiums", icon: "stadium", route: "/trending" },
  { label: "Live now", icon: "sensors", route: "/snap" },
  { label: "My club", icon: "shield", route: "/profile" },
] as const;

function MatchTile({ match, onOpen }: { match: Match; onOpen: () => void }) {
  const live = match.status === "LIVE";

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-[80%] shrink-0 overflow-hidden rounded-[22px] border border-white/10 bg-[#181820] text-left shadow-[0_16px_30px_rgba(0,0,0,0.28)] transition-transform active:scale-[0.98]"
    >
      <div className="relative h-32 overflow-hidden bg-[#253ba2]">
        <img src={match.stadiumImageUrl || HERO_IMAGE} alt="" className="h-full w-full object-cover object-[55%_70%] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121219] via-transparent to-transparent" />
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${live ? "bg-lime text-[#08080f]" : "bg-white/15 text-white"}`}>
          {live ? `${match.time} LIVE` : "UPCOMING"}
        </span>
      </div>
      <div className="px-3.5 pb-4 pt-3">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-[15px] font-extrabold text-white">
            {match.teamHome} vs {match.teamAway}
          </p>
          <span className="shrink-0 text-[13px] font-bold text-lime">{match.scoreHome}-{match.scoreAway}</span>
        </div>
        <p className="mt-1 text-[12px] font-medium text-white/45">{match.location}</p>
      </div>
    </button>
  );
}

export default function MarketplaceScreen({ initialMoments = [] }: { initialMoments?: Moment[] }) {
  const moments = useAppStore((s) => s.moments);
  const userWallet = useAppStore((s) => s.userWallet);
  const setSuggestedCheckIn = useAppStore((s) => s.setSuggestedCheckIn);
  const setSelectedMoment = useAppStore((s) => s.setSelectedMoment);
  const router = useRouter();

  const matches = useMemo(() => {
    const listedCount = (moments.length ? moments : initialMoments).filter((moment) => moment.isListed).length;
    return listedCount ? MOCK_MATCHES : MOCK_MATCHES.slice(0, 2);
  }, [initialMoments, moments]);

  const openMatch = (match: Match) => {
    setSuggestedCheckIn(`${match.location} (${match.teamHomeSymbol} vs ${match.teamAwaySymbol})`);
    router.push("/snap");
  };

  const openMoment = (moment: Moment) => {
    setSelectedMoment(moment);
    router.push(`/detail?id=${encodeURIComponent(moment.id)}`);
  };

  return (
    <div className="min-h-full bg-[#08080f] pb-8 text-white">
      <section className="relative min-h-[330px] overflow-hidden rounded-b-[32px] bg-[#1732a6]">
        <img src={HERO_IMAGE} alt="Fans capturing a live football goal" className="absolute inset-0 h-full w-full object-cover object-[54%_64%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071163]/45 via-transparent to-[#08080f]" />

        <header className="relative z-10 flex items-start justify-between px-5 pt-6">
          <div>
            <p className="text-[14px] font-semibold text-white/85">Good matchday,</p>
            <p className="mt-0.5 text-[25px] font-extrabold tracking-[-0.04em] text-white">
              {userWallet.username || "Fan"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Open profile"
            onClick={() => router.push("/profile")}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/35 bg-white/10 shadow-sm backdrop-blur-md"
          >
            <img src={userWallet.avatar} alt="" className="h-full w-full object-cover" />
          </button>
        </header>

        <button
          type="button"
          onClick={() => router.push("/trending")}
          className="absolute left-5 right-5 top-[235px] z-10 flex h-14 items-center gap-3 rounded-[18px] border border-white/10 bg-[#202025]/95 px-4 text-left shadow-[0_14px_35px_rgba(0,0,0,0.35)] backdrop-blur-md active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-[24px] text-white/70">search</span>
          <span className="text-[15px] font-semibold text-white/45">Find a match, club, or stadium</span>
        </button>
      </section>

      <div className="px-5">
        <div className="mt-7 grid grid-cols-5 gap-2">
          {shortcuts.map((shortcut) => (
            <button
              key={shortcut.label}
              type="button"
              onClick={() => router.push(shortcut.route)}
              className="flex min-w-0 flex-col items-center gap-2 rounded-2xl py-1 active:scale-95"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#191922] text-lime shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
                <span className="material-symbols-outlined text-[23px]">{shortcut.icon}</span>
              </span>
              <span className="truncate text-[10px] font-semibold text-white/60">{shortcut.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h1 className="text-[20px] font-extrabold tracking-[-0.03em] text-white">Your next match</h1>
          <button type="button" onClick={() => router.push("/trending")} className="text-[13px] font-bold text-lime">
            See all
          </button>
        </div>

        <div className="-mx-5 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 no-scrollbar">
          {matches.map((match) => (
            <MatchTile key={match.id} match={match} onOpen={() => openMatch(match)} />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-white">Live fan moments</h2>
            <p className="mt-1 text-[13px] font-medium text-white/45">Fresh captures from the stands.</p>
          </div>
          <button
            type="button"
            aria-label="Open camera"
            onClick={() => router.push("/snap")}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-lime text-[#08080f] shadow-[0_10px_24px_rgba(186,255,39,0.18)] active:scale-95"
          >
            <span className="material-symbols-outlined text-[22px]">photo_camera</span>
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3 pb-8">
          {(moments.length ? moments : initialMoments).map((moment) => (
            <ExploreMomentCard key={moment.id} moment={moment} onOpen={() => openMoment(moment)} />
          ))}
        </div>
      </div>
    </div>
  );
}
