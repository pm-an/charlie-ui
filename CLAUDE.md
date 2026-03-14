# Charlie UI — Project Instructions

## Component Sync Rules (MANDATORY)

**Whenever you create, modify, or delete a component in `src/components/`, you MUST also:**
1. **Update/create the Storybook story** at `src/components/ComponentName.stories.tsx`
2. **Update/create the test file** at `src/components/__tests__/ComponentName.test.tsx`
3. **Update the registry metadata** in `scripts/registry-metadata.ts`

All three are non-negotiable. No component ships without stories, tests, AND a registry entry.

---

## Story Rules

### What to update:

1. **Modified component** — Update the matching `.stories.tsx`:
   - If props were added/removed/renamed, update story args and argTypes
   - If variants changed, add/remove/update variant stories

2. **New component** — Create `src/components/ComponentName.stories.tsx`:
   - Use `tags: ["autodocs"]` to auto-generate docs
   - Set `title` to the right category: "Primitives/Name", "Forms/Name", "Navigation/Name", "Layout/Name", "Cards/Name", "Data Display/Name", "Charts/Name", "Overlays/Name", "Feedback/Name", "Animation/Name"
   - Create a `Default` story + stories for each variant/size/state
   - Use realistic content (not "lorem ipsum")
   - Layout components use `parameters: { layout: "fullscreen" }`
   - Interactive components with state use `render` function with `useState`
   - Also export the component from `src/index.ts`

3. **Deleted component** — Remove the `.stories.tsx` file and remove from `src/index.ts`

### Story format

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComponentName } from "./ComponentName";

