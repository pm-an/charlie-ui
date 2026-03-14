import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BlogSection } from "../BlogSection";
import { expectNoA11yViolations } from "../../test/a11y";

const mockPosts = [
  {
    title: "First Post Title",
    excerpt: "Excerpt for the first post",
    date: "March 1, 2026",
    image: "https://example.com/img1.jpg",
    tag: "Engineering",
    href: "/blog/first-post",
  },
  {
    title: "Second Post Title",
    excerpt: "Excerpt for the second post",
    date: "February 28, 2026",
    tag: "Design",
  },
  {
    title: "Third Post Title",
    excerpt: "Excerpt for the third post",
    date: "February 20, 2026",
  },
];

describe("BlogSection", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(<BlogSection posts={mockPosts} />);
      expect(
        container.querySelector("[data-slot='blog-section']")
      ).toBeInTheDocument();
    });

    it("renders all blog cards", () => {
      const { container } = render(<BlogSection posts={mockPosts} />);
      const cards = container.querySelectorAll("[data-slot='blog-card']");
      expect(cards.length).toBe(3);
    });

    it("renders post titles", () => {
      render(<BlogSection posts={mockPosts} />);
      expect(screen.getByText("First Post Title")).toBeInTheDocument();
      expect(screen.getByText("Second Post Title")).toBeInTheDocument();
      expect(screen.getByText("Third Post Title")).toBeInTheDocument();
    });

    it("renders post excerpts", () => {
      render(<BlogSection posts={mockPosts} />);
      expect(
        screen.getByText("Excerpt for the first post")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Excerpt for the second post")
      ).toBeInTheDocument();
    });

    it("renders post dates", () => {
      render(<BlogSection posts={mockPosts} />);
      expect(screen.getByText("March 1, 2026")).toBeInTheDocument();
      expect(screen.getByText("February 28, 2026")).toBeInTheDocument();
    });

    it("renders tags when provided", () => {
      render(<BlogSection posts={mockPosts} />);
      expect(screen.getByText("Engineering")).toBeInTheDocument();
      expect(screen.getByText("Design")).toBeInTheDocument();
    });
  });

  describe("section header", () => {
    it("renders eyebrow when provided", () => {
      render(<BlogSection posts={mockPosts} eyebrow="Blog" />);
      expect(screen.getByText("Blog")).toBeInTheDocument();
    });

    it("renders title when provided", () => {
      render(
        <BlogSection posts={mockPosts} title="Latest articles" />
      );
      expect(screen.getByText("Latest articles")).toBeInTheDocument();
    });

    it("renders description when provided", () => {
      render(
        <BlogSection
          posts={mockPosts}
          description="From our team"
        />
      );
      expect(screen.getByText("From our team")).toBeInTheDocument();
    });

    it("does not render header elements when not provided", () => {
      render(<BlogSection posts={mockPosts} />);
      expect(screen.queryByText("Blog")).not.toBeInTheDocument();
    });
  });

  describe("props", () => {
    it("applies custom className", () => {
      const { container } = render(
        <BlogSection posts={mockPosts} className="custom-class" />
      );
      expect(
        container.querySelector("[data-slot='blog-section']")
      ).toHaveClass("custom-class");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLElement | null>;
      render(<BlogSection ref={ref} posts={mockPosts} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("spreads additional HTML attributes", () => {
      render(
        <BlogSection posts={mockPosts} data-testid="my-blog" />
      );
      expect(screen.getByTestId("my-blog")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(<BlogSection posts={mockPosts} />);
      expect(
        container.querySelector("[data-slot='blog-section']")
      ).toBeInTheDocument();
    });
  });

  describe("columns", () => {
    it("renders grid with 2 columns", () => {
      const { container } = render(
        <BlogSection posts={mockPosts} columns={2} />
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("sm:grid-cols-2");
    });

    it("renders grid with 3 columns by default", () => {
      const { container } = render(<BlogSection posts={mockPosts} />);
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("lg:grid-cols-3");
    });
  });

  describe("view all link", () => {
    it("renders view all link when viewAllHref is provided", () => {
      render(
        <BlogSection
          posts={mockPosts}
          viewAllHref="/blog"
        />
      );
      const link = screen.getByText("View all posts");
      expect(link).toBeInTheDocument();
      expect(link.closest("a")).toHaveAttribute("href", "/blog");
    });

    it("renders custom view all label", () => {
      render(
        <BlogSection
          posts={mockPosts}
          viewAllHref="/blog"
          viewAllLabel="See all articles"
        />
      );
      expect(screen.getByText("See all articles")).toBeInTheDocument();
    });

    it("does not render view all link when viewAllHref is not provided", () => {
      render(<BlogSection posts={mockPosts} />);
      expect(screen.queryByText("View all posts")).not.toBeInTheDocument();
    });

    it("uses default label when viewAllLabel is not provided", () => {
      render(
        <BlogSection posts={mockPosts} viewAllHref="/blog" />
      );
      expect(screen.getByText("View all posts")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("renders with empty posts array", () => {
      const { container } = render(<BlogSection posts={[]} />);
      expect(
        container.querySelector("[data-slot='blog-section']")
      ).toBeInTheDocument();
    });

    it("renders with single post", () => {
      render(<BlogSection posts={[mockPosts[0]]} />);
      expect(screen.getByText("First Post Title")).toBeInTheDocument();
    });

    it("renders posts without images", () => {
      render(<BlogSection posts={[mockPosts[2]]} />);
      expect(screen.getByText("Third Post Title")).toBeInTheDocument();
    });

    it("renders posts without tags", () => {
      render(<BlogSection posts={[mockPosts[2]]} />);
      expect(screen.getByText("Third Post Title")).toBeInTheDocument();
      expect(screen.queryByText("Engineering")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("passes axe accessibility checks", async () => {
      const { container } = render(
        <BlogSection posts={mockPosts} title="Latest articles" />
      );
      await expectNoA11yViolations(container);
    });
  });
});
