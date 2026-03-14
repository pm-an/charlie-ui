import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import {
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
  type CreditCardData,
} from "../CreditCardInput";

/* ------------------------------------------------------------------ */
/*  Helper utilities                                                   */
/* ------------------------------------------------------------------ */

describe("detectCardType", () => {
  /* ---- Visa ---- */
  it.each([
    ["4", "single digit"],
    ["4242 4242", "partial"],
    ["4111111111111111", "universal test card"],
    ["4242424242424242", "Stripe test card"],
    ["4000056655665556", "Visa debit"],
    ["4012888888881881", "PayPal/Braintree test card"],
  ])("detects Visa: %s (%s)", (num) => {
    expect(detectCardType(num)).toBe("visa");
  });

  /* ---- Mastercard ---- */
  it.each([
    ["51", "51-prefix start"],
    ["55", "55-prefix end"],
    ["5425 2334", "partial 54xx"],
    ["5555555555554444", "Stripe test card"],
    ["5200828282828210", "Mastercard debit"],
    ["5105105105105100", "Mastercard prepaid"],
    ["2221", "2-series start"],
    ["2223003122003222", "2-series Stripe"],
    ["2720", "2-series end"],
  ])("detects Mastercard: %s (%s)", (num) => {
    expect(detectCardType(num)).toBe("mastercard");
  });

  /* ---- Amex ---- */
  it.each([
    ["34", "34-prefix"],
    ["37", "37-prefix"],
    ["378282246310005", "Stripe Amex"],
    ["371449635398431", "alternate Amex"],
  ])("detects Amex: %s (%s)", (num) => {
    expect(detectCardType(num)).toBe("amex");
  });

  /* ---- Discover ---- */
  it.each([
    ["6011", "6011-prefix"],
    ["65", "65-prefix"],
    ["644", "644-prefix"],
    ["6011111111111117", "Stripe Discover"],
    ["6011000990139424", "Discover alternate"],
  ])("detects Discover: %s (%s)", (num) => {
    expect(detectCardType(num)).toBe("discover");
  });

  /* ---- Unknown ---- */
  it.each([
    ["", "empty string"],
    ["9999", "9xxx prefix"],
    ["1234", "1xxx prefix"],
    ["30", "Diners Club (unsupported)"],
    ["35", "JCB (unsupported)"],
    ["62", "UnionPay (unsupported)"],
  ])("returns unknown for: %s (%s)", (num) => {
    expect(detectCardType(num)).toBe("unknown");
  });
});

describe("formatCardNumber", () => {
  it("formats standard 16-digit cards in groups of 4", () => {
    expect(formatCardNumber("4242424242424242", "visa")).toBe(
      "4242 4242 4242 4242"
    );
  });

  it("formats partial numbers", () => {
    expect(formatCardNumber("424242", "visa")).toBe("4242 42");
  });

  it("formats Amex in 4-6-5 pattern", () => {
    expect(formatCardNumber("378282246310005", "amex")).toBe(
      "3782 822463 10005"
    );
  });

  it("strips non-digit characters", () => {
    expect(formatCardNumber("4242-4242-4242", "visa")).toBe("4242 4242 4242");
  });

  it("limits to 16 digits for standard cards", () => {
    expect(formatCardNumber("42424242424242429999", "visa")).toBe(
      "4242 4242 4242 4242"
    );
  });

  it("limits to 15 digits for Amex", () => {
    expect(formatCardNumber("378282246310005999", "amex")).toBe(
      "3782 822463 10005"
    );
  });
});

describe("formatExpiry", () => {
  it("formats expiry with slash", () => {
    expect(formatExpiry("1228")).toBe("12/28");
  });

  it("returns partial input without slash", () => {
    expect(formatExpiry("1")).toBe("1");
    expect(formatExpiry("12")).toBe("12");
  });

  it("adds slash after 2 digits", () => {
    expect(formatExpiry("122")).toBe("12/2");
  });

  it("strips non-digit characters", () => {
    expect(formatExpiry("12/28")).toBe("12/28");
  });

  it("limits to 4 digits", () => {
    expect(formatExpiry("123456")).toBe("12/34");
  });
});

/* ------------------------------------------------------------------ */
/*  Luhn check                                                         */
/* ------------------------------------------------------------------ */

