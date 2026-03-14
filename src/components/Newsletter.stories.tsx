import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, fn } from "storybook/test";
import { Newsletter } from "./Newsletter";

const meta: Meta<typeof Newsletter> = {
  title: "Layout/Newsletter",
  component: Newsletter,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Newsletter>;

export const Default: Story = {
  args: {
    title: "Stay up to date",
    description:
      "Get notified about new components, updates, and design tips. No spam, unsubscribe anytime.",
    onSubmit: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Stay up to date")).toBeVisible();
    const emailInput = canvas.getByPlaceholderText("Enter your email");
    const submitButton = canvas.getByRole("button", { name: "Subscribe" });
    await expect(emailInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    // Type an email and submit
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(submitButton);
    await expect(args.onSubmit).toHaveBeenCalledWith("test@example.com");
    // Input should be cleared after submission
    await expect(emailInput).toHaveValue("");
  },
};
