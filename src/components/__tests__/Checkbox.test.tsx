import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Checkbox } from "../Checkbox";
import { Field } from "../Field";

describe("Checkbox", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<Checkbox />);
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("renders with label text", () => {
      render(<Checkbox label="Accept terms" />);
      expect(screen.getByText("Accept terms")).toBeInTheDocument();
    });

    it("renders with description text", () => {
      render(
        <Checkbox label="Notifications" description="Receive email updates" />
      );
      expect(screen.getByText("Receive email updates")).toBeInTheDocument();
    });

    it("renders without label or description", () => {
      render(<Checkbox />);
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });
  });

  describe("checked state", () => {
    it("is unchecked by default", () => {
      render(<Checkbox />);
      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it("is checked when checked prop is true", () => {
      render(<Checkbox checked onChange={() => {}} />);
      expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("calls onChange when clicked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Checkbox checked={false} onChange={onChange} />);
      await user.click(screen.getByRole("checkbox"));
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("toggles from unchecked to checked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Checkbox checked={false} onChange={onChange} />);
      await user.click(screen.getByRole("checkbox"));
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe("indeterminate", () => {
    it("sets indeterminate on the input element", () => {
      render(<Checkbox indeterminate />);
      const input = screen.getByRole("checkbox") as HTMLInputElement;
      expect(input.indeterminate).toBe(true);
    });
  });

  describe("disabled", () => {
    it("disables the input when disabled prop is set", () => {
      render(<Checkbox disabled />);
      expect(screen.getByRole("checkbox")).toBeDisabled();
    });

    it("does not call onChange when disabled", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Checkbox disabled onChange={onChange} />);
      await user.click(screen.getByRole("checkbox"));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("error state", () => {
    it("renders error message when error and errorMessage are set", () => {
      render(
        <Checkbox error errorMessage="This field is required" />
      );
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });

    it("does not render error message when error is false", () => {
      render(<Checkbox errorMessage="This field is required" />);
      expect(
        screen.queryByText("This field is required")
      ).not.toBeInTheDocument();
    });

    it("sets aria-invalid when error is true", () => {
      render(<Checkbox error />);
      expect(screen.getByRole("checkbox")).toHaveAttribute(
        "aria-invalid",
        "true"
      );
    });
  });

  describe("sizes", () => {
    it.each(["sm", "md", "lg"] as const)(
      "renders %s size without error",
      (size) => {
        render(<Checkbox size={size} label={`Size ${size}`} />);
        expect(screen.getByRole("checkbox")).toBeInTheDocument();
      }
    );
  });

  describe("className merging", () => {
    it("merges custom className", () => {
      const { container } = render(
        <Checkbox className="custom-class" label="Test" />
      );
      expect(container.querySelector(".custom-class")).toBeInTheDocument();
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to the input element", () => {
      const ref = vi.fn<(node: HTMLInputElement | null) => void>();
      render(<Checkbox ref={ref} />);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
    });
  });

  describe("accessibility", () => {
    it("has checkbox role", () => {
      render(<Checkbox />);
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("is keyboard accessible", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Checkbox checked={false} onChange={onChange} label="Check me" />);
      const checkbox = screen.getByRole("checkbox");
      checkbox.focus();
      await user.keyboard(" ");
      expect(onChange).toHaveBeenCalled();
    });

    it("hidden input uses sr-only class", () => {
      render(<Checkbox />);
      const input = screen.getByRole("checkbox");
      expect(input).toHaveClass("sr-only");
    });
  });

  describe("Checkbox inside Field", () => {
    it("suppresses own error message when inside Field", () => {
      render(
        <Field label="Field Label" error errorMessage="Field error">
          <Checkbox label="Accept terms" error errorMessage="Own error" />
        </Field>
      );
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.getByText("Field error")).toBeInTheDocument();
      expect(screen.queryByText("Own error")).not.toBeInTheDocument();
    });

    it("suppresses own description when inside Field", () => {
      render(
        <Field label="Field Label">
          <Checkbox label="Accept" description="Own description" />
        </Field>
      );
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.queryByText("Own description")).not.toBeInTheDocument();
    });

    it("keeps inline label when inside Field", () => {
      render(
        <Field label="Field Label">
          <Checkbox label="Accept terms" />
        </Field>
      );
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.getByText("Accept terms")).toBeInTheDocument();
    });

    it("renders normally when standalone", () => {
      render(
        <Checkbox
          label="Standalone Label"
          description="Standalone description"
          error
          errorMessage="Standalone error"
        />
      );
      expect(screen.getByText("Standalone Label")).toBeInTheDocument();
      expect(screen.getByText("Standalone description")).toBeInTheDocument();
      expect(screen.getByText("Standalone error")).toBeInTheDocument();
    });
  });
});
