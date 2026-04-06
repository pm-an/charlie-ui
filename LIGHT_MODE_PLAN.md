# Light Mode Support — Implementation Plan

## Overview

Add light mode support to Charlie UI. The token infrastructure (ThemeProvider + CSS custom
properties) already supports this — the work is primarily replacing ~1,000+ hardcoded
dark-mode color references across ~160 component files with semantic tokens, then defining
light-mode values for those tokens.

## Strategy: Token-First, Then Migrate

1. **Phase 1** — Expand the token layer and add a color mode switching mechanism
2. **Phase 2** — Migrate all components from hardcoded colors to semantic tokens (parallelizable)
3. **Phase 3** — Light-mode variants for CSS utilities (glass, glows, shadows, gradients)
4. **Phase 4** — Stories, testing, and polish

---

## Phase 1: Token Infrastructure (sequential — must complete before Phase 2)

### 1A. Add new semantic tokens to `globals.css`

Some hardcoded patterns don't map to any existing token. Add these to the `@theme` block:

| New Token | Dark Value | Purpose | Replaces |
|-----------|-----------|---------|----------|
| `--color-bg-subtle` | `rgba(255,255,255,0.05)` | Subtle elevated surfaces | `bg-white/5` |
| `--color-bg-subtle-hover` | `rgba(255,255,255,0.08)` | Hover on subtle surfaces | `hover:bg-white/5`, `hover:bg-white/[0.08]` |
| `--color-fg-on-accent` | `#ffffff` | Text on accent-colored backgrounds | `text-white` on accent buttons |
| `--color-overlay` | `rgba(0,0,0,0.6)` | Modal/drawer backdrops | hardcoded `rgba(0,0,0,0.6)` |

### 1B. Add light mode token values

Create a `lightTheme` preset in `src/themes/presets.ts` with full light-mode values:

```
bg:              #ffffff       (or #fafafa)
bg-100:          #f5f5f5
bg-200:          #e5e5e5
bg-300:          #d4d4d4
bg-400:          #a3a3a3
surface:         #f5f5f5
surface-elevated:#ffffff
fg:              #171717
fg-200:          #404040
fg-300:          #737373
fg-400:          #a3a3a3
text-loud:       #0a0a0a
text-default:    #525252
text-muted:      #a3a3a3
text-faint:      #d4d4d4
border:          rgba(0,0,0,0.08)
border-strong:   rgba(0,0,0,0.15)
border-hover:    rgba(0,0,0,0.2)
control-bg:      rgba(0,0,0,0.06)
separator:       rgba(0,0,0,0.08)
button-bg:       #171717
button-bg-hover: #0a0a0a
button-fg:       #ffffff
accent-muted:    (per-accent, lighter tints)
```

### 1C. Color mode switching

Add a `mode` prop to `ThemeProvider`:

```tsx
<ThemeProvider mode="light">   // applies lightTheme defaults
<ThemeProvider mode="dark">    // current behavior (default)
<ThemeProvider mode="system">  // follows prefers-color-scheme
```

Implementation: `mode` selects a base theme that gets merged with any explicit `theme` overrides.
Add a `data-charlie-mode="light|dark"` attribute on the wrapper div for CSS-level targeting
if needed.

### 1D. Shadow tokens for light mode

Define `--charlie-shadow-*` CSS custom properties (currently shadows are not tokenized via
`--charlie-*` vars). Add these to `CharlieTheme` interface so they flip with color mode:

```
shadow-card (light):  0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)
shadow-elevated (light): 0 4px 16px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.06)
shadow-input (light): inset 0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.08)
```

