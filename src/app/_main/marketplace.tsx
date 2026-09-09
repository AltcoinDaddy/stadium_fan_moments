import { createFileRoute } from "@tanstack/react-router";
import { use } from "react";
import MarketplaceScreen from "@/screens/MarketplaceScreen";
import { getMarketplaceMoments } from "@/server/functions";

export const Route = createFileRoute("/_main/marketplace")({
  ssr: "data-only",
  loader: () => ({ moments: getMarketplaceMoments({ data: { listed: true } }) }),
  component: MarketplaceRoute,
});

function MarketplaceRoute() {
  const { moments: momentsPromise } = Route.useLoaderData();
  const { moments } = use(momentsPromise);
  return <MarketplaceScreen initialMoments={moments} />;
}
