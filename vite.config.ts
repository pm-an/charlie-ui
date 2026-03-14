/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  plugins: [react(), tailwindcss(), dts({
    include: ["src"],
    exclude: ["src/main.tsx", "**/*.stories.tsx", "**/*.test.tsx", "src/test/**"],
    tsconfigPath: resolve(dirname, "tsconfig.build.json")
  })],
  build: {
    lib: {
      entry: [
        resolve(dirname, "src/index.ts"),
        resolve(dirname, "src/form.ts"),
      ],
      name: "CharlieUI",
      formats: ["es", "cjs"],
      fileName: format => `index.${format === "es" ? "mjs" : "cjs"}`
    },
    rollupOptions: {
      external: [
        "react", "react-dom", "react/jsx-runtime", "framer-motion", "lucide-react",
        /^@tiptap\//,
        "react-hook-form",
        "@hookform/resolvers",
        /^@hookform\//,
        "zod",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime"
        },
        preserveModules: true,
        preserveModulesRoot: "src",
        banner: (chunk) => {
          if (chunk.isEntry || chunk.fileName.endsWith('.mjs')) {
            return '"use client";\n';
          }
          return '';
        },
      }
    },
    cssCodeSplit: false
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.test.{ts,tsx}'],
          environment: 'jsdom',
          setupFiles: ['./src/test/setup.ts'],
          css: false,
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  }
});