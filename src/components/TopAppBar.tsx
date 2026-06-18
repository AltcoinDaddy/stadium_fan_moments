"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store";

export default function TopAppBar() {
  const userWallet = useAppStore((s) => s.userWallet);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="flex justify-between items-center px-4 h-16 bg-[#111417]/85 backdrop-blur-xl border-b border-white/10 shadow-md select-none z-40 relative shrink-0">
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push("/profile")}
          className="w-9 h-9 rounded-full overflow-hidden border border-white/20 active:scale-95 transition-transform"
        >
          <img
            src={userWallet.avatar}
            alt="User Profile"
            className="w-full h-full object-cover"
          />
        </button>
        <div
          onClick={() => router.push("/marketplace")}
          className="text-xl font-display font-black tracking-tighter text-[#ff5540] uppercase text-glow-primary cursor-pointer"
        >
          MATCHDAY
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          onClick={() => router.push("/profile")}
          className="flex items-center gap-1.5 bg-[#1d2023] border border-white/5 rounded-full py-1.5 px-3 cursor-pointer hover:bg-[#272a2e] transition-colors"
        >
          <span className="material-symbols-outlined text-[15px] text-[#00eefc]">
            token
          </span>
          <span className="text-[12px] font-mono font-bold text-white leading-none">
            {userWallet.ftBalances.BAR} BAR
          </span>
        </div>
        <button
          onClick={() => router.push("/trending")}
          className="w-9 h-9 rounded-full bg-[#1d2023] border border-white/10 flex items-center justify-center text-[#ffb4a8] hover:bg-[#272a2e] active:scale-90 transition-transform"
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            sports_soccer
          </span>
        </button>
      </div>
    </header>
  );
}
