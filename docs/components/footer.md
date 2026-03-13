# Footer

A multi-column site footer with a logo area, link columns, and an optional bottom bar. Designed for marketing pages and documentation sites.

## Import

```tsx
import { Footer } from "@piotr/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `logo` | `ReactNode` | **(required)** | Logo element displayed at the top of the footer. |
| `columns` | `FooterColumn[]` | **(required)** | Array of link columns (see below). |
| `bottom` | `ReactNode` | -- | Content displayed in the bottom bar below the columns (e.g. copyright text). |
| `className` | `string` | -- | Additional CSS classes. |

### FooterColumn

| Property | Type | Description |
|---|---|---|
| `title` | `string` | Column heading. |
| `links` | `FooterLink[]` | Array of links in this column. |

### FooterLink

| Property | Type | Description |
|---|---|---|
| `label` | `string` | Link display text. |
| `href` | `string` | Link URL. |
| `external` | `boolean` | When `true`, adds `target="_blank"` and an external link icon. |

## Usage

### Basic Footer

```tsx
<Footer
  logo={<span className="text-white font-bold text-lg">Charlie UI</span>}
  columns={[
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Changelog", href: "/changelog" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "Blog", href: "/blog" },
        { label: "GitHub", href: "https://github.com", external: true },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ]}
  bottom={<span>Copyright 2026 Charlie UI. All rights reserved.</span>}
/>
```

### Minimal Footer

```tsx
<Footer
  logo={<img src="/logo.svg" alt="Logo" className="h-6" />}
  columns={[
    {
      title: "Links",
      links: [
        { label: "Docs", href: "/docs" },
        { label: "GitHub", href: "https://github.com", external: true },
      ],
    },
  ]}
/>
```

## Notes

- The footer has a `border-t border-white/[0.06]` top border.
- Columns are displayed in a responsive grid: 2 columns on mobile, 4 on medium screens, 5 on large screens.
- External links render with a small `ExternalLink` icon from Lucide React and open in a new tab.
- The bottom bar is separated from the columns by a border and has `text-white/30 text-xs` styling.
- The footer uses a max width of `1280px` with `px-6` horizontal padding, matching the `Container` component's `xl` size.
