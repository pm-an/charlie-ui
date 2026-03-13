# Tabs

An animated tab navigation component with three visual styles: pills, underline, and segment. Uses Framer Motion's `layoutId` for smooth active indicator transitions.

## Import

```tsx
import { Tabs } from "@piotr/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"pills" \| "underline" \| "segment"` | `"pills"` | Visual style of the tabs. |
| `items` | `TabItem[]` | **(required)** | Array of tab definitions. |
| `value` | `string` | **(required)** | The currently active tab value (controlled). |
| `onChange` | `(value: string) => void` | **(required)** | Callback when a tab is selected. |
| `className` | `string` | -- | Additional CSS classes. |

### TabItem

| Property | Type | Description |
|---|---|---|
| `label` | `string` | Display text for the tab. |
| `value` | `string` | Unique identifier for the tab. |
| `badge` | `string` | Optional badge displayed next to the label. |

### Variant Styles

| Variant | Description |
|---|---|
| `pills` | Rounded pill container with a sliding white background indicator. Active text is dark. |
| `underline` | Bottom-bordered container with a sliding red underline indicator. |
| `segment` | Rounded segment container with a sliding `bg-white/10` background indicator. |

## Usage

### Pills (Default)

```tsx
import { useState } from "react";

function TabsExample() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs
      items={[
        { label: "Overview", value: "overview" },
        { label: "Features", value: "features" },
        { label: "Pricing", value: "pricing" },
      ]}
      value={activeTab}
      onChange={setActiveTab}
    />
  );
}
```

### Underline Variant

```tsx
<Tabs
  variant="underline"
  items={[
    { label: "General", value: "general" },
    { label: "Security", value: "security" },
    { label: "Notifications", value: "notifications" },
  ]}
  value={activeTab}
  onChange={setActiveTab}
/>
```

### Segment Variant

```tsx
<Tabs
  variant="segment"
  items={[
    { label: "Monthly", value: "monthly" },
    { label: "Annually", value: "annually" },
  ]}
  value={activeTab}
  onChange={setActiveTab}
/>
```

### With Badges

```tsx
<Tabs
  items={[
    { label: "All", value: "all" },
    { label: "Active", value: "active", badge: "12" },
    { label: "Archived", value: "archived", badge: "3" },
  ]}
  value={activeTab}
  onChange={setActiveTab}
/>
```

### With Tab Content

```tsx
function TabsWithContent() {
  const [tab, setTab] = useState("overview");

  return (
    <div>
      <Tabs
        items={[
          { label: "Overview", value: "overview" },
          { label: "Code", value: "code" },
        ]}
        value={tab}
        onChange={setTab}
      />
      <div className="mt-6">
        {tab === "overview" && <p className="text-white/60">Overview content.</p>}
        {tab === "code" && <CodeBlock code="console.log('hello');" language="js" />}
      </div>
    </div>
  );
}
```

## Notes

- The active indicator slides between tabs using Framer Motion's `layoutId` with spring physics (`stiffness: 500, damping: 35`).
- The component renders `role="tablist"` on the container and `role="tab"` with `aria-selected` on each tab button.
- Tab badges use `text-[10px]` with `bg-white/5` styling.
- The `tabsContainerVariants` and `tabItemVariants` functions are also exported.
