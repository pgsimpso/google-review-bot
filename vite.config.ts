import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

function getHtmlInputs() {
  const inputs: Record<string, string> = {
    home: resolve(__dirname, "index.html"),
  };

  for (const entry of readdirSync(__dirname, { withFileTypes: true })) {
    if (!entry.isDirectory() || !/^v\d+$/i.test(entry.name)) {
      continue;
    }

    const htmlPath = resolve(__dirname, entry.name, "index.html");

    if (existsSync(htmlPath)) {
      inputs[entry.name] = htmlPath;
    }
  }

  return inputs;
}

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/google-review-bot/" : "/",
  build: {
    rollupOptions: {
      input: getHtmlInputs(),
    },
  },
}));
