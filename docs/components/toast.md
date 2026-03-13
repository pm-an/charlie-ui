# Toast

A notification popup that appears in the bottom-right corner of the viewport. Supports four semantic variants with auto-dismiss and an optional close button.

## Import

```tsx
import { Toast } from "@piotr/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"default" \| "success" \| "error" \| "warning"` | `"default"` | Semantic variant that determines the icon and its color. |
| `title` | `string` | **(required)** | Toast heading text. |
| `description` | `string` | -- | Secondary text below the title. |
| `action` | `ReactNode` | -- | Custom action element (e.g. a button) rendered below the description. |
| `open` | `boolean` | `true` | Controls visibility. |
| `onClose` | `() => void` | -- | Callback when the toast is dismissed. Also renders a close button when provided. |
| `duration` | `number` | `5000` | Auto-dismiss duration in milliseconds. Set to `0` to disable auto-dismiss. |
| `className` | `string` | -- | Additional CSS classes. |

### Variant Icons

| Variant | Icon | Color |
|---|---|---|
| `default` | `Info` | Blue (`text-blue`) |
| `success` | `CheckCircle2` | Green (`text-green`) |
| `error` | `XCircle` | Red (`text-red`) |
| `warning` | `AlertTriangle` | Yellow (`text-yellow`) |

## Usage

### Basic Toast

```tsx
<Toast title="Changes saved" />
```

### Success Toast

```tsx
<Toast
  variant="success"
  title="File uploaded"
  description="Your file has been uploaded successfully."
  onClose={() => setShowToast(false)}
/>
```

### Error Toast

```tsx
<Toast
  variant="error"
  title="Upload failed"
  description="Please check your file size and try again."
  onClose={() => setShowToast(false)}
/>
```

### Warning Toast

```tsx
<Toast
  variant="warning"
  title="Disk space low"
  description="You have less than 500MB remaining."
  onClose={() => setShowToast(false)}
/>
```

### With Action Button

```tsx
<Toast
  variant="error"
  title="Connection lost"
  description="Unable to reach the server."
  action={
    <Button variant="secondary" size="sm" onClick={retry}>
      Retry
    </Button>
  }
  onClose={() => setShowToast(false)}
/>
```

### Controlled Toast

```tsx
import { useState } from "react";

function ToastExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Show Toast</Button>
      <Toast
        open={open}
        variant="success"
        title="Action completed"
        description="Everything went smoothly."
        onClose={() => setOpen(false)}
        duration={3000}
      />
    </>
  );
}
```

### Persistent Toast (No Auto-Dismiss)

```tsx
<Toast
  variant="warning"
  title="Action required"
  description="Please update your payment method."
  duration={0}
  onClose={() => setShowToast(false)}
/>
```

## Notes

- The toast is positioned `fixed bottom-6 right-6` with `z-50`.
- Width ranges from `min-w-[320px]` to `max-w-[420px]`.
- Entry/exit animations use Framer Motion (opacity, y-offset, and scale).
- The close button (X icon) only renders when `onClose` is provided.
- Auto-dismiss is triggered by a `setTimeout` that calls `onClose` after `duration` milliseconds. The timer resets if `open` or `duration` changes.
- Icons are from Lucide React.
