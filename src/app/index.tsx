import { createFileRoute } from "@tanstack/react-router";
import OnboardingScreen from "@/screens/OnboardingScreen";

export const Route = createFileRoute("/")({
  ssr: false,
  component: OnboardingScreen,
});
