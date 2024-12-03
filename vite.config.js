import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  css: {
    postcss: "./postcss.config.js",
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        index: "index.html",
      },
      output: {
        format: "iife",
        entryFileNames: "[name].js",
        assetFileNames: "[name].ext",
      },
    },
  },
});
