import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Field } from "../Field";
import { useFieldContext } from "../field-context";
import { Input } from "../Input";
import { expectNoA11yViolations } from "../../test/a11y";

describe("Field", () => {
  it("renders without crashing", () => {
    render(
      <Field label="Email">
        <Input />
      </Field>
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders label text", () => {
    render(
      <Field label="Username">
        <Input />
      </Field>
    );
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(
      <Field label="Email" description="Your work email">
        <Input />
      </Field>
    );
    expect(screen.getByText("Your work email")).toBeInTheDocument();
  });

  it("renders helperText as deprecated alias for description", () => {
    render(
      <Field label="Email" helperText="Use your work email">
        <Input />
      </Field>
    );
    expect(screen.getByText("Use your work email")).toBeInTheDocument();
  });

  it("prefers description over helperText", () => {
    render(
      <Field label="Email" description="Description text" helperText="Helper text">
        <Input />
      </Field>
    );
    expect(screen.getByText("Description text")).toBeInTheDocument();
    expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
  });

  it("renders error message when error is true", () => {
    render(
      <Field label="Email" error errorMessage="Invalid email">
        <Input />
      </Field>
    );
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("does not render error message when error is false", () => {
    render(
      <Field label="Email" errorMessage="Invalid email">
        <Input />
      </Field>
    );
    expect(screen.queryByText("Invalid email")).not.toBeInTheDocument();
  });

  it("shows required indicator on label", () => {
    const { container } = render(
      <Field label="Email" required>
        <Input />
      </Field>
    );
    const label = container.querySelector("label");
    expect(label).toBeInTheDocument();
    expect(label?.className).toContain("after:");
  });

  it("applies disabled styling to label", () => {
    const { container } = render(
      <Field label="Email" disabled>
        <Input />
      </Field>
    );
    const label = container.querySelector("label");
    expect(label?.className).toContain("opacity-50");
  });

  it("has data-slot attribute", () => {
    const { container } = render(
      <Field label="Email">
        <Input />
      </Field>
    );
    expect(container.querySelector("[data-slot='field']")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Field label="Email" className="custom-class">
        <Input />
      </Field>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders children", () => {
    render(
      <Field label="Email">
        <Input placeholder="test@example.com" />
      </Field>
    );
    expect(screen.getByPlaceholderText("test@example.com")).toBeInTheDocument();
  });

  it("generates label id and for attribute", () => {
    const { container } = render(
      <Field label="Email">
        <Input />
      </Field>
    );
    const label = container.querySelector("label");
    expect(label?.getAttribute("for")).toBeTruthy();
    expect(label?.getAttribute("id")).toBeTruthy();
  });

  it("uses custom htmlFor", () => {
    const { container } = render(
      <Field label="Email" htmlFor="custom-id">
        <Input />
      </Field>
    );
    const label = container.querySelector("label");
    expect(label?.getAttribute("for")).toBe("custom-id");
  });
});

describe("Field compound sub-components", () => {
  it("renders with compound children (Field.Label, Field.Description, Field.Error)", () => {
    render(
      <Field error errorMessage="Required">
        <Field.Label>Username</Field.Label>
        <Field.Description>Pick a unique name</Field.Description>
        <Input placeholder="username" />
        <Field.Error>Required</Field.Error>
      </Field>
    );
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("Pick a unique name")).toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("username")).toBeInTheDocument();
  });

  it("Field.Label has data-slot attribute", () => {
    const { container } = render(
      <Field>
        <Field.Label>Test</Field.Label>
      </Field>
    );
    expect(container.querySelector("[data-slot='field-label']")).toBeInTheDocument();
  });

  it("Field.Description has data-slot attribute", () => {
    const { container } = render(
      <Field>
        <Field.Description>Help text</Field.Description>
      </Field>
    );
    expect(container.querySelector("[data-slot='field-description']")).toBeInTheDocument();
  });

  it("Field.Error has data-slot and role=alert", () => {
    render(
      <Field>
        <Field.Error>Error msg</Field.Error>
      </Field>
    );
    const errorEl = screen.getByRole("alert");
    expect(errorEl).toHaveTextContent("Error msg");
    expect(errorEl.getAttribute("data-slot")).toBe("field-error");
  });

  it("Field.Error renders nothing when no children", () => {
    const { container } = render(
      <Field>
        <Field.Error>{null}</Field.Error>
      </Field>
    );
    expect(container.querySelector("[data-slot='field-error']")).not.toBeInTheDocument();
  });
});

describe("Field context propagation", () => {
  it("provides context to children", () => {
    function TestConsumer() {
      const ctx = useFieldContext();
      return <div data-testid="ctx">{ctx ? "has-context" : "no-context"}</div>;
    }
    render(
      <Field label="Test">
        <TestConsumer />
      </Field>
    );
    expect(screen.getByTestId("ctx")).toHaveTextContent("has-context");
  });

  it("context includes correct error state", () => {
    function TestConsumer() {
      const ctx = useFieldContext();
      return <div data-testid="error">{ctx?.error ? "error" : "no-error"}</div>;
    }
    render(
      <Field label="Test" error>
        <TestConsumer />
      </Field>
    );
    expect(screen.getByTestId("error")).toHaveTextContent("error");
  });

  it("context includes correct disabled state", () => {
    function TestConsumer() {
      const ctx = useFieldContext();
      return <div data-testid="disabled">{ctx?.disabled ? "disabled" : "enabled"}</div>;
    }
    render(
      <Field label="Test" disabled>
        <TestConsumer />
      </Field>
    );
    expect(screen.getByTestId("disabled")).toHaveTextContent("disabled");
  });

  it("context includes correct required state", () => {
    function TestConsumer() {
      const ctx = useFieldContext();
      return <div data-testid="required">{ctx?.required ? "required" : "optional"}</div>;
    }
    render(
      <Field label="Test" required>
        <TestConsumer />
      </Field>
    );
    expect(screen.getByTestId("required")).toHaveTextContent("required");
  });

  it("returns null outside Field", () => {
    function TestConsumer() {
      const ctx = useFieldContext();
      return <div data-testid="ctx">{ctx === null ? "null" : "context"}</div>;
    }
    render(<TestConsumer />);
    expect(screen.getByTestId("ctx")).toHaveTextContent("null");
  });
});

describe("Field accessibility", () => {
  it("error message has role=alert in simple mode", () => {
    render(
      <Field label="Email" error errorMessage="Required">
        <Input />
      </Field>
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  it("Field.Error compound component has role=alert", () => {
    render(
      <Field error>
        <Field.Label>Name</Field.Label>
        <Input />
        <Field.Error>Name is required</Field.Error>
      </Field>
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Name is required");
  });

  it("passes axe checks with label and description", async () => {
    const { container } = render(
      <Field label="Email" description="Your work email">
        <Input placeholder="email@example.com" />
      </Field>
    );
    await expectNoA11yViolations(container);
  });

  it("passes axe checks with error state", async () => {
    const { container } = render(
      <Field label="Email" error errorMessage="Required">
        <Input placeholder="email@example.com" />
      </Field>
    );
    await expectNoA11yViolations(container);
  });
});
