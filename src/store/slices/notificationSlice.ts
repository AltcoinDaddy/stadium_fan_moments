import type { StateCreator } from "zustand";
import type { AppStore, PushNotification } from "../types";

export interface NotificationSlice {
  activeNotification: PushNotification | null;
  setActiveNotification: (notif: PushNotification | null) => void;
}

export const createNotificationSlice: StateCreator<
  AppStore,
  [],
  [],
  NotificationSlice
> = (set) => ({
  activeNotification: null,
  setActiveNotification: (activeNotification) => set({ activeNotification }),
});
