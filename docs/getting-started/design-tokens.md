# Design Tokens

Charlie UI uses Tailwind CSS v4's `@theme` directive to define a comprehensive set of design tokens. These tokens control every visual aspect of the library -- colors, typography, spacing, radii, and animations.

All tokens are defined in `src/styles/globals.css` and become available as Tailwind utility classes once you import the stylesheet.

## Color Palette

### Grey Scale

The grey scale forms the foundation of the dark theme. Values range from near-white (`grey-50`) to near-black (`grey-900`).

| Token | Value | Usage |
|---|---|---|
| `grey-50` | `#e6e6e6` | Lightest grey, rarely used in dark theme |
| `grey-100` | `#cdcece` | Light grey text |
| `grey-200` | `#9c9c9d` | Default text color |
| `grey-300` | `#6a6b6c` | Muted text |
| `grey-400` | `#434345` | Faint text, disabled states |
| `grey-500` | `#2f3031` | Subtle borders |
| `grey-600` | `#1b1c1e` | Surface color |
| `grey-700` | `#111214` | Elevated surface, tooltips, toasts |
| `grey-800` | `#0c0d0f` | Code block backgrounds |
| `grey-900` | `#07080a` | Page background |

### Semantic Backgrounds

| Token | Value | Usage |
|---|---|---|
| `bg` | `#07080a` | Primary page background |
| `bg-100` | `#101111` | Slightly elevated background |
| `bg-200` | `#18191a` | Secondary background |
| `bg-300` | `#313133` | Tertiary background |
| `bg-400` | `#494b4d` | Quaternary background |
| `surface` | `#1b1c1e` | Card and panel surfaces |
| `surface-elevated` | `#111214` | Elevated panels, modals |

### Semantic Foreground

| Token | Value | Usage |
|---|---|---|
| `fg` | `#f4f4f5` | Primary foreground |
| `fg-200` | `#c2c7ca` | Secondary foreground |
| `fg-300` | `#78787c` | Tertiary foreground |
| `fg-400` | `#5e6366` | Quaternary foreground |
| `text-loud` | `#ffffff` | Maximum contrast text |
| `text-default` | `#9c9c9d` | Default body text |
| `text-muted` | `#6a6b6c` | Muted/secondary text |
| `text-faint` | `#434345` | Very subtle text, placeholders |

### Brand / Accent Colors

| Token | Value | Usage |
|---|---|---|
| `red` | `#ff6363` | Primary accent, CTAs, error states |
| `red-muted` | `#2c1617` | Red tinted background |
| `red-dim` | `#833637` | Dimmed red for borders |
| `blue` | `#56c2ff` | Informational, links |
| `blue-muted` | `rgba(86, 194, 255, 0.15)` | Blue tinted background |
| `green` | `#59d499` | Success states |
| `green-muted` | `rgba(89, 212, 153, 0.15)` | Green tinted background |
| `yellow` | `#ffa500` | Warning states |
| `yellow-muted` | `rgba(255, 165, 0, 0.15)` | Yellow tinted background |
| `orange` | `#ff9217` | Accent alternative |
| `purple` | `#9b4dff` | Accent alternative |

### UI Surface Colors

| Token | Value | Usage |
|---|---|---|
| `button-bg` | `hsla(0, 0%, 100%, 0.815)` | Primary button background |
| `button-bg-hover` | `hsl(0, 0%, 100%)` | Primary button hover |
| `button-fg` | `#18191a` | Primary button text |
| `control-bg` | `rgba(255, 255, 255, 0.1)` | Form control backgrounds |
| `separator` | `rgba(255, 255, 255, 0.1)` | Visual separators |
| `border` | `rgba(255, 255, 255, 0.06)` | Subtle borders |
| `border-strong` | `rgba(255, 255, 255, 0.1)` | Emphasized borders |
| `border-hover` | `rgba(255, 255, 255, 0.15)` | Border hover state |

## Typography

### Font Families

