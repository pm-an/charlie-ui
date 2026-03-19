"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check, Search } from "lucide-react";
import { Spinner } from "./Spinner";
import { cn } from "../utils/cn";
import { useFieldAware } from "../hooks/useFieldAware";

/* ─── Types ──────────────────────────────── */

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
  description?: string;
};

export type SelectProps = VariantProps<typeof selectTriggerVariants> & {
  /** Currently selected value (controlled) */
  value?: string;
  /** Initial value (uncontrolled) */
  defaultValue?: string;
  /** Called when value changes */
  onChange?: (value: string) => void;

  /** List of options */
  options: SelectOption[];
  /** Placeholder when no value is selected */
  placeholder?: string;

  /** Hidden input name for form submission */
  name?: string;
  /** Label above the select */
  label?: string;
  /** Description text shown below the select */
  description?: string;
  /** @deprecated Use `description` instead */
  helperText?: string;
  /** Error state */
  error?: boolean;
  /** Error message displayed below */
  errorMessage?: string;
  /** Required indicator */
  required?: boolean;
  /** Disabled state */
  disabled?: boolean;

  /** HTML id for the trigger element */
  id?: string;

  /** Enable search/filter input in dropdown */
  searchable?: boolean;
  /** Placeholder for search input */
  searchPlaceholder?: string;
  /** Callback for server-side search */
  onSearch?: (query: string) => void;

  /** Custom className for the trigger */
  className?: string;

  /** Custom option renderer */
  renderOption?: (
    option: SelectOption,
    state: { selected: boolean; highlighted: boolean }
  ) => ReactNode;
  /** Message when no options match search */
  emptyMessage?: string;
  /** Loading state — shows spinner and disables interaction */
  loading?: boolean;
};

/* ─── Trigger Variants ───────────────────── */

