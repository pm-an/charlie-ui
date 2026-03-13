# Container

A centered content wrapper with horizontal padding and a configurable maximum width. Use it to constrain page content to a readable width.

## Import

```tsx
import { Container } from "@piotr/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"xl"` | Maximum width of the container. |
| `className` | `string` | -- | Additional CSS classes. |
| `children` | `ReactNode` | -- | Content to constrain. |

### Size Dimensions

| Size | Max Width |
|---|---|
| `sm` | `746px` |
| `md` | `960px` |
| `lg` | `1080px` |
| `xl` | `1280px` |

All sizes include `mx-auto` for centering and `px-6` (24px) horizontal padding.

## Usage

### Default Container

```tsx
<Container>
  <h1 className="text-white text-3xl font-bold">Page Title</h1>
  <p className="text-white/60 mt-4">Your content goes here.</p>
</Container>
```

### Narrow Container for Blog Content

```tsx
<Container size="sm">
  <article className="prose">
    <h1>Blog Post Title</h1>
    <p>This content is constrained to 746px for optimal readability.</p>
  </article>
</Container>
```

### Different Sizes

```tsx
<Container size="md">
  <p>Medium width container (960px)</p>
</Container>

<Container size="lg">
  <p>Large width container (1080px)</p>
</Container>

<Container size="xl">
  <p>Extra large width container (1280px)</p>
</Container>
```

## Notes

- The `containerVariants` function is also exported for applying container styles to custom elements.
