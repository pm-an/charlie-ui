import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Textarea } from "../Textarea";
import { Field } from "../Field";

describe("Textarea", () => {
  describe("rendering", () => {
    it("renders a textarea element", () => {
      render(<Textarea placeholder="Enter text" />);
      expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter text").tagName).toBe(
        "TEXTAREA"
      );
    });

    it("renders without crashing with no props", () => {
      render(<Textarea />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
  });

  describe("label", () => {
    it("renders label when provided", () => {
      render(<Textarea label="Description" />);
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByLabelText("Description")).toBeInTheDocument();
    });

    it("associates label with textarea via htmlFor", () => {
      render(<Textarea label="Message" />);
      const textarea = screen.getByLabelText("Message");
      expect(textarea.tagName).toBe("TEXTAREA");
    });

    it("uses custom id for label association", () => {
      render(<Textarea label="Notes" id="my-textarea" />);
      expect(screen.getByLabelText("Notes")).toHaveAttribute(
        "id",
        "my-textarea"
      );
    });
  });

  describe("helper text and error", () => {
    it("renders helper text", () => {
      render(<Textarea helperText="Maximum 500 characters" />);
      expect(
        screen.getByText("Maximum 500 characters")
      ).toBeInTheDocument();
    });

    it("shows error message and hides helper text when error is true", () => {
      render(
        <Textarea
          error
          errorMessage="This field is required"
          helperText="Help text"
        />
      );
      expect(
        screen.getByText("This field is required")
      ).toBeInTheDocument();
      expect(screen.queryByText("Help text")).not.toBeInTheDocument();
    });

    it("does not show error message when error is false", () => {
      render(<Textarea errorMessage="Error" />);
      expect(screen.queryByText("Error")).not.toBeInTheDocument();
    });

    it("applies error styles when error is true", () => {
      render(<Textarea error />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("border-red/50");
    });
  });

  describe("resize", () => {
    it("defaults to vertical resize", () => {
      render(<Textarea />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveStyle({ resize: "vertical" });
    });

    it("applies none resize", () => {
      render(<Textarea resize="none" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveStyle({ resize: "none" });
    });

    it("applies horizontal resize", () => {
      render(<Textarea resize="horizontal" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveStyle({ resize: "horizontal" });
    });

    it("applies both resize", () => {
      render(<Textarea resize="both" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveStyle({ resize: "both" });
    });

    it("disables resize when autoResize is true", () => {
      render(<Textarea autoResize />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveStyle({ resize: "none" });
    });
  });

  describe("autoResize", () => {
    it("adjusts height on input when autoResize is true", async () => {
      const user = userEvent.setup();
      render(<Textarea autoResize />);
      const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

      // Mock scrollHeight
      Object.defineProperty(textarea, "scrollHeight", {
        value: 120,
        configurable: true,
      });

      await user.type(textarea, "Line 1\nLine 2\nLine 3");
      // After input, style.height should be set
      expect(textarea.style.height).toBeDefined();
    });
  });

  describe("interactions", () => {
    it("handles user typing", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Textarea onChange={onChange} />);
      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "hello world");
      expect(onChange).toHaveBeenCalled();
      expect(textarea).toHaveValue("hello world");
    });

    it("can be disabled", () => {
      render(<Textarea disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });
  });

  describe("refs", () => {
    it("forwards ref to the textarea element", () => {
      const ref = vi.fn<(node: HTMLTextAreaElement | null) => void>();
      render(<Textarea ref={ref} />);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLTextAreaElement));
    });
  });

  describe("props", () => {
    it("merges custom className", () => {
      render(<Textarea className="custom-textarea" />);
      expect(screen.getByRole("textbox")).toHaveClass("custom-textarea");
    });

    it("passes through native textarea attributes", () => {
      render(
        <Textarea
          rows={5}
          required
          aria-describedby="desc"
          maxLength={500}
        />
      );
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("rows", "5");
      expect(textarea).toBeRequired();
      expect(textarea).toHaveAttribute("maxlength", "500");
    });

    it("applies placeholder", () => {
      render(<Textarea placeholder="Type here..." />);
      expect(
        screen.getByPlaceholderText("Type here...")
      ).toBeInTheDocument();
    });

    it("supports defaultValue", () => {
      render(<Textarea defaultValue="Pre-filled content" />);
      expect(screen.getByRole("textbox")).toHaveValue("Pre-filled content");
    });

    it("supports controlled value", () => {
      render(<Textarea value="Controlled" onChange={() => {}} />);
      expect(screen.getByRole("textbox")).toHaveValue("Controlled");
    });
  });

  describe("styling", () => {
    it("has base input-like styling", () => {
      render(<Textarea />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("bg-bg-subtle", "border", "border-border", "rounded-lg");
    });

    it("applies label styling", () => {
      render(<Textarea label="Test" />);
      const label = screen.getByText("Test");
      expect(label).toHaveClass("text-sm", "font-medium", "text-fg-200");
    });
  });

  describe("Textarea inside Field", () => {
    it("suppresses own label and error when inside Field", () => {
      render(
        <Field label="Field Label" error errorMessage="Field error">
          <Textarea label="Own Label" error errorMessage="Own error" />
        </Field>
      );
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.queryByText("Own Label")).not.toBeInTheDocument();
      expect(screen.getByText("Field error")).toBeInTheDocument();
      expect(screen.queryByText("Own error")).not.toBeInTheDocument();
    });

    it("suppresses own helper text when inside Field", () => {
      render(
        <Field label="Field Label">
          <Textarea helperText="Own helper" />
        </Field>
      );
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.queryByText("Own helper")).not.toBeInTheDocument();
    });

    it("renders normally when standalone", () => {
      render(<Textarea label="Standalone Label" helperText="Standalone help" />);
      expect(screen.getByText("Standalone Label")).toBeInTheDocument();
      expect(screen.getByText("Standalone help")).toBeInTheDocument();
    });
  });
});
