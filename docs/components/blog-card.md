# BlogCard

A content card designed for blog post previews, featuring an image area, tag, title, excerpt, and publication date. Optionally renders as an anchor element when an `href` is provided.

## Import

```tsx
import { BlogCard } from "@piotr/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | **(required)** | Post title. |
| `excerpt` | `string` | **(required)** | Short summary of the post (clamped to 2 lines). |
| `date` | `string` | **(required)** | Publication date string (e.g. `"March 13, 2026"`). |
| `image` | `string` | -- | URL for the hero image. Displayed in a 16:9 aspect ratio area. |
| `tag` | `string` | -- | Category or topic label displayed above the title. |
| `href` | `string` | -- | When provided, the entire card becomes a clickable link. |
| `className` | `string` | -- | Additional CSS classes. |

## Usage

### Basic Blog Card

```tsx
<BlogCard
  title="Introducing Charlie UI"
  excerpt="A dark-themed component library built for modern React applications with Tailwind CSS v4."
  date="March 13, 2026"
/>
```

### With Image and Tag

```tsx
<BlogCard
  title="Building Dark Themes with Tailwind CSS v4"
  excerpt="Learn how to use the new @theme directive to create beautiful dark interfaces."
  date="March 10, 2026"
  image="/blog/dark-themes.jpg"
  tag="Tutorial"
/>
```

### As a Link

```tsx
<BlogCard
  title="Component Design Patterns"
  excerpt="Explore compound components, CVA variants, and forwarded refs in React."
  date="March 5, 2026"
  image="/blog/patterns.jpg"
  tag="Engineering"
  href="/blog/component-design-patterns"
/>
```

### Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <BlogCard
    title="Post One"
    excerpt="First post excerpt."
    date="March 13, 2026"
    image="/blog/1.jpg"
    tag="News"
    href="/blog/1"
  />
  <BlogCard
    title="Post Two"
    excerpt="Second post excerpt."
    date="March 12, 2026"
    image="/blog/2.jpg"
    tag="Tutorial"
    href="/blog/2"
  />
  <BlogCard
    title="Post Three"
    excerpt="Third post excerpt."
    date="March 11, 2026"
    image="/blog/3.jpg"
    tag="Update"
    href="/blog/3"
  />
</div>
```

## Notes

- The title text changes to `text-red` on hover when the card is a group.
- The excerpt is clamped to 2 lines using `line-clamp-2`.
- If no `image` is provided, the image area renders as an empty `bg-grey-800` rectangle.
