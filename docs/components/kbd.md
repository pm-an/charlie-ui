# Kbd

A keyboard shortcut display element styled to resemble a physical key cap. Ideal for documenting shortcuts in command palettes, tooltips, or inline text.

## Import

```tsx
import { Kbd } from "@piotr/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | -- | Additional CSS classes. |
| `children` | `ReactNode` | -- | Key label text (e.g. `"K"`, `"Shift"`, `"Enter"`). |

All standard `<kbd>` HTML attributes are also supported.

## Usage

### Single Key

```tsx
<Kbd>K</Kbd>
```

### Key Combination

```tsx
<span className="flex items-center gap-1">
  <Kbd>Cmd</Kbd>
  <Kbd>K</Kbd>
</span>
```

### In Context

```tsx
<p className="text-white/60 text-sm">
  Press <Kbd>Cmd</Kbd> + <Kbd>K</Kbd> to open the command palette.
</p>
```

### With Other Components

```tsx
<Tooltip content={<span>Search <Kbd>Cmd</Kbd>+<Kbd>K</Kbd></span>}>
  <Button variant="ghost" size="sm">Search</Button>
</Tooltip>
```

## Notes

- The element uses `font-mono` and `text-[11px]` for a technical look.
- Styled with a `bg-white/5` background, `border-white/10` border, and an inset bottom shadow to simulate depth.
- The `border-radius` is `4px` (`rounded-[4px]`).
