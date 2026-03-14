import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Input } from "./Input";
import { Field } from "./Field";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn<(node: HTMLInputElement | null) => void>();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it("renders label when provided", () => {
    render(<Input label="Email" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("associates label with input via htmlFor", () => {
    render(<Input label="Username" />);
    const input = screen.getByLabelText("Username");
    expect(input.tagName).toBe("INPUT");
  });

  it("uses custom id for label association", () => {
    render(<Input label="Custom" id="my-input" />);
    expect(screen.getByLabelText("Custom")).toHaveAttribute("id", "my-input");
  });

  it("renders helper text", () => {
    render(<Input helperText="Must be at least 8 characters" />);
    expect(screen.getByText("Must be at least 8 characters")).toBeInTheDocument();
  });

  it("shows error message and hides helper text when error is true", () => {
    render(<Input error errorMessage="Required field" helperText="Help" />);
    expect(screen.getByText("Required field")).toBeInTheDocument();
    expect(screen.queryByText("Help")).not.toBeInTheDocument();
  });

  it("renders left icon", () => {
    render(<Input leftIcon={<span data-testid="left-icon" />} />);
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders right icon", () => {
    render(<Input rightIcon={<span data-testid="right-icon" />} />);
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("handles user typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    const input = screen.getByRole("textbox");
    await user.type(input, "hello");
    expect(onChange).toHaveBeenCalled();
    expect(input).toHaveValue("hello");
  });

  it("merges custom className on the input element", () => {
    render(<Input className="custom-input" />);
    expect(document.querySelector(".custom-input")).toBeInTheDocument();
  });

  it("passes through native input attributes", () => {
    render(<Input type="email" required aria-describedby="desc" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toBeRequired();
  });

  describe("Input inside Field", () => {
    it("suppresses own label and error when inside Field", () => {
      render(
        <Field label="Field Label" error errorMessage="Field error">
          <Input label="Own Label" error errorMessage="Own error" />
        </Field>
      );
      // Should show Field's label, not component's own label
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.queryByText("Own Label")).not.toBeInTheDocument();
      // Should show Field's error
      expect(screen.getByText("Field error")).toBeInTheDocument();
      expect(screen.queryByText("Own error")).not.toBeInTheDocument();
    });

    it("suppresses own helper text when inside Field", () => {
      render(
        <Field label="Field Label">
          <Input helperText="Own helper" />
        </Field>
      );
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.queryByText("Own helper")).not.toBeInTheDocument();
    });

    it("renders normally when standalone", () => {
      render(<Input label="Standalone Label" helperText="Standalone help" />);
      expect(screen.getByText("Standalone Label")).toBeInTheDocument();
      expect(screen.getByText("Standalone help")).toBeInTheDocument();
    });
  });
});
