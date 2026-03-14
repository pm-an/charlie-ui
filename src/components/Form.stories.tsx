import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "./Form";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Select } from "./Select";
import { Checkbox } from "./Checkbox";
import { Button } from "./Button";

const meta: Meta = {
  title: "Forms/Form",
  tags: ["autodocs"],
};
export default meta;

/* ─── Basic Form ───────────────────────────── */

const basicSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

type BasicFormData = z.infer<typeof basicSchema>;

export const BasicForm: StoryObj = {
  render: function BasicFormStory() {
    const form = useForm<BasicFormData>({
      resolver: zodResolver(basicSchema),
      defaultValues: { name: "", email: "" },
    });

    return (
      <Form
        form={form}
        onSubmit={(data) => alert(JSON.stringify(data, null, 2))}
        className="space-y-4 max-w-md"
      >
        <Form.Field control={form.control} name="name" label="Full name" required>
          {({ value, onChange, onBlur, ref }) => (
            <Input
              ref={ref}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              placeholder="Jane Smith"
            />
          )}
        </Form.Field>

        <Form.Field control={form.control} name="email" label="Email" required>
          {({ value, onChange, onBlur, ref }) => (
            <Input
              ref={ref}
              type="email"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              placeholder="jane@example.com"
            />
          )}
        </Form.Field>

        <Button type="submit" className="w-full">Submit</Button>
      </Form>
    );
  },
};

/* ─── Zod Validation ──────────────────────── */

const zodSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  bio: z.string().max(160, "Bio must be at most 160 characters").optional(),
  role: z.string().min(1, "Please select a role"),
});

type ZodFormData = z.infer<typeof zodSchema>;

export const ZodValidation: StoryObj = {
  render: function ZodValidationStory() {
    const form = useForm<ZodFormData>({
      resolver: zodResolver(zodSchema),
      defaultValues: { username: "", bio: "", role: "" },
    });

    return (
      <Form
        form={form}
        onSubmit={(data) => alert(JSON.stringify(data, null, 2))}
        className="space-y-4 max-w-md"
      >
        <Form.Field
          control={form.control}
          name="username"
          label="Username"
          required
          description="3-20 characters, letters and numbers only."
        >
          {({ value, onChange, onBlur, ref }) => (
            <Input
              ref={ref}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              placeholder="janesmith"
            />
          )}
        </Form.Field>

        <Form.Field control={form.control} name="bio" label="Bio" description="Optional short bio.">
          {({ value, onChange, onBlur, ref }) => (
            <Textarea
              ref={ref}
              value={value ?? ""}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              placeholder="Tell us about yourself..."
            />
          )}
        </Form.Field>

        <Form.Field control={form.control} name="role" label="Role" required>
          {({ value, onChange }) => (
            <Select
              value={value}
              onChange={onChange}
              options={[
                { value: "developer", label: "Developer" },
                { value: "designer", label: "Designer" },
                { value: "manager", label: "Manager" },
              ]}
              placeholder="Select a role..."
            />
          )}
        </Form.Field>

        <Button type="submit" className="w-full">Create Profile</Button>
      </Form>
    );
  },
};

/* ─── Mixed Controls ──────────────────────── */

const mixedSchema = z.object({
  email: z.string().email("Invalid email"),
  newsletter: z.boolean(),
  plan: z.string().min(1, "Select a plan"),
});

type MixedFormData = z.infer<typeof mixedSchema>;

export const MixedControls: StoryObj = {
  render: function MixedControlsStory() {
    const form = useForm<MixedFormData>({
      resolver: zodResolver(mixedSchema),
      defaultValues: { email: "", newsletter: false, plan: "" },
    });

    return (
      <Form
        form={form}
        onSubmit={(data) => alert(JSON.stringify(data, null, 2))}
        className="space-y-4 max-w-md"
      >
        <Form.Field control={form.control} name="email" label="Email" required>
          {({ value, onChange, onBlur, ref }) => (
            <Input
              ref={ref}
              type="email"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              placeholder="you@example.com"
            />
          )}
        </Form.Field>

        <Form.Field control={form.control} name="plan" label="Plan" required>
          {({ value, onChange }) => (
            <Select
              value={value}
              onChange={onChange}
              options={[
                { value: "free", label: "Free" },
                { value: "pro", label: "Pro — $9/mo" },
                { value: "team", label: "Team — $29/mo" },
              ]}
              placeholder="Choose a plan..."
            />
          )}
        </Form.Field>

        <Form.Field control={form.control} name="newsletter" label="Preferences">
          {({ value, onChange }) => (
            <Checkbox
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              label="Subscribe to newsletter"
            />
          )}
        </Form.Field>

        <Button type="submit" className="w-full">Subscribe</Button>
      </Form>
    );
  },
};
