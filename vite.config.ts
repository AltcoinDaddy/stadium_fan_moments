import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
  server: { port: 3000, allowedHosts: true },
  optimizeDeps: { force: true },
  define: {
    "import.meta.env.VITE_PRIVY_APP_ID": JSON.stringify(env.NEXT_PUBLIC_PRIVY_APP_ID || ""),
    "import.meta.env.VITE_MATCHDAY_CONTRACT_ADDRESS": JSON.stringify(env.NEXT_PUBLIC_MATCHDAY_CONTRACT_ADDRESS || ""),
    "import.meta.env.VITE_CHILIZ_RPC_URL": JSON.stringify(env.NEXT_PUBLIC_CHILIZ_RPC_URL || ""),
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart({
      srcDirectory: "src",
      router: { routesDirectory: "app" },
    }),
    react(),
    nitro(),
  ],
  };
});
