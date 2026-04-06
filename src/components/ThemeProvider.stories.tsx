import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ThemeProvider, useTheme, useColorMode } from "./ThemeProvider";
import type { ColorMode } from "./ThemeProvider";
import { Button } from "./Button";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Input } from "./Input";
import { indigoTheme, emeraldTheme } from "../themes/presets";

const meta: Meta<typeof ThemeProvider> = {
  title: "Primitives/ThemeProvider",
  component: ThemeProvider,
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "select",
      options: ["dark", "light", "system"] satisfies ColorMode[],
      description:
        'Color mode. "dark" (default) uses dark tokens, "light" uses light tokens, "system" follows OS preference.',
    },
    theme: {
      control: false,
      description:
        "Partial CharlieTheme overrides. Merged on top of the base theme for the selected mode.",
    },
  },
};
export default meta;
type Story = StoryObj<typeof ThemeProvider>;

/* ── Helper: renders a sample card to visualize theme tokens ── */
function SampleCard() {
  return (
    <Card className="max-w-sm">
      <Card.Header title="Theme Preview" description="See how tokens adapt to the current mode" />
      <Card.Body>
        <div className="space-y-3">
          <p className="text-sm text-default">
            Text uses <code className="text-xs bg-subtle px-1 py-0.5 rounded">text-default</code>{" "}
            — it automatically flips between light and dark.
          </p>
          <div className="flex gap-2">
            <Badge>Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="green">Green</Badge>
          </div>
          <Input placeholder="Type here..." />
          <div className="flex gap-2">
            <Button variant="primary" size="sm">
              Primary
            </Button>
            <Button variant="secondary" size="sm">
              Secondary
            </Button>
            <Button variant="ghost" size="sm">
              Ghost
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

/* ── Helper: shows the resolved color mode ── */
function ModeIndicator() {
  const mode = useColorMode();
  const theme = useTheme();
  return (
    <div className="flex items-center gap-2 text-xs text-muted mb-3">
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: theme.accent }} />
      Resolved mode: <strong className="text-loud" data-testid="resolved-mode">{mode}</strong>
    </div>
  );
}

export const Default: Story = {
  args: {
    mode: "dark",
  },
  render: (args) => (
    <ThemeProvider {...args}>
      <div className="bg-bg p-6 rounded-xl">
        <ModeIndicator />
        <SampleCard />
      </div>
    </ThemeProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("resolved-mode")).toHaveTextContent("dark");
    await expect(canvas.getByText("Theme Preview")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Primary" })).toBeVisible();
  },
};

export const LightMode: Story = {
  args: {
    mode: "light",
  },
  render: (args) => (
    <ThemeProvider {...args}>
      <div className="bg-bg p-6 rounded-xl">
        <ModeIndicator />
        <SampleCard />
      </div>
    </ThemeProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("resolved-mode")).toHaveTextContent("light");
    // Verify the wrapper has data-charlie-mode="light"
    const modeWrapper = canvasElement.querySelector("[data-charlie-mode='light']");
    await expect(modeWrapper).not.toBeNull();
  },
};

export const SystemMode: Story = {
  args: {
    mode: "system",
  },
  render: (args) => (
    <ThemeProvider {...args}>
      <div className="bg-bg p-6 rounded-xl">
        <ModeIndicator />
        <p className="text-xs text-muted mb-3">
          Follows your OS color scheme preference (prefers-color-scheme).
        </p>
        <SampleCard />
      </div>
    </ThemeProvider>
  ),
};

export const WithAccentOverride: Story = {
  args: {
    mode: "light",
    theme: indigoTheme,
  },
  render: (args) => (
    <ThemeProvider {...args}>
      <div className="bg-bg p-6 rounded-xl">
        <ModeIndicator />
        <p className="text-xs text-muted mb-3">
          Light mode + Indigo accent preset. The <code className="text-xs">theme</code> prop merges
          on top of the mode base tokens.
        </p>
        <SampleCard />
      </div>
    </ThemeProvider>
  ),
};

export const NestedProviders: Story = {
  render: () => (
    <div className="flex gap-4">
      <ThemeProvider mode="dark">
        <div className="bg-bg p-6 rounded-xl">
          <ModeIndicator />
          <SampleCard />
        </div>
      </ThemeProvider>
      <ThemeProvider mode="light">
        <div className="bg-bg p-6 rounded-xl">
          <ModeIndicator />
          <SampleCard />
        </div>
      </ThemeProvider>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const modes = canvasElement.querySelectorAll("[data-testid='resolved-mode']");
    await expect(modes).toHaveLength(2);
    await expect(modes[0]).toHaveTextContent("dark");
    await expect(modes[1]).toHaveTextContent("light");
  },
};

export const NestedAccents: Story = {
  render: () => (
    <ThemeProvider mode="light">
      <div className="bg-bg p-6 rounded-xl space-y-4">
        <ModeIndicator />
        <p className="text-sm text-default">
          Outer provider: light mode, default accent. Inner sections override just the accent.
        </p>
        <div className="flex gap-4">
          <ThemeProvider theme={indigoTheme}>
            <Card className="flex-1">
              <Card.Body>
                <div className="flex gap-2">
                  <Badge variant="accent">Indigo</Badge>
                  <Button variant="primary" size="sm">
                    Action
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </ThemeProvider>
          <ThemeProvider theme={emeraldTheme}>
            <Card className="flex-1">
              <Card.Body>
                <div className="flex gap-2">
                  <Badge variant="accent">Emerald</Badge>
                  <Button variant="primary" size="sm">
                    Action
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </ThemeProvider>
        </div>
      </div>
    </ThemeProvider>
  ),
};

export const SideBySideComparison: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      {(["dark", "light"] as const).map((mode) => (
        <ThemeProvider key={mode} mode={mode}>
          <div className="bg-bg p-6 rounded-xl border border-border">
            <h3 className="text-loud text-sm font-semibold mb-2 capitalize">{mode} Mode</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button variant="primary" size="sm">Primary</Button>
                <Button variant="neutral" size="sm">Neutral</Button>
                <Button variant="secondary" size="sm">Secondary</Button>
                <Button variant="ghost" size="sm">Ghost</Button>
              </div>
              <div className="flex gap-2">
                <Badge>Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="green">Green</Badge>
                <Badge variant="yellow">Yellow</Badge>
                <Badge variant="blue">Blue</Badge>
              </div>
              <Input placeholder="Input field..." />
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded-md bg-subtle border border-border" title="bg-subtle" />
                <div className="h-8 w-8 rounded-md bg-surface border border-border" title="surface" />
                <div className="h-8 w-8 rounded-md bg-surface-elevated border border-border" title="surface-elevated" />
                <div className="h-8 w-8 rounded-md bg-bg-200 border border-border" title="bg-200" />
              </div>
            </div>
          </div>
        </ThemeProvider>
      ))}
    </div>
  ),
};
