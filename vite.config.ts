import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";

export default defineConfig({
  plugins: [{ enforce: "pre", ...mdx() }, react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;

          if (id.includes("@diamondlightsource")) {
            return "diamond-ui";
          }

          if (id.includes("@mui") || id.includes("@emotion")) {
            return "mui-vendor";
          }

          if (id.includes("react-router-dom")) {
            return "router";
          }

          if (id.includes("lucide-react")) {
            return "icons";
          }

          if (id.includes("@mdx-js")) {
            return "mdx";
          }

          return "vendor";
        },
      },
    },
  },
  server: {
    host: true,
    port: 3000,
  },
});
