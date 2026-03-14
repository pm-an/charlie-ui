import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProfileSection } from "../ProfileSection";

describe("ProfileSection", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<ProfileSection name="Jane Doe" />);
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(<ProfileSection name="Jane Doe" />);
      expect(container.querySelector("[data-slot='profile-section']")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <ProfileSection name="Jane Doe" className="my-custom" />
      );
      expect(container.firstChild).toHaveClass("my-custom");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<ProfileSection name="Jane Doe" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("spreads additional HTML attributes", () => {
      render(<ProfileSection name="Jane Doe" data-testid="profile" />);
      expect(screen.getByTestId("profile")).toBeInTheDocument();
    });
  });

  describe("name", () => {
    it("renders the name", () => {
      render(<ProfileSection name="Alice Smith" />);
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    });

    it("renders name in a heading", () => {
      const { container } = render(<ProfileSection name="Alice Smith" />);
      const heading = container.querySelector("[data-slot='profile-name']");
      expect(heading).toBeInTheDocument();
      expect(heading?.tagName).toBe("H2");
    });
  });

  describe("role", () => {
    it("renders role when provided", () => {
      render(<ProfileSection name="Jane Doe" role="Designer" />);
      expect(screen.getByText("Designer")).toBeInTheDocument();
    });

    it("does not render role element when not provided", () => {
      const { container } = render(<ProfileSection name="Jane Doe" />);
      expect(container.querySelector("[data-slot='profile-role']")).not.toBeInTheDocument();
    });
  });

  describe("avatar", () => {
    it("renders avatar image when URL provided", () => {
      render(
        <ProfileSection name="Jane Doe" avatar="https://example.com/avatar.jpg" />
      );
      const img = screen.getByAltText("Jane Doe");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
    });

    it("renders initials when no avatar URL", () => {
      render(<ProfileSection name="Jane Doe" />);
      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("renders initials for single name", () => {
      render(<ProfileSection name="Jane" />);
      expect(screen.getByText("J")).toBeInTheDocument();
    });
  });

  describe("cover image", () => {
    it("renders cover image when URL provided", () => {
      const { container } = render(
        <ProfileSection name="Jane Doe" coverImage="https://example.com/cover.jpg" />
      );
      const coverImg = container.querySelector("[data-slot='profile-cover'] img");
      expect(coverImg).toBeInTheDocument();
      expect(coverImg).toHaveAttribute("src", "https://example.com/cover.jpg");
    });

    it("renders gradient background when no cover image", () => {
      const { container } = render(<ProfileSection name="Jane Doe" />);
      const cover = container.querySelector("[data-slot='profile-cover']");
      expect(cover).toHaveClass("bg-gradient-to-r");
    });
  });

  describe("bio", () => {
    it("renders bio when provided", () => {
      render(<ProfileSection name="Jane Doe" bio="A short bio" />);
      expect(screen.getByText("A short bio")).toBeInTheDocument();
    });

    it("does not render bio element when not provided", () => {
      const { container } = render(<ProfileSection name="Jane Doe" />);
      expect(container.querySelector("[data-slot='profile-bio']")).not.toBeInTheDocument();
    });
  });

  describe("stats", () => {
    it("renders stats when provided", () => {
      const stats = [
        { label: "Projects", value: 42 },
        { label: "Followers", value: "1.2k" },
      ];
      render(<ProfileSection name="Jane Doe" stats={stats} />);
      expect(screen.getByText("42")).toBeInTheDocument();
      expect(screen.getByText("Projects")).toBeInTheDocument();
      expect(screen.getByText("1.2k")).toBeInTheDocument();
      expect(screen.getByText("Followers")).toBeInTheDocument();
    });

    it("does not render stats when not provided", () => {
      const { container } = render(<ProfileSection name="Jane Doe" />);
      expect(container.querySelector("[data-slot='profile-stats']")).not.toBeInTheDocument();
    });

    it("does not render stats when array is empty", () => {
      const { container } = render(<ProfileSection name="Jane Doe" stats={[]} />);
      expect(container.querySelector("[data-slot='profile-stats']")).not.toBeInTheDocument();
    });
  });

  describe("actions", () => {
    it("renders actions when provided", () => {
      render(
        <ProfileSection
          name="Jane Doe"
          actions={<button type="button">Follow</button>}
        />
      );
      expect(screen.getAllByText("Follow").length).toBeGreaterThan(0);
    });

    it("does not render actions area when not provided", () => {
      const { container } = render(<ProfileSection name="Jane Doe" />);
      expect(container.querySelector("[data-slot='profile-actions']")).not.toBeInTheDocument();
      expect(container.querySelector("[data-slot='profile-actions-mobile']")).not.toBeInTheDocument();
    });

    it("renders actions in both desktop and mobile positions", () => {
      const { container } = render(
        <ProfileSection
          name="Jane Doe"
          actions={<button type="button">Follow</button>}
        />
      );
      expect(container.querySelector("[data-slot='profile-actions']")).toBeInTheDocument();
      expect(container.querySelector("[data-slot='profile-actions-mobile']")).toBeInTheDocument();
    });
  });

  describe("conditional rendering", () => {
    it("renders minimal profile with only name", () => {
      const { container } = render(<ProfileSection name="Jane Doe" />);
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      // Should not have optional elements
      expect(container.querySelector("[data-slot='profile-role']")).not.toBeInTheDocument();
      expect(container.querySelector("[data-slot='profile-bio']")).not.toBeInTheDocument();
      expect(container.querySelector("[data-slot='profile-stats']")).not.toBeInTheDocument();
      expect(container.querySelector("[data-slot='profile-actions']")).not.toBeInTheDocument();
    });

    it("renders fully populated profile", () => {
      const { container } = render(
        <ProfileSection
          name="Jane Doe"
          role="Designer"
          avatar="https://example.com/avatar.jpg"
          coverImage="https://example.com/cover.jpg"
          bio="A short bio"
          stats={[{ label: "Projects", value: 42 }]}
          actions={<button type="button">Follow</button>}
        />
      );
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByText("Designer")).toBeInTheDocument();
      expect(screen.getByText("A short bio")).toBeInTheDocument();
      expect(screen.getByText("42")).toBeInTheDocument();
      expect(container.querySelector("[data-slot='profile-actions']")).toBeInTheDocument();
    });
  });

  describe("displayName", () => {
    it("has correct displayName", () => {
      expect(ProfileSection.displayName).toBe("ProfileSection");
    });
  });
});
