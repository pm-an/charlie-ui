import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, waitFor } from "storybook/test";
import {
  Globe,
  Palette,
  Zap,
  Shield,
  Rocket,
} from "lucide-react";
import { Select, type SelectOption } from "./Select";
import { Field } from "./Field";

const meta: Meta<typeof Select> = {
  title: "Forms/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    searchable: { control: "boolean" },
    required: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[350px] items-start justify-center pt-8">
        <div className="w-[320px]">
          <Story />
        </div>
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Select>;

const frameworkOptions: SelectOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "SolidJS" },
  { value: "qwik", label: "Qwik" },
];

const countryOptions: SelectOption[] = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "au", label: "Australia" },
  { value: "ca", label: "Canada" },
  { value: "br", label: "Brazil" },
];

const iconOptions: SelectOption[] = [
  { value: "global", label: "Global CDN", icon: <Globe className="h-4 w-4 text-white/60" /> },
  { value: "theme", label: "Custom Theme", icon: <Palette className="h-4 w-4 text-white/60" /> },
  { value: "perf", label: "Performance Mode", icon: <Zap className="h-4 w-4 text-white/60" /> },
  { value: "security", label: "Enhanced Security", icon: <Shield className="h-4 w-4 text-white/60" /> },
  { value: "deploy", label: "Auto Deploy", icon: <Rocket className="h-4 w-4 text-white/60" /> },
];

const descriptionOptions: SelectOption[] = [
  {
    value: "free",
    label: "Free",
    description: "For hobby projects and experiments",
  },
  {
    value: "pro",
    label: "Pro",
    description: "For professional developers and small teams",
  },
  {
    value: "team",
    label: "Team",
    description: "For growing teams with advanced needs",
  },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "Custom solutions for large organisations",
    disabled: true,
  },
];

export const Default: Story = {
  render: function SelectStory() {
    const [value, setValue] = React.useState("");
    return (
      <Select
        options={frameworkOptions}
        placeholder="Choose a framework"
        value={value}
        onChange={setValue}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("combobox");
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveTextContent("Choose a framework");
    await userEvent.click(trigger);
    await waitFor(() => {
      expect(canvas.getByRole("listbox")).toBeVisible();
    });
    await expect(canvas.getByText("React")).toBeVisible();
    await expect(canvas.getByText("Vue")).toBeVisible();
  },
};

export const WithLabel: Story = {
  render: function SelectStory() {
    const [value, setValue] = React.useState("");
    return (
      <Select
        label="Framework"
        helperText="Choose your preferred frontend framework"
        options={frameworkOptions}
        placeholder="Select framework"
        value={value}
        onChange={setValue}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Framework")).toBeVisible();
    await expect(
      canvas.getByText("Choose your preferred frontend framework")
    ).toBeVisible();
  },
};

export const Searchable: Story = {
  render: function SelectStory() {
    const [value, setValue] = React.useState("");
    return (
      <Select
        label="Country"
        options={countryOptions}
        placeholder="Search countries..."
        searchable
        searchPlaceholder="Type to filter..."
        value={value}
        onChange={setValue}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("combobox"));
    await waitFor(() => {
      expect(canvas.getByLabelText("Search options")).toBeVisible();
    });
    await userEvent.type(canvas.getByLabelText("Search options"), "united");
    await expect(canvas.getByText("United States")).toBeVisible();
    await expect(canvas.getByText("United Kingdom")).toBeVisible();
    await expect(canvas.queryByText("Germany")).not.toBeInTheDocument();
  },
};

export const WithIcons: Story = {
  render: function SelectStory() {
    const [value, setValue] = React.useState("");
    return (
      <Select
        label="Feature"
        options={iconOptions}
        placeholder="Select a feature"
        value={value}
        onChange={setValue}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("combobox"));
    await waitFor(() => {
      expect(canvas.getByText("Global CDN")).toBeVisible();
    });
    await expect(canvas.getByText("Custom Theme")).toBeVisible();
  },
};

export const WithDescriptions: Story = {
  render: function SelectStory() {
    const [value, setValue] = React.useState("");
    return (
      <Select
        label="Plan"
        options={descriptionOptions}
        placeholder="Choose your plan"
        value={value}
        onChange={setValue}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("combobox"));
    await waitFor(() => {
      expect(canvas.getByText("Free")).toBeVisible();
    });
    await expect(
      canvas.getByText("For hobby projects and experiments")
    ).toBeVisible();
  },
};

export const Disabled: Story = {
  args: {
    label: "Framework",
    options: frameworkOptions,
    placeholder: "Select framework",
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("combobox");
    await expect(trigger).toBeDisabled();
  },
};

export const Error: Story = {
  render: function SelectStory() {
    const [value, setValue] = React.useState("");
    return (
      <Select
        label="Framework"
        options={frameworkOptions}
        placeholder="Select framework"
        error
        errorMessage="Please select a framework"
        required
        value={value}
        onChange={setValue}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("Please select a framework")
    ).toBeVisible();
  },
};

export const Sizes: Story = {
  render: function SelectStory() {
    const [small, setSmall] = React.useState("");
    const [medium, setMedium] = React.useState("");
    const [large, setLarge] = React.useState("");
    return (
      <div className="flex flex-col gap-4">
        <Select
          label="Small"
          size="sm"
          options={frameworkOptions}
          placeholder="Small select"
          value={small}
          onChange={setSmall}
        />
        <Select
          label="Medium (default)"
          size="md"
          options={frameworkOptions}
          placeholder="Medium select"
          value={medium}
          onChange={setMedium}
        />
        <Select
          label="Large"
          size="lg"
          options={frameworkOptions}
          placeholder="Large select"
          value={large}
          onChange={setLarge}
        />
      </div>
    );
  },
};

export const Controlled: Story = {
  render: function SelectStory() {
    const [value, setValue] = React.useState("react");
    return (
      <div className="flex flex-col gap-4">
        <Select
          label="Controlled Select"
          options={frameworkOptions}
          value={value}
          onChange={setValue}
        />
        <p className="text-sm text-white/60">
          Selected: <span className="text-white font-medium">{value || "none"}</span>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="text-xs text-white/60 hover:text-white underline"
            onClick={() => setValue("vue")}
          >
            Set to Vue
          </button>
          <button
            type="button"
            className="text-xs text-white/60 hover:text-white underline"
            onClick={() => setValue("svelte")}
          >
            Set to Svelte
          </button>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("combobox");
    await expect(trigger).toHaveTextContent("React");
    await userEvent.click(canvas.getByText("Set to Vue"));
    await expect(trigger).toHaveTextContent("Vue");
  },
};

export const InsideField: Story = {
  render: function InsideFieldStory() {
    const [value, setValue] = React.useState("");
    return (
      <Field label="Framework" description="Pick your preferred frontend framework" required>
        <Select
          options={frameworkOptions}
          placeholder="Choose a framework"
          value={value}
          onChange={setValue}
        />
      </Field>
    );
  },
};

export const InsideFieldWithError: Story = {
  render: function InsideFieldWithErrorStory() {
    const [value, setValue] = React.useState("");
    return (
      <Field label="Framework" error errorMessage="This field is required.">
        <Select
          options={frameworkOptions}
          placeholder="Choose a framework"
          value={value}
          onChange={setValue}
        />
      </Field>
    );
  },
};