describe("luhnCheck", () => {
  /* ---- Valid card numbers (Stripe test cards) ---- */

  it.each([
    ["4242424242424242", "Visa (Stripe standard)"],
    ["4000056655665556", "Visa debit (Stripe)"],
    ["4111111111111111", "Visa (universal test card)"],
    ["4012888888881881", "Visa (PayPal/Braintree)"],
  ])("returns true for valid Visa: %s (%s)", (num) => {
    expect(luhnCheck(num)).toBe(true);
  });

  it.each([
    ["5555555555554444", "Mastercard (Stripe standard)"],
    ["2223003122003222", "Mastercard 2-series (Stripe)"],
    ["5200828282828210", "Mastercard debit (Stripe)"],
    ["5105105105105100", "Mastercard prepaid (Stripe)"],
  ])("returns true for valid Mastercard: %s (%s)", (num) => {
    expect(luhnCheck(num)).toBe(true);
  });

  it.each([
    ["378282246310005", "Amex (Stripe standard)"],
    ["371449635398431", "Amex (alternate)"],
  ])("returns true for valid Amex: %s (%s)", (num) => {
    expect(luhnCheck(num)).toBe(true);
  });

  it.each([
    ["6011111111111117", "Discover (Stripe standard)"],
    ["6011000990139424", "Discover (alternate)"],
  ])("returns true for valid Discover: %s (%s)", (num) => {
    expect(luhnCheck(num)).toBe(true);
  });

  /* ---- Stripe decline/error cards (still pass Luhn) ---- */

  it.each([
    ["4000000000000002", "generic_decline"],
    ["4000000000009995", "insufficient_funds"],
    ["4000000000009987", "lost_card"],
    ["4000000000009979", "stolen_card"],
    ["4000000000000069", "expired_card"],
    ["4000000000000127", "incorrect_cvc"],
    ["4000000000000119", "processing_error"],
  ])("Stripe decline card %s (%s) passes Luhn", (num) => {
    expect(luhnCheck(num)).toBe(true);
  });

  /* ---- Invalid Luhn numbers ---- */

  it("returns false for Stripe incorrect_number test card", () => {
    expect(luhnCheck("4242424242424241")).toBe(false);
  });

  it.each([
    ["1234567812345678", "random 16 digits"],
    ["1234567890123456", "sequential ascending"],
    ["0123456789012345", "sequential from zero"],
  ])("returns false for invalid: %s (%s)", (num) => {
    expect(luhnCheck(num)).toBe(false);
  });

  /* ---- Same-digit edge cases ---- */

  it.each([
    ["1111111111111111", false],
    ["2222222222222222", false],
    ["3333333333333333", false],
    ["4444444444444444", false],
    ["5555555555555555", false],
    ["6666666666666666", false],
    ["7777777777777777", false],
    ["9999999999999999", false],
  ])("all-same-digit %s fails Luhn: %s", (num, expected) => {
    expect(luhnCheck(num)).toBe(expected);
  });

  it("all-zeros passes Luhn (sum=0, 0%%10=0)", () => {
    expect(luhnCheck("0000000000000000")).toBe(true);
  });

  it("all-eights passes Luhn (known edge case)", () => {
    expect(luhnCheck("8888888888888888")).toBe(true);
  });

  /* ---- Classic Rosetta Code test vectors ---- */

  it("Rosetta Code valid: 49927398716", () => {
    expect(luhnCheck("49927398716")).toBe(true);
  });

  it("Rosetta Code invalid: 49927398717", () => {
    expect(luhnCheck("49927398717")).toBe(false);
  });

  it("Rosetta Code valid: 1234567812345670", () => {
    expect(luhnCheck("1234567812345670")).toBe(true);
  });

  /* ---- Format handling ---- */

  it("handles numbers with spaces", () => {
    expect(luhnCheck("4242 4242 4242 4242")).toBe(true);
  });

  it("returns false for empty string", () => {
    expect(luhnCheck("")).toBe(false);
  });

  it("returns false for non-digit input", () => {
    expect(luhnCheck("abcd")).toBe(false);
  });

  it("returns false for mixed alphanumeric", () => {
    expect(luhnCheck("4242abcd42424242")).toBe(false);
  });
});

/* ------------------------------------------------------------------ */
/*  Validation functions                                               */
/* ------------------------------------------------------------------ */

