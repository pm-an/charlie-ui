import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FormField, useFormField } from "../FormField";
import { Input } from "../Input";

describe("FormField", () => {
  it("renders label text", () => {
    render(
      <FormField label="Email">
        <Input />
      </FormField>
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(
      <FormField label="Email" description="Your work email">
        <Input />
      </FormField>
    );
    expect(screen.getByText("Your work email")).toBeInTheDocument();
  });

  it("renders error message when error is true", () => {
    render(
      <FormField label="Email" error errorMessage="Invalid email">
        <Input />
      </FormField>
    );
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("does not render error message when error is false", () => {
    render(
      <FormField label="Email" errorMessage="Invalid email">
        <Input />
      </FormField>
    );
    expect(screen.queryByText("Invalid email")).not.toBeInTheDocument();
  });

  it("shows required indicator on label", () => {
    const { container } = render(
      <FormField label="Email" required>
        <Input />
      </FormField>
    );
    const label = container.querySelector("label");
    expect(label).toBeInTheDocument();
    const styles = window.getComputedStyle(label!, "::after");
    // The required indicator is rendered via CSS after pseudo-element
    expect(label?.className).toContain("after:");
  });

  it("applies disabled styling to label", () => {
    const { container } = render(
      <FormField label="Email" disabled>
        <Input />
      </FormField>
    );
    const label = container.querySelector("label");
    expect(label?.className).toContain("opacity-65");
  });

  it("has data-slot attribute", () => {
    const { container } = render(
      <FormField label="Email">
        <Input />
      </FormField>
    );
    // FormField is now an alias for Field, which uses data-slot="field"
    expect(container.querySelector("[data-slot='field']")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <FormField label="Email" className="custom-class">
        <Input />
      </FormField>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders children", () => {
    render(
      <FormField label="Email">
        <Input placeholder="test@example.com" />
      </FormField>
    );
    expect(screen.getByPlaceholderText("test@example.com")).toBeInTheDocument();
  });
});

describe("useFormField", () => {
  it("returns null when used outside FormField", () => {
    function TestComponent() {
      const ctx = useFormField();
      return <div data-testid="result">{ctx === null ? "null" : "context"}</div>;
    }
    render(<TestComponent />);
    expect(screen.getByTestId("result")).toHaveTextContent("null");
  });

  it("returns context when used inside FormField", () => {
    function TestComponent() {
      const ctx = useFormField();
      return <div data-testid="result">{ctx ? "context" : "null"}</div>;
    }
    render(
      <FormField label="Test">
        <TestComponent />
      </FormField>
    );
    expect(screen.getByTestId("result")).toHaveTextContent("context");
  });
});
