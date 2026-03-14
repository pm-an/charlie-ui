import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CreditCardInput, type CreditCardData } from "./CreditCardInput";

const meta: Meta<typeof CreditCardInput> = {
  title: "Forms/CreditCardInput",
  component: CreditCardInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="p-8 min-w-[440px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof CreditCardInput>;

/* ---- Default (uncontrolled) ---- */
export const Default: Story = {};

/* ---- Controlled with live data preview ---- */
export const Controlled: Story = {
  render: () => {
    const [data, setData] = useState<CreditCardData>({
      number: "",
      name: "",
      expiry: "",
      cvc: "",
    });

    return (
      <div className="space-y-6">
        <CreditCardInput value={data} onChange={setData} />
        <pre className="text-xs text-white/40 bg-white/5 rounded-md p-3 font-mono">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  },
};

/* ---- Pre-filled Visa ---- */
export const PrefilledVisa: Story = {
  render: () => {
    const [data, setData] = useState<CreditCardData>({
      number: "4242 4242 4242 4242",
      name: "JANE SMITH",
      expiry: "12/28",
      cvc: "123",
    });

    return <CreditCardInput value={data} onChange={setData} />;
  },
};

/* ---- Pre-filled Mastercard ---- */
export const PrefilledMastercard: Story = {
  render: () => {
    const [data, setData] = useState<CreditCardData>({
      number: "5425 2334 3010 9903",
      name: "ALEX JOHNSON",
      expiry: "06/27",
      cvc: "456",
    });

    return <CreditCardInput value={data} onChange={setData} />;
  },
};

/* ---- Pre-filled Amex ---- */
export const PrefilledAmex: Story = {
  render: () => {
    const [data, setData] = useState<CreditCardData>({
      number: "3782 822463 10005",
      name: "SAM WILLIAMS",
      expiry: "09/26",
      cvc: "7890",
    });

    return <CreditCardInput value={data} onChange={setData} />;
  },
};

/* ---- With validation callback ---- */
export const WithValidation: Story = {
  render: () => {
    const [data, setData] = useState<CreditCardData>({
      number: "",
      name: "",
      expiry: "",
      cvc: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    return (
      <div className="space-y-6">
        <CreditCardInput
          value={data}
          onChange={setData}
          onValidate={setErrors}
        />
        {Object.keys(errors).length > 0 && (
          <pre className="text-xs text-red bg-red-muted rounded-md p-3 font-mono">
            {JSON.stringify(errors, null, 2)}
          </pre>
        )}
      </div>
    );
  },
};

/* ---- Disabled ---- */
export const Disabled: Story = {
  render: () => {
    const [data, setData] = useState<CreditCardData>({
      number: "4111 1111 1111 1111",
      name: "DISABLED USER",
      expiry: "01/30",
      cvc: "999",
    });

    return <CreditCardInput value={data} onChange={setData} disabled />;
  },
};
