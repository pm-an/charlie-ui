import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ResizablePanels } from "../ResizablePanels";

describe("ResizablePanels", () => {
  it("renders PanelGroup with panels", () => {
    render(
      <ResizablePanels direction="horizontal">
        <ResizablePanels.Panel defaultSize={50}>
          <div>Panel One</div>
        </ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel defaultSize={50}>
          <div>Panel Two</div>
        </ResizablePanels.Panel>
      </ResizablePanels>
    );
    expect(screen.getByText("Panel One")).toBeInTheDocument();
    expect(screen.getByText("Panel Two")).toBeInTheDocument();
  });

  it("renders handle between panels", () => {
    const { container } = render(
      <ResizablePanels direction="horizontal">
        <ResizablePanels.Panel defaultSize={50}>
          <div>Left</div>
        </ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel defaultSize={50}>
          <div>Right</div>
        </ResizablePanels.Panel>
      </ResizablePanels>
    );
    const handle = container.querySelector("[data-panel-resize-handle-id]");
    expect(handle).toBeInTheDocument();
  });

  it("renders with withHandle grip", () => {
    const { container } = render(
      <ResizablePanels direction="horizontal">
        <ResizablePanels.Panel defaultSize={50}>
          <div>Left</div>
        </ResizablePanels.Panel>
        <ResizablePanels.Handle withHandle />
        <ResizablePanels.Panel defaultSize={50}>
          <div>Right</div>
        </ResizablePanels.Panel>
      </ResizablePanels>
    );
    // When withHandle is true, the grip icon SVG should be rendered
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  it("applies className to root", () => {
    const { container } = render(
      <ResizablePanels direction="horizontal" className="custom-root">
        <ResizablePanels.Panel defaultSize={100}>
          <div>Content</div>
        </ResizablePanels.Panel>
      </ResizablePanels>
    );
    const root = container.querySelector("[data-panel-group]");
    expect(root).toHaveClass("custom-root");
  });

  it("applies className to panel", () => {
    const { container } = render(
      <ResizablePanels direction="horizontal">
        <ResizablePanels.Panel defaultSize={100} className="custom-panel">
          <div>Content</div>
        </ResizablePanels.Panel>
      </ResizablePanels>
    );
    const panel = container.querySelector("[data-panel]");
    expect(panel).toHaveClass("custom-panel");
  });

  it("applies className to handle", () => {
    const { container } = render(
      <ResizablePanels direction="horizontal">
        <ResizablePanels.Panel defaultSize={50}>
          <div>Left</div>
        </ResizablePanels.Panel>
        <ResizablePanels.Handle className="custom-handle" />
        <ResizablePanels.Panel defaultSize={50}>
          <div>Right</div>
        </ResizablePanels.Panel>
      </ResizablePanels>
    );
    const handle = container.querySelector("[data-panel-resize-handle-id]");
    expect(handle).toHaveClass("custom-handle");
  });

  it("renders three panels with two handles", () => {
    const { container } = render(
      <ResizablePanels direction="horizontal">
        <ResizablePanels.Panel defaultSize={33}>
          <div>Panel A</div>
        </ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel defaultSize={34}>
          <div>Panel B</div>
        </ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel defaultSize={33}>
          <div>Panel C</div>
        </ResizablePanels.Panel>
      </ResizablePanels>
    );
    expect(screen.getByText("Panel A")).toBeInTheDocument();
    expect(screen.getByText("Panel B")).toBeInTheDocument();
    expect(screen.getByText("Panel C")).toBeInTheDocument();
    const handles = container.querySelectorAll(
      "[data-panel-resize-handle-id]"
    );
    expect(handles).toHaveLength(2);
  });

  it("supports vertical direction", () => {
    const { container } = render(
      <ResizablePanels direction="vertical">
        <ResizablePanels.Panel defaultSize={50}>
          <div>Top</div>
        </ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel defaultSize={50}>
          <div>Bottom</div>
        </ResizablePanels.Panel>
      </ResizablePanels>
    );
    const root = container.querySelector("[data-panel-group]");
    expect(root).toHaveAttribute("data-panel-group-direction", "vertical");
    expect(screen.getByText("Top")).toBeInTheDocument();
    expect(screen.getByText("Bottom")).toBeInTheDocument();
  });

  it("panel has overflow-auto class", () => {
    const { container } = render(
      <ResizablePanels direction="horizontal">
        <ResizablePanels.Panel defaultSize={100}>
          <div>Content</div>
        </ResizablePanels.Panel>
      </ResizablePanels>
    );
    const panel = container.querySelector("[data-panel]");
    expect(panel).toHaveClass("overflow-auto");
  });

  it("has correct displayName values", () => {
    expect(ResizablePanels.displayName).toBe("ResizablePanels");
    expect(ResizablePanels.Panel.displayName).toBe("ResizablePanels.Panel");
    expect(ResizablePanels.Handle.displayName).toBe("ResizablePanels.Handle");
  });

  it("exposes compound component structure", () => {
    expect(ResizablePanels.Panel).toBeDefined();
    expect(ResizablePanels.Handle).toBeDefined();
    expect(typeof ResizablePanels.Panel).toBe("function");
    expect(typeof ResizablePanels.Handle).toBe("function");
  });
});
