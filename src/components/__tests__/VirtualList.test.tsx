import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { VirtualList } from "../VirtualList";

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, i) => ({ id: i, label: `Item ${i}` }));

const defaultRender = (item: { id: number; label: string }) => (
  <span>{item.label}</span>
);

describe("VirtualList", () => {
  it("renders container with correct height (number)", () => {
    const { container } = render(
      <VirtualList
        items={makeItems(100)}
        height={400}
        itemHeight={40}
        renderItem={defaultRender}
      />
    );
    expect(container.firstChild).toHaveStyle({ height: "400px" });
  });

  it("renders container with correct height (string)", () => {
    const { container } = render(
      <VirtualList
        items={makeItems(100)}
        height="50vh"
        itemHeight={40}
        renderItem={defaultRender}
      />
    );
    expect(container.firstChild).toHaveStyle({ height: "50vh" });
  });

  it("only renders visible items plus overscan, not all items", () => {
    render(
      <VirtualList
        items={makeItems(10_000)}
        height={400}
        itemHeight={40}
        overscan={5}
        renderItem={defaultRender}
      />
    );
    // With height=400 and itemHeight=40, visible = 10 items + 5 overscan below
    // startIndex = max(0, floor(0/40) - 5) = 0, endIndex = min(10000, ceil(400/40) + 5) = 15
    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBeLessThan(100);
    expect(listItems.length).toBeGreaterThan(0);
  });

  it("renders items via renderItem callback", () => {
    render(
      <VirtualList
        items={makeItems(10)}
        height={400}
        itemHeight={40}
        renderItem={(item) => <span data-testid={`item-${item.id}`}>{item.label}</span>}
      />
    );
    expect(screen.getByText("Item 0")).toBeInTheDocument();
    expect(screen.getByTestId("item-0")).toBeInTheDocument();
  });

  it("shows default empty state when items is empty", () => {
    render(
      <VirtualList
        items={[]}
        height={300}
        itemHeight={40}
        renderItem={defaultRender}
      />
    );
    expect(screen.getByText("No items")).toBeInTheDocument();
  });

  it("shows custom emptyContent when items is empty", () => {
    render(
      <VirtualList
        items={[]}
        height={300}
        itemHeight={40}
        renderItem={defaultRender}
        emptyContent={<span>Nothing here</span>}
      />
    );
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.queryByText("No items")).not.toBeInTheDocument();
  });

  it("shows loading indicator when loading is true", () => {
    const { container } = render(
      <VirtualList
        items={makeItems(5)}
        height={400}
        itemHeight={40}
        renderItem={defaultRender}
        loading
      />
    );
    // Default loading spinner is a div with animate-spin
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("shows custom loadingContent when provided", () => {
    render(
      <VirtualList
        items={makeItems(5)}
        height={400}
        itemHeight={40}
        renderItem={defaultRender}
        loading
        loadingContent={<span>Loading more...</span>}
      />
    );
    expect(screen.getByText("Loading more...")).toBeInTheDocument();
  });

  it("does not show loading indicator when loading is false", () => {
    const { container } = render(
      <VirtualList
        items={makeItems(5)}
        height={400}
        itemHeight={40}
        renderItem={defaultRender}
        loading={false}
      />
    );
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).not.toBeInTheDocument();
  });

  it("uses getItemKey for stable keys", () => {
    const getItemKey = vi.fn(
      (item: { id: number; label: string }, index: number) => `key-${item.id}`
    );
    render(
      <VirtualList
        items={makeItems(10)}
        height={400}
        itemHeight={40}
        renderItem={defaultRender}
        getItemKey={getItemKey}
      />
    );
    expect(getItemKey).toHaveBeenCalled();
    // Should be called with item and index
    expect(getItemKey).toHaveBeenCalledWith(
      expect.objectContaining({ id: 0, label: "Item 0" }),
      0
    );
  });

  it("has role='list' on the container", () => {
    render(
      <VirtualList
        items={makeItems(5)}
        height={400}
        itemHeight={40}
        renderItem={defaultRender}
      />
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("has role='listitem' on each visible item wrapper", () => {
    render(
      <VirtualList
        items={makeItems(5)}
        height={400}
        itemHeight={40}
        renderItem={defaultRender}
      />
    );
    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBe(5);
  });

  it("has role='list' on empty state container", () => {
    render(
      <VirtualList
        items={[]}
        height={300}
        itemHeight={40}
        renderItem={defaultRender}
      />
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(
      <VirtualList
        items={makeItems(5)}
        height={400}
        itemHeight={40}
        renderItem={defaultRender}
        className="my-custom-class"
      />
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
    expect(container.firstChild).toHaveClass("overflow-auto");
  });

  it("merges custom className on empty state", () => {
    const { container } = render(
      <VirtualList
        items={[]}
        height={300}
        itemHeight={40}
        renderItem={defaultRender}
        className="empty-custom"
      />
    );
    expect(container.firstChild).toHaveClass("empty-custom");
  });

  it("passes HTML attributes to the container", () => {
    render(
      <VirtualList
        items={makeItems(5)}
        height={400}
        itemHeight={40}
        renderItem={defaultRender}
        data-testid="virtual-list"
        aria-label="User list"
      />
    );
    expect(screen.getByTestId("virtual-list")).toBeInTheDocument();
    expect(screen.getByLabelText("User list")).toBeInTheDocument();
  });

  it("applies scrollbar styling classes", () => {
    const { container } = render(
      <VirtualList
        items={makeItems(5)}
        height={400}
        itemHeight={40}
        renderItem={defaultRender}
      />
    );
    expect(container.firstChild).toHaveClass("[&::-webkit-scrollbar]:w-1.5");
    expect(container.firstChild).toHaveClass(
      "[&::-webkit-scrollbar-track]:bg-transparent"
    );
    expect(container.firstChild).toHaveClass(
      "[&::-webkit-scrollbar-thumb]:bg-white/10"
    );
    expect(container.firstChild).toHaveClass(
      "[&::-webkit-scrollbar-thumb]:rounded-full"
    );
    expect(container.firstChild).toHaveClass(
      "[&::-webkit-scrollbar-thumb:hover]:bg-white/20"
    );
  });

  it("sets total inner height to items.length * itemHeight", () => {
    const items = makeItems(500);
    const itemHeight = 40;
    const { container } = render(
      <VirtualList
        items={items}
        height={400}
        itemHeight={itemHeight}
        renderItem={defaultRender}
      />
    );
    // The first child of the scrollable container is the spacer div
    const scrollContainer = container.firstChild as HTMLElement;
    const spacer = scrollContainer.firstChild as HTMLElement;
    expect(spacer).toHaveStyle({ height: `${500 * 40}px` });
  });

  it("each listitem wrapper has the correct itemHeight", () => {
    render(
      <VirtualList
        items={makeItems(5)}
        height={400}
        itemHeight={50}
        renderItem={defaultRender}
      />
    );
    const listItems = screen.getAllByRole("listitem");
    listItems.forEach((item) => {
      expect(item).toHaveStyle({ height: "50px" });
    });
  });

  it("passes index to renderItem", () => {
    const renderItem = vi.fn(
      (item: { id: number; label: string }, index: number) => (
        <span>
          {index}: {item.label}
        </span>
      )
    );
    render(
      <VirtualList
        items={makeItems(3)}
        height={400}
        itemHeight={40}
        renderItem={renderItem}
      />
    );
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: 0 }),
      0
    );
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 }),
      1
    );
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: 2 }),
      2
    );
  });

  it("calls onEndReached when scrolled near the bottom", () => {
    const onEndReached = vi.fn();
    const items = makeItems(100);
    const { container } = render(
      <VirtualList
        items={items}
        height={400}
        itemHeight={40}
        renderItem={defaultRender}
        onEndReached={onEndReached}
        endReachedThreshold={200}
      />
    );
    const scrollContainer = container.firstChild as HTMLElement;

    // Mock clientHeight for scroll calculations
    Object.defineProperty(scrollContainer, "clientHeight", { value: 400 });

    // Scroll near the bottom: totalHeight = 4000, scrollTop + clientHeight should be within 200 of totalHeight
    // distanceFromBottom = 4000 - (3700 + 400) = -100 < 200, so should fire
    fireEvent.scroll(scrollContainer, { target: { scrollTop: 3700 } });
    expect(onEndReached).toHaveBeenCalled();
  });

  it("merges custom style with height", () => {
    const { container } = render(
      <VirtualList
        items={makeItems(5)}
        height={400}
        itemHeight={40}
        renderItem={defaultRender}
        style={{ padding: "8px" }}
      />
    );
    expect(container.firstChild).toHaveStyle({
      height: "400px",
      padding: "8px",
    });
  });
});
