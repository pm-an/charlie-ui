import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Tabs } from "../Tabs";
import { expectNoA11yViolations } from "../../test/a11y";

describe("Tabs", () => {
  const items = [
    { label: "Overview", value: "overview" },
    { label: "Features", value: "features" },
    { label: "Pricing", value: "pricing" },
  ];

  // --- Rendering ---

  it("renders as a tablist", () => {
    render(<Tabs items={items} value="overview" onChange={() => {}} />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("renders all tab items", () => {
    render(<Tabs items={items} value="overview" onChange={() => {}} />);
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
  });

  it("marks active tab as selected", () => {
    render(<Tabs items={items} value="features" onChange={() => {}} />);
    expect(screen.getByRole("tab", { name: /Features/ })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("marks inactive tabs as not selected", () => {
    render(<Tabs items={items} value="features" onChange={() => {}} />);
    expect(screen.getByRole("tab", { name: /Overview/ })).toHaveAttribute(
      "aria-selected",
      "false"
    );
    expect(screen.getByRole("tab", { name: /Pricing/ })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("calls onChange when a tab is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs items={items} value="overview" onChange={onChange} />);
    await user.click(screen.getByText("Pricing"));
    expect(onChange).toHaveBeenCalledWith("pricing");
  });

  it.each(["pills", "underline", "segment"] as const)(
    "renders %s variant",
    (variant) => {
      render(
        <Tabs
          items={items}
          value="overview"
          onChange={() => {}}
          variant={variant}
        />
      );
      expect(screen.getByRole("tablist")).toBeInTheDocument();
    }
  );

  it("renders badges on tab items", () => {
    const itemsWithBadge = [
      { label: "New", value: "new", badge: "3" },
    ];
    render(
      <Tabs items={itemsWithBadge} value="new" onChange={() => {}} />
    );
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(
      <Tabs
        items={items}
        value="overview"
        onChange={() => {}}
        className="custom"
      />
    );
    expect(screen.getByRole("tablist")).toHaveClass("custom");
  });

  it("works in uncontrolled mode with defaultValue", () => {
    render(<Tabs items={items} defaultValue="features" />);
    expect(screen.getByRole("tab", { name: /Features/ })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("defaults to first item when no value or defaultValue", () => {
    render(<Tabs items={items} />);
    expect(screen.getByRole("tab", { name: /Overview/ })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("switches tabs in uncontrolled mode", async () => {
    const user = userEvent.setup();
    render(<Tabs items={items} defaultValue="overview" />);
    await user.click(screen.getByText("Pricing"));
    expect(screen.getByRole("tab", { name: /Pricing/ })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("calls onChange in uncontrolled mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Tabs items={items} defaultValue="overview" onChange={onChange} />
    );
    await user.click(screen.getByText("Pricing"));
    expect(onChange).toHaveBeenCalledWith("pricing");
  });

  it("has data-state on tab buttons", () => {
    render(<Tabs items={items} value="overview" onChange={() => {}} />);
    expect(screen.getByRole("tab", { name: /Overview/ })).toHaveAttribute(
      "data-state",
      "active"
    );
    expect(screen.getByRole("tab", { name: /Features/ })).toHaveAttribute(
      "data-state",
      "inactive"
    );
  });

  it("has data-slot on tablist", () => {
    render(<Tabs items={items} value="overview" onChange={() => {}} />);
    expect(screen.getByRole("tablist")).toHaveAttribute("data-slot", "tabs");
  });

  // --- Roving tabindex ---

  it("only active tab has tabIndex 0, others have -1", () => {
    render(<Tabs items={items} value="features" onChange={() => {}} />);
    expect(screen.getByRole("tab", { name: /Overview/ })).toHaveAttribute(
      "tabindex",
      "-1"
    );
    expect(screen.getByRole("tab", { name: /Features/ })).toHaveAttribute(
      "tabindex",
      "0"
    );
    expect(screen.getByRole("tab", { name: /Pricing/ })).toHaveAttribute(
      "tabindex",
      "-1"
    );
  });

  // --- Keyboard navigation ---

  it("navigates to next tab with ArrowRight", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs items={items} value="overview" onChange={onChange} />);
    const firstTab = screen.getByRole("tab", { name: /Overview/ });
    firstTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith("features");
  });

  it("navigates to previous tab with ArrowLeft", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs items={items} value="features" onChange={onChange} />);
    const tab = screen.getByRole("tab", { name: /Features/ });
    tab.focus();
    await user.keyboard("{ArrowLeft}");
    expect(onChange).toHaveBeenCalledWith("overview");
  });

  it("wraps around with ArrowRight on last tab", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs items={items} value="pricing" onChange={onChange} />);
    const tab = screen.getByRole("tab", { name: /Pricing/ });
    tab.focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith("overview");
  });

  it("wraps around with ArrowLeft on first tab", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs items={items} value="overview" onChange={onChange} />);
    const tab = screen.getByRole("tab", { name: /Overview/ });
    tab.focus();
    await user.keyboard("{ArrowLeft}");
    expect(onChange).toHaveBeenCalledWith("pricing");
  });

  it("navigates to first tab with Home", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs items={items} value="pricing" onChange={onChange} />);
    const tab = screen.getByRole("tab", { name: /Pricing/ });
    tab.focus();
    await user.keyboard("{Home}");
    expect(onChange).toHaveBeenCalledWith("overview");
  });

  it("navigates to last tab with End", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs items={items} value="overview" onChange={onChange} />);
    const tab = screen.getByRole("tab", { name: /Overview/ });
    tab.focus();
    await user.keyboard("{End}");
    expect(onChange).toHaveBeenCalledWith("pricing");
  });

  // --- ARIA: tab ↔ panel linking ---

  it("tabs have aria-controls pointing to panel IDs", () => {
    render(
      <Tabs items={items} value="overview" onChange={() => {}}>
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
        <Tabs.Panel value="features">Features content</Tabs.Panel>
      </Tabs>
    );
    const overviewTab = screen.getByRole("tab", { name: /Overview/ });
    const panelId = overviewTab.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    // The active panel should exist with matching id
    const panel = screen.getByRole("tabpanel");
    expect(panel.id).toBe(panelId);
  });

  it("panel has aria-labelledby pointing to tab ID", () => {
    render(
      <Tabs items={items} value="overview" onChange={() => {}}>
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      </Tabs>
    );
    const tab = screen.getByRole("tab", { name: /Overview/ });
    const panel = screen.getByRole("tabpanel");
    expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
  });

  it("panel has tabIndex 0 for keyboard access", () => {
    render(
      <Tabs items={items} value="overview" onChange={() => {}}>
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      </Tabs>
    );
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("tabindex", "0");
  });

  // --- Tabs.Panel ---

  it("only renders the active panel", () => {
    render(
      <Tabs items={items} value="overview" onChange={() => {}}>
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
        <Tabs.Panel value="features">Features content</Tabs.Panel>
        <Tabs.Panel value="pricing">Pricing content</Tabs.Panel>
      </Tabs>
    );
    expect(screen.getByText("Overview content")).toBeInTheDocument();
    expect(screen.queryByText("Features content")).not.toBeInTheDocument();
    expect(screen.queryByText("Pricing content")).not.toBeInTheDocument();
  });

  it("switches panel when tab changes", async () => {
    const user = userEvent.setup();
    function TestTabs() {
      const [value, setValue] = React.useState("overview");
      return (
        <Tabs items={items} value={value} onChange={setValue}>
          <Tabs.Panel value="overview">Overview content</Tabs.Panel>
          <Tabs.Panel value="features">Features content</Tabs.Panel>
        </Tabs>
      );
    }
    render(<TestTabs />);
    expect(screen.getByText("Overview content")).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: /Features/ }));
    expect(screen.getByText("Features content")).toBeInTheDocument();
    expect(screen.queryByText("Overview content")).not.toBeInTheDocument();
  });

  it("panel has data-slot attribute", () => {
    render(
      <Tabs items={items} value="overview" onChange={() => {}}>
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      </Tabs>
    );
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "data-slot",
      "tabs-panel"
    );
  });

  // --- Accessibility (axe) ---

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Tabs items={items} value="overview" onChange={() => {}}>
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
        <Tabs.Panel value="features">Features content</Tabs.Panel>
        <Tabs.Panel value="pricing">Pricing content</Tabs.Panel>
      </Tabs>
    );
    await expectNoA11yViolations(container);
  });

  it("has no accessibility violations with underline variant", async () => {
    const { container } = render(
      <Tabs items={items} value="features" onChange={() => {}} variant="underline">
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
        <Tabs.Panel value="features">Features content</Tabs.Panel>
      </Tabs>
    );
    await expectNoA11yViolations(container);
  });
});
