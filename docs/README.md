# Charlie UI

**A dark-themed React component library inspired by Raycast's design system.**

Charlie UI provides a comprehensive set of beautifully crafted, dark-first UI components built for modern React applications. Every component is designed with meticulous attention to detail, featuring subtle gradients, refined borders, and smooth animations that echo the polish of Raycast's interface.

## Key Features

- **30+ Components** -- From atomic elements like Button and Badge to complex compositions like CommandPalette and PricingCard.
- **Dark Theme by Default** -- Purpose-built for dark interfaces with carefully tuned greys, translucent layers, and glowing accents.
- **Fully Responsive** -- Every component adapts gracefully across breakpoints, with a mobile-first approach.
- **TypeScript First** -- Complete type definitions for all components, props, and variants.
- **Tailwind CSS v4** -- Built on the latest version of Tailwind CSS with CSS-first configuration and design tokens via `@theme`.
- **Framer Motion Animations** -- Smooth, spring-based transitions and micro-interactions powered by Framer Motion.
- **CVA Variants** -- Variant-driven styling using class-variance-authority for predictable, composable component APIs.
- **Accessible** -- Proper ARIA attributes, keyboard navigation, and semantic HTML throughout.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5.9 | Type safety |
| Tailwind CSS | 4 | Utility-first styling |
| class-variance-authority | 0.7 | Variant management |
| Framer Motion | 12 | Animations |
| Lucide React | 0.577 | Icon system |

## Quick Example

```tsx
import { Button, Badge, Card } from "@charlietogolden/charlie-ui";
import "@charlietogolden/charlie-ui/styles.css";

function App() {
  return (
    <Card>
      <Card.Header title="Welcome" description="Get started with Charlie UI" />
      <Card.Body>
        <Badge variant="green">New</Badge>
        <p>Build beautiful dark-themed interfaces in minutes.</p>
      </Card.Body>
      <Card.Footer>
        <Button variant="primary">Get Started</Button>
      </Card.Footer>
    </Card>
  );
}
```

## License

MIT
