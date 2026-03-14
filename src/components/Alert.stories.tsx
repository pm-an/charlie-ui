import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Alert } from "./Alert";
import { Button } from "./Button";
import { Rocket } from "lucide-react";

const meta: Meta<typeof Alert> = {
  title: "Feedback/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "info", "success", "warning", "error"],
    },
    closable: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    variant: "default",
    title: "Heads up",
    children: "This is a default alert with neutral styling.",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    title: "New deployment started",
    children:
      "Your application is being deployed to the staging environment. This usually takes 2-3 minutes.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Payment received",
    children:
      "We've successfully processed your payment of $49.00. A receipt has been sent to your email.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "API rate limit approaching",
    children:
      "You've used 89% of your monthly API quota. Consider upgrading your plan to avoid disruptions.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Build failed",
    children:
      "The deployment failed due to a type error in src/index.ts. Check the build logs for details.",
  },
};

export const WithAction: Story = {
  args: {
    variant: "error",
    title: "Connection lost",
    children: "Unable to reach the server. Please check your network.",
    action: (
      <Button variant="secondary" size="sm">
        Retry connection
      </Button>
    ),
  },
};

export const Closable: Story = {
  render: function ClosableAlert() {
    const [visible, setVisible] = React.useState(true);
    if (!visible) {
      return (
        <Button variant="secondary" size="sm" onClick={() => setVisible(true)}>
          Show alert
        </Button>
      );
    }
    return (
      <Alert
        variant="info"
        title="Tip"
        closable
        onClose={() => setVisible(false)}
      >
        You can dismiss this alert by clicking the close button.
      </Alert>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Tip")).toBeInTheDocument();
    const closeButton = canvas.getByLabelText("Close");
    await expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    const reopenButton = await canvas.findByRole("button", {
      name: "Show alert",
    });
    await expect(reopenButton).toBeVisible();
  },
};

export const CustomIcon: Story = {
  args: {
    variant: "info",
    title: "Launching soon",
    icon: <Rocket className="mt-0.5 h-5 w-5 shrink-0" />,
    children: "Your project is scheduled to go live at 3:00 PM UTC.",
  },
};

export const TitleOnly: Story = {
  args: {
    variant: "success",
    title: "Settings saved successfully",
  },
};

export const DescriptionOnly: Story = {
  args: {
    variant: "warning",
    children:
      "Your session will expire in 5 minutes. Save your work to avoid losing changes.",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Alert variant="default" title="Default">
        This is a default alert with neutral styling.
      </Alert>
      <Alert variant="info" title="Info">
        New deployment started for your staging environment.
      </Alert>
      <Alert variant="success" title="Success">
        Payment of $49.00 processed successfully.
      </Alert>
      <Alert variant="warning" title="Warning">
        API rate limit at 89% of monthly quota.
      </Alert>
      <Alert variant="error" title="Error">
        Build failed due to a type error in src/index.ts.
      </Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Default")).toBeVisible();
    await expect(canvas.getByText("Info")).toBeVisible();
    await expect(canvas.getByText("Success")).toBeVisible();
    await expect(canvas.getByText("Warning")).toBeVisible();
    await expect(canvas.getByText("Error")).toBeVisible();
  },
};
