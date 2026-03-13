# Animations

Charlie UI uses two animation systems: **Framer Motion** for interactive component animations and **CSS keyframes** for ambient/decorative effects. This guide explains how they work and how to customize them.

## Framer Motion Animations

Framer Motion powers the interactive animations in Charlie UI. These are spring-based, physics-driven transitions that respond to user input.

### Components Using Framer Motion

| Component | Animation |
|---|---|
| **Toggle** | Thumb slides horizontally with spring physics |
| **Tabs** | Active indicator slides between tabs using `layoutId` |
| **ToggleGroup** | Active pill slides between options using `layoutId` |
| **Accordion** | Content expands/collapses with height and opacity transitions |
| **CommandPalette** | Backdrop fades, dialog scales and slides in/out |
| **Toast** | Slides up from below with scale and opacity |
| **Tooltip** | Fades in with a slight directional offset |
| **Navbar** | Mobile menu expands/collapses with height animation |
| **GradientBackground** | Optional pulsing opacity animation |

### Spring Physics

Many components use Framer Motion's spring transition type with these common settings:

```ts
{ type: "spring", stiffness: 500, damping: 30 }  // Toggle
{ type: "spring", stiffness: 500, damping: 35 }  // Tabs, ToggleGroup
```

Higher stiffness creates snappier motion. Higher damping reduces oscillation. These values produce a quick, slightly bouncy feel that matches the Raycast design aesthetic.

### Layout Animations

Tabs and ToggleGroup use Framer Motion's `layoutId` feature for smooth sliding indicators:

```tsx
{isActive && (
  <motion.span
    layoutId="tabs-pill"
    className="absolute inset-0 rounded-full bg-white"
    style={{ zIndex: -1 }}
    transition={{ type: "spring", stiffness: 500, damping: 35 }}
  />
)}
```

The `layoutId` tells Framer Motion to animate the element's position when it moves between tabs, creating a seamless sliding effect.

### AnimatePresence

Components that mount/unmount (Toast, CommandPalette, Accordion content, Tooltip, Navbar mobile menu) use `AnimatePresence` to animate exit transitions:

```tsx
<AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.96 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Content */}
    </motion.div>
  )}
</AnimatePresence>
```

## CSS Keyframe Animations

Charlie UI defines several CSS keyframe animations via the `@theme` directive. These are available as Tailwind utility classes.

### Available Animations

| Class | Description | Duration | Use Case |
|---|---|---|---|
| `animate-fade-in-up` | Fade in + translate up 20px | 1s ease | Page sections appearing on scroll |
| `animate-fade-in-scale` | Fade in + scale from 0.9 + translate up 10px | 0.3s ease | Cards and panels appearing |
| `animate-slide-in` | Slide up from 100% + scale from 0.9 | 0.7s cubic-bezier | Full elements entering the viewport |
| `animate-slide-up-fade` | Subtle upward slide (2px) + fade | 0.4s cubic-bezier | Dropdown menus, tooltips |
| `animate-slide-down-fade` | Subtle downward slide (2px) + fade | 0.4s cubic-bezier | Expanding content |
| `animate-shine` | Shimmer effect (background position) | 1.3s infinite | Loading states, skeleton screens |
| `animate-blink` | Step-based blink | 1.1s infinite | Cursor blinking |
| `animate-glow` | Pulsing opacity (0.6 to 1) | 2.5s infinite alternate | Ambient glow effects |

### Using CSS Animations

Apply them as Tailwind classes:

```tsx
<div className="animate-fade-in-up">
  <h1>This heading fades in and slides up</h1>
</div>
```

### Staggered Animations with Delay

Combine with Tailwind's animation-delay utilities or inline styles:

```tsx
<div className="animate-fade-in-up" style={{ animationDelay: "0ms" }}>First</div>
<div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>Second</div>
<div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>Third</div>
```

## Customizing Animations

### Overriding CSS Animations

Override the animation tokens in your own `@theme` block:

```css
@theme {
  /* Slower fade in */
  --animate-fade-in-up: fade-in-up 1.5s ease both;

  /* Custom duration for scale animation */
  --animate-fade-in-scale: fade-in-scale 0.5s ease both;
}
```

### Adding Custom Keyframes

Define new keyframes and register them as animation tokens:

```css
@keyframes bounce-in {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

@theme {
  --animate-bounce-in: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
}
```

Then use it: `className="animate-bounce-in"`.

### Customizing Framer Motion Transitions

Since Framer Motion animations are defined inline in each component, you cannot override them via CSS. However, you can:

1. **Wrap components** with your own `motion` elements for additional effects.
2. **Use the `className` prop** to add CSS animations on top of Framer Motion ones.
3. **Build custom components** that import the base components and modify their animation props.

### Disabling Animations

For users who prefer reduced motion, wrap your animations in a media query check:

```tsx
import { useReducedMotion } from "framer-motion";

function AnimatedCard({ children }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
```

For CSS animations, use the `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Animation Patterns

### Page Load Stagger

Animate elements sequentially as the page loads:

```tsx
import { motion } from "framer-motion";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Page() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp}><Hero ... /></motion.div>
      <motion.div variants={fadeUp}><Section ... /></motion.div>
      <motion.div variants={fadeUp}><Footer ... /></motion.div>
    </motion.div>
  );
}
```

### Scroll-Triggered Animations

Use Framer Motion's `whileInView` for scroll-triggered animations:

```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  <FeatureCard ... />
</motion.div>
```

### Hover Effects

Add interactive hover animations:

```tsx
<motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
  <Card>
    <Card.Body>Hover me for a subtle scale effect</Card.Body>
  </Card>
</motion.div>
```
