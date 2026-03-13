# Navbar

A fixed-position navigation bar with a logo, desktop links, action buttons, and a responsive mobile hamburger menu with animated expand/collapse.

## Import

```tsx
import { Navbar } from "@piotr/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `logo` | `ReactNode` | **(required)** | Logo element displayed on the left side. |
| `links` | `NavbarLink[]` | `[]` | Navigation links displayed in the center (desktop) or mobile menu. |
| `actions` | `ReactNode` | -- | Action elements (e.g. buttons) displayed on the right side. |
| `className` | `string` | -- | Additional CSS classes. |

### NavbarLink

| Property | Type | Description |
|---|---|---|
| `label` | `string` | Link display text. |
| `href` | `string` | Link URL. |
| `badge` | `string` | Optional badge label displayed next to the link text (red-tinted). |

## Usage

### Basic Navbar

```tsx
<Navbar
  logo={<span className="text-white font-bold text-lg">Charlie UI</span>}
  links={[
    { label: "Docs", href: "/docs" },
    { label: "Components", href: "/components" },
    { label: "Blog", href: "/blog" },
  ]}
  actions={<Button size="sm">Get Started</Button>}
/>
```

### With Link Badges

```tsx
<Navbar
  logo={<img src="/logo.svg" alt="Logo" className="h-6" />}
  links={[
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "API", href: "/api", badge: "New" },
  ]}
  actions={
    <>
      <Button variant="ghost" size="sm">Sign In</Button>
      <Button variant="primary" size="sm">Sign Up</Button>
    </>
  }
/>
```

### Minimal Navbar

```tsx
<Navbar
  logo={<span className="text-white font-bold">App</span>}
/>
```

## Notes

- The navbar is `fixed` to the top of the viewport with `z-50` and a height of `58px`.
- Background uses `bg-black/50 backdrop-blur-xl` for a frosted glass effect.
- Desktop links are hidden on mobile (`hidden md:flex`); the hamburger menu button is hidden on desktop (`md:hidden`).
- The mobile menu animates open/closed using Framer Motion (height and opacity).
- Links in the mobile menu automatically close the menu when clicked.
- The hamburger icon toggles between `Menu` and `X` icons from Lucide React.
- Link badges use red-tinted styling matching the `Badge` component's `red` variant.
- Be sure to add appropriate top padding to your page content (at least `58px`) to account for the fixed navbar.
