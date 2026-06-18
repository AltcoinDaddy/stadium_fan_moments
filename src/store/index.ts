import { create } from "zustand";
import type { AppStore } from "./types";
import { createNavigationSlice } from "./slices/navigationSlice";
import { createSelectedMomentSlice } from "./slices/selectedMomentSlice";
import { createUserSlice } from "./slices/userSlice";
import { createMarketSlice } from "./slices/marketplaceSlice";
import { createCameraSlice } from "./slices/cameraSlice";
import { createCaptureSlice } from "./slices/captureSlice";
import { createBuySlice } from "./slices/buySlice";
import { createNotificationSlice } from "./slices/notificationSlice";
import { createProfileSlice } from "./slices/profileSlice";

export const useAppStore = create<AppStore>()((...args) => ({
  ...createNavigationSlice(...args),
  ...createSelectedMomentSlice(...args),
  ...createUserSlice(...args),
  ...createMarketSlice(...args),
  ...createCameraSlice(...args),
  ...createCaptureSlice(...args),
  ...createBuySlice(...args),
  ...createNotificationSlice(...args),
  ...createProfileSlice(...args),
}));

export type { AppStore } from "./types";
export type {
  ScreenType,
  MarketTabType,
  CameraModeType,
  PermissionState,
  CaptureCategory,
  CaptureRarity,
  ProfileTabType,
  SoundType,
  PushNotification,
  Moment,
} from "./types";
