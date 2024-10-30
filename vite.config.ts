import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // Enables hot reload for atoms
          "jotai/babel/plugin-react-refresh",
          // Automatically adds debug labels to the atoms
          "jotai/babel/plugin-debug-label",
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "#": path.resolve(__dirname, "./src/components"),
    },
  },
  esbuild: {
    target: "es2022",
  },
});
