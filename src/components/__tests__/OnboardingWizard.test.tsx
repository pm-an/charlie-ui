import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { OnboardingWizard } from "../OnboardingWizard";

const defaultSteps = [
  {
    id: "step-1",
    title: "Welcome",
    description: "Let's get started",
    content: <div>Step 1 content</div>,
  },
  {
    id: "step-2",
    title: "Configure",
    description: "Set up your preferences",
    content: <div>Step 2 content</div>,
  },
  {
    id: "step-3",
    title: "Complete",
    description: "You're all done",
    content: <div>Step 3 content</div>,
  },
];

describe("OnboardingWizard", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<OnboardingWizard steps={defaultSteps} />);
      expect(screen.getByText("Welcome")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(<OnboardingWizard steps={defaultSteps} />);
      expect(container.querySelector("[data-slot='onboarding-wizard']")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <OnboardingWizard steps={defaultSteps} className="my-custom" />
      );
      expect(container.firstChild).toHaveClass("my-custom");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<OnboardingWizard steps={defaultSteps} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("renders step title and description", () => {
      render(<OnboardingWizard steps={defaultSteps} />);
      expect(screen.getByText("Welcome")).toBeInTheDocument();
      expect(screen.getByText("Let's get started")).toBeInTheDocument();
    });

    it("renders step content", () => {
      render(<OnboardingWizard steps={defaultSteps} />);
      expect(screen.getByText("Step 1 content")).toBeInTheDocument();
    });
  });

  describe("step indicator", () => {
    it("renders step indicators by default", () => {
      const { container } = render(<OnboardingWizard steps={defaultSteps} />);
      const indicator = container.querySelector("[data-slot='onboarding-step-indicator']");
      expect(indicator).toBeInTheDocument();
      const dots = container.querySelectorAll("[data-slot='onboarding-step-dot']");
      expect(dots.length).toBe(3);
    });

    it("hides step indicators when showStepIndicator is false", () => {
      const { container } = render(
        <OnboardingWizard steps={defaultSteps} showStepIndicator={false} />
      );
      expect(container.querySelector("[data-slot='onboarding-step-indicator']")).not.toBeInTheDocument();
    });

    it("shows step numbers for upcoming and active steps", () => {
      render(<OnboardingWizard steps={defaultSteps} />);
      // First step (active) shows "1", second shows "2", third shows "3"
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  describe("navigation - uncontrolled", () => {
    it("shows Continue button on non-last step", () => {
      render(<OnboardingWizard steps={defaultSteps} />);
      expect(screen.getByText("Continue")).toBeInTheDocument();
    });

    it("hides Back button on first step", () => {
      render(<OnboardingWizard steps={defaultSteps} />);
      expect(screen.queryByText("Back")).not.toBeInTheDocument();
    });

    it("advances to next step on Continue click", async () => {
      render(<OnboardingWizard steps={defaultSteps} />);
      fireEvent.click(screen.getByText("Continue"));
      expect(screen.getByText("Configure")).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByText("Step 2 content")).toBeInTheDocument();
      });
    });

    it("shows Back button on second step", () => {
      render(<OnboardingWizard steps={defaultSteps} />);
      fireEvent.click(screen.getByText("Continue"));
      expect(screen.getByText("Back")).toBeInTheDocument();
    });

    it("goes back to previous step on Back click", () => {
      render(<OnboardingWizard steps={defaultSteps} />);
      fireEvent.click(screen.getByText("Continue"));
      expect(screen.getByText("Configure")).toBeInTheDocument();
      fireEvent.click(screen.getByText("Back"));
      expect(screen.getByText("Welcome")).toBeInTheDocument();
    });

    it("shows complete label on last step", () => {
      render(<OnboardingWizard steps={defaultSteps} />);
      fireEvent.click(screen.getByText("Continue"));
      fireEvent.click(screen.getByText("Continue"));
      expect(screen.getByText("Get started")).toBeInTheDocument();
    });

    it("calls onComplete on last step button click", () => {
      const onComplete = vi.fn();
      render(<OnboardingWizard steps={defaultSteps} onComplete={onComplete} />);
      fireEvent.click(screen.getByText("Continue"));
      fireEvent.click(screen.getByText("Continue"));
      fireEvent.click(screen.getByText("Get started"));
      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe("navigation - controlled", () => {
    it("uses controlled activeStep", () => {
      render(<OnboardingWizard steps={defaultSteps} activeStep={1} />);
      expect(screen.getByText("Configure")).toBeInTheDocument();
      expect(screen.getByText("Step 2 content")).toBeInTheDocument();
    });

    it("calls onStepChange when Continue is clicked", () => {
      const onStepChange = vi.fn();
      render(
        <OnboardingWizard
          steps={defaultSteps}
          activeStep={0}
          onStepChange={onStepChange}
        />
      );
      fireEvent.click(screen.getByText("Continue"));
      expect(onStepChange).toHaveBeenCalledWith(1);
    });

    it("calls onStepChange when Back is clicked", () => {
      const onStepChange = vi.fn();
      render(
        <OnboardingWizard
          steps={defaultSteps}
          activeStep={1}
          onStepChange={onStepChange}
        />
      );
      fireEvent.click(screen.getByText("Back"));
      expect(onStepChange).toHaveBeenCalledWith(0);
    });

    it("shows last step when activeStep is last index", () => {
      render(<OnboardingWizard steps={defaultSteps} activeStep={2} />);
      expect(screen.getByText("Complete")).toBeInTheDocument();
      expect(screen.getByText("Get started")).toBeInTheDocument();
    });
  });

  describe("custom labels", () => {
    it("uses custom nextLabel", () => {
      render(
        <OnboardingWizard steps={defaultSteps} nextLabel="Next step" />
      );
      expect(screen.getByText("Next step")).toBeInTheDocument();
    });

    it("uses custom backLabel", () => {
      render(
        <OnboardingWizard
          steps={defaultSteps}
          activeStep={1}
          backLabel="Go back"
        />
      );
      expect(screen.getByText("Go back")).toBeInTheDocument();
    });

    it("uses custom completeLabel", () => {
      render(
        <OnboardingWizard
          steps={defaultSteps}
          activeStep={2}
          completeLabel="Finish setup"
        />
      );
      expect(screen.getByText("Finish setup")).toBeInTheDocument();
    });
  });

  describe("step icon", () => {
    it("renders step icon when provided", () => {
      const stepsWithIcon = [
        {
          ...defaultSteps[0],
          icon: <span data-testid="step-icon">Icon</span>,
        },
        ...defaultSteps.slice(1),
      ];
      render(<OnboardingWizard steps={stepsWithIcon} />);
      expect(screen.getByTestId("step-icon")).toBeInTheDocument();
    });

    it("does not render icon area when not provided", () => {
      const { container } = render(<OnboardingWizard steps={defaultSteps} />);
      const header = container.querySelector("[data-slot='onboarding-step-header']");
      // No icon container should be rendered
      const iconContainer = header?.querySelector(".h-10.w-10");
      expect(iconContainer).not.toBeInTheDocument();
    });
  });

  describe("step description", () => {
    it("renders description when provided", () => {
      render(<OnboardingWizard steps={defaultSteps} />);
      expect(screen.getByText("Let's get started")).toBeInTheDocument();
    });

    it("does not render description when not provided", () => {
      const stepsNoDesc = [
        { id: "s1", title: "No Desc Step", content: <div>Content</div> },
      ];
      render(<OnboardingWizard steps={stepsNoDesc} />);
      expect(screen.getByText("No Desc Step")).toBeInTheDocument();
      // No description paragraph should be rendered
      const header = document.querySelector("[data-slot='onboarding-step-header']");
      const paragraphs = header?.querySelectorAll("p");
      expect(paragraphs?.length ?? 0).toBe(0);
    });
  });

  describe("displayName", () => {
    it("has correct displayName", () => {
      expect(OnboardingWizard.displayName).toBe("OnboardingWizard");
    });
  });
});
