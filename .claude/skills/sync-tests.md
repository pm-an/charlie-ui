---
name: sync-tests
description: Audit and generate comprehensive tests for Charlie UI components. Ensures every component has full test coverage with Vitest + Testing Library. Run with optional component name or "all".
---

# Sync Component Tests

You are auditing and writing tests for the Charlie UI component library. The goal is **full test coverage** for every component.

## Instructions

1. **Determine scope**: If the user specified a component name, handle only that one. If "all" or no argument, scan all components.

2. **For each component**, do:

   a. **Read the source** at `src/components/<ComponentName>.tsx`
   b. **Extract from source**:
      - All props from the TypeScript interface/type
      - CVA variants and their options
      - Default values
      - forwardRef usage
      - Event handlers (onClick, onChange, onSubmit, etc.)
      - Conditional rendering (icons, labels, error states, loading, etc.)
      - Sub-components (compound patterns like Card.Header, Accordion.Item)
      - ARIA attributes and roles
   c. **Read existing test** at `src/components/__tests__/<ComponentName>.test.tsx` (if exists)
   d. **Compare**: Does the test cover all props, variants, interactions, and edge cases?
   e. **Create or update** the test file to achieve full coverage

3. **Test file location**: `src/components/__tests__/ComponentName.test.tsx`

4. **Test structure** (follow exactly):

```tsx
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ComponentName } from "../ComponentName";

describe("ComponentName", () => {
  // === Rendering ===
  describe("rendering", () => {
    it("renders without crashing", () => { });
    it("renders children correctly", () => { });
    it("applies custom className", () => { });
    it("forwards ref", () => { }); // if forwardRef
    it("spreads additional HTML attributes", () => { });
  });

  // === Variants ===
  describe("variants", () => {
    it("renders primary variant by default", () => { });
    it("renders secondary variant", () => { });
    // ... one test per variant
  });

  // === Sizes ===
  describe("sizes", () => {
    it("renders sm size", () => { });
    // ... one test per size
  });

  // === Props ===
  describe("props", () => {
    // one test per meaningful prop
  });

  // === Interactions ===
  describe("interactions", () => {
    it("calls onClick when clicked", () => { });
    it("does not call onClick when disabled", () => { });
    // ... all interaction tests
  });

  // === Accessibility ===
  describe("accessibility", () => {
    it("has correct role", () => { });
    it("has correct aria attributes", () => { });
    // ... a11y tests
  });

  // === Edge cases ===
  describe("edge cases", () => {
    it("handles missing optional props", () => { });
    it("renders with empty children", () => { });
  });
});
```

5. **What to test for each component type**:

### Atoms (Button, Badge, Input, Toggle, Kbd, Divider, CodeBlock, Skeleton)
- All variants render correct visual classes
- All sizes render correctly
- forwardRef passes ref to DOM element
- className is merged (not replaced)
- HTML attributes are forwarded (data-testid, aria-label, etc.)
- Button: onClick, disabled, loading (spinner visible, button disabled), leftIcon/rightIcon render
- Input: onChange, value, label renders, helperText renders, error state (error message, red border class), disabled, leftIcon/rightIcon
- Toggle: checked/onChange, aria-checked, role="switch"
- CodeBlock: code content renders, copy button onClick copies to clipboard, language label
- Skeleton: width/height props applied

### Cards (Card, FeatureCard, PricingCard, Accordion, Testimonial, BlogCard)
- Card: compound components render (Header, Body, Footer), variants
- FeatureCard: icon/title/description render, sizes, glow class, href renders as anchor
- PricingCard: tier/price/period/features render, highlighted state adds classes, badge renders, annualPrice strikethrough
- Accordion: items expand/collapse on click, single mode (only one open), multiple mode, defaultOpen, aria-expanded
- Testimonial: quote/author/role render, avatar renders when provided
- BlogCard: title/excerpt/date render, image renders, tag renders, href renders as anchor, hover class on group

### Layout (Navbar, Hero, Section, Container, Footer, Newsletter, GradientBackground, SocialCard)
- Navbar: logo/links/actions render, mobile menu toggles, badge on link
- Hero: variants (centered/split), eyebrow/title/description render, gradient adds class
- Section: sizes, alignment, eyebrow/title/description
- Container: sizes apply correct max-width class
- Footer: logo/columns/links render, external links show icon, bottom section
- Newsletter: title/description render, form submit calls onSubmit with email value, email validation
- GradientBackground: variants apply correct gradient, animate prop
- SocialCard: color variants, href renders as anchor

### Interactive (Tabs, Tooltip, Avatar, AvatarGroup, CommandPalette, ToggleGroup, ChangelogEntry, Toast)
- Tabs: items render, clicking changes value, onChange called, variants render correct classes
- Tooltip: shows on hover, hides on mouse leave, content renders, side positioning
- Avatar: image renders, fallback initials when no src, sizes, status dot renders with correct color
- AvatarGroup: renders children, max prop shows overflow count
- CommandPalette: opens/closes, search input works, Escape closes, items render, groups render
- ToggleGroup: options render, clicking changes value, active state
- ChangelogEntry: date/version/title/description render, tags render, image renders
- Toast: variants render correct icon, title/description render, auto-dismiss timer, close button calls onClose, action renders

6. **Testing patterns**:

```tsx
// Test className merging
const { container } = render(<Button className="my-class">Test</Button>);
expect(container.firstChild).toHaveClass("my-class");

// Test click handler
const onClick = vi.fn();
render(<Button onClick={onClick}>Click</Button>);
fireEvent.click(screen.getByRole("button"));
expect(onClick).toHaveBeenCalledTimes(1);

// Test disabled
const onClick = vi.fn();
render(<Button disabled onClick={onClick}>Click</Button>);
fireEvent.click(screen.getByRole("button"));
expect(onClick).not.toHaveBeenCalled();

// Test ref forwarding
const ref = { current: null };
render(<Button ref={ref}>Test</Button>);
expect(ref.current).toBeInstanceOf(HTMLButtonElement);

// Test controlled state
const onChange = vi.fn();
render(<Toggle checked={false} onChange={onChange} />);
fireEvent.click(screen.getByRole("switch"));
expect(onChange).toHaveBeenCalledWith(true);

// Test conditional rendering
render(<Input label="Email" error errorMessage="Required" />);
expect(screen.getByText("Email")).toBeInTheDocument();
expect(screen.getByText("Required")).toBeInTheDocument();
```

7. **After writing tests**:
   - Run `npm run test` to verify all tests pass
   - Run `npm run test:coverage` if available to check coverage
   - Report: total tests written, pass/fail count, coverage percentage

## Important rules
- Tests MUST use Vitest (`describe`, `it`, `expect`, `vi`) not Jest
- Tests MUST use `@testing-library/react` for rendering
- Use `@testing-library/user-event` for complex interactions (typing, etc.)
- Use `@testing-library/jest-dom` matchers (toBeInTheDocument, toHaveClass, toBeDisabled, etc.)
- Do NOT test implementation details (internal state, CSS class names beyond variant verification)
- DO test behavior: what the user sees and can interact with
- Each test should be independent — no shared state between tests
- Use `vi.fn()` for mock functions, `vi.useFakeTimers()` for timers (Toast auto-dismiss)
