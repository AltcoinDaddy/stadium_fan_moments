import api from "@/server/api";

export const runtime = "nodejs";

export const GET = (request: Request) => api.fetch(request);
export const POST = (request: Request) => api.fetch(request);
