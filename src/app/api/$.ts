import { createFileRoute } from "@tanstack/react-router";
import api from "@/server/api";

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: ({ request }) => api.fetch(request),
      POST: ({ request }) => api.fetch(request),
    },
  },
});
