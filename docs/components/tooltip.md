# Tooltip

A hover/focus-activated tooltip that appears near the trigger element. Supports four placement sides and a configurable show delay. Animated with Framer Motion.

## Import

```tsx
import { Tooltip } from "@charlietogolden/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `content` | `ReactNode` | **(required)** | Tooltip content. Can be a string or JSX. |
| `children` | `ReactNode` | **(required)** | Trigger element that activates the tooltip on hover/focus. |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | Which side of the trigger the tooltip appears on. |
| `delayMs` | `number` | `200` | Delay in milliseconds before the tooltip appears. |
| `className` | `string` | -- | Additional CSS classes applied to the tooltip element. |

## Usage

### Basic Tooltip

```tsx
<Tooltip content="This is a tooltip">
  <Button variant="ghost">Hover me</Button>
</Tooltip>
```

### Placement Sides

```tsx
<div className="flex gap-4">
  <Tooltip content="Top" side="top">
    <Button variant="secondary">Top</Button>
  </Tooltip>
  <Tooltip content="Bottom" side="bottom">
    <Button variant="secondary">Bottom</Button>
  </Tooltip>
  <Tooltip content="Left" side="left">
    <Button variant="secondary">Left</Button>
  </Tooltip>
  <Tooltip content="Right" side="right">
    <Button variant="secondary">Right</Button>
  </Tooltip>
</div>
```

### With Rich Content

```tsx
<Tooltip
  content={
    <span>
      Search <Kbd>Cmd</Kbd>+<Kbd>K</Kbd>
    </span>
  }
>
  <Button variant="ghost" size="sm">Search</Button>
</Tooltip>
```

### Custom Delay

```tsx
<Tooltip content="Appears after 500ms" delayMs={500}>
  <Button>Slow tooltip</Button>
</Tooltip>
```

### No Delay

```tsx
<Tooltip content="Instant tooltip" delayMs={0}>
  <Badge variant="blue">Info</Badge>
</Tooltip>
```

### On an Icon Button

```tsx
import { Settings } from "lucide-react";

<Tooltip content="Settings">
  <button className="p-2 text-white/60 hover:text-white transition-colors">
    <Settings className="w-5 h-5" />
  </button>
</Tooltip>
```

## Notes

- The tooltip appears on both `mouseenter`/`focus` and hides on `mouseleave`/`blur`.
- The tooltip element has `pointer-events-none` so it does not interfere with other interactions.
- Styling: `bg-grey-700` background, `border-white/10` border, `text-xs text-white/80`, with `shadow-lg`.
- The animation direction matches the `side` prop (e.g. slides in from the opposite direction).
- Content uses `whitespace-nowrap` so single-line tooltips do not wrap.
- The tooltip uses `z-50` for stacking above other content.
