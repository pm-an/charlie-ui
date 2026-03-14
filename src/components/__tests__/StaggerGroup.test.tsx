import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { StaggerGroup } from "../StaggerGroup";
import { AnimationProvider } from "../../animation/AnimationProvider";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  global.IntersectionObserver = class IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: readonly number[] = [];
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn().mockReturnValue([]);
    constructor(_cb: IntersectionObserverCallback, _opts?: IntersectionObserverInit) {}
  } as unknown as typeof globalThis.IntersectionObserver;
});

describe("StaggerGroup", () => {
  it("renders all children", () => {
    render(
      <StaggerGroup>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </StaggerGroup>
    );
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
    expect(screen.getByText("Child 3")).toBeInTheDocument();
  });

  it("applies className to the container", () => {
    const { container } = render(
      <StaggerGroup className="grid gap-4">
        <div>A</div>
        <div>B</div>
      </StaggerGroup>
    );
    expect(container.firstChild).toHaveClass("grid", "gap-4");
  });

  it("applies style to the container", () => {
    const { container } = render(
      <StaggerGroup style={{ padding: "10px" }}>
        <div>Styled</div>
      </StaggerGroup>
    );
    expect(container.firstChild).toHaveStyle({ padding: "10px" });
  });

  it("renders with show=true", () => {
    render(
      <StaggerGroup show={true}>
        <div>Visible</div>
      </StaggerGroup>
    );
    expect(screen.getByText("Visible")).toBeInTheDocument();
  });

  it("does not render children when show=false", () => {
    render(
      <StaggerGroup show={false}>
        <div>Hidden</div>
      </StaggerGroup>
    );
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("transitions from show=true to show=false", () => {
    const { rerender } = render(
      <StaggerGroup show={true}>
        <div>Transition</div>
      </StaggerGroup>
    );
    expect(screen.getByText("Transition")).toBeInTheDocument();

    rerender(
      <StaggerGroup show={false}>
        <div>Transition</div>
      </StaggerGroup>
    );
    return waitFor(() => {
      expect(screen.queryByText("Transition")).not.toBeInTheDocument();
    });
  });

  it("renders with different presets", () => {
    const presetNames = ["fade", "fadeUp", "scale", "pop"] as const;
    for (const preset of presetNames) {
      const { unmount } = render(
        <StaggerGroup preset={preset}>
          <div>{preset}</div>
        </StaggerGroup>
      );
      expect(screen.getByText(preset)).toBeInTheDocument();
      unmount();
    }
  });

  it("accepts stagger as a number", () => {
    render(
      <StaggerGroup stagger={0.2}>
        <div>S1</div>
        <div>S2</div>
      </StaggerGroup>
    );
    expect(screen.getByText("S1")).toBeInTheDocument();
    expect(screen.getByText("S2")).toBeInTheDocument();
  });

  it("accepts duration prop", () => {
    render(
      <StaggerGroup duration="slow">
        <div>Slow</div>
      </StaggerGroup>
    );
    expect(screen.getByText("Slow")).toBeInTheDocument();
  });

  it("accepts easing prop", () => {
    render(
      <StaggerGroup easing="bounce">
        <div>Bounce</div>
      </StaggerGroup>
    );
    expect(screen.getByText("Bounce")).toBeInTheDocument();
  });

  it("renders as a different element", () => {
    const { container } = render(
      <StaggerGroup as="ul">
        <li>Item</li>
      </StaggerGroup>
    );
    expect(container.querySelector("ul")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(
      <StaggerGroup ref={ref}>
        <div>Ref</div>
      </StaggerGroup>
    );
    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLElement);
  });

  it("renders with viewport boolean", () => {
    render(
      <StaggerGroup viewport>
        <div>VP</div>
      </StaggerGroup>
    );
    expect(screen.getByText("VP")).toBeInTheDocument();
  });

  it("renders with viewport object", () => {
    render(
      <StaggerGroup viewport={{ once: true, amount: 0.5 }}>
        <div>VP obj</div>
      </StaggerGroup>
    );
    expect(screen.getByText("VP obj")).toBeInTheDocument();
  });
});

describe("StaggerGroup with disabled provider", () => {
  it("renders children when animations are disabled", () => {
    render(
      <AnimationProvider config={{ enabled: false }}>
        <StaggerGroup preset="fadeUp">
          <div>Disabled 1</div>
          <div>Disabled 2</div>
        </StaggerGroup>
      </AnimationProvider>
    );
    expect(screen.getByText("Disabled 1")).toBeInTheDocument();
    expect(screen.getByText("Disabled 2")).toBeInTheDocument();
  });

  it("show=false hides content when disabled", () => {
    render(
      <AnimationProvider config={{ enabled: false }}>
        <StaggerGroup show={false}>
          <div>Hidden disabled</div>
        </StaggerGroup>
      </AnimationProvider>
    );
    expect(screen.queryByText("Hidden disabled")).not.toBeInTheDocument();
  });
});
