# Theming

Charlie UI's design system is built entirely on Tailwind CSS v4's `@theme` directive. All colors, spacing, typography, radii, and animations are defined as CSS custom properties (design tokens) that you can override or extend in your own stylesheets.

## How Theming Works

All tokens are defined in `src/styles/globals.css` within a `@theme` block:

```css
@theme {
  --color-bg: #07080a;
  --color-red: #ff6363;
  --color-border: rgba(255, 255, 255, 0.06);
  /* ... */
}
```

These tokens become Tailwind utility classes automatically. For example, `--color-red` becomes `text-red`, `bg-red`, `border-red`, etc.

## Overriding Tokens

To customize the theme, create your own `@theme` block that overrides specific tokens. Tailwind CSS v4 merges theme definitions, so your overrides replace the defaults while keeping everything else intact.

### Example: Custom Brand Color

```css
/* your-app.css */
@import "tailwindcss";

@theme {
  --color-red: #e74c3c;
  --color-red-muted: #2c1617;
}
```

Now every component that uses the `red` token -- buttons, badges, hero eyebrows, toast error icons -- will use your custom red.

### Example: Custom Background

```css
@theme {
  --color-bg: #0a0b0d;
  --color-surface: #1a1b1d;
  --color-surface-elevated: #121315;
}
```

## Adding New Tokens

You can add entirely new tokens alongside the existing ones:

```css
@theme {
  --color-brand: #6366f1;
  --color-brand-muted: rgba(99, 102, 241, 0.15);
}
```

These immediately become available as Tailwind utilities (`text-brand`, `bg-brand-muted`, etc.) and can be used with Charlie UI components via the `className` prop:

```tsx
<Badge className="bg-brand-muted text-brand">Custom</Badge>
```

## Overriding Component Styles

Every Charlie UI component accepts a `className` prop that is merged with the component's default classes using `cn()` (clsx + tailwind-merge). This means you can override any specific style:

```tsx
// Override the button's border radius
<Button className="rounded-full">Pill Button</Button>

// Override card background
<Card className="bg-blue-muted border-blue/20">
  <Card.Body>Custom styled card</Card.Body>
</Card>
```

Because Charlie UI uses `tailwind-merge`, conflicting classes are resolved in your favor. If the component has `rounded-md` and you pass `rounded-full`, the final output will be `rounded-full`.

## Using CVA Variants Externally

Many components export their variant functions (e.g. `buttonVariants`, `badgeVariants`, `cardVariants`). You can use these to apply component styles to your own elements:

```tsx
import { buttonVariants } from "@charlietogolden/charlie-ui";

// Style a Next.js Link as a Button
<Link href="/docs" className={buttonVariants({ variant: "secondary", size: "sm" })}>
  Documentation
</Link>
```

## Typography Customization

To use a different font family, override the font tokens:

```css
@theme {
  --font-sans: "Geist", "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Geist Mono", monospace;
}
```

Make sure to load the font files in your HTML or via a CSS import.

## Dark Theme Only

Charlie UI is designed exclusively for dark interfaces. The tokens assume a dark background, and component styles (translucent whites for borders, low-opacity backgrounds for badges, etc.) are calibrated for dark surfaces. There is no built-in light mode toggle.

If you need a light mode, you would need to override the full set of semantic tokens (`bg`, `fg`, `surface`, `border`, etc.) to light-appropriate values. This is possible but not officially supported.

## Full Token Reference

For a complete list of all design tokens and their values, see the [Design Tokens](../getting-started/design-tokens.md) page.
