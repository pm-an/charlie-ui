# Toggle

An animated on/off switch component. Uses Framer Motion for smooth spring-based thumb transitions.

## Import

```tsx
import { Toggle } from "@charlietogolden/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | `false` | Whether the toggle is on or off. |
| `onChange` | `(checked: boolean) => void` | -- | Callback fired with the new state when toggled. |
| `disabled` | `boolean` | `false` | Disables the toggle. |
| `className` | `string` | -- | Additional CSS classes. |

All standard `<button>` HTML attributes (except `onChange`) are also supported.

## Usage

### Basic Toggle

```tsx
import { useState } from "react";

function ToggleExample() {
  const [enabled, setEnabled] = useState(false);

  return <Toggle checked={enabled} onChange={setEnabled} />;
}
```

### With Label

```tsx
function LabeledToggle() {
  const [enabled, setEnabled] = useState(false);

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <Toggle checked={enabled} onChange={setEnabled} />
      <span className="text-sm text-white/80">Enable notifications</span>
    </label>
  );
}
```

### Disabled State

```tsx
<Toggle checked={false} disabled />
<Toggle checked={true} disabled />
```

### In a Settings Form

```tsx
function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white">Dark Mode</span>
        <Toggle checked={darkMode} onChange={setDarkMode} />
      </div>
      <Divider />
      <div className="flex items-center justify-between">
        <span className="text-sm text-white">Notifications</span>
        <Toggle checked={notifications} onChange={setNotifications} />
      </div>
    </div>
  );
}
```

## Notes

- The toggle track is `44px` wide and `24px` tall.
- When checked, the track turns `bg-red` (the brand accent). When unchecked, it uses `bg-white/10`.
- The thumb animates horizontally using Framer Motion springs (`stiffness: 500, damping: 30`).
- The component renders as a `<button>` with `role="switch"` and `aria-checked` for accessibility.
- Disabled state applies `opacity-50` and `cursor-not-allowed`.
