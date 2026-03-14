import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toaster } from "./Toaster";
import { toast } from "./toast-store";
import { Button } from "./Button";

const meta: Meta<typeof Toaster> = {
  title: "Feedback/Toaster",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, iframeHeight: 400 } },
  },
};
export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: function ToasterDemo() {
    return (
      <div className="p-6 flex flex-wrap gap-3">
        <Button
          variant="secondary"
          onClick={() => toast("New update available")}
        >
          Default Toast
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.success("Deployment complete", {
              description: "All health checks passed.",
            })
          }
        >
          Success Toast
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.error("Failed to save changes", {
              description: "Please check your network connection.",
            })
          }
        >
          Error Toast
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.warning("Your trial expires in 3 days")
          }
        >
          Warning Toast
        </Button>
        <Button
          variant="ghost"
          onClick={() => toast.dismissAll()}
        >
          Dismiss All
        </Button>
        <Toaster />
      </div>
    );
  },
};

export const WithCustomDuration: Story = {
  render: function ToasterDurationDemo() {
    return (
      <div className="p-6 flex flex-wrap gap-3">
        <Button
          variant="secondary"
          onClick={() => toast("This stays for 10 seconds", { duration: 10000 })}
        >
          Long Duration (10s)
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.success("Quick flash!", { duration: 1500 })}
        >
          Short Duration (1.5s)
        </Button>
        <Toaster />
      </div>
    );
  },
};
