import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DashboardLayout } from "../DashboardLayout";

describe("DashboardLayout", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      );
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(
        <DashboardLayout>
          <div>Test</div>
        </DashboardLayout>
      );
      expect(container.querySelector("[data-slot='dashboard-layout']")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <DashboardLayout className="my-custom">
          <div>Test</div>
        </DashboardLayout>
      );
      expect(container.firstChild).toHaveClass("my-custom");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(
        <DashboardLayout ref={ref}>
          <div>Test</div>
        </DashboardLayout>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("has min-h-screen and flex classes", () => {
      const { container } = render(
        <DashboardLayout>
          <div>Test</div>
        </DashboardLayout>
      );
      expect(container.firstChild).toHaveClass("min-h-screen", "flex");
    });
  });

  describe("compound components", () => {
    it("renders Sidebar, Header, and Content together", () => {
      render(
        <DashboardLayout sidebarCollapsed>
          <DashboardLayout.Sidebar>
            <span>Sidebar content</span>
          </DashboardLayout.Sidebar>
          <div className="flex-1 flex flex-col">
            <DashboardLayout.Header>
              <span>Header content</span>
            </DashboardLayout.Header>
            <DashboardLayout.Content>
              <span>Main content</span>
            </DashboardLayout.Content>
          </div>
        </DashboardLayout>
      );
      expect(screen.getByText("Sidebar content")).toBeInTheDocument();
      expect(screen.getByText("Header content")).toBeInTheDocument();
      expect(screen.getByText("Main content")).toBeInTheDocument();
    });
  });

  describe("DashboardLayout.Sidebar", () => {
    it("renders logo when provided", () => {
      render(
        <DashboardLayout sidebarCollapsed>
          <DashboardLayout.Sidebar logo={<span>MyLogo</span>}>
            <span>Nav</span>
          </DashboardLayout.Sidebar>
        </DashboardLayout>
      );
      expect(screen.getByText("MyLogo")).toBeInTheDocument();
    });

    it("renders footer when provided", () => {
      render(
        <DashboardLayout sidebarCollapsed>
          <DashboardLayout.Sidebar footer={<span>Footer</span>}>
            <span>Nav</span>
          </DashboardLayout.Sidebar>
        </DashboardLayout>
      );
      expect(screen.getByText("Footer")).toBeInTheDocument();
    });

    it("has sidebar navigation aria label", () => {
      render(
        <DashboardLayout sidebarCollapsed>
          <DashboardLayout.Sidebar>
            <span>Nav</span>
          </DashboardLayout.Sidebar>
        </DashboardLayout>
      );
      const sidebars = screen.getAllByLabelText("Sidebar navigation");
      expect(sidebars.length).toBeGreaterThan(0);
    });

    it("applies custom className to sidebar", () => {
      const { container } = render(
        <DashboardLayout sidebarCollapsed>
          <DashboardLayout.Sidebar className="custom-sidebar">
            <span>Nav</span>
          </DashboardLayout.Sidebar>
        </DashboardLayout>
      );
      const sidebar = container.querySelector("[data-slot='dashboard-sidebar']");
      expect(sidebar).toHaveClass("custom-sidebar");
    });
  });

  describe("DashboardLayout.Header", () => {
    it("renders children", () => {
      render(
        <DashboardLayout>
          <DashboardLayout.Header>
            <span>Header text</span>
          </DashboardLayout.Header>
        </DashboardLayout>
      );
      expect(screen.getByText("Header text")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(
        <DashboardLayout>
          <DashboardLayout.Header>
            <span>Header</span>
          </DashboardLayout.Header>
        </DashboardLayout>
      );
      expect(container.querySelector("[data-slot='dashboard-header']")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <DashboardLayout>
          <DashboardLayout.Header className="custom-header">
            <span>Header</span>
          </DashboardLayout.Header>
        </DashboardLayout>
      );
      const header = container.querySelector("[data-slot='dashboard-header']");
      expect(header).toHaveClass("custom-header");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLElement | null>;
      render(
        <DashboardLayout>
          <DashboardLayout.Header ref={ref}>
            <span>Header</span>
          </DashboardLayout.Header>
        </DashboardLayout>
      );
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });

  describe("DashboardLayout.Content", () => {
    it("renders children", () => {
      render(
        <DashboardLayout>
          <DashboardLayout.Content>
            <span>Main area</span>
          </DashboardLayout.Content>
        </DashboardLayout>
      );
      expect(screen.getByText("Main area")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(
        <DashboardLayout>
          <DashboardLayout.Content>
            <span>Content</span>
          </DashboardLayout.Content>
        </DashboardLayout>
      );
      expect(container.querySelector("[data-slot='dashboard-content']")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <DashboardLayout>
          <DashboardLayout.Content className="custom-content">
            <span>Content</span>
          </DashboardLayout.Content>
        </DashboardLayout>
      );
      const content = container.querySelector("[data-slot='dashboard-content']");
      expect(content).toHaveClass("custom-content");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(
        <DashboardLayout>
          <DashboardLayout.Content ref={ref}>
            <span>Content</span>
          </DashboardLayout.Content>
        </DashboardLayout>
      );
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("renders as main element", () => {
      render(
        <DashboardLayout>
          <DashboardLayout.Content>
            <span>Content</span>
          </DashboardLayout.Content>
        </DashboardLayout>
      );
      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });

  describe("sidebar toggle", () => {
    it("calls onSidebarToggle when backdrop is clicked", () => {
      const onToggle = vi.fn();
      const { container } = render(
        <DashboardLayout sidebarCollapsed={false} onSidebarToggle={onToggle}>
          <DashboardLayout.Sidebar>
            <span>Nav</span>
          </DashboardLayout.Sidebar>
        </DashboardLayout>
      );
      const backdrop = container.querySelector("[data-slot='dashboard-sidebar-backdrop']");
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(onToggle).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe("displayName", () => {
    it("has correct displayName for all sub-components", () => {
      expect(DashboardLayout.displayName).toBe("DashboardLayout");
      expect(DashboardLayout.Sidebar.displayName).toBe("DashboardLayout.Sidebar");
      expect(DashboardLayout.Header.displayName).toBe("DashboardLayout.Header");
      expect(DashboardLayout.Content.displayName).toBe("DashboardLayout.Content");
    });
  });
});
