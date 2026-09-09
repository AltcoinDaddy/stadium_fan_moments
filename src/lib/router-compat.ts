import {
  useLocation,
  useRouter as useTanStackRouter,
  useSearch,
} from "@tanstack/react-router";

export function useRouter() {
  const router = useTanStackRouter();
  return {
    push: (to: string) => void router.navigate({ to }),
    replace: (to: string) => void router.navigate({ to, replace: true }),
    back: () => router.history.back(),
  };
}

export function usePathname() {
  return useLocation({ select: (location) => location.pathname });
}

export function useSearchParams() {
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    if (value !== undefined && value !== null) params.set(key, String(value));
  }
  return params;
}
