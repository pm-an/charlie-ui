import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Timeline } from "../Timeline";

describe("Timeline", () => {
  it("renders item titles", () => {
    render(
      <Timeline>
        <Timeline.Item title="First event" />
        <Timeline.Item title="Second event" />
      </Timeline>
    );
    expect(screen.getByText("First event")).toBeInTheDocument();
    expect(screen.getByText("Second event")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(
      <Timeline>
        <Timeline.Item title="Event" description="Something happened" />
      </Timeline>
    );
    expect(screen.getByText("Something happened")).toBeInTheDocument();
  });

  it("renders timestamp", () => {
    render(
      <Timeline>
        <Timeline.Item title="Event" timestamp="2 hours ago" />
      </Timeline>
    );
    expect(screen.getByText("2 hours ago")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item title="Event" />
      </Timeline>
    );
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs.length).toBe(0);
  });

  it("does not render timestamp when not provided", () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item title="Event" />
      </Timeline>
    );
    const timestamps = container.querySelectorAll(".text-white\\/30");
    expect(timestamps.length).toBe(0);
  });

  it("shows connector between items but not after the last", () => {
    render(
      <Timeline>
        <Timeline.Item title="First" />
        <Timeline.Item title="Second" />
        <Timeline.Item title="Third" />
      </Timeline>
    );
    const connectors = screen.getAllByTestId("timeline-connector");
    expect(connectors.length).toBe(2);
  });

  it("does not show connector for a single item", () => {
    render(
      <Timeline>
        <Timeline.Item title="Only item" />
      </Timeline>
    );
    expect(screen.queryByTestId("timeline-connector")).not.toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(
      <Timeline>
        <Timeline.Item
          title="With icon"
          icon={<svg data-testid="timeline-icon" />}
        />
      </Timeline>
    );
    expect(screen.getByTestId("timeline-icon")).toBeInTheDocument();
  });

  it("renders dot without icon by default", () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item title="Event" />
      </Timeline>
    );
    const dot = container.querySelector(".h-3.w-3.rounded-full");
    expect(dot).toBeInTheDocument();
  });

  it("renders icon container when icon is provided", () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item
          title="Event"
          icon={<svg data-testid="icon" />}
        />
      </Timeline>
    );
    const iconContainer = container.querySelector(".h-8.w-8.rounded-full");
    expect(iconContainer).toBeInTheDocument();
  });

  it.each(["default", "accent", "green", "red", "blue", "yellow"] as const)(
    "renders %s color variant without error",
    (color) => {
      render(
        <Timeline>
          <Timeline.Item title={`${color} item`} color={color} />
        </Timeline>
      );
      expect(screen.getByText(`${color} item`)).toBeInTheDocument();
    }
  );

  it("applies active styling", () => {
    render(
      <Timeline>
        <Timeline.Item title="Active event" active />
      </Timeline>
    );
    const title = screen.getByText("Active event");
    expect(title).toHaveClass("text-white");
    expect(title).toHaveClass("font-medium");
  });

  it("applies ring to active dot", () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item title="Active" active />
      </Timeline>
    );
    const dot = container.querySelector(".ring-2");
    expect(dot).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <Timeline>
        <Timeline.Item title="Event">
          <div data-testid="child-content">Extra info</div>
        </Timeline.Item>
      </Timeline>
    );
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Extra info")).toBeInTheDocument();
  });

  it("uses left orientation by default", () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item title="Event" />
      </Timeline>
    );
    const item = container.querySelector(".flex.gap-3");
    expect(item).toBeInTheDocument();
    expect(item).not.toHaveClass("flex-row-reverse");
  });

  it("applies right orientation", () => {
    const { container } = render(
      <Timeline orientation="right">
        <Timeline.Item title="Event" />
      </Timeline>
    );
    const item = container.querySelector(".flex-row-reverse");
    expect(item).toBeInTheDocument();
  });

  it("alternates sides in alternate orientation", () => {
    const { container } = render(
      <Timeline orientation="alternate">
        <Timeline.Item title="First" />
        <Timeline.Item title="Second" />
        <Timeline.Item title="Third" />
      </Timeline>
    );
    const items = container.querySelectorAll(":scope > div > div.flex.gap-3");
    // First (index 0) = left, Second (index 1) = right, Third (index 2) = left
    expect(items[0]).not.toHaveClass("flex-row-reverse");
    expect(items[1]).toHaveClass("flex-row-reverse");
    expect(items[2]).not.toHaveClass("flex-row-reverse");
  });

  it("merges custom className on root", () => {
    const { container } = render(
      <Timeline className="custom-timeline">
        <Timeline.Item title="Event" />
      </Timeline>
    );
    expect(container.firstChild).toHaveClass("custom-timeline");
  });

  it("merges custom className on item", () => {
    render(
      <Timeline>
        <Timeline.Item title="Event" className="custom-item" data-testid="item" />
      </Timeline>
    );
    expect(screen.getByTestId("item")).toHaveClass("custom-item");
  });

  it("passes through HTML attributes on root", () => {
    render(
      <Timeline data-testid="timeline-root">
        <Timeline.Item title="Event" />
      </Timeline>
    );
    expect(screen.getByTestId("timeline-root")).toBeInTheDocument();
  });

  it("passes through HTML attributes on item", () => {
    render(
      <Timeline>
        <Timeline.Item title="Event" data-testid="timeline-item" />
      </Timeline>
    );
    expect(screen.getByTestId("timeline-item")).toBeInTheDocument();
  });

  it("forwards ref on root", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(
      <Timeline ref={ref}>
        <Timeline.Item title="Event" />
      </Timeline>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("forwards ref on item", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(
      <Timeline>
        <Timeline.Item ref={ref} title="Event" />
      </Timeline>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
