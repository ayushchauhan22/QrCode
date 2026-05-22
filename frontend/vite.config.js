import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    // Dev Tunnels send Host: *.devtunnels.ms — without this, Vite returns 403/502
    allowedHosts: true,
    proxy: {
      "/api": "http://localhost:5000",
    },
    hmr: {
      clientPort: 443,
      protocol: "wss",
    },
  },
});
