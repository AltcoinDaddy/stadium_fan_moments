"use client";

import { useEffect, useState } from "react";

type DeferredInstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function PwaRegistration() {
  const [installPrompt, setInstallPrompt] = useState<DeferredInstallPrompt | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || import.meta.env.DEV) return;
    void navigator.serviceWorker.register("/sw.js");

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as DeferredInstallPrompt);
    };
    const onAppInstalled = () => setInstallPrompt(null);
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  if (!installPrompt) return null;

  return (
    <button
      type="button"
      aria-label="Install MATCHDAY"
      onClick={async () => {
        await installPrompt.prompt();
        await installPrompt.userChoice;
        setInstallPrompt(null);
      }}
      className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-lime text-ink shadow-md transition-transform active:scale-90"
    >
      <span className="material-symbols-outlined text-xl">install_mobile</span>
    </button>
  );
}
