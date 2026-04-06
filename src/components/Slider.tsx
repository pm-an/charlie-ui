"use client";

import {
  forwardRef,
  useRef,
  useCallback,
  useEffect,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { useFieldAware } from "../hooks/useFieldAware";

const sliderTrackVariants = cva("w-full rounded-full bg-bg-subtle shadow-xs", {
  variants: {
    size: {
      sm: "h-1",
      md: "h-1.5",
      lg: "h-2",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const sliderThumbVariants = cva(
  [
    "absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-button",
    "border-[1.5px] border-accent",
    "transition-shadow duration-150",
    "focus-visible:ring-2 focus-visible:ring-accent/30",
    "hover:ring-2 hover:ring-accent/20",
  ],
  {
    variants: {
      size: {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export type SliderMark = {
  value: number;
  label: string;
};

export type SliderProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> &
  VariantProps<typeof sliderTrackVariants> & {
    value?: number;
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    showValue?: boolean;
    disabled?: boolean;
    marks?: SliderMark[];
  };

function clampAndStep(
  value: number,
  min: number,
  max: number,
  step: number
): number {
  const clamped = Math.min(Math.max(value, min), max);
  return Math.round(clamped / step) * step;
}

const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      value = 0,
      onChange,
      min = 0,
      max = 100,
      step = 1,
      label,
      showValue = false,
      disabled = false,
      size = "md",
      marks,
      ...props
    },
    ref
  ) => {
    const {
      insideField,
      disabled: resolvedDisabled,
      ariaDescribedBy,
      ariaInvalid,
      fieldLabelId,
    } = useFieldAware({ id: undefined, error: undefined, disabled, required: undefined });

    const trackRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const percentage = max !== min ? ((value - min) / (max - min)) * 100 : 0;

    const getValueFromPosition = useCallback(
      (clientX: number) => {
        const track = trackRef.current;
        if (!track) return value;
        const rect = track.getBoundingClientRect();
        const ratio = Math.min(
          Math.max((clientX - rect.left) / rect.width, 0),
          1
        );
        const raw = min + ratio * (max - min);
        return clampAndStep(raw, min, max, step);
      },
      [min, max, step, value]
    );

    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (resolvedDisabled) return;
        e.preventDefault();
        isDragging.current = true;
        const newValue = getValueFromPosition(e.clientX);
        if (newValue !== value) onChange?.(newValue);
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      },
      [resolvedDisabled, getValueFromPosition, onChange, value]
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (!isDragging.current || resolvedDisabled) return;
        const newValue = getValueFromPosition(e.clientX);
        if (newValue !== value) onChange?.(newValue);
      },
      [resolvedDisabled, getValueFromPosition, onChange, value]
    );

    const handlePointerUp = useCallback(() => {
      isDragging.current = false;
    }, []);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (resolvedDisabled) return;
        let newValue = value;
        switch (e.key) {
          case "ArrowRight":
          case "ArrowUp":
            e.preventDefault();
            newValue = clampAndStep(value + step, min, max, step);
            break;
          case "ArrowLeft":
          case "ArrowDown":
            e.preventDefault();
            newValue = clampAndStep(value - step, min, max, step);
            break;
          case "Home":
            e.preventDefault();
            newValue = min;
            break;
          case "End":
            e.preventDefault();
            newValue = max;
            break;
          default:
            return;
        }
        if (newValue !== value) onChange?.(newValue);
      },
      [resolvedDisabled, value, step, min, max, onChange]
    );

    // Clean up dragging state on unmount
    useEffect(() => {
      return () => {
        isDragging.current = false;
      };
    }, []);

    const resolvedSize = size ?? "md";

    return (
      <div
        ref={ref}
        data-slot="slider"
        className={cn(
          "flex flex-col gap-2",
          resolvedDisabled && "opacity-65 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {((!insideField && label) || showValue) && (
          <div className="flex items-center justify-between">
            {!insideField && label && (
              <span className="text-sm font-medium text-fg-200">
                {label}
              </span>
            )}
            {showValue && (
              <span className="text-sm tabular-nums text-fg-200">
                {value}
              </span>
            )}
          </div>
        )}
        <div
          ref={trackRef}
          className="relative flex items-center py-2"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Track background */}
          <div className={cn(sliderTrackVariants({ size }))}>
            {/* Fill */}
            <div
              className="h-full rounded-full bg-accent transition-all duration-200"
              style={{ width: `${percentage}%` }}
            />
          </div>
          {/* Thumb */}
          <div
            role="slider"
            tabIndex={resolvedDisabled ? -1 : 0}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-orientation="horizontal"
            aria-label={label || (!fieldLabelId ? "Slider" : undefined)}
            aria-labelledby={!label && fieldLabelId ? fieldLabelId : undefined}
            aria-disabled={resolvedDisabled || undefined}
            aria-describedby={ariaDescribedBy}
            aria-invalid={ariaInvalid}
            className={cn(sliderThumbVariants({ size: resolvedSize }))}
            style={{ left: `calc(${percentage}% - ${resolvedSize === "sm" ? 6 : resolvedSize === "lg" ? 10 : 8}px)` }}
            onKeyDown={handleKeyDown}
          />
        </div>
        {marks && marks.length > 0 && (
          <div className="relative w-full h-4">
            {marks.map((mark) => {
              const markPercent =
                max !== min
                  ? ((mark.value - min) / (max - min)) * 100
                  : 0;
              return (
                <span
                  key={mark.value}
                  className="absolute -translate-x-1/2 text-xs text-fg-200"
                  style={{ left: `${markPercent}%` }}
                >
                  {mark.label}
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider, sliderTrackVariants, sliderThumbVariants };
