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
    // Ship readable source for the library. Consumer bundlers minify in
    // their own app builds; minifying here trips Socket.dev's
    // "minified/obfuscated code" supply-chain alerts on the published
    // package and inlines `process.env.NODE_ENV` (env-var-access alert).
    minify: false,
    lib: {
      entry: [
        resolve(dirname, "src/index.ts"),
        resolve(dirname, "src/form.ts"),
        // Force emission of components Rollup would otherwise inline because
        // they're side-effect-free pure re-exports from index.ts. Without
        // these entries the matching package.json subpath exports
        // (./toggle, ./form-field) point at files that don't exist.
        resolve(dirname, "src/components/Toggle.tsx"),
        resolve(dirname, "src/components/FormField.tsx"),
      ],
      name: "CharlieUI",
      // formats handled via rollupOptions.output[] below so we get
      // format-specific extensions while preserving the source tree.
    },
    rollupOptions: {
      // Externalize every runtime dependency. Bundling pre-minified vendor
      // code into our published artifact is what trips Socket.dev's
      // "minified code" detector on the published package.
      external: [
        "react", "react-dom", "react/jsx-runtime",
        "framer-motion",
        "lucide-react",
        /^@tiptap\//,
        "react-hook-form",
        "@hookform/resolvers",
        /^@hookform\//,
        "zod",
        /^@tanstack\//,
        "class-variance-authority",
        "clsx",
        "date-fns",
        /^date-fns\//,
        "react-day-picker",
        "react-resizable-panels",
        "recharts",
        "tailwind-merge",
      ],
      // With preserveModules: true, lib.fileName gets applied to every
      // preserved module, collapsing the whole tree into dist/indexN.{mjs,cjs}
      // and breaking the subpath exports map. Define one output per format
      // explicitly so each module keeps its source path (e.g.
      // dist/components/Button.mjs), which is what package.json `exports`
      // points at.
      output: [
        {
          format: "es",
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].mjs",
          chunkFileNames: "[name].mjs",
          banner: '"use client";\n',
          // Keep readable identifiers in the published bundle so Socket.dev
          // doesn't flag the package as obfuscated/minified.
          minifyInternalExports: false,
          compact: false,
          generatedCode: { symbols: true },
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            "react/jsx-runtime": "jsxRuntime",
          },
        },
        {
          format: "cjs",
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].cjs",
          chunkFileNames: "[name].cjs",
          exports: "named",
          minifyInternalExports: false,
          compact: false,
          generatedCode: { symbols: true },
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            "react/jsx-runtime": "jsxRuntime",
          },
        },
      ],
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