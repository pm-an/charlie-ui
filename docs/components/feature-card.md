# FeatureCard

A card designed for showcasing product features. Includes an icon, title, description, and optional image. Supports a hover glow effect and can render as a link.

## Import

```tsx
import { FeatureCard } from "@piotr/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `ReactNode` | **(required)** | Icon element displayed in a rounded container. |
| `title` | `string` | **(required)** | Feature title. |
| `description` | `string` | **(required)** | Feature description text. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Card size. `lg` supports a hero image above the content. |
| `glow` | `boolean` | `false` | Adds a subtle glow effect on hover. |
| `href` | `string` | -- | When provided, the card renders as an anchor element. |
| `image` | `string` | -- | Hero image URL. Only displayed when `size` is `"lg"`. |
| `className` | `string` | -- | Additional CSS classes. |

### Size Styles

| Size | Padding | Image Support |
|---|---|---|
| `sm` | `16px` | No |
| `md` | `24px` | No |
| `lg` | `0` (content area uses `p-6`) | Yes -- rendered as a 16:9 aspect ratio banner above content |

## Usage

### Basic Feature Card

```tsx
import { Zap } from "lucide-react";

<FeatureCard
  icon={<Zap className="w-5 h-5" />}
  title="Lightning Fast"
  description="Optimized for performance with minimal bundle size and tree-shaking support."
/>
```

### Feature Grid

```tsx
import { Zap, Shield, Palette } from "lucide-react";

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <FeatureCard
    icon={<Zap className="w-5 h-5" />}
    title="Fast"
    description="Lightweight and optimized for production."
  />
  <FeatureCard
    icon={<Shield className="w-5 h-5" />}
    title="Type Safe"
    description="Full TypeScript support with strict type checking."
  />
  <FeatureCard
    icon={<Palette className="w-5 h-5" />}
    title="Themeable"
    description="Customize every design token with Tailwind CSS."
  />
</div>
```

### With Glow Effect

```tsx
<FeatureCard
  icon={<Zap className="w-5 h-5" />}
  title="Highlighted Feature"
  description="This card has a subtle glow on hover."
  glow
/>
```

### Large Size with Image

```tsx
<FeatureCard
  size="lg"
  icon={<Zap className="w-5 h-5" />}
  title="Visual Feature"
  description="Large cards support a hero image above the content area."
  image="/features/hero.jpg"
/>
```

### As a Link

```tsx
<FeatureCard
  icon={<Zap className="w-5 h-5" />}
  title="Learn More"
  description="Click to read the full documentation."
  href="/docs/features"
/>
```

## Notes

- The icon is rendered inside a `40x40` rounded container with `bg-white/5`.
- The card border transitions from `border-white/[0.06]` to `border-white/10` on hover.
- The `featureCardVariants` function is also exported.
