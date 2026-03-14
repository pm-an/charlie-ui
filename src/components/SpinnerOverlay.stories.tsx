import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SpinnerOverlay } from "./SpinnerOverlay";
import { Button } from "./Button";
import { motion } from "framer-motion";

const meta: Meta<typeof SpinnerOverlay> = {
  title: "Feedback/SpinnerOverlay",
  component: SpinnerOverlay,
  tags: ["autodocs"],
  argTypes: {
    spinning: { control: "boolean" },
    delay: { control: "number" },
    fullscreen: { control: "boolean" },
    blur: { control: { type: "range", min: 0, max: 10, step: 1 } },
    description: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof SpinnerOverlay>;

const SampleTable = () => (
  <div className="rounded-lg border border-white/10 bg-bg-200 p-4 w-80">
    <h3 className="text-sm font-medium text-white/80 mb-3">Recent Orders</h3>
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-white/40 border-b border-white/10">
          <th className="pb-2">Order</th>
          <th className="pb-2">Status</th>
          <th className="pb-2 text-right">Amount</th>
        </tr>
      </thead>
      <tbody className="text-white/60">
        <tr className="border-b border-white/5">
          <td className="py-2">#1024</td>
          <td className="py-2">Shipped</td>
          <td className="py-2 text-right">$249.00</td>
        </tr>
        <tr className="border-b border-white/5">
          <td className="py-2">#1023</td>
          <td className="py-2">Processing</td>
          <td className="py-2 text-right">$89.50</td>
        </tr>
        <tr>
          <td className="py-2">#1022</td>
          <td className="py-2">Delivered</td>
          <td className="py-2 text-right">$432.00</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export const Default: Story = {
  render: () => (
    <SpinnerOverlay spinning>
      <SampleTable />
    </SpinnerOverlay>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <SpinnerOverlay spinning description="Loading your data...">
      <SampleTable />
    </SpinnerOverlay>
  ),
};

export const Fullscreen: Story = {
  render: function FullscreenStory() {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Show Fullscreen Spinner</Button>
        <SpinnerOverlay
          fullscreen
          spinning={open}
          description="Preparing your workspace..."
          blur={4}
        >
          <div />
        </SpinnerOverlay>
        {open && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60]">
            <Button onClick={() => setOpen(false)} variant="secondary">
              Dismiss
            </Button>
          </div>
        )}
      </div>
    );
  },
};

export const WithDelay: Story = {
  render: function DelayStory() {
    const [spinning, setSpinning] = useState(false);
    return (
      <div className="space-y-4">
        <Button onClick={() => setSpinning((s) => !s)}>
          {spinning ? "Stop" : "Start"} Loading (500ms delay)
        </Button>
        <SpinnerOverlay spinning={spinning} delay={500}>
          <SampleTable />
        </SpinnerOverlay>
      </div>
    );
  },
};

export const WithBlur: Story = {
  render: () => (
    <SpinnerOverlay spinning blur={4} description="Refreshing...">
      <SampleTable />
    </SpinnerOverlay>
  ),
};

export const CustomIndicator: Story = {
  render: () => (
    <SpinnerOverlay
      spinning
      indicator={
        <motion.div
          className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-accent text-lg font-bold">C</span>
        </motion.div>
      }
      description="Loading Charlie UI..."
    >
      <SampleTable />
    </SpinnerOverlay>
  ),
};

export const Dots: Story = {
  render: () => (
    <SpinnerOverlay
      spinning
      spinnerProps={{ type: "dots", size: "lg" }}
      description="Fetching records..."
    >
      <SampleTable />
    </SpinnerOverlay>
  ),
};

export const NotSpinning: Story = {
  render: () => (
    <SpinnerOverlay spinning={false}>
      <SampleTable />
    </SpinnerOverlay>
  ),
};
