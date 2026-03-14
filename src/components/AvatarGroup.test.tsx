import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AvatarGroup } from "./AvatarGroup";
import { Avatar } from "./Avatar";
import { expectNoA11yViolations } from "../test/a11y";

describe("AvatarGroup", () => {
  it("renders all children when no max", () => {
    render(
      <AvatarGroup>
        <Avatar alt="A" />
        <Avatar alt="B" />
        <Avatar alt="C" />
      </AvatarGroup>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("limits visible avatars when max is set", () => {
    render(
      <AvatarGroup max={2}>
        <Avatar alt="A" />
        <Avatar alt="B" />
        <Avatar alt="C" />
        <Avatar alt="D" />
      </AvatarGroup>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.queryByText("C")).not.toBeInTheDocument();
    expect(screen.queryByText("D")).not.toBeInTheDocument();
  });

  it("shows overflow count", () => {
    render(
      <AvatarGroup max={2}>
        <Avatar alt="A" />
        <Avatar alt="B" />
        <Avatar alt="C" />
        <Avatar alt="D" />
      </AvatarGroup>
    );
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("does not show overflow when all fit", () => {
    render(
      <AvatarGroup max={5}>
        <Avatar alt="A" />
        <Avatar alt="B" />
      </AvatarGroup>
    );
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(
      <AvatarGroup className="custom">
        <Avatar alt="A" />
      </AvatarGroup>
    );
    expect(container.firstChild).toHaveClass("custom");
  });

  it("has role group with aria-label", () => {
    render(
      <AvatarGroup>
        <Avatar alt="A" />
        <Avatar alt="B" />
        <Avatar alt="C" />
      </AvatarGroup>
    );
    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("aria-label", "Group of 3 avatars");
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar alt="A" />
        <Avatar alt="B" />
      </AvatarGroup>
    );
    await expectNoA11yViolations(container);
  });
});
