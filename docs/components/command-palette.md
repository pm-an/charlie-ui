# CommandPalette

A Raycast/Spotlight-inspired command palette overlay with a search input and grouped command items. Opens as a modal with a blurred backdrop.

## Import

```tsx
import { CommandPalette, CommandGroup, CommandItem } from "@piotr/charlie-ui";
```

## Props

### CommandPalette (Root)

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | **(required)** | Controls the visibility of the command palette. |
| `onOpenChange` | `(open: boolean) => void` | **(required)** | Callback when the palette should open or close. |
| `placeholder` | `string` | `"Search..."` | Placeholder text for the search input. |
| `className` | `string` | -- | Additional CSS classes for the outer container. |
| `children` | `ReactNode` | **(required)** | `CommandGroup` and `CommandItem` elements. |

### CommandGroup

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | -- | Section heading displayed above the group's items. |
| `className` | `string` | -- | Additional CSS classes. |
| `children` | `ReactNode` | -- | `CommandItem` elements. |

### CommandItem

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `React.ComponentType<LucideProps>` | -- | Lucide icon component (not an element -- pass the component itself). |
| `active` | `boolean` | `false` | Whether this item is visually highlighted. |
| `onSelect` | `() => void` | -- | Callback when the item is clicked. |
| `className` | `string` | -- | Additional CSS classes. |
| `children` | `ReactNode` | -- | Item label text. |

## Usage

### Basic Command Palette

```tsx
import { useState } from "react";
import { CommandPalette, CommandGroup, CommandItem } from "@piotr/charlie-ui";
import { FileText, Settings, Users } from "lucide-react";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Command Palette</button>

      <CommandPalette open={open} onOpenChange={setOpen}>
        <CommandGroup label="Actions">
          <CommandItem icon={FileText} onSelect={() => console.log("New file")}>
            New File
          </CommandItem>
          <CommandItem icon={Settings} onSelect={() => console.log("Settings")}>
            Settings
          </CommandItem>
          <CommandItem icon={Users} onSelect={() => console.log("Team")}>
            Team Members
          </CommandItem>
        </CommandGroup>
      </CommandPalette>
    </>
  );
}
```

### Multiple Groups

```tsx
<CommandPalette open={open} onOpenChange={setOpen} placeholder="Type a command...">
  <CommandGroup label="Navigation">
    <CommandItem icon={Home} onSelect={() => navigate("/")}>Home</CommandItem>
    <CommandItem icon={FileText} onSelect={() => navigate("/docs")}>Documentation</CommandItem>
  </CommandGroup>
  <CommandGroup label="Settings">
    <CommandItem icon={Settings} onSelect={() => navigate("/settings")}>General Settings</CommandItem>
    <CommandItem icon={Palette} onSelect={() => navigate("/theme")}>Theme</CommandItem>
  </CommandGroup>
</CommandPalette>
```

### With Active Item

```tsx
<CommandPalette open={open} onOpenChange={setOpen}>
  <CommandGroup label="Recent">
    <CommandItem icon={FileText} active>Currently Selected Item</CommandItem>
    <CommandItem icon={FileText}>Another Item</CommandItem>
  </CommandGroup>
</CommandPalette>
```

### Keyboard Shortcut to Open

```tsx
import { useEffect, useState } from "react";

function App() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <CommandPalette open={open} onOpenChange={setOpen}>
      {/* ... */}
    </CommandPalette>
  );
}
```

## Notes

- The palette closes when pressing `Escape` or clicking the backdrop.
- The search input is auto-focused when the palette opens.
- The dialog has a max width of `640px` and is positioned at `20vh` from the top.
- The backdrop uses `bg-black/60 backdrop-blur-sm`.
- Entry/exit animations are handled by Framer Motion (scale + opacity + y-offset).
- The `icon` prop on `CommandItem` expects a Lucide component reference (e.g. `Settings`), not a JSX element (e.g. `<Settings />`).
