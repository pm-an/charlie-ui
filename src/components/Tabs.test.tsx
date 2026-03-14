import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Tabs } from "./Tabs";

describe("Tabs", () => {
  const items = [
    { label: "Overview", value: "overview" },
    { label: "Features", value: "features" },
    { label: "Pricing", value: "pricing" },
  ];

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
    const tabs = screen.getAllByRole("tab");
    const featuresTab = tabs.find((t) => t.textContent?.includes("Features"));
    expect(featuresTab).toHaveAttribute("aria-selected", "true");
  });

  it("marks inactive tabs as not selected", () => {
    render(<Tabs items={items} value="features" onChange={() => {}} />);
    const tabs = screen.getAllByRole("tab");
    const overviewTab = tabs.find((t) => t.textContent?.includes("Overview"));
    expect(overviewTab).toHaveAttribute("aria-selected", "false");
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
      render(<Tabs items={items} value="overview" onChange={() => {}} variant={variant} />);
      expect(screen.getByRole("tablist")).toBeInTheDocument();
    }
  );

  it("renders badges on tab items", () => {
    const itemsWithBadge = [
      { label: "New", value: "new", badge: "3" },
    ];
    render(<Tabs items={itemsWithBadge} value="new" onChange={() => {}} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(<Tabs items={items} value="overview" onChange={() => {}} className="custom" />);
    expect(screen.getByRole("tablist")).toHaveClass("custom");
  });

  it("works in uncontrolled mode with defaultValue", () => {
    render(<Tabs items={items} defaultValue="features" />);
    const tabs = screen.getAllByRole("tab");
    const featuresTab = tabs.find((t) => t.textContent?.includes("Features"));
    expect(featuresTab).toHaveAttribute("aria-selected", "true");
  });

  it("defaults to first item when no value or defaultValue", () => {
    render(<Tabs items={items} />);
    const tabs = screen.getAllByRole("tab");
    const overviewTab = tabs.find((t) => t.textContent?.includes("Overview"));
    expect(overviewTab).toHaveAttribute("aria-selected", "true");
  });

  it("switches tabs in uncontrolled mode", async () => {
    const user = userEvent.setup();
    render(<Tabs items={items} defaultValue="overview" />);
    await user.click(screen.getByText("Pricing"));
    const pricingTab = screen.getAllByRole("tab").find((t) => t.textContent?.includes("Pricing"));
    expect(pricingTab).toHaveAttribute("aria-selected", "true");
  });

  it("calls onChange in uncontrolled mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs items={items} defaultValue="overview" onChange={onChange} />);
    await user.click(screen.getByText("Pricing"));
    expect(onChange).toHaveBeenCalledWith("pricing");
  });

  it("has data-state on tab buttons", () => {
    render(<Tabs items={items} value="overview" onChange={() => {}} />);
    const tabs = screen.getAllByRole("tab");
    const activeTab = tabs.find((t) => t.textContent?.includes("Overview"));
    const inactiveTab = tabs.find((t) => t.textContent?.includes("Features"));
    expect(activeTab).toHaveAttribute("data-state", "active");
    expect(inactiveTab).toHaveAttribute("data-state", "inactive");
  });

  it("has data-slot on tablist", () => {
    render(<Tabs items={items} value="overview" onChange={() => {}} />);
    expect(screen.getByRole("tablist")).toHaveAttribute("data-slot", "tabs");
  });
});
