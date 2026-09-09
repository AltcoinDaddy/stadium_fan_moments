"use client";

import { useRouter } from "@/lib/router-compat";
import { Match } from "@/data/mockData";
import { useAppStore } from "@/store";
import { pastelFor } from "@/lib/ui";

interface Props {
  match: Match;
}

export default function MatchCard({ match }: Props) {
  const setSuggestedCheckIn = useAppStore((s) => s.setSuggestedCheckIn);
  const router = useRouter();
  const live = match.status === "LIVE";

  return (
    <button
      type="button"
      className="flex w-[240px] shrink-0 flex-col gap-3 rounded-[28px] p-4 text-left active:scale-[0.98]"
      style={{ backgroundColor: pastelFor(match.id) }}
      onClick={() => {
        setSuggestedCheckIn(
          `${match.location} (${match.teamHomeSymbol} vs ${match.teamAwaySymbol})`
        );
        router.push("/snap");
      }}
    >
      <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
          {live ? `${match.time} Live` : match.status === "UPCOMING" ? "Upcoming" : "Full time"}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-bold text-ink">{match.teamHomeSymbol}</span>
        <span className="text-[22px] font-extrabold text-ink">
          {match.scoreHome}-{match.scoreAway}
        </span>
        <span className="text-[13px] font-bold text-ink">{match.teamAwaySymbol}</span>
      </div>
      <p className="truncate text-[12px] font-medium text-white/55">{match.location}</p>
    </button>
  );
}
