import type { Moment } from "@/data/mockData";

export type ScreenType =
  | "onboarding"
  | "marketplace"
  | "snap"
  | "trending"
  | "profile"
  | "detail";
export type MarketTabType = "FOR_YOU" | "TRENDING" | "LIVE";
export type CameraModeType = "photo" | "video";
export type PermissionState = "prompt" | "granted" | "denied";
export type CaptureCategory =
  | "GOAL"
  | "SAVE"
  | "CELEBRATION"
  | "CROWD"
  | "TENSION";
export type CaptureRarity = "CORE" | "RARE" | "EPIC" | "LEGENDARY";
export type ProfileTabType = "CAPTURES" | "COLLECTION";
export type SoundType = "click" | "success" | "alert";

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon: string;
  type: "goal" | "sale" | "trend";
  momentId?: string;
}

export type { Moment };

export type AppStore = NavigationSlice &
  UserSlice &
  MarketSlice &
  CameraSlice &
  CaptureSlice &
  BuySlice &
  NotificationSlice &
  ProfileSlice &
  SelectedMomentSlice;

import type {
  NavigationSlice,
} from "./slices/navigationSlice";
import type { UserSlice } from "./slices/userSlice";
import type { MarketSlice } from "./slices/marketplaceSlice";
import type { CameraSlice } from "./slices/cameraSlice";
import type { CaptureSlice } from "./slices/captureSlice";
import type { BuySlice } from "./slices/buySlice";
import type { NotificationSlice } from "./slices/notificationSlice";
import type { ProfileSlice } from "./slices/profileSlice";
import type { SelectedMomentSlice } from "./slices/selectedMomentSlice";