| Token | Value | Usage |
|---|---|---|
| `font-sans` | `"Inter", ui-sans-serif, system-ui, sans-serif` | Body text, UI elements |
| `font-display` | `"Instrument Serif", Georgia, serif` | Display headings |
| `font-mono` | `"Geist Mono", "SF Mono", Monaco, "Cascadia Code", monospace` | Code blocks, Kbd |

### Font Sizes

Based on a standard typographic scale:

| Token | Value |
|---|---|
| `text-xs` | `12px` |
| `text-sm` | `14px` |
| `text-base` | `16px` |
| `text-lg` | `18px` |
| `text-xl` | `20px` |
| `text-2xl` | `24px` |
| `text-3xl` | `36px` |
| `text-4xl` | `40px` |
| `text-5xl` | `48px` |
| `text-6xl` | `56px` |
| `text-7xl` | `64px` |
| `text-8xl` | `72px` |

## Spacing

Charlie UI uses an 8px base grid. All spacing values are multiples (or halves) of 8px:

| Token | Value |
|---|---|
| `spacing-0-5` | `4px` |
| `spacing-1` | `8px` |
| `spacing-1-5` | `12px` |
| `spacing-2` | `16px` |
| `spacing-2-5` | `20px` |
| `spacing-3` | `24px` |
| `spacing-4` | `32px` |
| `spacing-5` | `40px` |
| `spacing-6` | `48px` |
| `spacing-7` | `56px` |
| `spacing-8` | `64px` |
| `spacing-9` | `80px` |
| `spacing-10` | `96px` |
| `spacing-11` | `112px` |
| `spacing-12` | `168px` |
| `spacing-13` | `224px` |

## Border Radii

| Token | Value | Usage |
|---|---|---|
| `radius-xs` | `4px` | Small elements (Kbd, inline badges) |
| `radius-sm` | `6px` | Buttons, inputs |
| `radius-md` | `8px` | Cards, panels |
| `radius-lg` | `12px` | Large cards, modals |
| `radius-xl` | `16px` | Hero sections |
| `radius-2xl` | `20px` | Feature panels |
| `radius-3xl` | `24px` | Full-bleed sections |
| `radius-pill` | `9999px` | Pills, toggle groups, tabs |
| `radius-full` | `100%` | Circles, avatars |

## Shadows

Charlie UI defines several shadow utilities in CSS:

| Class | Description |
|---|---|
| `.shadow-card-inset` | Subtle inset highlight on card surfaces (`inset 0 1px 1px 0 rgba(255,255,255,0.1)`) |
| `.shadow-card-elevated` | Elevated card with inset highlight and drop shadow |
| `.shadow-window` | Deep shadow for floating panels like CommandPalette and Toast |
| `.glow-red` | Red glow effect |
| `.glow-blue` | Blue glow effect |
| `.glow-subtle` | Subtle purple-tinted glow |

## CSS Animations

Pre-defined keyframe animations available via Tailwind utility classes:

| Token | Duration | Description |
|---|---|---|
| `animate-fade-in-up` | `1s ease` | Fade in while moving upward |
| `animate-fade-in-scale` | `0.3s ease` | Fade in with scale-up effect |
| `animate-slide-in` | `0.7s cubic-bezier` | Slide in from below with scale |
| `animate-slide-up-fade` | `0.4s cubic-bezier` | Subtle upward slide with fade |
| `animate-slide-down-fade` | `0.4s cubic-bezier` | Subtle downward slide with fade |
| `animate-shine` | `1.3s infinite` | Shimmer/shine effect for loading states |
| `animate-blink` | `1.1s step-end infinite` | Blinking cursor effect |
| `animate-glow` | `2.5s ease-in-out infinite alternate` | Pulsing glow effect |

## Using Tokens in Your Code

Since all tokens are defined via `@theme`, they are available as standard Tailwind CSS utilities:

```tsx
// Colors
<div className="bg-surface text-fg border-border" />
<span className="text-red" />
<div className="bg-blue-muted text-blue" />

// Spacing
<div className="p-spacing-3 mt-spacing-2" />

// Radii
<div className="rounded-radius-lg" />

// Typography
<h1 className="font-display text-5xl" />
<code className="font-mono text-sm" />
```
