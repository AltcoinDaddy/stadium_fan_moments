"use client";

import { useRouter } from "next/navigation";
import { Moment } from "@/data/mockData";
import { useAppStore } from "@/store";

interface Props {
  moment: Moment;
}

export default function MomentCard({ moment }: Props) {
  const setSelectedMoment = useAppStore((s) => s.setSelectedMoment);
  const router = useRouter();

  const handleClick = () => {
    setSelectedMoment(moment);
    router.push("/detail");
  };

  return (
    <article
      onClick={handleClick}
      className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 bg-[#161B22] shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex flex-col justify-end"
    >
      <img
        src={moment.imageUrl}
        alt={moment.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent z-10"></div>

      <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start z-20">
        <span
          className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest bg-black/60 backdrop-blur-md border ${
            moment.rarity === "LEGENDARY"
              ? "border-amber-400 text-amber-400"
              : moment.rarity === "EPIC"
              ? "border-[#ff5540] text-[#ff5540]"
              : moment.rarity === "RARE"
              ? "border-[#00eefc] text-[#00eefc]"
              : "border-white/20 text-white"
          }`}
        >
          {moment.rarity}
        </span>
        <span className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-[13px] text-white">
            favorite
          </span>
        </span>
      </div>

      <div className="p-3 flex flex-col gap-0.5 z-20 relative">
        <div className="flex items-center gap-1 text-[10px] text-[#c2c7d0] font-medium">
          <span className="material-symbols-outlined text-[11px]">
            location_on
          </span>
          <span className="truncate">
            {moment.location}, {moment.minute}
          </span>
        </div>
        <h3 className="text-sm font-display font-extrabold text-white line-clamp-1 leading-tight uppercase">
          {moment.title}
        </h3>

        <div className="flex items-center justify-between mt-1.5 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[13px] text-[#00eefc]">
              token
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {moment.price} {moment.tokenSymbol}
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#c2c7d0]">
            #{moment.serial.toString().padStart(4, "0")}
          </span>
        </div>
      </div>
    </article>
  );
}
