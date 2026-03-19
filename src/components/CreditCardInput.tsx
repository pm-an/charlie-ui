"use client";

import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type HTMLAttributes,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../utils/cn";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type CardType = "visa" | "mastercard" | "amex" | "discover" | "unknown";

export interface CreditCardData {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}

export interface CreditCardErrors {
  number?: string;
  name?: string;
  expiry?: string;
  cvc?: string;
}

export interface CreditCardInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Current card data (controlled) */
  value?: CreditCardData;
  /** Called when any field changes */
  onChange?: (data: CreditCardData) => void;
  /** Called when validation errors change */
  onValidate?: (errors: CreditCardErrors) => void;
  /** Disable all inputs */
  disabled?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Card type detection                                                */
/* ------------------------------------------------------------------ */

function detectCardType(number: string): CardType {
  const n = number.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(n))
    return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^(6011|65|64[4-9])/.test(n)) return "discover";
  return "unknown";
}

/* ------------------------------------------------------------------ */
/*  Formatting helpers                                                 */
/* ------------------------------------------------------------------ */

function formatCardNumber(raw: string, type: CardType): string {
  const digits = raw.replace(/\D/g, "");
  if (type === "amex") {
    const max = digits.slice(0, 15);
    return max.replace(/(\d{4})(\d{0,6})(\d{0,5})/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join(" ")
    );
  }
  const max = digits.slice(0, 16);
  return max.replace(/(\d{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function maxDigits(type: CardType): number {
  return type === "amex" ? 15 : 16;
}

function cvcLength(type: CardType): number {
  return type === "amex" ? 4 : 3;
}

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

function luhnCheck(num: string): boolean {
  const digits = num.replace(/\s/g, "");
  if (!/^\d+$/.test(digits) || digits.length === 0) return false;
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

function validateNumber(value: string): string | undefined {
  const digits = value.replace(/\s/g, "");
  if (!digits) return "Card number is required";
  const type = detectCardType(digits);
  const expected = maxDigits(type);
  if (digits.length < expected) return "Card number is incomplete";
  if (!luhnCheck(digits)) return "Invalid card number";
  return undefined;
}

function validateName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Cardholder name is required";
  if (trimmed.length < 2) return "Name is too short";
  return undefined;
}

function validateExpiry(value: string): string | undefined {
  if (!value) return "Expiry date is required";
  const parts = value.split("/");
  if (parts.length !== 2 || parts[1].length !== 2) return "Use MM/YY format";
  const month = parseInt(parts[0], 10);
  const year = parseInt(parts[1], 10) + 2000;
  if (month < 1 || month > 12) return "Invalid month";
  const now = new Date();
  const expDate = new Date(year, month); // 1st of next month
  if (expDate <= now) return "Card has expired";
  return undefined;
}

function validateCvc(value: string, type: CardType): string | undefined {
  if (!value) return "Security code is required";
  const expected = cvcLength(type);
  if (value.length < expected)
    return `Must be ${expected} digits`;
  return undefined;
}

function validateAll(
  data: CreditCardData,
  type: CardType
): CreditCardErrors {
  const errors: CreditCardErrors = {};
  const n = validateNumber(data.number);
  const nm = validateName(data.name);
  const e = validateExpiry(data.expiry);
  const c = validateCvc(data.cvc, type);
  if (n) errors.number = n;
  if (nm) errors.name = nm;
  if (e) errors.expiry = e;
  if (c) errors.cvc = c;
  return errors;
}

/* ------------------------------------------------------------------ */
/*  Card theme by type                                                 */
/* ------------------------------------------------------------------ */

const cardThemes: Record<CardType, { gradient: string; glow: string }> = {
  visa: {
    gradient: "from-[#1a1f71] via-[#1e3a8a] to-[#0f172a]",
    glow: "rgba(30, 58, 138, 0.4)",
  },
  mastercard: {
    gradient: "from-[#1c1917] via-[#44403c] to-[#292524]",
    glow: "rgba(239, 68, 68, 0.25)",
  },
  amex: {
    gradient: "from-[#1e3a5f] via-[#1e5076] to-[#0c2340]",
    glow: "rgba(56, 189, 248, 0.25)",
  },
  discover: {
    gradient: "from-[#3f2b1a] via-[#5c3d1f] to-[#2c1a0e]",
    glow: "rgba(245, 158, 11, 0.25)",
  },
  unknown: {
    gradient: "from-[#18181b] via-[#27272a] to-[#09090b]",
    glow: "rgba(255, 255, 255, 0.08)",
  },
};

/* ------------------------------------------------------------------ */
/*  Micro-components: Chip, Logos, etc.                                */
/* ------------------------------------------------------------------ */

function Chip() {
  return (
    <div className="w-[46px] h-[34px] rounded-md overflow-hidden relative">
      {/* Chip body */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37] via-[#c5a028] to-[#b8960f] rounded-md" />
      {/* Chip lines */}
      <div className="absolute inset-0 flex flex-col justify-center gap-[3px] px-[5px]">
        <div className="h-[1px] bg-[#a07d18]/60" />
        <div className="h-[1px] bg-[#a07d18]/60" />
        <div className="h-[1px] bg-[#a07d18]/60" />
        <div className="h-[1px] bg-[#a07d18]/60" />
      </div>
      {/* Chip center pad */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[18px] h-[14px] border border-[#a07d18]/50 rounded-sm bg-gradient-to-b from-[#d4af37] to-[#c5a028]" />
    </div>
  );
}

function ContactlessIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="rotate-90 opacity-50">
      <path d="M12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M12 10c1.1 0 2 .9 2 2s-.9 2-2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function VisaLogo() {
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
      <text x="0" y="17" fontFamily="var(--font-sans)" fontSize="20" fontWeight="bold" fontStyle="italic" fill="white" letterSpacing="-1">
        VISA
      </text>
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg width="42" height="26" viewBox="0 0 42 26">
      <circle cx="14" cy="13" r="12" fill="#eb001b" opacity="0.9" />
      <circle cx="28" cy="13" r="12" fill="#f79e1b" opacity="0.9" />
      <path
        d="M21 3.5a11.96 11.96 0 0 0-4.38 8.13h0A11.96 11.96 0 0 0 21 22.5a11.96 11.96 0 0 0 4.38-8.13h0A11.96 11.96 0 0 0 21 3.5z"
        fill="#ff5f00"
        opacity="0.9"
      />
    </svg>
  );
}

function AmexLogo() {
  return (
    <svg width="50" height="16" viewBox="0 0 50 16" fill="none">
      <text x="0" y="13" fontFamily="var(--font-sans)" fontSize="11" fontWeight="bold" fill="white" letterSpacing="1">
        AMEX
      </text>
    </svg>
  );
}

function DiscoverLogo() {
  return (
    <svg width="70" height="14" viewBox="0 0 70 14" fill="none">
      <text x="0" y="12" fontFamily="var(--font-sans)" fontSize="11" fontWeight="bold" fill="white" letterSpacing="1">
        DISCOVER
      </text>
    </svg>
  );
}

function CardLogo({ type }: { type: CardType }) {
  switch (type) {
    case "visa":
      return <VisaLogo />;
    case "mastercard":
      return <MastercardLogo />;
    case "amex":
      return <AmexLogo />;
    case "discover":
      return <DiscoverLogo />;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_DATA: CreditCardData = {
  number: "",
  name: "",
  expiry: "",
  cvc: "",
};

const CreditCardInput = forwardRef<HTMLDivElement, CreditCardInputProps>(
  ({ className, value, onChange, onValidate, disabled = false, ...props }, ref) => {
    const uid = useId();
    const [internal, setInternal] = useState<CreditCardData>(DEFAULT_DATA);
    const data = value ?? internal;
    const [focusedField, setFocusedField] = useState<
      "number" | "name" | "expiry" | "cvc" | null
    >(null);
    const [errors, setErrors] = useState<CreditCardErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const numberRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const expiryRef = useRef<HTMLInputElement>(null);
    const cvcRef = useRef<HTMLInputElement>(null);

    const isFlipped = focusedField === "cvc";
    const cardType = useMemo(
      () => detectCardType(data.number),
      [data.number]
    );
    const theme = cardThemes[cardType];

    const update = useCallback(
      (patch: Partial<CreditCardData>) => {
        const next = { ...data, ...patch };
        if (!value) setInternal(next);
        onChange?.(next);
      },
      [data, value, onChange]
    );

    const validateField = useCallback(
      (field: keyof CreditCardData, nextData?: CreditCardData) => {
        const d = nextData ?? data;
        const type = detectCardType(d.number);
        let error: string | undefined;
        switch (field) {
          case "number":
            error = validateNumber(d.number);
            break;
          case "name":
            error = validateName(d.name);
            break;
          case "expiry":
            error = validateExpiry(d.expiry);
            break;
          case "cvc":
            error = validateCvc(d.cvc, type);
            break;
        }
        setErrors((prev) => {
          const next = { ...prev };
          if (error) next[field] = error;
          else delete next[field];
          onValidate?.(next);
          return next;
        });
        return error;
      },
      [data, onValidate]
    );

    /* ---- Handlers ---- */

    const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      const max = maxDigits(detectCardType(raw));
      const clamped = raw.slice(0, max);
      const formatted = formatCardNumber(clamped, detectCardType(clamped));
      update({ number: formatted });

      // Clear error while typing if it was touched
      if (touched.number) {
        const err = validateNumber(formatted);
        setErrors((prev) => {
          const next = { ...prev };
          if (err) next.number = err;
          else delete next.number;
          return next;
        });
      }

      // Auto-advance when complete
      if (clamped.length === max) {
        nameRef.current?.focus();
      }
    };

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.toUpperCase();
      update({ name: val });

      if (touched.name) {
        const err = validateName(val);
        setErrors((prev) => {
          const next = { ...prev };
          if (err) next.name = err;
          else delete next.name;
          return next;
        });
      }
    };

    const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      const formatted = formatExpiry(raw);
      update({ expiry: formatted });

      if (touched.expiry) {
        const err = validateExpiry(formatted);
        setErrors((prev) => {
          const next = { ...prev };
          if (err) next.expiry = err;
          else delete next.expiry;
          return next;
        });
      }

      // Auto-advance when complete
      if (raw.length === 4) {
        cvcRef.current?.focus();
      }
    };

    const handleCvcChange = (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "").slice(0, cvcLength(cardType));
      update({ cvc: raw });

      if (touched.cvc) {
        const err = validateCvc(raw, cardType);
        setErrors((prev) => {
          const next = { ...prev };
          if (err) next.cvc = err;
          else delete next.cvc;
          return next;
        });
      }
    };

    const handleFocus = (field: typeof focusedField) => (_: FocusEvent) => {
      setFocusedField(field);
    };

    const handleBlur = (field: keyof CreditCardData) => () => {
      setFocusedField(null);
      setTouched((prev) => ({ ...prev, [field]: true }));
      validateField(field);
    };

    /* ---- Computed display values ---- */

    const displayNumber = useMemo(() => {
      const digits = data.number.replace(/\s/g, "");
      const placeholder = cardType === "amex" ? "•••• •••••• •••••" : "•••• •••• •••• ••••";
      if (!digits) return placeholder;
      const formatted = formatCardNumber(digits, cardType);
      // Pad remaining with bullets
      const groups = placeholder.split(" ");
      const enteredGroups = formatted.split(" ");
      return groups
        .map((g, i) => {
          if (i < enteredGroups.length) {
            const entered = enteredGroups[i];
            if (entered.length < g.length) {
              return entered + "•".repeat(g.length - entered.length);
            }
            return entered;
          }
          return g;
        })
        .join(" ");
    }, [data.number, cardType]);

    const displayExpiry = data.expiry || "MM/YY";
    const displayName = data.name || "YOUR NAME";
    const displayCvc = data.cvc
      ? data.cvc + "•".repeat(cvcLength(cardType) - data.cvc.length)
      : "•".repeat(cvcLength(cardType));

    /* ---- Render ---- */

    return (
      <div
        ref={ref}
        data-slot="credit-card-input"
        className={cn("w-full max-w-[400px]", className)}
        {...props}
      >
        {/* ============== CARD VISUAL ============== */}
        <div
          className="relative mx-auto mb-6"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            className="relative w-full"
            style={{
              aspectRatio: "1.586 / 1",
              transformStyle: "preserve-3d",
            }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 25,
              mass: 1,
            }}
          >
            {/* ---- FRONT ---- */}
            <div
              className={cn(
                "absolute inset-0 rounded-xl overflow-hidden",
                "bg-gradient-to-br",
                theme.gradient,
                "border border-white/10",
                "p-5 flex flex-col justify-between",
              )}
              style={{
                backfaceVisibility: "hidden",
                boxShadow: `0 20px 60px -15px ${theme.glow}, 0 8px 24px -8px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)`,
              }}
            >
              {/* Subtle pattern overlay */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 2px, white 2px, white 3px)",
                }}
              />

              {/* Top row: chip + contactless + logo */}
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Chip />
                  <ContactlessIcon />
                </div>
                <motion.div
                  key={cardType}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <CardLogo type={cardType} />
                </motion.div>
              </div>

              {/* Card number */}
              <div className="relative z-10">
                <motion.div
                  className={cn(
                    "font-mono text-[20px] tracking-[3px] text-white/90 leading-none",
                    focusedField === "number" && "text-white",
                  )}
                  layout
                >
                  {displayNumber.split("").map((char, i) => (
                    <motion.span
                      key={`${i}-${char}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        delay: char === " " ? 0 : 0.02 * (i % 4),
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              {/* Bottom row: name + expiry */}
              <div className="relative z-10 flex items-end justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <div className="text-[9px] uppercase tracking-wider text-white/70 mb-0.5">
                    Card Holder
                  </div>
                  <motion.div
                    className={cn(
                      "text-[13px] font-medium tracking-wider text-white/80 truncate",
                      focusedField === "name" && "text-white",
                    )}
                    key={displayName}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {displayName}
                  </motion.div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[9px] uppercase tracking-wider text-white/70 mb-0.5">
                    Expires
                  </div>
                  <motion.div
                    className={cn(
                      "font-mono text-[14px] tracking-wider text-white/80",
                      focusedField === "expiry" && "text-white",
                    )}
                    key={displayExpiry}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {displayExpiry}
                  </motion.div>
                </div>
              </div>

              {/* Focus highlight ring */}
              <AnimatePresence>
                {focusedField && focusedField !== "cvc" && (
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.15)",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* ---- BACK ---- */}
            <div
              className={cn(
                "absolute inset-0 rounded-xl overflow-hidden",
                "bg-gradient-to-br",
                theme.gradient,
                "border border-white/10",
                "flex flex-col",
              )}
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                boxShadow: `0 20px 60px -15px ${theme.glow}, 0 8px 24px -8px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)`,
              }}
            >
              {/* Pattern overlay */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 2px, white 2px, white 3px)",
                }}
              />

              {/* Magnetic stripe */}
              <div className="w-full h-[42px] bg-black/70 mt-6" />

              {/* Signature strip + CVV */}
              <div className="px-5 mt-5">
                <div className="flex items-center gap-3">
                  {/* Signature area */}
                  <div className="flex-1 h-[36px] bg-white/10 rounded-sm relative overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(90deg, transparent, transparent 4px, white 4px, white 5px)",
                      }}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-white/70 italic font-mono">
                      Authorized Signature
                    </div>
                  </div>
                  {/* CVV */}
                  <div className="flex flex-col items-center">
                    <div className="text-[8px] uppercase tracking-wider text-white/70 mb-0.5">
                      CVV
                    </div>
                    <motion.div
                      className={cn(
                        "font-mono text-[16px] tracking-[4px] text-white bg-white/10 px-3 py-1 rounded-sm",
                        focusedField === "cvc" && "bg-white/20 text-white",
                      )}
                      key={displayCvc}
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {displayCvc}
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Bottom info */}
              <div className="mt-auto px-5 pb-4 flex items-end justify-between">
                <div className="text-[8px] text-white/70 max-w-[180px] leading-tight">
                  This card is property of the issuing bank. If found, please return to the nearest branch.
                </div>
                <motion.div
                  key={cardType}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <CardLogo type={cardType} />
                </motion.div>
              </div>

              {/* Focus highlight ring */}
              <AnimatePresence>
                {focusedField === "cvc" && (
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.15)",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ============== INPUT FIELDS ============== */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Card number */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`${uid}-number`}
              className="text-sm font-medium text-white/80"
            >
              Card Number
            </label>
            <input
              ref={numberRef}
              id={`${uid}-number`}
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder={cardType === "amex" ? "0000 000000 00000" : "0000 0000 0000 0000"}
              value={data.number}
              onChange={handleNumberChange}
              onFocus={handleFocus("number")}
              onBlur={handleBlur("number")}
              disabled={disabled}
              aria-label="Card number"
              aria-invalid={touched.number && !!errors.number || undefined}
              className={cn(
                "w-full bg-white/5 border border-white/6 rounded-md h-10 px-3 text-sm text-white font-mono tracking-widest",
                "placeholder:text-white/25",
                "outline-none transition-all duration-200",
                "focus:ring-1 focus:ring-white/15 focus:border-white/15",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                touched.number && errors.number && "border-red/50 focus:ring-red/30 focus:border-red/50",
              )}
            />
            {touched.number && errors.number && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-red"
                role="alert"
              >
                {errors.number}
              </motion.p>
            )}
          </div>

          {/* Cardholder name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`${uid}-name`}
              className="text-sm font-medium text-white/80"
            >
              Cardholder Name
            </label>
            <input
              ref={nameRef}
              id={`${uid}-name`}
              type="text"
              autoComplete="cc-name"
              placeholder="JOHN DOE"
              value={data.name}
              onChange={handleNameChange}
              onFocus={handleFocus("name")}
              onBlur={handleBlur("name")}
              disabled={disabled}
              aria-label="Cardholder name"
              aria-invalid={touched.name && !!errors.name || undefined}
              className={cn(
                "w-full bg-white/5 border border-white/6 rounded-md h-10 px-3 text-sm text-white uppercase tracking-wider",
                "placeholder:text-white/25 placeholder:normal-case",
                "outline-none transition-all duration-200",
                "focus:ring-1 focus:ring-white/15 focus:border-white/15",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                touched.name && errors.name && "border-red/50 focus:ring-red/30 focus:border-red/50",
              )}
            />
            {touched.name && errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-red"
                role="alert"
              >
                {errors.name}
              </motion.p>
            )}
          </div>

          {/* Expiry + CVC row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`${uid}-expiry`}
                className="text-sm font-medium text-white/80"
              >
                Expiry Date
              </label>
              <input
                ref={expiryRef}
                id={`${uid}-expiry`}
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                value={data.expiry}
                onChange={handleExpiryChange}
                onFocus={handleFocus("expiry")}
                onBlur={handleBlur("expiry")}
                disabled={disabled}
                aria-label="Expiry date"
                aria-invalid={touched.expiry && !!errors.expiry || undefined}
                className={cn(
                  "w-full bg-white/5 border border-white/6 rounded-md h-10 px-3 text-sm text-white font-mono tracking-widest",
                  "placeholder:text-white/25",
                  "outline-none transition-all duration-200",
                  "focus:ring-1 focus:ring-white/15 focus:border-white/15",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  touched.expiry && errors.expiry && "border-red/50 focus:ring-red/30 focus:border-red/50",
                )}
              />
              {touched.expiry && errors.expiry && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-red"
                  role="alert"
                >
                  {errors.expiry}
                </motion.p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`${uid}-cvc`}
                className="text-sm font-medium text-white/80"
              >
                Security Code
              </label>
              <input
                ref={cvcRef}
                id={`${uid}-cvc`}
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder={cardType === "amex" ? "0000" : "000"}
                value={data.cvc}
                onChange={handleCvcChange}
                onFocus={handleFocus("cvc")}
                onBlur={handleBlur("cvc")}
                disabled={disabled}
                aria-label="Security code"
                aria-invalid={touched.cvc && !!errors.cvc || undefined}
                className={cn(
                  "w-full bg-white/5 border border-white/6 rounded-md h-10 px-3 text-sm text-white font-mono tracking-widest",
                  "placeholder:text-white/25",
                  "outline-none transition-all duration-200",
                  "focus:ring-1 focus:ring-white/15 focus:border-white/15",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  touched.cvc && errors.cvc && "border-red/50 focus:ring-red/30 focus:border-red/50",
                )}
              />
              {touched.cvc && errors.cvc && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-red"
                  role="alert"
                >
                  {errors.cvc}
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
);

CreditCardInput.displayName = "CreditCardInput";

export {
  CreditCardInput,
  detectCardType,
  formatCardNumber,
  formatExpiry,
  luhnCheck,
  validateNumber,
  validateName,
  validateExpiry,
  validateCvc,
  validateAll,
};
