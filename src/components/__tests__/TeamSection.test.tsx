import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TeamSection } from "../TeamSection";
import type { TeamMember } from "../TeamSection";

const defaultMembers: TeamMember[] = [
  {
    name: "Sarah Chen",
    role: "CEO",
    socials: [
      { platform: "Twitter", href: "https://twitter.com/sarachen" },
      { platform: "GitHub", href: "https://github.com/sarachen" },
    ],
  },
  {
    name: "Marcus Rivera",
    role: "CTO",
    bio: "Distributed systems expert.",
  },
];

describe("TeamSection", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(<TeamSection members={defaultMembers} />);
      expect(container.querySelector("[data-slot='team-section']")).toBeInTheDocument();
    });

    it("renders section header when provided", () => {
      render(
        <TeamSection
          eyebrow="Our Team"
          title="Meet the team"
          description="We build great things."
          members={defaultMembers}
        />
      );
      expect(screen.getByText("Our Team")).toBeInTheDocument();
      expect(screen.getByText("Meet the team")).toBeInTheDocument();
      expect(screen.getByText("We build great things.")).toBeInTheDocument();
    });

    it("does not render header section when no header props provided", () => {
      const { container } = render(<TeamSection members={defaultMembers} />);
      expect(container.querySelector("h2")).not.toBeInTheDocument();
    });

    it("renders all team members", () => {
      render(<TeamSection members={defaultMembers} />);
      expect(screen.getByText("Sarah Chen")).toBeInTheDocument();
      expect(screen.getByText("Marcus Rivera")).toBeInTheDocument();
    });

    it("renders member roles", () => {
      render(<TeamSection members={defaultMembers} />);
      expect(screen.getByText("CEO")).toBeInTheDocument();
      expect(screen.getByText("CTO")).toBeInTheDocument();
    });
  });

  describe("props", () => {
    it("applies custom className", () => {
      const { container } = render(
        <TeamSection className="custom-class" members={defaultMembers} />
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLElement | null>;
      render(<TeamSection ref={ref} members={defaultMembers} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("spreads additional HTML attributes", () => {
      render(
        <TeamSection data-testid="team" aria-label="Team" members={defaultMembers} />
      );
      expect(screen.getByTestId("team")).toBeInTheDocument();
      expect(screen.getByLabelText("Team")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(<TeamSection members={defaultMembers} />);
      expect(container.firstChild).toHaveAttribute("data-slot", "team-section");
    });
  });

  describe("columns", () => {
    it("defaults to 3 columns (lg:grid-cols-3)", () => {
      const { container } = render(<TeamSection members={defaultMembers} />);
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("lg:grid-cols-3");
    });

    it("applies 2 columns", () => {
      const { container } = render(
        <TeamSection members={defaultMembers} columns={2} />
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("lg:grid-cols-2");
    });

    it("applies 4 columns", () => {
      const { container } = render(
        <TeamSection members={defaultMembers} columns={4} />
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("lg:grid-cols-4");
    });
  });

  describe("conditional rendering", () => {
    it("renders bio when provided", () => {
      render(<TeamSection members={defaultMembers} />);
      expect(screen.getByText("Distributed systems expert.")).toBeInTheDocument();
    });

    it("does not render bio element when not provided", () => {
      const membersNoBio: TeamMember[] = [
        { name: "John Doe", role: "Engineer" },
      ];
      const { container } = render(<TeamSection members={membersNoBio} />);
      const cards = container.querySelectorAll(".line-clamp-2");
      expect(cards).toHaveLength(0);
    });

    it("renders social links when provided", () => {
      render(<TeamSection members={defaultMembers} />);
      const twitterLink = screen.getByLabelText("Sarah Chen on Twitter");
      expect(twitterLink).toBeInTheDocument();
      expect(twitterLink).toHaveAttribute("href", "https://twitter.com/sarachen");
    });

    it("does not render social links section when no socials", () => {
      const membersNoSocials: TeamMember[] = [
        { name: "Solo Dev", role: "Engineer" },
      ];
      render(<TeamSection members={membersNoSocials} />);
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("renders avatar placeholder with initials when no image", () => {
      render(<TeamSection members={[{ name: "Sarah Chen", role: "CEO" }]} />);
      expect(screen.getByText("SC")).toBeInTheDocument();
    });

    it("renders image when provided", () => {
      const memberWithImage: TeamMember[] = [
        { name: "Sarah Chen", role: "CEO", image: "https://example.com/sarah.jpg" },
      ];
      render(<TeamSection members={memberWithImage} />);
      const img = screen.getByAltText("Sarah Chen");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "https://example.com/sarah.jpg");
    });
  });

  describe("accessibility", () => {
    it("renders as a section element", () => {
      const { container } = render(<TeamSection members={defaultMembers} />);
      expect(container.querySelector("section")).toBeInTheDocument();
    });

    it("social links have aria-labels", () => {
      render(<TeamSection members={defaultMembers} />);
      expect(screen.getByLabelText("Sarah Chen on Twitter")).toBeInTheDocument();
      expect(screen.getByLabelText("Sarah Chen on GitHub")).toBeInTheDocument();
    });

    it("social links open in new tab", () => {
      render(<TeamSection members={defaultMembers} />);
      const link = screen.getByLabelText("Sarah Chen on Twitter");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
