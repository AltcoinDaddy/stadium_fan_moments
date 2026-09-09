import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Match, Moment } from "@/data/mockData";

type MomentsResponse = { moments: Moment[] };
type MomentResponse = { moment: Moment };
type MatchesResponse = { matches: Match[] };

const internalRequest = (path: string, init?: RequestInit) =>
  new Request(`http://tanstack.internal${path}`, init);

export const getMarketplaceMoments = createServerFn({ method: "GET" })
  .validator(z.object({ listed: z.boolean().default(true) }))
  .handler(async ({ data }) => {
    const { default: api } = await import("./api");
    const response = await api.fetch(
      internalRequest(`/api/moments?listed=${String(data.listed)}`),
    );
    if (!response.ok) return { moments: [] } satisfies MomentsResponse;
    return (await response.json()) as MomentsResponse;
  });

export const getMoment = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { default: api } = await import("./api");
    const response = await api.fetch(
      internalRequest(`/api/moments/${encodeURIComponent(data.id)}`),
    );
    if (!response.ok) return null;
    return (await response.json()) as MomentResponse;
  });

export const getSportsMatches = createServerFn({ method: "GET" }).handler(
  async () => {
    const { default: api } = await import("./api");
    const response = await api.fetch(internalRequest("/api/sports/matches"));
    if (!response.ok) return { matches: [] } satisfies MatchesResponse;
    return (await response.json()) as MatchesResponse;
  },
);
