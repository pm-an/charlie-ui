"use client";

import {
  forwardRef,
  useState,
  useCallback,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "../utils/cn";

export type OnboardingStep = {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  content: ReactNode;
};

export type OnboardingWizardProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  steps: OnboardingStep[];
  activeStep?: number;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
  completeLabel?: string;
  nextLabel?: string;
  backLabel?: string;
  showStepIndicator?: boolean;
};

const OnboardingWizard = forwardRef<HTMLDivElement, OnboardingWizardProps>(
  (
    {
      className,
      steps,
      activeStep: controlledStep,
      onStepChange,
      onComplete,
      completeLabel = "Get started",
      nextLabel = "Continue",
      backLabel = "Back",
      showStepIndicator = true,
      ...props
    },
    ref
  ) => {
    const [internalStep, setInternalStep] = useState(0);

    const isControlled = controlledStep !== undefined;
    const currentStep = isControlled ? controlledStep : internalStep;

    const goTo = useCallback(
      (step: number) => {
        if (isControlled) {
          onStepChange?.(step);
        } else {
          setInternalStep(step);
          onStepChange?.(step);
        }
      },
      [isControlled, onStepChange]
    );

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;

    const handleNext = () => {
      if (isLastStep) {
        onComplete?.();
      } else {
        goTo(currentStep + 1);
      }
    };

    const handleBack = () => {
      if (!isFirstStep) {
        goTo(currentStep - 1);
      }
    };

    const step = steps[currentStep];

    if (!step) return null;

    return (
      <div
        ref={ref}
        data-slot="onboarding-wizard"
        className={cn(
          "w-full max-w-2xl mx-auto bg-card-gradient rounded-xl border border-white/[0.06] overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Step indicator */}
        {showStepIndicator && (
          <div
            data-slot="onboarding-step-indicator"
            className="flex items-center justify-center gap-2 px-6 pt-6"
          >
            {steps.map((s, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;

              return (
                <div
                  key={s.id}
                  data-slot="onboarding-step-dot"
                  className={cn(
                    "flex items-center justify-center rounded-full transition-all duration-200",
                    isCompleted
                      ? "h-6 w-6 bg-green text-white"
                      : isActive
                        ? "h-6 w-6 bg-white/20 ring-2 ring-white/20"
                        : "h-6 w-6 bg-white/5"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isActive ? "text-white" : "text-white/40"
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Step title + description */}
        <div data-slot="onboarding-step-header" className="px-6 pt-6 text-center">
          {step.icon && (
            <div className="flex justify-center mb-3">
              <span className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/5 text-white/60">
                {step.icon}
              </span>
            </div>
          )}
          <h2 className="text-lg font-semibold text-white">{step.title}</h2>
          {step.description && (
            <p className="mt-1 text-sm text-white/60">{step.description}</p>
          )}
        </div>

        {/* Content area */}
        <div data-slot="onboarding-step-content" className="px-6 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.26 }}
            >
              {step.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom navigation */}
        <div
          data-slot="onboarding-footer"
          className="flex items-center justify-between px-6 pb-6"
        >
          <div>
            {!isFirstStep && (
              <button
                type="button"
                data-slot="onboarding-back-button"
                onClick={handleBack}
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/20 rounded-md transition-colors"
              >
                {backLabel}
              </button>
            )}
          </div>
          <button
            type="button"
            data-slot="onboarding-next-button"
            onClick={handleNext}
            className="px-4 py-2 text-sm font-medium text-[#18191a] bg-white/80 hover:bg-white rounded-md transition-colors"
          >
            {isLastStep ? completeLabel : nextLabel}
          </button>
        </div>
      </div>
    );
  }
);

OnboardingWizard.displayName = "OnboardingWizard";

export { OnboardingWizard };
