import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Accordion } from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Data Display/Accordion",
  component: Accordion,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: (args) => (
    <Accordion {...args}>
      <Accordion.Item value="q1" title="What is Charlie UI?">
        Charlie UI is a dark-first React component library with 110+ components.
        It provides a set of accessible, composable components built with
        Tailwind CSS and TypeScript.
      </Accordion.Item>
      <Accordion.Item value="q2" title="How do I install it?">
        Install via npm with <code>npm install @charlietogolden/charlie-ui</code>. Then
        import the global stylesheet and wrap your app with the ThemeProvider to
        get started.
      </Accordion.Item>
      <Accordion.Item value="q3" title="Can I customise the theme?">
        Yes. All design tokens use CSS custom properties prefixed with
        --charlie-*. You can override them globally or scope overrides to
        specific sections of your app using the ThemeProvider.
      </Accordion.Item>
      <Accordion.Item value="q4" title="Is it accessible?">
        Accessibility is a priority. Components include proper ARIA attributes,
        keyboard navigation, and focus management out of the box.
      </Accordion.Item>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // All items should be visible as triggers
    await expect(canvas.getByText("What is Charlie UI?")).toBeVisible();
    await expect(canvas.getByText("How do I install it?")).toBeVisible();
    // Content should be hidden initially
    expect(canvas.queryByText(/dark-themed React component library/)).toBeNull();
    // Click first item to open
    await userEvent.click(canvas.getByText("What is Charlie UI?"));
    await expect(canvas.getByText(/dark-themed React component library/)).toBeInTheDocument();
    // Click second item — in single mode, first should close
    await userEvent.click(canvas.getByText("How do I install it?"));
    await expect(canvas.getByText(/Install via npm/)).toBeInTheDocument();
  },
};

export const SingleMode: Story = {
  args: {
    mode: "single",
    defaultOpen: ["q1"],
  },
  render: (args) => (
    <Accordion {...args}>
      <Accordion.Item value="q1" title="What frameworks are supported?">
        Charlie UI is built for React 18 and 19. It works with any meta-framework
        that supports React, including Next.js, Remix, and Vite-based setups.
      </Accordion.Item>
      <Accordion.Item value="q2" title="Does it support server components?">
        Most components are client components since they manage state or use
        browser APIs. You can import them in server component files using the
        "use client" boundary pattern.
      </Accordion.Item>
      <Accordion.Item value="q3" title="How are styles handled?">
        Styles are built with Tailwind CSS v4 and class-variance-authority.
        The library ships a compiled CSS file you import once in your app.
      </Accordion.Item>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // First item should be open by default
    await expect(canvas.getByText(/built for React 18 and 19/)).toBeVisible();
  },
};

export const MultipleMode: Story = {
  args: {
    mode: "multiple",
    defaultOpen: ["q1", "q3"],
  },
  render: (args) => (
    <Accordion {...args}>
      <Accordion.Item value="q1" title="Can I open multiple items at once?">
        Yes! When the mode is set to &quot;multiple&quot;, any number of accordion
        items can be expanded simultaneously.
      </Accordion.Item>
      <Accordion.Item value="q2" title="How do animations work?">
        Accordion uses Framer Motion for smooth height transitions. The content
        area animates open and closed with configurable easing and duration.
      </Accordion.Item>
      <Accordion.Item value="q3" title="Can I set default open items?">
        Use the defaultOpen prop with an array of item value strings to control
        which items are expanded when the accordion first renders.
      </Accordion.Item>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Both q1 and q3 should be open
    await expect(canvas.getByText(/mode is set to/)).toBeVisible();
    await expect(canvas.getByText(/defaultOpen prop/)).toBeVisible();
    // Open q2 as well — multiple mode allows it
    await userEvent.click(canvas.getByText("How do animations work?"));
    await expect(canvas.getByText(/Framer Motion for smooth/)).toBeInTheDocument();
    // q1 and q3 should still be open
    await expect(canvas.getByText(/mode is set to/)).toBeInTheDocument();
    await expect(canvas.getByText(/defaultOpen prop/)).toBeInTheDocument();
  },
};

export const Controlled: Story = {
  render: function ControlledAccordion() {
    const [value, setValue] = React.useState<string[]>(["q1"]);
    return (
      <div>
        <div className="mb-4 flex gap-2">
          <button
            className="text-xs px-2 py-1 rounded border border-white/10 text-white/60"
            onClick={() => setValue(["q1"])}
          >
            Open Q1
          </button>
          <button
            className="text-xs px-2 py-1 rounded border border-white/10 text-white/60"
            onClick={() => setValue([])}
          >
            Close All
          </button>
        </div>
        <Accordion mode="single" value={value} onValueChange={setValue}>
          <Accordion.Item value="q1" title="First question">
            Answer to the first question.
          </Accordion.Item>
          <Accordion.Item value="q2" title="Second question">
            Answer to the second question.
          </Accordion.Item>
        </Accordion>
      </div>
    );
  },
};
