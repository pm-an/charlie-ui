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
  });

  // === Edge cases ===
  describe("edge cases", () => {
    it("handles missing optional props", () => { });
    it("renders with empty children", () => { });
  });
});
```

5. **What to test** (aim for full coverage):
   - **Rendering** — renders without crashing for each variant/size
   - **Props** — all props applied correctly (className, custom props, forwarded HTML attrs)
   - **Variants** — each CVA variant renders the correct CSS classes
   - **Sizes** — each size variant renders correctly
   - **Interactions** — click handlers, onChange, toggle states, keyboard events
   - **Conditional rendering** — elements that show/hide based on props
   - **Accessibility** — proper ARIA attributes, roles, labels
   - **Refs** — forwardRef components pass refs correctly
   - **Composition** — compound components work together
   - **Edge cases** — empty children, missing optional props, disabled states

6. **Common patterns**:

```tsx
// className merging
const { container } = render(<Button className="my-class">Test</Button>);
expect(container.firstChild).toHaveClass("my-class");

// Click handler
const onClick = vi.fn();
render(<Button onClick={onClick}>Click</Button>);
fireEvent.click(screen.getByRole("button"));
expect(onClick).toHaveBeenCalledTimes(1);

// Disabled
const onClick = vi.fn();
render(<Button disabled onClick={onClick}>Click</Button>);
fireEvent.click(screen.getByRole("button"));
expect(onClick).not.toHaveBeenCalled();

// Ref forwarding
const ref = { current: null };
render(<Button ref={ref}>Test</Button>);
expect(ref.current).toBeInstanceOf(HTMLButtonElement);

// Controlled state
const onChange = vi.fn();
render(<Toggle checked={false} onChange={onChange} />);
fireEvent.click(screen.getByRole("switch"));
expect(onChange).toHaveBeenCalledWith(true);
```

7. **Important rules**:
   - Tests MUST use Vitest (`describe`, `it`, `expect`, `vi`) not Jest
   - Tests MUST use `@testing-library/react` for rendering
   - Use `@testing-library/user-event` for complex interactions (typing, etc.)
   - Use `@testing-library/jest-dom` matchers (toBeInTheDocument, toHaveClass, etc.)
   - Do NOT test implementation details — test behavior
   - Each test should be independent — no shared state between tests
   - Use `vi.fn()` for mocks, `vi.useFakeTimers()` for timers

8. **After writing tests**:
   - Run `npm run test` to verify all pass
   - Report: total tests written, pass/fail count

9. **Also remember**: When adding a new component, you must also create its story and registry entry (see sync-docs and sync-registry skills).
