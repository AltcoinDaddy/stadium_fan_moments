import { createFileRoute } from "@tanstack/react-router";
import { use } from "react";
import TrendingScreen from "@/screens/TrendingScreen";
import { getSportsMatches } from "@/server/functions";

export const Route = createFileRoute("/_main/trending")({
  ssr: "data-only",
  loader: () => ({ matches: getSportsMatches() }),
  component: TrendingRoute,
});

function TrendingRoute() {
  const { matches: matchesPromise } = Route.useLoaderData();
  const { matches } = use(matchesPromise);
  return <TrendingScreen initialMatches={matches} />;
}
