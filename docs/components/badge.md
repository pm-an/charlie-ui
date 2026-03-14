# Badge

An inline label for displaying status, categories, or metadata. Supports multiple color variants and two sizes.

## Import

```tsx
import { Badge } from "@charlietogolden/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"default" \| "red" \| "blue" \| "green" \| "yellow" \| "pro"` | `"default"` | Color variant. |
| `size` | `"sm" \| "md"` | `"md"` | Size of the badge. |
| `className` | `string` | -- | Additional CSS classes. |
| `children` | `ReactNode` | -- | Badge content. |

### Variant Styles

| Variant | Background | Text Color |
|---|---|---|
| `default` | `bg-white/5` | `text-white/60` |
| `red` | `rgba(255,99,99,0.15)` | `text-red` |
| `blue` | `bg-blue-muted` | `text-blue` |
| `green` | `bg-green-muted` | `text-green` |
| `yellow` | `bg-yellow-muted` | `text-yellow` |
| `pro` | `rgba(162,223,253,0.15)` | `#A2DFFD` |

### Size Styles

| Size | Font Size | Padding |
|---|---|---|
| `sm` | `10px` | `px-1.5 py-0.5` |
| `md` | `12px` | `px-2 py-0.5` |

## Usage

### Color Variants

```tsx
<div className="flex gap-2">
  <Badge>Default</Badge>
  <Badge variant="red">Error</Badge>
  <Badge variant="blue">Info</Badge>
  <Badge variant="green">Success</Badge>
  <Badge variant="yellow">Warning</Badge>
  <Badge variant="pro">PRO</Badge>
</div>
```

### Sizes

```tsx
<div className="flex items-center gap-2">
  <Badge size="sm">Small</Badge>
  <Badge size="md">Medium</Badge>
</div>
```

### In Context

```tsx
<div className="flex items-center gap-2">
  <h3 className="text-white font-semibold">Charlie UI</h3>
  <Badge variant="green">v0.1.0</Badge>
  <Badge variant="pro">PRO</Badge>
</div>
```
