"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Moment } from "@/data/mockData";
import { useAppStore } from "@/store";

function FeedMoment({ moment }: { moment: Moment }) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const setSelectedMoment = useAppStore((state) => state.setSelectedMoment);

  useEffect(() => {
    const card = cardRef.current;
    const video = videoRef.current;
    if (!card || !video || moment.mediaType !== "video") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: [0.7] }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [moment.mediaType]);

  const openMoment = () => {
    setSelectedMoment(moment);
    router.push(`/detail?id=${encodeURIComponent(moment.id)}`);
  };

  const shareMoment = async () => {
    const shareData = {
      title: moment.title,
      text: `${moment.title} — ${moment.match}`,
      url: `${window.location.origin}/detail?id=${encodeURIComponent(moment.id)}`,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(shareData.url);
    } catch {
      // Dismissing the native share sheet is not an application error.
    }
  };

  return (
    <article
      ref={cardRef}
      className="relative h-[calc(100dvh-10.5rem)] min-h-[520px] snap-start overflow-hidden bg-[#161B22] border-y border-white/10"
    >
      {moment.mediaType === "video" ? (
        <video
          ref={videoRef}
          src={moment.imageUrl}
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
        />
      ) : (
        <img
          src={moment.imageUrl}
          alt={moment.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/15" />

      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <span className="bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-[9px] font-bold text-[#00eefc] uppercase tracking-wider">
          {moment.rarity} · Verified
        </span>
        {moment.mediaType === "video" && (
          <button
            onClick={() => setIsMuted((value) => !value)}
            aria-label={isMuted ? "Enable sound" : "Mute sound"}
            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-lg">
              {isMuted ? "volume_off" : "volume_up"}
            </span>
          </button>
        )}
      </div>

      <div className="absolute left-4 right-16 bottom-5 flex flex-col gap-2">
        <button onClick={openMoment} className="text-left">
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#00eefc]">
            @{moment.creator.username} · {moment.location}
          </p>
          <h2 className="text-xl font-display font-black text-white uppercase tracking-wide mt-1">
            {moment.title}
          </h2>
          <p className="text-xs text-[#c2c7d0] line-clamp-2 mt-1">{moment.description}</p>
          <p className="text-xs font-mono text-white mt-2">
            {moment.match} · {moment.minute}
          </p>
        </button>
        <button
          onClick={openMoment}
          className="self-start bg-[#00eefc]/10 border border-[#00eefc]/40 rounded-full px-3 py-1.5 text-[10px] font-bold text-[#00eefc] uppercase tracking-wider"
        >
          {moment.isListed ? `Collect · ${moment.price} ${moment.tokenSymbol}` : "View Moment"}
        </button>
      </div>

      <div className="absolute right-3 bottom-5 flex flex-col items-center gap-4 text-white">
        <button onClick={openMoment} className="flex flex-col items-center gap-1" aria-label="View likes">
          <span className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center material-symbols-outlined">favorite</span>
          <span className="text-[10px] font-bold">{moment.likes}</span>
        </button>
        <button onClick={openMoment} className="flex flex-col items-center gap-1" aria-label="View moment details">
          <span className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center material-symbols-outlined">chat_bubble</span>
          <span className="text-[10px] font-bold">Details</span>
        </button>
        <button onClick={shareMoment} className="flex flex-col items-center gap-1" aria-label="Share moment">
          <span className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center material-symbols-outlined">share</span>
          <span className="text-[10px] font-bold">Share</span>
        </button>
      </div>
    </article>
  );
}

export default function ForYouFeed({ moments }: { moments: Moment[] }) {
  const rankedMoments = useMemo(
    () => [...moments].sort((a, b) => b.likes * 4 + b.views - (a.likes * 4 + a.views)),
    [moments]
  );

  if (!rankedMoments.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
        <span className="material-symbols-outlined text-4xl text-[#c2c7d0]">video_library</span>
        <p className="text-sm text-[#c2c7d0] font-semibold uppercase tracking-wider">No moments in your feed yet</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto snap-y snap-mandatory no-scrollbar">
      {rankedMoments.map((moment) => <FeedMoment key={moment.id} moment={moment} />)}
    </div>
  );
}