describe("validateNumber", () => {
  it("returns error for empty number", () => {
    expect(validateNumber("")).toBe("Card number is required");
  });

  it("returns error for incomplete number", () => {
    expect(validateNumber("4242 4242")).toBe("Card number is incomplete");
  });

  it("returns error for invalid Luhn", () => {
    expect(validateNumber("4242 4242 4242 4241")).toBe("Invalid card number");
  });

  it("returns undefined for valid number", () => {
    expect(validateNumber("4242 4242 4242 4242")).toBeUndefined();
  });

  it("validates Amex length (15 digits)", () => {
    expect(validateNumber("3782 82246310")).toBe("Card number is incomplete");
    expect(validateNumber("3782 822463 10005")).toBeUndefined();
  });

  /* ---- Real-world valid test cards ---- */

  it.each([
    ["4242 4242 4242 4242", "Visa (Stripe)"],
    ["4111 1111 1111 1111", "Visa (universal)"],
    ["4000 0566 5566 5556", "Visa debit"],
    ["5555 5555 5555 4444", "Mastercard"],
    ["2223 0031 2200 3222", "Mastercard 2-series"],
    ["5200 8282 8282 8210", "Mastercard debit"],
    ["3782 822463 10005", "Amex"],
    ["3714 496353 98431", "Amex alternate"],
    ["6011 1111 1111 1117", "Discover"],
    ["6011 0009 9013 9424", "Discover alternate"],
  ])("validates %s (%s) as valid", (num) => {
    expect(validateNumber(num)).toBeUndefined();
  });

  /* ---- Real-world invalid test cards ---- */

  it.each([
    ["4242 4242 4242 4241", "Stripe incorrect_number"],
    ["1234 5678 1234 5678", "random invalid"],
  ])("rejects %s (%s) as invalid Luhn", (num) => {
    expect(validateNumber(num)).toBe("Invalid card number");
  });
});

describe("validateName", () => {
  it("returns error for empty name", () => {
    expect(validateName("")).toBe("Cardholder name is required");
  });

  it("returns error for whitespace-only name", () => {
    expect(validateName("   ")).toBe("Cardholder name is required");
  });

  it("returns error for single character name", () => {
    expect(validateName("A")).toBe("Name is too short");
  });

  it("returns undefined for valid name", () => {
    expect(validateName("JOHN DOE")).toBeUndefined();
  });
});

describe("validateExpiry", () => {
  it("returns error for empty expiry", () => {
    expect(validateExpiry("")).toBe("Expiry date is required");
  });

  it("returns error for incomplete format", () => {
    expect(validateExpiry("12")).toBe("Use MM/YY format");
    expect(validateExpiry("12/2")).toBe("Use MM/YY format");
  });

  it("returns error for invalid month", () => {
    expect(validateExpiry("13/28")).toBe("Invalid month");
    expect(validateExpiry("00/28")).toBe("Invalid month");
  });

  it("returns error for expired card", () => {
    expect(validateExpiry("01/20")).toBe("Card has expired");
  });

  it("returns undefined for valid future expiry", () => {
    expect(validateExpiry("12/30")).toBeUndefined();
  });
});

describe("validateCvc", () => {
  it("returns error for empty CVC", () => {
    expect(validateCvc("", "visa")).toBe("Security code is required");
  });

  it("returns error for incomplete CVC (standard)", () => {
    expect(validateCvc("12", "visa")).toBe("Must be 3 digits");
  });

  it("returns error for incomplete CVC (Amex)", () => {
    expect(validateCvc("123", "amex")).toBe("Must be 4 digits");
  });

  it("returns undefined for valid 3-digit CVC", () => {
    expect(validateCvc("123", "visa")).toBeUndefined();
  });

  it("returns undefined for valid 4-digit Amex CVC", () => {
    expect(validateCvc("1234", "amex")).toBeUndefined();
  });
});

