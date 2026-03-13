# Skeleton

A loading placeholder that pulses to indicate content is being loaded. Supports text, circle, and rectangle shapes with configurable dimensions.

## Import

```tsx
import { Skeleton } from "@piotr/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"text" \| "circle" \| "rect"` | `"text"` | Shape of the skeleton. |
| `width` | `string \| number` | -- | Custom width. Numbers are treated as pixels. |
| `height` | `string \| number` | -- | Custom height. Numbers are treated as pixels. |
| `className` | `string` | -- | Additional CSS classes. |
| `style` | `CSSProperties` | -- | Inline styles (merged with width/height). |

### Variant Styles

| Variant | Default Shape | Description |
|---|---|---|
| `text` | `w-full h-4 rounded-md` | A full-width horizontal bar, ideal for text line placeholders. |
| `circle` | `rounded-full aspect-square` | A perfect circle. Set `width` to control the size. |
| `rect` | `rounded-md` | A rectangle. Set both `width` and `height` for custom dimensions. |

## Usage

### Text Skeleton

```tsx
<div className="space-y-3">
  <Skeleton />
  <Skeleton width="75%" />
  <Skeleton width="50%" />
</div>
```

### Circle Skeleton (Avatar Placeholder)

```tsx
<Skeleton variant="circle" width={40} height={40} />
```

### Rectangle Skeleton (Image Placeholder)

```tsx
<Skeleton variant="rect" width="100%" height={200} />
```

### Card Loading State

```tsx
<Card>
  <Card.Header>
    <div className="flex items-center gap-3">
      <Skeleton variant="circle" width={40} height={40} />
      <div className="space-y-2 flex-1">
        <Skeleton width="60%" />
        <Skeleton width="40%" />
      </div>
    </div>
  </Card.Header>
  <Card.Body>
    <div className="space-y-3">
      <Skeleton />
      <Skeleton width="80%" />
      <Skeleton width="90%" />
    </div>
  </Card.Body>
</Card>
```

## Notes

- All skeletons use `bg-white/5` with `animate-pulse` for the loading animation.
- The `width` and `height` props accept both strings (e.g. `"75%"`, `"200px"`) and numbers (treated as pixels).
- The `skeletonVariants` function is also exported.
