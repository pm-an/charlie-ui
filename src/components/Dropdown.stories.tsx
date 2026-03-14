import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { Dropdown } from "./Dropdown";
import { Button } from "./Button";
import {
  Settings,
  User,
  LogOut,
  CreditCard,
  Keyboard,
} from "lucide-react";

const meta: Meta<typeof Dropdown> = {
  title: "Overlays/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex min-h-[300px] items-start justify-center pt-8">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="secondary">Options</Button>
      </Dropdown.Trigger>
      <Dropdown.Menu>
        <Dropdown.Item>Profile</Dropdown.Item>
        <Dropdown.Item>Settings</Dropdown.Item>
        <Dropdown.Item>Billing</Dropdown.Item>
        <Dropdown.Item>Keyboard Shortcuts</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item destructive>Log Out</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Options" });
    await expect(trigger).toBeVisible();
    // Open dropdown
    await userEvent.click(trigger);
    // Verify menu items appear
    await waitFor(() => {
      expect(canvas.getByText("Profile")).toBeVisible();
    });
    await expect(canvas.getByText("Settings")).toBeVisible();
    await expect(canvas.getByText("Billing")).toBeVisible();
    await expect(canvas.getByText("Keyboard Shortcuts")).toBeVisible();
    await expect(canvas.getByText("Log Out")).toBeVisible();
  },
};

export const WithIcons: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="secondary">Account</Button>
      </Dropdown.Trigger>
      <Dropdown.Menu>
        <Dropdown.Item icon={User}>Profile</Dropdown.Item>
        <Dropdown.Item icon={Settings}>Settings</Dropdown.Item>
        <Dropdown.Item icon={CreditCard}>Billing</Dropdown.Item>
        <Dropdown.Item icon={Keyboard}>Shortcuts</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item icon={LogOut} destructive>
          Log Out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="secondary">Navigate</Button>
      </Dropdown.Trigger>
      <Dropdown.Menu>
        <Dropdown.Label>Account</Dropdown.Label>
        <Dropdown.Item icon={User}>Profile</Dropdown.Item>
        <Dropdown.Item icon={Settings}>Settings</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Label>Billing</Dropdown.Label>
        <Dropdown.Item icon={CreditCard}>Plans</Dropdown.Item>
        <Dropdown.Item icon={CreditCard}>Invoices</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  ),
};

export const AlignEnd: Story = {
  render: () => (
    <div className="flex w-full justify-end">
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button variant="secondary">Align End</Button>
        </Dropdown.Trigger>
        <Dropdown.Menu align="end">
          <Dropdown.Item>Profile</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Billing</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="secondary">Actions</Button>
      </Dropdown.Trigger>
      <Dropdown.Menu>
        <Dropdown.Item>Edit</Dropdown.Item>
        <Dropdown.Item>Duplicate</Dropdown.Item>
        <Dropdown.Item disabled>Archive</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item destructive>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  ),
};
