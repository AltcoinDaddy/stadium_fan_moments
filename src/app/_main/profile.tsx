import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import ProfileScreen from "@/screens/ProfileScreen";

const profileSearch = z.object({ tab: z.enum(["captures", "collection"]).optional() });

export const Route = createFileRoute("/_main/profile")({
  ssr: "data-only",
  validateSearch: (search) => profileSearch.parse(search),
  component: ProfileRoute,
});

function ProfileRoute() {
  const { tab } = Route.useSearch();
  return <ProfileScreen initialTab={tab} />;
}
