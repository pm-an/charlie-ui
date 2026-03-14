import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { StaggerGroup } from "./StaggerGroup";
import { AnimationProvider } from "../animation";
import { Card } from "./Card";
import { FeatureCard } from "./FeatureCard";
import { Badge } from "./Badge";
import { Button } from "./Button";

const meta: Meta<typeof StaggerGroup> = {
  title: "Animation/StaggerGroup",
  component: StaggerGroup,
  tags: ["autodocs"],
  argTypes: {
    preset: {
      control: "select",
      options: [
        "fade",
        "fadeUp",
        "fadeDown",
        "fadeLeft",
        "fadeRight",
        "scale",
        "scaleUp",
        "pop",
      ],
    },
    stagger: { control: "number" },
  },
};
export default meta;
type Story = StoryObj<typeof StaggerGroup>;

export const Default: Story = {
  args: {
    preset: "fadeUp",
    stagger: 0.1,
  },
  render: (args) => (
    <div className="p-8">
      <StaggerGroup {...args} className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <Badge>First</Badge>
          <p className="mt-2 text-sm text-fg-200">Appears first</p>
        </Card>
        <Card className="p-4">
          <Badge>Second</Badge>
          <p className="mt-2 text-sm text-fg-200">Staggered delay</p>
        </Card>
        <Card className="p-4">
          <Badge>Third</Badge>
          <p className="mt-2 text-sm text-fg-200">Appears last</p>
        </Card>
      </StaggerGroup>
    </div>
  ),
};

export const FeatureCards: Story = {
  render: () => (
    <div className="p-8">
      <StaggerGroup preset="fadeUp" stagger={0.12} className="grid grid-cols-3 gap-6">
        <FeatureCard title="Speed" description="Optimized for performance at every level." />
        <FeatureCard title="Scale" description="Grows seamlessly with your infrastructure." />
        <FeatureCard title="Safety" description="Enterprise-grade security built in." />
      </StaggerGroup>
    </div>
  ),
};

export const EnterExit: Story = {
  render: function EnterExitStory() {
    const [visible, setVisible] = React.useState(true);
    return (
      <div className="flex flex-col items-start gap-4 p-8">
        <Button onClick={() => setVisible((v) => !v)}>
          {visible ? "Hide" : "Show"}
        </Button>
        <StaggerGroup
          preset="scale"
          stagger={0.08}
          show={visible}
          className="flex gap-3"
        >
          <Badge variant="accent">Alpha</Badge>
          <Badge variant="default">Beta</Badge>
          <Badge variant="accent">Gamma</Badge>
          <Badge variant="default">Delta</Badge>
        </StaggerGroup>
      </div>
    );
  },
};

export const ViewportTriggered: Story = {
  render: () => (
    <div className="space-y-96 p-8">
      <p className="text-fg-300">Scroll down to see staggered cards appear...</p>
      <StaggerGroup
        preset="fadeUp"
        stagger={0.15}
        viewport={{ once: true }}
        className="grid grid-cols-3 gap-6"
      >
        <Card className="p-6">Card 1</Card>
        <Card className="p-6">Card 2</Card>
        <Card className="p-6">Card 3</Card>
      </StaggerGroup>
    </div>
  ),
};

export const PopPreset: Story = {
  render: () => (
    <div className="p-8">
      <StaggerGroup preset="pop" stagger={0.08} className="flex gap-3">
        <Badge variant="accent">React</Badge>
        <Badge variant="default">TypeScript</Badge>
        <Badge variant="accent">Tailwind</Badge>
        <Badge variant="default">Framer Motion</Badge>
      </StaggerGroup>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <AnimationProvider config={{ enabled: false }}>
      <div className="flex flex-col gap-4 p-8">
        <p className="text-fg-300 text-sm">
          Animations are disabled — all children appear instantly.
        </p>
        <StaggerGroup preset="fadeUp" stagger={0.2} className="grid grid-cols-3 gap-4">
          <Card className="p-4">One</Card>
          <Card className="p-4">Two</Card>
          <Card className="p-4">Three</Card>
        </StaggerGroup>
      </div>
    </AnimationProvider>
  ),
};
