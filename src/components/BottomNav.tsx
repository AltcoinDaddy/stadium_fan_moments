"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const setMarketTab = useAppStore((s) => s.setMarketTab);

  const isMarketplace = pathname === "/marketplace";
  const isSnap = pathname === "/snap";
  const isTrending = pathname === "/trending";

  return (
    <nav className="flex justify-around items-center px-6 h-20 bg-[#1d2023]/95 border-t border-white/5 shadow-[0_-4px_20px_rgba(0,0,0,0.4)] z-40 relative select-none pb-4 shrink-0">
      <button
        onClick={() => {
          setMarketTab("FOR_YOU");
          router.push("/marketplace");
        }}
        className={`flex flex-col items-center justify-center w-12 h-12 hover:text-[#00eefc] transition-colors ${
          isMarketplace ? "text-[#00eefc]" : "text-[#c2c7d0]"
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{
            fontVariationSettings: isMarketplace ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          storefront
        </span>
      </button>

      <button
        onClick={() => router.push("/snap")}
        className="flex items-center justify-center bg-[#ff5540] text-white rounded-full w-14 h-14 -mt-5 shadow-[0_4px_16px_rgba(255,85,64,0.4)] scale-110 active:scale-100 hover:brightness-110 transition-all duration-300 ease-out border-2 border-white/10"
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          photo_camera
        </span>
      </button>

      <button
        onClick={() => router.push("/trending")}
        className={`flex flex-col items-center justify-center w-12 h-12 hover:text-[#00eefc] transition-colors ${
          isTrending ? "text-[#00eefc]" : "text-[#c2c7d0]"
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{
            fontVariationSettings: isTrending ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          local_fire_department
        </span>
      </button>
    </nav>
  );
}
