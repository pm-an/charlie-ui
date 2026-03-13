# Button

The primary interactive element in Charlie UI. Supports five visual variants, three sizes, icon slots, and a loading state.

## Import

```tsx
import { Button } from "@piotr/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"primary" \| "secondary" \| "ghost" \| "danger" \| "brand"` | `"primary"` | Visual style of the button. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Button size. |
| `leftIcon` | `ReactNode` | -- | Icon rendered before the button text. Hidden during loading. |
| `rightIcon` | `ReactNode` | -- | Icon rendered after the button text. Hidden during loading. |
| `loading` | `boolean` | `false` | Shows a spinner and disables the button. |
| `disabled` | `boolean` | `false` | Disables the button. |
| `className` | `string` | -- | Additional CSS classes. |
| `children` | `ReactNode` | -- | Button label. |

All standard `<button>` HTML attributes are also supported.

### Variant Styles

| Variant | Description |
|---|---|
| `primary` | White/light background with dark text. The default, highest-emphasis button. |
| `secondary` | Transparent with a subtle white border. Medium emphasis. |
| `ghost` | Transparent with no border. Low emphasis. Text brightens on hover. |
| `danger` | Red background with white text. For destructive actions. |
| `brand` | Brand red (`#ff6363`) background with white text. |

### Size Dimensions

| Size | Height | Horizontal Padding | Font Size |
|---|---|---|---|
| `sm` | `32px` | `12px` | `14px` |
| `md` | `40px` | `16px` | `14px` |
| `lg` | `48px` | `24px` | `16px` |

## Usage

### Variants

```tsx
<div className="flex gap-3">
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="danger">Danger</Button>
  <Button variant="brand">Brand</Button>
</div>
```

### Sizes

```tsx
<div className="flex items-center gap-3">
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</div>
```

### With Icons

```tsx
import { ArrowRight, Download } from "lucide-react";

<Button leftIcon={<Download className="w-4 h-4" />}>
  Download
</Button>

<Button rightIcon={<ArrowRight className="w-4 h-4" />}>
  Continue
</Button>
```

### Loading State

```tsx
<Button loading>Saving...</Button>
```

When `loading` is `true`, a spinner replaces the `leftIcon` and the button is automatically disabled. The `rightIcon` is also hidden.

### Disabled State

```tsx
<Button disabled>Unavailable</Button>
```

## Notes

- All buttons include an `active:scale-[0.98]` press animation.
- The component uses `forwardRef`, so you can attach a ref to the underlying `<button>` element.
- The `buttonVariants` function is also exported for use with non-button elements that need the same styling.
