"use client";

import { useRouter } from "@/lib/router-compat";
import { useAppStore } from "@/store";

export default function TopAppBar() {
  const userWallet = useAppStore((s) => s.userWallet);
  const router = useRouter();

  return (
    <header className="relative z-40 flex h-16 shrink-0 items-center justify-between px-5 select-none">
      <div>
        <p className="text-sm text-white/45">Welcome back</p>
        <button
          onClick={() => router.push("/marketplace")}
          className="text-lg font-extrabold tracking-tight text-white"
        >
          MATCHDAY
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push("/profile")}
          className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-lime backdrop-blur-md"
        >
          {userWallet.chzBalance} CHZ
        </button>
        <button
          onClick={() => router.push("/profile")}
          className="h-9 w-9 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15"
        >
          <img
            src={userWallet.avatar}
            alt="User Profile"
            className="h-full w-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}
