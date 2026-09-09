"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "@/lib/router-compat";
import { useAppStore } from "@/store";
import CapturePreview from "@/components/CapturePreview";

export default function SnapScreen() {
  const cameraPermission = useAppStore((s) => s.cameraPermission);
  const isRecording = useAppStore((s) => s.isRecording);
  const recordingSeconds = useAppStore((s) => s.recordingSeconds);
  const isFlashOn = useAppStore((s) => s.isFlashOn);
  const setIsFlashOn = useAppStore((s) => s.setIsFlashOn);
  const cameraMode = useAppStore((s) => s.cameraMode);
  const setCameraMode = useAppStore((s) => s.setCameraMode);
  const activeCaptureTag = useAppStore((s) => s.activeCaptureTag);
  const setActiveCaptureTag = useAppStore((s) => s.setActiveCaptureTag);
  const capturedMedia = useAppStore((s) => s.capturedMedia);
  const suggestedCheckIn = useAppStore((s) => s.suggestedCheckIn);
  const locationPermission = useAppStore((s) => s.locationPermission);
  const requestCamera = useAppStore((s) => s.requestCamera);
  const requestLocation = useAppStore((s) => s.requestLocation);
  const handleStartRecording = useAppStore((s) => s.handleStartRecording);
  const handleStopRecording = useAppStore((s) => s.handleStopRecording);
  const handlePhotoSnap = useAppStore((s) => s.handlePhotoSnap);
  const setVideoElement = useAppStore((s) => s.setVideoElement);
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (cameraPermission !== "granted" && cameraPermission !== "denied") {
      requestCamera();
    }
    if (locationPermission !== "granted" && locationPermission !== "denied") {
      requestLocation();
    }
  }, [cameraPermission, locationPermission, requestCamera, requestLocation]);

  useEffect(() => {
    if (cameraPermission === "granted") {
      setVideoElement(videoRef.current);
    }
    return () => setVideoElement(null);
  }, [cameraPermission, setVideoElement]);

  return (
    <div className="relative flex h-full min-h-[100dvh] flex-1 flex-col overflow-hidden bg-ink">
      <div className="absolute inset-0 z-0 bg-ink">
        {cameraPermission === "granted" ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp67mGs7ImnLNJD0V0Ci05zU2cTmKt2NfS7-7udAD1i5tO3WjJ-mWTDNbsvMKXWCpoFUUw0F6_aLSiAbub-95mqjr8lzJJXsofsEprLtF3_zibHLYJJ8Z2yZrOk3rAXMF7-b672eJkEtXVtoFIPFXYJ_1FMR5n_Z4aO2q_QpDqbz_nRC-3VM6iPK7j6N5qIbHEdzOVFbGo9PuB2_Ud2xsmM4Pkq2bGp43XOQhxqMQxqBw2cws8XoDL30LfwlSfor33gxLLhszE190"
            alt="Simulated stadium camera viewfinder background"
            className="h-full w-full object-cover opacity-80"
          />
        )}
        {isRecording && (
          <div className="scanline pointer-events-none absolute inset-0 z-10"></div>
        )}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-ink/70 via-transparent to-ink/80"></div>
      </div>

      <header className="relative z-20 flex w-full flex-col gap-4 px-4 pt-4">
        <div className="flex w-full items-center justify-between">
          <button
            onClick={() => router.push("/marketplace")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink transition-transform active:scale-90"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setIsFlashOn(!isFlashOn)}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-90 ${
                isFlashOn ? "bg-lime text-ink" : "bg-white text-ink"
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {isFlashOn ? "flash_on" : "flash_off"}
              </span>
            </button>
            <button
              onClick={requestCamera}
              aria-label="Switch camera"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink transition-transform active:scale-90"
            >
              <span className="material-symbols-outlined text-lg">cameraswitch</span>
            </button>
          </div>
        </div>

        <div className="flex w-full justify-center">
          <button
            onClick={requestLocation}
            title="Retry stadium verification"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-[#15151d]/85 px-4 py-1.5 select-none backdrop-blur-md"
          >
            <div className="relative flex h-2 w-2 items-center justify-center">
              <div className="absolute h-full w-full animate-ping rounded-full bg-lime opacity-75"></div>
              <div className="relative h-2 w-2 rounded-full bg-lime"></div>
            </div>
            <span className="text-[10px] font-bold tracking-wide text-white/55">Check-in</span>
            <span className="max-w-[180px] truncate text-xs font-semibold text-white">
              {suggestedCheckIn}
            </span>
          </button>
        </div>

        {isRecording && (
          <div className="mt-1 flex w-full justify-center">
            <div className="flex items-center gap-1.5 rounded-full bg-lime px-3 py-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-ink"></div>
              <span className="font-mono text-xs font-bold tracking-widest text-ink">
                00:{recordingSeconds.toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        )}
      </header>

      <footer className="relative z-20 mt-auto flex w-full flex-col gap-5 px-4 pb-8 select-none">
        <div className="flex w-full justify-center gap-6 text-xs font-bold">
          <button
            onClick={() => {
              if (isRecording) return;
              setCameraMode("photo");
            }}
            className={`py-1 transition-colors ${
              cameraMode === "photo" ? "border-b-2 border-lime text-lime" : "text-white/70"
            }`}
          >
            PHOTO
          </button>
          <button
            onClick={() => {
              if (isRecording) return;
              setCameraMode("video");
            }}
            className={`py-1 transition-colors ${
              cameraMode === "video" ? "border-b-2 border-lime text-lime" : "text-white/70"
            }`}
          >
            VIDEO
          </button>
        </div>

        <div className="flex w-full gap-2 overflow-x-auto py-0.5 no-scrollbar">
          {["Goal", "Celebration", "Save", "Crowd", "Tension"].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveCaptureTag(tag)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[10px] font-bold tracking-wide transition-colors ${
                activeCaptureTag === tag ? "bg-lime text-ink" : "bg-white/15 text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="mt-1 flex w-full items-center justify-between px-4">
          <button
            aria-label="Open photo library"
            onClick={() => window.alert("Mintable moments must be captured live with the stadium camera.")}
            className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white text-ink transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">photo_library</span>
          </button>

          <div className="flex flex-col items-center gap-2">
            {cameraMode === "video" ? (
              <button
                aria-label={isRecording ? "Stop video recording" : "Start video recording"}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className="relative flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-white/70 p-1 transition-transform duration-150 active:scale-95"
              >
                <div className="recording-pulse pointer-events-none absolute inset-[-6px] rounded-full border border-lime/40"></div>
                <div className="flex h-full w-full items-center justify-center rounded-full bg-lime">
                  {isRecording ? (
                    <div className="h-5 w-5 rounded-[4px] bg-ink transition-all duration-300"></div>
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-ink transition-all duration-300"></div>
                  )}
                </div>
              </button>
            ) : (
              <button
                aria-label="Take photo"
                onClick={handlePhotoSnap}
                className="relative flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-white/70 p-1 transition-transform duration-150 active:scale-95"
              >
                <div className="h-full w-full rounded-full bg-lime"></div>
              </button>
            )}
            <span className="flex items-center gap-0.5 rounded-full bg-white px-2 py-0.5 font-mono text-[10px] text-[#08080f]">
              <span className="material-symbols-outlined text-[10px]">token</span>
              {cameraMode === "photo" ? "10 CHZ to Mint" : "20 CHZ to Mint"}
            </span>
          </div>

          <button
            aria-label="Switch camera"
            onClick={requestCamera}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">cameraswitch</span>
          </button>
        </div>
      </footer>

      {capturedMedia && <CapturePreview />}
    </div>
  );
}
