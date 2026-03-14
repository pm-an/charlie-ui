# Installation

## Install the Package

Choose your preferred package manager:

```bash
# npm
npm install @charlietogolden/charlie-ui

# yarn
yarn add @charlietogolden/charlie-ui

# pnpm
pnpm add @charlietogolden/charlie-ui
```

## Peer Dependencies

Charlie UI requires React 18 or 19 as a peer dependency. If you do not already have React installed:

```bash
npm install react react-dom
```

The library bundles its own copies of `framer-motion`, `class-variance-authority`, `lucide-react`, `clsx`, and `tailwind-merge`, so you do not need to install those separately.

## Import the Stylesheet

Charlie UI ships a single CSS file that includes all component styles and design tokens. Import it once at the root of your application -- typically in your entry file or root layout:

```tsx
import "@charlietogolden/charlie-ui/styles.css";
```

This import provides:
- The full Tailwind CSS v4 base (via `@import "tailwindcss"`)
- All design tokens (colors, spacing, radii, typography, animations)
- Base body styles (dark background, antialiased text rendering)
- Utility classes for gradients, glows, and shadows

## Tailwind CSS v4 Setup

If your project already uses Tailwind CSS v4, Charlie UI's design tokens will be available in your own Tailwind classes automatically after importing the stylesheet. No additional Tailwind configuration is required.

If you are setting up Tailwind CSS v4 from scratch:

1. Install Tailwind CSS and the Vite plugin:

```bash
npm install tailwindcss @tailwindcss/vite
```

2. Add the plugin to your `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

3. Create a CSS entry file (e.g. `src/app.css`) and import Tailwind:

```css
@import "tailwindcss";
```

4. Import both your CSS file and the Charlie UI stylesheet in your application entry point:

```tsx
import "./app.css";
import "@charlietogolden/charlie-ui/styles.css";
```

## Verify the Installation

Create a simple test component to confirm everything is working:

```tsx
import { Button } from "@charlietogolden/charlie-ui";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Button>Hello Charlie UI</Button>
    </div>
  );
}
```

You should see a white primary button on a dark background. If the button appears unstyled, double-check that you have imported `@charlietogolden/charlie-ui/styles.css`.
