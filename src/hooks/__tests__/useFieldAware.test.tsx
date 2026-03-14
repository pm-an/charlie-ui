import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useFieldAware } from "../useFieldAware";
import { FieldContext, type FieldContextValue } from "../../components/field-context";

function TestHarness(props: Parameters<typeof useFieldAware>[0]) {
  const result = useFieldAware(props);
  return (
    <div>
      <span data-testid="controlId">{result.controlId}</span>
      <span data-testid="insideField">{result.insideField ? "true" : "false"}</span>
      <span data-testid="error">{result.error ? "true" : "false"}</span>
      <span data-testid="disabled">{result.disabled ? "true" : "false"}</span>
      <span data-testid="required">{result.required ? "true" : "false"}</span>
      <span data-testid="ariaDescribedBy">{result.ariaDescribedBy ?? "undefined"}</span>
      <span data-testid="ariaInvalid">{result.ariaInvalid ? "true" : "undefined"}</span>
    </div>
  );
}

const mockContext: FieldContextValue = {
  id: "field-123",
  name: "email",
  error: false,
  disabled: false,
  required: false,
  descriptionId: "field-123-description",
  errorId: "field-123-error",
  labelId: "field-123-label",
};

function renderWithContext(
  ctx: FieldContextValue,
  props?: Parameters<typeof useFieldAware>[0]
) {
  return render(
    <FieldContext.Provider value={ctx}>
      <TestHarness {...props} />
    </FieldContext.Provider>
  );
}

describe("useFieldAware", () => {
  describe("standalone (outside Field)", () => {
    it("returns insideField as false", () => {
      render(<TestHarness />);
      expect(screen.getByTestId("insideField")).toHaveTextContent("false");
    });

    it("generates a controlId when no id prop", () => {
      render(<TestHarness />);
      const id = screen.getByTestId("controlId").textContent;
      expect(id).toBeTruthy();
      expect(id).toMatch(/^field-/);
    });

    it("uses provided id prop", () => {
      render(<TestHarness id="my-input" />);
      expect(screen.getByTestId("controlId")).toHaveTextContent("my-input");
    });

    it("returns error from prop", () => {
      render(<TestHarness error />);
      expect(screen.getByTestId("error")).toHaveTextContent("true");
    });

    it("returns disabled from prop", () => {
      render(<TestHarness disabled />);
      expect(screen.getByTestId("disabled")).toHaveTextContent("true");
    });

    it("returns required from prop", () => {
      render(<TestHarness required />);
      expect(screen.getByTestId("required")).toHaveTextContent("true");
    });

    it("builds ariaDescribedBy from description and errorMessage", () => {
      render(
        <TestHarness
          id="test"
          description="Help text"
          error
          errorMessage="Error text"
        />
      );
      const describedBy = screen.getByTestId("ariaDescribedBy").textContent;
      expect(describedBy).toContain("test-description");
      expect(describedBy).toContain("test-error");
    });

    it("returns undefined ariaDescribedBy when no description or error", () => {
      render(<TestHarness />);
      expect(screen.getByTestId("ariaDescribedBy")).toHaveTextContent("undefined");
    });

    it("returns ariaInvalid as true when error", () => {
      render(<TestHarness error />);
      expect(screen.getByTestId("ariaInvalid")).toHaveTextContent("true");
    });

    it("returns ariaInvalid as undefined when no error", () => {
      render(<TestHarness />);
      expect(screen.getByTestId("ariaInvalid")).toHaveTextContent("undefined");
    });
  });

  describe("inside Field (with context)", () => {
    it("returns insideField as true", () => {
      renderWithContext(mockContext);
      expect(screen.getByTestId("insideField")).toHaveTextContent("true");
    });

    it("uses context id when no id prop", () => {
      renderWithContext(mockContext);
      expect(screen.getByTestId("controlId")).toHaveTextContent("field-123");
    });

    it("prop id overrides context id", () => {
      renderWithContext(mockContext, { id: "override-id" });
      expect(screen.getByTestId("controlId")).toHaveTextContent("override-id");
    });

    it("uses context error state", () => {
      renderWithContext({ ...mockContext, error: true });
      expect(screen.getByTestId("error")).toHaveTextContent("true");
    });

    it("prop error overrides context error", () => {
      renderWithContext({ ...mockContext, error: true }, { error: false });
      expect(screen.getByTestId("error")).toHaveTextContent("false");
    });

    it("uses context disabled state", () => {
      renderWithContext({ ...mockContext, disabled: true });
      expect(screen.getByTestId("disabled")).toHaveTextContent("true");
    });

    it("prop disabled overrides context disabled", () => {
      renderWithContext({ ...mockContext, disabled: true }, { disabled: false });
      expect(screen.getByTestId("disabled")).toHaveTextContent("false");
    });

    it("uses context required state", () => {
      renderWithContext({ ...mockContext, required: true });
      expect(screen.getByTestId("required")).toHaveTextContent("true");
    });

    it("prop required overrides context required", () => {
      renderWithContext({ ...mockContext, required: true }, { required: false });
      expect(screen.getByTestId("required")).toHaveTextContent("false");
    });

    it("builds ariaDescribedBy from context IDs", () => {
      renderWithContext(mockContext);
      const describedBy = screen.getByTestId("ariaDescribedBy").textContent;
      expect(describedBy).toContain("field-123-description");
    });

    it("includes error ID in ariaDescribedBy when error is true", () => {
      renderWithContext({ ...mockContext, error: true });
      const describedBy = screen.getByTestId("ariaDescribedBy").textContent;
      expect(describedBy).toContain("field-123-description");
      expect(describedBy).toContain("field-123-error");
    });
  });
});
