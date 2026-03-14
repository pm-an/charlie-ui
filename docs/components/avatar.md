# Avatar

A circular user avatar that displays an image, falls back to initials, and optionally shows an online/offline/busy status indicator.

## Import

```tsx
import { Avatar } from "@charlietogolden/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | -- | Image URL. When omitted, the fallback is displayed instead. |
| `alt` | `string` | **(required)** | Alt text for the image. Also used to generate the fallback initial. |
| `fallback` | `string` | First character of `alt` | Custom fallback text shown when there is no `src`. |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Avatar dimensions. |
| `status` | `"online" \| "offline" \| "busy"` | -- | Shows a colored status dot in the bottom-right corner. |
| `className` | `string` | -- | Additional CSS classes applied to the outer wrapper. |

### Size Dimensions

| Size | Dimensions |
|---|---|
| `xs` | 24 x 24 px |
| `sm` | 32 x 32 px |
| `md` | 40 x 40 px |
| `lg` | 48 x 48 px |
| `xl` | 64 x 64 px |

### Status Colors

| Status | Color |
|---|---|
| `online` | Green (`#59d499`) |
| `offline` | Grey (`grey-300`) |
| `busy` | Red (`#ff6363`) |

## Usage

### With Image

```tsx
<Avatar src="/avatars/alice.jpg" alt="Alice Johnson" />
```

### Fallback Initials

When no `src` is provided, the first character of `alt` is displayed:

```tsx
<Avatar alt="Bob Smith" />
```

Custom fallback text:

```tsx
<Avatar alt="Bob Smith" fallback="BS" />
```

### Sizes

```tsx
<div className="flex items-center gap-3">
  <Avatar src="/avatar.jpg" alt="User" size="xs" />
  <Avatar src="/avatar.jpg" alt="User" size="sm" />
  <Avatar src="/avatar.jpg" alt="User" size="md" />
  <Avatar src="/avatar.jpg" alt="User" size="lg" />
  <Avatar src="/avatar.jpg" alt="User" size="xl" />
</div>
```

### With Status Indicator

```tsx
<div className="flex items-center gap-3">
  <Avatar src="/avatar.jpg" alt="Online User" status="online" />
  <Avatar src="/avatar.jpg" alt="Offline User" status="offline" />
  <Avatar src="/avatar.jpg" alt="Busy User" status="busy" />
</div>
```