const selectTriggerVariants = cva(
  [
    "w-full flex items-center justify-between gap-2",
    "bg-white/5 border border-white/[0.08] rounded-lg text-sm text-white",
    "shadow-input outline-none transition-shadow duration-200 cursor-pointer",
    "focus:shadow-input-focus focus:border-white/12",
  ],
  {
    variants: {
      size: {
        sm: "h-7 px-2.5 text-xs",
        md: "h-9 px-3 text-sm",
        lg: "h-11 px-4 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/* ─── Select Component ───────────────────── */

function Select({
  value: controlledValue,
  defaultValue,
  onChange,
  options,
  placeholder = "Select an option...",
  name,
  label,
  description,
  helperText,
  error: errorProp,
  errorMessage,
  required: requiredProp,
  disabled: disabledProp,
  searchable = false,
  searchPlaceholder = "Search...",
  onSearch,
  size,
  className,
  renderOption,
  emptyMessage = "No options found",
  loading = false,
  id,
}: SelectProps) {
  /* ── Controllable state ── */
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? ""
  );
  const selectedValue = isControlled ? controlledValue : uncontrolledValue;

  const handleChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange]
  );

  /* ── Open/close state ── */
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState("");

  /* ── Refs ── */
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listboxRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  /* ── Type-ahead ── */
  const typeAheadRef = useRef("");
  const typeAheadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Filtered options ── */
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery, searchable]);

  /* ── Enabled options (for keyboard nav) ── */
  const enabledIndices = useMemo(
    () =>
      filteredOptions
        .map((opt, i) => (opt.disabled ? -1 : i))
        .filter((i) => i !== -1),
    [filteredOptions]
  );

  /* ── Selected option label ── */
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  /* ── Field-aware integration ── */
  const resolvedDescription = description ?? helperText;

  const {
    controlId,
    insideField,
    error,
    disabled,
    required,
    ariaDescribedBy,
    ariaInvalid,
    fieldLabelId,
  } = useFieldAware({
    id,
    error: errorProp,
    disabled: disabledProp,
    required: requiredProp,
    description: resolvedDescription,
    errorMessage,
  });

  /* ── Generate label id ── */
  const labelId = label
    ? `select-label-${label.toLowerCase().replace(/\s+/g, "-")}`
    : undefined;

  /* ── Open/Close helpers ── */
  const openDropdown = useCallback(() => {
    if (disabled) return;
    setOpen(true);
    setSearchQuery("");
    // Highlight currently selected item
    const idx = filteredOptions.findIndex(
      (opt) => opt.value === selectedValue
    );
    setHighlightedIndex(idx >= 0 ? idx : -1);
  }, [disabled, filteredOptions, selectedValue]);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setSearchQuery("");
    setHighlightedIndex(-1);
    triggerRef.current?.focus();
  }, []);

  /* ── Select an option ── */
  const selectOption = useCallback(
    (option: SelectOption) => {
      if (option.disabled) return;
      handleChange(option.value);
      closeDropdown();
    },
    [handleChange, closeDropdown]
  );

  /* ── Click outside ── */
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        closeDropdown();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, closeDropdown]);

  /* ── Focus search input when dropdown opens ── */
  useEffect(() => {
    if (open && searchable) {
      // Small delay to let animation start
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [open, searchable]);

  /* ── Reset highlight when filtered options change ── */
  useEffect(() => {
    if (open) {
      const idx = filteredOptions.findIndex(
        (opt) => opt.value === selectedValue
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: syncing highlight index when options change
      setHighlightedIndex(idx >= 0 ? idx : enabledIndices[0] ?? -1);
    }
  }, [filteredOptions, open, selectedValue, enabledIndices]);

  /* ── Keyboard navigation ── */
  const getNextEnabledIndex = useCallback(
    (current: number, direction: 1 | -1): number => {
      if (enabledIndices.length === 0) return -1;

      if (current === -1) {
        return direction === 1
          ? enabledIndices[0]
          : enabledIndices[enabledIndices.length - 1];
      }

      const currentPos = enabledIndices.indexOf(current);
      if (currentPos === -1) {
        return enabledIndices[0];
      }

      const nextPos = currentPos + direction;
      if (nextPos < 0 || nextPos >= enabledIndices.length) {
        return current;
      }
      return enabledIndices[nextPos];
    },
    [enabledIndices]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) {
        // Closed: open on Enter, Space, ArrowDown, ArrowUp
        switch (e.key) {
          case "Enter":
          case " ":
          case "ArrowDown":
          case "ArrowUp":
            e.preventDefault();
            openDropdown();
            break;
        }
        return;
      }

      // Open: navigate, select, close
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const next = getNextEnabledIndex(highlightedIndex, 1);
          setHighlightedIndex(next);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prev = getNextEnabledIndex(highlightedIndex, -1);
          setHighlightedIndex(prev);
          break;
        }
        case "Home": {
          e.preventDefault();
          if (enabledIndices.length > 0) {
            setHighlightedIndex(enabledIndices[0]);
          }
          break;
        }
        case "End": {
          e.preventDefault();
          if (enabledIndices.length > 0) {
            setHighlightedIndex(enabledIndices[enabledIndices.length - 1]);
          }
          break;
        }
        case "Enter":
        case " ": {
          e.preventDefault();
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < filteredOptions.length
          ) {
            selectOption(filteredOptions[highlightedIndex]);
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          closeDropdown();
          break;
        }
        case "Tab": {
          closeDropdown();
          break;
        }
        default: {
          // Type-ahead: jump to first option starting with typed character(s)
          if (e.key.length === 1 && !searchable) {
            e.preventDefault();
            if (typeAheadTimerRef.current) {
              clearTimeout(typeAheadTimerRef.current);
            }
            typeAheadRef.current += e.key.toLowerCase();

            const matchIndex = filteredOptions.findIndex(
              (opt) =>
                !opt.disabled &&
                opt.label.toLowerCase().startsWith(typeAheadRef.current)
            );
            if (matchIndex >= 0) {
              setHighlightedIndex(matchIndex);
            }

            typeAheadTimerRef.current = setTimeout(() => {
              typeAheadRef.current = "";
            }, 500);
          }
          break;
        }
      }
    },
    [
      open,
      highlightedIndex,
      filteredOptions,
      enabledIndices,
      getNextEnabledIndex,
      selectOption,
      closeDropdown,
      openDropdown,
      searchable,
    ]
  );

  /* ── Search change handler ── */
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      onSearch?.(query);
    },
    [onSearch]
  );

  /* ── Scroll highlighted option into view ── */
  useEffect(() => {
    if (!open || highlightedIndex < 0) return;
    const listbox = listboxRef.current;
    if (!listbox) return;
    const highlighted = listbox.querySelector(
      `[data-index="${highlightedIndex}"]`
    );
    if (highlighted && typeof highlighted.scrollIntoView === "function") {
      highlighted.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, open]);

  // Trigger button — shared between Field-aware and standalone modes
  const triggerButton = (
    <button
      ref={triggerRef}
      type="button"
      role="combobox"
      id={controlId}
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-controls={open ? `${controlId}-listbox` : undefined}
      aria-labelledby={insideField ? fieldLabelId : labelId}
      aria-label={!labelId && !fieldLabelId ? placeholder : undefined}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
      aria-required={required || undefined}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        selectTriggerVariants({ size }),
        error && "border-red/50 focus:ring-red/30 focus:border-red/50",
        (disabled || loading) && "opacity-65 cursor-not-allowed",
        className
      )}
      onClick={() => (open ? closeDropdown() : openDropdown())}
      onKeyDown={handleKeyDown}
    >
      <span
        className={cn(
          "truncate text-left flex-1",
          !selectedOption && "text-white/70"
        )}
      >
        {selectedOption ? selectedOption.label : placeholder}
      </span>
      {loading ? (
        <Spinner size="xs" color="rgba(255,255,255,0.4)" />
      ) : (
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-white/70 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      )}
    </button>
  );

  // Dropdown panel — shared between both modes
  const dropdownPanel = (
    <AnimatePresence>
      {open && (
        <motion.div
          className={cn(
            "absolute z-50 left-0 right-0 top-full mt-1",
            "bg-grey-700 border border-white/[0.08] rounded-lg shadow-elevated backdrop-blur-xl overflow-hidden"
          )}
          initial={{ opacity: 1, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onKeyDown={handleKeyDown}
        >
          {/* Search input */}
          {searchable && (
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
              <Search className="h-4 w-4 shrink-0 text-white/70" />
              <input
                ref={searchInputRef}
                type="text"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/70 outline-none"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search options"
              />
            </div>
          )}

          {/* Options list */}
          <div
            ref={listboxRef}
            role="listbox"
            id={`${controlId}-listbox`}
            aria-labelledby={labelId}
            aria-label={!labelId ? placeholder : undefined}
            className="max-h-[240px] overflow-y-auto py-1"
          >
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-white/70">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = option.value === selectedValue;
                const isHighlighted = index === highlightedIndex;

                if (renderOption) {
                  return (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled || undefined}
                      data-index={index}
                      className={cn(
                        "cursor-pointer",
                        option.disabled &&
                          "opacity-50 cursor-not-allowed pointer-events-none"
                      )}
                      onClick={() => selectOption(option)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      {renderOption(option, {
                        selected: isSelected,
                        highlighted: isHighlighted,
                      })}
                    </div>
                  );
                }

                return (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || undefined}
                    data-index={index}
                    className={cn(
                      "flex items-center gap-2 mx-1 px-3 py-2 text-sm rounded-md cursor-pointer transition-colors",
                      isHighlighted && "bg-white/[0.06]",
                      isSelected && "text-white",
                      !isSelected && "text-white/80",
                      option.disabled &&
                        "opacity-50 cursor-not-allowed pointer-events-none"
                    )}
                    onClick={() => selectOption(option)}
                    onMouseEnter={() =>
                      !option.disabled && setHighlightedIndex(index)
                    }
                  >
                    {/* Option icon */}
                    {option.icon && (
                      <span className="shrink-0">{option.icon}</span>
                    )}

                    {/* Option text */}
                    <span className="flex-1 min-w-0">
                      <span className="block truncate">
                        {option.label}
                      </span>
                      {option.description && (
                        <span className="block text-xs text-white/70 truncate">
                          {option.description}
                        </span>
                      )}
                    </span>

                    {/* Check icon for selected */}
                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-white" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // When inside a Field, render only the core interactive elements (no label/helper/error)
  if (insideField) {
    return (
      <div
        ref={containerRef}
        data-slot="select"
        className="relative"
        data-state={open ? "open" : "closed"}
      >
        {triggerButton}

        {/* Hidden input for form submission */}
        {name && (
          <input type="hidden" name={name} value={selectedValue} />
        )}

        {dropdownPanel}
      </div>
    );
  }

  // Standalone rendering — identical to original
  return (
    <div
      ref={containerRef}
      data-slot="select"
      className="relative flex flex-col gap-1.5"
      data-state={open ? "open" : "closed"}
    >
      {/* Label */}
      {label && (
        <label
          id={labelId}
          className={cn(
            "text-sm font-medium text-white/80",
            required &&
              "after:content-['*'] after:ml-0.5 after:text-[#f87171]"
          )}
        >
          {label}
        </label>
      )}

      {triggerButton}

      {/* Hidden input for form submission */}
      {name && (
        <input type="hidden" name={name} value={selectedValue} />
      )}

      {dropdownPanel}

      {/* Helper text */}
      {resolvedDescription && !error && (
        <p id={`${controlId}-description`} className="text-xs text-white/70">{resolvedDescription}</p>
      )}

      {/* Error message */}
      {error && errorMessage && (
        <p id={`${controlId}-error`} className="text-xs text-[#f87171]">{errorMessage}</p>
      )}
    </div>
  );
}

Select.displayName = "Select";

export { Select, selectTriggerVariants };
