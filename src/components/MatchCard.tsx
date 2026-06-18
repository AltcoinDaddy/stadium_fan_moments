"use client";

import { useRouter } from "next/navigation";
import { Match } from "@/data/mockData";
import { useAppStore } from "@/store";

interface Props {
  match: Match;
}

export default function MatchCard({ match }: Props) {
  const setSuggestedCheckIn = useAppStore((s) => s.setSuggestedCheckIn);
  const router = useRouter();

  return (
    <div
      className="flex-none w-[280px] bg-[#161B22]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden group select-none cursor-pointer"
      onClick={() => {
        setSuggestedCheckIn(
          `${match.location} (${match.teamHomeSymbol} vs ${match.teamAwaySymbol})`
        );
        router.push("/snap");
      }}
    >
      <div className="absolute top-0 left-0 w-full h-[3px] bg-white/5">
        <div
          className="h-full bg-[#ff5540] rounded-r-full shadow-[0_0_8px_rgba(255,85,64,0.6)]"
          style={{
            width:
              match.id === "m1"
                ? "85%"
                : match.id === "m2"
                ? "45%"
                : "65%",
          }}
        ></div>
      </div>

      <div className="flex justify-between items-center mt-1">
        <span className="flex items-center gap-1 bg-[#272a2e] border border-white/5 px-2 py-0.5 rounded text-[10px] font-bold text-[#ff5540]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff5540] animate-ping"></span>
          {match.time} LIVE
        </span>
        <span className="text-[10px] font-bold text-[#00eefc] flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">
            photo_camera
          </span>
          {(match.activeCapturers / 1000).toFixed(1)}k Snapping
        </span>
      </div>

      <div className="flex justify-between items-center py-2 px-1">
        <div className="flex flex-col items-center gap-1 w-16">
          <div className="w-10 h-10 rounded-full bg-[#1d2023] border border-white/10 flex items-center justify-center overflow-hidden">
            <img
              src={match.teamHomeLogo}
              alt={match.teamHome}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[11px] font-bold text-white font-mono uppercase tracking-wider">
            {match.teamHomeSymbol}
          </span>
        </div>

        <div className="text-xl font-display font-extrabold text-white flex items-center gap-3">
          <span>{match.scoreHome}</span>
          <span className="text-[#c2c7d0]/40 font-normal text-sm">-</span>
          <span>{match.scoreAway}</span>
        </div>

        <div className="flex flex-col items-center gap-1 w-16">
          <div className="w-10 h-10 rounded-full bg-[#1d2023] border border-white/10 flex items-center justify-center overflow-hidden">
            <img
              src={match.teamAwayLogo}
              alt={match.teamAway}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[11px] font-bold text-white font-mono uppercase tracking-wider">
            {match.teamAwaySymbol}
          </span>
        </div>
      </div>

      <div className="text-[10px] font-medium text-[#c2c7d0] flex items-center gap-1 bg-white/5 py-1 px-2.5 rounded-full">
        <span className="material-symbols-outlined text-xs text-[#00eefc]">
          location_on
        </span>
        <span className="truncate">{match.location}</span>
      </div>
    </div>
  );
}
