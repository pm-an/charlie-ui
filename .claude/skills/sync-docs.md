---
name: sync-docs
description: Check and fix Storybook stories for Charlie UI components. Ensures every component has a matching .stories.tsx with accurate props, variants, and examples.
---

# Sync Component Stories

You are auditing and fixing Storybook stories for the Charlie UI component library.

## Instructions

1. **Determine scope**: If the user specified a component name, check only that one. If "all", scan everything.

2. **For each component**, do:

   a. **Read the source** at `src/components/<ComponentName>.tsx`
   b. **Extract**: all props (interface/type), CVA variants, defaults, sub-components
   c. **Read the story** at `src/components/<ComponentName>.stories.tsx` (if it exists)
   d. **Compare**: Are all props represented in argTypes or stories? Are all variants covered? Are examples up to date?
   e. **Fix or create** the story file if needed

3. **Story format** (follow exactly):

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

export const Default: Story = { args: { /* default props */ } };
// One story per variant/size/state
```

4. **Story title categories** — set `title` to match the component's category:

| Storybook title prefix | Components |
|----------------------|-----------|
| `Primitives/` | Button, Badge, Kbd, Divider, Skeleton, Label, CopyButton, CodeBlock, Spinner, SpinnerOverlay |
| `Forms/` | Input, Textarea, Checkbox, RadioGroup, Switch, Toggle, ToggleGroup, Slider, Select, OTPInput, FileUpload, DatePicker, DateRangePicker, TimePicker, FormField, Field, RichTextEditor, CreditCardInput |
| `Navigation/` | Breadcrumbs, Pagination, Tabs, Stepper, Sidebar |
| `Layout/` | Container, Section, Hero, Navbar, Footer, GradientBackground, Newsletter, ResizablePanels, ScrollArea, ThemeProvider |
| `Cards/` | Card, BlogCard, PricingCard, FeatureCard, SocialCard, StatCard, Testimonial, ChangelogEntry |
| `Data Display/` | DataTable, VirtualList, Accordion, Collapsible, Avatar, AvatarGroup, Timeline |
| `Charts/` | LineChart, BarChart, AreaChart, PieChart, RadarChart |
| `Overlays/` | Modal, FullscreenModal, Drawer, Popover, Tooltip, ContextMenu, Dropdown, DropdownMenu, CommandPalette |
| `Feedback/` | Alert, Toast, Toaster, Progress |
| `Animation/` | Animate, StaggerGroup |
| `Blocks/Marketing/` | CTASection, FAQSection, LogoCloud, StatsSection, FeatureSection, TestimonialSection, PricingSection, BlogSection, TeamSection, ContactSection, AnnouncementBar, IntegrationsSection, BentoGrid, ComparisonTable |
| `Blocks/Auth/` | LoginForm, SignupForm, ForgotPasswordForm |
| `Blocks/Feedback/` | ErrorPage, EmptyState |
| `Blocks/Application/` | DashboardLayout, SettingsPage, ProfileSection, OnboardingWizard, ChatInterface, NotificationPanel, KanbanBoard, CalendarView, FileManager |
| `Blocks/Ecommerce/` | ProductCard, ProductGrid, ShoppingCart, CheckoutForm, OrderSummary |

5. **Rules**:
   - Always `tags: ["autodocs"]`
   - Layout components / blocks: add `parameters: { layout: "fullscreen" }`
   - Stateful components: use `render` function with `React.useState`
   - Use realistic content, not placeholder text
   - Also export new components from `src/index.ts`

6. **Check for orphans**: Any `.stories.tsx` without a matching component should be deleted.

7. **Verify**: Run `npm run build` to confirm TypeScript compiles.

8. **Report**: List which stories were created/updated/deleted and any mismatches found.

9. **Also remember**: When adding a new component, you must also create its test and registry entry (see sync-tests and sync-registry skills).
