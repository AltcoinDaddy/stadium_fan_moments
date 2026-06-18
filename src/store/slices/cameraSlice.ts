import type { StateCreator } from "zustand";
import type { AppStore, CameraModeType, PermissionState } from "../types";
import { playSound } from "../utils";

let streamRef: MediaStream | null = null;
let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: Blob[] = [];

export interface CameraSlice {
  cameraPermission: PermissionState;
  locationPermission: PermissionState;
  cameraMode: CameraModeType;
  setCameraMode: (mode: CameraModeType) => void;
  isRecording: boolean;
  recordingSeconds: number;
  isFlashOn: boolean;
  setIsFlashOn: (on: boolean) => void;
  capturedMedia: { type: "photo" | "video"; url: string } | null;
  setCapturedMedia: (
    media: { type: "photo" | "video"; url: string } | null
  ) => void;
  suggestedCheckIn: string;
  setSuggestedCheckIn: (location: string) => void;
  activeCaptureTag: string;
  setActiveCaptureTag: (tag: string) => void;
  videoElement: HTMLVideoElement | null;
  setVideoElement: (el: HTMLVideoElement | null) => void;
  requestLocation: () => void;
  requestCamera: () => Promise<void>;
  requestCameraStop: () => void;
  handleStartRecording: () => void;
  handleStopRecording: () => void;
  handlePhotoSnap: () => void;
}

export const createCameraSlice: StateCreator<
  AppStore,
  [],
  [],
  CameraSlice
> = (set, get) => {
  let recordingInterval: ReturnType<typeof setInterval> | null = null;

  function triggerCurationScan() {
    get().triggerCurationScan();
  }

  function handleStopRecording() {
    playSound("click");
    set({ isRecording: false });
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    if (recordingInterval) clearInterval(recordingInterval);
    recordingInterval = null;
  }

  return {
    cameraPermission: "prompt",
    locationPermission: "prompt",

    cameraMode: "video",
    setCameraMode: (cameraMode) => set({ cameraMode }),
    isRecording: false,
    recordingSeconds: 0,
    isFlashOn: false,
    setIsFlashOn: (isFlashOn) => set({ isFlashOn }),
    capturedMedia: null,
    setCapturedMedia: (capturedMedia) =>
      set({ capturedMedia, curationScore: null }),
    suggestedCheckIn: "Emirates Stadium (Derby Match)",
    setSuggestedCheckIn: (suggestedCheckIn) => set({ suggestedCheckIn }),
    activeCaptureTag: "Goal",
    setActiveCaptureTag: (activeCaptureTag) => set({ activeCaptureTag }),

    videoElement: null,
    setVideoElement: (videoElement) => {
      set({ videoElement });
      if (videoElement && streamRef) {
        if (videoElement.srcObject !== streamRef) {
          videoElement.srcObject = streamRef;
        }
        videoElement.muted = true;
        videoElement.play().catch((err) => console.warn("play err:", err));
      }
    },

    requestLocation: () => {
      set({ suggestedCheckIn: "Locating..." });
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            set({
              locationPermission: "granted",
              suggestedCheckIn: `Check-In (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`,
            });
          },
          (err) => {
            console.warn("Geolocation error, using fallback", err);
            set({ locationPermission: "granted", suggestedCheckIn: "Emirates Stadium (Fallback)" });
          }
        );
      } else {
        set({ locationPermission: "granted", suggestedCheckIn: "Emirates Stadium (Fallback)" });
      }
    },

    requestCameraStop: () => {
      if (streamRef) {
        streamRef.getTracks().forEach((track) => track.stop());
        streamRef = null;
      }
    },

    requestCamera: async () => {
      try {
        let currentMode = "environment";
        if (streamRef) {
          const track = streamRef.getVideoTracks()[0];
          if (track) {
            const settings = track.getSettings();
            if (settings.facingMode === "environment") currentMode = "user";
            else currentMode = "environment";
          }
          streamRef.getTracks().forEach((track) => track.stop());
        }
        
        // Try requesting with facingMode, fallback to generic video if fails (desktop)
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: currentMode },
            audio: false, // Audio request causes significant delays on mobile
          });
        } catch (e) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }
        
        streamRef = stream;
        set({ cameraPermission: "granted" });
        const el = get().videoElement;
        if (el) {
          if (el.srcObject !== stream) {
            el.srcObject = stream;
          }
          el.muted = true; // prevent feedback loop on local playback
          el.play().catch((err) =>
            console.warn("Video playback delayed:", err)
          );
        }
      } catch (err) {
        console.warn("Camera access denied or unavailable: ", err);
        set({ cameraPermission: "denied" });
      }
    },

    handleStartRecording: () => {
      if (!streamRef) return;
      playSound("click");
      set({ isRecording: true, recordingSeconds: 0 });

      recordedChunks = [];
      mediaRecorder = new MediaRecorder(streamRef);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        set({
          capturedMedia: { type: "video", url },
        });
        triggerCurationScan();
      };
      mediaRecorder.start(100);

      if (recordingInterval) clearInterval(recordingInterval);
      recordingInterval = setInterval(() => {
        const current = get().recordingSeconds;
        if (current >= 30) {
          if (recordingInterval) clearInterval(recordingInterval);
          recordingInterval = null;
          handleStopRecording();
        } else {
          set({ recordingSeconds: current + 1 });
        }
      }, 1000);
    },

    handleStopRecording,

    handlePhotoSnap: () => {
      const video = get().videoElement;
      if (!video) return;
      playSound("click");
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const url = canvas.toDataURL("image/jpeg", 0.9);
        set({
          capturedMedia: { type: "photo", url },
        });
        triggerCurationScan();
      }
    },
  };
};
