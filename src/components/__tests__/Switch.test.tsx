import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Switch } from "../Switch";
import { Field } from "../Field";

describe("Switch", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<Switch />);
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("renders a hidden checkbox input for form compatibility", () => {
      render(<Switch name="notifications" />);
      const checkbox = document.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute("name", "notifications");
    });

    it("renders label when provided", () => {
      render(<Switch label="Enable notifications" />);
      expect(screen.getByText("Enable notifications")).toBeInTheDocument();
    });

    it("renders description when provided", () => {
      render(
        <Switch
          label="Email digest"
          description="Receive a weekly summary"
        />
      );
      expect(screen.getByText("Receive a weekly summary")).toBeInTheDocument();
    });

    it("does not render label/description container when neither provided", () => {
      const { container } = render(<Switch />);
      expect(container.querySelector(".flex.flex-col.gap-0\\.5")).not.toBeInTheDocument();
    });
  });

  describe("sizes", () => {
    it("renders each size without errors", () => {
      const sizes = ["sm", "md", "lg"] as const;
      sizes.forEach((size) => {
        const { unmount } = render(<Switch size={size} />);
        expect(screen.getByRole("switch")).toBeInTheDocument();
        unmount();
      });
    });

    it("applies sm size classes", () => {
      render(<Switch size="sm" />);
      const switchEl = screen.getByRole("switch");
      expect(switchEl).toHaveClass("h-5", "w-9");
    });

    it("applies md size classes by default", () => {
      render(<Switch />);
      const switchEl = screen.getByRole("switch");
      expect(switchEl).toHaveClass("h-7", "w-12");
    });

    it("applies lg size classes", () => {
      render(<Switch size="lg" />);
      const switchEl = screen.getByRole("switch");
      expect(switchEl).toHaveClass("h-8", "w-14");
    });
  });

  describe("interactions", () => {
    it("calls onChange when clicked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} />);
      await user.click(screen.getByRole("switch"));
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it("calls onChange with false when checked is true", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Switch checked onChange={onChange} />);
      await user.click(screen.getByRole("switch"));
      expect(onChange).toHaveBeenCalledWith(false);
    });

    it("does not call onChange when disabled", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Switch disabled onChange={onChange} />);
      await user.click(screen.getByRole("switch"));
      expect(onChange).not.toHaveBeenCalled();
    });

    it("toggles via hidden checkbox onChange", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} />);
      // Click the label wrapping element which toggles via the checkbox
      const checkbox = document.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      await user.click(checkbox);
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("has role switch", () => {
      render(<Switch />);
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("has correct aria-checked when unchecked", () => {
      render(<Switch checked={false} />);
      expect(screen.getByRole("switch")).toHaveAttribute(
        "aria-checked",
        "false"
      );
    });

    it("has correct aria-checked when checked", () => {
      render(<Switch checked />);
      expect(screen.getByRole("switch")).toHaveAttribute(
        "aria-checked",
        "true"
      );
    });

    it("is disabled when disabled prop is set", () => {
      render(<Switch disabled />);
      expect(screen.getByRole("switch")).toBeDisabled();
    });

    it("connects label via aria-labelledby", () => {
      render(<Switch label="Dark mode" id="dark-mode" />);
      const switchEl = screen.getByRole("switch");
      expect(switchEl).toHaveAttribute("aria-labelledby");
      const labelId = switchEl.getAttribute("aria-labelledby");
      expect(document.getElementById(labelId!)).toHaveTextContent("Dark mode");
    });

    it("connects description via aria-describedby", () => {
      render(
        <Switch
          label="Sounds"
          description="Play sounds for notifications"
          id="sounds"
        />
      );
      const switchEl = screen.getByRole("switch");
      expect(switchEl).toHaveAttribute("aria-describedby");
      const descId = switchEl.getAttribute("aria-describedby");
      expect(document.getElementById(descId!)).toHaveTextContent(
        "Play sounds for notifications"
      );
    });
  });

  describe("refs", () => {
    it("forwards ref to the hidden input", () => {
      const ref = vi.fn<(node: HTMLInputElement | null) => void>();
      render(<Switch ref={ref} />);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
    });
  });

  describe("props", () => {
    it("applies custom className to the switch button", () => {
      render(<Switch className="custom-switch" />);
      expect(screen.getByRole("switch")).toHaveClass("custom-switch");
    });

    it("passes name to the hidden input", () => {
      render(<Switch name="toggle-field" />);
      const checkbox = document.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      expect(checkbox).toHaveAttribute("name", "toggle-field");
    });

    it("passes id to the hidden input", () => {
      render(<Switch id="my-switch" />);
      const checkbox = document.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      expect(checkbox).toHaveAttribute("id", "my-switch");
    });
  });

  describe("uncontrolled mode", () => {
    it("works with defaultChecked=false", async () => {
      const user = userEvent.setup();
      render(<Switch defaultChecked={false} />);
      const switchEl = screen.getByRole("switch");
      expect(switchEl).toHaveAttribute("aria-checked", "false");
      await user.click(switchEl);
      expect(switchEl).toHaveAttribute("aria-checked", "true");
    });

    it("works with defaultChecked=true", () => {
      render(<Switch defaultChecked />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    });

    it("calls onChange in uncontrolled mode", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Switch defaultChecked={false} onChange={onChange} />);
      await user.click(screen.getByRole("switch"));
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  describe("visual states", () => {
    it("has accent background when checked", () => {
      render(<Switch checked />);
      expect(screen.getByRole("switch")).toHaveClass("bg-accent");
    });

    it("has muted background when unchecked", () => {
      render(<Switch checked={false} />);
      expect(screen.getByRole("switch")).toHaveClass("bg-white/10");
    });

    it("has opacity and cursor styles when disabled", () => {
      render(<Switch disabled />);
      expect(screen.getByRole("switch")).toHaveClass(
        "opacity-50",
        "cursor-not-allowed"
      );
    });
  });

  describe("Switch inside Field", () => {
    it("suppresses own label and description when inside Field", () => {
      render(
        <Field label="Field Label" error errorMessage="Field error">
          <Switch label="Own Label" description="Own description" />
        </Field>
      );
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.queryByText("Own Label")).not.toBeInTheDocument();
      expect(screen.queryByText("Own description")).not.toBeInTheDocument();
      expect(screen.getByText("Field error")).toBeInTheDocument();
    });

    it("renders normally when standalone", () => {
      render(<Switch label="Standalone Label" description="Standalone desc" />);
      expect(screen.getByText("Standalone Label")).toBeInTheDocument();
      expect(screen.getByText("Standalone desc")).toBeInTheDocument();
    });
  });
});
