import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { OTPInput } from "../OTPInput";
import { Field } from "../Field";

describe("OTPInput", () => {
  describe("rendering", () => {
    it("renders correct number of slots (default 6)", () => {
      render(<OTPInput />);
      const slots = screen.getAllByTestId(/^otp-slot-/);
      expect(slots).toHaveLength(6);
    });

    it("renders correct number of slots when length is specified", () => {
      render(<OTPInput length={4} />);
      const slots = screen.getAllByTestId(/^otp-slot-/);
      expect(slots).toHaveLength(4);
    });

    it("renders hidden input", () => {
      render(<OTPInput />);
      expect(screen.getByTestId("otp-hidden-input")).toBeInTheDocument();
    });

    it("hidden input has sr-only class", () => {
      render(<OTPInput />);
      expect(screen.getByTestId("otp-hidden-input")).toHaveClass("sr-only");
    });
  });

  describe("typing fills slots", () => {
    it("fills slots sequentially when typing digits", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={4} />);
      const input = screen.getByTestId("otp-hidden-input");
      await user.click(input);
      await user.keyboard("1234");
      expect(screen.getByTestId("otp-slot-0")).toHaveTextContent("1");
      expect(screen.getByTestId("otp-slot-1")).toHaveTextContent("2");
      expect(screen.getByTestId("otp-slot-2")).toHaveTextContent("3");
      expect(screen.getByTestId("otp-slot-3")).toHaveTextContent("4");
    });

    it("does not exceed max length", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<OTPInput length={4} onChange={onChange} />);
      const input = screen.getByTestId("otp-hidden-input");
      await user.click(input);
      await user.keyboard("12345");
      // The last onChange call should be with 4 chars max
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
      expect(lastCall[0].length).toBeLessThanOrEqual(4);
    });
  });

  describe("backspace", () => {
    it("removes the last character on backspace", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={4} />);
      const input = screen.getByTestId("otp-hidden-input");
      await user.click(input);
      await user.keyboard("123");
      expect(screen.getByTestId("otp-slot-2")).toHaveTextContent("3");
      await user.keyboard("{Backspace}");
      expect(screen.getByTestId("otp-slot-2")).toHaveTextContent("");
    });
  });

  describe("paste", () => {
    it("fills all slots on paste", () => {
      const onComplete = vi.fn();
      render(<OTPInput length={4} onComplete={onComplete} />);
      const input = screen.getByTestId("otp-hidden-input");
      fireEvent.paste(input, {
        clipboardData: { getData: () => "1234" },
      });
      expect(screen.getByTestId("otp-slot-0")).toHaveTextContent("1");
      expect(screen.getByTestId("otp-slot-1")).toHaveTextContent("2");
      expect(screen.getByTestId("otp-slot-2")).toHaveTextContent("3");
      expect(screen.getByTestId("otp-slot-3")).toHaveTextContent("4");
      expect(onComplete).toHaveBeenCalledWith("1234");
    });

    it("truncates pasted text to length", () => {
      render(<OTPInput length={4} />);
      const input = screen.getByTestId("otp-hidden-input");
      fireEvent.paste(input, {
        clipboardData: { getData: () => "123456" },
      });
      expect(screen.getByTestId("otp-slot-0")).toHaveTextContent("1");
      expect(screen.getByTestId("otp-slot-3")).toHaveTextContent("4");
    });

    it("filters non-numeric characters on paste in numeric mode", () => {
      render(<OTPInput length={4} type="numeric" />);
      const input = screen.getByTestId("otp-hidden-input");
      fireEvent.paste(input, {
        clipboardData: { getData: () => "1a2b3c4d" },
      });
      expect(screen.getByTestId("otp-slot-0")).toHaveTextContent("1");
      expect(screen.getByTestId("otp-slot-1")).toHaveTextContent("2");
      expect(screen.getByTestId("otp-slot-2")).toHaveTextContent("3");
      expect(screen.getByTestId("otp-slot-3")).toHaveTextContent("4");
    });
  });

  describe("onComplete", () => {
    it("fires when all slots are filled", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<OTPInput length={4} onComplete={onComplete} />);
      const input = screen.getByTestId("otp-hidden-input");
      await user.click(input);
      await user.keyboard("1234");
      expect(onComplete).toHaveBeenCalledWith("1234");
    });

    it("does not fire when not all slots are filled", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<OTPInput length={4} onComplete={onComplete} />);
      const input = screen.getByTestId("otp-hidden-input");
      await user.click(input);
      await user.keyboard("123");
      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  describe("numeric type", () => {
    it("rejects letters in numeric mode", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<OTPInput length={4} type="numeric" onChange={onChange} />);
      const input = screen.getByTestId("otp-hidden-input");
      await user.click(input);
      await user.keyboard("a");
      // onChange should not be called with "a" (either not called, or called with "")
      if (onChange.mock.calls.length > 0) {
        const lastVal = onChange.mock.calls[onChange.mock.calls.length - 1][0];
        expect(lastVal).not.toContain("a");
      }
    });

    it("accepts digits in numeric mode", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={4} type="numeric" />);
      const input = screen.getByTestId("otp-hidden-input");
      await user.click(input);
      await user.keyboard("5");
      expect(screen.getByTestId("otp-slot-0")).toHaveTextContent("5");
    });
  });

  describe("alphanumeric type", () => {
    it("accepts letters and digits", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={4} type="alphanumeric" />);
      const input = screen.getByTestId("otp-hidden-input");
      await user.click(input);
      await user.keyboard("A1B2");
      expect(screen.getByTestId("otp-slot-0")).toHaveTextContent("A");
      expect(screen.getByTestId("otp-slot-1")).toHaveTextContent("1");
      expect(screen.getByTestId("otp-slot-2")).toHaveTextContent("B");
      expect(screen.getByTestId("otp-slot-3")).toHaveTextContent("2");
    });

    it("rejects special characters in alphanumeric mode", () => {
      render(<OTPInput length={4} type="alphanumeric" />);
      const input = screen.getByTestId("otp-hidden-input");
      fireEvent.paste(input, {
        clipboardData: { getData: () => "A@B#" },
      });
      expect(screen.getByTestId("otp-slot-0")).toHaveTextContent("A");
      expect(screen.getByTestId("otp-slot-1")).toHaveTextContent("B");
    });
  });

  describe("controlled value", () => {
    it("displays controlled value", () => {
      render(<OTPInput length={4} value="1234" />);
      expect(screen.getByTestId("otp-slot-0")).toHaveTextContent("1");
      expect(screen.getByTestId("otp-slot-1")).toHaveTextContent("2");
      expect(screen.getByTestId("otp-slot-2")).toHaveTextContent("3");
      expect(screen.getByTestId("otp-slot-3")).toHaveTextContent("4");
    });

    it("updates when controlled value changes", () => {
      const { rerender } = render(<OTPInput length={4} value="12" />);
      expect(screen.getByTestId("otp-slot-0")).toHaveTextContent("1");
      expect(screen.getByTestId("otp-slot-1")).toHaveTextContent("2");
      rerender(<OTPInput length={4} value="5678" />);
      expect(screen.getByTestId("otp-slot-0")).toHaveTextContent("5");
      expect(screen.getByTestId("otp-slot-3")).toHaveTextContent("8");
    });

    it("calls onChange with new value", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<OTPInput length={4} value="" onChange={onChange} />);
      const input = screen.getByTestId("otp-hidden-input");
      await user.click(input);
      await user.keyboard("1");
      expect(onChange).toHaveBeenCalledWith("1");
    });
  });

  describe("defaultValue", () => {
    it("prefills slots with defaultValue", () => {
      render(<OTPInput length={6} defaultValue="123456" />);
      expect(screen.getByTestId("otp-slot-0")).toHaveTextContent("1");
      expect(screen.getByTestId("otp-slot-5")).toHaveTextContent("6");
    });
  });

  describe("error state", () => {
    it("applies error styling to slots", () => {
      render(<OTPInput length={4} error />);
      const slot = screen.getByTestId("otp-slot-0");
      expect(slot.className).toContain("border-red");
    });

    it("renders error message when error and errorMessage are set", () => {
      render(<OTPInput length={4} error errorMessage="Invalid code" />);
      expect(screen.getByText("Invalid code")).toBeInTheDocument();
    });

    it("does not render error message when error is false", () => {
      render(<OTPInput length={4} error={false} errorMessage="Invalid code" />);
      expect(screen.queryByText("Invalid code")).not.toBeInTheDocument();
    });

    it("error message has correct classes", () => {
      render(<OTPInput length={4} error errorMessage="Bad code" />);
      const msg = screen.getByText("Bad code");
      expect(msg).toHaveClass("text-xs");
      expect(msg).toHaveClass("text-red");
    });
  });

  describe("disabled state", () => {
    it("disables the hidden input", () => {
      render(<OTPInput length={4} disabled />);
      expect(screen.getByTestId("otp-hidden-input")).toBeDisabled();
    });

    it("applies opacity to slots when disabled", () => {
      render(<OTPInput length={4} disabled />);
      const slot = screen.getByTestId("otp-slot-0");
      expect(slot.className).toContain("opacity-50");
    });
  });

  describe("label", () => {
    it("renders label when provided", () => {
      render(<OTPInput length={4} label="Enter code" />);
      expect(screen.getByText("Enter code")).toBeInTheDocument();
    });

    it("does not render label when not provided", () => {
      const { container } = render(<OTPInput length={4} />);
      expect(container.querySelector("label")).not.toBeInTheDocument();
    });

    it("label has correct classes", () => {
      render(<OTPInput length={4} label="Code" />);
      const label = screen.getByText("Code");
      expect(label).toHaveClass("text-sm");
      expect(label).toHaveClass("font-medium");
    });
  });

  describe("separator", () => {
    it("renders separators at correct positions", () => {
      render(<OTPInput length={6} separator={3} />);
      // Separator after index 2 (3rd digit)
      expect(screen.getByTestId("otp-separator-2")).toBeInTheDocument();
      // No separator after last slot
      expect(screen.queryByTestId("otp-separator-5")).not.toBeInTheDocument();
    });

    it("separator displays dash character", () => {
      render(<OTPInput length={6} separator={3} />);
      expect(screen.getByTestId("otp-separator-2")).toHaveTextContent("-");
    });

    it("renders multiple separators for separator=2 with length=6", () => {
      render(<OTPInput length={6} separator={2} />);
      expect(screen.getByTestId("otp-separator-1")).toBeInTheDocument();
      expect(screen.getByTestId("otp-separator-3")).toBeInTheDocument();
    });

    it("does not render separators when separator is not set", () => {
      render(<OTPInput length={6} />);
      expect(screen.queryByTestId(/^otp-separator-/)).not.toBeInTheDocument();
    });
  });

  describe("sizes", () => {
    it.each(["sm", "md", "lg"] as const)("renders %s size", (size) => {
      render(<OTPInput length={4} size={size} />);
      const slots = screen.getAllByTestId(/^otp-slot-/);
      expect(slots).toHaveLength(4);
    });

    it("applies sm size classes to slots", () => {
      render(<OTPInput length={4} size="sm" />);
      const slot = screen.getByTestId("otp-slot-0");
      expect(slot.className).toContain("h-9");
      expect(slot.className).toContain("w-8");
    });

    it("applies md size classes to slots", () => {
      render(<OTPInput length={4} size="md" />);
      const slot = screen.getByTestId("otp-slot-0");
      expect(slot.className).toContain("h-11");
      expect(slot.className).toContain("w-10");
    });

    it("applies lg size classes to slots", () => {
      render(<OTPInput length={4} size="lg" />);
      const slot = screen.getByTestId("otp-slot-0");
      expect(slot.className).toContain("h-14");
      expect(slot.className).toContain("w-12");
    });

    it("applies sm gap class to container", () => {
      render(<OTPInput length={4} size="sm" />);
      const container = screen.getByTestId("otp-container");
      expect(container.className).toContain("gap-1.5");
    });

    it("applies lg gap class to container", () => {
      render(<OTPInput length={4} size="lg" />);
      const container = screen.getByTestId("otp-container");
      expect(container.className).toContain("gap-3");
    });
  });

  describe("autoFocus", () => {
    it("auto-focuses the hidden input when autoFocus is true", () => {
      render(<OTPInput length={4} autoFocus />);
      expect(screen.getByTestId("otp-hidden-input")).toHaveFocus();
    });

    it("does not auto-focus when autoFocus is false", () => {
      render(<OTPInput length={4} />);
      expect(screen.getByTestId("otp-hidden-input")).not.toHaveFocus();
    });
  });

  describe("className merging", () => {
    it("merges custom className on the root div", () => {
      const { container } = render(<OTPInput length={4} className="custom-class" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("clicking a slot focuses the input", () => {
    it("focuses hidden input when a slot is clicked", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={4} />);
      const container = screen.getByTestId("otp-container");
      await user.click(container);
      expect(screen.getByTestId("otp-hidden-input")).toHaveFocus();
    });

    it("does not focus when disabled", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={4} disabled />);
      const container = screen.getByTestId("otp-container");
      await user.click(container);
      expect(screen.getByTestId("otp-hidden-input")).not.toHaveFocus();
    });
  });

  describe("accessibility", () => {
    it("hidden input has autoComplete one-time-code", () => {
      render(<OTPInput length={4} />);
      expect(screen.getByTestId("otp-hidden-input")).toHaveAttribute(
        "autoComplete",
        "one-time-code",
      );
    });

    it("hidden input has aria-label", () => {
      render(<OTPInput length={4} />);
      expect(screen.getByTestId("otp-hidden-input")).toHaveAttribute(
        "aria-label",
        "One-time password",
      );
    });

    it("uses custom label for aria-label", () => {
      render(<OTPInput length={4} label="Verification Code" />);
      expect(screen.getByTestId("otp-hidden-input")).toHaveAttribute(
        "aria-label",
        "Verification Code",
      );
    });

    it("hidden input has numeric inputMode for numeric type", () => {
      render(<OTPInput length={4} type="numeric" />);
      expect(screen.getByTestId("otp-hidden-input")).toHaveAttribute(
        "inputMode",
        "numeric",
      );
    });

    it("hidden input has text inputMode for alphanumeric type", () => {
      render(<OTPInput length={4} type="alphanumeric" />);
      expect(screen.getByTestId("otp-hidden-input")).toHaveAttribute(
        "inputMode",
        "text",
      );
    });
  });

  describe("displayName", () => {
    it("has correct displayName", () => {
      expect(OTPInput.displayName).toBe("OTPInput");
    });
  });

  describe("OTPInput inside Field", () => {
    it("suppresses own label and error when inside Field", () => {
      render(
        <Field label="Field Label" error errorMessage="Field error">
          <OTPInput length={4} label="Own Label" error errorMessage="Own error" />
        </Field>
      );
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.queryByText("Own Label")).not.toBeInTheDocument();
      expect(screen.getByText("Field error")).toBeInTheDocument();
      expect(screen.queryByText("Own error")).not.toBeInTheDocument();
    });

    it("renders normally when standalone", () => {
      render(
        <OTPInput length={4} label="Standalone Label" error errorMessage="Standalone error" />
      );
      expect(screen.getByText("Standalone Label")).toBeInTheDocument();
      expect(screen.getByText("Standalone error")).toBeInTheDocument();
    });
  });
});
