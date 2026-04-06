import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorPage } from "./ErrorPage";
import { Button } from "./Button";

const meta: Meta<typeof ErrorPage> = {
  title: "Blocks/Feedback/ErrorPage",
  component: ErrorPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="bg-bg">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ErrorPage>;

export const NotFound: Story = {
  args: {
    code: "404",
    backHref: "/",
  },
};

export const ServerError: Story = {
  args: {
    code: "500",
    action: (
      <Button variant="primary" onClick={() => window.location.reload()}>
        Try again
      </Button>
    ),
    backHref: "/",
  },
};

export const Maintenance: Story = {
  args: {
    code: "maintenance",
    backHref: "/",
  },
};

export const ComingSoon: Story = {
  args: {
    code: "coming-soon",
    action: (
      <Button variant="primary">
        Notify me
      </Button>
    ),
  },
};

export const Custom: Story = {
  args: {
    code: "503",
    title: "We'll be right back",
    description:
      "Our team is performing scheduled maintenance to improve your experience. Expected downtime: 30 minutes.",
    action: (
      <Button variant="primary">
        Check status
      </Button>
    ),
    backHref: "/",
  },
};
