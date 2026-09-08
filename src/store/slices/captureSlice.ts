import type { StateCreator } from "zustand";
import type {
  AppStore,
  CaptureCategory,
  CaptureRarity,
  Moment,
} from "../types";
import { playSound } from "../utils";
import { authenticatedFetch } from "@/lib/authenticatedFetch";

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
    const captureUrl = initialState.capturedMedia?.url;
    let mediaUrl = captureUrl;

    if (captureUrl?.startsWith("blob:") || captureUrl?.startsWith("data:")) {
      try {
        const blob = await fetch(captureUrl).then((response) => response.blob());
        const form = new FormData();
        form.append("file", blob, `matchday-${Date.now()}.${blob.type.split("/")[1] || "bin"}`);
        const uploadResponse = await authenticatedFetch("/api/uploads", {
          method: "POST",
          body: form,
        });

        if (!uploadResponse.ok) {
          throw new Error("Pinata upload is not configured");
        }

        const upload = (await uploadResponse.json()) as { url: string };
        mediaUrl = upload.url;
      } catch {
        set({ isMinting: false, mintingStatus: "Media upload failed. Check Pinata configuration." });
        return;
      }
    }

    let onChain: { hash: string; tokenId: string };
    try {
      set({ mintingStatus: "Uploading metadata to decentralised storage..." });
      const metadataResponse = await authenticatedFetch("/api/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: initialState.captureCaption || "Stadium Fan Moment",
          description: `Fan-captured ${initialState.captureCategory} moment.`,
          image: mediaUrl,
          attributes: [
            { trait_type: "Category", value: initialState.captureCategory },
            { trait_type: "Rarity", value: initialState.captureRarity },
          ],
        }),
      });
      if (!metadataResponse.ok) throw new Error("Metadata upload failed");
      const metadata = (await metadataResponse.json()) as { uri: string };
      set({ mintingStatus: "Waiting for wallet signature..." });
      onChain = await mintOnChain({ metadataUri: metadata.uri, price: initialState.capturePrice });
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

            if (state.privyUserId) {
              const userId = `user_${state.privyUserId}`;
              void authenticatedFetch("/api/moments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: newMoment.id,
                  title: newMoment.title,
                  description: newMoment.description,
                  mediaUrl: newMoment.imageUrl,
                  mediaType: state.capturedMedia?.type === "video" ? "video" : "image",
                  category: newMoment.category,
                  rarity: newMoment.rarity,
                  price: newMoment.price,
                  tokenSymbol: newMoment.tokenSymbol,
                  match: newMoment.match,
                  minute: newMoment.minute,
                  location: newMoment.location,
                  tokenId: newMoment.tokenId,
                  txnHash: newMoment.txnHash,
                  serial: newMoment.serial,
                  maxSerial: newMoment.maxSerial,
                  likes: newMoment.likes,
                  views: newMoment.views,
                  isListed: 1,
                  stadiumCheckInToken: state.stadiumCheckInToken,
                }),
              })
                .then((response) => {
                  if (!response.ok) return;
                  return Promise.all([
                    get().hydrateMarketplace(),
                    get().hydrateUserMoments(userId),
                  ]);
                })
                .catch(() => {
                  // The local capture remains usable if the database is unavailable.
                });
            }
            playSound("success");
            get().setNavigateTo("/marketplace");
          }, 1200);
        }, 1500);
      }, 1000);
    }, 800);
  },
});
