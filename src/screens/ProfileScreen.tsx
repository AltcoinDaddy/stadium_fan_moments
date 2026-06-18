"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import { playSound } from "@/store/utils";

export default function ProfileScreen() {
  const userWallet = useAppStore((s) => s.userWallet);
  const profileTab = useAppStore((s) => s.profileTab);
  const setProfileTab = useAppStore((s) => s.setProfileTab);
  const myCaptures = useAppStore((s) => s.myCaptures);
  const moments = useAppStore((s) => s.moments);
  const setSelectedMoment = useAppStore((s) => s.setSelectedMoment);
  const router = useRouter();

  const collectedMoments = moments.filter(
    (m) =>
      m.owner.username === userWallet.username &&
      m.creator.username !== userWallet.username
  );

  return (
    <div className="p-4 flex flex-col gap-5 animate-fade">
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-[#1d2023] flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
        </button>
        <span className="text-xs font-bold uppercase tracking-widest text-white">
          Owner Hub
        </span>
        <button
          onClick={() => playSound("click")}
          className="w-9 h-9 rounded-full bg-[#1d2023] flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-lg">settings</span>
        </button>
      </div>

      <section className="flex flex-col items-center relative mt-2">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#ff5540]/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="relative w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-[#ff5540] to-[#00eefc] mb-3 shadow-lg shadow-[#ff5540]/15">
          <img
            src={userWallet.avatar}
            alt="Profile photo"
            className="w-full h-full rounded-full object-cover border-4 border-[#0B0E11]"
          />
        </div>
        <h2 className="text-lg font-display font-extrabold text-white uppercase">
          @{userWallet.username}
        </h2>
        <div className="mt-1.5 flex items-center gap-1.5 bg-[#00eefc]/10 border border-[#00eefc]/20 px-3 py-1 rounded-full">
          <span
            className="material-symbols-outlined text-[#00eefc] text-[15px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
          <span className="text-[10px] font-bold text-[#00eefc] uppercase tracking-widest">
            Pro Capturer
          </span>
        </div>
      </section>

      <section className="bg-[#161B22]/80 backdrop-blur-md border border-white/10 rounded-3xl p-5 relative overflow-hidden shadow-xl mt-1">
        <div className="absolute -right-10 -top-10 w-36 h-36 bg-[#00eefc]/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] font-bold text-[#c2c7d0] uppercase tracking-widest">
              Total Capturer Income
            </p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <h3 className="text-3xl font-display font-black text-[#ffb4a8] leading-none">
                1,250
              </h3>
              <span className="text-xs font-bold text-white">BAR</span>
            </div>
            <p className="text-[10px] text-[#c2c7d0] font-mono mt-1">
              &asymp; $4,500.00 USD
            </p>
          </div>
          <div className="bg-[#1d2023] p-2.5 rounded-full border border-white/5 text-[#ff5540]">
            <span className="material-symbols-outlined text-[22px]">
              account_balance_wallet
            </span>
          </div>
        </div>

        <div className="h-10 w-full mb-4 mt-2">
          <svg
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 100 30"
          >
            <defs>
              <linearGradient id="chartGrad" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#ffb4a8" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#ffb4a8" stopOpacity="1" />
                <stop offset="100%" stopColor="#00eefc" stopOpacity="1" />
              </linearGradient>
              <linearGradient
                id="fillGrad"
                x1="0%"
                x2="0%"
                y1="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ffb4a8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ffb4a8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,25 Q10,18 20,20 T40,12 T60,15 T80,5 T100,2"
              fill="none"
              stroke="url(#chartGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M0,25 Q10,18 20,20 T40,12 T60,15 T80,5 T100,2 L100,30 L0,30 Z"
              fill="url(#fillGrad)"
            />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-xs">
          <div>
            <p className="text-[#c2c7d0] uppercase tracking-widest font-bold">
              Moments Sold
            </p>
            <p className="text-base font-extrabold text-white font-mono mt-0.5">
              42
            </p>
          </div>
          <div>
            <p className="text-[#c2c7d0] uppercase tracking-widest font-bold">
              Royalty Income
            </p>
            <p className="text-base font-extrabold text-[#00eefc] font-mono mt-0.5">
              150 BAR
            </p>
          </div>
        </div>
      </section>

      <div className="flex border-b border-white/10 mt-1 select-none">
        <button
          onClick={() => setProfileTab("CAPTURES")}
          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest text-center transition-colors relative ${
            profileTab === "CAPTURES"
              ? "text-[#ffb4a8]"
              : "text-[#c2c7d0] hover:text-white"
          }`}
        >
          My Captures ({myCaptures.length})
          {profileTab === "CAPTURES" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ffb4a8] rounded-full"></div>
          )}
        </button>
        <button
          onClick={() => setProfileTab("COLLECTION")}
          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest text-center transition-colors relative ${
            profileTab === "COLLECTION"
              ? "text-[#ffb4a8]"
              : "text-[#c2c7d0] hover:text-white"
          }`}
        >
          My Collection ({collectedMoments.length})
          {profileTab === "COLLECTION" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ffb4a8] rounded-full"></div>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-8">
        {profileTab === "CAPTURES" ? (
          <>
            {myCaptures.map((moment) => (
              <div
                key={moment.id}
                onClick={() => {
                  setSelectedMoment(moment);
                  router.push("/detail");
                }}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 bg-[#161B22] flex flex-col justify-end"
              >
                <img
                  src={moment.imageUrl}
                  alt={moment.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>

                <div className="absolute top-2 left-2 right-2 flex justify-between z-20">
                  <span className="bg-[#00eefc]/10 border border-[#00eefc]/30 px-2 py-0.5 rounded text-[8px] font-bold text-[#00eefc] uppercase tracking-wider">
                    {moment.isListed ? "Listed" : "Minted"}
                  </span>
                </div>

                <div className="p-3 relative z-10">
                  <p className="text-[9px] font-mono text-[#c2c7d0] uppercase">
                    #{moment.serial.toString().padStart(4, "0")}
                  </p>
                  <h4 className="text-xs font-display font-extrabold text-white uppercase tracking-wide line-clamp-1 leading-tight">
                    {moment.title}
                  </h4>
                </div>
              </div>
            ))}

            <div
              onClick={() => router.push("/snap")}
              className="relative aspect-[3/4] rounded-2xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center justify-center gap-2.5 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#1d2023] flex items-center justify-center text-[#ff5540] border border-white/5 shadow-md">
                <span className="material-symbols-outlined text-lg">add</span>
              </div>
              <span className="text-[11px] font-bold uppercase text-[#c2c7d0] tracking-wider">
                Snap New Moment
              </span>
            </div>
          </>
        ) : (
          <>
            {collectedMoments.length > 0 ? (
              collectedMoments.map((moment) => (
                <div
                  key={moment.id}
                  onClick={() => {
                    setSelectedMoment(moment);
                    router.push("/detail");
                  }}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 bg-[#161B22] flex flex-col justify-end"
                >
                  <img
                    src={moment.imageUrl}
                    alt={moment.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>

                  <div className="absolute top-2 left-2 right-2 flex justify-between z-20">
                    <span className="bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded text-[8px] font-bold text-amber-400 uppercase tracking-wider">
                      Collected
                    </span>
                  </div>

                  <div className="p-3 relative z-10">
                    <p className="text-[9px] font-mono text-[#c2c7d0] uppercase">
                      #{moment.serial.toString().padStart(4, "0")}
                    </p>
                    <h4 className="text-xs font-display font-extrabold text-white uppercase tracking-wide line-clamp-1 leading-tight">
                      {moment.title}
                    </h4>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-3xl text-[#c2c7d0]">
                  category
                </span>
                <p className="text-xs text-[#c2c7d0] font-bold uppercase tracking-widest leading-relaxed">
                  No collected moments yet.
                  <br />
                  Buy them on the Marketplace.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
