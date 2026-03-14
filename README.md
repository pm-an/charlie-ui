# Charlie UI

A dark-first React component library with 110+ components, built on Tailwind CSS v4 and designed for modern web applications.

## Features

- **110+ components** — from primitives (Button, Badge, Input) to full application blocks (DashboardLayout, KanbanBoard, CheckoutForm)
- **Dark-first design** — every component is crafted for dark UIs out of the box
- **7 theme presets** — Default, Indigo, Ocean, Emerald, Amber, Rose, Violet — or create your own with CSS custom properties
- **Component registry** — install only what you need with `npx shadcn add`
- **Tailwind CSS v4** — built on `@theme` tokens and `--charlie-*` CSS custom properties
- **Fully typed** — written in TypeScript with exported types for every component
- **Accessible** — keyboard navigation, ARIA attributes, and screen reader support
- **Animated** — smooth transitions with reduced-motion support
- **Interactive docs** — browse and test every component in the included Storybook

## Quick Start

### Option 1: CLI registry (recommended)

Install individual components directly into your project:

```bash
npx shadcn add button --registry https://piotrmichalik.github.io/component-library/registry
```

### Option 2: Package install

```bash
npm install @charlietogolden/charlie-ui
```

Import the stylesheet and components:

```tsx
import "@charlietogolden/charlie-ui/styles.css";
import { Button, Card, Badge } from "@charlietogolden/charlie-ui";
```

## Theming

All tokens use `--charlie-*` CSS custom properties. Wrap your app in `<ThemeProvider>` or override variables directly in CSS:

```tsx
import { ThemeProvider } from "@charlietogolden/charlie-ui";

function App() {
  return (
    <ThemeProvider theme="ocean">
      {/* your app */}
    </ThemeProvider>
  );
}
```

Custom themes are just objects — override any token:

```css
:root {
  --charlie-accent: #6366f1;
  --charlie-bg: #0a0a0a;
  --charlie-border: rgba(255, 255, 255, 0.08);
}
```

**Presets:** default, indigo, ocean, emerald, amber, rose, violet

## Component Categories

| Category | Examples |
|---|---|
| **Primitives** | Button, Badge, Kbd, Divider, Skeleton, Label, CopyButton, CodeBlock, Spinner |
| **Forms** | Input, Textarea, Checkbox, RadioGroup, Switch, Select, DatePicker, OTPInput, FileUpload, RichTextEditor |
| **Navigation** | Breadcrumbs, Pagination, Tabs, Stepper, Sidebar |
| **Layout** | Container, Section, Hero, Navbar, Footer, GradientBackground, ResizablePanels, ScrollArea |
| **Cards** | Card, BlogCard, PricingCard, FeatureCard, SocialCard, StatCard, Testimonial |
| **Data Display** | DataTable, VirtualList, Accordion, Collapsible, Avatar, AvatarGroup, Timeline |
| **Charts** | LineChart, BarChart, AreaChart, PieChart, RadarChart |
| **Overlays** | Modal, Drawer, Popover, Tooltip, ContextMenu, DropdownMenu, CommandPalette |
| **Feedback** | Alert, Toast, Toaster, Progress |
| **Animation** | Animate, StaggerGroup |
| **Blocks** | LoginForm, DashboardLayout, KanbanBoard, CheckoutForm, ShoppingCart, CalendarView, SettingsPage, and more |

## Development

```bash
npm install          # install dependencies
npm run dev          # dev server
npm run storybook    # component docs on port 6006
npm run test         # run all tests
npm run build        # production build
```

## Tech Stack

- React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide React icons
- Vitest + Testing Library

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

[MIT](./LICENSE)
