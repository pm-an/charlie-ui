"use client";

import { type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";
import { cn } from "../utils/cn";

type StepStatus = "completed" | "active" | "upcoming" | "error";

export type StepItem = {
  label: string;
  description?: string;
  icon?: ReactNode;
  optional?: boolean;
};

const stepCircleVariants = cva(
  "relative z-10 flex shrink-0 items-center justify-center rounded-full font-medium transition-colors",
  {
    variants: {
      size: {
        sm: "h-7 w-7 text-xs",
        md: "h-9 w-9 text-sm",
        lg: "h-11 w-11 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export type StepperProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> &
  VariantProps<typeof stepCircleVariants> & {
    steps: StepItem[];
    activeStep: number;
    orientation?: "horizontal" | "vertical";
    onStepClick?: (stepIndex: number) => void;
  };

function getStepStatus(index: number, activeStep: number): StepStatus {
  if (index < activeStep) return "completed";
  if (index === activeStep) return "active";
  return "upcoming";
}

function getCircleClasses(status: StepStatus): string {
  switch (status) {
    case "completed":
      return "bg-green text-white";
    case "active":
      return "bg-accent text-white ring-2 ring-accent/30";
    case "upcoming":
      return "bg-white/5 border border-white/10 text-white/60";
    case "error":
      return "bg-red/20 border border-red/50 text-red";
  }
}

function getLabelClasses(status: StepStatus): string {
  switch (status) {
    case "completed":
      return "text-white/80";
    case "active":
      return "text-white";
    case "upcoming":
      return "text-white/60";
    case "error":
      return "text-red";
  }
}

function getConnectorClasses(
  fromStatus: StepStatus,
  toStatus: StepStatus
): string {
  if (fromStatus === "completed" && toStatus === "completed") return "bg-green";
  if (fromStatus === "completed" && toStatus === "active")
    return "bg-gradient-to-r from-green to-accent";
  return "bg-white/10";
}

function getVerticalConnectorClasses(
  fromStatus: StepStatus,
  toStatus: StepStatus
): string {
  if (fromStatus === "completed" && toStatus === "completed") return "bg-green";
  if (fromStatus === "completed" && toStatus === "active")
    return "bg-gradient-to-b from-green to-accent";
  return "bg-white/10";
}

function StepCircle({
  status,
  index,
  icon,
  size,
}: {
  status: StepStatus;
  index: number;
  icon?: ReactNode;
  size: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={cn(stepCircleVariants({ size }), getCircleClasses(status))}
      data-testid={`step-circle-${index}`}
    >
      <AnimatePresence mode="wait">
        {status === "completed" ? (
          <motion.span
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <Check
              className={cn(
                size === "sm" && "h-3.5 w-3.5",
                size === "md" && "h-4 w-4",
                size === "lg" && "h-5 w-5"
              )}
            />
          </motion.span>
        ) : status === "error" ? (
          <motion.span
            key="error"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <AlertCircle
              className={cn(
                size === "sm" && "h-3.5 w-3.5",
                size === "md" && "h-4 w-4",
                size === "lg" && "h-5 w-5"
              )}
            />
          </motion.span>
        ) : (
          <motion.span
            key="number"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            {icon ?? index + 1}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function getHorizontalHalfConnectorColor(
  adjacentStatus: StepStatus
): string {
  return adjacentStatus === "completed" ? "bg-green" : "bg-white/10";
}

function Stepper({
  className,
  steps,
  activeStep,
  orientation = "horizontal",
  size = "md",
  onStepClick,
  ...props
}: StepperProps) {
  const resolvedSize = size ?? "md";
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      data-slot="stepper"
      className={cn(
        "flex",
        isHorizontal ? "flex-row items-start" : "flex-col",
        className
      )}
      role="group"
      aria-label="Progress"
      {...props}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(index, activeStep);
        const isActive = status === "active";
        const isClickable = onStepClick !== undefined && !isActive;
        const isLastStep = index === steps.length - 1;

        const clickableProps = isClickable
          ? {
              role: "button" as const,
              tabIndex: 0,
              onClick: () => onStepClick(index),
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onStepClick(index);
                }
              },
            }
          : {};

        const currentStepProps = isActive
          ? { "aria-current": "step" as const }
          : {};

        return isHorizontal ? (
          <div key={index} className="flex flex-1 flex-col items-center">
            {/* Circle row with half-connectors on each side */}
            <div className="flex w-full items-center">
              {/* Left half connector */}
              <div className="flex flex-1 items-center">
                {index > 0 && (
                  <div
                    className={cn(
                      "h-0.5 w-full rounded-full",
                      getHorizontalHalfConnectorColor(
                        getStepStatus(index - 1, activeStep)
                      )
                    )}
                    aria-hidden="true"
                    data-connector
                  />
                )}
              </div>

              {/* Step circle */}
              <div
                className={cn(
                  isClickable && "cursor-pointer hover:opacity-80"
                )}
                {...clickableProps}
                {...currentStepProps}
              >
                <StepCircle
                  status={status}
                  index={index}
                  icon={step.icon}
                  size={resolvedSize}
                />
              </div>

              {/* Right half connector */}
              <div className="flex flex-1 items-center">
                {!isLastStep && (
                  <div
                    className={cn(
                      "h-0.5 w-full rounded-full",
                      getHorizontalHalfConnectorColor(status)
                    )}
                    aria-hidden="true"
                    data-connector
                  />
                )}
              </div>
            </div>

            {/* Label area below the circle */}
            <div
              className={cn(
                "mt-2 flex flex-col items-center text-center",
                isClickable && "cursor-pointer"
              )}
              {...(isClickable
                ? { onClick: () => onStepClick(index) }
                : {})}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  getLabelClasses(status)
                )}
              >
                {step.label}
                {step.optional && (
                  <span className="text-white/60"> (Optional)</span>
                )}
              </span>
              {step.description && (
                <span className="text-xs text-white/60">
                  {step.description}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div key={index} className="flex">
            {/* Vertical: circle + connector column */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  isClickable && "cursor-pointer hover:opacity-80"
                )}
                {...clickableProps}
                {...currentStepProps}
              >
                <StepCircle
                  status={status}
                  index={index}
                  icon={step.icon}
                  size={resolvedSize}
                />
              </div>

              {/* Vertical connector */}
              {!isLastStep && (
                <div
                  className={cn(
                    "w-0.5 min-h-8 mx-auto my-1 rounded-full",
                    (() => {
                      const nextStatus = getStepStatus(
                        index + 1,
                        activeStep
                      );
                      return getVerticalConnectorClasses(status, nextStatus);
                    })()
                  )}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Label area */}
            <div
              className={cn(
                "ml-3 flex flex-col justify-center",
                isClickable && "cursor-pointer"
              )}
              {...(isClickable
                ? { onClick: () => onStepClick(index) }
                : {})}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  getLabelClasses(status)
                )}
              >
                {step.label}
                {step.optional && (
                  <span className="text-white/60"> (Optional)</span>
                )}
              </span>
              {step.description && (
                <span className="text-xs text-white/60">
                  {step.description}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

Stepper.displayName = "Stepper";

export { Stepper, stepCircleVariants };
