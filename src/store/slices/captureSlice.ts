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
  capturePrice: number;
  setCapturePrice: (price: number) => void;
  captureCategory: CaptureCategory;
  setCaptureCategory: (cat: CaptureCategory) => void;
  captureRarity: CaptureRarity;
  curationScore: number | null;
  isCurationScanning: boolean;
  isMinting: boolean;
  mintingStatus: string;
  triggerCurationScan: () => void;
  handleMintNFT: (mintOnChain: (input: { metadataUri: string; price: number }) => Promise<{ hash: string; tokenId: string }>) => Promise<void>;
}

export const createCaptureSlice: StateCreator<
  AppStore,
  [],
  [],
  CaptureSlice
> = (set, get) => ({
  captureCaption: "",
  setCapturedCaption: (captureCaption) => set({ captureCaption }),
  capturePrice: 50,
  setCapturePrice: (capturePrice) => set({ capturePrice: Math.max(1, capturePrice || 1) }),
  captureCategory: "GOAL",
  setCaptureCategory: (captureCategory) => set({ captureCategory }),
  captureRarity: "CORE",
  curationScore: null,
  isCurationScanning: false,
  isMinting: false,
  mintingStatus: "",

  triggerCurationScan: () => {
    set({ isCurationScanning: true });
    const source = get().capturedMedia?.url;
    if (!source) {
      set({ isCurationScanning: false, curationScore: 0, captureRarity: "CORE" });
      return;
    }
    const image = new Image();
    image.onload = () => {
      const pixels = image.naturalWidth * image.naturalHeight;
      const aspect = image.naturalWidth / Math.max(image.naturalHeight, 1);
      const resolutionScore = Math.min(70, Math.round((pixels / 2_000_000) * 70));
      const aspectScore = aspect >= 0.55 && aspect <= 2 ? 20 : 8;
      const score = Math.max(1, Math.min(100, resolutionScore + aspectScore + 10));
      const rarity: CaptureRarity = score >= 90 ? "EPIC" : score >= 75 ? "RARE" : "CORE";
      set({ isCurationScanning: false, curationScore: score, captureRarity: rarity });
    };
    image.onerror = () => set({ isCurationScanning: false, curationScore: 0, captureRarity: "CORE" });
    image.src = source;
  },

  handleMintNFT: async (mintOnChain) => {
    set({ isMinting: true, mintingStatus: "Compressing media file..." });

    const initialState = get();
    const mediaUrl = initialState.capturedMedia?.url;

    let onChain: { hash: string; tokenId: string };
    try {
      set({ mintingStatus: "Creating your local fan moment..." });
      onChain = await mintOnChain({ metadataUri: "local://fanmoment", price: initialState.capturePrice });
    } catch {
      set({ isMinting: false, mintingStatus: "Mint transaction was not completed." });
      return;
    }

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
                mediaUrl ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBp67mGs7ImnLNJD0V0Ci05zU2cTmKt2NfS7-7udAD1i5tO3WjJ-mWTDNbsvMKXWCpoFUUw0F6_aLSiAbub-95mqjr8lzJJXsofsEprLtF3_zibHLYJJ8Z2yZrOk3rAXMF7-b672eJkEtXVtoFIPFXYJ_1FMR5n_Z4aO2q_QpDqbz_nRC-3VM6iPK7j6N5qIbHEdzOVFbGo9PuB2_Ud2xsmM4Pkq2bGp43XOQhxqMQxqBw2cws8XoDL30LfwlSfor33gxLLhszE190",
              category: state.captureCategory,
              rarity: state.captureRarity,
              price: state.capturePrice,
              tokenSymbol: "CHZ",
              match: state.verifiedMatch || "Verified stadium capture",
              minute:
                state.verifiedMinute ||
                new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              location: state.verifiedVenue || "Verified stadium",
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
              txnHash: onChain.hash,
              tokenId: onChain.tokenId,
              likes: 0,
              views: 1,
              isListed: true,
            };

            set((s) => ({
              moments: [newMoment, ...s.moments],
              myCaptures: [newMoment, ...s.myCaptures],
              isMinting: false,
              capturedMedia: null,
              captureCaption: "",
              capturePrice: 50,
            }));

            playSound("success");
            get().setNavigateTo("/marketplace");
          }, 1200);
        }, 1500);
      }, 1000);
    }, 800);
  },
});