No white inset highlights in light mode (they'd be invisible).

---

## Phase 2: Component Migration (PARALLELIZABLE)

### The Substitution Map

Every agent running component migration should apply these replacements:

| Hardcoded Pattern | Semantic Replacement | Notes |
|---|---|---|
| `text-white` (as heading/body text) | `text-loud` | NOT on accent/colored backgrounds |
| `text-white` (on accent bg) | `text-fg-on-accent` | e.g., primary button label |
| `text-white/70` | `text-fg-200` | Secondary text |
| `text-white/60` | `text-fg-200` or `text-fg-300` | Context-dependent |
| `text-white/40` | `text-muted` | Placeholder/faint text |
| `text-white/50` | `text-muted` | |
| `bg-white/5` | `bg-subtle` | Subtle backgrounds |
| `bg-white/[0.03]` | `bg-subtle` (or new token) | Very faint surfaces |
| `bg-white/[0.08]`, `bg-white/10` | `bg-subtle-hover` | Hover/active states |
| `hover:bg-white/5` | `hover:bg-subtle` | |
| `hover:bg-white/10` | `hover:bg-subtle-hover` | |
| `border-white/[0.06]` | `border-border` | Default borders |
| `border-white/[0.08]` | `border-border` | |
| `border-white/10` | `border-border-strong` | |
| `border-white/15` | `border-border-hover` | |
| `hover:border-white/15` | `hover:border-border-hover` | |
| `hover:border-white/20` | `hover:border-border-hover` | |
| `rgba(255,255,255,0.06)` (in CVA) | Use token class instead | |
| `rgba(255,255,255,0.1)` (in shadows) | Handled by shadow tokens | |
| `shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.3)]` | New shadow token or remove | Inline shadow hacks |

### Parallel Batches (by category)

Each batch is independent — can run as a separate agent. Order doesn't matter.

**Batch A — Primitives** (~10 files)
- Button, Badge, Kbd, Divider, Skeleton, Label, CopyButton, CodeBlock, Spinner, SpinnerOverlay

**Batch B — Forms** (~18 files)
- Input, Textarea, Checkbox, RadioGroup, Switch, Toggle, ToggleGroup, Slider, Select,
  OTPInput, FileUpload, DatePicker, DateRangePicker, TimePicker, FormField, Field,
  RichTextEditor, CreditCardInput

**Batch C — Navigation + Layout** (~10 files)
- Breadcrumbs, Pagination, Tabs, Stepper, Sidebar, Container, Section, Hero, Navbar,
  Footer, GradientBackground, Newsletter, ResizablePanels, ScrollArea

**Batch D — Cards** (~8 files)
- Card, BlogCard, PricingCard, FeatureCard, SocialCard, StatCard, Testimonial, ChangelogEntry

**Batch E — Data Display** (~7 files)
- DataTable, VirtualList, Accordion, Collapsible, Avatar, AvatarGroup, Timeline

**Batch F — Charts** (~5 files)
- LineChart, BarChart, AreaChart, PieChart, RadarChart

**Batch G — Overlays** (~9 files)
- Modal, FullscreenModal, Drawer, Popover, Tooltip, ContextMenu, Dropdown, DropdownMenu,
  CommandPalette

**Batch H — Feedback + Animation** (~6 files)
- Alert, Toast, Toaster, Progress, Animate, StaggerGroup

**Batch I — Blocks (Marketing + Auth)** (~10 files)
- CTASection, FAQSection, LoginForm, SignupForm, ForgotPasswordForm, etc.

**Batch J — Blocks (Application + Ecommerce + Feedback)** (~10 files)
- DashboardLayout, KanbanBoard, ProductCard, CheckoutForm, ErrorPage, EmptyState, etc.

### Per-Batch Agent Instructions

Each agent should:
1. Read every component file in the batch
2. Apply the substitution map above
3. Use judgment for ambiguous cases (e.g., `text-white` on a colored badge — is it accent or loud?)
4. Do NOT change colors that are intentionally hardcoded for a specific design effect (e.g., status colors on colored badges where `text-white` means "white on red/green/blue background")
5. Do NOT touch story files or test files (separate phase)
6. Run `npm run build` after changes to verify no type errors

---

## Phase 3: CSS Utilities Migration (can overlap with Phase 2)

Update `globals.css` utility classes. These need design decisions, not just find-replace.

| Utility | Dark Mode (current) | Light Mode Approach |
|---------|--------------------|--------------------|
| `.glass` | `rgba(17,18,20,0.75)` + blur | `rgba(255,255,255,0.75)` + blur |
| `.glass-heavy` | `rgba(0,0,0,0.6)` + blur | `rgba(255,255,255,0.8)` + blur |
| `.bg-card-gradient` | dark grey gradient | light grey gradient (surface tokens) |
| `.bg-card-gradient-translucent` | dark translucent | light translucent |
| `.glow-*` | colored glows (visible on dark) | Reduce intensity or swap for subtle borders on light |
| `.shadow-card-inset` | white inset highlight | Remove or swap to dark inset |
| `.hover-glow` | ambient blue glow | Subtle shadow lift instead |
| `.card-hover-reveal` | grey-700 → grey-600 reveal | grey-100 → grey-200 reveal |
| `.text-gradient-subtle` | light-on-dark gradient | dark-on-light gradient |
| `.text-gradient-white` | white gradient text | dark gradient text |
| `.focus-ring` | white ring on dark bg | dark ring on light bg |
| `.bg-section-alt` | dark grey gradient | light grey gradient |
| `.bg-aurora` | accent radial on dark | accent radial on light (lower opacity) |

Approach: Use `[data-charlie-mode="light"]` selector to provide alternate values, OR
tokenize these via `--charlie-*` vars so ThemeProvider handles them.

---

## Phase 4: Stories, Tests, and QA

### 4A. Storybook decorator
Add a global Storybook toolbar toggle for light/dark mode. This wraps stories in the
appropriate ThemeProvider.

### 4B. Story updates
Each component story should render acceptably in both modes. Stories that use hardcoded
dark-specific wrappers (e.g., `bg-gray-900` containers) need updating.

### 4C. Visual regression
Snapshot or screenshot each component in both modes to catch issues.

### 4D. Documentation
Update ThemeProvider story/docs to document the `mode` prop and light theme usage.

---

## Parallelization Summary

```
Phase 1 (sequential, ~1 session)
    |
    v
Phase 2 Batches A-J (up to 10 agents in parallel)
    +--- Phase 3 (1 agent, can run alongside Phase 2)
    |
    v
Phase 4 (sequential, final polish)
```

**Maximum parallelism**: 11 agents during Phase 2+3.
**Recommended parallelism**: 3-5 agents at a time to keep review manageable.

---

## Key Design Decisions to Make Before Starting

1. **Light mode background**: Pure white (`#fff`) or off-white (`#fafafa`)?
2. **Glass effects in light**: Frosted white, or skip glass entirely?
3. **Glow effects in light**: Keep with reduced opacity, or replace with shadow-lift?
4. **Default mode**: Should the library default to dark (current) or system preference?
5. **Accent-muted in light**: Each accent preset needs a light-mode `accentMuted` (tinted pastel).

---

## Risk / Gotchas

- **`text-white` on accent buttons** — this must stay white (or near-white) in BOTH modes.
  Use `text-fg-on-accent` token, not `text-loud`.
- **Charts** — Recharts/chart components may have their own color logic. Need per-chart review.
- **Third-party styles** — RichTextEditor (TipTap), DatePicker (react-day-picker) may need
  separate CSS overrides for light mode.
- **Inline `style=` props** — Some components use inline styles with hardcoded colors.
  Grep for `style={{` and `rgba(` in TSX files.
- **Storybook background** — Storybook's own chrome is separate from component theming.
