import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "./Footer";

describe("Footer", () => {
  const defaultProps = {
    logo: <span>Logo</span>,
    columns: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "/features" },
          { label: "Pricing", href: "/pricing" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Blog", href: "/blog", external: true },
        ],
      },
    ],
  };

  it("renders as a footer element", () => {
    const { container } = render(<Footer {...defaultProps} />);
    expect(container.querySelector("footer")).toBeInTheDocument();
  });

  it("renders logo", () => {
    render(<Footer {...defaultProps} />);
    expect(screen.getByText("Logo")).toBeInTheDocument();
  });

  it("renders column titles", () => {
    render(<Footer {...defaultProps} />);
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
  });

  it("renders all links", () => {
    render(<Footer {...defaultProps} />);
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("external links open in new tab", () => {
    render(<Footer {...defaultProps} />);
    const blogLink = screen.getByText("Blog").closest("a");
    expect(blogLink).toHaveAttribute("target", "_blank");
    expect(blogLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("internal links do not have target=_blank", () => {
    render(<Footer {...defaultProps} />);
    const featuresLink = screen.getByText("Features").closest("a");
    expect(featuresLink).not.toHaveAttribute("target");
  });

  it("renders bottom section when provided", () => {
    render(<Footer {...defaultProps} bottom={<span>© 2026 Company</span>} />);
    expect(screen.getByText("© 2026 Company")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(<Footer {...defaultProps} className="custom" />);
    expect(container.querySelector("footer")).toHaveClass("custom");
  });
});
