"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import { usePrivy } from "@privy-io/react-auth";
import PermissionCard from "@/components/PermissionCard";

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const { login, ready, authenticated } = usePrivy();
  const requestLocation = useAppStore((s) => s.requestLocation);
  const requestCamera = useAppStore((s) => s.requestCamera);
  const cameraPermission = useAppStore((s) => s.cameraPermission);
  const locationPermission = useAppStore((s) => s.locationPermission);
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      setStep(1);
    }
  }, [ready, authenticated]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0E11] text-[#e1e2e7] font-body overflow-x-hidden relative items-center justify-center py-12 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#ff5540]/5 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00eefc]/5 rounded-full blur-3xl pointer-events-none z-0"></div>

      <div className="relative w-full max-w-[440px] bg-[#111417]/80 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden flex flex-col z-10 shadow-2xl">
        <div className="flex-grow flex flex-col p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#ff5540]/10 via-transparent to-transparent"></div>

          <div className="flex justify-center mt-8 mb-4">
            <span className="text-[28px] font-display font-black tracking-tighter text-[#ff5540] uppercase text-glow-primary">
              MATCHDAY
            </span>
          </div>

          {step === 0 && (
            <div className="flex-grow flex flex-col justify-between py-6">
              <div className="relative w-full aspect-square flex items-center justify-center mt-2">
                <div className="absolute w-[80%] h-[80%] bg-[#ff5540]/10 rounded-full blur-2xl animate-pulse"></div>

                <div className="relative z-10 w-full flex flex-col items-center text-center transition-all fade-in">
                  <div className="w-48 h-48 rounded-[24px] overflow-hidden border border-white/10 shadow-2xl relative mb-6">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp67mGs7ImnLNJD0V0Ci05zU2cTmKt2NfS7-7udAD1i5tO3WjJ-mWTDNbsvMKXWCpoFUUw0F6_aLSiAbub-95mqjr8lzJJXsofsEprLtF3_zibHLYJJ8Z2yZrOk3rAXMF7-b672eJkEtXVtoFIPFXYJ_1FMR5n_Z4aO2q_QpDqbz_nRC-3VM6iPK7j6N5qIbHEdzOVFbGo9PuB2_Ud2xsmM4Pkq2bGp43XOQhxqMQxqBw2cws8XoDL30LfwlSfor33gxLLhszE190"
                      alt="Stadium Live match"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                    <span className="absolute bottom-3 left-3 bg-[#00eefc]/10 border border-[#00eefc]/30 px-2 py-0.5 rounded text-[10px] text-[#00eefc] font-mono font-bold tracking-widest uppercase">
                      Verified Seat
                    </span>
                  </div>
                  <h2 className="text-[22px] font-display font-extrabold text-white leading-tight uppercase px-4">
                    Live the dream, trade the moment
                  </h2>
                  <p className="text-sm text-[#c2c7d0] mt-3 px-6 leading-relaxed">
                    Physically at the game? Capture epic stadium moments, mint
                    them on-chain instantly, and trade with fellow fans.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4 relative z-20">
                <p className="text-xs text-[#c2c7d0] text-center uppercase tracking-widest font-semibold mb-1">
                  Create Embedded Wallet
                </p>

                <button
                  onClick={() => login()}
                  className="w-full h-13 rounded-full bg-white hover:bg-zinc-200 text-black flex items-center justify-center gap-3 font-semibold transition-transform active:scale-98 shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">mail</span>
                  <span>Sign in with Email</span>
                </button>

                <div className="flex justify-between items-center px-4 mt-2">
                  <span className="text-[11px] text-[#c2c7d0] font-mono">
                    By signing up you agree to Terms
                  </span>
                  <button className="text-[11px] text-[#ff5540] font-bold uppercase tracking-wider hover:underline flex items-center gap-0.5 cursor-pointer">
                    Socios Link{" "}
                    <span className="material-symbols-outlined text-[10px]">
                      open_in_new
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex-grow flex flex-col justify-between py-6 transition-all fade-in">
              <div className="flex flex-col items-center text-center mt-6">
                <div className="w-16 h-16 rounded-full bg-[#00eefc]/10 border border-[#00eefc]/30 flex items-center justify-center text-[#00eefc] shadow-[0_0_20px_rgba(0,238,252,0.15)] mb-6 animate-pulse">
                  <span className="material-symbols-outlined text-3xl">
                    security
                  </span>
                </div>
                <h2 className="text-[22px] font-display font-extrabold text-white leading-tight uppercase px-4">
                  Verification Setup
                </h2>
                <p className="text-sm text-[#c2c7d0] mt-3 px-6 leading-relaxed">
                  To guarantee only genuine supporters at the stadium can mint
                  moments, verify your location and camera access.
                </p>
              </div>

              <div className="flex flex-col gap-4 px-2 my-auto">
                <PermissionCard
                  icon="location_on"
                  title="Location verification"
                  subtitle="Confirm you are inside stadium geo-fence"
                  permission={locationPermission}
                  onGrant={requestLocation}
                />
                <PermissionCard
                  icon="photo_camera"
                  title="Camera Permissions"
                  subtitle="Needed to capture live match snaps"
                  permission={cameraPermission}
                  onGrant={requestCamera}
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    if (cameraPermission === "granted") {
                      requestCamera();
                    }
                    router.push("/marketplace");
                  }}
                  className="w-full h-13 rounded-full bg-[#ff5540] text-white font-bold uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition-all"
                >
                  Enter Matchday
                </button>
                <button
                  onClick={() => router.push("/marketplace")}
                  className="text-xs text-[#c2c7d0] hover:text-white uppercase tracking-widest text-center py-2"
                >
                  Skip Setup for now
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => setStep(0)}
              className={`w-2 h-2 rounded-full transition-colors ${
                step === 0 ? "bg-[#ff5540]" : "bg-white/20"
              }`}
            />
            <button
              onClick={() => setStep(1)}
              className={`w-2 h-2 rounded-full transition-colors ${
                step === 1 ? "bg-[#ff5540]" : "bg-white/20"
              }`}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
