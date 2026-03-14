/**
 * Registry metadata for every item in Charlie UI.
 *
 * This is the only hand-maintained file in the registry pipeline.
 * The build script reads this to produce the JSON registry files.
 */

export type RegistryType =
  | "registry:component"
  | "registry:block"
  | "registry:hook"
  | "registry:lib"
  | "registry:style";

export type RegistryCategory =
  | "primitives"
  | "forms"
  | "navigation"
  | "layout"
  | "cards"
  | "data-display"
  | "charts"
  | "overlays"
  | "feedback"
  | "animation"
  | "blocks-marketing"
  | "blocks-auth"
  | "blocks-feedback"
  | "blocks-application"
  | "blocks-ecommerce"
  | "lib"
  | "hooks"
  | "styles";

export type ItemMeta = {
  title: string;
  description: string;
  type: RegistryType;
  category: RegistryCategory;
  /** Source file path relative to project root */
  source: string;
  /** Target path in consumer project (without @/ prefix) */
  target: string;
  /** Extra source files (for multi-file items like RichTextEditor) */
  extraFiles?: { source: string; target: string }[];
};

/**
 * Map from registry item name (kebab-case) → metadata.
 *
 * The build script uses the `source` field to read file content and parse
 * imports. The `target` field determines where the file lands in the
 * consumer's project.
 */
