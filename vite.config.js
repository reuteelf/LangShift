import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [],
  css: {
    postcss: "./postcss.config.js",
  },
  build: {
    target: "esnext",
    sourcemap: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        background: resolve(__dirname, "src/background"),
        content: resolve(__dirname, "src/content"),
      },
      output: {
        format: "esm",
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
        manualChunks: (id) => {
          if (id.includes("node_modules")) return "vendor";
          if (id.includes("src/background")) return "background";
          if (id.includes("src/content")) return "content";
          return "default";
        },
      },
    },
  },
});
