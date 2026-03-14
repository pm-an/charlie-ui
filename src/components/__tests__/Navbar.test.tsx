import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Navbar } from "../Navbar";
import { expectNoA11yViolations } from "../../test/a11y";

const defaultLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
];

describe("Navbar", () => {
  it("renders logo and links", () => {
    render(<Navbar logo={<span>Logo</span>} links={defaultLinks} />);
    expect(screen.getByText("Logo")).toBeInTheDocument();
    expect(screen.getAllByText("Home").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Features").length).toBeGreaterThanOrEqual(1);
  });

  it("has aria-label on the nav element", () => {
    render(<Navbar logo={<span>Logo</span>} links={defaultLinks} />);
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
  });

  describe("aria-current support", () => {
    it("sets aria-current=page on desktop link matching currentPath", () => {
      render(
        <Navbar
          logo={<span>Logo</span>}
          links={defaultLinks}
          currentPath="/features"
        />
      );
      const links = screen.getAllByRole("link", { name: "Features" });
      // Desktop link should have aria-current
      const desktopLink = links.find((l) => l.getAttribute("aria-current") === "page");
      expect(desktopLink).toBeDefined();
    });

    it("does not set aria-current on non-matching links", () => {
      render(
        <Navbar
          logo={<span>Logo</span>}
          links={defaultLinks}
          currentPath="/features"
        />
      );
      const homeLinks = screen.getAllByRole("link", { name: "Home" });
      homeLinks.forEach((link) => {
        expect(link).not.toHaveAttribute("aria-current");
      });
    });
  });

  describe("mobile menu", () => {
    it("hamburger button has aria-expanded", () => {
      render(<Navbar logo={<span>Logo</span>} links={defaultLinks} />);
      const hamburger = screen.getByLabelText("Open menu");
      expect(hamburger).toHaveAttribute("aria-expanded", "false");
    });

    it("sets aria-expanded=true when mobile menu is open", async () => {
      const user = userEvent.setup();
      render(<Navbar logo={<span>Logo</span>} links={defaultLinks} />);
      const hamburger = screen.getByLabelText("Open menu");
      await user.click(hamburger);
      expect(hamburger).toHaveAttribute("aria-expanded", "true");
    });

    it("Escape closes mobile menu", async () => {
      const user = userEvent.setup();
      render(<Navbar logo={<span>Logo</span>} links={defaultLinks} />);
      const hamburger = screen.getByLabelText("Open menu");
      await user.click(hamburger);
      // Mobile menu should be open
      expect(screen.getByRole("menu")).toBeInTheDocument();
      // Press Escape
      await user.keyboard("{Escape}");
      // The hamburger should now say "Open menu" again
      expect(screen.getByLabelText("Open menu")).toHaveAttribute("aria-expanded", "false");
    });

    it("mobile menu links have aria-current for matching currentPath", async () => {
      const user = userEvent.setup();
      render(
        <Navbar
          logo={<span>Logo</span>}
          links={defaultLinks}
          currentPath="/pricing"
        />
      );
      await user.click(screen.getByLabelText("Open menu"));
      const menuItems = screen.getAllByRole("menuitem");
      const pricingItem = menuItems.find((item) => item.textContent?.includes("Pricing"));
      expect(pricingItem).toHaveAttribute("aria-current", "page");
    });

    it("mobile menu has role=menu", async () => {
      const user = userEvent.setup();
      render(<Navbar logo={<span>Logo</span>} links={defaultLinks} />);
      await user.click(screen.getByLabelText("Open menu"));
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <Navbar logo={<span>Logo</span>} links={defaultLinks} currentPath="/" />
    );
    await expectNoA11yViolations(container);
  });
});
