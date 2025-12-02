import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  envPrefix: ["VITE_", "PLUGIN_"],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        code: resolve(__dirname, "src/code.ts"),
        ui: resolve(__dirname, "src/ui.html"),
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name][extname]",
      },
    },
  },
});
