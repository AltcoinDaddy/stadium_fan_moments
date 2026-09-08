"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import type { Match } from "@/data/mockData";
import MatchCard from "@/components/MatchCard";

export default function TrendingScreen() {
  const moments = useAppStore((s) => s.moments);
  const setSelectedMoment = useAppStore((s) => s.setSelectedMoment);
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [leaderboard, setLeaderboard] = useState<Array<{ username: string; avatar: string; captures: number }>>([]);

  useEffect(() => {
    void fetch("/api/sports/matches").then((response) => response.ok ? response.json() : { matches: [] }).then((data) => setMatches(data.matches || [])).catch(() => setMatches([]));
    void fetch("/api/leaderboard").then((response) => response.ok ? response.json() : { leaderboard: [] }).then((data) => setLeaderboard(data.leaderboard || [])).catch(() => setLeaderboard([]));
  }, []);

  return (
    <div className="p-4 flex flex-col gap-5 animate-fade">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 text-[#ff5540]">
          <span
            className="material-symbols-outlined text-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            local_fire_department
          </span>
          <h2 className="text-lg font-display font-extrabold uppercase tracking-wide">
            WHAT&apos;S HOT
          </h2>
        </div>
        <p className="text-xs text-[#c2c7d0]">
          Real-time stadium activity and spiking moments.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#c2c7d0] uppercase tracking-widest">
            Live Hot Matches
          </h3>
          <span className="w-2 h-2 rounded-full bg-[#ff5540] animate-pulse"></span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-[#c2c7d0] uppercase tracking-widest">
            Trending Spikers
          </h3>
          <button className="text-xs text-[#00eefc] font-bold uppercase tracking-wider hover:underline">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => {
              if (!moments[0]) return;
              setSelectedMoment(moments[0]);
              router.push(`/detail?id=${encodeURIComponent(moments[0].id)}`);
            }}
            className="col-span-full h-44 md:h-60 rounded-2xl overflow-hidden border border-white/10 relative group cursor-pointer flex flex-col justify-end p-4"
          >
            <img
              src={moments[0]?.imageUrl || "/globe.svg"}
              alt={moments[0]?.title || "No moments yet"}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>

            <span className="absolute top-3 right-3 bg-[#ff5540]/20 border border-[#ff5540]/40 px-2 py-0.5 rounded text-[9px] font-bold text-[#ff5540] uppercase tracking-wider">
              {moments[0]?.rarity || "New"}
            </span>

            <div className="relative z-10 flex justify-between items-end">
              <div>
                <h4 className="text-sm font-display font-black text-white uppercase tracking-wide">
                  {moments[0]?.title || "No moments yet"}
                </h4>
                <p className="text-[11px] text-[#c2c7d0] font-medium">
                  {moments[0]
                    ? `${moments[0].match} • ${moments[0].minute}`
                    : "Upload the first stadium moment"}
                </p>
              </div>
              <div className="flex flex-col items-end text-right">
                <span className="text-xs font-mono font-bold text-green-400">
                  {moments[0] ? `${moments[0].views} views` : "—"}
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  {moments[0]
                    ? `${moments[0].price} ${moments[0].tokenSymbol}`
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          {moments.slice(1, 3).map((moment) => (
            <div
              key={moment.id}
              onClick={() => {
                setSelectedMoment(moment);
                router.push(`/detail?id=${encodeURIComponent(moment.id)}`);
              }}
              className="h-36 rounded-2xl overflow-hidden border border-white/10 relative group cursor-pointer flex flex-col justify-end p-3"
            >
              <img
                src={moment.imageUrl}
                alt={moment.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>

              <span
                className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-black/60 border ${
                  moment.rarity === "LEGENDARY"
                    ? "border-amber-400 text-amber-400"
                    : "border-[#00eefc] text-[#00eefc]"
                }`}
              >
                {moment.rarity}
              </span>

              <div className="relative z-10 flex flex-col gap-0.5">
                <h4 className="text-[12px] font-display font-extrabold text-white uppercase tracking-wide line-clamp-1">
                  {moment.title}
                </h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[9px] font-mono text-[#c2c7d0]">
                    #{moment.serial.toString().padStart(4, "0")}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-green-400">
                    {moment.likes} likes
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#161B22]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-3 mb-6">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1">
          <span className="material-symbols-outlined text-sm text-[#00eefc]">
            military_tech
          </span>
          Top Capturers Leaderboard
        </h3>
        <div className="flex flex-col gap-2.5 pt-1">
          {leaderboard.map((entry, index) => (
          <div key={entry.username} className="flex items-center justify-between text-sm py-1 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[#c2c7d0] font-bold w-4">{index + 1}</span>
              <img
                src={entry.avatar}
                alt={`${entry.username} avatar`}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-white font-bold font-mono text-[12px]">
                @{entry.username}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-[#00eefc]">
              {entry.captures} captures
            </span>
          </div>
          ))}
        </div>
      </section>
    </div>
  );
}
