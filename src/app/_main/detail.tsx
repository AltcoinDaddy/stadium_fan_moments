import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import DetailScreen from "@/screens/DetailScreen";
import { getMoment } from "@/server/functions";

const detailSearch = z.object({ id: z.string().optional() });

export const Route = createFileRoute("/_main/detail")({
  ssr: "data-only",
  validateSearch: (search) => detailSearch.parse(search),
  loader: ({ location }) => ({
    moment: (location.search as { id?: string }).id
      ? getMoment({ data: { id: (location.search as { id: string }).id } })
      : Promise.resolve(null),
  }),
  component: DetailRoute,
});

function DetailRoute() {
  const { id } = Route.useSearch() as { id?: string };
  const { moment } = Route.useLoaderData();
  return <DetailScreen requestedMomentId={id} initialMomentPromise={moment} />;
}
