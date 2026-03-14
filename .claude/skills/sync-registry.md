---
name: sync-registry
description: Add, update, or remove entries in scripts/registry-metadata.ts when components are created, modified, or deleted. Ensures the Charlie UI component registry stays in sync with the codebase.
---

# Sync Registry Metadata

You are maintaining the Charlie UI component registry. Every component, utility, hook, and animation file MUST have an entry in `scripts/registry-metadata.ts`.

## Instructions

1. **Determine scope**: If the user specified a component name, handle only that one. If "all" or no argument, scan for mismatches between source files and metadata entries.

2. **For "all" scope**, detect:
   - Components in `src/components/*.tsx` (excluding `.stories.tsx`, `.test.tsx`) without a metadata entry → add
   - Utilities in `src/utils/*.ts`, hooks in `src/hooks/*.ts`, animation files in `src/animation/*.{ts,tsx}` without entries → add
   - Metadata entries whose `source` file no longer exists → remove
   - Components whose purpose/description has significantly changed → update description

3. **For each new entry**, determine:

### Type

| Type | When to use |
|------|------------|
| `registry:component` | Standalone UI component (Button, Modal, Tabs, etc.) |
| `registry:block` | Composed section/page that assembles multiple components (LoginForm, DashboardLayout, BlogSection, etc.) |
| `registry:lib` | Utility function or module (cn, chart-helpers, toast-store, etc.) |
| `registry:hook` | React hook (useControllableState, useReducedMotion, etc.) |
| `registry:style` | CSS file (only charlie-theme uses this) |

### Category

| Category | For |
|----------|-----|
| `primitives` | Atomic UI elements: Button, Badge, Kbd, Divider, Skeleton, Label, CopyButton, CodeBlock, Spinner, SpinnerOverlay |
| `forms` | Form inputs/controls: Input, Checkbox, Select, DatePicker, RichTextEditor, Field, etc. |
| `navigation` | Nav: Breadcrumbs, Pagination, Tabs, Stepper, Sidebar |
| `layout` | Page structure: Container, Section, Hero, Navbar, Footer, GradientBackground, Newsletter, ResizablePanels, ScrollArea |
| `cards` | Card components: Card, BlogCard, PricingCard, FeatureCard, SocialCard, StatCard, Testimonial, ChangelogEntry |
| `data-display` | Data: DataTable, VirtualList, Accordion, Collapsible, Avatar, AvatarGroup, Timeline |
| `charts` | Charts: LineChart, BarChart, AreaChart, PieChart, RadarChart |
| `overlays` | Floating UI: Modal, Drawer, Popover, Tooltip, DropdownMenu, CommandPalette, ContextMenu |
| `feedback` | Feedback: Alert, Toast, Toaster, Progress |
| `animation` | Motion: Animate, StaggerGroup, AnimationProvider |
| `blocks-marketing` | Marketing sections: CTASection, FAQSection, PricingSection, BlogSection, FeatureSection, etc. |
| `blocks-auth` | Auth forms: LoginForm, SignupForm, ForgotPasswordForm |
| `blocks-feedback` | Feedback pages: ErrorPage, EmptyState |
| `blocks-application` | App blocks: DashboardLayout, SettingsPage, KanbanBoard, CalendarView, FileManager, etc. |
| `blocks-ecommerce` | E-commerce: ProductCard, ShoppingCart, CheckoutForm, OrderSummary, etc. |
| `lib` | Utility modules (for `registry:lib` items) |
| `hooks` | React hooks (for `registry:hook` items) |
| `styles` | CSS files (for `registry:style` items) |

### Naming & paths

- Registry name: **kebab-case** — `PricingCard` → `pricing-card`, `OTPInput` → `otp-input`
- Components: source `src/components/Name.tsx` → target `components/ui/kebab-name.tsx`
- Utilities: source `src/utils/name.ts` → target `lib/kebab-name.ts`
- Hooks: source `src/hooks/useName.ts` → target `hooks/use-kebab-name.ts`
- Animation: source `src/animation/name.ts` → target `lib/animation-name.ts` (or `hooks/` for hooks)

### Entry format

```ts
"kebab-name": {
  title: "ComponentName",
  description: "One-line description of what the component does",
  type: "registry:component",
  category: "primitives",
  source: "src/components/ComponentName.tsx",
  target: "components/ui/kebab-name.tsx",
},
```

For multi-file components, add `extraFiles`:
```ts
extraFiles: [
  { source: "src/components/sub-dir/file.ts", target: "components/ui/sub-dir/file.ts" },
],
```

4. **What NOT to do**:
   - Don't manually list `dependencies` or `registryDependencies` — auto-detected by the build script
   - Don't rewrite import paths — handled by the build script
   - Don't touch generated files (`registry/`, `registry.json`, `registry/r/*.json`)
   - Don't modify `scripts/build-registry.ts` unless adding a new source directory pattern

5. **After making changes**:
   - Run `npm run build:registry && npm run validate:registry`
   - Report: entries added/updated/removed, validation result

6. **Also remember**: When adding a new component, you must also create its story and test (see sync-docs and sync-tests skills).
