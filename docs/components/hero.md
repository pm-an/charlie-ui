# Hero

A full-width hero section for landing pages. Supports centered and split (two-column) layouts, with an optional aurora gradient background.

## Import

```tsx
import { Hero } from "@charlietogolden/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"centered" \| "split"` | `"centered"` | Layout variant. |
| `eyebrow` | `string` | -- | Small uppercase text above the title. |
| `title` | `string` | **(required)** | Main heading text. |
| `description` | `string` | **(required)** | Subtitle/description text below the title. |
| `actions` | `ReactNode` | -- | CTA buttons rendered below the description. |
| `gradient` | `boolean` | `false` | Adds an aurora gradient overlay behind the content. |
| `className` | `string` | -- | Additional CSS classes. |
| `children` | `ReactNode` | -- | Additional content. In centered mode, rendered below actions. In split mode, rendered in the right column. |

### Layout Variants

| Variant | Description |
|---|---|
| `centered` | All content is center-aligned. Description has a max width of `672px`. |
| `split` | Two-column layout on medium+ screens. Text on the left, `children` on the right. |

## Usage

### Centered Hero

```tsx
<Hero
  eyebrow="Introducing Charlie UI"
  title="Build beautiful dark interfaces"
  description="A complete component library for modern React applications, built with Tailwind CSS v4."
  actions={
    <>
      <Button size="lg">Get Started</Button>
      <Button variant="secondary" size="lg">Learn More</Button>
    </>
  }
/>
```

### With Gradient Background

```tsx
<Hero
  gradient
  title="Dark theme, done right"
  description="30+ components designed for dark-first interfaces."
  actions={<Button size="lg">Explore Components</Button>}
/>
```

### Split Layout

```tsx
<Hero
  variant="split"
  eyebrow="New Release"
  title="Command Palette"
  description="A Raycast-inspired command palette for your application."
  actions={<Button>Try it Now</Button>}
>
  <img
    src="/screenshots/command-palette.png"
    alt="Command Palette"
    className="rounded-xl border border-white/[0.06]"
  />
</Hero>
```

### Centered with Custom Content Below

```tsx
<Hero
  gradient
  title="Welcome to Charlie UI"
  description="The dark-themed component library for React."
  actions={<Button size="lg">Get Started</Button>}
>
  <div className="grid grid-cols-3 gap-4">
    <Card><Card.Body>Feature 1</Card.Body></Card>
    <Card><Card.Body>Feature 2</Card.Body></Card>
    <Card><Card.Body>Feature 3</Card.Body></Card>
  </div>
</Hero>
```

## Notes

- The hero section uses `pt-32 pb-20` padding for both variants.
- The title uses responsive sizing: `text-5xl` on mobile, `text-7xl` on medium+ screens.
- Content is constrained to `max-w-[1280px]` with `px-6` horizontal padding.
- When `gradient` is `true`, a `.bg-aurora` overlay is rendered behind the content.
- The `heroVariants` function is also exported.
