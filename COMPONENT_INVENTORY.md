# Raycast Website -- Comprehensive Component Inventory

> Analyzed from 9 page screenshots: Homepage, Pricing, Pro, Developers, Blog, Store, Teams, Changelog, Sign In.
> All pages use a **dark theme** with deep navy/near-black backgrounds.

---

## Table of Contents

1. [Component List](#1-component-list)
2. [Layout Patterns](#2-layout-patterns)
3. [Visual Effects](#3-visual-effects)
4. [Component Priority (by Reusability)](#4-component-priority-by-reusability)

---

## 1. Component List

### 1.1 Navigation Bar (Navbar)

| Property | Detail |
|---|---|
| **Description** | Fixed top navigation bar spanning full viewport width. Left: Raycast logo (red diamond icon + "Raycast" wordmark). Center: nav links. Right: "Log in" text link + "Download" button with border. |
| **Variants** | Single variant observed across all pages; consistent everywhere. |
| **Pages** | ALL pages |
| **Background** | Transparent or very subtly tinted dark (`rgba(0,0,0,0.5)` with backdrop blur), blends into hero section |
| **Height** | ~56-64px |
| **Logo** | Red/coral diamond icon (~20x20px), "Raycast" in white semi-bold, ~16-18px |
| **Nav Links** | White/light gray text, ~14px, medium weight. Items: Store, Developer, Teams, Pro (with red "New" badge), Changelog, Pricing, Blog |
| **"New" Badge** | Tiny red pill badge next to "Pro", background `#FF6363` or similar red, white text, ~10px font, border-radius ~8px, padding ~2px 6px |
| **Right Actions** | "Log in" -- plain text link, white. "Download" -- outlined button, white border (~1px), rounded corners (~8px), ~14px text |
| **Spacing** | Nav links spaced ~24-32px apart. Logo to nav gap ~40px. |
| **Padding** | Horizontal page padding ~24-40px (responsive) |

---

### 1.2 Button

| Property | Detail |
|---|---|
| **Description** | Rectangular clickable element with text label, several visual variants observed. |
| **Pages** | ALL pages |

#### Variant A: Primary Solid (White)
- Background: white (`#FFFFFF`)
- Text: black/near-black (`#0A0A0B`)
- Border-radius: ~10-12px (fully rounded pill on some instances, ~24px)
- Padding: ~12px 24px
- Font: ~14-15px, medium/semi-bold weight
- Used for: "Download for Mac", "Compare Plans", "View Documentation", "Send Magic Link"
- Shadow: subtle dark shadow or none

#### Variant B: Primary Solid (Red/Coral)
- Background: linear gradient or solid red-pink (`#FF6363` to `#E84D4D`)
- Text: white
- Border-radius: ~10-12px
- Padding: ~12px 24px
- Font: ~14-15px, semi-bold
- Used for: "Download" in footer CTA, some hero CTAs

#### Variant C: Outlined / Ghost (White border)
- Background: transparent
- Border: 1px solid `rgba(255,255,255,0.2)` (subtle white)
- Text: white, ~14px
- Border-radius: ~10-12px
- Padding: ~10px 20px
- Used for: "Download" in navbar, secondary actions, "Don't have an account? Sign up"

#### Variant D: Outlined / Ghost (Dark)
- Background: transparent or `rgba(255,255,255,0.05)`
- Border: 1px solid `rgba(255,255,255,0.1)`
- Text: white/light gray
- Border-radius: ~8px
- Used for: "$ brew install --cask raycast" code block button, tab buttons

#### Variant E: Small Pill Button
- Background: `#FF6363` (red) or white
- Text: white or black
- Border-radius: ~20px (full pill)
- Padding: ~8px 16px
- Font: ~12-13px
- Used for: "Install Extension" on store cards, "Install" badges

#### Variant F: Icon Button
- Square or circular, ~36-40px
- Contains icon only (e.g., social auth icons on sign-in page)
- Background: `rgba(255,255,255,0.05)` or transparent with border
- Border: 1px solid `rgba(255,255,255,0.1)`
- Border-radius: ~10-12px
- Used for: Apple, GitHub, Google sign-in buttons

#### Variant G: Enterprise / Outline Dark
- Background: dark transparent
- Border: 1px solid `rgba(255,255,255,0.15)`
- Text: white with arrow icon
- Border-radius: ~24px (pill)
- Padding: ~10px 20px
- Used for: "Want enterprise features? Tell us more -->"

---

### 1.3 Input Field

| Property | Detail |
|---|---|
| **Description** | Text input with placeholder text, dark background, subtle border. |
| **Pages** | Store (search), Sign In (email, password), Footer (newsletter email) |

#### Variant A: Search Input
- Background: `rgba(255,255,255,0.05)` or `#1A1A2E`
- Border: 1px solid `rgba(255,255,255,0.1)`
- Border-radius: ~10-12px
- Height: ~44-48px
- Placeholder: light gray `rgba(255,255,255,0.4)`, ~14px
- Right side: keyboard shortcut indicators (small pill badges showing key combos)
- Padding: ~12px 16px
- Full width within container

#### Variant B: Form Input
- Background: `rgba(255,255,255,0.05)`
- Border: 1px solid `rgba(255,255,255,0.1)`
- Border-radius: ~10-12px
- Height: ~48px
- Placeholder: `rgba(255,255,255,0.4)`, ~14px
- Width: ~100% of form container (~400px on sign-in)
- Padding: ~14px 16px
- Used for: Email address, Password fields

#### Variant C: Newsletter Input
- Similar to form input but inline with Subscribe button
- Background: dark with subtle border
- Border-radius: ~10px
- Height: ~40-44px

---

### 1.4 Keyboard Shortcut Badge

| Property | Detail |
|---|---|
| **Description** | Tiny inline badge showing keyboard key, mimicking a physical key cap. |
| **Pages** | Store (search input), Homepage (search bar mockup) |
| **Background** | `rgba(255,255,255,0.08)` or `#2A2A3E` |
| **Border** | 1px solid `rgba(255,255,255,0.1)` |
| **Border-radius** | ~4-6px |
| **Size** | ~20-24px square or auto-width pill |
| **Text** | ~10-11px, monospace or system font, white/light gray |
| **Symbols** | Command, K, Escape, etc. |
| **Shadow** | Very subtle inset or bottom shadow to simulate key depth |

---

### 1.5 Pricing Card

| Property | Detail |
|---|---|
| **Description** | Vertical card showing plan name, price, features list, and CTA button at bottom. |
| **Pages** | Pricing, Pro (embedded), Teams (embedded) |

#### Standard Variant (Free, Pro, Team Free)
- Background: `#111122` or `rgba(255,255,255,0.03)` -- very dark card
- Border: 1px solid `rgba(255,255,255,0.08)`
- Border-radius: ~16px
- Padding: ~24-32px
- Width: ~25% of container in 4-column layout, ~260-280px each
- Plan name: white, ~16-18px, bold
- Price: large white number `$0` / `$8` / `$12`, ~36-48px, bold
- Period: `/month` in smaller gray text, ~14px
- Discount badge: small red/pink pill showing "-20%" next to price
- "Billed annually" note: gray text, ~12px
- Feature list: vertical stack with check icons (green/teal circles with checkmarks)
- Feature text: ~13-14px, `rgba(255,255,255,0.7)`
- CTA button at bottom: Variant A (white solid) or Variant C (outlined)
- Spacing between features: ~10-12px

#### Highlighted Variant (Team Pro / recommended)
- Same structure but with a subtle glow or brighter border
- Border: 1px solid `rgba(255,100,100,0.3)` (reddish tint)
- Possible subtle red/pink gradient on border or top edge
- May have "recommended" indicator

---

### 1.6 Feature Check Item

| Property | Detail |
|---|---|
| **Description** | Single line item with a circular check icon and text label. Used in pricing cards and feature lists. |
| **Pages** | Pricing, Pro, Teams |
| **Icon** | Small circle (~16-18px diameter), teal/green fill or outlined, with white checkmark |
| **Text** | ~13-14px, `rgba(255,255,255,0.7)`, regular weight |
| **Spacing** | ~10-12px vertical gap between items |
| **Icon-to-text gap** | ~8-10px |
| **Variant: Star item** | Uses a star icon instead of check for "More Coming Soon" |
| **Variant: GPT-4 addon** | Check icon + "Include GPT-4" text + "+ $8 / month" in gray |

---

### 1.7 Toggle / Segmented Control (Billing Period)

| Property | Detail |
|---|---|
| **Description** | Two-option toggle switch for "Monthly" / "Yearly" billing. |
| **Pages** | Pricing |
| **Container** | Pill-shaped wrapper, background `rgba(255,255,255,0.05)`, border-radius ~24px, ~200px wide, ~40px tall |
| **Active segment** | Solid white or light background, dark text, ~14px semi-bold |
| **Inactive segment** | Transparent, light gray text |
| **Segment border-radius** | ~20px (matching pill shape) |
| **Padding** | ~4px internal padding around segments |

---

### 1.8 FAQ Accordion

| Property | Detail |
|---|---|
| **Description** | Expandable question/answer rows with chevron icon. |
| **Pages** | Pricing, Pro |
| **Container** | Full-width rows separated by thin borders |
| **Border** | Top and bottom 1px solid `rgba(255,255,255,0.08)` |
| **Question text** | White, ~15-16px, medium weight |
| **Chevron** | Right-aligned, small down-arrow icon (`v`), `rgba(255,255,255,0.5)` |
| **Row height** | ~56-64px (closed state) |
| **Padding** | ~16-20px horizontal |
| **Hover** | Likely subtle background highlight |
| **Expanded** | Answer text appears below question in `rgba(255,255,255,0.6)`, ~14px |

---

### 1.9 Section Heading

| Property | Detail |
|---|---|
| **Description** | Large centered heading text with optional subheading and category label above. |
| **Pages** | ALL pages |

#### Variant A: Hero Heading
- Font size: ~48-64px (very large)
- Weight: Bold/Black (800-900)
- Color: white `#FFFFFF`
- Line height: ~1.1
- Text-align: center
- Subheading: ~16-18px, `rgba(255,255,255,0.6)`, regular weight, max-width ~600px
- Gap between heading and subheading: ~16-20px

#### Variant B: Section Heading
- Font size: ~32-40px
- Weight: Bold (700)
- Color: white
- Text-align: center
- Subheading: ~15-16px, `rgba(255,255,255,0.5)`, regular weight
- Gap: ~12-16px

#### Variant C: Sub-section Heading (with icon label)
- Above heading: small colored icon + category label in accent color
- Category label: ~12-13px, colored (red/pink, teal, purple), uppercase or regular
- Heading: ~28-36px, bold, white
- Subheading: ~14-15px, gray
- Text-align: center or left
- Examples: "Raycast AI" label with sparkle icon, "Cloud Sync" with sync icon, "Custom Themes" with palette icon

#### Variant D: Left-aligned Section Heading
- Font size: ~28-36px
- Weight: Bold
- Color: white
- Text-align: left
- Used on: Blog, Changelog, feature sections

---

### 1.10 Category / Section Label (Pill Badge)

| Property | Detail |
|---|---|
| **Description** | Small pill-shaped label indicating a category or section. Appears above section headings. |
| **Pages** | Pro, Teams, Homepage |
| **Background** | `rgba(255,100,100,0.1)` (reddish tint) or `rgba(100,100,255,0.1)` (blue tint) or gradient |
| **Border** | 1px solid matching accent color at low opacity |
| **Border-radius** | ~16-20px (pill) |
| **Padding** | ~6px 14px |
| **Text** | ~12-13px, accent color (red/pink or brand color), medium weight |
| **Icon** | Small icon left of text (~14px) |
| **Examples** | "Raycast Pro", "Private Extensions", category labels |

---

### 1.11 Feature Card (Icon + Title + Description)

| Property | Detail |
|---|---|
| **Description** | Card with icon at top, title, and description text. Used in grid layouts for feature showcases. |
| **Pages** | Developers, Homepage, Teams |

#### Variant A: Small Feature Card (no background)
- No visible card background (transparent)
- Icon: ~40-48px, centered or left-aligned, could be emoji or custom icon
- Title: ~16-18px, white, semi-bold
- Description: ~13-14px, `rgba(255,255,255,0.5)`, regular
- Width: fits within 3-column grid (~300px each)
- Spacing: icon-to-title ~12px, title-to-description ~8px
- Used on: Developers "Keeping our ecosystem beautiful" section

#### Variant B: Medium Feature Card (with background)
- Background: `rgba(255,255,255,0.03)` or subtle gradient
- Border: 1px solid `rgba(255,255,255,0.06)`
- Border-radius: ~16px
- Padding: ~24px
- Icon: ~32-40px colored icon
- Title: ~16px, white, semi-bold
- Description: ~13-14px, gray
- Used on: Teams feature grid, Homepage

#### Variant C: Large Feature Card (with image/screenshot)
- Background: `rgba(255,255,255,0.03)` or gradient
- Border: 1px solid `rgba(255,255,255,0.06)`
- Border-radius: ~16-20px
- Contains screenshot/image at top or side (~50-60% of card area)
- Title: ~20-24px, white, bold
- Description: ~14px, gray
- Optional CTA link at bottom
- Padding: ~24-32px
- Used on: Homepage, Teams, Developers

---

### 1.12 App Screenshot / Product Image

| Property | Detail |
|---|---|
| **Description** | Embedded screenshot of the Raycast app or feature demonstration, often within a card or as a hero element. |
| **Pages** | Homepage, Pro, Teams, Developers |
| **Container** | Often within a card with border-radius ~16-20px |
| **Shadow** | Large soft shadow: `0 24px 48px rgba(0,0,0,0.4)` |
| **Border** | Sometimes 1px solid `rgba(255,255,255,0.08)` |
| **Corner radius** | ~12-16px on the image itself (matching macOS window corners) |
| **Glow** | Some screenshots have a colored glow behind them (aurora effect) |

---

### 1.13 Extension Card (Store)

| Property | Detail |
|---|---|
| **Description** | Card displaying a Raycast extension with icon, name, description, author, stats, and install button. |
| **Pages** | Store |

#### Variant A: Featured Extension Card
- Background: `rgba(255,255,255,0.03)` with subtle border
- Border: 1px solid `rgba(255,255,255,0.06)`
- Border-radius: ~16px
- Padding: ~24px
- Layout: vertical -- large app icon at top (~64px), title (~16px bold white), description (~13px gray), author row, install button
- App icon: ~64px, rounded (~12-14px border-radius), with app-specific colors
- Author row: small avatar (~20px circle) + name text (~12px gray)
- Install button: small white solid pill "Install Extension"
- Width: ~1/3 of container in 3-column grid
- Height: ~280-320px

#### Variant B: List Extension Card
- Background: `rgba(255,255,255,0.03)`
- Border: 1px solid `rgba(255,255,255,0.06)`
- Border-radius: ~12-14px
- Padding: ~16-20px
- Layout: horizontal row
- Left: app icon (~40-44px, rounded ~10px)
- Center: title (~15px bold white) + description (~13px gray, 1-2 lines) + metadata row
- Right: "Install" button (small pill, red or white)
- Metadata row: small author avatar + author name + command count icon + download count icon
- Height: ~100-120px
- Width: ~50% of container (2-column grid)
- Stats: small gray text with icons, ~11-12px

---

### 1.14 Author / User Badge

| Property | Detail |
|---|---|
| **Description** | Small inline element showing user avatar and name. |
| **Pages** | Store, Blog, Changelog |
| **Avatar** | Circular, ~20-24px diameter, image or colored initial |
| **Name text** | ~12-13px, `rgba(255,255,255,0.6)` |
| **Layout** | Horizontal: avatar + name |
| **Gap** | ~6-8px between avatar and text |

---

### 1.15 Blog Post Card

| Property | Detail |
|---|---|
| **Description** | Card representing a blog post with featured image, title, excerpt, author, and date. |
| **Pages** | Blog |

#### Variant A: Standard Blog Card
- Full-width row layout
- Top: large featured image spanning full width, border-radius ~16px on top
- Image height: ~200-280px
- Below image: title (~20-24px, white, bold), description (~14px gray, 2 lines)
- Author row: avatar + name + date
- Background: transparent or very subtle card bg
- Border: 1px solid `rgba(255,255,255,0.06)` possible
- Padding: ~16-24px below image

#### Variant B: Top/Featured Blog Card
- Larger featured image area
- Prominent title treatment
- Tags/labels visible

---

### 1.16 Tag / Category Pill

| Property | Detail |
|---|---|
| **Description** | Small pill label for categorizing content (blog posts, changelog entries). |
| **Pages** | Blog, Changelog, Store |
| **Background** | `rgba(255,255,255,0.06)` |
| **Border** | 1px solid `rgba(255,255,255,0.08)` or none |
| **Border-radius** | ~12-16px (pill) |
| **Padding** | ~4px 10px |
| **Text** | ~11-12px, `rgba(255,255,255,0.6)` |
| **Examples** | "Launch week", author tags, category filters |

---

### 1.17 Tab / Segmented Navigation

| Property | Detail |
|---|---|
| **Description** | Horizontal row of selectable options that filter or switch content views. |
| **Pages** | Store ("All Extensions", "Recently Added"), Pricing ("Monthly"/"Yearly") |
| **Active tab** | White or light background pill, dark text |
| **Inactive tab** | Transparent, gray text |
| **Container** | Optional subtle background wrapper |
| **Border-radius** | ~8-12px per tab, or ~20px for pill style |
| **Font** | ~13-14px, medium weight |
| **Height** | ~36-40px |
| **Gap** | ~4-8px between tabs |

---

### 1.18 Pagination

| Property | Detail |
|---|---|
| **Description** | Page number navigation at the bottom of lists. |
| **Pages** | Store |
| **Layout** | Horizontal row: `1 2 3 4 5 --- 144 >` |
| **Active page** | White background circle/square, dark text |
| **Inactive page** | Transparent, gray text |
| **Size** | ~32-36px per number block |
| **Border-radius** | ~6-8px |
| **Font** | ~13-14px |
| **Ellipsis** | Horizontal line/dash between page groups |
| **Arrow** | `>` chevron for next page |

---

### 1.19 Testimonial Card

| Property | Detail |
|---|---|
| **Description** | Card containing a user quote, avatar, name, and handle. |
| **Pages** | Developers, Homepage |
| **Background** | `rgba(255,255,255,0.03)` |
| **Border** | 1px solid `rgba(255,255,255,0.06)` |
| **Border-radius** | ~16px |
| **Padding** | ~24px |
| **Quote text** | ~14-15px, `rgba(255,255,255,0.8)`, regular or italic |
| **Quote marks** | Typographic open-quote at start |
| **User info** | Bottom of card: small avatar (~24-28px circle) + @handle in colored/teal text (~13px) |
| **Width** | ~25% of container in 4-col grid |
| **Height** | Auto, typically ~180-240px |

---

### 1.20 Logo Bar / Partner Strip

| Property | Detail |
|---|---|
| **Description** | Horizontal row of partner/customer logos in grayscale or monochrome white. |
| **Pages** | Teams |
| **Layout** | Centered horizontal row with even spacing |
| **Logos** | Monochrome white/gray versions of company logos (Framer, Atlassian, Shopify, GitHub, Loom/Launchdarkly, Tailscale) |
| **Logo size** | ~24-32px height, auto width |
| **Gap** | ~40-60px between logos |
| **Opacity** | ~0.5-0.7 (dimmed) |
| **Section padding** | ~40-60px vertical |

---

### 1.21 CTA Section ("Ready for take-off")

| Property | Detail |
|---|---|
| **Description** | Full-width centered call-to-action section with heading, subtext, download button, and brew command alternative. |
| **Pages** | Homepage, Pricing, Developers, Teams |
| **Heading** | ~32-40px, bold, white, centered. "Ready for take-off?" |
| **Subtext** | ~15-16px, gray, centered, max-width ~500px |
| **Primary CTA** | White solid button "Download for Mac" |
| **Divider** | "or" text in gray between options |
| **Secondary CTA** | Code-style outlined button `$ brew install --cask raycast` in monospace |
| **Version note** | "macOS 12+" in small gray text ~11px below |
| **Padding** | ~80-120px vertical |
| **Background** | Matches page background (dark) |

---

### 1.22 Community Card (Twitter / Slack)

| Property | Detail |
|---|---|
| **Description** | Card promoting community channels with icon, title, description, and link. Appears in pairs. |
| **Pages** | Pricing, Developers, Teams |
| **Layout** | 2-column grid, each card ~50% width |
| **Background** | Gradient -- left card has blue/purple tint (Twitter), right card has warm red/pink tint (Slack) |
| **Border-radius** | ~16-20px |
| **Padding** | ~24-32px |
| **Icon** | Large social icon (~32-40px) -- Twitter bird (blue) or Slack logo (colors) |
| **Title** | ~18px, bold, white. "Stay up to date" / "Help shape the product" |
| **Description** | ~13-14px, `rgba(255,255,255,0.7)` |
| **Link text** | Colored text with external link indicator |
| **Height** | ~180-220px |

---

### 1.23 Newsletter Section

| Property | Detail |
|---|---|
| **Description** | Section with heading, description, email input, and subscribe button. |
| **Pages** | Pricing, Developers, Teams (in footer area) |
| **Layout** | Left: text content. Right: email input + button |
| **Heading** | "Subscribe to our newsletter", ~16-18px, white, bold |
| **Description** | ~13px, gray |
| **Input** | Dark background input field, ~250-300px wide |
| **Button** | "Subscribe" -- white outlined or solid button |
| **Legal text** | Very small gray text below, ~10-11px |
| **Container** | Full width, ~60-80px vertical padding |

---

### 1.24 Footer

| Property | Detail |
|---|---|
| **Description** | Full-width footer with logo, multi-column link list, and legal info. |
| **Pages** | ALL pages |
| **Background** | Darkest section background, near-black `#080810` or similar |
| **Top border** | 1px solid `rgba(255,255,255,0.06)` |
| **Layout** | 4 columns: Product, Company, Community, By Raycast. Plus Raycast logo top-left. |
| **Logo** | Small white Raycast icon (~24px) |
| **Column headings** | ~13-14px, white, semi-bold |
| **Link text** | ~13px, `rgba(255,255,255,0.5)`, regular weight |
| **External link icon** | Small arrow `->` icon next to external links |
| **"New" badge** | Red pill badge next to "Pro" link |
| **Column gap** | ~60-80px |
| **Vertical padding** | ~60-80px |
| **Link vertical spacing** | ~8-12px between links |

---

### 1.25 Social Auth Button

| Property | Detail |
|---|---|
| **Description** | Large square-ish button with social provider icon for authentication. |
| **Pages** | Sign In |
| **Layout** | 3 buttons in a row: Apple, GitHub, Google |
| **Background** | `rgba(255,255,255,0.05)` |
| **Border** | 1px solid `rgba(255,255,255,0.1)` |
| **Border-radius** | ~12px |
| **Size** | ~80-100px wide, ~56-64px tall |
| **Icon** | Centered, ~24-28px. Apple: white. GitHub: white. Google: colored `G` |
| **Gap** | ~12-16px between buttons |
| **Hover** | Likely brighter border or background |

---

### 1.26 Changelog Entry

| Property | Detail |
|---|---|
| **Description** | Vertical timeline entry with date, version, image, title, description, and expandable sections. |
| **Pages** | Changelog |
| **Layout** | Vertical stack, full-width, timeline-style with dates on left or above |
| **Date** | ~14-16px, `rgba(255,255,255,0.5)`, shown as "Jul 6, 2023" format |
| **Version** | Small badge or label text |
| **Featured image** | Full-width banner image within rounded container (~16px border-radius) |
| **Title** | ~24-28px, bold, white |
| **Description** | ~14-15px, `rgba(255,255,255,0.6)`, multi-paragraph possible |
| **Sections** | Collapsible "Improvements", "Bug Fixes" sections with bullet points |
| **Section label** | ~14px, bold, with icon (wrench, bug, etc.) |
| **Bullet items** | ~13px, gray, with small dot indicator |
| **Divider** | Thin horizontal line between entries |

---

### 1.27 Hero Search Bar (Decorative)

| Property | Detail |
|---|---|
| **Description** | Decorative representation of Raycast's command palette search bar, shown in hero sections. |
| **Pages** | Homepage |
| **Background** | `rgba(255,255,255,0.05)` or darker panel |
| **Border** | 1px solid `rgba(255,255,255,0.1)` |
| **Border-radius** | ~12-14px |
| **Height** | ~48-56px |
| **Placeholder text** | "Search Raycast" or similar, ~15px, gray |
| **Left icon** | Search magnifier icon |
| **Right side** | Keyboard shortcut badges |
| **Shadow** | Prominent: `0 16px 48px rgba(0,0,0,0.5)` |
| **Width** | ~500-600px centered |

---

### 1.28 Icon Grid (App Icons)

| Property | Detail |
|---|---|
| **Description** | Floating grid of colorful app icons, used as visual decoration in hero sections. |
| **Pages** | Store, Homepage |
| **Icons** | Various 3rd-party app icons (Spotify, GitHub, Notion, Slack, VS Code, etc.) |
| **Icon size** | ~48-64px |
| **Border-radius** | ~12-14px (macOS-style rounded square) |
| **Arrangement** | Loosely scattered or in rows with perspective/depth effect |
| **Opacity** | Full opacity, some may have depth-based fade |
| **Glow** | Individual icons may emit subtle colored glow matching their brand color |

---

### 1.29 Feature Showcase Row (Split Layout)

| Property | Detail |
|---|---|
| **Description** | Two-column layout with text on one side and screenshot/illustration on the other. |
| **Pages** | Pro, Teams, Homepage |
| **Layout** | 50/50 split or 40/60 text-to-image |
| **Text side** | Category label (pill), heading (~28-32px bold white), description (~14-15px gray), optional CTA link |
| **Image side** | Screenshot or illustration within rounded container with shadow/glow |
| **Alternating** | Text-left/image-right alternates with image-left/text-right between rows |
| **Vertical padding** | ~80-120px between rows |
| **Gap** | ~40-60px between columns |

---

### 1.30 "Coming Soon" Card

| Property | Detail |
|---|---|
| **Description** | Card indicating an upcoming feature with title, description, and muted styling. |
| **Pages** | Pro |
| **Background** | `rgba(255,255,255,0.02)` -- very subtle |
| **Border** | 1px dashed `rgba(255,255,255,0.1)` or solid very dim |
| **Border-radius** | ~12-14px |
| **Text** | Title ~16px white, description ~13px gray |
| **Star icon** | Small star or sparkle icon indicating upcoming |
| **Opacity** | Slightly more muted than active feature cards |

---

### 1.31 Code Block

| Property | Detail |
|---|---|
| **Description** | Monospace code snippet display, used for developer content and brew install commands. |
| **Pages** | Developers, Pricing (brew command), CTA sections |
| **Background** | `#0D0D1A` or `rgba(255,255,255,0.03)` |
| **Border** | 1px solid `rgba(255,255,255,0.08)` |
| **Border-radius** | ~10-12px |
| **Font** | Monospace (likely SF Mono or JetBrains Mono), ~13-14px |
| **Text color** | Syntax highlighted -- keywords in purple/blue, strings in green/orange, etc. |
| **Padding** | ~16-20px |
| **Line height** | ~1.6 |
| **Top bar** | Optional title bar with colored dots (macOS window chrome) |

---

### 1.32 Stat / Metric Badge

| Property | Detail |
|---|---|
| **Description** | Small inline element showing a metric like download count or command count. |
| **Pages** | Store (extension cards) |
| **Layout** | Icon + number text |
| **Icon** | Small (~12px) icon: terminal icon for commands, download arrow for installs |
| **Text** | ~11-12px, `rgba(255,255,255,0.4)` |
| **Gap** | ~4px between icon and text |
| **Examples** | "5 Commands", "78,289" downloads |

---

### 1.33 Divider / Separator

| Property | Detail |
|---|---|
| **Description** | Horizontal line separating content sections. |
| **Pages** | ALL pages |
| **Color** | `rgba(255,255,255,0.06)` to `rgba(255,255,255,0.1)` |
| **Height** | 1px |
| **Width** | Full container width or viewport width |
| **Variants** | Full-bleed (edge to edge) or contained (within max-width) |

---

### 1.34 "Or" Divider

| Property | Detail |
|---|---|
| **Description** | Text "or" centered between two options, used between primary and alternative actions. |
| **Pages** | Pricing CTA, Sign In |
| **Text** | "or", ~13px, `rgba(255,255,255,0.4)` |
| **Layout** | Centered between two elements, ~16px vertical margin |

---

### 1.35 Theme Preview / Color Swatch Grid

| Property | Detail |
|---|---|
| **Description** | Grid of small color swatches or theme preview thumbnails showing Raycast custom themes. |
| **Pages** | Pro |
| **Layout** | Horizontal scrollable row or grid of small thumbnails |
| **Swatch size** | ~40-48px squares or small rectangles |
| **Border-radius** | ~6-8px |
| **Colors** | Various: blue, red, green, purple, pink, orange gradients |
| **Border** | 1px solid `rgba(255,255,255,0.1)` |
| **Selected** | Possibly brighter border or ring indicator |

---

### 1.36 Feature Icon (Circular)

| Property | Detail |
|---|---|
| **Description** | Medium circular icon used as a visual anchor for feature descriptions. |
| **Pages** | Developers, Homepage, Pro, Teams |
| **Size** | ~48-64px diameter |
| **Background** | Subtle gradient or solid color tint matching feature category |
| **Border-radius** | 50% (circle) |
| **Icon** | Centered white or colored icon/emoji, ~24-28px |
| **Shadow** | Optional soft colored glow |
| **Colors** | Varies: purple, teal, pink, blue depending on feature |

---

### 1.37 Link with Arrow

| Property | Detail |
|---|---|
| **Description** | Text link with a right-pointing arrow, used for inline navigation to more content. |
| **Pages** | Pro, Teams, Developers, Homepage |
| **Text** | ~14px, accent color (blue, white, or pink/red), medium weight |
| **Arrow** | Right arrow `->` or `>` appended, same color |
| **Hover** | Likely underline or arrow animation |
| **Examples** | "Learn about Pro ->", "Join the community ->", "View Documentation" |

---

### 1.38 Gradient Text

| Property | Detail |
|---|---|
| **Description** | Text with gradient color fill, used for emphasis in hero headings. |
| **Pages** | Homepage, Pro, Teams |
| **Effect** | `background-clip: text` with gradient |
| **Gradient colors** | Varies: red-to-orange, purple-to-pink, multi-color rainbow |
| **Usage** | Key words in hero headings: "Supercharged" (gradient), "Pro" (gradient), "reimagined" (gradient) |
| **Fallback** | Solid accent color if gradient not supported |

---

### 1.39 Window Mock / macOS Chrome

| Property | Detail |
|---|---|
| **Description** | macOS-style window frame decoration used around product screenshots. |
| **Pages** | Homepage, Developers, Pro, Teams |
| **Title bar** | ~32px height, dark background (`#1A1A2E`), three colored dots on left (red, yellow, green -- each ~10px circle) |
| **Border** | 1px solid `rgba(255,255,255,0.08)` |
| **Border-radius** | ~12-16px on container (top corners) |
| **Content** | Screenshot fills remaining area |

---

### 1.40 Extension Template Card

| Property | Detail |
|---|---|
| **Description** | Card showing a customizable extension template for teams. |
| **Pages** | Teams |
| **Background** | Dark card with subtle gradient or image |
| **Border** | 1px solid `rgba(255,255,255,0.06)` |
| **Border-radius** | ~16px |
| **Content** | Small screenshot/preview image, title, brief description |
| **Layout** | Grid of 3-4 cards |
| **Padding** | ~16-20px |

---

## 2. Layout Patterns

### 2.1 Page Structure (Global)

All pages follow this vertical structure:
1. **Navbar** (fixed, ~56-64px tall)
2. **Hero Section** (large, often with gradient/aurora background, ~500-700px tall)
3. **Content Sections** (stacked vertically, alternating layouts)
4. **CTA Section** ("Ready for take-off?" or equivalent)
5. **Community Cards** (2-column Twitter + Slack)
6. **Newsletter Strip**
7. **Footer** (4-column links)

### 2.2 Max-width Container

- Content max-width: ~1200px centered
- Padding: ~24-40px horizontal on each side
- Background: extends full viewport width, content is contained

### 2.3 Hero Section Layout

| Pattern | Used On |
|---|---|
| **Centered text + gradient backdrop** | Homepage, Pricing, Store, Blog, Changelog, Sign In |
| **Centered text + product screenshot below** | Pro, Teams |
| **Centered text + decorative floating elements** | Store (floating app icons), Developers (aurora) |

- Vertical padding: ~100-160px
- Heading: centered, large (48-64px)
- Subtext: centered, ~16-18px gray, max-width ~600px
- CTA button(s): centered below subtext, ~24px gap

### 2.4 Feature Grid (3-column)

- Used on: Developers ("Keeping our ecosystem beautiful"), Teams, Homepage, Pro
- 3 equal columns, ~32-40px gap
- Each cell: Feature Card component (icon + title + desc)
- 2 rows typical (6 features total)
- Row gap: ~32-48px

### 2.5 Feature Grid (2-column)

- Used on: Store (extension list), Developers (hero cards)
- 2 equal columns, ~24-32px gap
- Each cell: card component
- Responsive: stacks to single column on mobile

### 2.6 Feature Grid (4-column)

- Used on: Pricing cards, Testimonials, Homepage feature screenshots
- 4 equal columns, ~20-24px gap
- Each cell: pricing card or testimonial card

### 2.7 Split / Alternating Row Layout

- Used on: Pro, Teams, Homepage
- Two columns: text (40-50%) + image (50-60%)
- Alternates left/right each row
- Vertical spacing between rows: ~80-120px
- Text side contains: label, heading, description, optional link
- Image side contains: screenshot with shadow/glow effects

### 2.8 Full-width Banner Section

- Used on: Pro (AI section), Teams (hero), Homepage (feature showcases)
- Full viewport width background (gradient or image)
- Contained content within max-width
- Often with large centered screenshot
- Below: 3-column feature bullets

### 2.9 Blog Post List Layout

- Used on: Blog
- Single column, full-width cards stacked vertically
- Featured image on top, text below
- ~24-32px gap between posts
- Each post is a full-width row

### 2.10 Changelog Timeline Layout

- Used on: Changelog
- Single column, chronological
- Date markers on left or above entries
- Each entry: image + title + description + expandable sections
- Dividers between entries

### 2.11 CTA Footer Pattern

Consistent across pages:
1. "Ready for take-off?" heading
2. Subtitle text
3. Primary button ("Download for Mac")
4. "or" divider
5. Code-style secondary button (brew command)
6. "macOS 12+" note
7. Community cards row (2-col)
8. Newsletter section
9. Footer

---

## 3. Visual Effects

### 3.1 Aurora / Nebula Gradient Background

- **Where**: Hero sections on Homepage, Pro, Teams, Developers
- **Description**: Large, soft, blurred gradient blobs creating an atmospheric, cosmic effect
- **Colors**: Deep purples (#6B21A8, #7C3AED), hot pinks (#EC4899, #F43F5E), warm reds (#EF4444, #FF6363), dark blues (#1E1B4B, #312E81), subtle teals (#0D9488)
- **Implementation**: Likely multiple absolutely-positioned radial gradients with large blur radii (100-300px) at low opacity (0.3-0.6), layered over the dark base background
- **Base background**: Near-black `#0A0A0F` to `#0F0F1A`
- **Position**: Centered behind hero text, extends ~60-80% of viewport
- **Animation**: Possibly subtle CSS animation for floating/pulsing (not visible in static screenshots)

### 3.2 Glassmorphism / Frosted Glass

- **Where**: Some card overlays, navbar background
- **Description**: Semi-transparent elements with backdrop blur
- **Properties**: `backdrop-filter: blur(12-20px)`, `background: rgba(255,255,255,0.03-0.06)`, `border: 1px solid rgba(255,255,255,0.08)`
- **Usage**: Cards that sit over gradient backgrounds, navbar

### 3.3 Colored Glow / Light Emission

- **Where**: Behind product screenshots, featured elements
- **Description**: Soft colored glow emanating from behind elements
- **Implementation**: Large `box-shadow` with spread, e.g., `0 0 120px 40px rgba(255,100,100,0.15)`, or a pseudo-element with radial gradient
- **Colors**: Usually matches the section's accent color (pink/red for Pro, blue/purple for Teams)

### 3.4 Subtle Card Borders

- **Where**: All cards across the site
- **Description**: Very subtle border creating slight edge definition on dark backgrounds
- **Color**: `rgba(255,255,255,0.06)` to `rgba(255,255,255,0.1)` -- just barely visible
- **Width**: 1px
- **Purpose**: Creates depth hierarchy without bright outlines

### 3.5 Gradient Border Effect

- **Where**: Highlighted pricing cards, some CTAs
- **Description**: Border that transitions through colors, creating a rainbow or accent edge
- **Implementation**: Likely `border-image` with gradient, or a wrapper element with gradient background and inner element offset by 1px
- **Colors**: Pink to purple gradient, or red to orange

### 3.6 Text Gradient Fill

- **Where**: Hero headings on Homepage ("Supercharged"), Pro ("New Level Unlocked"), Teams ("reimagined")
- **Implementation**: `background: linear-gradient(...)`, `background-clip: text`, `color: transparent`
- **Gradients observed**:
  - Red to pink/orange: `linear-gradient(135deg, #FF6363, #FF8A65)`
  - Purple to pink: `linear-gradient(135deg, #A855F7, #EC4899)`
  - Multi-color: through red, orange, yellow, or purple to blue
- **Effect**: Makes key words pop against white surrounding text

### 3.7 Depth Shadow on Screenshots

- **Where**: Product screenshots throughout
- **Description**: Large, soft shadow creating floating effect
- **Properties**: `box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5)` or similar
- **Combined with**: Subtle colored glow underneath

### 3.8 Noise / Grain Texture

- **Where**: Possibly overlaid on gradient backgrounds (subtle)
- **Description**: Very faint noise texture to add depth to flat gradients
- **Implementation**: CSS `background-image` with tiny noise SVG/PNG at very low opacity (~0.02-0.05)

### 3.9 Dark Theme Color Palette

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0A0A0F` to `#0F0F1A` | Page background |
| `--bg-secondary` | `#111122` to `#141428` | Card backgrounds |
| `--bg-tertiary` | `rgba(255,255,255,0.03)` | Hover states, subtle fills |
| `--border-subtle` | `rgba(255,255,255,0.06)` | Card borders |
| `--border-default` | `rgba(255,255,255,0.1)` | Input borders, dividers |
| `--border-prominent` | `rgba(255,255,255,0.15)` | Focused inputs |
| `--text-primary` | `#FFFFFF` | Headings |
| `--text-secondary` | `rgba(255,255,255,0.7)` | Body text |
| `--text-tertiary` | `rgba(255,255,255,0.5)` | Descriptions |
| `--text-muted` | `rgba(255,255,255,0.4)` | Placeholders, captions |
| `--accent-red` | `#FF6363` | Primary accent, CTAs |
| `--accent-pink` | `#EC4899` | Gradient accent |
| `--accent-purple` | `#A855F7` | Gradient accent |
| `--accent-teal` | `#0D9488` | Check icons, success |
| `--accent-blue` | `#3B82F6` | Links, info |

### 3.10 Typography System

| Level | Size | Weight | Line-height | Usage |
|---|---|---|---|---|
| Hero Display | 56-64px | 800-900 (Black) | 1.05-1.1 | Page hero headings |
| H1 | 40-48px | 700 (Bold) | 1.1-1.15 | Section headings |
| H2 | 32-36px | 700 (Bold) | 1.2 | Sub-section headings |
| H3 | 24-28px | 600 (Semi-bold) | 1.3 | Card headings, feature titles |
| H4 | 18-20px | 600 (Semi-bold) | 1.4 | Small section headings |
| Body Large | 16-18px | 400 (Regular) | 1.6 | Hero subtext, lead paragraphs |
| Body | 14-15px | 400 (Regular) | 1.6 | Default body text |
| Body Small | 13px | 400 (Regular) | 1.5 | Card descriptions, metadata |
| Caption | 11-12px | 400-500 | 1.4 | Fine print, badges, stats |
| Code | 13-14px | 400 (Mono) | 1.6 | Code blocks, terminal commands |

**Font family**: Inter or similar sans-serif (system font stack likely: `-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif`). Monospace: `SF Mono, JetBrains Mono, Menlo, monospace`.

---

## 4. Component Priority (by Reusability)

Ranked from most reusable (used across many pages, many instances) to least reusable:

| Rank | Component | Reuse Score | Pages Used | Instances (est.) |
|---|---|---|---|---|
| 1 | **Button** | Extremely High | ALL (9/9) | 30+ |
| 2 | **Section Heading** | Extremely High | ALL (9/9) | 25+ |
| 3 | **Divider / Separator** | Very High | ALL (9/9) | 20+ |
| 4 | **Footer** | Very High | ALL (9/9) | 9 (once per page) |
| 5 | **Navbar** | Very High | ALL (9/9) | 9 (once per page) |
| 6 | **Link with Arrow** | High | 7/9 | 15+ |
| 7 | **Feature Card (Icon+Title+Desc)** | High | 6/9 | 20+ |
| 8 | **Category / Section Label (Pill)** | High | 6/9 | 12+ |
| 9 | **Feature Check Item** | High | 3/9 | 40+ (many per pricing card) |
| 10 | **Input Field** | High | 4/9 | 8+ |
| 11 | **CTA Section** | High | 5/9 | 5 |
| 12 | **Community Card** | High | 4/9 | 8 |
| 13 | **App Screenshot / Product Image** | High | 5/9 | 15+ |
| 14 | **Testimonial Card** | Medium-High | 2/9 | 8+ |
| 15 | **Pricing Card** | Medium-High | 3/9 | 12 |
| 16 | **Tag / Category Pill** | Medium-High | 3/9 | 10+ |
| 17 | **Feature Showcase Row (Split)** | Medium-High | 4/9 | 8+ |
| 18 | **Author / User Badge** | Medium | 3/9 | 10+ |
| 19 | **Newsletter Section** | Medium | 4/9 | 4 |
| 20 | **Keyboard Shortcut Badge** | Medium | 3/9 | 6+ |
| 21 | **Extension Card (Store)** | Medium | 1/9 | 13+ |
| 22 | **Blog Post Card** | Medium | 1/9 | 15+ |
| 23 | **Code Block** | Medium | 2/9 | 4+ |
| 24 | **FAQ Accordion** | Medium | 2/9 | 12+ items |
| 25 | **Stat / Metric Badge** | Medium | 1/9 | 20+ |
| 26 | **Logo Bar / Partner Strip** | Medium-Low | 1/9 | 1 |
| 27 | **Toggle / Segmented Control** | Medium-Low | 1/9 | 1 |
| 28 | **Tab / Segmented Navigation** | Medium-Low | 1/9 | 1 |
| 29 | **Social Auth Button** | Medium-Low | 1/9 | 3 |
| 30 | **Pagination** | Medium-Low | 1/9 | 1 |
| 31 | **Changelog Entry** | Low | 1/9 | 15+ |
| 32 | **Gradient Text** | Low | 3/9 | 3-5 (decorative) |
| 33 | **macOS Window Chrome** | Low | 4/9 | 6+ |
| 34 | **Icon Grid (decorative)** | Low | 2/9 | 2 |
| 35 | **Hero Search Bar (decorative)** | Low | 1/9 | 1 |
| 36 | **Theme Preview / Swatch Grid** | Very Low | 1/9 | 1 |
| 37 | **"Coming Soon" Card** | Very Low | 1/9 | 3 |
| 38 | **Extension Template Card** | Very Low | 1/9 | 3-4 |
| 39 | **"Or" Divider** | Low | 2/9 | 2-3 |

---

### Recommended Build Order for React Components

Based on reusability and dependency analysis, build components in this order:

**Phase 1 -- Foundation (Design Tokens + Primitives)**
1. Design tokens (colors, typography, spacing, border-radius, shadows)
2. Button (all variants)
3. Divider
4. Input Field
5. Tag / Pill Badge
6. Link with Arrow
7. Keyboard Shortcut Badge

**Phase 2 -- Atomic Components**
8. Section Heading (all variants)
9. Feature Check Item
10. Author / User Badge
11. Stat / Metric Badge
12. Category / Section Label
13. Social Auth Button
14. Toggle / Segmented Control
15. Tab Navigation
16. Pagination
17. Gradient Text (utility component)

**Phase 3 -- Composite Components**
18. Navbar
19. Footer
20. Feature Card (all variants)
21. Pricing Card
22. Extension Card (both variants)
23. Testimonial Card
24. Blog Post Card
25. Community Card
26. FAQ Accordion
27. Code Block
28. Changelog Entry
29. Newsletter Section
30. App Screenshot container (with macOS chrome)

**Phase 4 -- Section / Layout Components**
31. Hero Section (with aurora background)
32. Feature Grid (3-col, 2-col, 4-col variants)
33. Feature Showcase Row (split layout)
34. CTA Section ("Ready for take-off")
35. Logo Bar
36. Icon Grid (decorative)
37. "Coming Soon" Card
38. Extension Template Card
39. Theme Preview Grid

---

### Notes on Responsive Behavior (inferred)

- 4-column grids likely collapse to 2-column on tablet, 1-column on mobile
- 3-column grids likely collapse to 1-column on mobile
- Split layouts (text + image) likely stack vertically on mobile
- Navbar likely collapses to hamburger menu on mobile
- Hero text sizes likely scale down ~20-30% on mobile
- Footer columns likely stack 2x2 or single column on mobile
- All containers use max-width ~1200px with responsive horizontal padding

---

### Notes on Animation Patterns (inferred)

- **Scroll-triggered fade-in**: Sections likely fade and slide up into view on scroll
- **Aurora animation**: Gradient blobs may slowly drift/pulse
- **Button hover**: Slight brightness increase, possible scale(1.02)
- **Card hover**: Border brightens, possible subtle translateY(-2px)
- **Link arrow**: Arrow likely slides right on hover
- **FAQ chevron**: Rotates 180deg on expand/collapse
- **Tab switching**: Content likely cross-fades