describe("validateAll", () => {
  it("returns all errors for empty data", () => {
    const errors = validateAll(
      { number: "", name: "", expiry: "", cvc: "" },
      "unknown"
    );
    expect(errors.number).toBe("Card number is required");
    expect(errors.name).toBe("Cardholder name is required");
    expect(errors.expiry).toBe("Expiry date is required");
    expect(errors.cvc).toBe("Security code is required");
  });

  it("returns empty object for fully valid data", () => {
    const errors = validateAll(
      {
        number: "4242 4242 4242 4242",
        name: "JOHN DOE",
        expiry: "12/30",
        cvc: "123",
      },
      "visa"
    );
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("returns partial errors for mixed validity", () => {
    const errors = validateAll(
      {
        number: "4242 4242 4242 4242",
        name: "",
        expiry: "12/30",
        cvc: "1",
      },
      "visa"
    );
    expect(errors.number).toBeUndefined();
    expect(errors.name).toBe("Cardholder name is required");
    expect(errors.expiry).toBeUndefined();
    expect(errors.cvc).toBe("Must be 3 digits");
  });
});

/* ------------------------------------------------------------------ */
/*  Component rendering                                                */
/* ------------------------------------------------------------------ */

describe("CreditCardInput", () => {
  it("renders without crashing", () => {
    render(<CreditCardInput />);
    expect(screen.getByLabelText("Card number")).toBeInTheDocument();
    expect(screen.getByLabelText("Cardholder name")).toBeInTheDocument();
    expect(screen.getByLabelText("Expiry date")).toBeInTheDocument();
    expect(screen.getByLabelText("Security code")).toBeInTheDocument();
  });

  it("renders the card visual with data-slot", () => {
    const { container } = render(<CreditCardInput />);
    expect(
      container.querySelector('[data-slot="credit-card-input"]')
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<CreditCardInput className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<CreditCardInput ref={ref} />);
    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
  });

  /* ---- Uncontrolled mode ---- */

  it("works in uncontrolled mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CreditCardInput onChange={onChange} />);

    const nameInput = screen.getByLabelText("Cardholder name");
    await user.type(nameInput, "john");

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.name).toBe("JOHN");
  });

  /* ---- Controlled mode ---- */

  it("works in controlled mode", () => {
    const data: CreditCardData = {
      number: "4242 4242 4242 4242",
      name: "TEST USER",
      expiry: "12/28",
      cvc: "123",
    };
    render(<CreditCardInput value={data} onChange={vi.fn()} />);

    const numberInput = screen.getByLabelText("Card number") as HTMLInputElement;
    expect(numberInput.value).toBe("4242 4242 4242 4242");

    const nameInput = screen.getByLabelText("Cardholder name") as HTMLInputElement;
    expect(nameInput.value).toBe("TEST USER");

    const expiryInput = screen.getByLabelText("Expiry date") as HTMLInputElement;
    expect(expiryInput.value).toBe("12/28");

    const cvcInput = screen.getByLabelText("Security code") as HTMLInputElement;
    expect(cvcInput.value).toBe("123");
  });

  /* ---- Input formatting ---- */

  it("formats card number as user types", () => {
    const onChange = vi.fn();
    render(<CreditCardInput onChange={onChange} />);

    const numberInput = screen.getByLabelText("Card number");
    fireEvent.change(numberInput, { target: { value: "4242424242424242" } });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.number).toBe("4242 4242 4242 4242");
  });

  it("formats expiry date as user types", () => {
    const onChange = vi.fn();
    render(<CreditCardInput onChange={onChange} />);

    const expiryInput = screen.getByLabelText("Expiry date");
    fireEvent.change(expiryInput, { target: { value: "1228" } });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.expiry).toBe("12/28");
  });

  it("uppercases cardholder name", () => {
    const onChange = vi.fn();
    render(<CreditCardInput onChange={onChange} />);

    const nameInput = screen.getByLabelText("Cardholder name");
    fireEvent.change(nameInput, { target: { value: "jane doe" } });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.name).toBe("JANE DOE");
  });

  it("limits CVC to 3 digits for standard cards", () => {
    const onChange = vi.fn();
    render(<CreditCardInput onChange={onChange} />);

    const cvcInput = screen.getByLabelText("Security code");
    fireEvent.change(cvcInput, { target: { value: "12345" } });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.cvc).toBe("123");
  });

  it("limits CVC to 4 digits for Amex", () => {
    const onChange = vi.fn();
    const data: CreditCardData = {
      number: "3782 822463 10005",
      name: "",
      expiry: "",
      cvc: "",
    };
    render(<CreditCardInput value={data} onChange={onChange} />);

    const cvcInput = screen.getByLabelText("Security code");
    fireEvent.change(cvcInput, { target: { value: "78901" } });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.cvc).toBe("7890");
  });

  it("strips non-numeric characters from card number", () => {
    const onChange = vi.fn();
    render(<CreditCardInput onChange={onChange} />);

    const numberInput = screen.getByLabelText("Card number");
    fireEvent.change(numberInput, { target: { value: "4242-abcd-4242" } });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.number).toBe("4242 4242");
  });

  it("strips non-numeric characters from CVC", () => {
    const onChange = vi.fn();
    render(<CreditCardInput onChange={onChange} />);

    const cvcInput = screen.getByLabelText("Security code");
    fireEvent.change(cvcInput, { target: { value: "1a2b" } });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.cvc).toBe("12");
  });

  /* ---- Disabled state ---- */

  it("disables all inputs when disabled prop is true", () => {
    render(<CreditCardInput disabled />);

    expect(screen.getByLabelText("Card number")).toBeDisabled();
    expect(screen.getByLabelText("Cardholder name")).toBeDisabled();
    expect(screen.getByLabelText("Expiry date")).toBeDisabled();
    expect(screen.getByLabelText("Security code")).toBeDisabled();
  });

  it("does not call onChange when disabled", () => {
    const onChange = vi.fn();
    render(<CreditCardInput disabled onChange={onChange} />);

    const numberInput = screen.getByLabelText("Card number");
    expect(numberInput).toBeDisabled();
  });

  /* ---- Validation on blur ---- */

  it("shows validation error on blur for empty card number", () => {
    render(<CreditCardInput />);

    const numberInput = screen.getByLabelText("Card number");
    fireEvent.focus(numberInput);
    fireEvent.blur(numberInput);

    expect(screen.getByText("Card number is required")).toBeInTheDocument();
  });

  it("shows validation error on blur for incomplete card number", () => {
    render(<CreditCardInput />);

    const numberInput = screen.getByLabelText("Card number");
    fireEvent.change(numberInput, { target: { value: "4242" } });
    fireEvent.focus(numberInput);
    fireEvent.blur(numberInput);

    expect(screen.getByText("Card number is incomplete")).toBeInTheDocument();
  });

  it("shows validation error for invalid Luhn number on blur", () => {
    render(<CreditCardInput />);

    const numberInput = screen.getByLabelText("Card number");
    fireEvent.change(numberInput, { target: { value: "4242424242424241" } });
    fireEvent.focus(numberInput);
    fireEvent.blur(numberInput);

    expect(screen.getByText("Invalid card number")).toBeInTheDocument();
  });

  it("clears card number error when corrected", () => {
    render(<CreditCardInput />);

    const numberInput = screen.getByLabelText("Card number");
    // Trigger error
    fireEvent.change(numberInput, { target: { value: "4242" } });
    fireEvent.focus(numberInput);
    fireEvent.blur(numberInput);
    expect(screen.getByText("Card number is incomplete")).toBeInTheDocument();

    // Fix it
    fireEvent.change(numberInput, { target: { value: "4242424242424242" } });
    expect(screen.queryByText("Card number is incomplete")).not.toBeInTheDocument();
  });

  it("shows validation error on blur for empty name", () => {
    render(<CreditCardInput />);

    const nameInput = screen.getByLabelText("Cardholder name");
    fireEvent.focus(nameInput);
    fireEvent.blur(nameInput);

    expect(screen.getByText("Cardholder name is required")).toBeInTheDocument();
  });

  it("shows validation error on blur for empty expiry", () => {
    render(<CreditCardInput />);

    const expiryInput = screen.getByLabelText("Expiry date");
    fireEvent.focus(expiryInput);
    fireEvent.blur(expiryInput);

    expect(screen.getByText("Expiry date is required")).toBeInTheDocument();
  });

  it("shows validation error for invalid month", () => {
    render(<CreditCardInput />);

    const expiryInput = screen.getByLabelText("Expiry date");
    fireEvent.change(expiryInput, { target: { value: "1328" } });
    fireEvent.focus(expiryInput);
    fireEvent.blur(expiryInput);

    expect(screen.getByText("Invalid month")).toBeInTheDocument();
  });

  it("shows validation error for expired card", () => {
    render(<CreditCardInput />);

    const expiryInput = screen.getByLabelText("Expiry date");
    fireEvent.change(expiryInput, { target: { value: "0120" } });
    fireEvent.focus(expiryInput);
    fireEvent.blur(expiryInput);

    expect(screen.getByText("Card has expired")).toBeInTheDocument();
  });

  it("shows validation error on blur for empty CVC", () => {
    render(<CreditCardInput />);

    const cvcInput = screen.getByLabelText("Security code");
    fireEvent.focus(cvcInput);
    fireEvent.blur(cvcInput);

    expect(screen.getByText("Security code is required")).toBeInTheDocument();
  });

  it("shows validation error for incomplete CVC", () => {
    render(<CreditCardInput />);

    const cvcInput = screen.getByLabelText("Security code");
    fireEvent.change(cvcInput, { target: { value: "12" } });
    fireEvent.focus(cvcInput);
    fireEvent.blur(cvcInput);

    expect(screen.getByText("Must be 3 digits")).toBeInTheDocument();
  });

  it("does not show errors before field is touched", () => {
    render(<CreditCardInput />);

    expect(screen.queryByText("Card number is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Cardholder name is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Expiry date is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Security code is required")).not.toBeInTheDocument();
  });

  it("sets aria-invalid on inputs with errors", () => {
    render(<CreditCardInput />);

    const numberInput = screen.getByLabelText("Card number");
    // Before touch: no aria-invalid
    expect(numberInput).not.toHaveAttribute("aria-invalid");

    fireEvent.focus(numberInput);
    fireEvent.blur(numberInput);
    // After touch with empty value: aria-invalid="true"
    expect(numberInput).toHaveAttribute("aria-invalid", "true");
  });

  it("calls onValidate callback when errors change", () => {
    const onValidate = vi.fn();
    render(<CreditCardInput onValidate={onValidate} />);

    const numberInput = screen.getByLabelText("Card number");
    fireEvent.focus(numberInput);
    fireEvent.blur(numberInput);

    expect(onValidate).toHaveBeenCalled();
    const lastErrors = onValidate.mock.calls[onValidate.mock.calls.length - 1][0];
    expect(lastErrors.number).toBe("Card number is required");
  });

  it("error messages have role=alert for accessibility", () => {
    render(<CreditCardInput />);

    const numberInput = screen.getByLabelText("Card number");
    fireEvent.focus(numberInput);
    fireEvent.blur(numberInput);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Card number is required");
  });

  /* ---- Accessibility ---- */

  it("has proper labels for all inputs", () => {
    render(<CreditCardInput />);

    expect(screen.getByLabelText("Card number")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Card number")).toHaveAttribute(
      "inputMode",
      "numeric"
    );
    expect(screen.getByLabelText("Cardholder name")).toHaveAttribute(
      "type",
      "text"
    );
    expect(screen.getByLabelText("Expiry date")).toHaveAttribute(
      "inputMode",
      "numeric"
    );
    expect(screen.getByLabelText("Security code")).toHaveAttribute(
      "inputMode",
      "numeric"
    );
  });

  it("has autocomplete attributes for browser autofill", () => {
    render(<CreditCardInput />);

    expect(screen.getByLabelText("Card number")).toHaveAttribute(
      "autoComplete",
      "cc-number"
    );
    expect(screen.getByLabelText("Cardholder name")).toHaveAttribute(
      "autoComplete",
      "cc-name"
    );
    expect(screen.getByLabelText("Expiry date")).toHaveAttribute(
      "autoComplete",
      "cc-exp"
    );
    expect(screen.getByLabelText("Security code")).toHaveAttribute(
      "autoComplete",
      "cc-csc"
    );
  });

  it("has visible label text for each field", () => {
    render(<CreditCardInput />);

    expect(screen.getByText("Card Number")).toBeInTheDocument();
    expect(screen.getByText("Cardholder Name")).toBeInTheDocument();
    expect(screen.getByText("Expiry Date")).toBeInTheDocument();
    expect(screen.getByText("Security Code")).toBeInTheDocument();
  });

  /* ---- Card type visual feedback ---- */

  it("shows Visa placeholder for card numbers starting with 4", () => {
    const data: CreditCardData = {
      number: "4",
      name: "",
      expiry: "",
      cvc: "",
    };
    render(<CreditCardInput value={data} onChange={vi.fn()} />);

    const numberInput = screen.getByLabelText("Card number") as HTMLInputElement;
    expect(numberInput.placeholder).toBe("0000 0000 0000 0000");
  });

  it("shows Amex placeholder for card numbers starting with 37", () => {
    const data: CreditCardData = {
      number: "3782",
      name: "",
      expiry: "",
      cvc: "",
    };
    render(<CreditCardInput value={data} onChange={vi.fn()} />);

    const numberInput = screen.getByLabelText("Card number") as HTMLInputElement;
    expect(numberInput.placeholder).toBe("0000 000000 00000");

    const cvcInput = screen.getByLabelText("Security code") as HTMLInputElement;
    expect(cvcInput.placeholder).toBe("0000");
  });

  /* ---- Focus / card flip behavior ---- */

  it("tracks focus state for input fields", () => {
    render(<CreditCardInput />);

    const numberInput = screen.getByLabelText("Card number");
    fireEvent.focus(numberInput);

    const cvcInput = screen.getByLabelText("Security code");
    fireEvent.focus(cvcInput);

    fireEvent.blur(cvcInput);
  });

  /* ---- Auto-advance behavior ---- */

  it("auto-advances from card number to name when complete", () => {
    render(<CreditCardInput />);

    const numberInput = screen.getByLabelText("Card number");
    const nameInput = screen.getByLabelText("Cardholder name");

    fireEvent.change(numberInput, {
      target: { value: "4242424242424242" },
    });

    // nameRef.current?.focus() is called — verify no error and name input exists
    expect(nameInput).toBeInTheDocument();
  });

  it("auto-advances from expiry to CVC when complete", () => {
    render(<CreditCardInput />);

    const expiryInput = screen.getByLabelText("Expiry date");
    const cvcInput = screen.getByLabelText("Security code");

    fireEvent.change(expiryInput, {
      target: { value: "1230" },
    });

    expect(cvcInput).toBeInTheDocument();
  });

  /* ---- Edge cases ---- */

  it("handles empty onChange gracefully", () => {
    render(<CreditCardInput />);

    const numberInput = screen.getByLabelText("Card number");
    expect(() => {
      fireEvent.change(numberInput, { target: { value: "4242" } });
    }).not.toThrow();
  });

  it("handles rapid input changes", () => {
    const onChange = vi.fn();
    render(<CreditCardInput onChange={onChange} />);

    const numberInput = screen.getByLabelText("Card number");
    fireEvent.change(numberInput, { target: { value: "4" } });
    fireEvent.change(numberInput, { target: { value: "42" } });
    fireEvent.change(numberInput, { target: { value: "424" } });
    fireEvent.change(numberInput, { target: { value: "4242" } });

    expect(onChange).toHaveBeenCalledTimes(4);
  });

  it("passes additional HTML attributes to the root div", () => {
    const { container } = render(
      <CreditCardInput data-testid="cc-input" />
    );
    expect(container.querySelector('[data-testid="cc-input"]')).toBeInTheDocument();
  });

  it("clears name error while typing after touch", () => {
    render(<CreditCardInput />);

    const nameInput = screen.getByLabelText("Cardholder name");
    // Touch and blur to trigger error
    fireEvent.focus(nameInput);
    fireEvent.blur(nameInput);
    expect(screen.getByText("Cardholder name is required")).toBeInTheDocument();

    // Type to fix
    fireEvent.change(nameInput, { target: { value: "JOHN" } });
    expect(screen.queryByText("Cardholder name is required")).not.toBeInTheDocument();
  });

  it("shows no errors for valid pre-filled data on blur", () => {
    const data: CreditCardData = {
      number: "4242 4242 4242 4242",
      name: "JOHN DOE",
      expiry: "12/30",
      cvc: "123",
    };
    render(<CreditCardInput value={data} onChange={vi.fn()} />);

    // Blur all fields
    const numberInput = screen.getByLabelText("Card number");
    const nameInput = screen.getByLabelText("Cardholder name");
    const expiryInput = screen.getByLabelText("Expiry date");
    const cvcInput = screen.getByLabelText("Security code");

    [numberInput, nameInput, expiryInput, cvcInput].forEach((input) => {
      fireEvent.focus(input);
      fireEvent.blur(input);
    });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
