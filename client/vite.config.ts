// https://vite.dev/config/
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      quill: "quill",
    },
  },
  optimizeDeps: {
    include: ["react-quill", "quill"],
  },
  build: {
    commonjsOptions: {
      include: [/quill/, /react-quill/, /node_modules/],
      transformMixedEsModules: true,
    },
    sourcemap: false,
  },
  define: {
    global: "globalThis",
  },
});
