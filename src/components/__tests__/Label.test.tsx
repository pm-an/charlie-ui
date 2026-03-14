import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Label } from "../Label";

describe("Label", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<Label>Email</Label>);
      expect(screen.getByText("Email")).toBeInTheDocument();
    });

    it("renders as a label element", () => {
      const { container } = render(<Label>Name</Label>);
      expect(container.querySelector("label")).toBeInTheDocument();
    });

    it("renders children text", () => {
      render(<Label>Username</Label>);
      expect(screen.getByText("Username")).toBeInTheDocument();
    });
  });

  describe("props", () => {
    it("applies htmlFor attribute", () => {
      const { container } = render(<Label htmlFor="email-input">Email</Label>);
      const label = container.querySelector("label");
      expect(label).toHaveAttribute("for", "email-input");
    });

    it("merges custom className", () => {
      const { container } = render(<Label className="custom">Email</Label>);
      const label = container.querySelector("label");
      expect(label).toHaveClass("custom");
    });

    it("passes through HTML attributes", () => {
      render(<Label data-testid="my-label">Email</Label>);
      expect(screen.getByTestId("my-label")).toBeInTheDocument();
    });
  });

  describe("required", () => {
    it("shows red asterisk when required", () => {
      const { container } = render(<Label required>Password</Label>);
      const asterisk = container.querySelector("span");
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveTextContent("*");
    });

    it("does not show asterisk when not required", () => {
      const { container } = render(<Label>Password</Label>);
      const asterisk = container.querySelector("span");
      expect(asterisk).not.toBeInTheDocument();
    });
  });

  describe("disabled", () => {
    it("applies disabled styles when disabled", () => {
      const { container } = render(<Label disabled>Email</Label>);
      const label = container.querySelector("label");
      expect(label).toHaveClass("opacity-65");
      expect(label).toHaveClass("cursor-not-allowed");
    });

    it("does not apply disabled styles when not disabled", () => {
      const { container } = render(<Label>Email</Label>);
      const label = container.querySelector("label");
      expect(label).not.toHaveClass("opacity-65");
    });
  });

  describe("combined states", () => {
    it("renders required and disabled together", () => {
      const { container } = render(
        <Label required disabled>
          API key
        </Label>
      );
      const label = container.querySelector("label");
      expect(label).toHaveClass("opacity-65");
      const asterisk = container.querySelector("span");
      expect(asterisk).toHaveTextContent("*");
    });
  });

  describe("accessibility", () => {
    it("associates with form control via htmlFor", () => {
      const { container } = render(
        <>
          <Label htmlFor="test-input">Test</Label>
          <input id="test-input" />
        </>
      );
      const label = container.querySelector("label");
      expect(label).toHaveAttribute("for", "test-input");
    });
  });
});
