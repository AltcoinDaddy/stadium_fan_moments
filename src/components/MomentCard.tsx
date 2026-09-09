"use client";

import { useRouter } from "@/lib/router-compat";
import { Moment } from "@/data/mockData";
import { useAppStore } from "@/store";
import { categoryIcon, categoryPastel } from "@/lib/ui";

interface Props {
  moment: Moment;
}

export default function MomentCard({ moment }: Props) {
  const setSelectedMoment = useAppStore((s) => s.setSelectedMoment);
  const router = useRouter();

  return (
    <article
      onClick={() => {
        setSelectedMoment(moment);
        router.push(`/detail?id=${encodeURIComponent(moment.id)}`);
      }}
      className="flex min-h-[176px] cursor-pointer flex-col justify-between rounded-[28px] p-4 active:scale-[0.98]"
      style={{ backgroundColor: categoryPastel(moment.category) }}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
          <span className="material-symbols-outlined text-[22px] text-lime">
            {categoryIcon(moment.category)}
          </span>
        </div>
        <span className="material-symbols-outlined text-[20px] text-white/35">more_horiz</span>
      </div>
      <div>
        <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-ink">
          {moment.title}
        </h3>
        <p className="mt-2 flex items-center gap-1 text-[15px] font-semibold text-ink">
          {moment.price}x
          <span className="material-symbols-outlined text-[18px]">sports_soccer</span>
        </p>
      </div>
    </article>
  );
}
