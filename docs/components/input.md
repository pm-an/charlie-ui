# Input

A styled text input with support for labels, helper text, error states, and icon slots. Built on the native `<input>` element with `forwardRef`.

## Import

```tsx
import { Input } from "@charlietogolden/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | -- | Label text displayed above the input. Also used to generate the `id` and `htmlFor` attributes. |
| `helperText` | `string` | -- | Hint text displayed below the input (hidden when `error` is `true`). |
| `error` | `boolean` | `false` | Applies error styling to the input border and focus ring. |
| `errorMessage` | `string` | -- | Error message displayed below the input when `error` is `true`. |
| `leftIcon` | `ReactNode` | -- | Icon rendered inside the input on the left side. |
| `rightIcon` | `ReactNode` | -- | Icon rendered inside the input on the right side. |
| `className` | `string` | -- | Additional CSS classes applied to the `<input>` element. |

All standard `<input>` HTML attributes (except `size`) are also supported: `type`, `placeholder`, `value`, `onChange`, `disabled`, etc.

## Usage

### Basic Input

```tsx
<Input placeholder="Enter your name" />
```

### With Label

```tsx
<Input label="Email" type="email" placeholder="you@example.com" />
```

### With Helper Text

```tsx
<Input
  label="Password"
  type="password"
  placeholder="Enter your password"
  helperText="Must be at least 8 characters."
/>
```

### Error State

```tsx
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  error
  errorMessage="Please enter a valid email address."
/>
```

### With Icons

```tsx
import { Search, X } from "lucide-react";

<Input
  leftIcon={<Search className="w-4 h-4" />}
  placeholder="Search..."
/>

<Input
  rightIcon={<X className="w-4 h-4" />}
  placeholder="With right icon"
/>
```

### With Both Icons

```tsx
import { Mail, Check } from "lucide-react";

<Input
  label="Email"
  leftIcon={<Mail className="w-4 h-4" />}
  rightIcon={<Check className="w-4 h-4" />}
  placeholder="you@example.com"
/>
```

### Controlled Input

```tsx
import { useState } from "react";

function SearchInput() {
  const [query, setQuery] = useState("");

  return (
    <Input
      label="Search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Type to search..."
    />
  );
}
```

## Notes

- The input has a height of `40px` (`h-10`), matching the default button size.
- Focus styling uses `ring-1 ring-white/15 border-white/15`. Error state uses `ring-red/30 border-red/50`.
- When `leftIcon` is provided, the input gets `pl-10` padding. When `rightIcon` is provided, it gets `pr-10`.
- Icon containers are `pointer-events-none` so they do not interfere with input focus.
- The `id` attribute is auto-generated from the `label` prop (lowercased, spaces replaced with hyphens) unless explicitly provided.
