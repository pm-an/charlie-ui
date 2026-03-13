# Newsletter

An email subscription form card with a title, description, email input, and submit button. Manages its own input state internally.

## Import

```tsx
import { Newsletter } from "@piotr/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | **(required)** | Heading text above the form. |
| `description` | `string` | **(required)** | Subtitle text below the heading. |
| `onSubmit` | `(email: string) => void` | -- | Callback fired with the trimmed email string when the form is submitted. |
| `className` | `string` | -- | Additional CSS classes. |

## Usage

### Basic Newsletter Form

```tsx
<Newsletter
  title="Stay in the loop"
  description="Get notified about new components and updates."
  onSubmit={(email) => console.log("Subscribed:", email)}
/>
```

### In a Section

```tsx
<Section title="Newsletter" description="Subscribe to our updates.">
  <div className="max-w-md mx-auto">
    <Newsletter
      title="Join our mailing list"
      description="We send updates about once a month. No spam."
      onSubmit={(email) => subscribeUser(email)}
    />
  </div>
</Section>
```

## Notes

- The form uses `type="email"` with the `required` attribute for built-in browser validation.
- After successful submission, the email input is automatically cleared.
- The component uses a `bg-card-gradient` background with rounded corners and a border.
- Content is center-aligned with `text-center`.
- The submit button has primary styling (`bg-white text-[#18191a]`).
