import { forwardRef, useState, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { Check } from "lucide-react";

export type CheckoutShippingData = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export type CheckoutPaymentData = {
  cardNumber: string;
  expiry: string;
  cvc: string;
};

export type CheckoutFormData = {
  shipping: CheckoutShippingData;
  payment: CheckoutPaymentData;
};

export type CheckoutFormProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> & {
  onSubmit?: (data: CheckoutFormData) => void;
  steps?: string[];
  defaultStep?: number;
};

const inputClasses =
  "w-full bg-white/5 border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/15 focus:outline-none focus:ring-1 focus:ring-white/15 transition-colors";

const labelClasses = "block text-sm font-medium text-white/80 mb-1.5";

const CheckoutForm = forwardRef<HTMLDivElement, CheckoutFormProps>(
  (
    {
      className,
      onSubmit,
      steps = ["Shipping", "Payment", "Review"],
      defaultStep = 0,
      ...props
    },
    ref
  ) => {
    const [currentStep, setCurrentStep] = useState(defaultStep);
    const [shipping, setShipping] = useState<CheckoutShippingData>({
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    });
    const [payment, setPayment] = useState<CheckoutPaymentData>({
      cardNumber: "",
      expiry: "",
      cvc: "",
    });

    const updateShipping = (field: keyof CheckoutShippingData, value: string) => {
      setShipping((prev) => ({ ...prev, [field]: value }));
    };

    const updatePayment = (field: keyof CheckoutPaymentData, value: string) => {
      setPayment((prev) => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    };

    const handleBack = () => {
      if (currentStep > 0) {
        setCurrentStep((prev) => prev - 1);
      }
    };

    const handleSubmit = () => {
      onSubmit?.({ shipping, payment });
    };

    const isLastStep = currentStep === steps.length - 1;

    return (
      <div
        ref={ref}
        data-slot="checkout-form"
        className={cn("mx-auto w-full max-w-2xl", className)}
        {...props}
      >
        {/* Step indicator */}
        <div className="mb-8 flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all",
                    index < currentStep
                      ? "bg-green text-white"
                      : index === currentStep
                        ? "bg-white/20 text-white ring-2 ring-white/30"
                        : "bg-white/5 text-white/40"
                  )}
                  aria-current={index === currentStep ? "step" : undefined}
                >
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "mt-1.5 text-xs",
                    index <= currentStep ? "text-white/80" : "text-white/40"
                  )}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-3 mb-5 h-px w-12 sm:w-16",
                    index < currentStep ? "bg-green" : "bg-white/10"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="rounded-xl border border-white/[0.06] bg-card-gradient p-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Shipping Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className={labelClasses}>
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={shipping.firstName}
                    onChange={(e) =>
                      updateShipping("firstName", e.target.value)
                    }
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={labelClasses}>
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={shipping.lastName}
                    onChange={(e) =>
                      updateShipping("lastName", e.target.value)
                    }
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={labelClasses}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={shipping.email}
                  onChange={(e) => updateShipping("email", e.target.value)}
                  className={inputClasses}
                />
              </div>

              <div>
                <label htmlFor="address" className={labelClasses}>
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  placeholder="123 Main St"
                  value={shipping.address}
                  onChange={(e) => updateShipping("address", e.target.value)}
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="city" className={labelClasses}>
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="New York"
                    value={shipping.city}
                    onChange={(e) => updateShipping("city", e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="state" className={labelClasses}>
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    placeholder="NY"
                    value={shipping.state}
                    onChange={(e) => updateShipping("state", e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="zip" className={labelClasses}>
                    ZIP Code
                  </label>
                  <input
                    id="zip"
                    type="text"
                    placeholder="10001"
                    value={shipping.zip}
                    onChange={(e) => updateShipping("zip", e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Payment Details
              </h3>

              <div>
                <label htmlFor="cardNumber" className={labelClasses}>
                  Card Number
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={payment.cardNumber}
                  onChange={(e) =>
                    updatePayment("cardNumber", e.target.value)
                  }
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className={labelClasses}>
                    Expiry Date
                  </label>
                  <input
                    id="expiry"
                    type="text"
                    placeholder="MM/YY"
                    value={payment.expiry}
                    onChange={(e) =>
                      updatePayment("expiry", e.target.value)
                    }
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="cvc" className={labelClasses}>
                    CVC
                  </label>
                  <input
                    id="cvc"
                    type="text"
                    placeholder="123"
                    value={payment.cvc}
                    onChange={(e) => updatePayment("cvc", e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">
                Review Order
              </h3>

              <div>
                <h4 className="text-sm font-medium text-white/60 mb-2">
                  Shipping Address
                </h4>
                <div className="rounded-lg bg-white/[0.03] p-3 text-sm text-white">
                  <p>
                    {shipping.firstName} {shipping.lastName}
                  </p>
                  <p className="text-white/60">{shipping.email}</p>
                  <p className="mt-1 text-white/60">{shipping.address}</p>
                  <p className="text-white/60">
                    {shipping.city}
                    {shipping.state && `, ${shipping.state}`} {shipping.zip}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-white/60 mb-2">
                  Payment Method
                </h4>
                <div className="rounded-lg bg-white/[0.03] p-3 text-sm text-white">
                  <p>
                    Card ending in{" "}
                    {payment.cardNumber.slice(-4) || "****"}
                  </p>
                  <p className="text-white/60">
                    Expires {payment.expiry || "MM/YY"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex justify-between">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-md border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:border-white/15 active:scale-[0.98]"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={isLastStep ? handleSubmit : handleNext}
              className="rounded-md bg-white/80 px-6 py-2 text-sm font-medium text-[#18191a] transition-all duration-200 hover:bg-white active:scale-[0.98]"
            >
              {isLastStep ? "Place Order" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

CheckoutForm.displayName = "CheckoutForm";

export { CheckoutForm };
