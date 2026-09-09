"use client";

import { useEffect } from "react";
import { useRouter } from "@/lib/router-compat";
import { useAppStore } from "@/store";
import MomentCard from "@/components/MomentCard";

const COVER_IMAGE = "/marketplace-stadium-hero.png";

type ProfileStats = {
  totalIncome: number;
  momentsSold: number;
  royaltyIncome: number;
  incomeSeries: number[];
};

const emptyStats: ProfileStats = {
  totalIncome: 0,
  momentsSold: 0,
  royaltyIncome: 0,
  incomeSeries: [],
};

function StatCard({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-[#17171f] p-3.5">
      <span className="material-symbols-outlined text-[23px] text-lime">{icon}</span>
      <p className="mt-3 text-[22px] font-extrabold tracking-[-0.04em] text-white">{value}</p>
      <p className="mt-0.5 text-[11px] font-medium text-white/45">{label}</p>
    </div>
  );
}

export default function ProfileScreen({ initialTab }: { initialTab?: "captures" | "collection" }) {
  const userWallet = useAppStore((s) => s.userWallet);
  const profileTab = useAppStore((s) => s.profileTab);
  const setProfileTab = useAppStore((s) => s.setProfileTab);
  const myCaptures = useAppStore((s) => s.myCaptures);
  const collectedMoments = useAppStore((s) => s.collectedMoments);
  const verifiedVenue = useAppStore((s) => s.verifiedVenue);
  const router = useRouter();

  useEffect(() => {
    if (initialTab === "captures") setProfileTab("CAPTURES");
    if (initialTab === "collection") setProfileTab("COLLECTION");
  }, [initialTab, setProfileTab]);

  const savedMoments = profileTab === "CAPTURES" ? myCaptures : collectedMoments;
  const displayStats = emptyStats;
  const matchesPlayed = Math.max(myCaptures.length, 0);
  const hoursInStands = `${Math.max(3, myCaptures.length * 2 + 3)}h`;

  return (
    <div className="min-h-full bg-[#08080f] pb-7 text-white">
      <section className="relative h-44 overflow-hidden rounded-b-[30px] bg-[#1b37ac]">
        <img src={COVER_IMAGE} alt="Crowd at a live football match" className="h-full w-full object-cover object-[58%_63%] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080f] via-[#08080f]/10 to-transparent" />
      </section>

      <div className="-mt-12 px-5">
        <img
          src={userWallet.avatar}
          alt="Profile photo"
          className="h-24 w-24 rounded-full border-4 border-[#08080f] object-cover shadow-[0_10px_28px_rgba(0,0,0,0.4)]"
        />
        <h1 className="mt-3 text-[25px] font-extrabold tracking-[-0.04em] text-white">{userWallet.username || "Fan"}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-[14px] font-semibold text-white/60">
          <span className="material-symbols-outlined text-[18px] text-lime">location_on</span>
          {verifiedVenue || "Matchday supporter"}
        </p>
        <p className="mt-3 max-w-[34ch] text-[14px] leading-relaxed text-white/55">
          Collecting authentic moments from the stands and backing the club through every matchday.
        </p>

        <div className="mt-5 flex gap-3">
          <button type="button" onClick={() => router.push("/onboarding")} className="h-11 flex-1 rounded-full bg-lime text-[14px] font-extrabold text-[#08080f] active:scale-[0.98]">
            Capture a moment
          </button>
          <button type="button" onClick={() => router.push("/trending")} className="h-11 flex-1 rounded-full border border-white/10 bg-[#1a1a22] text-[14px] font-bold text-lime active:scale-[0.98]">
            Explore venues
          </button>
        </div>

        <section className="mt-8">
          <h2 className="text-[19px] font-extrabold tracking-[-0.03em] text-white">Season snapshot</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <StatCard icon="sports_soccer" value={String(matchesPlayed)} label="Moments captured" />
            <StatCard icon="schedule" value={hoursInStands} label="Hours at matches" />
            <StatCard icon="sell" value={`${displayStats.momentsSold}`} label="Moments traded" />
            <StatCard icon="token" value={`${displayStats.totalIncome.toFixed(0)}`} label="CHZ earned" />
          </div>
        </section>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-[19px] font-extrabold tracking-[-0.03em] text-white">Your moments</h2>
          <div className="rounded-full bg-[#181820] p-1">
            <button
              type="button"
              onClick={() => setProfileTab("CAPTURES")}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${profileTab === "CAPTURES" ? "bg-lime text-[#08080f]" : "text-white/50"}`}
            >
              Saved
            </button>
            <button
              type="button"
              onClick={() => setProfileTab("COLLECTION")}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${profileTab === "COLLECTION" ? "bg-lime text-[#08080f]" : "text-white/50"}`}
            >
              Collection
            </button>
          </div>
        </div>

        {savedMoments.length ? (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {savedMoments.map((moment) => <MomentCard key={moment.id} moment={moment} />)}
          </div>
        ) : (
          <div className="mt-4 rounded-[24px] border border-dashed border-white/15 bg-[#13131a] px-5 py-10 text-center">
            <span className="material-symbols-outlined text-[28px] text-lime">bookmark</span>
            <p className="mt-3 text-[15px] font-bold text-white">No saved moments yet</p>
            <p className="mt-1 text-[13px] text-white/45">Explore a live match to add one to your collection.</p>
          </div>
        )}
      </div>
    </div>
  );
}
