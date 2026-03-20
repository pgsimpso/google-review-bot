import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/google-review-bot/" : "/",
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
}));
