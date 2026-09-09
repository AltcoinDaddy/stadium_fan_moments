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
  const granted = permission === "granted";
  const blocked = permission === "denied";

  return (
    <div className={`flex items-center justify-between rounded-[22px] border p-4 transition-colors ${
      granted ? "border-lime/35 bg-lime/[0.06]" : "border-white/10 bg-[#191922]"
    }`}>
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            granted ? "bg-lime text-ink" : "bg-white/10 text-white"
          }`}
        >
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-white">{title}</h4>
          <p className={`mt-0.5 truncate text-xs ${blocked ? "text-[#ffb4ab]" : "text-white/45"}`}>{subtitle}</p>
        </div>
      </div>
      {granted ? (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime/15 text-lime">
          <span className="material-symbols-outlined text-[18px]">check</span>
        </span>
      ) : (
        <button
          type="button"
          onClick={onGrant}
          className="ml-3 shrink-0 rounded-full bg-lime px-4 py-2 text-xs font-extrabold text-[#08080f] transition-transform active:scale-95"
        >
          {permission === "prompt" ? "Grant" : "Retry"}
        </button>
      )}
    </div>
  );
}