const meta: Meta<typeof ComponentName> = {
  title: "Category/ComponentName",
  component: ComponentName,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = { args: { /* props */ } };
```

---

## Test Rules (FULL COVERAGE)

Every component MUST have a test file at `src/components/__tests__/ComponentName.test.tsx`.

### What to test (aim for full coverage):

1. **Rendering** — Component renders without crashing for each variant/size
2. **Props** — All props are applied correctly (className, custom props, forwarded HTML attrs)
3. **Variants** — Each CVA variant renders the correct CSS classes
4. **Sizes** — Each size variant renders correctly
5. **Interactions** — Click handlers, onChange, toggle states, keyboard events
6. **Conditional rendering** — Elements that show/hide based on props (icons, labels, badges, error states)
7. **Accessibility** — Proper ARIA attributes, roles, labels
8. **Refs** — forwardRef components pass refs correctly
9. **Composition** — Compound components (Card.Header, Accordion.Item) work together
10. **Edge cases** — Empty children, missing optional props, disabled states

### Test format

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ComponentName } from "../ComponentName";

describe("ComponentName", () => {
  it("renders without crashing", () => {
    render(<ComponentName>Test</ComponentName>);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<ComponentName className="custom">Test</ComponentName>);
    expect(container.firstChild).toHaveClass("custom");
  });

  // variant tests, interaction tests, a11y tests, etc.
});
```

### Test tooling
- **Vitest** as the test runner
- **@testing-library/react** for rendering and queries
- **@testing-library/user-event** for realistic interactions
- **@testing-library/jest-dom** for DOM matchers (toBeInTheDocument, toHaveClass, etc.)

---

## Registry Rules (shadcn-compatible registry)

Every component, utility, hook, and animation file MUST have an entry in `scripts/registry-metadata.ts`. The build script (`npm run build:registry`) reads this file to generate the JSON registry deployed to GitHub Pages.

### When to update registry-metadata.ts:

1. **New component** — Add an entry to the `registryMetadata` object
2. **Modified component** — Update `description` if the component's purpose changed. No update needed for internal code changes (imports, deps are auto-detected by the build script).
3. **Deleted component** — Remove the entry from `registryMetadata`
4. **New utility** (`src/utils/*.ts`) — Add as `registry:lib`, category `lib`
5. **New hook** (`src/hooks/*.ts`) — Add as `registry:hook`, category `hooks`
6. **New animation file** (`src/animation/*.ts`) — Add as `registry:lib` or `registry:hook`, category `lib` or `hooks`

### How to determine `type`:

| Type | When to use |
|------|------------|
| `registry:component` | Standalone UI component (Button, Modal, Tabs, etc.) |
| `registry:block` | Composed section/page that assembles other components (LoginForm, DashboardLayout, BlogSection, etc.) |
| `registry:lib` | Utility function or module (cn, chart-helpers, toast-store, etc.) |
| `registry:hook` | React hook (useControllableState, useReducedMotion, etc.) |
| `registry:style` | CSS file (only charlie-theme uses this) |

### How to determine `category`:

| Category | For |
|----------|-----|
| `primitives` | Atomic UI elements: Button, Badge, Kbd, Divider, Skeleton, Label, CopyButton, CodeBlock, Spinner, SpinnerOverlay |
| `forms` | Form inputs and controls: Input, Checkbox, Select, DatePicker, RichTextEditor, etc. |
| `navigation` | Nav components: Breadcrumbs, Pagination, Tabs, Stepper, Sidebar |
| `layout` | Page structure: Container, Section, Hero, Navbar, Footer, etc. |
| `cards` | Card components: Card, BlogCard, PricingCard, FeatureCard, etc. |
| `data-display` | Data viewing: DataTable, VirtualList, Accordion, Avatar, Timeline, etc. |
| `charts` | Chart components: LineChart, BarChart, AreaChart, PieChart, RadarChart |
| `overlays` | Floating UI: Modal, Drawer, Popover, Tooltip, DropdownMenu, CommandPalette, etc. |
| `feedback` | User feedback: Alert, Toast, Toaster, Progress |
| `animation` | Motion components: Animate, StaggerGroup, AnimationProvider |
| `blocks-marketing` | Marketing sections: CTASection, FAQSection, PricingSection, BlogSection, etc. |
| `blocks-auth` | Auth forms: LoginForm, SignupForm, ForgotPasswordForm |
| `blocks-feedback` | Feedback pages: ErrorPage, EmptyState |
| `blocks-application` | App blocks: DashboardLayout, SettingsPage, KanbanBoard, CalendarView, etc. |
| `blocks-ecommerce` | E-commerce blocks: ProductCard, ShoppingCart, CheckoutForm, OrderSummary, etc. |
| `lib` | Utility modules |
| `hooks` | React hooks |
| `styles` | CSS files |

### Naming convention:

- Registry name is **kebab-case**: `PricingCard` → `pricing-card`, `OTPInput` → `otp-input`
- Source path is the actual file: `src/components/PricingCard.tsx`
- Target path is where it lands in consumer projects: `components/ui/pricing-card.tsx`
- Utilities go to `lib/`: `src/utils/cn.ts` → `lib/cn.ts`
- Hooks go to `hooks/`: `src/hooks/useControllableState.ts` → `hooks/use-controllable-state.ts`

### Entry format:

```ts
"kebab-name": {
  title: "ComponentName",
  description: "One-line description of what the component does",
  type: "registry:component",  // or registry:block, registry:lib, etc.
  category: "primitives",      // see category table above
  source: "src/components/ComponentName.tsx",
  target: "components/ui/kebab-name.tsx",
},
```

For multi-file components (like RichTextEditor), add `extraFiles`:
```ts
"rich-text-editor": {
  title: "RichTextEditor",
  description: "...",
  type: "registry:component",
  category: "forms",
  source: "src/components/RichTextEditor.tsx",
  target: "components/ui/rich-text-editor.tsx",
  extraFiles: [
    { source: "src/components/rich-text-editor/extensions.ts", target: "components/ui/rich-text-editor/extensions.ts" },
  ],
},
```

### What you DON'T need to do:

- **Don't** manually list `dependencies` or `registryDependencies` — the build script auto-detects these by parsing imports
- **Don't** rewrite import paths — the build script handles all path rewriting
- **Don't** update `registry.json` or `registry/r/*.json` — these are generated output
- **Don't** update `scripts/build-registry.ts` unless adding a new import path mapping pattern (e.g., a new `src/` subdirectory)

### After making changes:

Run `npm run build:registry && npm run validate:registry` to verify. Validation catches missing cross-references, broken deps, and empty content.

---

## Category Mapping

| Category | Components |
|----------|-----------|
| Primitives | Button, Badge, Kbd, Divider, Skeleton, Label, CopyButton, CodeBlock |
| Forms | Input, Textarea, Checkbox, RadioGroup, Switch, Toggle, ToggleGroup, Slider, Select, OTPInput, FileUpload, DatePicker, DateRangePicker, TimePicker, FormField, RichTextEditor |
| Navigation | Breadcrumbs, Pagination, Tabs, Stepper, Sidebar |
| Layout | Container, Section, Hero, Navbar, Footer, GradientBackground, Newsletter, ResizablePanels, ScrollArea |
| Cards | Card, BlogCard, PricingCard, FeatureCard, SocialCard, StatCard, Testimonial, ChangelogEntry |
| Data Display | DataTable, VirtualList, Accordion, Collapsible, Avatar, AvatarGroup, Timeline |
| Charts | LineChart, BarChart, AreaChart, PieChart, RadarChart |
| Overlays | Modal, FullscreenModal, Drawer, Popover, Tooltip, ContextMenu, Dropdown, DropdownMenu, CommandPalette |
| Feedback | Alert, Toast, Toaster, Progress |
| Animation | Animate, StaggerGroup |

## Tech Stack

- React 19, TypeScript, Tailwind CSS v4 (`@theme` tokens)
- CVA (class-variance-authority) for variants
- Framer Motion for animations
- Lucide React for icons
- `cn()` utility for className merging (clsx + tailwind-merge)
- Storybook 10 for documentation (autodocs + stories)
- Vitest + Testing Library for tests

## Commands

```bash
npm run build            # tsc + vite library build
npm run dev              # dev server
npm run storybook        # Storybook dev on port 6006
npm run build-storybook  # static Storybook export
npm run test             # run all tests
npm run test:coverage    # run tests with coverage report
npm run build:registry   # generate shadcn registry JSON to registry/
npm run validate:registry # validate registry integrity
```

## Theming

All tokens use `--charlie-*` CSS custom properties. Override via `<ThemeProvider>` or raw CSS.
7 preset themes available: default, indigo, ocean, emerald, amber, rose, violet.

## File Naming

- Components: `src/components/PascalCase.tsx`
- Stories: `src/components/PascalCase.stories.tsx`
- Tests: `src/components/__tests__/PascalCase.test.tsx`
- Exports: everything through `src/index.ts`
