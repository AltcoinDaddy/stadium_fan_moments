import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import appCss from "../styles/globals.css?url";
import PwaRegistration from "@/components/PwaRegistration";
import MobileOnlyGuard from "@/components/MobileOnlyGuard";
import PrivyProviderWrapper from "@/providers/PrivyProviderWrapper";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" },
      { title: "MATCHDAY - Stadium Fan Moments" },
      { name: "description", content: "Capture and trade authentic stadium fan moments." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="en" className="h-full overflow-x-hidden antialiased" suppressHydrationWarning>
      <head><HeadContent /></head>
      <body className="min-h-full overflow-x-hidden bg-background font-sans text-ink selection:bg-lime selection:text-ink" suppressHydrationWarning>
        <PrivyProviderWrapper>
          <MobileOnlyGuard>
            <PwaRegistration />
            <Outlet />
          </MobileOnlyGuard>
        </PrivyProviderWrapper>
        <Scripts />
      </body>
    </html>
  );
}
