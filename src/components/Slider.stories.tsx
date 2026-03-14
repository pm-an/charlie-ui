import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Slider } from "./Slider";
import { Field } from "./Field";

const meta: Meta<typeof Slider> = {
  title: "Forms/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "number", min: 0, max: 100 } },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    label: { control: "text" },
    showValue: { control: "boolean" },
    disabled: { control: "boolean" },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: function SliderDefault() {
    const [value, setValue] = React.useState(50);
    return <Slider value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole("slider");
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute("aria-valuenow", "50");
  },
};

export const WithLabel: Story = {
  render: function SliderWithLabel() {
    const [value, setValue] = React.useState(75);
    return (
      <Slider
        value={value}
        onChange={setValue}
        label="Volume"
        showValue
      />
    );
  },
};

export const WithMarks: Story = {
  render: function SliderWithMarks() {
    const [value, setValue] = React.useState(50);
    return (
      <Slider
        value={value}
        onChange={setValue}
        label="Temperature"
        showValue
        min={0}
        max={100}
        step={25}
        marks={[
          { value: 0, label: "0" },
          { value: 25, label: "25" },
          { value: 50, label: "50" },
          { value: 75, label: "75" },
          { value: 100, label: "100" },
        ]}
      />
    );
  },
};

export const CustomRange: Story = {
  render: function SliderCustomRange() {
    const [value, setValue] = React.useState(2023);
    return (
      <Slider
        value={value}
        onChange={setValue}
        label="Year"
        showValue
        min={2000}
        max={2030}
        step={1}
      />
    );
  },
};

export const SmallStep: Story = {
  render: function SliderSmallStep() {
    const [value, setValue] = React.useState(0.5);
    return (
      <Slider
        value={value}
        onChange={setValue}
        label="Opacity"
        showValue
        min={0}
        max={1}
        step={0.1}
      />
    );
  },
};

export const Small: Story = {
  render: function SliderSmall() {
    const [value, setValue] = React.useState(30);
    return (
      <Slider
        value={value}
        onChange={setValue}
        size="sm"
        label="Brightness"
        showValue
      />
    );
  },
};

export const Large: Story = {
  render: function SliderLarge() {
    const [value, setValue] = React.useState(60);
    return (
      <Slider
        value={value}
        onChange={setValue}
        size="lg"
        label="Bass"
        showValue
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    value: 40,
    disabled: true,
    label: "Locked setting",
    showValue: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole("slider");
    await expect(slider).toHaveAttribute("aria-disabled", "true");
  },
};

export const AllSizes: Story = {
  render: function SliderAllSizes() {
    const [sm, setSm] = React.useState(25);
    const [md, setMd] = React.useState(50);
    const [lg, setLg] = React.useState(75);
    return (
      <div className="flex flex-col gap-6 w-80">
        <Slider value={sm} onChange={setSm} size="sm" label="Small" showValue />
        <Slider value={md} onChange={setMd} size="md" label="Medium" showValue />
        <Slider value={lg} onChange={setLg} size="lg" label="Large" showValue />
      </div>
    );
  },
};

export const InsideField: Story = {
  render: function InsideFieldStory() {
    const [value, setValue] = React.useState(50);
    return (
      <Field label="Volume" description="Adjust the playback volume" required>
        <Slider value={value} onChange={setValue} showValue />
      </Field>
    );
  },
};

export const InsideFieldWithError: Story = {
  render: function InsideFieldWithErrorStory() {
    const [value, setValue] = React.useState(0);
    return (
      <Field label="Volume" error errorMessage="This field is required.">
        <Slider value={value} onChange={setValue} showValue />
      </Field>
    );
  },
};
