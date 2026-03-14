import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Sidebar } from "../Sidebar";

describe("Sidebar", () => {
  describe("rendering", () => {
    it("renders as an aside element", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Home" />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByRole("complementary")).toBeInTheDocument();
    });

    it("renders with aria-label for accessibility", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Home" />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByLabelText("Sidebar navigation")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <Sidebar className="custom-sidebar">
          <Sidebar.Content>
            <Sidebar.Item label="Home" />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByLabelText("Sidebar navigation")).toHaveClass(
        "custom-sidebar"
      );
    });
  });

  describe("items", () => {
    it("renders items with labels", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Dashboard" />
            <Sidebar.Item label="Settings" />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("renders items with icons", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item
              icon={<span data-testid="home-icon">H</span>}
              label="Home"
            />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByTestId("home-icon")).toBeInTheDocument();
    });

    it("renders item as button with menuitem role by default", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Home" />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByRole("menuitem")).toBeInTheDocument();
    });

    it("calls onClick when item is clicked", () => {
      const onClick = vi.fn();
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Home" onClick={onClick} />
          </Sidebar.Content>
        </Sidebar>
      );
      fireEvent.click(screen.getByText("Home"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("active state", () => {
    it("applies active styling classes", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Home" active />
          </Sidebar.Content>
        </Sidebar>
      );
      const item = screen.getByRole("menuitem");
      expect(item).toHaveClass("bg-white/5");
      expect(item).toHaveClass("text-white");
      expect(item).toHaveClass("font-medium");
    });

    it("sets aria-current=page on active item", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Home" active />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByRole("menuitem")).toHaveAttribute(
        "aria-current",
        "page"
      );
    });

    it("does not set aria-current on inactive item", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Home" />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByRole("menuitem")).not.toHaveAttribute("aria-current");
    });
  });

  describe("collapsed mode", () => {
    it("hides labels when collapsed", () => {
      render(
        <Sidebar collapsed>
          <Sidebar.Content>
            <Sidebar.Item
              icon={<span data-testid="icon">I</span>}
              label="Home"
            />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.queryByText("Home")).not.toBeInTheDocument();
    });

    it("still renders icons when collapsed", () => {
      render(
        <Sidebar collapsed>
          <Sidebar.Content>
            <Sidebar.Item
              icon={<span data-testid="icon">I</span>}
              label="Home"
            />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("sets title attribute on items when collapsed for tooltip", () => {
      render(
        <Sidebar collapsed>
          <Sidebar.Content>
            <Sidebar.Item label="Dashboard" />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByRole("menuitem")).toHaveAttribute(
        "title",
        "Dashboard"
      );
    });

    it("hides badges when collapsed", () => {
      render(
        <Sidebar collapsed>
          <Sidebar.Content>
            <Sidebar.Item label="Inbox" badge={5} />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.queryByText("5")).not.toBeInTheDocument();
    });

    it("hides group labels when collapsed", () => {
      render(
        <Sidebar collapsed>
          <Sidebar.Content>
            <Sidebar.Group label="Navigation">
              <Sidebar.Item label="Home" />
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.queryByText("Navigation")).not.toBeInTheDocument();
    });
  });

  describe("groups", () => {
    it("renders group label", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Group label="Main Menu">
              <Sidebar.Item label="Home" />
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByText("Main Menu")).toBeInTheDocument();
    });

    it("renders group without label", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.Item label="Home" />
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByText("Home")).toBeInTheDocument();
    });

    it("applies custom className to group", () => {
      const { container } = render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Group label="Nav" className="custom-group">
              <Sidebar.Item label="Home" />
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar>
      );
      const group = container.querySelector(".custom-group");
      expect(group).toBeInTheDocument();
    });
  });

  describe("header, footer, separator", () => {
    it("renders header content", () => {
      render(
        <Sidebar>
          <Sidebar.Header>
            <span>My App</span>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Item label="Home" />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByText("My App")).toBeInTheDocument();
    });

    it("applies custom className to header", () => {
      const { container } = render(
        <Sidebar>
          <Sidebar.Header className="custom-header">
            <span>Logo</span>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Item label="Home" />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(container.querySelector(".custom-header")).toBeInTheDocument();
    });

    it("renders footer content", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Home" />
          </Sidebar.Content>
          <Sidebar.Footer>
            <span>Footer text</span>
          </Sidebar.Footer>
        </Sidebar>
      );
      expect(screen.getByText("Footer text")).toBeInTheDocument();
    });

    it("applies custom className to footer", () => {
      const { container } = render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Home" />
          </Sidebar.Content>
          <Sidebar.Footer className="custom-footer">
            <span>Footer</span>
          </Sidebar.Footer>
        </Sidebar>
      );
      expect(container.querySelector(".custom-footer")).toBeInTheDocument();
    });

    it("renders separator with separator role", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Home" />
            <Sidebar.Separator />
            <Sidebar.Item label="Settings" />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByRole("separator")).toBeInTheDocument();
    });

    it("applies custom className to separator", () => {
      const { container } = render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Separator className="custom-sep" />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(container.querySelector(".custom-sep")).toBeInTheDocument();
    });
  });

  describe("badges", () => {
    it("renders badge with number", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Inbox" badge={42} />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("renders badge with string", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Notifications" badge="99+" />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByText("99+")).toBeInTheDocument();
    });

    it("does not render badge when not provided", () => {
      const { container } = render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Home" />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(container.querySelector(".rounded-full")).not.toBeInTheDocument();
    });
  });

  describe("disabled state", () => {
    it("renders disabled item with disabled attribute", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Locked" disabled />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByRole("menuitem")).toBeDisabled();
    });

    it("applies disabled styling classes", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Locked" disabled />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByRole("menuitem")).toHaveClass("opacity-40");
      expect(screen.getByRole("menuitem")).toHaveClass("cursor-not-allowed");
    });

    it("does not call onClick when disabled", () => {
      const onClick = vi.fn();
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Locked" disabled onClick={onClick} />
          </Sidebar.Content>
        </Sidebar>
      );
      fireEvent.click(screen.getByRole("menuitem"));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("href rendering", () => {
    it("renders as an anchor when href is provided", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Docs" href="/docs" />
          </Sidebar.Content>
        </Sidebar>
      );
      const link = screen.getByRole("link", { name: "Docs" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/docs");
    });

    it("renders as a button when href is not provided", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Home" />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByRole("menuitem")).toBeInTheDocument();
      expect(screen.getByRole("menuitem").tagName).toBe("BUTTON");
    });

    it("sets aria-current on active link", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Docs" href="/docs" active />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByRole("link")).toHaveAttribute(
        "aria-current",
        "page"
      );
    });
  });

  describe("side prop", () => {
    it("applies left-0 and border-r for left side (default)", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Home" />
          </Sidebar.Content>
        </Sidebar>
      );
      const aside = screen.getByLabelText("Sidebar navigation");
      expect(aside).toHaveClass("left-0");
      expect(aside).toHaveClass("border-r");
    });

    it("applies right-0 and border-l for right side", () => {
      render(
        <Sidebar side="right">
          <Sidebar.Content>
            <Sidebar.Item label="Home" />
          </Sidebar.Content>
        </Sidebar>
      );
      const aside = screen.getByLabelText("Sidebar navigation");
      expect(aside).toHaveClass("right-0");
      expect(aside).toHaveClass("border-l");
    });
  });

  describe("content section", () => {
    it("renders content children", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="First" />
            <Sidebar.Item label="Second" />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.getByText("Second")).toBeInTheDocument();
    });

    it("applies custom className to content", () => {
      const { container } = render(
        <Sidebar>
          <Sidebar.Content className="custom-content">
            <Sidebar.Item label="Home" />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(container.querySelector(".custom-content")).toBeInTheDocument();
    });
  });

  describe("item className merging", () => {
    it("merges custom className on item", () => {
      render(
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Item label="Home" className="my-custom-item" />
          </Sidebar.Content>
        </Sidebar>
      );
      expect(screen.getByRole("menuitem")).toHaveClass("my-custom-item");
    });
  });

  describe("compound component structure", () => {
    it("renders full compound sidebar", () => {
      render(
        <Sidebar>
          <Sidebar.Header>
            <span>App Logo</span>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group label="Menu">
              <Sidebar.Item label="Home" active />
              <Sidebar.Item label="About" />
            </Sidebar.Group>
            <Sidebar.Separator />
            <Sidebar.Group label="Other">
              <Sidebar.Item label="Settings" />
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>
            <span>v1.0</span>
          </Sidebar.Footer>
        </Sidebar>
      );
      expect(screen.getByText("App Logo")).toBeInTheDocument();
      expect(screen.getByText("Menu")).toBeInTheDocument();
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByRole("separator")).toBeInTheDocument();
      expect(screen.getByText("Other")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(screen.getByText("v1.0")).toBeInTheDocument();
    });
  });
});