export const registryMetadata: Record<string, ItemMeta> = {
  // ──────────────────────────────────────────────
  // Lib (registry:lib)
  // ──────────────────────────────────────────────
  cn: {
    title: "cn",
    description: "Utility for merging Tailwind CSS classes (clsx + tailwind-merge)",
    type: "registry:lib",
    category: "lib",
    source: "src/utils/cn.ts",
    target: "lib/cn.ts",
  },
  slot: {
    title: "Slot",
    description: "Primitives-style Slot component for asChild pattern",
    type: "registry:lib",
    category: "lib",
    source: "src/utils/Slot.tsx",
    target: "lib/slot.tsx",
  },
  "compose-refs": {
    title: "composeRefs",
    description: "Utility to compose multiple React refs into one",
    type: "registry:lib",
    category: "lib",
    source: "src/utils/composeRefs.ts",
    target: "lib/compose-refs.ts",
  },
  "chart-helpers": {
    title: "Chart Helpers",
    description: "Shared utilities for chart components (tooltips, legends, formatting)",
    type: "registry:lib",
    category: "lib",
    source: "src/utils/chart-helpers.ts",
    target: "lib/chart-helpers.ts",
  },
  "animation-tokens": {
    title: "Animation Tokens",
    description: "Design tokens for animation durations, easings, springs, and distances",
    type: "registry:lib",
    category: "lib",
    source: "src/animation/tokens.ts",
    target: "lib/animation-tokens.ts",
  },
  "animation-presets": {
    title: "Animation Presets",
    description: "Named animation presets built on animation tokens",
    type: "registry:lib",
    category: "lib",
    source: "src/animation/presets.ts",
    target: "lib/animation-presets.ts",
  },
  "animation-utils": {
    title: "Animation Utils",
    description: "Helper functions for resolving animation durations and easings",
    type: "registry:lib",
    category: "lib",
    source: "src/animation/utils.ts",
    target: "lib/animation-utils.ts",
  },
  "toast-store": {
    title: "Toast Store",
    description: "Imperative toast() API and external store for the Toaster component",
    type: "registry:lib",
    category: "lib",
    source: "src/components/toast-store.ts",
    target: "lib/toast-store.ts",
  },
  "theme-presets": {
    title: "Theme Presets",
    description: "Built-in theme presets (default, indigo, ocean, emerald, amber, rose, violet)",
    type: "registry:lib",
    category: "lib",
    source: "src/themes/presets.ts",
    target: "lib/theme-presets.ts",
  },
  "field-context": {
    title: "Field Context",
    description: "React context for form field state (id, error, disabled, required)",
    type: "registry:lib",
    category: "lib",
    source: "src/components/field-context.ts",
    target: "lib/field-context.ts",
  },

  // ──────────────────────────────────────────────
  // Hooks (registry:hook)
  // ──────────────────────────────────────────────
  "use-controllable-state": {
    title: "useControllableState",
    description: "Hook for controlled/uncontrolled state management",
    type: "registry:hook",
    category: "hooks",
    source: "src/hooks/useControllableState.ts",
    target: "hooks/use-controllable-state.ts",
  },
  "use-field-aware": {
    title: "useFieldAware",
    description: "Hook to consume Field context for form-aware components",
    type: "registry:hook",
    category: "hooks",
    source: "src/hooks/useFieldAware.ts",
    target: "hooks/use-field-aware.ts",
  },
  "use-reduced-motion": {
    title: "useReducedMotion",
    description: "Hook that detects prefers-reduced-motion media query",
    type: "registry:hook",
    category: "hooks",
    source: "src/animation/useReducedMotion.ts",
    target: "hooks/use-reduced-motion.ts",
  },
  "use-focus-trap": {
    title: "useFocusTrap",
    description: "Hook that traps keyboard focus within a container element",
    type: "registry:hook",
    category: "hooks",
    source: "src/hooks/useFocusTrap.ts",
    target: "hooks/use-focus-trap.ts",
  },
  "use-focus-return": {
    title: "useFocusReturn",
    description: "Hook that saves and restores focus when overlays open/close",
    type: "registry:hook",
    category: "hooks",
    source: "src/hooks/useFocusReturn.ts",
    target: "hooks/use-focus-return.ts",
  },
  "use-roving-tab-index": {
    title: "useRovingTabIndex",
    description: "Hook for arrow-key roving tabindex navigation in widget groups",
    type: "registry:hook",
    category: "hooks",
    source: "src/hooks/useRovingTabIndex.ts",
    target: "hooks/use-roving-tab-index.ts",
  },
  "use-aria-announce": {
    title: "useAriaAnnounce",
    description: "Hook for programmatic screen reader announcements via live region",
    type: "registry:hook",
    category: "hooks",
    source: "src/hooks/useAriaAnnounce.ts",
    target: "hooks/use-aria-announce.ts",
  },
  "use-escape-key": {
    title: "useEscapeKey",
    description: "Hook that calls a handler when the Escape key is pressed",
    type: "registry:hook",
    category: "hooks",
    source: "src/hooks/useEscapeKey.ts",
    target: "hooks/use-escape-key.ts",
  },
  "use-scroll-lock": {
    title: "useScrollLock",
    description: "Hook that prevents body scrolling when active",
    type: "registry:hook",
    category: "hooks",
    source: "src/hooks/useScrollLock.ts",
    target: "hooks/use-scroll-lock.ts",
  },

  // ──────────────────────────────────────────────
  // Style (registry:style)
  // ──────────────────────────────────────────────
  "charlie-theme": {
    title: "Charlie Theme",
    description: "Global CSS with design tokens, keyframes, and Tailwind v4 theme",
    type: "registry:style",
    category: "styles",
    source: "src/styles/globals.css",
    target: "styles/charlie-ui.css",
  },

  // ──────────────────────────────────────────────
  // Primitives (registry:component)
  // ──────────────────────────────────────────────
  button: {
    title: "Button",
    description: "Versatile button with variants, sizes, icons, loading state, and asChild support",
    type: "registry:component",
    category: "primitives",
    source: "src/components/Button.tsx",
    target: "components/ui/button.tsx",
  },
  badge: {
    title: "Badge",
    description: "Small status indicator with color variants and optional dot",
    type: "registry:component",
    category: "primitives",
    source: "src/components/Badge.tsx",
    target: "components/ui/badge.tsx",
  },
  kbd: {
    title: "Kbd",
    description: "Keyboard shortcut display with automatic symbol resolution",
    type: "registry:component",
    category: "primitives",
    source: "src/components/Kbd.tsx",
    target: "components/ui/kbd.tsx",
  },
  divider: {
    title: "Divider",
    description: "Horizontal or vertical divider with optional label",
    type: "registry:component",
    category: "primitives",
    source: "src/components/Divider.tsx",
    target: "components/ui/divider.tsx",
  },
  skeleton: {
    title: "Skeleton",
    description: "Content placeholder with shimmer animation",
    type: "registry:component",
    category: "primitives",
    source: "src/components/Skeleton.tsx",
    target: "components/ui/skeleton.tsx",
  },
  label: {
    title: "Label",
    description: "Accessible form label component",
    type: "registry:component",
    category: "primitives",
    source: "src/components/Label.tsx",
    target: "components/ui/label.tsx",
  },
  "copy-button": {
    title: "CopyButton",
    description: "Button that copies text to clipboard with feedback animation",
    type: "registry:component",
    category: "primitives",
    source: "src/components/CopyButton.tsx",
    target: "components/ui/copy-button.tsx",
  },
  "code-block": {
    title: "CodeBlock",
    description: "Syntax-highlighted code display with copy button and line numbers",
    type: "registry:component",
    category: "primitives",
    source: "src/components/CodeBlock.tsx",
    target: "components/ui/code-block.tsx",
  },
  spinner: {
    title: "Spinner",
    description: "Loading spinner with multiple animation styles and sizes",
    type: "registry:component",
    category: "primitives",
    source: "src/components/Spinner.tsx",
    target: "components/ui/spinner.tsx",
  },
  "spinner-overlay": {
    title: "SpinnerOverlay",
    description: "Full-area overlay with centered spinner for loading states",
    type: "registry:component",
    category: "primitives",
    source: "src/components/SpinnerOverlay.tsx",
    target: "components/ui/spinner-overlay.tsx",
  },

  // ──────────────────────────────────────────────
  // Forms (registry:component)
  // ──────────────────────────────────────────────
  input: {
    title: "Input",
    description: "Text input with variants, icons, and form-field awareness",
    type: "registry:component",
    category: "forms",
    source: "src/components/Input.tsx",
    target: "components/ui/input.tsx",
  },
  textarea: {
    title: "Textarea",
    description: "Multi-line text input with auto-resize option",
    type: "registry:component",
    category: "forms",
    source: "src/components/Textarea.tsx",
    target: "components/ui/textarea.tsx",
  },
  checkbox: {
    title: "Checkbox",
    description: "Checkbox with label, description, and indeterminate state",
    type: "registry:component",
    category: "forms",
    source: "src/components/Checkbox.tsx",
    target: "components/ui/checkbox.tsx",
  },
  "radio-group": {
    title: "RadioGroup",
    description: "Radio button group with card and inline variants",
    type: "registry:component",
    category: "forms",
    source: "src/components/RadioGroup.tsx",
    target: "components/ui/radio-group.tsx",
  },
  switch: {
    title: "Switch",
    description: "Toggle switch with sizes and label support",
    type: "registry:component",
    category: "forms",
    source: "src/components/Switch.tsx",
    target: "components/ui/switch.tsx",
  },
  toggle: {
    title: "Toggle",
    description: "Pressable toggle button with active/inactive states",
    type: "registry:component",
    category: "forms",
    source: "src/components/Toggle.tsx",
    target: "components/ui/toggle.tsx",
  },
  "toggle-group": {
    title: "ToggleGroup",
    description: "Group of toggle buttons with single or multiple selection",
    type: "registry:component",
    category: "forms",
    source: "src/components/ToggleGroup.tsx",
    target: "components/ui/toggle-group.tsx",
  },
  slider: {
    title: "Slider",
    description: "Range slider with marks, tooltips, and custom formatting",
    type: "registry:component",
    category: "forms",
    source: "src/components/Slider.tsx",
    target: "components/ui/slider.tsx",
  },
  select: {
    title: "Select",
    description: "Dropdown select with search, groups, and custom rendering",
    type: "registry:component",
    category: "forms",
    source: "src/components/Select.tsx",
    target: "components/ui/select.tsx",
  },
  "otp-input": {
    title: "OTPInput",
    description: "One-time password input with configurable length and separator",
    type: "registry:component",
    category: "forms",
    source: "src/components/OTPInput.tsx",
    target: "components/ui/otp-input.tsx",
  },
  "file-upload": {
    title: "FileUpload",
    description: "Drag-and-drop file upload with preview and validation",
    type: "registry:component",
    category: "forms",
    source: "src/components/FileUpload.tsx",
    target: "components/ui/file-upload.tsx",
  },
  "date-picker": {
    title: "DatePicker",
    description: "Calendar-based date picker with popover and range modes",
    type: "registry:component",
    category: "forms",
    source: "src/components/DatePicker.tsx",
    target: "components/ui/date-picker.tsx",
  },
  "date-range-picker": {
    title: "DateRangePicker",
    description: "Date range picker with presets and dual calendar view",
    type: "registry:component",
    category: "forms",
    source: "src/components/DateRangePicker.tsx",
    target: "components/ui/date-range-picker.tsx",
  },
  "time-picker": {
    title: "TimePicker",
    description: "Time input with hour/minute/period selection",
    type: "registry:component",
    category: "forms",
    source: "src/components/TimePicker.tsx",
    target: "components/ui/time-picker.tsx",
  },
  "form-field": {
    title: "FormField",
    description: "Form field wrapper with label, description, and error message",
    type: "registry:component",
    category: "forms",
    source: "src/components/FormField.tsx",
    target: "components/ui/form-field.tsx",
  },
  field: {
    title: "Field",
    description: "Compound form field component with context-aware sub-components",
    type: "registry:component",
    category: "forms",
    source: "src/components/Field.tsx",
    target: "components/ui/field.tsx",
  },
  "rich-text-editor": {
    title: "RichTextEditor",
    description: "Tiptap-based rich text editor with toolbar, bubble menu, and extensions",
    type: "registry:component",
    category: "forms",
    source: "src/components/RichTextEditor.tsx",
    target: "components/ui/rich-text-editor.tsx",
    extraFiles: [
      {
        source: "src/components/rich-text-editor/extensions.ts",
        target: "components/ui/rich-text-editor/extensions.ts",
      },
      {
        source: "src/components/rich-text-editor/toolbar-items.tsx",
        target: "components/ui/rich-text-editor/toolbar-items.tsx",
      },
      {
        source: "src/components/rich-text-editor/styles.css",
        target: "components/ui/rich-text-editor/styles.css",
      },
    ],
  },
  "credit-card-input": {
    title: "CreditCardInput",
    description: "Credit card input with number formatting and card type detection",
    type: "registry:component",
    category: "forms",
    source: "src/components/CreditCardInput.tsx",
    target: "components/ui/credit-card-input.tsx",
  },

  // ──────────────────────────────────────────────
  // Navigation (registry:component)
  // ──────────────────────────────────────────────
  breadcrumbs: {
    title: "Breadcrumbs",
    description: "Navigation breadcrumb trail with customizable separator",
    type: "registry:component",
    category: "navigation",
    source: "src/components/Breadcrumbs.tsx",
    target: "components/ui/breadcrumbs.tsx",
  },
  pagination: {
    title: "Pagination",
    description: "Page navigation with numbered pages and prev/next controls",
    type: "registry:component",
    category: "navigation",
    source: "src/components/Pagination.tsx",
    target: "components/ui/pagination.tsx",
  },
  tabs: {
    title: "Tabs",
    description: "Tabbed interface with animated indicator and variants",
    type: "registry:component",
    category: "navigation",
    source: "src/components/Tabs.tsx",
    target: "components/ui/tabs.tsx",
  },
  stepper: {
    title: "Stepper",
    description: "Multi-step progress indicator with horizontal and vertical layouts",
    type: "registry:component",
    category: "navigation",
    source: "src/components/Stepper.tsx",
    target: "components/ui/stepper.tsx",
  },
  sidebar: {
    title: "Sidebar",
    description: "Collapsible sidebar navigation with groups and icons",
    type: "registry:component",
    category: "navigation",
    source: "src/components/Sidebar.tsx",
    target: "components/ui/sidebar.tsx",
  },

  // ──────────────────────────────────────────────
  // Layout (registry:component)
  // ──────────────────────────────────────────────
  container: {
    title: "Container",
    description: "Responsive max-width container with size variants",
    type: "registry:component",
    category: "layout",
    source: "src/components/Container.tsx",
    target: "components/ui/container.tsx",
  },
  section: {
    title: "Section",
    description: "Page section with heading, description, and spacing",
    type: "registry:component",
    category: "layout",
    source: "src/components/Section.tsx",
    target: "components/ui/section.tsx",
  },
  hero: {
    title: "Hero",
    description: "Landing page hero with headline, description, and CTAs",
    type: "registry:component",
    category: "layout",
    source: "src/components/Hero.tsx",
    target: "components/ui/hero.tsx",
  },
  navbar: {
    title: "Navbar",
    description: "Responsive navigation bar with mobile menu",
    type: "registry:component",
    category: "layout",
    source: "src/components/Navbar.tsx",
    target: "components/ui/navbar.tsx",
  },
  footer: {
    title: "Footer",
    description: "Site footer with columns, links, and social icons",
    type: "registry:component",
    category: "layout",
    source: "src/components/Footer.tsx",
    target: "components/ui/footer.tsx",
  },
  "gradient-background": {
    title: "GradientBackground",
    description: "Animated gradient background with aurora and mesh effects",
    type: "registry:component",
    category: "layout",
    source: "src/components/GradientBackground.tsx",
    target: "components/ui/gradient-background.tsx",
  },
  newsletter: {
    title: "Newsletter",
    description: "Email signup form with variants and loading state",
    type: "registry:component",
    category: "layout",
    source: "src/components/Newsletter.tsx",
    target: "components/ui/newsletter.tsx",
  },
  "resizable-panels": {
    title: "ResizablePanels",
    description: "Resizable split panel layout with drag handles",
    type: "registry:component",
    category: "layout",
    source: "src/components/ResizablePanels.tsx",
    target: "components/ui/resizable-panels.tsx",
  },
  "scroll-area": {
    title: "ScrollArea",
    description: "Custom scrollbar container with horizontal and vertical scrolling",
    type: "registry:component",
    category: "layout",
    source: "src/components/ScrollArea.tsx",
    target: "components/ui/scroll-area.tsx",
  },

  // ──────────────────────────────────────────────
  // Cards (registry:component)
  // ──────────────────────────────────────────────
  card: {
    title: "Card",
    description: "Compound card with header, content, footer, and variant support",
    type: "registry:component",
    category: "cards",
    source: "src/components/Card.tsx",
    target: "components/ui/card.tsx",
  },
  "blog-card": {
    title: "BlogCard",
    description: "Blog post preview card with image, tags, and author",
    type: "registry:component",
    category: "cards",
    source: "src/components/BlogCard.tsx",
    target: "components/ui/blog-card.tsx",
  },
  "pricing-card": {
    title: "PricingCard",
    description: "Pricing plan card with features list and CTA button",
    type: "registry:component",
    category: "cards",
    source: "src/components/PricingCard.tsx",
    target: "components/ui/pricing-card.tsx",
  },
  "feature-card": {
    title: "FeatureCard",
    description: "Feature highlight card with icon, title, and description",
    type: "registry:component",
    category: "cards",
    source: "src/components/FeatureCard.tsx",
    target: "components/ui/feature-card.tsx",
  },
  "social-card": {
    title: "SocialCard",
    description: "Social media-style card with avatar, content, and actions",
    type: "registry:component",
    category: "cards",
    source: "src/components/SocialCard.tsx",
    target: "components/ui/social-card.tsx",
  },
  "stat-card": {
    title: "StatCard",
    description: "Statistics display card with trend indicator and chart",
    type: "registry:component",
    category: "cards",
    source: "src/components/StatCard.tsx",
    target: "components/ui/stat-card.tsx",
  },
  testimonial: {
    title: "Testimonial",
    description: "Customer testimonial card with quote, avatar, and rating",
    type: "registry:component",
    category: "cards",
    source: "src/components/Testimonial.tsx",
    target: "components/ui/testimonial.tsx",
  },
  "changelog-entry": {
    title: "ChangelogEntry",
    description: "Changelog item with version badge, date, and content",
    type: "registry:component",
    category: "cards",
    source: "src/components/ChangelogEntry.tsx",
    target: "components/ui/changelog-entry.tsx",
  },

  // ──────────────────────────────────────────────
  // Data Display (registry:component)
  // ──────────────────────────────────────────────
  "data-table": {
    title: "DataTable",
    description: "Feature-rich data table with sorting, filtering, and pagination",
    type: "registry:component",
    category: "data-display",
    source: "src/components/DataTable.tsx",
    target: "components/ui/data-table.tsx",
  },
  "virtual-list": {
    title: "VirtualList",
    description: "Virtualized list for rendering large datasets efficiently",
    type: "registry:component",
    category: "data-display",
    source: "src/components/VirtualList.tsx",
    target: "components/ui/virtual-list.tsx",
  },
  accordion: {
    title: "Accordion",
    description: "Expandable content panels with single or multiple open modes",
    type: "registry:component",
    category: "data-display",
    source: "src/components/Accordion.tsx",
    target: "components/ui/accordion.tsx",
  },
  collapsible: {
    title: "Collapsible",
    description: "Animated expand/collapse container with trigger",
    type: "registry:component",
    category: "data-display",
    source: "src/components/Collapsible.tsx",
    target: "components/ui/collapsible.tsx",
  },
  avatar: {
    title: "Avatar",
    description: "User avatar with image, initials fallback, and status indicator",
    type: "registry:component",
    category: "data-display",
    source: "src/components/Avatar.tsx",
    target: "components/ui/avatar.tsx",
  },
  "avatar-group": {
    title: "AvatarGroup",
    description: "Stacked avatar group with overflow count",
    type: "registry:component",
    category: "data-display",
    source: "src/components/AvatarGroup.tsx",
    target: "components/ui/avatar-group.tsx",
  },
  timeline: {
    title: "Timeline",
    description: "Vertical timeline with status indicators and connectors",
    type: "registry:component",
    category: "data-display",
    source: "src/components/Timeline.tsx",
    target: "components/ui/timeline.tsx",
  },

  // ──────────────────────────────────────────────
  // Charts (registry:component)
  // ──────────────────────────────────────────────
  "line-chart": {
    title: "LineChart",
    description: "Line chart with multiple series, tooltips, and grid",
    type: "registry:component",
    category: "charts",
    source: "src/components/LineChart.tsx",
    target: "components/ui/line-chart.tsx",
  },
  "bar-chart": {
    title: "BarChart",
    description: "Bar chart with grouped, stacked, and horizontal modes",
    type: "registry:component",
    category: "charts",
    source: "src/components/BarChart.tsx",
    target: "components/ui/bar-chart.tsx",
  },
  "area-chart": {
    title: "AreaChart",
    description: "Area chart with gradient fills and stacking",
    type: "registry:component",
    category: "charts",
    source: "src/components/AreaChart.tsx",
    target: "components/ui/area-chart.tsx",
  },
  "pie-chart": {
    title: "PieChart",
    description: "Pie and donut chart with labels and legend",
    type: "registry:component",
    category: "charts",
    source: "src/components/PieChart.tsx",
    target: "components/ui/pie-chart.tsx",
  },
  "radar-chart": {
    title: "RadarChart",
    description: "Radar/spider chart for multi-dimensional data",
    type: "registry:component",
    category: "charts",
    source: "src/components/RadarChart.tsx",
    target: "components/ui/radar-chart.tsx",
  },

  // ──────────────────────────────────────────────
  // Overlays (registry:component)
  // ──────────────────────────────────────────────
  modal: {
    title: "Modal",
    description: "Dialog modal with backdrop, sizes, and close button",
    type: "registry:component",
    category: "overlays",
    source: "src/components/Modal.tsx",
    target: "components/ui/modal.tsx",
  },
  "fullscreen-modal": {
    title: "FullscreenModal",
    description: "Full-screen modal overlay with slide animation",
    type: "registry:component",
    category: "overlays",
    source: "src/components/FullscreenModal.tsx",
    target: "components/ui/fullscreen-modal.tsx",
  },
  drawer: {
    title: "Drawer",
    description: "Slide-out drawer panel from any edge",
    type: "registry:component",
    category: "overlays",
    source: "src/components/Drawer.tsx",
    target: "components/ui/drawer.tsx",
  },
  popover: {
    title: "Popover",
    description: "Floating popover panel anchored to a trigger element",
    type: "registry:component",
    category: "overlays",
    source: "src/components/Popover.tsx",
    target: "components/ui/popover.tsx",
  },
  tooltip: {
    title: "Tooltip",
    description: "Hover/focus tooltip with configurable placement",
    type: "registry:component",
    category: "overlays",
    source: "src/components/Tooltip.tsx",
    target: "components/ui/tooltip.tsx",
  },
  "context-menu": {
    title: "ContextMenu",
    description: "Right-click context menu with nested items",
    type: "registry:component",
    category: "overlays",
    source: "src/components/ContextMenu.tsx",
    target: "components/ui/context-menu.tsx",
  },
  dropdown: {
    title: "Dropdown",
    description: "Legacy dropdown menu component (use DropdownMenu instead)",
    type: "registry:component",
    category: "overlays",
    source: "src/components/Dropdown.tsx",
    target: "components/ui/dropdown.tsx",
  },
  "dropdown-menu": {
    title: "DropdownMenu",
    description: "Dropdown menu with items, checkboxes, and keyboard navigation",
    type: "registry:component",
    category: "overlays",
    source: "src/components/DropdownMenu.tsx",
    target: "components/ui/dropdown-menu.tsx",
  },
  "command-palette": {
    title: "CommandPalette",
    description: "Command palette with search, groups, and keyboard shortcuts",
    type: "registry:component",
    category: "overlays",
    source: "src/components/CommandPalette.tsx",
    target: "components/ui/command-palette.tsx",
  },

  // ──────────────────────────────────────────────
  // Feedback (registry:component)
  // ──────────────────────────────────────────────
  alert: {
    title: "Alert",
    description: "Alert banner with icon, variants, and dismissible option",
    type: "registry:component",
    category: "feedback",
    source: "src/components/Alert.tsx",
    target: "components/ui/alert.tsx",
  },
  toast: {
    title: "Toast",
    description: "Toast notification with variants and auto-dismiss",
    type: "registry:component",
    category: "feedback",
    source: "src/components/Toast.tsx",
    target: "components/ui/toast.tsx",
  },
  toaster: {
    title: "Toaster",
    description: "Toast container that renders active toasts from the store",
    type: "registry:component",
    category: "feedback",
    source: "src/components/Toaster.tsx",
    target: "components/ui/toaster.tsx",
  },
  progress: {
    title: "Progress",
    description: "Progress bar with determinate and indeterminate modes",
    type: "registry:component",
    category: "feedback",
    source: "src/components/Progress.tsx",
    target: "components/ui/progress.tsx",
  },

  // ──────────────────────────────────────────────
  // Animation (registry:component)
  // ──────────────────────────────────────────────
  animate: {
    title: "Animate",
    description: "Motion wrapper with preset animations (fade, slide, scale, collapse, pop)",
    type: "registry:component",
    category: "animation",
    source: "src/components/Animate.tsx",
    target: "components/ui/animate.tsx",
  },
  "stagger-group": {
    title: "StaggerGroup",
    description: "Container that staggers children animations sequentially",
    type: "registry:component",
    category: "animation",
    source: "src/components/StaggerGroup.tsx",
    target: "components/ui/stagger-group.tsx",
  },
  "animation-provider": {
    title: "AnimationProvider",
    description: "Context provider for global animation configuration",
    type: "registry:component",
    category: "animation",
    source: "src/animation/AnimationProvider.tsx",
    target: "components/ui/animation-provider.tsx",
  },
  "theme-provider": {
    title: "ThemeProvider",
    description: "Context provider for Charlie UI theming with preset themes",
    type: "registry:component",
    category: "layout",
    source: "src/components/ThemeProvider.tsx",
    target: "components/ui/theme-provider.tsx",
  },

  // ──────────────────────────────────────────────
  // Blocks: Marketing (registry:block)
  // ──────────────────────────────────────────────
  "blog-section": {
    title: "BlogSection",
    description: "Blog post grid section with heading and view-all link",
    type: "registry:block",
    category: "blocks-marketing",
    source: "src/components/BlogSection.tsx",
    target: "components/ui/blog-section.tsx",
  },
  "feature-section": {
    title: "FeatureSection",
    description: "Feature grid section with heading and description",
    type: "registry:block",
    category: "blocks-marketing",
    source: "src/components/FeatureSection.tsx",
    target: "components/ui/feature-section.tsx",
  },
  "testimonial-section": {
    title: "TestimonialSection",
    description: "Testimonial carousel or grid section",
    type: "registry:block",
    category: "blocks-marketing",
    source: "src/components/TestimonialSection.tsx",
    target: "components/ui/testimonial-section.tsx",
  },
  "pricing-section": {
    title: "PricingSection",
    description: "Pricing plans comparison section with toggle",
    type: "registry:block",
    category: "blocks-marketing",
    source: "src/components/PricingSection.tsx",
    target: "components/ui/pricing-section.tsx",
  },
  "cta-section": {
    title: "CTASection",
    description: "Call-to-action section with heading, description, and buttons",
    type: "registry:block",
    category: "blocks-marketing",
    source: "src/components/CTASection.tsx",
    target: "components/ui/cta-section.tsx",
  },
  "faq-section": {
    title: "FAQSection",
    description: "FAQ accordion section with categories",
    type: "registry:block",
    category: "blocks-marketing",
    source: "src/components/FAQSection.tsx",
    target: "components/ui/faq-section.tsx",
  },
  "logo-cloud": {
    title: "LogoCloud",
    description: "Partner/client logo showcase strip",
    type: "registry:block",
    category: "blocks-marketing",
    source: "src/components/LogoCloud.tsx",
    target: "components/ui/logo-cloud.tsx",
  },
  "stats-section": {
    title: "StatsSection",
    description: "Key metrics display section with animated counters",
    type: "registry:block",
    category: "blocks-marketing",
    source: "src/components/StatsSection.tsx",
    target: "components/ui/stats-section.tsx",
  },
  "team-section": {
    title: "TeamSection",
    description: "Team member grid with photos and bios",
    type: "registry:block",
    category: "blocks-marketing",
    source: "src/components/TeamSection.tsx",
    target: "components/ui/team-section.tsx",
  },
  "contact-section": {
    title: "ContactSection",
    description: "Contact form section with info and social links",
    type: "registry:block",
    category: "blocks-marketing",
    source: "src/components/ContactSection.tsx",
    target: "components/ui/contact-section.tsx",
  },
  "announcement-bar": {
    title: "AnnouncementBar",
    description: "Top-of-page announcement banner with dismiss",
    type: "registry:block",
    category: "blocks-marketing",
    source: "src/components/AnnouncementBar.tsx",
    target: "components/ui/announcement-bar.tsx",
  },
  "integrations-section": {
    title: "IntegrationsSection",
    description: "Integrations/partners showcase grid",
    type: "registry:block",
    category: "blocks-marketing",
    source: "src/components/IntegrationsSection.tsx",
    target: "components/ui/integrations-section.tsx",
  },
  "bento-grid": {
    title: "BentoGrid",
    description: "Bento-style feature grid layout with varied card sizes",
    type: "registry:block",
    category: "blocks-marketing",
    source: "src/components/BentoGrid.tsx",
    target: "components/ui/bento-grid.tsx",
  },
  "comparison-table": {
    title: "ComparisonTable",
    description: "Feature comparison table across pricing plans",
    type: "registry:block",
    category: "blocks-marketing",
    source: "src/components/ComparisonTable.tsx",
    target: "components/ui/comparison-table.tsx",
  },

  // ──────────────────────────────────────────────
  // Blocks: Auth (registry:block)
  // ──────────────────────────────────────────────
  "login-form": {
    title: "LoginForm",
    description: "Login form with email/password, social providers, and remember me",
    type: "registry:block",
    category: "blocks-auth",
    source: "src/components/LoginForm.tsx",
    target: "components/ui/login-form.tsx",
  },
  "signup-form": {
    title: "SignupForm",
    description: "Registration form with validation and social sign-up",
    type: "registry:block",
    category: "blocks-auth",
    source: "src/components/SignupForm.tsx",
    target: "components/ui/signup-form.tsx",
  },
  "forgot-password-form": {
    title: "ForgotPasswordForm",
    description: "Password reset request form with email input",
    type: "registry:block",
    category: "blocks-auth",
    source: "src/components/ForgotPasswordForm.tsx",
    target: "components/ui/forgot-password-form.tsx",
  },

  // ──────────────────────────────────────────────
  // Blocks: Feedback (registry:block)
  // ──────────────────────────────────────────────
  "error-page": {
    title: "ErrorPage",
    description: "Full-page error display for 404, 500, and custom error codes",
    type: "registry:block",
    category: "blocks-feedback",
    source: "src/components/ErrorPage.tsx",
    target: "components/ui/error-page.tsx",
  },
  "empty-state": {
    title: "EmptyState",
    description: "Empty state placeholder with icon, message, and action",
    type: "registry:block",
    category: "blocks-feedback",
    source: "src/components/EmptyState.tsx",
    target: "components/ui/empty-state.tsx",
  },

  // ──────────────────────────────────────────────
  // Blocks: Application (registry:block)
  // ──────────────────────────────────────────────
  "dashboard-layout": {
    title: "DashboardLayout",
    description: "Application dashboard shell with sidebar, header, and content area",
    type: "registry:block",
    category: "blocks-application",
    source: "src/components/DashboardLayout.tsx",
    target: "components/ui/dashboard-layout.tsx",
  },
  "settings-page": {
    title: "SettingsPage",
    description: "Settings page layout with sections and form controls",
    type: "registry:block",
    category: "blocks-application",
    source: "src/components/SettingsPage.tsx",
    target: "components/ui/settings-page.tsx",
  },
  "profile-section": {
    title: "ProfileSection",
    description: "User profile display with avatar, stats, and bio",
    type: "registry:block",
    category: "blocks-application",
    source: "src/components/ProfileSection.tsx",
    target: "components/ui/profile-section.tsx",
  },
  "onboarding-wizard": {
    title: "OnboardingWizard",
    description: "Multi-step onboarding flow with progress and navigation",
    type: "registry:block",
    category: "blocks-application",
    source: "src/components/OnboardingWizard.tsx",
    target: "components/ui/onboarding-wizard.tsx",
  },
  "chat-interface": {
    title: "ChatInterface",
    description: "Chat UI with message bubbles, input, and typing indicator",
    type: "registry:block",
    category: "blocks-application",
    source: "src/components/ChatInterface.tsx",
    target: "components/ui/chat-interface.tsx",
  },
  "notification-panel": {
    title: "NotificationPanel",
    description: "Notification list panel with read/unread states and actions",
    type: "registry:block",
    category: "blocks-application",
    source: "src/components/NotificationPanel.tsx",
    target: "components/ui/notification-panel.tsx",
  },
  "kanban-board": {
    title: "KanbanBoard",
    description: "Drag-and-drop kanban board with columns and cards",
    type: "registry:block",
    category: "blocks-application",
    source: "src/components/KanbanBoard.tsx",
    target: "components/ui/kanban-board.tsx",
  },
  "calendar-view": {
    title: "CalendarView",
    description: "Monthly calendar view with events and navigation",
    type: "registry:block",
    category: "blocks-application",
    source: "src/components/CalendarView.tsx",
    target: "components/ui/calendar-view.tsx",
  },
  "file-manager": {
    title: "FileManager",
    description: "File browser with grid/list views and breadcrumb navigation",
    type: "registry:block",
    category: "blocks-application",
    source: "src/components/FileManager.tsx",
    target: "components/ui/file-manager.tsx",
  },

  // ──────────────────────────────────────────────
  // Blocks: Ecommerce (registry:block)
  // ──────────────────────────────────────────────
  "product-card": {
    title: "ProductCard",
    description: "E-commerce product card with image, price, and add-to-cart",
    type: "registry:block",
    category: "blocks-ecommerce",
    source: "src/components/ProductCard.tsx",
    target: "components/ui/product-card.tsx",
  },
  "product-grid": {
    title: "ProductGrid",
    description: "Responsive product grid with filtering and sorting",
    type: "registry:block",
    category: "blocks-ecommerce",
    source: "src/components/ProductGrid.tsx",
    target: "components/ui/product-grid.tsx",
  },
  "shopping-cart": {
    title: "ShoppingCart",
    description: "Shopping cart with line items, quantity controls, and totals",
    type: "registry:block",
    category: "blocks-ecommerce",
    source: "src/components/ShoppingCart.tsx",
    target: "components/ui/shopping-cart.tsx",
  },
  "checkout-form": {
    title: "CheckoutForm",
    description: "Multi-step checkout with shipping, payment, and review",
    type: "registry:block",
    category: "blocks-ecommerce",
    source: "src/components/CheckoutForm.tsx",
    target: "components/ui/checkout-form.tsx",
  },
  "order-summary": {
    title: "OrderSummary",
    description: "Order summary with status, items, and shipping address",
    type: "registry:block",
    category: "blocks-ecommerce",
    source: "src/components/OrderSummary.tsx",
    target: "components/ui/order-summary.tsx",
  },
};
