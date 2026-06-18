"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import { playSound } from "@/store/utils";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

export default function DetailScreen() {
  const selectedMoment = useAppStore((s) => s.selectedMoment);
  const setBuySuccess = useAppStore((s) => s.setBuySuccess);
  const userWallet = useAppStore((s) => s.userWallet);
  const isBuying = useAppStore((s) => s.isBuying);
  const buyStatus = useAppStore((s) => s.buyStatus);
  const buySuccess = useAppStore((s) => s.buySuccess);
  const handleBuyNFT = useAppStore((s) => s.handleBuyNFT);
  const router = useRouter();

  if (!selectedMoment) {
    router.push("/marketplace");
    return null;
  }

  return (
    <div className="flex flex-col relative animate-fade min-h-full">
      <div className="relative w-full aspect-[4/5] md:max-h-[500px] bg-[#191c1f] overflow-hidden flex-shrink-0 md:rounded-2xl md:mt-4 md:border md:border-white/10">
        <img
          src={selectedMoment.imageUrl}
          alt={selectedMoment.title}
          className="w-full h-full object-cover filter brightness-90"
        />

        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
          <button
            onClick={() => {
              router.back();
              setBuySuccess(false);
            }}
            className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-lg">
              arrow_back
            </span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => playSound("click")}
              className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-lg">share</span>
            </button>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => playSound("click")}
            className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform"
          >
            <span
              className="material-symbols-outlined text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              play_arrow
            </span>
          </button>
        </div>

        <div className="absolute bottom-0 w-full h-2/5 bg-gradient-to-t from-[#0B0E11] via-[#0B0E11]/75 to-transparent flex flex-col justify-end p-4 pb-6 z-10">
          <div className="flex gap-2 mb-2">
            <span className="px-2 py-0.5 rounded border border-white/15 text-[9px] font-extrabold uppercase tracking-widest text-[#00eefc] bg-black/60 backdrop-blur-sm">
              {selectedMoment.rarity}
            </span>
            <span className="px-2 py-0.5 rounded border border-white/15 text-[9px] font-extrabold uppercase tracking-widest text-white bg-black/60 backdrop-blur-sm">
              {selectedMoment.category}
            </span>
          </div>
          <h2 className="text-xl font-display font-black text-white leading-tight uppercase">
            {selectedMoment.title}
          </h2>
          <p className="text-xs font-medium text-[#c2c7d0] mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-[#ff5540]">
              sports_soccer
            </span>
            {selectedMoment.match} &bull; {selectedMoment.minute}
          </p>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-5 pb-32">
        <div className="bg-[#161B22]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex justify-between items-center text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00eefc]/10 border border-[#00eefc]/30 flex items-center justify-center text-[#00eefc] shadow-[0_0_12px_rgba(0,238,252,0.1)]">
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
            <div>
              <p className="text-[#c2c7d0] uppercase tracking-widest font-bold">
                Serial Scarcity
              </p>
              <p className="text-sm font-bold text-white mt-0.5 text-glow-secondary font-mono">
                #{selectedMoment.serial} / {selectedMoment.maxSerial}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[#c2c7d0] uppercase tracking-widest font-bold">
              Mint Network
            </p>
            <p className="text-white font-mono mt-0.5 flex items-center justify-end gap-1">
              Chiliz Chain
              <span className="material-symbols-outlined text-[12px] text-[#00eefc]">
                open_in_new
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">
            The Story
          </h3>
          <p className="text-sm text-[#c2c7d0] leading-relaxed font-medium">
            {selectedMoment.description}
          </p>
        </div>

        <hr className="border-t border-white/5 my-1" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={selectedMoment.creator.avatar}
              alt="Creator avatar"
              className="w-11 h-11 rounded-full object-cover border border-white/10"
            />
            <div>
              <p className="text-[10px] text-[#c2c7d0] uppercase tracking-widest font-bold">
                Creator
              </p>
              <p className="text-sm font-bold text-white flex items-center gap-1">
                @{selectedMoment.creator.username}
                <span
                  className="material-symbols-outlined text-[#00eefc] text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => playSound("click")}
            className="px-4 py-1.5 rounded-full border border-[#00eefc] text-[#00eefc] text-xs font-bold active:scale-95 transition-transform"
          >
            Follow
          </button>
        </div>

        <hr className="border-t border-white/5 my-1" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={selectedMoment.owner.avatar}
              alt="Owner avatar"
              className="w-11 h-11 rounded-full object-cover border border-white/10"
            />
            <div>
              <p className="text-[10px] text-[#c2c7d0] uppercase tracking-widest font-bold">
                Current Owner
              </p>
              <p className="text-sm font-bold text-white">
                {selectedMoment.owner.username === userWallet.username
                  ? "You (StadiumKing)"
                  : `@${selectedMoment.owner.username}`}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#c2c7d0] bg-white/5 py-1 px-3 rounded-full border border-white/5">
            {selectedMoment.owner.address.slice(0, 8)}...
            {selectedMoment.owner.address.slice(-6)}
          </span>
        </div>

        <section className="bg-[#161B22]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-2.5 text-[11px] font-mono">
          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-body mb-1">
            On-Chain Ledger
          </h4>
          <div className="flex justify-between border-b border-white/5 pb-1.5">
            <span className="text-[#c2c7d0]">Tx Hash:</span>
            <a
              href="#"
              className="text-[#00eefc] truncate max-w-[200px] hover:underline"
            >
              {selectedMoment.txnHash}
            </a>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1.5">
            <span className="text-[#c2c7d0]">Contract:</span>
            <span className="text-white">0x7df4...00eefc</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#c2c7d0]">Token Standard:</span>
            <span className="text-white">ERC-1155 (Chiliz Chain)</span>
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 left-0 w-full p-4 glass-overlay border-t border-white/10 z-40 pb-6 flex items-center justify-between gap-4 select-none mt-auto">
        <div>
          <p className="text-[9px] font-bold text-[#c2c7d0] uppercase tracking-widest">
            Trading Value
          </p>
          <p className="text-lg font-display font-extrabold text-white mt-0.5">
            {selectedMoment.price}{" "}
            <span className="text-xs text-[#c2c7d0] font-bold">
              {selectedMoment.tokenSymbol}
            </span>
          </p>
          <p className="text-[10px] font-mono text-[#c2c7d0]">
            &asymp; ${(selectedMoment.price * 3.6).toFixed(2)} USD
          </p>
        </div>

        {selectedMoment.owner.username === userWallet.username ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-full h-12 px-6 flex items-center justify-center text-green-400 text-xs font-bold uppercase tracking-wider">
            You Own This Moment
          </div>
        ) : buySuccess ? (
          <div className="bg-green-500 text-black rounded-full h-12 px-6 flex items-center justify-center text-xs font-bold uppercase tracking-wider shadow-lg shadow-green-500/20">
            Purchased Successfully!
          </div>
        ) : (
          <button
            onClick={() => handleBuyNFT(selectedMoment)}
            disabled={isBuying}
            className="bg-[#ff5540] text-white text-xs font-bold uppercase tracking-widest h-12 px-8 rounded-full box-glow-primary hover:scale-105 active:scale-95 disabled:opacity-50 transition-all font-display"
          >
            {isBuying ? "Relaying Trade..." : "Buy Moment"}
          </button>
        )}
      </div>

      {isBuying && <LoadingOverlay title="Processing Exchange" status={buyStatus} />}
    </div>
  );
}
