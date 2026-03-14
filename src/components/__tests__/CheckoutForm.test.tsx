import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CheckoutForm } from "../CheckoutForm";

describe("CheckoutForm", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<CheckoutForm />);
      expect(screen.getByText("Shipping Information")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <CheckoutForm className="my-form" />
      );
      expect(container.firstChild).toHaveClass("my-form");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<CheckoutForm ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("has data-slot attribute", () => {
      const { container } = render(<CheckoutForm />);
      expect(container.firstChild).toHaveAttribute(
        "data-slot",
        "checkout-form"
      );
    });

    it("renders step indicators", () => {
      render(<CheckoutForm />);
      expect(screen.getByText("Shipping")).toBeInTheDocument();
      expect(screen.getByText("Payment")).toBeInTheDocument();
      expect(screen.getByText("Review")).toBeInTheDocument();
    });

    it("renders custom steps", () => {
      render(<CheckoutForm steps={["Info", "Confirm"]} />);
      expect(screen.getByText("Info")).toBeInTheDocument();
      expect(screen.getByText("Confirm")).toBeInTheDocument();
    });
  });

  describe("step 1 - shipping", () => {
    it("renders shipping form fields", () => {
      render(<CheckoutForm />);
      expect(screen.getByLabelText("First Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Address")).toBeInTheDocument();
      expect(screen.getByLabelText("City")).toBeInTheDocument();
      expect(screen.getByLabelText("State")).toBeInTheDocument();
      expect(screen.getByLabelText("ZIP Code")).toBeInTheDocument();
    });

    it("allows entering shipping data", () => {
      render(<CheckoutForm />);
      const firstNameInput = screen.getByLabelText("First Name");
      fireEvent.change(firstNameInput, { target: { value: "John" } });
      expect(firstNameInput).toHaveValue("John");
    });

    it("shows Continue button on first step", () => {
      render(<CheckoutForm />);
      expect(
        screen.getByRole("button", { name: "Continue" })
      ).toBeInTheDocument();
    });

    it("does not show Back button on first step", () => {
      render(<CheckoutForm />);
      expect(
        screen.queryByRole("button", { name: "Back" })
      ).not.toBeInTheDocument();
    });
  });

  describe("step navigation", () => {
    it("advances to payment step when Continue is clicked", () => {
      render(<CheckoutForm />);
      fireEvent.click(screen.getByRole("button", { name: "Continue" }));
      expect(screen.getByText("Payment Details")).toBeInTheDocument();
    });

    it("goes back to shipping when Back is clicked from payment", () => {
      render(<CheckoutForm defaultStep={1} />);
      expect(screen.getByText("Payment Details")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Back" }));
      expect(screen.getByText("Shipping Information")).toBeInTheDocument();
    });

    it("shows Back button on second step", () => {
      render(<CheckoutForm defaultStep={1} />);
      expect(
        screen.getByRole("button", { name: "Back" })
      ).toBeInTheDocument();
    });

    it("advances to review step", () => {
      render(<CheckoutForm />);
      // Go to payment
      fireEvent.click(screen.getByRole("button", { name: "Continue" }));
      // Go to review
      fireEvent.click(screen.getByRole("button", { name: "Continue" }));
      expect(screen.getByText("Review Order")).toBeInTheDocument();
    });

    it("shows Place Order on last step", () => {
      render(<CheckoutForm defaultStep={2} />);
      expect(
        screen.getByRole("button", { name: "Place Order" })
      ).toBeInTheDocument();
    });
  });

  describe("step 2 - payment", () => {
    it("renders payment form fields", () => {
      render(<CheckoutForm defaultStep={1} />);
      expect(screen.getByLabelText("Card Number")).toBeInTheDocument();
      expect(screen.getByLabelText("Expiry Date")).toBeInTheDocument();
      expect(screen.getByLabelText("CVC")).toBeInTheDocument();
    });

    it("allows entering payment data", () => {
      render(<CheckoutForm defaultStep={1} />);
      const cardInput = screen.getByLabelText("Card Number");
      fireEvent.change(cardInput, {
        target: { value: "4242424242424242" },
      });
      expect(cardInput).toHaveValue("4242424242424242");
    });
  });

  describe("step 3 - review", () => {
    it("displays entered shipping data on review", () => {
      render(<CheckoutForm />);

      // Fill in shipping
      fireEvent.change(screen.getByLabelText("First Name"), {
        target: { value: "John" },
      });
      fireEvent.change(screen.getByLabelText("Last Name"), {
        target: { value: "Doe" },
      });
      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "john@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Address"), {
        target: { value: "123 Main St" },
      });
      fireEvent.change(screen.getByLabelText("City"), {
        target: { value: "New York" },
      });
      fireEvent.change(screen.getByLabelText("State"), {
        target: { value: "NY" },
      });
      fireEvent.change(screen.getByLabelText("ZIP Code"), {
        target: { value: "10001" },
      });

      // Navigate to payment
      fireEvent.click(screen.getByRole("button", { name: "Continue" }));
      // Navigate to review
      fireEvent.click(screen.getByRole("button", { name: "Continue" }));

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("123 Main St")).toBeInTheDocument();
    });

    it("displays entered payment data on review", () => {
      render(<CheckoutForm defaultStep={1} />);

      fireEvent.change(screen.getByLabelText("Card Number"), {
        target: { value: "4242424242424242" },
      });
      fireEvent.change(screen.getByLabelText("Expiry Date"), {
        target: { value: "12/25" },
      });

      // Navigate to review
      fireEvent.click(screen.getByRole("button", { name: "Continue" }));

      expect(screen.getByText(/ending in 4242/)).toBeInTheDocument();
      expect(screen.getByText(/12\/25/)).toBeInTheDocument();
    });
  });

  describe("submission", () => {
    it("calls onSubmit with form data when Place Order is clicked", () => {
      const onSubmit = vi.fn();
      render(<CheckoutForm onSubmit={onSubmit} />);

      // Fill shipping
      fireEvent.change(screen.getByLabelText("First Name"), {
        target: { value: "Jane" },
      });
      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "jane@test.com" },
      });

      // Go to payment
      fireEvent.click(screen.getByRole("button", { name: "Continue" }));

      // Fill payment
      fireEvent.change(screen.getByLabelText("Card Number"), {
        target: { value: "4111111111111111" },
      });

      // Go to review
      fireEvent.click(screen.getByRole("button", { name: "Continue" }));

      // Submit
      fireEvent.click(screen.getByRole("button", { name: "Place Order" }));

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          shipping: expect.objectContaining({
            firstName: "Jane",
            email: "jane@test.com",
          }),
          payment: expect.objectContaining({
            cardNumber: "4111111111111111",
          }),
        })
      );
    });
  });

  describe("step indicator", () => {
    it("marks current step with aria-current", () => {
      const { container } = render(<CheckoutForm />);
      const currentStepEl = container.querySelector('[aria-current="step"]');
      expect(currentStepEl).toBeInTheDocument();
      expect(currentStepEl).toHaveTextContent("1");
    });

    it("shows check icon for completed steps", () => {
      const { container } = render(<CheckoutForm defaultStep={1} />);
      // Step 1 is completed, should have check icon (svg)
      const stepCircles = container.querySelectorAll(".rounded-full");
      const firstStep = stepCircles[0];
      expect(firstStep.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("defaultStep", () => {
    it("starts at shipping by default", () => {
      render(<CheckoutForm />);
      expect(screen.getByText("Shipping Information")).toBeInTheDocument();
    });

    it("starts at payment when defaultStep is 1", () => {
      render(<CheckoutForm defaultStep={1} />);
      expect(screen.getByText("Payment Details")).toBeInTheDocument();
    });

    it("starts at review when defaultStep is 2", () => {
      render(<CheckoutForm defaultStep={2} />);
      expect(screen.getByText("Review Order")).toBeInTheDocument();
    });
  });
});
