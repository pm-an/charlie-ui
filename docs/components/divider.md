# Divider

A horizontal separator with solid or dotted styles. Optionally displays a centered text label between two lines.

## Import

```tsx
import { Divider } from "@charlietogolden/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"solid" \| "dotted"` | `"solid"` | Line style. |
| `label` | `string` | -- | Optional text displayed centered between two divider lines. |
| `className` | `string` | -- | Additional CSS classes. |

### Variant Styles

| Variant | Description |
|---|---|
| `solid` | A 1px solid line using `bg-white/6`. |
| `dotted` | A dotted border using `border-dotted border-white/10`. |

## Usage

### Solid Divider (Default)

```tsx
<Divider />
```

### Dotted Divider

```tsx
<Divider variant="dotted" />
```

### With Label

```tsx
<Divider label="or continue with" />
```

### Dotted with Label

```tsx
<Divider variant="dotted" label="Section Break" />
```

### In Context

```tsx
<div className="space-y-4">
  <p className="text-white/60">First section content.</p>
  <Divider label="Next Section" />
  <p className="text-white/60">Second section content.</p>
</div>
```

## Notes

- When a `label` is present, the component renders as a flex container with two divider lines flanking the label text.
- The label text uses `text-xs text-white/40`.
- The component has `role="separator"` for accessibility.
- The `dividerVariants` function is also exported.
