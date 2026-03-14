import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { IntegrationsSection } from "../IntegrationsSection";
import type { Integration } from "../IntegrationsSection";

const defaultIntegrations: Integration[] = [
  {
    name: "Slack",
    icon: <span data-testid="slack-icon">S</span>,
    description: "Real-time notifications.",
    href: "https://slack.com",
  },
  {
    name: "GitHub",
    icon: <span data-testid="github-icon">G</span>,
    description: "Sync PRs and issues.",
  },
  {
    name: "Figma",
    icon: <span data-testid="figma-icon">F</span>,
  },
];

const categorizedIntegrations: Integration[] = [
  {
    name: "Slack",
    icon: <span>S</span>,
    category: "Communication",
    description: "Chat integration.",
  },
  {
    name: "Discord",
    icon: <span>D</span>,
    category: "Communication",
    description: "Community alerts.",
  },
  {
    name: "GitHub",
    icon: <span>G</span>,
    category: "Development",
    description: "Code sync.",
  },
  {
    name: "Vercel",
    icon: <span>V</span>,
    category: "Development",
    description: "Deploy previews.",
  },
  {
    name: "Figma",
    icon: <span>F</span>,
    category: "Design",
    description: "Design tokens.",
  },
];

describe("IntegrationsSection", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(
        <IntegrationsSection integrations={defaultIntegrations} />
      );
      expect(
        container.querySelector("[data-slot='integrations-section']")
      ).toBeInTheDocument();
    });

    it("renders section header when provided", () => {
      render(
        <IntegrationsSection
          eyebrow="Integrations"
          title="Connect your tools"
          description="Works with everything."
          integrations={defaultIntegrations}
        />
      );
      expect(screen.getByText("Integrations")).toBeInTheDocument();
      expect(screen.getByText("Connect your tools")).toBeInTheDocument();
      expect(screen.getByText("Works with everything.")).toBeInTheDocument();
    });

    it("does not render header when no header props", () => {
      const { container } = render(
        <IntegrationsSection integrations={defaultIntegrations} />
      );
      expect(container.querySelector("h2")).not.toBeInTheDocument();
    });

    it("renders all integration names", () => {
      render(<IntegrationsSection integrations={defaultIntegrations} />);
      expect(screen.getByText("Slack")).toBeInTheDocument();
      expect(screen.getByText("GitHub")).toBeInTheDocument();
      expect(screen.getByText("Figma")).toBeInTheDocument();
    });

    it("renders integration icons", () => {
      render(<IntegrationsSection integrations={defaultIntegrations} />);
      expect(screen.getByTestId("slack-icon")).toBeInTheDocument();
      expect(screen.getByTestId("github-icon")).toBeInTheDocument();
      expect(screen.getByTestId("figma-icon")).toBeInTheDocument();
    });
  });

  describe("props", () => {
    it("applies custom className", () => {
      const { container } = render(
        <IntegrationsSection
          className="custom-cls"
          integrations={defaultIntegrations}
        />
      );
      expect(container.firstChild).toHaveClass("custom-cls");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLElement | null>;
      render(
        <IntegrationsSection ref={ref} integrations={defaultIntegrations} />
      );
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("spreads additional HTML attributes", () => {
      render(
        <IntegrationsSection
          data-testid="integrations"
          aria-label="Integrations"
          integrations={defaultIntegrations}
        />
      );
      expect(screen.getByTestId("integrations")).toBeInTheDocument();
      expect(screen.getByLabelText("Integrations")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(
        <IntegrationsSection integrations={defaultIntegrations} />
      );
      expect(container.firstChild).toHaveAttribute(
        "data-slot",
        "integrations-section"
      );
    });
  });

  describe("conditional rendering", () => {
    it("renders description when provided", () => {
      render(<IntegrationsSection integrations={defaultIntegrations} />);
      expect(screen.getByText("Real-time notifications.")).toBeInTheDocument();
      expect(screen.getByText("Sync PRs and issues.")).toBeInTheDocument();
    });

    it("does not render description element when not provided", () => {
      // Figma has no description
      const { container } = render(
        <IntegrationsSection
          integrations={[
            { name: "Only", icon: <span>O</span> },
          ]}
        />
      );
      const descElements = container.querySelectorAll(".text-xs.text-white\\/40");
      expect(descElements).toHaveLength(0);
    });

    it("renders card as link when href provided", () => {
      render(<IntegrationsSection integrations={defaultIntegrations} />);
      const slackLink = screen.getByLabelText("Slack");
      expect(slackLink.tagName).toBe("A");
      expect(slackLink).toHaveAttribute("href", "https://slack.com");
    });

    it("renders card as div when no href", () => {
      render(
        <IntegrationsSection
          integrations={[
            { name: "NoLink", icon: <span>N</span> },
          ]}
        />
      );
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("does not show categories when showCategories is false", () => {
      render(
        <IntegrationsSection
          integrations={categorizedIntegrations}
          showCategories={false}
        />
      );
      expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    });
  });

  describe("category filtering", () => {
    it("shows category tabs when showCategories is true", () => {
      render(
        <IntegrationsSection
          integrations={categorizedIntegrations}
          showCategories={true}
        />
      );
      expect(screen.getByRole("tablist")).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "All" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Communication" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Development" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Design" })).toBeInTheDocument();
    });

    it("shows all integrations by default", () => {
      render(
        <IntegrationsSection
          integrations={categorizedIntegrations}
          showCategories={true}
        />
      );
      expect(screen.getByText("Slack")).toBeInTheDocument();
      expect(screen.getByText("Discord")).toBeInTheDocument();
      expect(screen.getByText("GitHub")).toBeInTheDocument();
      expect(screen.getByText("Vercel")).toBeInTheDocument();
      expect(screen.getByText("Figma")).toBeInTheDocument();
    });

    it("filters integrations when category is selected", () => {
      render(
        <IntegrationsSection
          integrations={categorizedIntegrations}
          showCategories={true}
        />
      );

      fireEvent.click(screen.getByRole("tab", { name: "Communication" }));

      expect(screen.getByText("Slack")).toBeInTheDocument();
      expect(screen.getByText("Discord")).toBeInTheDocument();
      expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
      expect(screen.queryByText("Vercel")).not.toBeInTheDocument();
      expect(screen.queryByText("Figma")).not.toBeInTheDocument();
    });

    it("shows all integrations when All is selected", () => {
      render(
        <IntegrationsSection
          integrations={categorizedIntegrations}
          showCategories={true}
        />
      );

      // Click Development first
      fireEvent.click(screen.getByRole("tab", { name: "Development" }));
      expect(screen.queryByText("Slack")).not.toBeInTheDocument();

      // Click All
      fireEvent.click(screen.getByRole("tab", { name: "All" }));
      expect(screen.getByText("Slack")).toBeInTheDocument();
      expect(screen.getByText("GitHub")).toBeInTheDocument();
      expect(screen.getByText("Figma")).toBeInTheDocument();
    });

    it("marks active category tab with aria-selected", () => {
      render(
        <IntegrationsSection
          integrations={categorizedIntegrations}
          showCategories={true}
        />
      );

      const allTab = screen.getByRole("tab", { name: "All" });
      expect(allTab).toHaveAttribute("aria-selected", "true");

      fireEvent.click(screen.getByRole("tab", { name: "Design" }));
      expect(allTab).toHaveAttribute("aria-selected", "false");
      expect(screen.getByRole("tab", { name: "Design" })).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });
  });

  describe("accessibility", () => {
    it("renders as a section element", () => {
      const { container } = render(
        <IntegrationsSection integrations={defaultIntegrations} />
      );
      expect(container.querySelector("section")).toBeInTheDocument();
    });

    it("category tabs have correct roles", () => {
      render(
        <IntegrationsSection
          integrations={categorizedIntegrations}
          showCategories={true}
        />
      );
      const tabs = screen.getAllByRole("tab");
      expect(tabs.length).toBe(4); // All + 3 categories
      tabs.forEach((tab) => {
        expect(tab).toHaveAttribute("type", "button");
      });
    });

    it("linked cards have aria-label", () => {
      render(<IntegrationsSection integrations={defaultIntegrations} />);
      expect(screen.getByLabelText("Slack")).toBeInTheDocument();
    });
  });
});
