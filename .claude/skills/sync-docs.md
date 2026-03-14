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
  title: "Category/ComponentName",  // Atoms, Cards, Layout, or Interactive
  component: ComponentName,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = { args: { /* default props */ } };
// One story per variant/size/state
```

4. **Rules**:
   - Always `tags: ["autodocs"]`
   - Layout components: add `parameters: { layout: "fullscreen" }`
   - Stateful components: use `render` function with `React.useState`
   - Use realistic content, not placeholder text
   - Category mapping: Atoms (Button, Badge, Input, Toggle, Kbd, Divider, CodeBlock, Skeleton), Cards (Card, FeatureCard, PricingCard, Accordion, Testimonial, BlogCard), Layout (Navbar, Hero, Section, Container, Footer, Newsletter, GradientBackground, SocialCard), Interactive (Tabs, Tooltip, Avatar, AvatarGroup, CommandPalette, ToggleGroup, ChangelogEntry, Toast)

5. **Check for orphans**: Any `.stories.tsx` without a matching component should be deleted.

6. **Verify**: Run `npm run build` to confirm TypeScript compiles.

7. **Report**: List which stories were created/updated/deleted and any mismatches found.
