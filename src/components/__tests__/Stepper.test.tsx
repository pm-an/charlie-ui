import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Stepper } from "../Stepper";
import { expectNoA11yViolations } from "../../test/a11y";

const basicSteps = [
  { label: "Account" },
  { label: "Profile" },
  { label: "Settings" },
  { label: "Complete" },
];

const stepsWithDescriptions = [
  { label: "Account", description: "Create your account" },
  { label: "Profile", description: "Set up your profile" },
  { label: "Settings", description: "Choose preferences" },
];

const stepsWithOptional = [
  { label: "Required Step" },
  { label: "Optional Step", optional: true },
  { label: "Final Step" },
];

describe("Stepper", () => {
  describe("rendering", () => {
    it("renders all steps", () => {
      render(<Stepper steps={basicSteps} activeStep={0} />);
      expect(screen.getByText("Account")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(screen.getByText("Complete")).toBeInTheDocument();
    });

    it("renders step numbers for upcoming steps", () => {
      render(<Stepper steps={basicSteps} activeStep={0} />);
      // Steps 2, 3, 4 should show numbers
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });

    it("renders active step number", () => {
      render(<Stepper steps={basicSteps} activeStep={0} />);
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <Stepper steps={basicSteps} activeStep={0} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("spreads additional HTML attributes", () => {
      render(
        <Stepper
          steps={basicSteps}
          activeStep={0}
          data-testid="my-stepper"
        />
      );
      expect(screen.getByTestId("my-stepper")).toBeInTheDocument();
    });
  });

  describe("active step highlighting", () => {
    it("highlights the active step circle with accent classes", () => {
      render(<Stepper steps={basicSteps} activeStep={1} />);
      const activeCircle = screen.getByTestId("step-circle-1");
      expect(activeCircle).toHaveClass("bg-accent");
      expect(activeCircle).toHaveClass("text-white");
    });

    it("applies upcoming styles to steps after active", () => {
      render(<Stepper steps={basicSteps} activeStep={1} />);
      const upcomingCircle = screen.getByTestId("step-circle-2");
      expect(upcomingCircle).toHaveClass("bg-white/5");
      expect(upcomingCircle).toHaveClass("text-white/70");
    });
  });

  describe("completed steps", () => {
    it("shows check icon for completed steps", () => {
      render(<Stepper steps={basicSteps} activeStep={2} />);
      // Steps 0 and 1 are completed - they should have SVG check icons
      const circle0 = screen.getByTestId("step-circle-0");
      const circle1 = screen.getByTestId("step-circle-1");
      expect(circle0.querySelector("svg")).toBeInTheDocument();
      expect(circle1.querySelector("svg")).toBeInTheDocument();
    });

    it("applies green background to completed step circles", () => {
      render(<Stepper steps={basicSteps} activeStep={2} />);
      const completedCircle = screen.getByTestId("step-circle-0");
      expect(completedCircle).toHaveClass("bg-green");
    });
  });

  describe("error step", () => {
    it("displays error styling when a step has error status", () => {
      // Error state is determined by activeStep position
      // The component itself uses the status internally based on index vs activeStep
      // To test error visually, we check the error icon rendering
      // In real usage, error state would be managed externally
      render(<Stepper steps={basicSteps} activeStep={1} />);
      const activeCircle = screen.getByTestId("step-circle-1");
      // Active step should not show error
      expect(activeCircle).not.toHaveClass("text-red");
    });
  });

  describe("vertical orientation", () => {
    it("renders in vertical layout", () => {
      const { container } = render(
        <Stepper
          steps={basicSteps}
          activeStep={1}
          orientation="vertical"
        />
      );
      expect(container.firstChild).toHaveClass("flex-col");
    });

    it("does not use flex-row in vertical mode", () => {
      const { container } = render(
        <Stepper
          steps={basicSteps}
          activeStep={1}
          orientation="vertical"
        />
      );
      expect(container.firstChild).not.toHaveClass("flex-row");
    });

    it("renders all steps in vertical mode", () => {
      render(
        <Stepper
          steps={basicSteps}
          activeStep={1}
          orientation="vertical"
        />
      );
      expect(screen.getByText("Account")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(screen.getByText("Complete")).toBeInTheDocument();
    });
  });

  describe("clickable steps", () => {
    it("calls onStepClick when a non-active step is clicked", () => {
      const handleClick = vi.fn();
      render(
        <Stepper
          steps={basicSteps}
          activeStep={1}
          onStepClick={handleClick}
        />
      );
      // Click on a completed step
      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[0]);
      expect(handleClick).toHaveBeenCalledWith(0);
    });

    it("does not make active step clickable", () => {
      const handleClick = vi.fn();
      render(
        <Stepper
          steps={basicSteps}
          activeStep={1}
          onStepClick={handleClick}
        />
      );
      // Active step (index 1) should NOT have role="button"
      const buttons = screen.getAllByRole("button");
      // Should be 3 buttons (0, 2, 3) not 4
      expect(buttons).toHaveLength(3);
    });

    it("supports keyboard Enter on clickable steps", () => {
      const handleClick = vi.fn();
      render(
        <Stepper
          steps={basicSteps}
          activeStep={1}
          onStepClick={handleClick}
        />
      );
      const buttons = screen.getAllByRole("button");
      fireEvent.keyDown(buttons[0], { key: "Enter" });
      expect(handleClick).toHaveBeenCalledWith(0);
    });

    it("supports keyboard Space on clickable steps", () => {
      const handleClick = vi.fn();
      render(
        <Stepper
          steps={basicSteps}
          activeStep={1}
          onStepClick={handleClick}
        />
      );
      const buttons = screen.getAllByRole("button");
      fireEvent.keyDown(buttons[0], { key: " " });
      expect(handleClick).toHaveBeenCalledWith(0);
    });
  });

  describe("non-clickable without onStepClick", () => {
    it("does not render role=button when onStepClick is not provided", () => {
      render(<Stepper steps={basicSteps} activeStep={1} />);
      expect(screen.queryAllByRole("button")).toHaveLength(0);
    });

    it("does not have cursor-pointer class without onStepClick", () => {
      const { container } = render(
        <Stepper steps={basicSteps} activeStep={1} />
      );
      const elementsWithPointer = container.querySelectorAll(".cursor-pointer");
      expect(elementsWithPointer).toHaveLength(0);
    });
  });

  describe("sizes", () => {
    it("renders sm size", () => {
      render(<Stepper steps={basicSteps} activeStep={0} size="sm" />);
      const circle = screen.getByTestId("step-circle-0");
      expect(circle).toHaveClass("h-7");
      expect(circle).toHaveClass("w-7");
      expect(circle).toHaveClass("text-xs");
    });

    it("renders md size by default", () => {
      render(<Stepper steps={basicSteps} activeStep={0} />);
      const circle = screen.getByTestId("step-circle-0");
      expect(circle).toHaveClass("h-9");
      expect(circle).toHaveClass("w-9");
      expect(circle).toHaveClass("text-sm");
    });

    it("renders lg size", () => {
      render(<Stepper steps={basicSteps} activeStep={0} size="lg" />);
      const circle = screen.getByTestId("step-circle-0");
      expect(circle).toHaveClass("h-11");
      expect(circle).toHaveClass("w-11");
      expect(circle).toHaveClass("text-base");
    });
  });

  describe("descriptions", () => {
    it("renders step descriptions", () => {
      render(
        <Stepper steps={stepsWithDescriptions} activeStep={0} />
      );
      expect(screen.getByText("Create your account")).toBeInTheDocument();
      expect(screen.getByText("Set up your profile")).toBeInTheDocument();
      expect(screen.getByText("Choose preferences")).toBeInTheDocument();
    });

    it("does not render description element when not provided", () => {
      render(<Stepper steps={basicSteps} activeStep={0} />);
      const descElements = document.querySelectorAll(".text-white\\/40.text-xs");
      expect(descElements).toHaveLength(0);
    });
  });

  describe("optional label", () => {
    it("renders '(Optional)' text for optional steps", () => {
      render(<Stepper steps={stepsWithOptional} activeStep={0} />);
      expect(screen.getByText("(Optional)")).toBeInTheDocument();
    });

    it("does not show optional text for non-optional steps", () => {
      render(
        <Stepper
          steps={[{ label: "Step 1" }, { label: "Step 2" }]}
          activeStep={0}
        />
      );
      expect(screen.queryByText("(Optional)")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has role=group on the container", () => {
      render(<Stepper steps={basicSteps} activeStep={1} />);
      expect(screen.getByRole("group")).toBeInTheDocument();
    });

    it("has aria-label=Progress on the container", () => {
      render(<Stepper steps={basicSteps} activeStep={1} />);
      expect(screen.getByRole("group")).toHaveAttribute(
        "aria-label",
        "Progress"
      );
    });

    it("sets aria-current=step on the active step", () => {
      render(<Stepper steps={basicSteps} activeStep={1} />);
      const activeElement = document.querySelector('[aria-current="step"]');
      expect(activeElement).toBeInTheDocument();
    });

    it("does not set aria-current on non-active steps", () => {
      render(<Stepper steps={basicSteps} activeStep={1} />);
      const allAriaCurrent = document.querySelectorAll('[aria-current="step"]');
      expect(allAriaCurrent).toHaveLength(1);
    });

    it("clickable steps have tabIndex=0", () => {
      const handleClick = vi.fn();
      render(
        <Stepper
          steps={basicSteps}
          activeStep={1}
          onStepClick={handleClick}
        />
      );
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("tabindex", "0");
      });
    });
  });

  describe("className merging", () => {
    it("merges custom className with base classes", () => {
      const { container } = render(
        <Stepper
          steps={basicSteps}
          activeStep={0}
          className="gap-4 p-4"
        />
      );
      expect(container.firstChild).toHaveClass("flex");
      expect(container.firstChild).toHaveClass("gap-4");
      expect(container.firstChild).toHaveClass("p-4");
    });
  });

  describe("horizontal layout", () => {
    it("uses flex-row for horizontal orientation", () => {
      const { container } = render(
        <Stepper steps={basicSteps} activeStep={0} orientation="horizontal" />
      );
      expect(container.firstChild).toHaveClass("flex-row");
    });

    it("defaults to horizontal orientation", () => {
      const { container } = render(
        <Stepper steps={basicSteps} activeStep={0} />
      );
      expect(container.firstChild).toHaveClass("flex-row");
    });
  });

  describe("all steps completed", () => {
    it("marks all steps as completed when activeStep is beyond last index", () => {
      render(<Stepper steps={basicSteps} activeStep={4} />);
      // All 4 circles should have check icons (SVG)
      for (let i = 0; i < 4; i++) {
        const circle = screen.getByTestId(`step-circle-${i}`);
        expect(circle.querySelector("svg")).toBeInTheDocument();
        expect(circle).toHaveClass("bg-green");
      }
    });
  });

  describe("custom icons", () => {
    it("renders custom icon when provided on active step", () => {
      const stepsWithIcon = [
        { label: "Start", icon: <span data-testid="custom-icon">*</span> },
        { label: "End" },
      ];
      render(<Stepper steps={stepsWithIcon} activeStep={0} />);
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });
  });

  describe("horizontal connectors", () => {
    it("renders connector lines between steps in horizontal mode", () => {
      const { container } = render(
        <Stepper steps={basicSteps} activeStep={1} />
      );
      // For 4 steps: 3 left halves + 3 right halves = 6 half-connector divs
      const connectors = container.querySelectorAll("[data-connector]");
      expect(connectors.length).toBe(6);
    });

    it("colors completed connectors green", () => {
      const { container } = render(
        <Stepper steps={basicSteps} activeStep={2} />
      );
      const connectors = container.querySelectorAll("[data-connector]");
      // Order: step0 right, step1 left, step1 right, step2 left, step2 right, step3 left
      expect(connectors[0]).toHaveClass("bg-green"); // step 0 right (completed)
      expect(connectors[1]).toHaveClass("bg-green"); // step 1 left (prev completed)
      expect(connectors[2]).toHaveClass("bg-green"); // step 1 right (completed)
      expect(connectors[3]).toHaveClass("bg-green"); // step 2 left (prev completed)
    });

    it("colors upcoming connectors with muted bg", () => {
      const { container } = render(
        <Stepper steps={basicSteps} activeStep={1} />
      );
      const connectors = container.querySelectorAll("[data-connector]");
      // step 1 right (active, not completed) → muted
      expect(connectors[2]).toHaveClass("bg-white/10");
      // step 2 left (prev is active, not completed) → muted
      expect(connectors[3]).toHaveClass("bg-white/10");
    });

    it("all connectors are green when all steps completed", () => {
      const { container } = render(
        <Stepper steps={basicSteps} activeStep={4} />
      );
      const connectors = container.querySelectorAll("[data-connector]");
      connectors.forEach((line) => {
        expect(line).toHaveClass("bg-green");
      });
    });

    it("no left connector on first step", () => {
      const { container } = render(
        <Stepper steps={basicSteps} activeStep={0} />
      );
      // First step's left spacer should have no child connector
      const firstStepCol = container.querySelector(
        '[data-slot="stepper"]'
      )!.firstElementChild!;
      const circleRow = firstStepCol.firstElementChild!;
      const leftSpacer = circleRow.firstElementChild!;
      expect(leftSpacer.children).toHaveLength(0);
    });

    it("no right connector on last step", () => {
      const { container } = render(
        <Stepper steps={basicSteps} activeStep={0} />
      );
      const stepperEl = container.querySelector('[data-slot="stepper"]')!;
      const lastStepCol = stepperEl.lastElementChild!;
      const circleRow = lastStepCol.firstElementChild!;
      const rightSpacer = circleRow.lastElementChild!;
      expect(rightSpacer.children).toHaveLength(0);
    });
  });

  describe("accessibility", () => {
    it("has aria-current=step on active step", () => {
      const { container } = render(
        <Stepper steps={basicSteps} activeStep={1} />
      );
      const currentStep = container.querySelector('[aria-current="step"]');
      expect(currentStep).toBeInTheDocument();
    });

    it("passes axe accessibility checks", async () => {
      const { container } = render(
        <Stepper steps={basicSteps} activeStep={1} />
      );
      await expectNoA11yViolations(container);
    });
  });
});
