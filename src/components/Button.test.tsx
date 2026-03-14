import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn<(node: HTMLButtonElement | null) => void>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it("calls onClick handler", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when loading", () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows spinner when loading", () => {
    const { container } = render(<Button loading>Loading</Button>);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders left icon", () => {
    render(<Button leftIcon={<span data-testid="left-icon" />}>Text</Button>);
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders right icon", () => {
    render(<Button rightIcon={<span data-testid="right-icon" />}>Text</Button>);
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("hides icons when loading", () => {
    render(
      <Button loading leftIcon={<span data-testid="left" />} rightIcon={<span data-testid="right" />}>
        Text
      </Button>
    );
    expect(screen.queryByTestId("left")).not.toBeInTheDocument();
    expect(screen.queryByTestId("right")).not.toBeInTheDocument();
  });

  it.each(["primary", "secondary", "ghost", "danger", "brand"] as const)(
    "applies %s variant classes",
    (variant) => {
      render(<Button variant={variant}>V</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    }
  );

  it.each(["sm", "md", "lg"] as const)(
    "applies %s size classes",
    (size) => {
      render(<Button size={size}>S</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    }
  );

  it("merges custom className", () => {
    render(<Button className="custom-class">C</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("passes through native button attributes", () => {
    render(<Button type="submit" name="btn">Submit</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("name", "btn");
  });
});
