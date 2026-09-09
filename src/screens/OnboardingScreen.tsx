"use client";

import { useRouter } from "@/lib/router-compat";
import { useSearchParams } from "@/lib/router-compat";
import { useAppStore } from "@/store";
import PermissionCard from "@/components/PermissionCard";
import { useLoginWithEmail, usePrivy } from "@privy-io/react-auth";
import { useEffect, useRef, useState } from "react";

const LANDING_IMAGES = ["/onboarding-fan-1.png", "/onboarding-fan-2.png"];
const CHECK_IN_IMAGE = "/marketplace-stadium-hero.png";

function EmailOtpDialog({ onClose }: { onClose: () => void }) {
  const { sendCode, loginWithCode } = useLoginWithEmail();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const requestCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true); setError("");
    try { await sendCode({ email: email.trim() }); setStep("code"); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "We could not send a code. Try again."); }
    finally { setBusy(false); }
  };
  const verifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true); setError("");
    try { await loginWithCode({ code: digits.join("") }); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "That code is not valid. Try again."); }
    finally { setBusy(false); }
  };
  const setDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => current.map((item, itemIndex) => itemIndex === index ? digit : item));
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="FanMoments sign in" className="absolute inset-0 z-50 flex items-end bg-black/55 p-4 backdrop-blur-sm">
      <div className="w-full rounded-[28px] border border-white/10 bg-[#17171f] p-5 text-white shadow-2xl">
        <div className="flex items-center justify-between"><div><p className="text-[13px] font-medium text-white/45">FanMoments</p><h2 className="text-[22px] font-extrabold">{step === "email" ? "Sign in to continue" : "Enter your code"}</h2></div><button type="button" onClick={onClose} aria-label="Close sign in" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"><span className="material-symbols-outlined">close</span></button></div>
        {step === "email" ? (
          <form onSubmit={requestCode} className="mt-6"><p className="text-[14px] leading-relaxed text-white/60">We’ll send a six-digit code to your email.</p><input type="email" required autoFocus value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@email.com" className="mt-4 h-13 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-[16px] outline-none focus:border-lime" />{error && <p className="mt-3 text-[13px] text-red-300">{error}</p>}<button disabled={busy} className="mt-5 h-13 w-full rounded-2xl bg-lime text-[15px] font-extrabold text-[#08080f] disabled:opacity-60">{busy ? "Sending code..." : "Send code"}</button></form>
        ) : (
          <form onSubmit={verifyCode} className="mt-5"><p className="text-[14px] text-white/60">Sent to <span className="font-semibold text-white">{email}</span></p><div className="mt-5 flex justify-between gap-2">{digits.map((digit, index) => <input key={index} ref={(element) => { inputRefs.current[index] = element; }} inputMode="numeric" maxLength={1} value={digit} onChange={(event) => setDigit(index, event.target.value)} onKeyDown={(event) => { if (event.key === "Backspace" && !digits[index] && index > 0) inputRefs.current[index - 1]?.focus(); }} className="h-12 min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 text-center text-[20px] font-extrabold outline-none focus:border-lime" />)}</div>{error && <p className="mt-3 text-[13px] text-red-300">{error}</p>}<button disabled={busy || digits.some((digit) => !digit)} className="mt-5 h-13 w-full rounded-2xl bg-lime text-[15px] font-extrabold text-[#08080f] disabled:opacity-60">{busy ? "Verifying..." : "Verify and continue"}</button><button type="button" onClick={() => { setStep("email"); setDigits(["", "", "", "", "", ""]); setError(""); }} className="mt-3 w-full py-2 text-[13px] font-semibold text-white/55">Use a different email</button></form>
        )}
      </div>
    </div>
  );
}

