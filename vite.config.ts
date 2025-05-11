import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Demi Masa",
        short_name: "Demi Masa",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        start_url: "/",
        display: "standalone",
        background_color: "#FFFFFF",
        theme_color: "#FFFFFF",
        description:
          "Menjadikan digitalisasi dalam kepekaan beribadah di setiap kesibukan apapun.",
      },
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    outDir: ".react",
  },
  resolve: {
    extensions: [".ts", ".tsx"],
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@libs": path.resolve(__dirname, "./src/libs"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@customTypes": path.resolve(__dirname, "./src/types"),
    },
  },
});
