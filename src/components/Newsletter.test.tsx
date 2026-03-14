import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Newsletter } from "./Newsletter";

describe("Newsletter", () => {
  const defaultProps = {
    title: "Stay Updated",
    description: "Get the latest news in your inbox.",
  };

  it("renders title", () => {
    render(<Newsletter {...defaultProps} />);
    expect(screen.getByText("Stay Updated")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<Newsletter {...defaultProps} />);
    expect(screen.getByText("Get the latest news in your inbox.")).toBeInTheDocument();
  });

  it("renders email input", () => {
    render(<Newsletter {...defaultProps} />);
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
  });

  it("renders subscribe button", () => {
    render(<Newsletter {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeInTheDocument();
  });

  it("calls onSubmit with email on form submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Newsletter {...defaultProps} onSubmit={onSubmit} />);
    const input = screen.getByPlaceholderText("Enter your email");
    await user.type(input, "test@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(onSubmit).toHaveBeenCalledWith("test@example.com");
  });

  it("clears input after submit", async () => {
    const user = userEvent.setup();
    render(<Newsletter {...defaultProps} onSubmit={() => {}} />);
    const input = screen.getByPlaceholderText("Enter your email");
    await user.type(input, "test@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(input).toHaveValue("");
  });

  it("does not submit empty email", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Newsletter {...defaultProps} onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("merges custom className", () => {
    const { container } = render(<Newsletter {...defaultProps} className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });
});
