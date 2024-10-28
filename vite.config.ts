import react from "@vitejs/plugin-react";
// @ts-expect-error path
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
          "jotai/babel/plugin-debug-label"
        ]
      },
    }),
  ],
  resolve: {
    alias: {
      // @ts-expect-error path
      "~": path.resolve(__dirname, "./src"),
      // @ts-expect-error path
      "#": path.resolve(__dirname, "./src/components"),
    },
  },
});
