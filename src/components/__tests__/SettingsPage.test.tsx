import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SettingsPage } from "../SettingsPage";

const defaultSections = [
  { id: "profile", label: "Profile" },
  { id: "notifications", label: "Notifications" },
  { id: "billing", label: "Billing" },
];

describe("SettingsPage", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(
        <SettingsPage>
          <div>Content</div>
        </SettingsPage>
      );
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(
        <SettingsPage>
          <div>Test</div>
        </SettingsPage>
      );
      expect(container.querySelector("[data-slot='settings-page']")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <SettingsPage className="my-custom">
          <div>Test</div>
        </SettingsPage>
      );
      expect(container.firstChild).toHaveClass("my-custom");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(
        <SettingsPage ref={ref}>
          <div>Test</div>
        </SettingsPage>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("renders default title", () => {
      render(
        <SettingsPage>
          <div>Test</div>
        </SettingsPage>
      );
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("renders custom title", () => {
      render(
        <SettingsPage title="Account Settings">
          <div>Test</div>
        </SettingsPage>
      );
      expect(screen.getByText("Account Settings")).toBeInTheDocument();
    });

    it("renders description when provided", () => {
      render(
        <SettingsPage description="Manage your preferences">
          <div>Test</div>
        </SettingsPage>
      );
      expect(screen.getByText("Manage your preferences")).toBeInTheDocument();
    });

    it("does not render description when not provided", () => {
      const { container } = render(
        <SettingsPage>
          <div>Test</div>
        </SettingsPage>
      );
      const header = container.querySelector("[data-slot='settings-page-header']");
      const paragraphs = header?.querySelectorAll("p");
      expect(paragraphs?.length ?? 0).toBe(0);
    });
  });

  describe("navigation", () => {
    it("renders section navigation items", () => {
      render(
        <SettingsPage sections={defaultSections}>
          <div>Content</div>
        </SettingsPage>
      );
      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("Notifications")).toBeInTheDocument();
      expect(screen.getByText("Billing")).toBeInTheDocument();
    });

    it("highlights active section", () => {
      render(
        <SettingsPage sections={defaultSections} activeSection="notifications">
          <div>Content</div>
        </SettingsPage>
      );
      const activeButton = screen.getByText("Notifications").closest("button");
      expect(activeButton).toHaveClass("text-text-loud");
      expect(activeButton).toHaveClass("font-medium");
    });

    it("calls onSectionChange when nav item is clicked", () => {
      const onChange = vi.fn();
      render(
        <SettingsPage
          sections={defaultSections}
          activeSection="profile"
          onSectionChange={onChange}
        >
          <div>Content</div>
        </SettingsPage>
      );
      fireEvent.click(screen.getByText("Billing"));
      expect(onChange).toHaveBeenCalledWith("billing");
    });

    it("renders section icons when provided", () => {
      const sectionsWithIcons = [
        { id: "profile", label: "Profile", icon: <span data-testid="icon-profile">P</span> },
      ];
      render(
        <SettingsPage sections={sectionsWithIcons}>
          <div>Content</div>
        </SettingsPage>
      );
      expect(screen.getByTestId("icon-profile")).toBeInTheDocument();
    });

    it("has settings navigation aria label", () => {
      render(
        <SettingsPage sections={defaultSections}>
          <div>Content</div>
        </SettingsPage>
      );
      expect(screen.getByLabelText("Settings navigation")).toBeInTheDocument();
    });

    it("does not render nav when sections is empty", () => {
      const { container } = render(
        <SettingsPage sections={[]}>
          <div>Content</div>
        </SettingsPage>
      );
      expect(container.querySelector("[data-slot='settings-page-nav']")).not.toBeInTheDocument();
    });
  });

  describe("SettingsPage.Section", () => {
    it("renders section title", () => {
      render(
        <SettingsPage>
          <SettingsPage.Section id="test" title="Test Section">
            <div>Section content</div>
          </SettingsPage.Section>
        </SettingsPage>
      );
      expect(screen.getByText("Test Section")).toBeInTheDocument();
    });

    it("renders section description when provided", () => {
      render(
        <SettingsPage>
          <SettingsPage.Section
            id="test"
            title="Test"
            description="A test section"
          >
            <div>Content</div>
          </SettingsPage.Section>
        </SettingsPage>
      );
      expect(screen.getByText("A test section")).toBeInTheDocument();
    });

    it("does not render section description when not provided", () => {
      render(
        <SettingsPage>
          <SettingsPage.Section id="test" title="Test">
            <div>Content</div>
          </SettingsPage.Section>
        </SettingsPage>
      );
      // Title h2 should exist, but no p for description
      expect(screen.getByText("Test")).toBeInTheDocument();
      expect(screen.queryByText("A test section")).not.toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(
        <SettingsPage>
          <SettingsPage.Section id="test" title="Test">
            <div>Content</div>
          </SettingsPage.Section>
        </SettingsPage>
      );
      expect(container.querySelector("[data-slot='settings-section']")).toBeInTheDocument();
    });

    it("has correct id for scrolling", () => {
      const { container } = render(
        <SettingsPage>
          <SettingsPage.Section id="profile" title="Profile">
            <div>Content</div>
          </SettingsPage.Section>
        </SettingsPage>
      );
      expect(container.querySelector("#settings-section-profile")).toBeInTheDocument();
    });

    it("renders children content", () => {
      render(
        <SettingsPage>
          <SettingsPage.Section id="test" title="Test">
            <span>Form fields here</span>
          </SettingsPage.Section>
        </SettingsPage>
      );
      expect(screen.getByText("Form fields here")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <SettingsPage>
          <SettingsPage.Section id="test" title="Test" className="custom-section">
            <div>Content</div>
          </SettingsPage.Section>
        </SettingsPage>
      );
      const section = container.querySelector("[data-slot='settings-section']");
      expect(section).toHaveClass("custom-section");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(
        <SettingsPage>
          <SettingsPage.Section id="test" title="Test" ref={ref}>
            <div>Content</div>
          </SettingsPage.Section>
        </SettingsPage>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("compound components", () => {
    it("renders multiple sections together", () => {
      render(
        <SettingsPage sections={defaultSections} activeSection="profile">
          <SettingsPage.Section id="profile" title="Profile">
            <span>Profile form</span>
          </SettingsPage.Section>
          <SettingsPage.Section id="notifications" title="Notifications">
            <span>Notification prefs</span>
          </SettingsPage.Section>
          <SettingsPage.Section id="billing" title="Billing">
            <span>Payment info</span>
          </SettingsPage.Section>
        </SettingsPage>
      );
      expect(screen.getByText("Profile form")).toBeInTheDocument();
      expect(screen.getByText("Notification prefs")).toBeInTheDocument();
      expect(screen.getByText("Payment info")).toBeInTheDocument();
    });
  });

  describe("displayName", () => {
    it("has correct displayName for all components", () => {
      expect(SettingsPage.displayName).toBe("SettingsPage");
      expect(SettingsPage.Section.displayName).toBe("SettingsPage.Section");
    });
  });
});
