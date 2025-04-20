import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// Conditionally load plugins only in development or Replit
const plugins = [
  react(),
  runtimeErrorOverlay(),
  themePlugin(),
];

if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
  const cartographer = require("@replit/vite-plugin-cartographer").cartographer;
  plugins.push(cartographer());
}

export default defineConfig({
  base: '/MayaShine/',
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
});
