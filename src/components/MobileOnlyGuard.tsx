"use client";

import { ReactNode, useCallback, useSyncExternalStore } from "react";

const PHONE_QUERY = "(max-width: 767px)";
const PREVIEW_KEY = "matchday-phone-preview";

const previewListeners = new Set<() => void>();

function emitPreview() {
  previewListeners.forEach((listener) => listener());
}

function subscribePreview(listener: () => void) {
  previewListeners.add(listener);
  return () => previewListeners.delete(listener);
}

function getPreviewSnapshot() {
  const params = new URLSearchParams(window.location.search);
  return params.get("preview") === "1" || window.sessionStorage.getItem(PREVIEW_KEY) === "1";
}

function getPreviewServerSnapshot() {
  return false;
}

function subscribePhone(listener: () => void) {
  const media = window.matchMedia(PHONE_QUERY);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

function getPhoneSnapshot() {
  return window.matchMedia(PHONE_QUERY).matches;
}

function getPhoneServerSnapshot() {
  return true;
}

export default function MobileOnlyGuard({ children }: { children: ReactNode }) {
  const isPhone = useSyncExternalStore(subscribePhone, getPhoneSnapshot, getPhoneServerSnapshot);
  const preview = useSyncExternalStore(subscribePreview, getPreviewSnapshot, getPreviewServerSnapshot);

  const enablePreview = useCallback(() => {
    window.sessionStorage.setItem(PREVIEW_KEY, "1");
    emitPreview();
  }, []);

  const disablePreview = useCallback(() => {
    window.sessionStorage.removeItem(PREVIEW_KEY);
    emitPreview();
  }, []);

  if (isPhone) {
    return (
      <div className="app-shell relative mx-auto flex h-[100dvh] w-full max-w-[600px] flex-col overflow-hidden bg-background">
        {children}
      </div>
    );
  }

  if (!preview) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-6 text-center">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-lime text-3xl font-extrabold text-ink">
          M
        </div>
        <h1 className="text-[32px] font-extrabold leading-none tracking-[-0.03em] text-ink">
          FanMoments is a phone app
        </h1>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
          Camera, stadium check-in, and minting only work on a phone. Open this URL on your device.
        </p>
        <button
          type="button"
          onClick={enablePreview}
          className="mt-8 h-12 rounded-full bg-ink px-6 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
        >
          Preview in a phone frame
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#EEECE6] px-6 py-8">
      <p className="mb-4 text-sm font-medium text-muted">Phone preview. FanMoments stays mobile-only.</p>
      <div className="relative h-[min(844px,90dvh)] w-[min(390px,100%)] overflow-hidden rounded-[42px] border-[10px] border-ink bg-background shadow-[0_28px_80px_rgba(20,20,20,0.16)]">
        <div className="pointer-events-none absolute left-1/2 top-2 z-30 h-6 w-28 -translate-x-1/2 rounded-full bg-ink" />
        <div className="app-shell h-full flex flex-col pt-8">
          {children}
        </div>
      </div>
      <button
        type="button"
        className="mt-4 text-xs font-semibold text-muted underline underline-offset-4"
        onClick={disablePreview}
      >
        Back to phone gate
      </button>
    </div>
  );
}
