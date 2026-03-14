# Charlie UI — Project Instructions

## Component Sync Rules (MANDATORY)

**Whenever you create, modify, or delete a component, you MUST update all three:**
1. **Story** — `src/components/ComponentName.stories.tsx` (use `/sync-docs` for format details)
2. **Test** — `src/components/__tests__/ComponentName.test.tsx` (use `/sync-tests` for format details)
3. **Registry** — `scripts/registry-metadata.ts` (use `/sync-registry` for format details)
4. **Export** — `src/index.ts`

No component ships without all four.

## Tech Stack

- React 19, TypeScript, Tailwind CSS v4 (`@theme` tokens)
- CVA (class-variance-authority) for variants
- Framer Motion for animations, Lucide React for icons
- `cn()` utility for className merging (clsx + tailwind-merge)
- Storybook 10 (autodocs), Vitest + Testing Library

## Commands

```bash
npm run build              # tsc + vite library build
npm run dev                # dev server
npm run storybook          # Storybook dev on port 6006
npm run build-storybook    # static Storybook export
npm run test               # run all tests
npm run test:coverage      # tests with coverage report
npm run build:registry     # generate component registry JSON
npm run validate:registry  # validate registry integrity
```

## File Naming

- Components: `src/components/PascalCase.tsx`
- Stories: `src/components/PascalCase.stories.tsx`
- Tests: `src/components/__tests__/PascalCase.test.tsx`
- Exports: `src/index.ts`
- Registry metadata: `scripts/registry-metadata.ts`

## Theming

All tokens use `--charlie-*` CSS custom properties. Override via `<ThemeProvider>` or raw CSS.
7 preset themes: default, indigo, ocean, emerald, amber, rose, violet.

## Category Mapping

| Category | Components |
|----------|-----------|
| Primitives | Button, Badge, Kbd, Divider, Skeleton, Label, CopyButton, CodeBlock, Spinner, SpinnerOverlay |
| Forms | Input, Textarea, Checkbox, RadioGroup, Switch, Toggle, ToggleGroup, Slider, Select, OTPInput, FileUpload, DatePicker, DateRangePicker, TimePicker, FormField, Field, RichTextEditor, CreditCardInput |
| Navigation | Breadcrumbs, Pagination, Tabs, Stepper, Sidebar |
| Layout | Container, Section, Hero, Navbar, Footer, GradientBackground, Newsletter, ResizablePanels, ScrollArea |
| Cards | Card, BlogCard, PricingCard, FeatureCard, SocialCard, StatCard, Testimonial, ChangelogEntry |
| Data Display | DataTable, VirtualList, Accordion, Collapsible, Avatar, AvatarGroup, Timeline |
| Charts | LineChart, BarChart, AreaChart, PieChart, RadarChart |
| Overlays | Modal, FullscreenModal, Drawer, Popover, Tooltip, ContextMenu, Dropdown, DropdownMenu, CommandPalette |
| Feedback | Alert, Toast, Toaster, Progress |
| Animation | Animate, StaggerGroup |
| Blocks | Marketing (CTASection, FAQSection, etc.), Auth (LoginForm, SignupForm, ForgotPasswordForm), Application (DashboardLayout, KanbanBoard, etc.), Ecommerce (ProductCard, CheckoutForm, etc.), Feedback (ErrorPage, EmptyState) |
