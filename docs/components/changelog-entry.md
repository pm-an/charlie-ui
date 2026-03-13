# ChangelogEntry

A timeline-style entry for displaying changelog items, release notes, or version history. Includes a date column, a vertical timeline connector, and a content area.

## Import

```tsx
import { ChangelogEntry } from "@piotr/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `date` | `string` | **(required)** | Date string displayed in the left column (e.g. `"Mar 13, 2026"`). |
| `version` | `string` | -- | Version badge displayed above the title (e.g. `"v0.1.0"`). |
| `title` | `string` | **(required)** | Heading for the changelog entry. |
| `description` | `string` | -- | Body text describing the changes. |
| `tags` | `string[]` | -- | Array of tag labels shown below the description. |
| `image` | `string` | -- | URL for a screenshot or visual associated with the entry. |
| `className` | `string` | -- | Additional CSS classes. |
| `children` | `ReactNode` | -- | Additional custom content rendered after the description and tags. |

## Usage

### Basic Entry

```tsx
<ChangelogEntry
  date="Mar 13, 2026"
  title="Initial Release"
  description="Charlie UI v0.1.0 is now available with 30+ components."
/>
```

### With Version and Tags

```tsx
<ChangelogEntry
  date="Mar 13, 2026"
  version="v0.1.0"
  title="Dark Theme Components"
  description="A complete set of dark-themed React components built with Tailwind CSS v4."
  tags={["New", "Components", "Dark Theme"]}
/>
```

### With Image

```tsx
<ChangelogEntry
  date="Mar 10, 2026"
  version="v0.0.9"
  title="Command Palette"
  description="Added a Raycast-inspired command palette component with search and keyboard navigation."
  image="/changelog/command-palette.png"
/>
```

### Full Timeline

Stack multiple entries to create a changelog timeline:

```tsx
<div>
  <ChangelogEntry
    date="Mar 13"
    version="v0.1.0"
    title="Public Release"
    description="First stable release of Charlie UI."
    tags={["Release"]}
  />
  <ChangelogEntry
    date="Mar 10"
    version="v0.0.9"
    title="Animation System"
    description="Added Framer Motion integration for all interactive components."
    tags={["Enhancement"]}
  />
  <ChangelogEntry
    date="Mar 5"
    version="v0.0.8"
    title="Design Tokens"
    description="Migrated to Tailwind CSS v4 @theme tokens."
    tags={["Breaking Change"]}
  />
</div>
```

## Notes

- The left column has a fixed width of `120px`.
- A timeline dot and vertical line are rendered between the date and content columns.
- Each entry has `pb-12` (48px) bottom padding to create spacing between stacked entries.
