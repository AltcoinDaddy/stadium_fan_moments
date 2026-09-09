import type { StateCreator } from "zustand";
import type { AppStore, CameraModeType, PermissionState } from "../types";
import { authenticatedFetch } from "../../lib/authenticatedFetch";
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
  stadiumCheckInToken: string | null;
  verifiedVenue: string | null;
  verifiedMatch: string | null;
  verifiedMinute: string | null;
  setSuggestedCheckIn: (location: string) => void;
  activeCaptureTag: string;
  setActiveCaptureTag: (tag: string) => void;
  videoElement: HTMLVideoElement | null;
  setVideoElement: (el: HTMLVideoElement | null) => void;
  requestLocation: () => void;
  requestPreviewCheckIn: () => Promise<void>;
  watchLocationPermission: () => () => void;
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
    setIsFlashOn: (isFlashOn) => {
      set({ isFlashOn });
      const track = streamRef?.getVideoTracks()[0];
      if (!track || typeof track.applyConstraints !== "function") return;
      void track.applyConstraints({
        advanced: [{ torch: isFlashOn } as MediaTrackConstraintSet],
      }).catch(() => {
        // Keep the toggle usable on cameras that do not expose torch control.
      });
    },
    capturedMedia: null,
    setCapturedMedia: (capturedMedia) =>
      set({ capturedMedia, curationScore: null }),
    suggestedCheckIn: "Stadium check-in required",
    stadiumCheckInToken: null,
    verifiedVenue: null,
    verifiedMatch: null,
    verifiedMinute: null,
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

    watchLocationPermission: () => {
      if (typeof navigator === "undefined" || !navigator.permissions) {
        return () => undefined;
      }

      let stopped = false;
      let permissionStatus: PermissionStatus | null = null;

      const syncPermission = () => {
        if (stopped || !permissionStatus) return;

        if (permissionStatus.state === "denied") {
          set({
            locationPermission: "denied",
            stadiumCheckInToken: null,
            verifiedVenue: null,
            verifiedMatch: null,
            verifiedMinute: null,
            suggestedCheckIn:
              "Location is blocked in browser settings. Allow it, then retry.",
          });
          return;
        }

        // A granted browser permission only means the browser may share a
        // location. The stadium API still needs a fresh position before a
        // capture is allowed, so do not treat this as a completed check-in.
        if (permissionStatus.state === "prompt" && get().locationPermission === "granted") {
          set({
            locationPermission: "prompt",
            stadiumCheckInToken: null,
            verifiedVenue: null,
            verifiedMatch: null,
            verifiedMinute: null,
            suggestedCheckIn: "Stadium check-in required",
          });
        }
      };

      void navigator.permissions
        .query({ name: "geolocation" })
        .then((status) => {
          if (stopped) return;
          permissionStatus = status;
          syncPermission();
          status.addEventListener("change", syncPermission);
        })
        .catch(() => {
          // Older browsers can still use getCurrentPosition when the user taps Grant.
        });

      return () => {
        stopped = true;
        permissionStatus?.removeEventListener("change", syncPermission);
      };
    },

    requestLocation: async () => {
      set({ suggestedCheckIn: "Locating..." });
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        set({
          locationPermission: "denied",
          stadiumCheckInToken: null,
          suggestedCheckIn: "Location verification is unavailable",
        });
        return;
      }

      // Do not use Permissions API state as a hard gate here. Embedded WebKit
      // browsers can report a stale "denied" value even after the host app is
      // enabled in system settings; a user-triggered geolocation request is
      // the authoritative check and may still display the native prompt.
      const getPosition = (options: PositionOptions) =>
        new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });

      const verifyPosition = async (position: GeolocationPosition) => {
        const response = await authenticatedFetch("/api/stadium-check-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          }),
        });
        if (!response.ok) {
          const error = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(error?.error || "Stadium verification failed");
        }
        const checkin = (await response.json()) as {
          venueName: string;
          match: string;
          minute: string;
          token: string;
        };
        set({
          locationPermission: "granted",
          stadiumCheckInToken: checkin.token,
          verifiedVenue: checkin.venueName,
          verifiedMatch: checkin.match,
          verifiedMinute: checkin.minute,
          suggestedCheckIn: `${checkin.venueName} • Verified`,
        });
      };

      try {
        const position = await getPosition({
          enableHighAccuracy: true,
          timeout: 15_000,
          maximumAge: 0,
        });
        await verifyPosition(position);
      } catch (error) {
        // Safari can time out while CoreLocation is warming up, just as iOS
        // can report kCLErrorLocationUnknown. Retry both transient failures
        // with a less demanding reading and allow a recent cached position.
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          (error.code === GeolocationPositionError.POSITION_UNAVAILABLE ||
            error.code === GeolocationPositionError.TIMEOUT)
        ) {
          set({ suggestedCheckIn: "Finding a location signal..." });
          try {
            const position = await getPosition({
              enableHighAccuracy: false,
              timeout: 20_000,
              maximumAge: 60_000,
            });
            await verifyPosition(position);
            return;
          } catch (retryError) {
            error = retryError;
          }
        }

        const code =
          typeof error === "object" && error !== null && "code" in error
            ? error.code
            : undefined;
        const message =
          code === GeolocationPositionError.PERMISSION_DENIED
            ? "Location permission was denied"
            : code === GeolocationPositionError.TIMEOUT
            ? "Location request timed out"
            : error instanceof Error
            ? error.message
            : "Location signal is unavailable. Move outdoors and retry.";
        set({
          locationPermission: "denied",
          stadiumCheckInToken: null,
          verifiedVenue: null,
          verifiedMatch: null,
          verifiedMinute: null,
          suggestedCheckIn: message,
        });
      }
    },

    requestPreviewCheckIn: async () => {
      if (!import.meta.env.DEV) return;
      set({ suggestedCheckIn: "Preparing local camera preview..." });
      try {
        const response = await authenticatedFetch("/api/stadium-check-in", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-fanmoments-preview-checkin": "1",
          },
          body: JSON.stringify({ latitude: 0, longitude: 0, accuracy: 10 }),
        });
        if (!response.ok) {
          const error = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(error?.error || "Local preview check-in failed");
        }
        const checkin = (await response.json()) as {
          venueName: string;
          match: string;
          minute: string;
          token: string;
        };
        set({
          locationPermission: "granted",
          stadiumCheckInToken: checkin.token,
          verifiedVenue: checkin.venueName,
          verifiedMatch: checkin.match,
          verifiedMinute: checkin.minute,
          suggestedCheckIn: "Local preview verified",
        });
      } catch (error) {
        set({
          locationPermission: "denied",
          stadiumCheckInToken: null,
          suggestedCheckIn:
            error instanceof Error ? error.message : "Local preview check-in failed",
        });
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
        } catch {
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
      if (!streamRef || get().locationPermission !== "granted") return;
      playSound("click");
      set({ isRecording: true, recordingSeconds: 0 });

      recordedChunks = [];
      const mimeType = [
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
        "video/mp4",
      ].find((type) => MediaRecorder.isTypeSupported(type));
      mediaRecorder = mimeType
        ? new MediaRecorder(streamRef, { mimeType })
        : new MediaRecorder(streamRef);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, {
          type: mediaRecorder?.mimeType || mimeType || "video/webm",
        });
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
      if (get().locationPermission !== "granted") return;
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