export default function OnboardingScreen() {
  const { ready, authenticated } = usePrivy();
  const requestLocation = useAppStore((s) => s.requestLocation);
  const requestPreviewCheckIn = useAppStore((s) => s.requestPreviewCheckIn);
  const watchLocationPermission = useAppStore((s) => s.watchLocationPermission);
  const requestCamera = useAppStore((s) => s.requestCamera);
  const cameraPermission = useAppStore((s) => s.cameraPermission);
  const locationPermission = useAppStore((s) => s.locationPermission);
  const suggestedCheckIn = useAppStore((s) => s.suggestedCheckIn);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCameraRequest = searchParams.get("next") === "/snap";
  const [heroImage] = useState(() => LANDING_IMAGES[Math.floor(Math.random() * LANDING_IMAGES.length)]);
  const [showLogin, setShowLogin] = useState(false);
  const canOpenCamera = cameraPermission === "granted" && locationPermission === "granted";

  const openCamera = async () => {
    // Desktop phone previews do not have a dependable hardware GPS source.
    // Keep the real location gate in production, but make the primary camera
    // action usable for local feature testing.
    if (import.meta.env.DEV && locationPermission === "denied") {
      await requestPreviewCheckIn();
      if (cameraPermission !== "granted") await requestCamera();
      return;
    }

    if (!canOpenCamera) {
      if (locationPermission !== "granted") requestLocation();
      if (cameraPermission !== "granted") await requestCamera();
      return;
    }
    router.push("/snap");
  };

  useEffect(() => {
    if (ready && authenticated && !isCameraRequest) router.replace("/marketplace");
  }, [authenticated, isCameraRequest, ready, router]);

  useEffect(() => {
    if (ready && authenticated && isCameraRequest && canOpenCamera) router.replace("/snap");
  }, [authenticated, canOpenCamera, isCameraRequest, ready, router]);

  useEffect(() => {
    if (!ready || !authenticated || !isCameraRequest) return;
    return watchLocationPermission();
  }, [authenticated, isCameraRequest, ready, watchLocationPermission]);

  if (!ready || !authenticated) {
    return (
      <div className="relative h-full min-h-0 flex-1 overflow-hidden bg-[#08080f] text-white">
        <img src={heroImage} alt="Fan capturing a live football moment" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08080f]/10 via-transparent via-40% to-[#08080f]" />
        <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#08080f] via-[#08080f]/75 to-transparent" />
        <div className="relative z-10 flex h-full min-h-0 flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-7">
          <div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime text-[17px] font-extrabold text-[#08080f]">M</span><span className="text-[16px] font-extrabold">FanMoments</span></div>
          <div className="mt-auto">
            <p className="max-w-[9ch] text-[42px] font-extrabold leading-[0.96] tracking-[-0.055em]">Capture the match. Own the moment.</p>
            <p className="mt-4 text-[15px] font-medium leading-relaxed text-white/70">Sign in to capture, collect, and trade authentic fan moments.</p>
            <button type="button" onClick={() => setShowLogin(true)} className="mt-7 flex h-14 w-full items-center justify-between rounded-[18px] bg-lime px-5 text-[16px] font-extrabold text-[#08080f]">Get started <span className="material-symbols-outlined text-[24px]">arrow_forward</span></button>
          </div>
        </div>
        {showLogin && <EmailOtpDialog onClose={() => setShowLogin(false)} />}
      </div>
    );
  }
  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain bg-[#08080f] text-white">
      <section className="relative min-h-[225px] shrink-0 overflow-hidden rounded-b-[32px] bg-[#1732a6]">
        <img src={CHECK_IN_IMAGE} alt="Fans inside a football stadium" className="absolute inset-0 h-full w-full object-cover object-[54%_64%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071163]/75 via-[#08080f]/15 to-[#08080f]" />
        <div className="relative z-10 flex items-start justify-between px-5 pt-6">
          <div>            <p className="mt-3 text-[17px] font-extrabold">FanMoments</p>
          </div>
          <button
            type="button"
            aria-label="Back to marketplace"
            onClick={() => router.push("/marketplace")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#12121a]/70 text-white backdrop-blur-md active:scale-95"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>
        <div className="absolute inset-x-5 bottom-5 z-10">
          <p className="text-[13px] font-semibold text-white/70">Matchday capture</p>
          <h1 className="mt-1 text-[30px] font-extrabold leading-[0.95] tracking-[-0.045em]">Verify you&apos;re at the match</h1>
        </div>
      </section>

      <div className="flex flex-1 flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
        <p className="max-w-[34ch] text-[14px] leading-relaxed text-white/55">
          Grant both permissions to prove your moment happened live in the stands.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <PermissionCard
            icon="location_on"
            title="Location verification"
            subtitle={locationPermission === "denied" ? suggestedCheckIn : "Confirm you are inside stadium geo-fence"}
            permission={locationPermission}
            onGrant={requestLocation}
          />
          <PermissionCard
            icon="photo_camera"
            title="Camera access"
            subtitle="Needed to capture live match snaps"
            permission={cameraPermission}
            onGrant={requestCamera}
          />
        </div>

        {import.meta.env.DEV && locationPermission === "denied" && (
          <button
            type="button"
            onClick={() => void requestPreviewCheckIn()}
            className="mt-4 self-start text-[12px] font-bold text-lime/85 underline underline-offset-4 active:text-lime"
          >
            Use local camera preview
          </button>
        )}

        <div className="mt-auto flex flex-col gap-3 pt-7">
          <button
            type="button"
            onClick={openCamera}
            className="flex h-13 items-center justify-center gap-2 rounded-[18px] bg-lime text-[15px] font-extrabold text-[#08080f] shadow-[0_12px_28px_rgba(186,255,39,0.18)] active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            Open camera
          </button>
          <button type="button" onClick={() => router.push("/marketplace")} className="py-2 text-center text-[13px] font-semibold text-white/45 active:text-white/70">
            Back to marketplace
          </button>
        </div>
      </div>
    </div>
  );
}
