import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea } from "./ScrollArea";

const meta: Meta<typeof ScrollArea> = {
  title: "Layout/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof ScrollArea>;

const listItems = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  label: [
    "Authentication service",
    "Payment gateway",
    "User management",
    "Notification system",
    "Analytics dashboard",
    "File storage",
    "Search engine",
    "Rate limiter",
    "Cache layer",
    "Message queue",
    "API gateway",
    "Load balancer",
    "DNS resolver",
    "SSL manager",
    "Backup service",
    "Monitoring agent",
    "Log aggregator",
    "Config server",
    "Feature flags",
    "A/B testing",
    "CDN manager",
    "Email service",
    "SMS gateway",
    "Push notifications",
    "Webhook handler",
    "Job scheduler",
    "Data pipeline",
    "ML inference",
    "Image processor",
    "Video transcoder",
  ][i],
}));

export const Default: Story = {
  args: {
    maxHeight: 300,
    className: "w-80 rounded-lg border border-white/10 bg-white/5",
    children: (
      <div className="p-2">
        {listItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors"
          >
            <span className="text-xs text-white/60 font-mono w-6 text-right">
              {item.id}
            </span>
            <span className="text-sm text-white/70">{item.label}</span>
          </div>
        ))}
      </div>
    ),
  },
};

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
    maxWidth: 400,
    className: "rounded-lg border border-white/10 bg-white/5",
    children: (
      <div className="flex gap-3 p-4" style={{ width: 1200 }}>
        {[
          "React",
          "TypeScript",
          "Tailwind",
          "Vite",
          "Storybook",
          "Vitest",
          "Node.js",
          "PostgreSQL",
          "Redis",
          "Docker",
        ].map((tech) => (
          <div
            key={tech}
            className="shrink-0 px-4 py-6 rounded-lg bg-white/5 border border-white/10 text-center min-w-[100px]"
          >
            <span className="text-sm text-white/70">{tech}</span>
          </div>
        ))}
      </div>
    ),
  },
};

export const Both: Story = {
  args: {
    orientation: "both",
    maxHeight: 250,
    maxWidth: 350,
    className: "rounded-lg border border-white/10 bg-white/5",
    children: (
      <div className="p-4" style={{ width: 800 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="whitespace-nowrap py-1.5">
            <span className="text-sm text-white/70">
              Row {i + 1} — This content extends horizontally to demonstrate
              both-axis scrolling behavior
            </span>
          </div>
        ))}
      </div>
    ),
  },
};

export const DefaultScrollbar: Story = {
  args: {
    scrollbarSize: "default",
    maxHeight: 300,
    className: "w-80 rounded-lg border border-white/10 bg-white/5",
    children: (
      <div className="p-2">
        {listItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors"
          >
            <span className="text-xs text-white/60 font-mono w-6 text-right">
              {item.id}
            </span>
            <span className="text-sm text-white/70">{item.label}</span>
          </div>
        ))}
      </div>
    ),
  },
};

export const HiddenScrollbar: Story = {
  args: {
    hideScrollbar: true,
    maxHeight: 300,
    className: "w-80 rounded-lg border border-white/10 bg-white/5",
    children: (
      <div className="p-2">
        {listItems.slice(0, 20).map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors"
          >
            <span className="text-xs text-white/60 font-mono w-6 text-right">
              {item.id}
            </span>
            <span className="text-sm text-white/70">{item.label}</span>
          </div>
        ))}
      </div>
    ),
  },
};

export const WithLabel: Story = {
  args: {
    label: "Service list",
    maxHeight: 300,
    className: "w-80 rounded-lg border border-white/10 bg-white/5",
    children: (
      <div className="p-2">
        {listItems.slice(0, 15).map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors"
          >
            <span className="text-xs text-white/60 font-mono w-6 text-right">
              {item.id}
            </span>
            <span className="text-sm text-white/70">{item.label}</span>
          </div>
        ))}
      </div>
    ),
  },
};

export const MaxHeight: Story = {
  args: {
    maxHeight: "200px",
    className: "w-80 rounded-lg border border-white/10 bg-white/5",
    children: (
      <div className="p-2">
        {listItems.slice(0, 15).map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors"
          >
            <span className="text-xs text-white/60 font-mono w-6 text-right">
              {item.id}
            </span>
            <span className="text-sm text-white/70">{item.label}</span>
          </div>
        ))}
      </div>
    ),
  },
};
