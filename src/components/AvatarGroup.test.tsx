import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AvatarGroup } from "./AvatarGroup";
import { Avatar } from "./Avatar";

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
});
