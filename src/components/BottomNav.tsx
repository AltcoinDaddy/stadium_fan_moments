"use client";

import { useRouter, usePathname } from "@/lib/router-compat";
import { useAppStore } from "@/store";

function NavItem({
  active,
  icon,
  onClick,
  label,
  isSpecial = false,
}: {
  active: boolean;
  icon: string;
  onClick: () => void;
  label: string;
  isSpecial?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-14 gap-1 active:scale-95 transition-all ${
      active ? "text-white" : "text-white/40"
      }`}
    >
      {isSpecial ? (
        <div className="flex h-9 w-12 items-center justify-center rounded-[12px] bg-lime/90 text-[#08080f] shadow-[0_0_22px_rgba(186,255,39,0.2)] mb-0.5 backdrop-blur-md">
          <span className="material-symbols-outlined text-[22px] leading-none">{icon}</span>
        </div>
      ) : (
        <span 
          className="material-symbols-outlined text-[28px] leading-none transition-all duration-200" 
          style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
        >
          {icon}
        </span>
      )}
      <span className={`text-[10px] tracking-wide ${active ? "font-semibold" : "font-medium"} ${isSpecial ? "text-lime font-semibold" : ""}`}>
        {label}
      </span>
    </button>
  );
}

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const setMarketTab = useAppStore((s) => s.setMarketTab);
  const setProfileTab = useAppStore((s) => s.setProfileTab);
  const profileTab = useAppStore((s) => s.profileTab);

  const isMarketplace = pathname === "/marketplace" || pathname === "/";
  const isSnap = pathname === "/snap" || pathname === "/onboarding";
  const isTrending = pathname === "/trending";
  const isProfile = pathname === "/profile";
  const isBookmarks = isProfile && profileTab === "CAPTURES";
  const isAccount = isProfile && profileTab === "COLLECTION";

  return (
    <nav className="sticky bottom-0 z-40 flex shrink-0 items-end justify-between border-t border-white/10 bg-[#111119]/75 px-6 pb-[max(1.2rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-2xl saturate-[1.8] supports-[backdrop-filter]:bg-[#111119]/65">
      <NavItem
        label="Home"
        icon="home"
        active={isMarketplace}
        onClick={() => {
          setMarketTab("FOR_YOU");
          router.push("/marketplace");
        }}
      />
      <NavItem
        label="Explore"
        icon="explore"
        active={isTrending}
        onClick={() => {
          router.push("/trending");
        }}
      />
      <NavItem
        label="Camera"
        icon="photo_camera"
        active={isSnap}
        isSpecial={true}
        onClick={() => router.push("/snap")}
      />
      <NavItem
        label="Bookmarks"
        icon="bookmark"
        active={isBookmarks}
        onClick={() => {
          setProfileTab("CAPTURES");
          router.push("/profile");
        }}
      />
      <NavItem
        label="Profile"
        icon="account_circle"
        active={isAccount}
        onClick={() => {
          setProfileTab("COLLECTION");
          router.push("/profile");
        }}
      />
    </nav>
  );
}
