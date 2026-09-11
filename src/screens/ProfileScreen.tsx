"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "@/lib/router-compat";
import { useAppStore } from "@/store";
import MomentCard from "@/components/MomentCard";

const COVER_IMAGE = "/marketplace-stadium-hero.png";

function ProfileAvatar({ src, name }: { src?: string; name: string }) {
  const [imageFailed, setImageFailed] = useState(!src || src === "/globe.svg");
  const setAuthenticatedUser = useAppStore((s) => s.setAuthenticatedUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setImageFailed(!src || src === "/globe.svg"), [src]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAuthenticatedUser({ avatar: result });
        setImageFailed(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className="relative flex h-[94px] w-[94px] cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-[#15151d] bg-[#1a1a20] shadow-[0_10px_28px_rgba(0,0,0,0.4)] group"
      onClick={() => fileInputRef.current?.click()}
    >
      {imageFailed ? (
        <span className="material-symbols-outlined text-[48px] text-white/30">person</span>
      ) : (
        <img src={src} alt={`${name} profile photo`} onError={() => setImageFailed(true)} className="h-full w-full object-cover" />
      )}
      
      {/* Upload Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="material-symbols-outlined text-[28px] text-white drop-shadow-md">photo_camera</span>
      </div>

      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="rounded-[20px] border border-white/5 bg-[#1a1a20] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
      <span className="material-symbols-outlined text-[24px] text-lime">{icon}</span>
      <p className="mt-3 text-[22px] font-extrabold tracking-[-0.04em] text-white">{value}</p>
      <p className="mt-0.5 text-[12px] font-medium text-white/45">{label}</p>
    </div>
  );
}

function Badge({ imgSrc, label }: { imgSrc: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[24px] border border-white/5 bg-[#1a1a20] shadow-[0_10px_22px_rgba(0,0,0,0.22)] overflow-hidden">
        <img src={imgSrc} alt={label} className="h-full w-full object-cover" />
      </div>
      <p className="line-clamp-2 text-[11px] font-semibold leading-tight text-white/75">{label}</p>
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
  const captures = myCaptures.length;
  const hoursInStands = `${Math.max(0, captures * 2)}h`;
  const earned = userWallet.chzBalance > 0 ? userWallet.chzBalance.toFixed(0) : "0";
  const profileName = userWallet.username || "Fan";

  return (
    <div className="min-h-full bg-[#15151d] pb-24 text-white">
      <section className="relative h-[180px] overflow-hidden bg-[#292281]">
        <img src={COVER_IMAGE} alt="Illustrated city at night" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15151d] via-[#15151d]/20 to-transparent" />
      </section>

      <div className="relative -mt-10 rounded-t-[38px] bg-[#15151d] px-6 pb-7">
        <div className="flex flex-col items-center text-center">
          <div className="-mt-12"><ProfileAvatar src={userWallet.avatar} name={profileName} /></div>
          <h1 className="mt-4 text-[22px] font-extrabold uppercase tracking-[-0.02em] text-white">{profileName}</h1>
          <p className="mt-1.5 flex items-center justify-center gap-1.5 text-[14px] font-medium text-white/70">
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            {verifiedVenue || "Matchday supporter"}
          </p>
          <p className="mt-3.5 max-w-[32ch] text-[13px] leading-relaxed text-white/70">
            Collecting authentic moments from the stands and backing the club through every matchday.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 px-2">
          <button 
            type="button" 
            onClick={() => router.push("/onboarding?next=/snap")} 
            className="h-11 rounded-full bg-lime text-[14px] font-semibold text-[#15151d] active:scale-[0.98] transition-transform"
          >
            Edit Profile
          </button>
          <button 
            type="button" 
            onClick={() => router.push("/trending")} 
            className="h-11 rounded-full bg-[#1a1a20] border border-white/5 text-[14px] font-semibold text-lime shadow-[0_8px_18px_rgba(0,0,0,0.15)] active:scale-[0.98] transition-transform"
          >
            Share Stats
          </button>
        </div>

        <section className="mt-10">
          <h2 className="text-[17px] font-bold tracking-tight text-white mb-4">Season Snapshot</h2>
          <div className="grid grid-cols-2 gap-3.5">
            <StatCard icon="photo_camera" value={String(captures)} label="Moments captured" />
            <StatCard icon="stadium" value={hoursInStands} label="Hours in stands" />
            <StatCard icon="bookmark" value={String(collectedMoments.length)} label="Moments collected" />
            <StatCard icon="token" value={earned} label="CHZ earned" />
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[17px] font-bold tracking-tight text-white">Badges</h2>
            <button type="button" onClick={() => router.push("/trending")} className="text-[13px] font-semibold text-lime">See all</button>
          </div>
          <div className="flex items-start justify-between gap-3">
            <Badge imgSrc="/badge_first_capture_1789130746289.jpg" label="First capture" />
            <Badge imgSrc="/badge_match_regular_1789130761079.jpg" label="Match regular" />
            <Badge imgSrc="/badge_collector_1789130772282.jpg" label="Collector" />
          </div>
        </section>

        <div className="mt-10 flex items-center justify-between">
          <h2 className="text-[17px] font-bold tracking-tight text-white">Your moments</h2>
          <div className="rounded-full bg-[#181820] p-1">
            <button type="button" onClick={() => setProfileTab("CAPTURES")} className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${profileTab === "CAPTURES" ? "bg-lime text-[#15151d]" : "text-white/50"}`}>Saved</button>
            <button type="button" onClick={() => setProfileTab("COLLECTION")} className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${profileTab === "COLLECTION" ? "bg-lime text-[#15151d]" : "text-white/50"}`}>Collection</button>
          </div>
        </div>

        {savedMoments.length ? (
          <div className="mt-5 grid grid-cols-2 gap-3">
            {savedMoments.map((moment) => <MomentCard key={moment.id} moment={moment} />)}
          </div>
        ) : (
          <div className="mt-5 rounded-[24px] border border-dashed border-white/15 bg-[#1a1a20] px-5 py-10 text-center">
            <span className="material-symbols-outlined text-[28px] text-lime">bookmark</span>
            <p className="mt-3 text-[15px] font-bold text-white">No saved moments yet</p>
            <p className="mt-1 text-[13px] text-white/45">Explore a live match to add one to your collection.</p>
          </div>
        )}
      </div>
    </div>
  );
}
