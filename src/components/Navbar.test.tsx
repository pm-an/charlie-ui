import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Navbar } from "./Navbar";

describe("Navbar", () => {
  const defaultProps = {
    logo: <span>Logo</span>,
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
    ],
    actions: <button>Sign Up</button>,
  };

  it("renders logo", () => {
    render(<Navbar {...defaultProps} />);
    expect(screen.getByText("Logo")).toBeInTheDocument();
  });

  it("renders as a nav element with aria-label", () => {
    render(<Navbar {...defaultProps} />);
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
  });

  it("renders desktop links", () => {
    render(<Navbar {...defaultProps} />);
    const links = screen.getAllByText("Features");
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it("renders actions", () => {
    render(<Navbar {...defaultProps} />);
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("renders mobile menu toggle button", () => {
    render(<Navbar {...defaultProps} />);
    expect(screen.getByLabelText("Open menu")).toBeInTheDocument();
  });

  it("toggles mobile menu on click", async () => {
    const user = userEvent.setup();
    render(<Navbar {...defaultProps} />);
    const hamburger = screen.getByLabelText("Open menu");
    await user.click(hamburger);
    expect(hamburger).toHaveAttribute("aria-expanded", "true");
  });

  it("renders link badges", () => {
    const links = [{ label: "Pricing", href: "/pricing", badge: "New" }];
    render(<Navbar logo={<span>Logo</span>} links={links} />);
    const badges = screen.getAllByText("New");
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it("works without links and actions", () => {
    render(<Navbar logo={<span>Logo</span>} />);
    expect(screen.getByText("Logo")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(<Navbar {...defaultProps} className="custom-nav" />);
    expect(screen.getByRole("navigation")).toHaveClass("custom-nav");
  });
});
