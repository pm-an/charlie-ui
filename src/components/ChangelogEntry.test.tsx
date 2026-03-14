import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ChangelogEntry } from "./ChangelogEntry";

describe("ChangelogEntry", () => {
  const defaultProps = {
    date: "March 1, 2026",
    title: "New Dashboard",
  };

  it("renders date", () => {
    render(<ChangelogEntry {...defaultProps} />);
    expect(screen.getByText("March 1, 2026")).toBeInTheDocument();
  });

  it("renders title as h3", () => {
    render(<ChangelogEntry {...defaultProps} />);
    expect(screen.getByRole("heading", { level: 3, name: "New Dashboard" })).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<ChangelogEntry {...defaultProps} description="A brand new dashboard experience" />);
    expect(screen.getByText("A brand new dashboard experience")).toBeInTheDocument();
  });

  it("renders version badge when provided", () => {
    render(<ChangelogEntry {...defaultProps} version="v2.0" />);
    const badges = screen.getAllByText("v2.0");
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it("renders tags", () => {
    render(<ChangelogEntry {...defaultProps} tags={["Feature", "UI"]} />);
    expect(screen.getByText("Feature")).toBeInTheDocument();
    expect(screen.getByText("UI")).toBeInTheDocument();
  });

  it("renders image when provided", () => {
    render(<ChangelogEntry {...defaultProps} image="/changelog.png" />);
    const img = screen.getByAltText("New Dashboard");
    expect(img).toHaveAttribute("src", "/changelog.png");
  });

  it("renders children", () => {
    render(
      <ChangelogEntry {...defaultProps}>
        <p data-testid="custom">Custom content</p>
      </ChangelogEntry>
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(<ChangelogEntry {...defaultProps} className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("has responsive layout classes", () => {
    const { container } = render(<ChangelogEntry {...defaultProps} />);
    expect(container.firstChild).toHaveClass("flex");
    expect(container.firstChild).toHaveClass("flex-col");
    expect(container.firstChild).toHaveClass("md:flex-row");
  });
});
