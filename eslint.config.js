// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";
import jsxA11y from "eslint-plugin-jsx-a11y";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([globalIgnores(['dist', 'storybook-static', 'test-results', '.claude/worktrees']), {
  files: ['**/*.{ts,tsx}'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,
    jsxA11y.flatConfigs.recommended,
  ],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  rules: {
    // react-refresh: component libraries export variants/types alongside components
    "react-refresh/only-export-components": "off",
    // Allow unused vars prefixed with _ (common convention for intentionally unused params)
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
    // jsx-a11y: downgrade rules that produce false positives in component libraries
    "jsx-a11y/no-autofocus": "warn",
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/no-static-element-interactions": "warn",
    "jsx-a11y/no-noninteractive-tabindex": "warn",
    "jsx-a11y/no-noninteractive-element-interactions": "warn",
    "jsx-a11y/interactive-supports-focus": "warn",
    "jsx-a11y/role-has-required-aria-props": "warn",
    "jsx-a11y/label-has-associated-control": "warn",
    "jsx-a11y/role-supports-aria-props": "warn",
    "jsx-a11y/aria-role": "warn",
    "jsx-a11y/anchor-has-content": "warn",
    "jsx-a11y/alt-text": "warn",
  },
}, ...storybook.configs["flat/recommended"]])
