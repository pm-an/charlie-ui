# Testimonial

A customer testimonial card featuring a decorative quote mark, the quote text, and author information with an optional avatar.

## Import

```tsx
import { Testimonial } from "@piotr/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `quote` | `string` | **(required)** | The testimonial text. |
| `author` | `string` | **(required)** | Author's name. |
| `role` | `string` | **(required)** | Author's job title or role. |
| `avatar` | `string` | -- | URL for the author's avatar image. |
| `company` | `string` | -- | Author's company name, displayed after the role. |
| `className` | `string` | -- | Additional CSS classes. |

## Usage

### Basic Testimonial

```tsx
<Testimonial
  quote="Charlie UI saved us weeks of development time. The components are polished and the dark theme is perfect for our product."
  author="Alice Johnson"
  role="Lead Engineer"
/>
```

### With Avatar and Company

```tsx
<Testimonial
  quote="The attention to detail in every component is remarkable. From the subtle gradients to the smooth animations, everything feels premium."
  author="Bob Smith"
  role="Design Director"
  company="Acme Inc."
  avatar="/avatars/bob.jpg"
/>
```

### Testimonial Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Testimonial
    quote="Incredible dark theme components."
    author="Alice"
    role="Engineer"
    company="StartupCo"
    avatar="/avatars/alice.jpg"
  />
  <Testimonial
    quote="Saved us so much time."
    author="Bob"
    role="Designer"
    company="DesignLab"
    avatar="/avatars/bob.jpg"
  />
  <Testimonial
    quote="Best component library for dark UIs."
    author="Charlie"
    role="CTO"
    company="TechCorp"
    avatar="/avatars/charlie.jpg"
  />
</div>
```

## Notes

- The card uses `bg-card-gradient` with a border and padding.
- A decorative left-double-quotation mark is rendered at the top using `&ldquo;` in `text-2xl text-white/20`.
- The quote text is styled as a `<blockquote>` with `italic` and `text-white/80`.
- The avatar area is a 40x40 circle with `bg-white/10` fallback when no image is provided.
- Supports `forwardRef` for ref forwarding.
