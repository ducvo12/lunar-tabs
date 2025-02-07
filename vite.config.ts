import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "./", // or ''
  build: {
    outDir: "dist"
    // any other settings you might need
  },
  plugins: [react()],
  server: {
    host: "localhost",
    port: 3000
  }
});
