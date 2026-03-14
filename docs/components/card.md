# Card

A general-purpose container with a dark gradient background, subtle border, and inset shadow. Uses a compound component pattern with `Card.Header`, `Card.Body`, and `Card.Footer` sub-components.

## Import

```tsx
import { Card } from "@charlietogolden/charlie-ui";
```

## Props

### Card (Root)

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"default" \| "translucent" \| "outline"` | `"default"` | Visual style of the card. |
| `padding` | `"none" \| "default"` | `"default"` | Padding applied to the card. Use `"none"` for custom layouts. |
| `className` | `string` | -- | Additional CSS classes. |
| `children` | `ReactNode` | -- | Card content -- typically `Card.Header`, `Card.Body`, and `Card.Footer`. |

### Card.Header

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `ReactNode` | -- | Icon rendered before the title. |
| `title` | `string` | -- | Header title text. |
| `description` | `string` | -- | Subtitle text below the title. |
| `className` | `string` | -- | Additional CSS classes. |
| `children` | `ReactNode` | -- | Additional content appended after the title area. |

### Card.Body

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | -- | Additional CSS classes. |
| `children` | `ReactNode` | -- | Body content. |

### Card.Footer

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | -- | Additional CSS classes. |
| `children` | `ReactNode` | -- | Footer content. Separated from the body by a top border. |

### Variant Styles

| Variant | Description |
|---|---|
| `default` | Solid dark gradient background (`bg-card-gradient`) with `border-white/[0.06]` border. |
| `translucent` | Semi-transparent gradient with `backdrop-blur-xl`. Use over images or gradients. |
| `outline` | Transparent background with `border-white/10` border. |

## Usage

### Basic Card

```tsx
<Card>
  <Card.Header title="Project Settings" description="Manage your project configuration." />
  <Card.Body>
    <p className="text-white/60 text-sm">Your project settings will appear here.</p>
  </Card.Body>
  <Card.Footer>
    <Button variant="primary" size="sm">Save Changes</Button>
  </Card.Footer>
</Card>
```

### With Icon in Header

```tsx
import { Settings } from "lucide-react";

<Card>
  <Card.Header
    icon={<Settings className="w-5 h-5 text-white/60" />}
    title="Settings"
    description="Configure your preferences."
  />
  <Card.Body>
    <p className="text-sm text-white/60">Content goes here.</p>
  </Card.Body>
</Card>
```

### Variant Styles

```tsx
<div className="grid grid-cols-3 gap-4">
  <Card variant="default">
    <Card.Body>Default card</Card.Body>
  </Card>
  <Card variant="translucent">
    <Card.Body>Translucent card</Card.Body>
  </Card>
  <Card variant="outline">
    <Card.Body>Outline card</Card.Body>
  </Card>
</div>
```

### No Padding

Use `padding="none"` for full-bleed content like images:

```tsx
<Card padding="none">
  <img src="/hero.jpg" alt="Hero" className="w-full rounded-t-xl" />
  <div className="p-6">
    <h3 className="text-white font-semibold">Custom Layout</h3>
    <p className="text-white/60 text-sm mt-2">Full control over the card's internal padding.</p>
  </div>
</Card>
```

## Notes

- All sub-components (`Card.Header`, `Card.Body`, `Card.Footer`) support `forwardRef`.
- The `cardVariants` function is also exported for applying card styles to custom elements.
- The `Card.Footer` includes a `border-t border-white/[0.06]` separator and top padding.
