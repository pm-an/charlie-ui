# Responsive Design

Charlie UI is built with a mobile-first approach. Components adapt gracefully across screen sizes using Tailwind CSS responsive utilities and carefully chosen breakpoints.

## Breakpoints

Charlie UI uses Tailwind CSS v4's default breakpoints:

| Prefix | Min Width | Typical Devices |
|---|---|---|
| (none) | `0px` | Mobile phones |
| `sm` | `640px` | Large phones, small tablets |
| `md` | `768px` | Tablets |
| `lg` | `1024px` | Laptops |
| `xl` | `1280px` | Desktops |
| `2xl` | `1536px` | Large desktops |

## Responsive Components

Several Charlie UI components have built-in responsive behavior:

### Navbar

The Navbar automatically switches between desktop and mobile layouts:

- **Desktop** (`md` and up): Horizontal links and action buttons are visible.
- **Mobile** (below `md`): Links and actions are hidden. A hamburger menu button appears, which opens an animated mobile menu.

No additional configuration is needed. The responsive behavior is built in.

### Hero

The Hero component adapts its typography and layout:

- Title scales from `text-5xl` on mobile to `text-7xl` on `md` and up.
- In `split` variant, the two-column grid collapses to a single column on mobile (`grid-cols-1 md:grid-cols-2`).

### Footer

Footer columns use a responsive grid:

- `grid-cols-2` on mobile
- `grid-cols-4` on `md`
- `grid-cols-5` on `lg`

### Container

The Container component uses a fixed max-width that prevents content from stretching too wide on large screens, with `px-6` (24px) horizontal padding that provides comfortable margins on all screen sizes.

## Building Responsive Layouts

### Responsive Grid

Use Tailwind's responsive grid utilities with Charlie UI components:

```tsx
<Section title="Features">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <FeatureCard
      icon={<Zap className="w-5 h-5" />}
      title="Feature One"
      description="Description of feature one."
    />
    <FeatureCard
      icon={<Shield className="w-5 h-5" />}
      title="Feature Two"
      description="Description of feature two."
    />
    <FeatureCard
      icon={<Palette className="w-5 h-5" />}
      title="Feature Three"
      description="Description of feature three."
    />
  </div>
</Section>
```

### Responsive Pricing Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <PricingCard tier="Free" price="$0" period="month" ... />
  <PricingCard tier="Pro" price="$19" period="month" highlighted ... />
  <PricingCard tier="Enterprise" price="Custom" period="year" ... />
</div>
```

### Stacking on Mobile

Cards that sit side-by-side on desktop can stack vertically on mobile:

```tsx
<div className="flex flex-col md:flex-row gap-6">
  <Card className="flex-1">
    <Card.Body>Left card</Card.Body>
  </Card>
  <Card className="flex-1">
    <Card.Body>Right card</Card.Body>
  </Card>
</div>
```

### Responsive Text

Use Tailwind's responsive text utilities for headings that scale with the viewport:

```tsx
<h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white">
  Responsive Heading
</h1>
```

### Hiding Elements by Breakpoint

```tsx
{/* Only visible on desktop */}
<div className="hidden lg:block">
  Desktop sidebar content
</div>

{/* Only visible on mobile */}
<div className="lg:hidden">
  Mobile-only content
</div>
```

## Container Widths

Use the `Container` component to constrain content width. Choose the appropriate `size` based on your content type:

| Use Case | Recommended Size |
|---|---|
| Blog post / article | `sm` (746px) |
| Documentation page | `md` (960px) |
| Marketing content | `lg` (1080px) |
| Full-width layouts | `xl` (1280px, default) |

```tsx
<Container size="sm">
  <article>Narrow content for optimal reading.</article>
</Container>
```

## Tips

1. **Start mobile-first.** Write styles for the smallest screen, then add responsive modifiers for larger breakpoints.
2. **Use the Section component** for consistent vertical rhythm. Its `size` prop controls padding across breakpoints.
3. **Test at common widths.** Check 375px (iPhone), 768px (iPad), 1024px (laptop), and 1440px (desktop).
4. **Leverage Tailwind's responsive utilities** (`md:`, `lg:`, `xl:`) directly in `className` props -- they work seamlessly with Charlie UI components.
