"use client";

import { useEffect, useRef } from "react";
import { Outlet, useLocation, useRouter } from "@tanstack/react-router";
import { useAppStore } from "@/store";
import BottomNav from "@/components/BottomNav";

export default function MainLayout() {
  const navigateTo = useAppStore((s) => s.navigateTo);
  const setNavigateTo = useAppStore((s) => s.setNavigateTo);
  const requestCameraStop = useAppStore((s) => s.requestCameraStop);
  const router = useRouter();
  const pathname = useLocation({ select: (location) => location.pathname });
  const mainRef = useRef<HTMLElement | null>(null);
  const hideNav = pathname === "/snap" || pathname.startsWith("/detail");

  useEffect(() => {
    if (!navigateTo) return;
    void router.navigate({ to: navigateTo });
    setNavigateTo(null);
  }, [navigateTo, router, setNavigateTo]);

  useEffect(() => {
    if (pathname !== "/snap") requestCameraStop();
  }, [pathname, requestCameraStop]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background">
      <main ref={mainRef} className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto no-scrollbar">
        <Outlet />
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
