"use client";

import { useAppStore } from "@/store";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

export default function CapturePreview() {
  const capturedMedia = useAppStore((s) => s.capturedMedia);
  const setCapturedMedia = useAppStore((s) => s.setCapturedMedia);
  const isCurationScanning = useAppStore((s) => s.isCurationScanning);
  const curationScore = useAppStore((s) => s.curationScore);
  const captureRarity = useAppStore((s) => s.captureRarity);
  const captureCaption = useAppStore((s) => s.captureCaption);
  const setCapturedCaption = useAppStore((s) => s.setCapturedCaption);
  const capturePrice = useAppStore((s) => s.capturePrice);
  const setCapturePrice = useAppStore((s) => s.setCapturePrice);
  const captureCategory = useAppStore((s) => s.captureCategory);
  const setCaptureCategory = useAppStore((s) => s.setCaptureCategory);
  const cameraMode = useAppStore((s) => s.cameraMode);
  const userWallet = useAppStore((s) => s.userWallet);
  const isMinting = useAppStore((s) => s.isMinting);
  const mintingStatus = useAppStore((s) => s.mintingStatus);
  const handleMintNFT = useAppStore((s) => s.handleMintNFT);
  const mintOnChain = async () => ({
    hash: `local-${Date.now().toString(16)}`,
    tokenId: String(Date.now()),
  });

  if (!capturedMedia) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col overflow-y-auto bg-background p-5 no-scrollbar">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => setCapturedMedia(null)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-[0_6px_16px_rgba(17,17,17,0.06)] active:scale-90"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
        </button>
        <span className="text-[15px] font-semibold text-ink">Preview and mint</span>
      </div>

      <div className="relative aspect-[3/4] shrink-0 overflow-hidden rounded-[28px] bg-white">
        {capturedMedia.type === "video" ? (
          <video
            src={capturedMedia.url}
            aria-label="Captured video preview"
            className="h-full w-full object-cover"
            controls
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={capturedMedia.url}
            alt="Captured preview"
            className="h-full w-full object-cover"
          />
        )}

        {isCurationScanning && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-ink/40">
            <span className="material-symbols-outlined animate-spin text-3xl text-lime">cyclone</span>
            <span className="text-xs font-bold tracking-wide text-white">Quality scanning...</span>
          </div>
        )}

        {!isCurationScanning && curationScore && (
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between rounded-[20px] bg-white p-3">
            <div>
              <p className="text-[11px] font-medium text-muted">Curation grade</p>
              <p className="mt-0.5 text-lg font-extrabold text-ink">
                {curationScore}% passed
              </p>
            </div>
            <span className="rounded-full bg-lime px-3 py-1 text-[10px] font-bold text-ink">
              {captureRarity}
            </span>
          </div>
        )}
      </div>

      <div className="mb-6 mt-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted">Describe the moment</label>
          <input
            type="text"
            placeholder="e.g. Bicycle kick from row 4"
            value={captureCaption}
            onChange={(e) => setCapturedCaption(e.target.value)}
            className="h-12 rounded-[18px] bg-white px-4 text-[15px] text-ink outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted">Listing price (CHZ)</label>
          <input
            type="number"
            min="1"
            step="1"
            value={capturePrice}
            onChange={(e) => setCapturePrice(Number(e.target.value))}
            className="h-12 rounded-[18px] bg-white px-4 text-[15px] text-ink outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-muted">Category</label>
          <div className="grid grid-cols-3 gap-2">
            {(["GOAL", "SAVE", "CELEBRATION", "CROWD", "TENSION"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCaptureCategory(cat)}
                className={`h-10 rounded-full text-[10px] font-bold tracking-wide transition-colors ${
                  captureCategory === cat ? "bg-ink text-white" : "bg-white text-ink"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between rounded-[24px] bg-mint p-4 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-ink/70">Mint cost</span>
            <span className="text-lg font-extrabold text-ink">
              {cameraMode === "photo" ? "10 CHZ" : "20 CHZ"}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-xs text-ink/70">Available</span>
            <span className="mt-0.5 block font-semibold text-ink">
              {userWallet.chzBalance} CHZ
            </span>
          </div>
        </div>

        <button
          onClick={() => void handleMintNFT(mintOnChain)}
          disabled={isCurationScanning || isMinting}
          className="mt-2 h-12 rounded-full bg-lime text-[15px] font-bold text-ink active:scale-[0.98] disabled:opacity-50"
        >
          {isMinting ? "Minting moment..." : "Mint and list"}
        </button>
      </div>

      {isMinting && <LoadingOverlay title="Minting NFT" status={mintingStatus} />}
    </div>
  );
}
