import type { StateCreator } from "zustand";
import type {
  AppStore,
  CaptureCategory,
  CaptureRarity,
  Moment,
} from "../types";
import { playSound } from "../utils";

export interface CaptureSlice {
  captureCaption: string;
  setCapturedCaption: (caption: string) => void;
  captureCategory: CaptureCategory;
  setCaptureCategory: (cat: CaptureCategory) => void;
  captureRarity: CaptureRarity;
  curationScore: number | null;
  isCurationScanning: boolean;
  isMinting: boolean;
  mintingStatus: string;
  triggerCurationScan: () => void;
  handleMintNFT: () => void;
}

export const createCaptureSlice: StateCreator<
  AppStore,
  [],
  [],
  CaptureSlice
> = (set, get) => ({
  captureCaption: "",
  setCapturedCaption: (captureCaption) => set({ captureCaption }),
  captureCategory: "GOAL",
  setCaptureCategory: (captureCategory) => set({ captureCategory }),
  captureRarity: "CORE",
  curationScore: null,
  isCurationScanning: false,
  isMinting: false,
  mintingStatus: "",

  triggerCurationScan: () => {
    set({ isCurationScanning: true });
    setTimeout(() => {
      const score = Math.floor(Math.random() * 15) + 82;
      const rarity: CaptureRarity =
        score >= 93 ? "EPIC" : score >= 87 ? "RARE" : "CORE";
      set({
        isCurationScanning: false,
        curationScore: score,
        captureRarity: rarity,
      });
    }, 2000);
  },

  handleMintNFT: () => {
    set({ isMinting: true, mintingStatus: "Compressing media file..." });

    setTimeout(() => {
      set({
        mintingStatus: "Uploading metadata to decentralised storage...",
      });
      setTimeout(() => {
        set({
          mintingStatus: "Relaying gasless mint tx to Chiliz Chain...",
        });
        setTimeout(() => {
          set({ mintingStatus: "Mint confirmed! Block #1480921" });
          setTimeout(() => {
            const state = get();
            const newMoment: Moment = {
              id: "my-" + Date.now(),
              title: state.captureCaption || "Starlight Equalizer",
              description: `An authentic, fan-captured live stadium moment of a match-day highlight. Category: ${state.captureCategory}. Minted via Matchday app with location validation.`,
              imageUrl:
                state.capturedMedia?.url ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBp67mGs7ImnLNJD0V0Ci05zU2cTmKt2NfS7-7udAD1i5tO3WjJ-mWTDNbsvMKXWCpoFUUw0F6_aLSiAbub-95mqjr8lzJJXsofsEprLtF3_zibHLYJJ8Z2yZrOk3rAXMF7-b672eJkEtXVtoFIPFXYJ_1FMR5n_Z4aO2q_QpDqbz_nRC-3VM6iPK7j6N5qIbHEdzOVFbGo9PuB2_Ud2xsmM4Pkq2bGp43XOQhxqMQxqBw2cws8XoDL30LfwlSfor33gxLLhszE190",
              category: state.captureCategory,
              rarity: state.captureRarity,
              price:
                state.captureRarity === "EPIC"
                  ? 300
                  : state.captureRarity === "RARE"
                  ? 150
                  : 50,
              tokenSymbol: "CHZ",
              match: "Arsenal vs Manchester City",
              minute: "75'",
              location: "Emirates Stadium",
              creator: {
                username: state.userWallet.username,
                avatar: state.userWallet.avatar,
                address: state.userWallet.address,
              },
              owner: {
                username: state.userWallet.username,
                avatar: state.userWallet.avatar,
                address: state.userWallet.address,
              },
              serial: 1,
              maxSerial:
                state.captureRarity === "EPIC"
                  ? 100
                  : state.captureRarity === "RARE"
                  ? 500
                  : 2500,
              timestamp: new Date().toISOString(),
              txnHash:
                "0x" +
                Array.from({ length: 64 }, () =>
                  Math.floor(Math.random() * 16).toString(16)
                ).join(""),
              likes: 0,
              views: 1,
              isListed: true,
            };

            const fee = state.cameraMode === "photo" ? 10 : 20;
            set((s) => ({
              userWallet: {
                ...s.userWallet,
                chzBalance: s.userWallet.chzBalance - fee,
              },
              moments: [newMoment, ...s.moments],
              myCaptures: [newMoment, ...s.myCaptures],
              isMinting: false,
              capturedMedia: null,
              captureCaption: "",
            }));
            playSound("success");
            get().setNavigateTo("/marketplace");
          }, 1200);
        }, 1500);
      }, 1000);
    }, 800);
  },
});
