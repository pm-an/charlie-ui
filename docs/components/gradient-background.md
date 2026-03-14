# GradientBackground

A decorative gradient overlay used to add atmospheric depth to sections. Positioned absolutely to fill its nearest positioned parent. Supports three preset gradients and an optional pulsing animation.

## Import

```tsx
import { GradientBackground } from "@charlietogolden/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"aurora" \| "nebula" \| "warm" \| "custom"` | `"aurora"` | Gradient preset. Use `"custom"` with a `style` prop for your own gradient. |
| `animate` | `boolean` | `false` | Enables a pulsing opacity animation (Framer Motion). |
| `className` | `string` | -- | Additional CSS classes. |
| `style` | `CSSProperties` | -- | Inline styles. When `variant` is `"custom"`, use this to define your gradient. |

### Gradient Presets

| Variant | Description |
|---|---|
| `aurora` | Red-to-purple radial gradient from the top (`rgba(255,99,99,0.15)` to `rgba(155,77,255,0.08)`) |
| `nebula` | Blue-to-purple radial gradient from the top (`rgba(86,194,255,0.1)` to `rgba(155,77,255,0.1)`) |
| `warm` | Orange-to-red radial gradient from the top (`rgba(255,146,23,0.1)` to `rgba(255,99,99,0.08)`) |
| `custom` | No preset gradient applied -- provide your own via the `style` prop. |

## Usage

### Aurora Gradient (Default)

```tsx
<div className="relative h-[400px]">
  <GradientBackground />
  <div className="relative z-10 p-8">
    <h1 className="text-white text-4xl font-bold">Content over gradient</h1>
  </div>
</div>
```

### Nebula Gradient

```tsx
<div className="relative">
  <GradientBackground variant="nebula" />
  {/* Content */}
</div>
```

### Warm Gradient

```tsx
<div className="relative">
  <GradientBackground variant="warm" />
  {/* Content */}
</div>
```

### Animated Gradient

```tsx
<div className="relative h-[400px]">
  <GradientBackground variant="aurora" animate />
  <div className="relative z-10">
    <p className="text-white">The gradient behind this text gently pulses.</p>
  </div>
</div>
```

### Custom Gradient

```tsx
<div className="relative">
  <GradientBackground
    variant="custom"
    style={{
      background: "radial-gradient(circle at 30% 50%, rgba(89,212,153,0.15), transparent)",
    }}
  />
  {/* Content */}
</div>
```

## Notes

- The component uses `position: absolute` and `inset: 0`, so the parent element must have `position: relative`.
- The gradient has `pointer-events-none` so it does not interfere with interactive content.
- The `overflow: hidden` style prevents the gradient from bleeding outside the parent.
- When `animate` is `true`, the opacity cycles between `0.6` and `1` over a 4-second loop using Framer Motion.
