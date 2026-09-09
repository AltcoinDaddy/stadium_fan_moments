"use client";

import { useMemo } from "react";
import { useRouter } from "@/lib/router-compat";
import type { Moment } from "@/data/mockData";
import { useAppStore } from "@/store";

const FALLBACK_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBp67mGs7ImnLNJD0V0Ci05zU2cTmKt2NfS7-7udAD1i5tO3WjJ-mWTDNbsvMKXWCpoFUUw0F6_aLSiAbub-95mqjr8lzJJXsofsEprLtF3_zibHLYJJ8Z2yZrOk3rAXMF7-b672eJkEtXVtoFIPFXYJ_1FMR5n_Z4aO2q_QpDqbz_nRC-3VM6iPK7j6N5qIbHEdzOVFbGo9PuB2_Ud2xsmM4Pkq2bGp43XOQhxqMQxqBw2cws8XoDL30LfwlSfor33gxLLhszE190";

export default function ForYouFeed({ moments }: { moments: Moment[] }) {
  const router = useRouter();
  const setSelectedMoment = useAppStore((state) => state.setSelectedMoment);
  
  // Show all moments sorted by popularity
  const rankedMoments = useMemo(
    () => [...moments].sort((a, b) => b.likes * 4 + b.views - (a.likes * 4 + a.views)),
    [moments]
  );

  const open = (moment: Moment) => {
    setSelectedMoment(moment);
    router.push(`/detail?id=${encodeURIComponent(moment.id)}`);
  };

  if (rankedMoments.length === 0) {
    return (
      <div className="flex aspect-[3/4] w-full flex-col items-center justify-center rounded-[24px] bg-white text-center">
        <p className="text-[15px] font-bold text-ink">No moments available</p>
        <p className="mt-1 text-[13px] text-muted">Check back later or snap one yourself!</p>
      </div>
    );
  }

  return (
    <div className="-mx-5 flex flex-col gap-6">
      {rankedMoments.map((moment) => (
        <article key={moment.id} className="relative overflow-hidden bg-ink shadow-sm sm:rounded-[24px] sm:mx-5">
          <div className="relative aspect-[4/5] w-full bg-ink">
            {moment.mediaType === "video" || moment.videoUrl ? (
              <video 
                src={moment.videoUrl || moment.imageUrl} 
                className="h-full w-full object-cover" 
                muted 
                loop 
                autoPlay 
                playsInline 
              />
            ) : (
              <img
                src={moment.imageUrl || FALLBACK_IMAGE}
                alt={moment.title || "Stadium moment"}
                className="h-full w-full object-cover"
              />
            )}
            
            {/* Top and Bottom Gradients for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

            {/* Top Info: User Overlay */}
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <img 
                src={moment.creator?.avatar || FALLBACK_IMAGE} 
                alt={moment.creator?.username}
                className="h-9 w-9 rounded-full border border-white/20 object-cover"
              />
              <span className="text-[14px] font-semibold text-white drop-shadow-md">
                @{moment.creator?.username || "fan"}
              </span>
            </div>

            {/* Bottom Info: Title & Match */}
            <div className="absolute bottom-6 left-4 right-16">
              <h2 className="text-[24px] font-bold leading-tight text-white drop-shadow-md">
                {moment.title}
              </h2>
              <p className="mt-1 text-[13px] font-medium text-white/80 drop-shadow-md">
                {moment.match} • {moment.location}
              </p>
            </div>

            {/* Right Side Actions Stack */}
            <div className="absolute bottom-6 right-3 flex flex-col items-center gap-5">
              <button className="flex flex-col items-center gap-1 active:scale-95">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                  <span className="material-symbols-outlined text-[24px] text-white">favorite</span>
                </div>
                <span className="text-[11px] font-bold text-white drop-shadow-sm">{moment.likes || 0}</span>
              </button>
              
              <button 
                onClick={() => open(moment)} 
                className="flex flex-col items-center gap-1 active:scale-95"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-lime text-ink">
                  <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
                </div>
                <span className="text-[11px] font-bold text-white drop-shadow-sm">{moment.price} CHZ</span>
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
