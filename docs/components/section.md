# Section

A page section wrapper with an eyebrow, title, description header area and a content slot. Handles vertical padding, max-width constraints, and text alignment.

## Import

```tsx
import { Section } from "@charlietogolden/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Vertical padding size. |
| `eyebrow` | `string` | -- | Small uppercase text above the title. |
| `title` | `string` | -- | Section heading. |
| `description` | `string` | -- | Subtitle below the heading (max width `672px` when centered). |
| `align` | `"left" \| "center"` | `"center"` | Text alignment for the header area. |
| `className` | `string` | -- | Additional CSS classes. |
| `children` | `ReactNode` | -- | Section content rendered below the header with `mt-12` spacing. |

### Size Styles

| Size | Vertical Padding |
|---|---|
| `sm` | `48px` (`py-12`) |
| `md` | `80px` (`py-20`) |
| `lg` | `128px` (`py-32`) |

## Usage

### Centered Section (Default)

```tsx
<Section
  eyebrow="Features"
  title="Everything you need"
  description="A comprehensive set of components for building dark-themed interfaces."
>
  <div className="grid grid-cols-3 gap-6">
    {/* Feature cards */}
  </div>
</Section>
```

### Left-Aligned Section

```tsx
<Section
  align="left"
  eyebrow="Changelog"
  title="What's new"
  description="The latest updates and improvements."
>
  {/* Changelog entries */}
</Section>
```

### Different Sizes

```tsx
<Section size="sm" title="Compact Section">
  <p className="text-white/60">Less vertical padding.</p>
</Section>

<Section size="lg" title="Spacious Section">
  <p className="text-white/60">More vertical padding.</p>
</Section>
```

### Without Header

```tsx
<Section>
  <div className="grid grid-cols-2 gap-6">
    {/* Content without a section header */}
  </div>
</Section>
```

## Notes

- Content is constrained to `max-w-[1280px]` with `px-6` horizontal padding.
- The eyebrow text uses `text-red` coloring with uppercase, tracked lettering.
- The description is capped at `max-w-2xl` and centered with `mx-auto` when `align` is `"center"`.
- The `sectionVariants` function is also exported.
