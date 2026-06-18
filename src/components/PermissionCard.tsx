"use client";

import type { PermissionState } from "@/store";

interface Props {
  icon: string;
  title: string;
  subtitle: string;
  permission: PermissionState;
  onGrant: () => void;
}

export default function PermissionCard({
  icon,
  title,
  subtitle,
  permission,
  onGrant,
}: Props) {
  return (
    <div className="bg-[#161B22]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            permission === "granted"
              ? "bg-green-500/20 text-green-400"
              : "bg-[#1d2023] text-[#c2c7d0]"
          }`}
        >
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            {title}
          </h4>
          <p className="text-xs text-[#c2c7d0]">{subtitle}</p>
        </div>
      </div>
      {permission === "granted" ? (
        <span className="material-symbols-outlined text-green-400 font-bold">
          check_circle
        </span>
      ) : (
        <button
          onClick={onGrant}
          className="px-4 py-1.5 rounded-full bg-[#00eefc] text-black text-xs font-bold active:scale-95 transition-transform"
        >
          Grant
        </button>
      )}
    </div>
  );
}
