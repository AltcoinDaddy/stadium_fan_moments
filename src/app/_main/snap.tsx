import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import SnapScreen from "@/screens/SnapScreen";
import { useAppStore } from "@/store";
import { useRouter } from "@tanstack/react-router";
import { usePrivy } from "@privy-io/react-auth";

function SnapRoute() {
  const cameraPermission = useAppStore((state) => state.cameraPermission);
  const locationPermission = useAppStore((state) => state.locationPermission);
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const readyToCapture = cameraPermission === "granted" && locationPermission === "granted";

  useEffect(() => {
    if (!ready) return;
    if (!authenticated) {
      void router.navigate({ to: "/" });
      return;
    }
    if (!readyToCapture) void router.navigate({ to: "/onboarding", search: { next: "/snap" } });
  }, [authenticated, ready, readyToCapture, router]);

  return ready && authenticated && readyToCapture ? <SnapScreen /> : null;
}

export const Route = createFileRoute("/_main/snap")({ ssr: false, component: SnapRoute });
