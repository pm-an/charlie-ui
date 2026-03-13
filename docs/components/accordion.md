# Accordion

An expandable content panel component that supports single or multiple open items. Uses Framer Motion for smooth expand/collapse animations.

## Import

```tsx
import { Accordion } from "@piotr/charlie-ui";
```

## Props

### Accordion (Root)

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `"single" \| "multiple"` | `"single"` | Whether one or many items can be open at once |
| `defaultOpen` | `string[]` | `[]` | Array of item `value` strings that should be open initially |
| `className` | `string` | -- | Additional CSS classes |
| `children` | `ReactNode` | -- | `Accordion.Item` elements |

### Accordion.Item

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | **(required)** | Unique identifier for this item, used to track open state |
| `title` | `ReactNode` | **(required)** | Content displayed in the always-visible trigger area |
| `className` | `string` | -- | Additional CSS classes |
| `children` | `ReactNode` | -- | Collapsible content revealed when the item is open |

## Usage

### Single Mode (Default)

Only one item can be open at a time. Opening a new item closes the previously open one.

```tsx
<Accordion>
  <Accordion.Item value="item-1" title="What is Charlie UI?">
    Charlie UI is a dark-themed React component library inspired by Raycast.
  </Accordion.Item>
  <Accordion.Item value="item-2" title="Is it accessible?">
    Yes. All interactive components include proper ARIA attributes and keyboard support.
  </Accordion.Item>
  <Accordion.Item value="item-3" title="Can I customize the theme?">
    Absolutely. All design tokens are defined via Tailwind CSS v4 and can be overridden.
  </Accordion.Item>
</Accordion>
```

### Multiple Mode

Multiple items can be open simultaneously.

```tsx
<Accordion mode="multiple" defaultOpen={["item-1", "item-3"]}>
  <Accordion.Item value="item-1" title="First Section">
    This section starts open.
  </Accordion.Item>
  <Accordion.Item value="item-2" title="Second Section">
    This section starts closed.
  </Accordion.Item>
  <Accordion.Item value="item-3" title="Third Section">
    This section also starts open.
  </Accordion.Item>
</Accordion>
```

### With Default Open Items

```tsx
<Accordion defaultOpen={["faq-1"]}>
  <Accordion.Item value="faq-1" title="How do I install it?">
    Run npm install @piotr/charlie-ui and import the stylesheet.
  </Accordion.Item>
  <Accordion.Item value="faq-2" title="What React version is required?">
    React 18 or 19.
  </Accordion.Item>
</Accordion>
```

## Notes

- The `Accordion` component uses React Context internally. `Accordion.Item` must be a direct or nested child of `Accordion`.
- The expand/collapse animation is handled by Framer Motion's `AnimatePresence` and `motion.div` with height and opacity transitions.
- Each item is separated by a dotted bottom border (`border-b border-dotted border-white/10`).
