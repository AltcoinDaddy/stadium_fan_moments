"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const setCapturedMedia = useAppStore((s) => s.setCapturedMedia);
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("video/") ? "video" : "photo";
      setCapturedMedia({ type, url });
      // Trigger scan via store
      useAppStore.getState().triggerCurationScan();
    }
  };

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
    <div className="flex-1 flex flex-col relative overflow-hidden bg-black h-full">
      <div className="absolute inset-0 w-full h-full z-0 bg-[#191c1f]">
        {cameraPermission === "granted" ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover opacity-90"
          />
        ) : (
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp67mGs7ImnLNJD0V0Ci05zU2cTmKt2NfS7-7udAD1i5tO3WjJ-mWTDNbsvMKXWCpoFUUw0F6_aLSiAbub-95mqjr8lzJJXsofsEprLtF3_zibHLYJJ8Z2yZrOk3rAXMF7-b672eJkEtXVtoFIPFXYJ_1FMR5n_Z4aO2q_QpDqbz_nRC-3VM6iPK7j6N5qIbHEdzOVFbGo9PuB2_Ud2xsmM4Pkq2bGp43XOQhxqMQxqBw2cws8XoDL30LfwlSfor33gxLLhszE190"
            alt="Simulated stadium camera viewfinder background"
            className="w-full h-full object-cover opacity-75"
          />
        )}
        {isRecording && (
          <div className="absolute inset-0 scanline pointer-events-none z-10"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 z-10 pointer-events-none"></div>
      </div>

      <header className="relative z-20 w-full pt-4 px-4 flex flex-col gap-4">
        <div className="flex justify-between items-center w-full">
          <button
            onClick={() => router.push("/marketplace")}
            className="w-9 h-9 rounded-full bg-black/80 flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setIsFlashOn(!isFlashOn)}
              className={`w-9 h-9 rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-transform ${
                isFlashOn ? "bg-amber-400 text-black" : "bg-black/80 text-white"
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {isFlashOn ? "flash_on" : "flash_off"}
              </span>
            </button>
            <button
              onClick={requestCamera}
              className="w-9 h-9 rounded-full bg-black/80 flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-lg">
                cameraswitch
              </span>
            </button>
          </div>
        </div>

        <div className="flex justify-center w-full">
          <div className="bg-[#1D2023]/95 border border-[#00eefc]/30 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-[0_4px_16px_rgba(0,238,252,0.15)] select-none">
            <div className="relative flex items-center justify-center w-2 h-2">
              <div className="absolute w-full h-full bg-[#00eefc] rounded-full animate-ping opacity-75"></div>
              <div className="relative w-2 h-2 rounded-full bg-[#00eefc]"></div>
            </div>
            <span className="text-[10px] font-bold text-[#c2c7d0] uppercase tracking-widest">
              Geo-CheckIn
            </span>
            <span className="text-xs font-semibold text-white truncate max-w-[180px]">
              {suggestedCheckIn}
            </span>
          </div>
        </div>

        {isRecording && (
          <div className="flex justify-center w-full mt-1">
            <div className="bg-[#ff5540]/40 border border-[#ff5540]/50 rounded-md px-3 py-1 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#ff5540] animate-pulse"></div>
              <span className="text-xs font-mono font-bold text-[#ffb4a8] tracking-widest">
                00:{recordingSeconds.toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        )}
      </header>

      <footer className="relative z-20 w-full pb-8 px-4 flex flex-col gap-5 mt-auto select-none">
        <div className="flex justify-center gap-6 text-xs font-bold w-full">
          <button
            onClick={() => {
              if (isRecording) return;
              setCameraMode("photo");
            }}
            className={`transition-colors py-1 ${
              cameraMode === "photo"
                ? "text-[#00eefc] border-b-2 border-[#00eefc] font-black"
                : "text-[#c2c7d0] hover:text-white"
            }`}
          >
            PHOTO
          </button>
          <button
            onClick={() => {
              if (isRecording) return;
              setCameraMode("video");
            }}
            className={`transition-colors py-1 ${
              cameraMode === "video"
                ? "text-[#ff5540] border-b-2 border-[#ff5540] font-black"
                : "text-[#c2c7d0] hover:text-white"
            }`}
          >
            VIDEO
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar w-full py-0.5">
          {["Goal", "Celebration", "Save", "Crowd", "Tension"].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveCaptureTag(tag)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-colors ${
                activeCaptureTag === tag
                  ? "border-[#00eefc] bg-[#00eefc]/10 text-[#00eefc]"
                  : "border-white/10 bg-black/45 text-[#c2c7d0] hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center w-full mt-1 px-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileSelect}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-white overflow-hidden active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-xl">
              photo_library
            </span>
          </button>

          <div className="flex flex-col items-center gap-2">
            {cameraMode === "video" ? (
              <button
                onClick={
                  isRecording ? handleStopRecording : handleStartRecording
                }
                className="relative w-20 h-20 rounded-full border-[3px] border-white/50 flex items-center justify-center p-1 active:scale-95 transition-transform duration-150"
              >
                <div className="absolute inset-[-6px] rounded-full border border-[#ff5540]/30 recording-pulse pointer-events-none"></div>
                <div className="w-full h-full rounded-full flex items-center justify-center bg-[#ff5540]">
                  {isRecording ? (
                    <div className="w-5 h-5 rounded-[4px] bg-white transition-all duration-300"></div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-white transition-all duration-300"></div>
                  )}
                </div>
              </button>
            ) : (
              <button
                onClick={handlePhotoSnap}
                className="relative w-20 h-20 rounded-full border-[3px] border-white/50 flex items-center justify-center p-1 active:scale-95 transition-transform duration-150"
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/15"></div>
              </button>
            )}
            <span className="text-[10px] font-mono text-[#c2c7d0] bg-black/50 px-2 py-0.5 rounded-full border border-white/5 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[10px]">
                token
              </span>
              {cameraMode === "photo" ? "10 CHZ to Mint" : "20 CHZ to Mint"}
            </span>
          </div>

          <button
            onClick={requestCamera}
            className="w-12 h-12 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-xl">
              cameraswitch
            </span>
          </button>
        </div>
      </footer>

      {capturedMedia && <CapturePreview />}
    </div>
  );
}
