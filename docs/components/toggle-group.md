# ToggleGroup

An animated segmented control for exclusive single-selection between a set of options. Uses Framer Motion's `layoutId` for a smooth sliding indicator.

## Import

```tsx
import { ToggleGroup } from "@piotr/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `ToggleGroupOption[]` | **(required)** | Array of selectable options. |
| `value` | `string` | **(required)** | The currently selected option value (controlled). |
| `onChange` | `(value: string) => void` | **(required)** | Callback when a different option is selected. |
| `className` | `string` | -- | Additional CSS classes. |

### ToggleGroupOption

| Property | Type | Description |
|---|---|---|
| `label` | `string` | Display text for the option. |
| `value` | `string` | Unique identifier for the option. |

## Usage

### Basic Toggle Group

```tsx
import { useState } from "react";

function BillingToggle() {
  const [billing, setBilling] = useState("monthly");

  return (
    <ToggleGroup
      options={[
        { label: "Monthly", value: "monthly" },
        { label: "Annually", value: "annually" },
      ]}
      value={billing}
      onChange={setBilling}
    />
  );
}
```

### Three Options

```tsx
function ViewToggle() {
  const [view, setView] = useState("grid");

  return (
    <ToggleGroup
      options={[
        { label: "Grid", value: "grid" },
        { label: "List", value: "list" },
        { label: "Board", value: "board" },
      ]}
      value={view}
      onChange={setView}
    />
  );
}
```

### In a Pricing Section

```tsx
function PricingSection() {
  const [billing, setBilling] = useState("monthly");

  return (
    <Section title="Pricing" description="Choose the plan that works for you.">
      <div className="flex justify-center mb-8">
        <ToggleGroup
          options={[
            { label: "Monthly", value: "monthly" },
            { label: "Annually", value: "annually" },
          ]}
          value={billing}
          onChange={setBilling}
        />
      </div>
      {/* Pricing cards */}
    </Section>
  );
}
```

## Notes

- The container is a rounded pill shape (`rounded-full`) with `bg-white/5` background and `p-1` padding.
- The active indicator is a white pill that slides behind the active option using `layoutId="toggle-group-active"` with spring physics (`stiffness: 500, damping: 35`).
- The active option text turns dark (`text-[#18191a]`); inactive options are `text-white/60` and brighten to `text-white` on hover.
- The component uses `role="radiogroup"` on the container and `role="radio"` with `aria-checked` on each option for accessibility.
