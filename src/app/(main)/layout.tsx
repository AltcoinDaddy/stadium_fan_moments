"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store";
import TopAppBar from "@/components/TopAppBar";
import BottomNav from "@/components/BottomNav";

export default function MainLayout({ children }: { children: ReactNode }) {
  const navigateTo = useAppStore((s) => s.navigateTo);
  const setNavigateTo = useAppStore((s) => s.setNavigateTo);
  const requestCameraStop = useAppStore((s) => s.requestCameraStop);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (navigateTo) {
      router.push(navigateTo);
      setNavigateTo(null);
    }
  }, [navigateTo, router, setNavigateTo]);

  useEffect(() => {
    if (pathname !== "/snap") {
      requestCameraStop();
    }
  }, [pathname, requestCameraStop]);

  return (
    <>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#ff5540]/5 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00eefc]/5 rounded-full blur-3xl pointer-events-none z-0"></div>

      <div className="relative w-full min-h-screen bg-[#0B0E11] flex flex-col z-10">
        <TopAppBar />
        <main className="flex-1 overflow-y-auto no-scrollbar relative z-10 flex flex-col bg-[#0B0E11]">
          <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </>
  );
}

