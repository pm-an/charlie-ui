import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AnnouncementBar } from "../AnnouncementBar";

describe("AnnouncementBar", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(<AnnouncementBar message="Hello" />);
      expect(
        container.querySelector("[data-slot='announcement-bar']")
      ).toBeInTheDocument();
    });

    it("renders the message text", () => {
      render(<AnnouncementBar message="New version available" />);
      expect(screen.getByText("New version available")).toBeInTheDocument();
    });

    it("renders ReactNode message", () => {
      render(
        <AnnouncementBar
          message={<span data-testid="custom-msg">Custom content</span>}
        />
      );
      expect(screen.getByTestId("custom-msg")).toBeInTheDocument();
    });
  });

  describe("props", () => {
    it("applies custom className", () => {
      const { container } = render(
        <AnnouncementBar message="Test" className="my-class" />
      );
      expect(container.firstChild).toHaveClass("my-class");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<AnnouncementBar ref={ref} message="Test" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("spreads additional HTML attributes", () => {
      render(
        <AnnouncementBar message="Test" data-testid="bar" aria-label="Announcement" />
      );
      expect(screen.getByTestId("bar")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(<AnnouncementBar message="Test" />);
      expect(container.firstChild).toHaveAttribute(
        "data-slot",
        "announcement-bar"
      );
    });

    it("has banner role", () => {
      render(<AnnouncementBar message="Test" />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });
  });

  describe("variants", () => {
    it("renders default variant", () => {
      const { container } = render(
        <AnnouncementBar message="Test" variant="default" />
      );
      expect(container.firstChild).toHaveClass("bg-white/5");
    });

    it("renders info variant", () => {
      const { container } = render(
        <AnnouncementBar message="Test" variant="info" />
      );
      expect(container.firstChild).toHaveClass("bg-blue/10");
    });

    it("renders warning variant", () => {
      const { container } = render(
        <AnnouncementBar message="Test" variant="warning" />
      );
      expect(container.firstChild).toHaveClass("bg-yellow/10");
    });

    it("renders success variant", () => {
      const { container } = render(
        <AnnouncementBar message="Test" variant="success" />
      );
      expect(container.firstChild).toHaveClass("bg-green/10");
    });

    it("renders accent variant", () => {
      const { container } = render(
        <AnnouncementBar message="Test" variant="accent" />
      );
      expect(container.firstChild).toHaveClass("bg-red/10");
    });
  });

  describe("interactions", () => {
    it("dismisses when X button is clicked", () => {
      const { container } = render(<AnnouncementBar message="Dismiss me" />);
      expect(screen.getByText("Dismiss me")).toBeInTheDocument();

      fireEvent.click(screen.getByLabelText("Dismiss announcement"));
      expect(container.firstChild).toBeNull();
    });

    it("calls onDismiss callback when dismissed", () => {
      const onDismiss = vi.fn();
      render(<AnnouncementBar message="Test" onDismiss={onDismiss} />);

      fireEvent.click(screen.getByLabelText("Dismiss announcement"));
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it("does not show dismiss button when dismissible is false", () => {
      render(
        <AnnouncementBar message="Permanent" dismissible={false} />
      );
      expect(
        screen.queryByLabelText("Dismiss announcement")
      ).not.toBeInTheDocument();
    });
  });

  describe("conditional rendering", () => {
    it("renders icon when provided", () => {
      render(
        <AnnouncementBar
          message="Test"
          icon={<span data-testid="custom-icon">!</span>}
        />
      );
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("does not render icon when not provided", () => {
      const { container } = render(<AnnouncementBar message="Test" />);
      expect(
        container.querySelector("[data-testid='custom-icon']")
      ).not.toBeInTheDocument();
    });

    it("renders message as link when href provided", () => {
      render(
        <AnnouncementBar message="Click here" href="https://example.com" />
      );
      const link = screen.getByText("Click here");
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href", "https://example.com");
    });

    it("renders message as text when no href", () => {
      render(<AnnouncementBar message="Just text" />);
      const text = screen.getByText("Just text");
      expect(text.tagName).toBe("SPAN");
    });

    it("renders linkText when provided with href", () => {
      render(
        <AnnouncementBar
          message="New release"
          href="https://example.com"
          linkText="Learn more"
        />
      );
      const linkTextEl = screen.getByText("Learn more");
      expect(linkTextEl.tagName).toBe("A");
      expect(linkTextEl).toHaveAttribute("href", "https://example.com");
    });

    it("renders linkText as span when no href", () => {
      render(
        <AnnouncementBar message="New release" linkText="Details" />
      );
      const linkTextEl = screen.getByText("Details");
      expect(linkTextEl.tagName).toBe("SPAN");
    });

    it("returns null after dismissal", () => {
      const { container } = render(<AnnouncementBar message="Bye" />);
      fireEvent.click(screen.getByLabelText("Dismiss announcement"));
      expect(container.innerHTML).toBe("");
    });
  });

  describe("accessibility", () => {
    it("dismiss button has aria-label", () => {
      render(<AnnouncementBar message="Test" />);
      expect(
        screen.getByLabelText("Dismiss announcement")
      ).toBeInTheDocument();
    });

    it("dismiss button is a button element", () => {
      render(<AnnouncementBar message="Test" />);
      const btn = screen.getByLabelText("Dismiss announcement");
      expect(btn.tagName).toBe("BUTTON");
      expect(btn).toHaveAttribute("type", "button");
    });
  });
});
