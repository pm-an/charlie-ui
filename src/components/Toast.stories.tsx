import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Toast } from "./Toast";
import { Button } from "./Button";

const meta: Meta<typeof Toast> = {
  title: "Feedback/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, iframeHeight: 300 } },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "error", "warning"],
    },
    duration: { control: "number" },
    open: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    title: "New update available",
    open: true,
    duration: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole("status");
    await expect(status).toBeInTheDocument();
    await expect(canvas.getByText("New update available")).toBeInTheDocument();
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Changes saved successfully",
    open: true,
    duration: 0,
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Failed to save changes",
    open: true,
    duration: 0,
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Your trial expires in 3 days",
    open: true,
    duration: 0,
  },
};

export const WithDescription: Story = {
  args: {
    variant: "success",
    title: "Deployment complete",
    description: "Your application has been deployed to production. All health checks passed.",
    open: true,
    duration: 0,
  },
};

export const WithAction: Story = {
  args: {
    variant: "error",
    title: "Connection lost",
    description: "Unable to reach the server. Please check your network connection.",
    action: (
      <Button variant="secondary" size="sm">
        Retry
      </Button>
    ),
    open: true,
    duration: 0,
  },
};

export const WithClose: Story = {
  render: function ToastStory() {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        {!open && (
          <div className="p-6">
            <Button variant="secondary" onClick={() => setOpen(true)}>
              Show Toast
            </Button>
          </div>
        )}
        <Toast
          variant="default"
          title="New notification"
          description="You have 3 unread messages in your inbox."
          open={open}
          onClose={() => setOpen(false)}
          duration={0}
        />
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Toast should be rendered (animated in via framer-motion)
    await expect(canvas.getByText("New notification")).toBeInTheDocument();
    await expect(canvas.getByText("You have 3 unread messages in your inbox.")).toBeInTheDocument();
    // Click close button
    const closeButton = canvas.getByLabelText("Close");
    await expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    // After closing, the "Show Toast" button should appear
    const reopenButton = await canvas.findByRole("button", { name: "Show Toast" });
    await expect(reopenButton).toBeVisible();
    // Click to re-open
    await userEvent.click(reopenButton);
    await expect(canvas.getByText("New notification")).toBeInTheDocument();
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-6">
      <div className="relative h-[80px]">
        <Toast variant="default" title="Info notification" open duration={0} />
      </div>
      <div className="relative h-[80px]">
        <Toast variant="success" title="Success notification" open duration={0} />
      </div>
      <div className="relative h-[80px]">
        <Toast variant="error" title="Error notification" open duration={0} />
      </div>
      <div className="relative h-[80px]">
        <Toast variant="warning" title="Warning notification" open duration={0} />
      </div>
    </div>
  ),
};
