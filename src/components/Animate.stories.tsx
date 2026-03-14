import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Animate, Fade, Slide, Scale, ScaleFade, Collapse, Pop } from "./Animate";
import { AnimationProvider } from "../animation";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";

/* ─── Animate ──────────────────────────────── */

const meta: Meta<typeof Animate> = {
  title: "Animation/Animate",
  component: Animate,
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
        "slideUp",
        "slideDown",
        "slideLeft",
        "slideRight",
        "scale",
        "scaleUp",
        "collapse",
        "pop",
      ],
    },
    duration: { control: "number" },
    delay: { control: "number" },
    show: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof Animate>;

const SampleCard = () => (
  <Card className="max-w-sm p-6">
    <p className="text-sm text-fg-200">
      This card is wrapped in an animation component.
    </p>
  </Card>
);

export const Default: Story = {
  args: {
    preset: "fadeUp",
  },
  render: function DefaultStory(args) {
    const [key, setKey] = React.useState(0);
    return (
      <div className="p-8 flex flex-col items-start gap-4">
        <Button variant="secondary" size="sm" onClick={() => setKey((k) => k + 1)}>
          Replay Animation
        </Button>
        <Animate key={key} {...args}>
          <SampleCard />
        </Animate>
      </div>
    );
  },
};

export const AllPresets: Story = {
  render: function AllPresetsStory() {
    const [key, setKey] = React.useState(0);
    const presetNames = [
      "fade",
      "fadeUp",
      "fadeDown",
      "fadeLeft",
      "fadeRight",
      "slideUp",
      "slideDown",
      "slideLeft",
      "slideRight",
      "scale",
      "scaleUp",
      "pop",
    ] as const;

    return (
      <div className="p-8 flex flex-col gap-6">
        <Button variant="secondary" size="sm" onClick={() => setKey((k) => k + 1)}>
          Replay All
        </Button>
        <div className="grid grid-cols-3 gap-6">
          {presetNames.map((name, i) => (
            <Animate key={`${name}-${key}`} preset={name} delay={i * 0.05}>
              <Card className="p-4 text-center">
                <Badge variant="default">{name}</Badge>
              </Card>
            </Animate>
          ))}
        </div>
      </div>
    );
  },
};

export const EnterExit: Story = {
  render: function EnterExitStory() {
    const [visible, setVisible] = React.useState(true);
    return (
      <div className="flex flex-col items-start gap-4 p-8">
        <Button onClick={() => setVisible((v) => !v)}>
          {visible ? "Hide" : "Show"}
        </Button>
        <ScaleFade show={visible}>
          <SampleCard />
        </ScaleFade>
      </div>
    );
  },
};

export const CustomAnimation: Story = {
  render: function CustomAnimStory() {
    const [key, setKey] = React.useState(0);
    return (
      <div className="p-8 flex flex-col items-start gap-4">
        <Button variant="secondary" size="sm" onClick={() => setKey((k) => k + 1)}>
          Replay
        </Button>
        <Animate
          key={key}
          initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          duration={0.5}
          easing="bounce"
        >
          <Badge variant="default">Custom animation</Badge>
        </Animate>
      </div>
    );
  },
};

export const ViewportTriggered: Story = {
  render: () => (
    <div className="space-y-96 p-8">
      <p className="text-fg-300">Scroll down to see the animation trigger...</p>
      <Animate preset="fadeUp" viewport={{ once: true }}>
        <SampleCard />
      </Animate>
    </div>
  ),
};

/* ─── Fade ─────────────────────────────────── */

export const FadeExample: Story = {
  name: "Fade",
  render: function FadeStory() {
    const [show, setShow] = React.useState(true);
    return (
      <div className="flex flex-col items-start gap-4 p-8">
        <Button onClick={() => setShow((s) => !s)}>Toggle</Button>
        <Fade show={show}>
          <SampleCard />
        </Fade>
      </div>
    );
  },
};

/* ─── Slide ────────────────────────────────── */

export const SlideExample: Story = {
  name: "Slide",
  render: function SlideStory() {
    const [show, setShow] = React.useState(true);
    const [dir, setDir] = React.useState<"up" | "down" | "left" | "right">("up");
    return (
      <div className="flex flex-col items-start gap-4 p-8">
        <div className="flex gap-2">
          {(["up", "down", "left", "right"] as const).map((d) => (
            <Button
              key={d}
              variant={dir === d ? "primary" : "secondary"}
              size="sm"
              onClick={() => setDir(d)}
            >
              {d}
            </Button>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setShow((s) => !s)}>
            Toggle
          </Button>
        </div>
        <Slide direction={dir} show={show}>
          <SampleCard />
        </Slide>
      </div>
    );
  },
};

/* ─── Scale ────────────────────────────────── */

export const ScaleExample: Story = {
  name: "Scale",
  render: function ScaleStory() {
    const [show, setShow] = React.useState(true);
    return (
      <div className="flex flex-col items-start gap-4 p-8">
        <Button onClick={() => setShow((s) => !s)}>Toggle</Button>
        <Scale show={show}>
          <SampleCard />
        </Scale>
      </div>
    );
  },
};

/* ─── Collapse ─────────────────────────────── */

export const CollapseExample: Story = {
  name: "Collapse",
  render: function CollapseStory() {
    const [open, setOpen] = React.useState(true);
    return (
      <div className="flex flex-col items-start gap-4 p-8">
        <Button onClick={() => setOpen((o) => !o)}>
          {open ? "Collapse" : "Expand"}
        </Button>
        <Collapse show={open}>
          <Card className="max-w-sm p-6">
            <p className="text-sm text-fg-200">
              This content collapses with a height animation. The height
              transitions from 0 to auto seamlessly.
            </p>
          </Card>
        </Collapse>
      </div>
    );
  },
};

/* ─── Pop ──────────────────────────────────── */

export const PopExample: Story = {
  name: "Pop",
  render: function PopStory() {
    const [show, setShow] = React.useState(true);
    return (
      <div className="flex flex-col items-start gap-4 p-8">
        <Button onClick={() => setShow((s) => !s)}>Toggle</Button>
        <Pop show={show}>
          <SampleCard />
        </Pop>
      </div>
    );
  },
};

/* ─── Globally disabled ────────────────────── */

export const GloballyDisabled: Story = {
  render: () => (
    <AnimationProvider config={{ enabled: false }}>
      <div className="flex flex-col gap-4 p-8">
        <p className="text-fg-300 text-sm">
          Animations are disabled via AnimationProvider — content appears instantly.
        </p>
        <Animate preset="fadeUp">
          <SampleCard />
        </Animate>
      </div>
    </AnimationProvider>
  ),
};
