# SocialCard

A gradient-backed card for linking to social media profiles or community channels. Supports four color themes and can render as a link.

## Import

```tsx
import { SocialCard } from "@piotr/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `ReactNode` | **(required)** | Icon or logo element (32x32 area). |
| `title` | `string` | **(required)** | Card title (e.g. the platform name). |
| `description` | `string` | **(required)** | Short description of the link or community. |
| `color` | `"red" \| "blue" \| "purple" \| "orange"` | **(required)** | Background gradient color theme. |
| `href` | `string` | -- | When provided, the card renders as an anchor with `target="_blank"`. |
| `className` | `string` | -- | Additional CSS classes. |

### Color Themes

| Color | Gradient |
|---|---|
| `red` | `from-red/20 to-red/5` |
| `blue` | `from-blue/20 to-blue/5` |
| `purple` | `from-purple/20 to-purple/5` |
| `orange` | `from-orange/20 to-orange/5` |

## Usage

### Social Links Grid

```tsx
import { Github, Twitter, MessageCircle, Youtube } from "lucide-react";

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <SocialCard
    icon={<Github className="w-8 h-8 text-white" />}
    title="GitHub"
    description="Star us on GitHub and contribute."
    color="purple"
    href="https://github.com"
  />
  <SocialCard
    icon={<Twitter className="w-8 h-8 text-white" />}
    title="Twitter"
    description="Follow us for updates."
    color="blue"
    href="https://twitter.com"
  />
  <SocialCard
    icon={<MessageCircle className="w-8 h-8 text-white" />}
    title="Discord"
    description="Join our community."
    color="purple"
    href="https://discord.com"
  />
  <SocialCard
    icon={<Youtube className="w-8 h-8 text-white" />}
    title="YouTube"
    description="Watch tutorials and demos."
    color="red"
    href="https://youtube.com"
  />
</div>
```

### Without Link

```tsx
<SocialCard
  icon={<Github className="w-8 h-8 text-white" />}
  title="Open Source"
  description="This project is open source."
  color="purple"
/>
```

## Notes

- When `href` is provided, the card renders as an `<a>` element with `target="_blank"` and `rel="noopener noreferrer"`.
- The gradient uses `bg-gradient-to-br` (bottom-right direction).
- The `socialCardVariants` function is also exported.
