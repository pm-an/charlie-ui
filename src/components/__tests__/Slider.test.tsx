import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Slider } from "../Slider";
import { Field } from "../Field";

describe("Slider", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<Slider />);
      expect(screen.getByRole("slider")).toBeInTheDocument();
    });

    it("renders label when provided", () => {
      render(<Slider label="Volume" />);
      expect(screen.getByText("Volume")).toBeInTheDocument();
    });

    it("renders current value when showValue is true", () => {
      render(<Slider value={42} showValue />);
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("does not render value when showValue is false", () => {
      render(<Slider value={42} />);
      expect(screen.queryByText("42")).not.toBeInTheDocument();
    });

    it("renders label and value together", () => {
      render(<Slider label="Brightness" value={80} showValue />);
      expect(screen.getByText("Brightness")).toBeInTheDocument();
      expect(screen.getByText("80")).toBeInTheDocument();
    });
  });

  describe("marks", () => {
    it("renders marks when provided", () => {
      render(
        <Slider
          marks={[
            { value: 0, label: "Min" },
            { value: 50, label: "Mid" },
            { value: 100, label: "Max" },
          ]}
        />
      );
      expect(screen.getByText("Min")).toBeInTheDocument();
      expect(screen.getByText("Mid")).toBeInTheDocument();
      expect(screen.getByText("Max")).toBeInTheDocument();
    });

    it("does not render marks container when marks is empty", () => {
      const { container } = render(<Slider marks={[]} />);
      expect(container.querySelector(".relative.w-full.h-4")).not.toBeInTheDocument();
    });
  });

  describe("sizes", () => {
    it("renders each size without errors", () => {
      const sizes = ["sm", "md", "lg"] as const;
      sizes.forEach((size) => {
        const { unmount } = render(<Slider size={size} />);
        expect(screen.getByRole("slider")).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe("accessibility", () => {
    it("has role slider", () => {
      render(<Slider />);
      expect(screen.getByRole("slider")).toBeInTheDocument();
    });

    it("has correct aria-valuemin", () => {
      render(<Slider min={10} />);
      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-valuemin",
        "10"
      );
    });

    it("has correct aria-valuemax", () => {
      render(<Slider max={200} />);
      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-valuemax",
        "200"
      );
    });

    it("has correct aria-valuenow", () => {
      render(<Slider value={35} />);
      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-valuenow",
        "35"
      );
    });

    it("has horizontal orientation", () => {
      render(<Slider />);
      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-orientation",
        "horizontal"
      );
    });

    it("has aria-label from label prop", () => {
      render(<Slider label="Volume" />);
      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-label",
        "Volume"
      );
    });

    it("has aria-disabled when disabled", () => {
      render(<Slider disabled />);
      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-disabled",
        "true"
      );
    });

    it("has tabindex 0 when not disabled", () => {
      render(<Slider />);
      expect(screen.getByRole("slider")).toHaveAttribute("tabindex", "0");
    });

    it("has tabindex -1 when disabled", () => {
      render(<Slider disabled />);
      expect(screen.getByRole("slider")).toHaveAttribute("tabindex", "-1");
    });
  });

  describe("keyboard interactions", () => {
    it("increases value with ArrowRight", async () => {
      const onChange = vi.fn();
      render(<Slider value={50} step={1} onChange={onChange} />);
      const slider = screen.getByRole("slider");
      slider.focus();
      await userEvent.keyboard("{ArrowRight}");
      expect(onChange).toHaveBeenCalledWith(51);
    });

    it("decreases value with ArrowLeft", async () => {
      const onChange = vi.fn();
      render(<Slider value={50} step={1} onChange={onChange} />);
      const slider = screen.getByRole("slider");
      slider.focus();
      await userEvent.keyboard("{ArrowLeft}");
      expect(onChange).toHaveBeenCalledWith(49);
    });

    it("increases value with ArrowUp", async () => {
      const onChange = vi.fn();
      render(<Slider value={50} step={5} onChange={onChange} />);
      const slider = screen.getByRole("slider");
      slider.focus();
      await userEvent.keyboard("{ArrowUp}");
      expect(onChange).toHaveBeenCalledWith(55);
    });

    it("decreases value with ArrowDown", async () => {
      const onChange = vi.fn();
      render(<Slider value={50} step={5} onChange={onChange} />);
      const slider = screen.getByRole("slider");
      slider.focus();
      await userEvent.keyboard("{ArrowDown}");
      expect(onChange).toHaveBeenCalledWith(45);
    });

    it("goes to min with Home", async () => {
      const onChange = vi.fn();
      render(<Slider value={50} min={10} onChange={onChange} />);
      const slider = screen.getByRole("slider");
      slider.focus();
      await userEvent.keyboard("{Home}");
      expect(onChange).toHaveBeenCalledWith(10);
    });

    it("goes to max with End", async () => {
      const onChange = vi.fn();
      render(<Slider value={50} max={90} onChange={onChange} />);
      const slider = screen.getByRole("slider");
      slider.focus();
      await userEvent.keyboard("{End}");
      expect(onChange).toHaveBeenCalledWith(90);
    });

    it("clamps value at max", async () => {
      const onChange = vi.fn();
      render(<Slider value={100} max={100} step={1} onChange={onChange} />);
      const slider = screen.getByRole("slider");
      slider.focus();
      await userEvent.keyboard("{ArrowRight}");
      // Should not call onChange since value is already at max
      expect(onChange).not.toHaveBeenCalled();
    });

    it("clamps value at min", async () => {
      const onChange = vi.fn();
      render(<Slider value={0} min={0} step={1} onChange={onChange} />);
      const slider = screen.getByRole("slider");
      slider.focus();
      await userEvent.keyboard("{ArrowLeft}");
      // Should not call onChange since value is already at min
      expect(onChange).not.toHaveBeenCalled();
    });

    it("does not respond to keyboard when disabled", async () => {
      const onChange = vi.fn();
      render(<Slider value={50} disabled onChange={onChange} />);
      const slider = screen.getByRole("slider");
      fireEvent.keyDown(slider, { key: "ArrowRight" });
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("disabled state", () => {
    it("applies disabled styling", () => {
      const { container } = render(<Slider disabled />);
      expect(container.firstChild).toHaveClass(
        "opacity-65",
        "cursor-not-allowed"
      );
    });

    it("does not call onChange on pointer events when disabled", () => {
      const onChange = vi.fn();
      render(<Slider disabled onChange={onChange} />);
      const slider = screen.getByRole("slider");
      const track = slider.parentElement!;
      fireEvent.pointerDown(track, { clientX: 100 });
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("props", () => {
    it("applies custom className", () => {
      const { container } = render(<Slider className="custom-slider" />);
      expect(container.firstChild).toHaveClass("custom-slider");
    });

    it("forwards ref", () => {
      const ref = vi.fn<(node: HTMLDivElement | null) => void>();
      render(<Slider ref={ref} />);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });

    it("spreads additional HTML attributes", () => {
      render(<Slider data-testid="my-slider" />);
      expect(screen.getByTestId("my-slider")).toBeInTheDocument();
    });

    it("uses default min of 0", () => {
      render(<Slider />);
      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-valuemin",
        "0"
      );
    });

    it("uses default max of 100", () => {
      render(<Slider />);
      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-valuemax",
        "100"
      );
    });
  });

  describe("fill bar", () => {
    it("sets fill width based on value percentage", () => {
      const { container } = render(<Slider value={50} min={0} max={100} />);
      const fill = container.querySelector(".bg-accent");
      expect(fill).toBeInTheDocument();
      expect(fill).toHaveStyle({ width: "50%" });
    });

    it("shows 0% fill when value equals min", () => {
      const { container } = render(<Slider value={0} min={0} max={100} />);
      const fill = container.querySelector(".bg-accent");
      expect(fill).toHaveStyle({ width: "0%" });
    });

    it("shows 100% fill when value equals max", () => {
      const { container } = render(<Slider value={100} min={0} max={100} />);
      const fill = container.querySelector(".bg-accent");
      expect(fill).toHaveStyle({ width: "100%" });
    });

    it("calculates percentage correctly with custom range", () => {
      const { container } = render(<Slider value={75} min={50} max={100} />);
      const fill = container.querySelector(".bg-accent");
      expect(fill).toHaveStyle({ width: "50%" });
    });
  });

  describe("Slider inside Field", () => {
    it("suppresses own label when inside Field", () => {
      render(
        <Field label="Field Label">
          <Slider label="Own Label" value={50} />
        </Field>
      );
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.queryByText("Own Label")).not.toBeInTheDocument();
    });

    it("shows Field error when inside Field", () => {
      render(
        <Field label="Field Label" error errorMessage="Field error">
          <Slider label="Volume" value={50} />
        </Field>
      );
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.getByText("Field error")).toBeInTheDocument();
    });

    it("renders normally when standalone", () => {
      render(<Slider label="Standalone Label" value={50} />);
      expect(screen.getByText("Standalone Label")).toBeInTheDocument();
    });
  });
});
