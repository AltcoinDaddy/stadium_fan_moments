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
  const captureCategory = useAppStore((s) => s.captureCategory);
  const setCaptureCategory = useAppStore((s) => s.setCaptureCategory);
  const cameraMode = useAppStore((s) => s.cameraMode);
  const userWallet = useAppStore((s) => s.userWallet);
  const isMinting = useAppStore((s) => s.isMinting);
  const mintingStatus = useAppStore((s) => s.mintingStatus);
  const handleMintNFT = useAppStore((s) => s.handleMintNFT);

  if (!capturedMedia) return null;

  return (
    <div className="absolute inset-0 bg-[#0B0E11] z-50 flex flex-col p-4 overflow-y-auto no-scrollbar">
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setCapturedMedia(null)}
          className="w-9 h-9 rounded-full bg-[#1d2023] flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-white">
          Preview & Curation check
        </span>
      </div>

      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-black flex-shrink-0">
        <img
          src={capturedMedia.url}
          alt="Captured preview"
          className="w-full h-full object-cover"
        />

        {isCurationScanning && (
          <>
            <div className="absolute inset-0 scanline z-10"></div>
            <div className="absolute inset-0 bg-black/40 z-0 flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-3xl text-[#00eefc] animate-spin">
                cyclone
              </span>
              <span className="text-xs font-mono font-bold text-[#00eefc] animate-pulse uppercase tracking-wider">
                AI Quality scanning...
              </span>
            </div>
          </>
        )}

        {!isCurationScanning && curationScore && (
          <div className="absolute bottom-4 left-4 right-4 bg-[#161B22]/85 backdrop-blur-md border border-white/10 rounded-xl p-3 flex justify-between items-center z-10">
            <div>
              <p className="text-[10px] text-[#c2c7d0] uppercase tracking-widest font-bold">
                AI Curation Grade
              </p>
              <p className="text-lg font-display font-extrabold text-green-400 mt-0.5">
                {curationScore}% PASSED
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                captureRarity === "EPIC"
                  ? "border-[#ff5540] bg-[#ff5540]/10 text-[#ff5540]"
                  : captureRarity === "RARE"
                  ? "border-[#00eefc] bg-[#00eefc]/10 text-[#00eefc]"
                  : "border-white/20 text-white"
              }`}
            >
              {captureRarity} NFT
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 mt-4 mb-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#c2c7d0] uppercase tracking-widest">
            Describe the Moment
          </label>
          <input
            type="text"
            placeholder="e.g. Haaland bicycle kick right in front of row 4! Equalizer!"
            value={captureCaption}
            onChange={(e) => setCapturedCaption(e.target.value)}
            className="h-11 bg-[#1d2023] border border-white/10 rounded-xl px-4 text-sm text-white focus:border-[#00eefc] outline-none transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#c2c7d0] uppercase tracking-widest">
            Collectible Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["GOAL", "SAVE", "CELEBRATION", "CROWD", "TENSION"] as const).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setCaptureCategory(cat)}
                  className={`h-9 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    captureCategory === cat
                      ? "border-[#ff5540] bg-[#ff5540]/10 text-[#ff5540]"
                      : "border-white/10 bg-[#1d2023] text-[#c2c7d0]"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        <div className="bg-[#161B22]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex justify-between items-center text-xs mt-1">
          <div className="flex flex-col gap-1">
            <span className="text-[#c2c7d0] uppercase tracking-widest font-bold">
              Upload & Mint cost
            </span>
            <span className="text-sm font-bold text-white font-mono">
              {cameraMode === "photo" ? "10 CHZ" : "20 CHZ"}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[#c2c7d0] block font-bold uppercase tracking-widest">
              Available Balance
            </span>
            <span className="font-mono text-[#00eefc] block mt-0.5">
              {userWallet.chzBalance} CHZ
            </span>
          </div>
        </div>

        <button
          onClick={handleMintNFT}
          disabled={isCurationScanning || isMinting}
          className="h-13 rounded-full bg-[#ff5540] text-white font-bold uppercase tracking-wider shadow-lg shadow-[#ff5540]/20 active:scale-98 disabled:opacity-50 transition-all mt-2"
        >
          {isMinting ? "Minting Moment..." : "Mint & List collectible"}
        </button>
      </div>

      {isMinting && <LoadingOverlay title="Minting NFT" status={mintingStatus} />}
    </div>
  );
}
