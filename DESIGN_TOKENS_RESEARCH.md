# Raycast Design Tokens Research

> Extracted from raycast.com (Homepage, Pricing, Pro, Developers, Changelog, Blog) on 2026-03-13.
> Source: compiled Next.js CSS bundles + inline styles + SVG attributes.

---

## Table of Contents

1. [Colors](#1-colors)
2. [Typography](#2-typography)
3. [Spacing](#3-spacing)
4. [Borders & Radii](#4-borders--radii)
5. [Shadows](#5-shadows)
6. [Gradients](#6-gradients)
7. [Animations & Transitions](#7-animations--transitions)
8. [Component Tokens](#8-component-tokens)
9. [Layout & Containers](#9-layout--containers)
10. [Responsive Breakpoints](#10-responsive-breakpoints)

---

## 1. Colors

### 1.1 Grey Scale (CSS Custom Properties)

| Token                | Value        | Usage                        |
| -------------------- | ------------ | ---------------------------- |
| `--Base-White`       | `#ffffff`    | Primary white, loud text     |
| `--grey-50`          | `#e6e6e6`   | Lightest grey                |
| `--grey-100`         | `#cdcece`   | Light grey                   |
| `--grey-200`         | `#9c9c9d`   | Default text color           |
| `--grey-300`         | `#6a6b6c`   | Muted text                   |
| `--grey-400`         | `#434345`   | Faint text, borders          |
| `--grey-500`         | `#2f3031`   | Dark UI elements             |
| `--grey-600`         | `#1b1c1e`   | Card/section backgrounds     |
| `--grey-700`         | `#111214`   | Deep background              |
| `--grey-800`         | `#0c0d0f`   | Deeper background            |
| `--grey-900`         | `#07080a`   | Page body background         |
| `--Base-Black`       | `#000000`   | Pure black                   |

### 1.2 Semantic Background Colors

| Token                | Value                 | Usage                    |
| -------------------- | --------------------- | ------------------------ |
| `--color-bg`         | `var(--grey-900)`     | Page body                |
| `--color-bg-100`     | `rgb(16, 17, 17)`     | Elevated surface 1       |
| `--color-bg-200`     | `rgb(24, 25, 26)`     | Elevated surface 2       |
| `--color-bg-300`     | `rgb(49, 49, 51)`     | Elevated surface 3       |
| `--color-bg-400`     | `rgb(73, 75, 77)`     | Elevated surface 4       |
| `--background`       | `var(--grey-900)`     | Alias for body bg        |
| `--reverse-background` | `#ffffff`           | Light mode fallback      |

### 1.3 Semantic Foreground/Text Colors

| Token                    | Value                         | Usage                  |
| ------------------------ | ----------------------------- | ---------------------- |
| `--color-fg`             | `hsl(240, 11%, 96%)`         | Primary foreground     |
| `--color-fg-200`         | `rgb(194, 199, 202)`         | Secondary foreground   |
| `--color-fg-300`         | `#78787c`                    | Tertiary foreground    |
| `--color-fg-400`         | `rgb(94, 99, 102)`           | Quaternary foreground  |
| `--Text-Loud`            | `var(--Base-White, #fff)`    | Headings, bold text    |
| `--Text-Default`         | `var(--grey-200)`            | Body text              |
| `--Text-Muted`           | `var(--grey-300)`            | Secondary/muted text   |
| `--Text-Faint`           | `var(--grey-400)`            | Tertiary/faint text    |
| `--primaryText`          | `#fff`                       | Primary text alias     |
| `--secondaryText`        | `rgba(255, 255, 255, 0.6)`   | 60% white              |
| `--tertiaryText`         | `rgba(255, 255, 255, 0.4)`   | 40% white              |
| `--font-color-rgb`       | `255, 255, 255`              | RGB triplet for rgba() |
| `--reverse-font-color-rgb` | `0, 0, 0`                 | Inverse text RGB       |

### 1.4 Brand / Accent Colors

| Token                        | Value                            | Usage                        |
| ---------------------------- | -------------------------------- | ---------------------------- |
| `--Red-Default`              | `#ff6363`                        | Primary brand red            |
| `--red-dark`                 | `rgba(255, 99, 99, 1)` / `#ff6363` | Brand red (dark theme)    |
| `--Red-Muted`                | `#2c1617`                        | Muted red background         |
| `--Red-Dim`                  | `#833637`                        | Dimmed red                   |
| `--Red-Faint`                | (referenced, subtle red bg)      | Faint red tint               |
| `--color-red`                | `hsl(0, 100%, 69%)`             | Semantic red                 |
| `--color-red-transparent`    | `hsla(0, 100%, 69%, 0.15)`      | Red badge background         |

#### Other Accent Colors

| Token                        | Value                            | Usage                  |
| ---------------------------- | -------------------------------- | ---------------------- |
| `--color-blue`               | `hsl(202, 100%, 67%)`           | Info, links            |
| `--color-blue-transparent`   | `hsla(202, 100%, 67%, 0.15)`    | Blue badge bg          |
| `--blue-dark`                | `#56c2ff`                        | Bright blue accent     |
| `--color-green`              | `hsl(151, 59%, 59%)`            | Success                |
| `--color-green-transparent`  | `hsla(151, 59%, 59%, 0.15)`     | Green badge bg         |
| `--color-yellow`             | `hsl(43, 100%, 60%)`            | Warning                |
| `--color-yellow-transparent` | `hsla(43, 100%, 60%, 0.15)`     | Yellow badge bg        |

### 1.5 Functional Colors (Hardcoded)

| Color        | Value                    | Context                         |
| ------------ | ------------------------ | ------------------------------- |
| Success      | `#59d499` / `#51cf66`    | Success indicators              |
| Error        | `#ff6363` / `#ff6b6b`    | Error text, badges              |
| Link Blue    | `#007aff`                | Inline links                    |
| Sky Blue     | `#3ec5ff` / `#7dd3fc` / `#38bdf8` | Feature highlights     |
| Light Blue   | `#aae1ff`                | Pro page text accents           |
| Pro Badge    | `#A2DFFD`                | Pro badge fill (also `color(display-p3 .6363 .874 .9917)`) |
| Orange       | `#ff9217` / `rgb(255, 146, 23)` | CTA highlights          |
| Dark Orange  | `#fb8920`                | Alternate orange                |
| Fire Red     | `#ff2136` / `#ff4d01`    | Intense red accents             |
| Warning      | `#ffa500`                | Warning indicators              |

### 1.6 UI Surface Colors

| Color                          | Value                               | Context                  |
| ------------------------------ | ----------------------------------- | ------------------------ |
| Button background              | `hsla(0, 0%, 100%, 0.815)`          | Primary button bg        |
| Button background hover        | `hsl(0, 0%, 100%)`                  | Button hover             |
| Button foreground              | `rgb(24, 25, 26)`                   | Button text (dark)       |
| Control background             | `rgba(255, 255, 255, 0.1)`          | Input/control bg         |
| Separator                      | `rgba(255, 255, 255, 0.1)`          | Dividers                 |
| Border (semantic)              | `hsl(195, 5%, 15%)`                 | General borders          |
| Card border                    | `rgba(255, 255, 255, 0.06)`         | Card outlines            |
| Lines color RGB                | `255, 255, 255`                     | For rgba() lines         |

### 1.7 White Opacity Scale (Frequently Used)

| Opacity | Value                          | Common Usage              |
| ------- | ------------------------------ | ------------------------- |
| 5%      | `rgba(255, 255, 255, 0.05)`   | Subtle backgrounds        |
| 6%      | `rgba(255, 255, 255, 0.06)`   | Card borders              |
| 10%     | `rgba(255, 255, 255, 0.1)`    | Separators, controls      |
| 15%     | `rgba(255, 255, 255, 0.15)`   | Inset shadow highlights   |
| 20%     | `rgba(255, 255, 255, 0.2)`    | Hover backgrounds         |
| 30%     | `rgba(255, 255, 255, 0.3)`    | Inset highlights          |
| 40%     | `rgba(255, 255, 255, 0.4)`    | Tertiary text             |
| 60%     | `rgba(255, 255, 255, 0.6)`    | Secondary text            |
| 80%     | `rgba(255, 255, 255, 0.8)`    | Near-white text           |
| 90%     | `rgba(255, 255, 255, 0.9)`    | Prominent text            |

### 1.8 Black Opacity Scale

| Opacity | Value                       | Common Usage            |
| ------- | --------------------------- | ----------------------- |
| 10%     | `rgba(0, 0, 0, 0.1)`       | Subtle overlays         |
| 15%     | `rgba(0, 0, 0, 0.15)`      | Light shadows           |
| 25%     | `rgba(0, 0, 0, 0.25)`      | Medium shadows          |
| 40%     | `rgba(0, 0, 0, 0.4)`       | Overlays                |
| 60%     | `rgba(0, 0, 0, 0.6)`       | Heavy overlays          |
| 75%     | `rgba(0, 0, 0, 0.75)`      | Dark overlays           |
| 80%     | `rgba(0, 0, 0, 0.8)`       | Deep shadows            |

### 1.9 Extension Card Background Colors (Homepage)

These are used for the gradient backgrounds of store extension cards:

| Color      | Opacity | Usage                        |
| ---------- | ------- | ---------------------------- |
| `#20235b`  | 0.7     | Dark indigo                  |
| `#070921`  | 0.7     | Near-black blue              |
| `#2b5eb4`  | 0.7     | Medium blue                  |
| `#0d1023`  | 0.42    | Dark navy                    |
| `#0D6E30`  | 1.0     | Forest green                 |
| `#083518`  | 1.0     | Dark green                   |
| `#273db4`  | 0.7     | Royal blue                   |
| `#0f0926`  | 0.4     | Dark purple                  |
| `#aa0c9b`  | 0.7     | Magenta                      |
| `#81037c`  | 0.09    | Dark magenta glow            |
| `#774e00`  | 0.7     | Gold/amber                   |
| `#331711`  | 0.22    | Dark brown                   |
| `#813803`  | 0.09    | Orange glow                  |
| `#025791`  | 0.7     | Ocean blue                   |
| `#523091`  | 0.7     | Purple                       |
| `#1a0b33`  | 0.14    | Dark violet                  |
| `#026065`  | 0.57    | Teal                         |
| `#0588b2`  | 0.06    | Cyan glow                    |
| `#4a154b`  | 0.7     | Slack purple                 |
| `#545f66`  | 0.7     | Slate grey                   |
| `#0a4d4d`  | 0.7     | Dark teal                    |
| `#833497`  | 0.7     | Violet                       |

### 1.10 Third-Party Brand Colors (SVG Icons)

| Brand   | Color      |
| ------- | ---------- |
| Slack   | `#E01E5A` (red), `#36C5F0` (cyan), `#2EB67D` (green), `#ECB22E` (yellow) |

### 1.11 Conic/Rainbow Gradient Colors

Used in animated borders and highlights:

| Color      | Usage                    |
| ---------- | ------------------------ |
| `#0294fe`  | Blue                     |
| `#ff2136`  | Red                      |
| `#9b4dff`  | Purple                   |
| `#3ef3ff`  | Cyan                     |
| `#051eff`  | Deep blue                |
| `#5505ff`  | Indigo                   |
| `#7e1dcb`  | Violet                   |
| `#a041ff`  | Light purple             |

---

## 2. Typography

### 2.1 Font Families

| Token               | Value                                                              | Usage          |
| -------------------- | ------------------------------------------------------------------ | -------------- |
| `--main-font`        | `var(--font-inter), sans-serif`                                    | Body, UI text  |
| `--font-inter`       | Inter (loaded via Next.js WOFF2)                                   | Primary sans   |
| `--font-instrument-serif` | Instrument Serif                                              | Display/hero   |
| `--font-geist-mono`  | Geist Mono                                                         | Code, mono UI  |
| `--monospace-font`    | `SF Mono, Monaco, Cascadia Code, Roboto Mono, Consolas, Courier New` | Fallback mono |

#### ray.so Additional Monospace Fonts

JetBrains Mono, IBM Plex Mono, Fira Code, Commit Mono, Roboto Mono, Space Mono, Source Code Pro, Google Sans Code

### 2.2 Font Sizes

| Size    | Usage                                  |
| ------- | -------------------------------------- |
| `6px`   | Tiny indicators                        |
| `10px`  | Small labels                           |
| `11px`  | Hotkeys, small UI                      |
| `12px`  | Badges, version tags, small labels     |
| `13px`  | Input text, compact UI                 |
| `14px`  | Body text (secondary), card text       |
| `15px`  | Body text (standard)                   |
| `16px`  | Default body, paragraph text           |
| `18px`  | Subheadings, feature descriptions      |
| `20px`  | Section subtitles, error text          |
| `24px`  | Section headings (small)               |
| `36px`  | Page subheadings                       |
| `40px`  | Page headings                          |
| `48px`  | Hero subtitles, large headings         |
| `56px`  | Large display text                     |
| `64px`  | Hero headings                          |
| `72px`  | Largest display heading                |
| `168px` | Oversized display (decorative)         |

### 2.3 Font Weights

| Weight | Usage                                  |
| ------ | -------------------------------------- |
| `400`  | Body text, paragraphs                  |
| `500`  | UI text, buttons, badges, nav links    |
| `600`  | Headings, bold UI elements             |
| `700`  | Strong emphasis, hero headings         |

### 2.4 Line Heights

| Value   | Usage                                  |
| ------- | -------------------------------------- |
| `1`     | Tight (headings)                       |
| `1.2`   | Display headings                       |
| `1.4`   | Subheadings                            |
| `1.5`   | Body text, cards                       |
| `1.6`   | Comfortable body text                  |
| `110%`  | Tight headings                         |
| `140%`  | Standard headings                      |
| `160%`  | Relaxed body / card text               |
| `normal`| Browser default                        |

Specific pixel values used: `13px`, `14px`, `16px`, `18px`, `20px`, `24px`, `28px`, `30px`, `60px`, `84px`

### 2.5 Letter Spacing

| Value     | Usage                                |
| --------- | ------------------------------------ |
| `-.05px`  | Tight (large headings)               |
| `.05px`   | Slight (labels)                      |
| `.1px`    | Body text                            |
| `.2px`    | Badges, UI labels                    |
| `.3px`    | Section headings                     |
| `.4px`    | Spaced headings                      |
| `.8px`    | Uppercase labels / hotkeys           |

### 2.6 Text Opacity Hierarchy

| Level     | Opacity | Usage                    |
| --------- | ------- | ------------------------ |
| Loud      | `1.0`   | Headings                 |
| Strong    | `0.9`   | Bold/emphasis text       |
| Default   | `0.85`  | Paragraph body           |
| Secondary | `0.8`   | Less prominent text      |
| Muted     | `0.6`   | Supporting text          |
| Faint     | `0.5`   | Placeholders             |
| Dim       | `0.4`   | Disabled/tertiary text   |

---

## 3. Spacing

### 3.1 Spacing Scale (CSS Custom Properties)

| Token              | Value    | Multiplier |
| ------------------ | -------- | ---------- |
| `--spacing-none`   | `0px`    | 0x         |
| `--spacing-0-5`    | `4px`    | 0.5x       |
| `--spacing-1`      | `8px`    | 1x (base)  |
| `--spacing-1-5`    | `12px`   | 1.5x       |
| `--spacing-2`      | `16px`   | 2x         |
| `--spacing-2-5`    | `20px`   | 2.5x       |
| `--spacing-3`      | `24px`   | 3x         |
| `--spacing-4`      | `32px`   | 4x         |
| `--spacing-5`      | `40px`   | 5x         |
| `--spacing-6`      | `48px`   | 6x         |
| `--spacing-7`      | `56px`   | 7x         |
| `--spacing-8`      | `64px`   | 8x         |
| `--spacing-9`      | `80px`   | 10x        |
| `--spacing-10`     | `96px`   | 12x        |
| `--spacing-11`     | `112px`  | 14x        |
| `--spacing-12`     | `168px`  | 21x        |
| `--spacing-13`     | `224px`  | 28x        |

**Base unit: 8px.** Most values follow an 8px grid up to `--spacing-8`, then the scale loosens for large section spacing.

### 3.2 Common Gap Values

| Size   | Usage                                  |
| ------ | -------------------------------------- |
| `2px`  | Tight inline elements                  |
| `3px`  | Icon padding                           |
| `4px`  | Compact list items, tag gaps           |
| `8px`  | Default element gap                    |
| `10px` | Comfortable list gaps                  |
| `12px` | Card content spacing                   |
| `16px` | Section content gaps                   |
| `24px` | Card padding, subsection gaps          |
| `30px` | Feature grid gaps                      |
| `32px` | Section gaps, grid gaps                |
| `40px` | Large section gaps, grid gaps          |
| `46px` | Feature section gaps                   |
| `48px` | Section padding                        |
| `56px` | Large section separation               |
| `64px` | Page section spacing                   |
| `96px` | Major section spacing                  |
| `120px`| Hero section top padding               |
| `128px`| Hero section bottom padding            |
| `200px`| Extra-large top padding (404 page)     |

---

## 4. Borders & Radii

### 4.1 Border Radius Scale (CSS Custom Properties)

| Token              | Value    | Usage                          |
| ------------------ | -------- | ------------------------------ |
| `--rounding-none`  | `0px`    | No rounding                    |
| `--rounding-xs`    | `4px`    | Small elements, tables         |
| `--rounding-sm`    | `6px`    | Buttons, inputs, small cards   |
| `--rounding-normal`| `8px`    | Standard cards                 |
| `--rounding-md`    | `12px`   | Medium cards, dialogs          |
| `--rounding-lg`    | `16px`   | Large cards, sections          |
| `--rounding-xl`    | `20px`   | Extra-large panels             |
| `--rounding-xxl`   | `24px`   | Oversized sections             |
| `--rounding-full`  | `100%`   | Circles, avatars               |

### 4.2 Additional Hardcoded Radii

| Value    | Usage                                  |
| -------- | -------------------------------------- |
| `1px`    | Thin separators                        |
| `6px`    | Standard cards, inputs                 |
| `10px`   | Popover elements                       |
| `12px`   | Main window/dialog, badges             |
| `16px`   | Feature cards                          |
| `20px`   | Large interactive elements             |
| `22.5px` | Toggle switches                        |
| `24px`   | Oversized cards                        |
| `31px`   | Pill-shaped elements                   |
| `36px`   | Large pill buttons                     |
| `50%`    | Circular dots / avatars                |
| `9999px` | Full pill shape                        |
| `99999px`| Absolute pill shape                    |

### 4.3 Border Colors & Styles

| Style                                       | Usage                      |
| ------------------------------------------- | -------------------------- |
| `1px solid rgba(255, 255, 255, 0.06)`       | Card borders               |
| `1px solid rgba(255, 255, 255, 0.1)`        | Prominent card borders     |
| `1px solid rgba(255, 255, 255, 0.05)`       | Subtle borders             |
| `1px solid rgba(255, 255, 255, 0.15)`       | Active/hover borders       |
| `1px solid var(--grey-600)`                 | Section dividers           |
| `1px solid var(--grey-300)`                 | Table borders              |
| `1px solid hsl(195, 5%, 15%)`              | General borders            |
| `1px dotted var(--grey-600)`               | FAQ/accordion dividers     |
| `0.5px solid rgba(0, 0, 0, 0.8)`           | Window outlines            |
| `rgba(142, 140, 144, 0.2)`                 | Subtle grey borders        |

---

## 5. Shadows

### 5.1 Box Shadows

#### Card Shadows

```css
/* Standard card shadow */
box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.1);

/* Card with inset highlight */
box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1);

/* Elevated card */
box-shadow:
  inset 0 1px 1px 0 rgba(255, 255, 255, 0.15),
  0 7px 3px 0 rgba(0, 0, 0, 0.03),
  0 4px 4px 0 rgba(0, 0, 0, 0.25);

/* Subtle blue glow card */
box-shadow:
  0 0 16px -7px rgba(154, 170, 255, 0.05),
  0 2px 40px 10px rgba(154, 170, 255, 0.05);

/* Warm glow card */
box-shadow:
  0 0 20px 5px rgba(215, 201, 175, 0.05),
  0 0 16px -7px rgba(215, 201, 175, 0.05);
```

#### Window/Dialog Shadows

```css
/* Primary window shadow */
box-shadow:
  0 4px 40px 8px rgba(0, 0, 0, 0.4),
  0 0 0 0.5px rgba(0, 0, 0, 0.8);

/* Deep elevated shadow */
box-shadow: 0 12px 24px -12px rgba(0, 0, 0, 0.8);

/* Large blur shadow */
box-shadow: 0 0 48px rgba(0, 0, 0, 0.6);
```

#### Button/Interactive Shadows

```css
/* Inset highlight */
box-shadow: inset 0 0.5px 0 0 rgba(255, 255, 255, 0.3);

/* Subtle inset */
box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.25);

/* Orange glow */
box-shadow: 0 0 10px 5px rgba(255, 67, 7, 0.1);
```

#### Extension Card Multi-Layer Shadows

```css
/* Shadow pattern per extension card */
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.1),        /* top highlight */
  0 30px 50px 0 rgba(0, 0, 0, 0.4),               /* deep shadow  */
  0 4px 24px 0 rgba(accent-color, 0.09);           /* accent glow  */
```

#### Top Border Shadow (nav/header)

```css
box-shadow: 0 -4px 10px 0 rgba(0, 0, 0, 0.11);
```

### 5.2 Text Shadows

```css
/* Subtle depth */
text-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);

/* Prominent text shadow */
text-shadow: 0 4px 4px rgba(0, 0, 0, 0.15);

/* Strong text shadow */
text-shadow: 0 1px 4px rgba(0, 0, 0, 0.75);

/* Red glow */
text-shadow: 1px 0 10px #ff6363;
```

### 5.3 Filter Shadows (SVG/Elements)

```css
/* Pro badge drop shadow */
filter: drop-shadow(0 0 3.856px rgba(99, 204, 255, 0.71));

/* Background blur effects */
filter: blur(20px);
filter: blur(32px);
filter: blur(6px);
```

---

## 6. Gradients

### 6.1 Card Background Gradients

```css
/* Standard dark card (most common) */
--Card-BG: linear-gradient(137deg, #111214 4.87%, #0c0d0f 75.88%);

/* Translucent card */
--Card-TranscluscentBG: linear-gradient(137deg, rgba(17, 18, 20, 0.75) 4.87%, rgba(12, 13, 15, 0.9) 75.88%);

/* Card with grey tokens */
background: linear-gradient(45deg, var(--grey-800), var(--grey-900));
```

### 6.2 Conic Gradients (Animated Rainbow Borders)

```css
/* Primary conic gradient (used for animated borders/highlights) */
background: conic-gradient(
  from 136.95deg at 50% 50%,
  #0294fe -55.68deg,
  #ff2136 113.23deg,
  #9b4dff 195deg,
  #0294fe 304.32deg,
  #ff2136 473.23deg
);

/* Alternate conic */
background: conic-gradient(
  from 180deg at 50% 50%,
  #3ef3ff,
  #051eff
);

/* Full rainbow for color picker */
background: linear-gradient(
  90deg,
  hsl(0, 100%, 50%),
  hsl(60, 100%, 50%),
  hsl(120, 100%, 50%),
  hsl(180, 100%, 50%),
  hsl(240, 100%, 50%),
  hsl(300, 100%, 50%),
  hsl(360, 100%, 50%)
);
```

### 6.3 Radial Gradients (Glow Effects)

```css
/* Subtle top glow */
background: radial-gradient(
  49.41% 64.58% at 49.4% 0,
  rgba(255, 255, 255, 0.03),
  rgba(255, 255, 255, 0)
);

/* Card inner glow */
background: radial-gradient(
  96.53% 62.13% at 22.87% 46.84%,
  rgba(255, 255, 255, 0),
  rgba(154, 170, 255, 0.1)
);

/* Metallic surface */
background: radial-gradient(
  100% 100% at 50% 0,
  #5a5a5a 0,
  #1a1a1a 100%
);

/* Blue corner glow */
background: radial-gradient(
  50% 132.92% at 0 100%,
  rgba(43, 175, 255, 0.2) 0,
  transparent
);
```

### 6.4 Linear Gradients (UI Elements)

```css
/* Blue highlight bar */
background: linear-gradient(
  90deg,
  rgba(86, 194, 255, 0.16),
  rgba(86, 194, 255, 0.06)
);

/* Text gradient (Pro page) */
background: linear-gradient(94.34deg, #ffffff -0.89%, #9bd0f5);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;

/* Orange pill button */
background: linear-gradient(90.33deg, rgba(...));

/* Purple-to-cyan */
background: linear-gradient(100.41deg, #a041ff 0.52%, ..., #8df8ff);

/* Fade to transparent */
background: linear-gradient(180deg, #fff, rgba(255, 255, 255, 0));
background: linear-gradient(180deg, white 50%, transparent);

/* Loading indicator shimmer */
background: linear-gradient(
  to right,
  rgba(255, 255, 255, 0),
  rgba(255, 255, 255, 0.3),
  rgba(255, 255, 255, 0)
);

/* Badge gradient overlay */
background: linear-gradient(150deg, rgba(255, 255, 255, ...) ...);
```

### 6.5 Mask Gradients (Fade Effects)

```css
/* Radial mask (circular reveal) */
-webkit-mask-image: radial-gradient(circle at -80% 50%, white 50%, transparent 100%);

/* Vertical fade */
-webkit-mask-image: linear-gradient(180deg, white 50%, transparent);

/* Horizontal fade */
-webkit-mask-image: linear-gradient(to right, transparent, white 10%, white 90%, transparent);
```

---

## 7. Animations & Transitions

### 7.1 Keyframe Animations

#### fadeInUp (Page Entry)

```css
@keyframes fade-in-up {
  0%   { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
/* duration: 1s ease, with optional 1s delay */
```

#### fadeInScaleUp (Element Reveal)

```css
@keyframes fadeInScaleUp {
  from { opacity: 0; transform: translate(10px, 10px) scale(0.9); }
  to   { opacity: 1; transform: translate(0, 0) scale(1); }
}
/* duration: 0.3s ease */
```

#### slideIn (Toast Notifications)

```css
@keyframes slideIn {
  from { opacity: 0; transform: translateY(100%) scale(0.9); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
/* duration: 0.7s cubic-bezier */
```

#### Tooltip/Popover Slide Animations

```css
@keyframes slideUpAndFade {
  from { opacity: 0; transform: translateY(2px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideDownAndFade {
  from { opacity: 0; transform: translateY(-2px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideLeftAndFade {
  from { opacity: 0; transform: translateX(2px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes slideRightAndFade {
  from { opacity: 0; transform: translateX(-2px); }
  to   { opacity: 1; transform: translateX(0); }
}
/* duration: 0.4s, timing: cubic-bezier(.16, 1, .3, 1) */
```

#### blink (Cursor)

```css
@keyframes blink {
  50% { opacity: 0; }
}
/* duration: 1.1s step-end infinite */
```

#### shine (Skeleton Loading)

```css
@keyframes shine {
  to { background-position: 200% center; }
}
/* duration: 1.3s infinite */
```

#### shake (Error)

```css
@keyframes shake {
  /* translateX oscillation */
}
/* duration: 0.3s ease-in-out */
```

#### Rotation (Pro Page Orbiting Elements)

```css
@keyframes rotate-left {
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
}
@keyframes rotate-right {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
/* --rotation-period: 180s linear infinite */
```

#### glow (Pulsing Highlight)

```css
/* duration: 2.5s ease-in-out */
```

#### bounceDockAppIcon

```css
/* duration: 1.2s ease-in-out */
```

#### Size Pulse (Color Dots)

```css
@keyframes sizeOne   { 20% { opacity: 0; } 90% { opacity: 1; } } /* 6s loop */
@keyframes sizeTwo   { 30% { opacity: 0; } 80% { opacity: 1; } } /* 6s loop */
@keyframes sizeThree { 40% { opacity: 0; } 70% { opacity: 1; } } /* 6s loop */
```

#### Infinite Scroll

```css
@keyframes scrollLeft  { /* horizontal auto-scroll */ }
@keyframes scrollRight { /* reverse horizontal scroll */ }
```

### 7.2 Transition Values

| Duration | Easing                           | Usage                        |
| -------- | -------------------------------- | ---------------------------- |
| `0.1s`   | `ease-out`                       | Text underline offset        |
| `0.15s`  | `cubic-bezier(.16, 1, .3, 1)`   | Micro-interactions           |
| `0.15s`  | `cubic-bezier(.34, 1.56, .64, 1)` | Button press bounce        |
| `0.2s`   | `ease`                           | Color transitions            |
| `0.25s`  | `ease`                           | Background transitions       |
| `0.3s`   | `ease`                           | General transitions, links   |
| `0.3s`   | `ease-in-out`                    | Opacity changes              |
| `0.5s`   | `ease`                           | Layout transitions           |
| `0.5s`   | `ease-in-out`                    | Complex transitions          |
| `0.6s`   | `ease`                           | Slow transitions             |
| `1s`     | `ease`                           | Fade-in-up entrance          |
| `100ms`  | (Tailwind default)               | Color transitions (ray.so)   |

### 7.3 Transform Values

| Transform                              | Usage                      |
| -------------------------------------- | -------------------------- |
| `scale(0.95)`                          | Button press state         |
| `scale(0.98)`                          | Link active state          |
| `scale(1.04)`                          | Hover enlarge              |
| `translateY(20px)`                     | Fade-in-up start           |
| `translateX(2px)` / `translateX(3px)`  | Slide effects, hover nudge |
| `translate(2px, -2px)`                 | Diagonal nudge             |
| `translateZ(0)`                        | GPU acceleration           |

### 7.4 Spring Easing

```css
--spring-1: linear(
  /* 100+ keyframe stops defining a spring curve */
  /* Used for physics-based animations */
);
```

---

## 8. Component Tokens

### 8.1 Buttons

#### Primary Button (White/Light)

```css
background-color: hsla(0, 0%, 100%, 0.815);
color: rgb(24, 25, 26);
font-weight: 500;
border-radius: var(--rounding-sm); /* 6px */
transition: background-color 0.2s ease;

/* Hover */
background-color: hsl(0, 0%, 100%);
```

#### Secondary Button (Ghost/Outline)

```css
background: transparent;
border: 1px solid rgba(255, 255, 255, 0.1);
color: #fff;
border-radius: 6px;
```

#### Pill Button

```css
border-radius: 9999px; /* or 31px, 36px */
padding: 6px 12px;   /* small */
padding: 12px 40px;  /* large */
border: 1px solid rgba(255, 255, 255, 0.05-0.15);
```

#### Button Press Animation

```css
transform: scale(0.95);
transition: 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
```

### 8.2 Cards

#### Standard Card

```css
background: linear-gradient(137deg, #111214 4.87%, #0c0d0f 75.88%);
border: 1px solid rgba(255, 255, 255, 0.06);
border-radius: var(--rounding-md); /* 12px */
box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.1);
padding: 32px; /* or 24px, 48px */
```

#### Translucent / Glass Card

```css
background: linear-gradient(137deg, rgba(17, 18, 20, 0.75) 4.87%, rgba(12, 13, 15, 0.9) 75.88%);
border: 1px solid rgba(255, 255, 255, 0.06);
border-radius: var(--rounding-md);
backdrop-filter: blur(15px);
box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.15);
```

#### Extension Card (Homepage)

```css
/* Uses per-card gradient backgrounds with accent colors */
/* Multi-layer box-shadow: highlight + depth + accent glow */
border-radius: 12px;
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.1),
  0 30px 50px 0 rgba(0, 0, 0, 0.4),
  0 4px 24px 0 rgba(accent-color, 0.09);
```

### 8.3 Navigation Bar

```css
height: var(--navbar-height); /* 58px */
width: var(--navbar-width);   /* var(--container-width) */
padding-top: var(--navbar-container-padding-top); /* var(--spacing-2) = 16px */
backdrop-filter: blur(20px);
background: semi-transparent;
/* Bottom border or shadow for separation */
```

### 8.4 Command Palette / Window

```css
width: 750px;
height: 475px;
border-radius: 12px;
background: dark translucent gradient;
box-shadow:
  0 4px 40px 8px rgba(0, 0, 0, 0.4),
  0 0 0 0.5px rgba(0, 0, 0, 0.8);
backdrop-filter: blur(36px); /* or blur(48px) */

/* Action bar (footer) */
height: 40px;
```

### 8.5 Badges / Pills

#### Version Badge (Changelog)

```css
background-color: var(--color-red-transparent); /* hsla(0, 100%, 69%, 0.15) */
color: var(--color-red);                        /* hsl(0, 100%, 69%) */
font-family: var(--font-geist-mono);
font-size: 12px;
font-weight: 500;
letter-spacing: 0.2px;
padding: 6px 10px;
border-radius: 12px;
```

#### Pro Badge

```css
/* SVG badge with fill #A2DFFD */
/* Drop shadow filter: blur 3.856px, color rgba(99, 204, 255, 0.71) */
box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.25);
background: linear-gradient(150deg, ...); /* white overlay */
```

### 8.6 Toggle / Plan Selector (Pricing)

```css
height: 62px;
border-radius: 22.5px; /* or 31px */
background: radial-gradient backdrop;
transition: smooth;
```

### 8.7 Pricing Table

```css
/* 6-column grid */
grid-template-columns: 164px repeat(5, 1fr); /* or 230px + 5 responsive columns */
/* Sticky left column */
/* Row borders */
```

### 8.8 Accordion / FAQ

```css
border-bottom: 1px dotted var(--grey-600);
padding: 16px 0;
/* Collapse/expand transition */
```

### 8.9 Tooltips / Popovers

```css
max-width: 300px;
backdrop-filter: blur(...);
border-radius: 6px;
/* Slide animations: cubic-bezier(.16, 1, .3, 1) */
animation-duration: 0.4s;
```

### 8.10 Avatar

```css
width: 21px;
height: 21px;
/* Source image: 40x40px or 44x27px */
border-radius: 50%; /* or var(--rounding-full) */
```

### 8.11 Blog Cards

```css
/* 3-column grid: --columns: 3 */
gap: var(--spacing-1); /* 8px */

/* Featured card uses blog-card_large class */
/* Thumbnail with blur data URL placeholder */
/* Responsive: sizes="(min-width: 800px) 634px, 90vw" */
```

### 8.12 Pagination

```css
/* Standard pagination with active state */
/* Classes: Pagination_page, Pagination_active, Pagination_nextPage, Pagination_gap */
```

### 8.13 Input Fields

```css
font-size: 13px;
border-radius: 6px;
/* Input track (range): border-radius 6px */
```

### 8.14 Keyboard Keys

```css
/* Radial gradient surfaces */
/* Custom properties: --key-bg-start-color, --key-bg-end-color */
/* Text-shadow for embossed effect */
```

---

## 9. Layout & Containers

### 9.1 Container Widths

| Token                    | Value      | Usage              |
| ------------------------ | ---------- | ------------------ |
| `--container-xs-width`   | `746px`    | Narrow content     |
| `--container-sm-width`   | `1064px`   | Blog, changelog    |
| `--container-width`      | `1204px`   | Default pages      |
| `--container-lg-width`   | `1280px`   | Wide layouts       |

### 9.2 Grid

| Token          | Value    | Usage              |
| -------------- | -------- | ------------------ |
| `--grid-gap`   | `32px`   | Default grid gap   |

### 9.3 Navbar Dimensions

| Token                           | Value                        |
| ------------------------------- | ---------------------------- |
| `--navbar-height`               | `58px`                       |
| `--navbar-width`                | `var(--container-width)`     |
| `--navbar-container-padding-top`| `var(--spacing-2)` (16px)    |

### 9.4 Backdrop / Blur Effects

| Value        | Usage                          |
| ------------ | ------------------------------ |
| `blur(2px)`  | Subtle frosted                 |
| `blur(5px)`  | Dropdown/popover               |
| `blur(8px)`  | Light glass                    |
| `blur(15px)` | Card backdrop                  |
| `blur(16px)` | Feature cards                  |
| `blur(20px)` | Navigation bar                 |
| `blur(25px)` | Heavy glass                    |
| `blur(36px)` | Window backdrop                |
| `blur(48px)` | Deep backdrop                  |
| `blur(75px)` | Maximum frosted glass          |

---

## 10. Responsive Breakpoints

| Width     | Usage                                  |
| --------- | -------------------------------------- |
| `375px`   | Small mobile                           |
| `400px`   | Mobile                                 |
| `408px`   | Compact mobile                         |
| `480px`   | Large mobile / small tablet            |
| `530px`   | Wide mobile                            |
| `563px`   | Transition mobile to tablet            |
| `640px`   | Tablet (grid 2-col starts)             |
| `720px`   | Tablet                                 |
| `768px`   | Standard tablet                        |
| `800px`   | Blog image breakpoint                  |
| `840px`   | Wide tablet                            |
| `880px`   | Pre-desktop                            |
| `900px`   | Small desktop                          |
| `1000px`  | Desktop                               |
| `1050px`  | Wide desktop                           |
| `1064px`  | Container sm width                     |
| `1080px`  | Large desktop                          |

---

## Appendix A: Complete CSS Custom Property Reference

All `--var` names discovered across the Raycast CSS bundles:

```
/* Colors - Grey Scale */
--Base-White: #ffffff
--Base-Black: #000000
--grey-50: #e6e6e6
--grey-100: #cdcece
--grey-200: #9c9c9d
--grey-300: #6a6b6c
--grey-400: #434345
--grey-500: #2f3031
--grey-600: #1b1c1e
--grey-700: #111214
--grey-800: #0c0d0f
--grey-900: #07080a

/* Colors - Semantic Background */
--color-bg: var(--grey-900)
--color-bg-100: rgb(16, 17, 17)
--color-bg-200: rgb(24, 25, 26)
--color-bg-300: rgb(49, 49, 51)
--color-bg-400: rgb(73, 75, 77)
--background: var(--grey-900)
--reverse-background: #ffffff

/* Colors - Semantic Foreground */
--color-fg: hsl(240, 11%, 96%)
--color-fg-200: rgb(194, 199, 202)
--color-fg-300: #78787c
--color-fg-400: rgb(94, 99, 102)

/* Colors - Text Hierarchy */
--Text-Loud: var(--Base-White, #fff)
--Text-Default: var(--grey-200)
--Text-Muted: var(--grey-300)
--Text-Faint: var(--grey-400)
--primaryText: #fff
--secondaryText: rgba(255, 255, 255, 0.6)
--tertiaryText: rgba(255, 255, 255, 0.4)
--font-color-rgb: 255, 255, 255
--reverse-font-color-rgb: 0, 0, 0
--lines-color-rgb: 255, 255, 255

/* Colors - Accent */
--Red-Default: #ff6363
--red-dark: rgba(255, 99, 99, 1)
--Red-Muted: #2c1617
--Red-Dim: #833637
--Red-Faint: (subtle red bg)
--color-red: hsl(0, 100%, 69%)
--color-red-transparent: hsla(0, 100%, 69%, 0.15)
--color-blue: hsl(202, 100%, 67%)
--color-blue-transparent: hsla(202, 100%, 67%, 0.15)
--blue-dark: #56c2ff
--color-green: hsl(151, 59%, 59%)
--color-green-transparent: hsla(151, 59%, 59%, 0.15)
--color-yellow: hsl(43, 100%, 60%)
--color-yellow-transparent: hsla(43, 100%, 60%, 0.15)

/* Colors - UI Surface */
--color-border: hsl(195, 5%, 15%)
--color-button-bg: hsla(0, 0%, 100%, 0.815)
--color-button-bg-hover: hsl(0, 0%, 100%)
--color-button-fg: rgb(24, 25, 26)
--controlBackground: rgba(255, 255, 255, 0.1)
--separatorColor: rgba(255, 255, 255, 0.1)
--Card-BG: linear-gradient(137deg, #111214 4.87%, #0c0d0f 75.88%)
--Card-Border: rgba(255, 255, 255, 0.06)
--Card-TranscluscentBG: linear-gradient(137deg, rgba(17,18,20,.75) 4.87%, rgba(12,13,15,.9) 75.88%)

/* Spacing */
--spacing-none: 0px
--spacing-0-5: 4px
--spacing-1: 8px
--spacing-1-5: 12px
--spacing-2: 16px
--spacing-2-5: 20px
--spacing-3: 24px
--spacing-4: 32px
--spacing-5: 40px
--spacing-6: 48px
--spacing-7: 56px
--spacing-8: 64px
--spacing-9: 80px
--spacing-10: 96px
--spacing-11: 112px
--spacing-12: 168px
--spacing-13: 224px

/* Border Radius */
--rounding-none: 0px
--rounding-xs: 4px
--rounding-sm: 6px
--rounding-normal: 8px
--rounding-md: 12px
--rounding-lg: 16px
--rounding-xl: 20px
--rounding-xxl: 24px
--rounding-full: 100%
--radius-md: 6px

/* Typography */
--main-font: var(--font-inter), sans-serif
--font-inter: Inter
--font-instrument-serif: Instrument Serif
--font-geist-mono: Geist Mono
--font-jetbrains-mono: JetBrains Mono
--monospace-font: SF Mono, Monaco, Cascadia Code, Roboto Mono, Consolas, Courier New

/* Layout */
--container-xs-width: 746px
--container-sm-width: 1064px
--container-width: 1204px
--container-lg-width: 1280px
--grid-gap: 32px
--navbar-height: 58px
--navbar-width: var(--container-width)
--navbar-container-padding-top: var(--spacing-2)
--navbar-total-spacing: (computed)

/* Animation */
--animation-duration: (contextual)
--animation-play-state: (contextual)
--rotation-period: 180s
--spring-1: linear(/* 100+ keyframe stops */)
```

---

## Appendix B: Color Summary for Quick Reference

### Dark Theme Palette (Primary)

```
Background:    #07080a  (--grey-900)
Surface 1:     #0c0d0f  (--grey-800)
Surface 2:     #111214  (--grey-700)
Surface 3:     #1b1c1e  (--grey-600)
Surface 4:     #2f3031  (--grey-500)
Border:        #434345  (--grey-400)
Muted Text:    #6a6b6c  (--grey-300)
Body Text:     #9c9c9d  (--grey-200)
Light Text:    #cdcece  (--grey-100)
Subtle Text:   #e6e6e6  (--grey-50)
White:         #ffffff  (--Base-White)
```

### Accent Colors

```
Red (Brand):   #ff6363  / hsl(0, 100%, 69%)
Blue:          #56c2ff  / hsl(202, 100%, 67%)
Green:         ~hsl(151, 59%, 59%)  /  #59d499
Yellow:        ~hsl(43, 100%, 60%)
Orange:        #ff9217
Pro Blue:      #A2DFFD
```

### Key Functional Colors

```
Link:          #007aff
Success:       #59d499 / #51cf66
Error:         #ff6363
Warning:       #ffa500
Sky:           #3ec5ff / #38bdf8
```

---

## Appendix C: Design Principles Observed

1. **Dark-first design**: The entire site uses a dark theme with `#07080a` as the body background.
2. **8px base grid**: The spacing scale is built on an 8px base unit.
3. **White opacity scale**: Text and UI elements use white at varying opacities (5% to 100%) rather than distinct grey hex values in many cases.
4. **Gradient cards**: Cards use a 137-degree linear gradient from `#111214` to `#0c0d0f` as their standard background.
5. **Inset highlights**: Nearly all elevated surfaces have a `inset 0 1px` white highlight at the top edge.
6. **Glassmorphism**: Extensive use of `backdrop-filter: blur()` for frosted glass effects.
7. **Subtle borders**: Card borders are typically `rgba(255, 255, 255, 0.06)` -- barely visible white.
8. **Spring animations**: Custom spring easing via `linear()` with 100+ keyframe stops for natural motion.
9. **Conic gradient accents**: Rainbow conic gradients used for premium/highlighted borders.
10. **Inter as primary font**: Inter for UI, Instrument Serif for display, Geist Mono for code.
