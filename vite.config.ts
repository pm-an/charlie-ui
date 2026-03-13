import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ["src"],
      exclude: ["src/main.tsx"],
      tsconfigPath: resolve(dirname, "tsconfig.app.json"),
    }),
  ],
  build: {
    lib: {
      entry: resolve(dirname, "src/index.ts"),
      name: "CharlieUI",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "framer-motion",
        "lucide-react",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
    },
    cssCodeSplit: false,
  },
});
