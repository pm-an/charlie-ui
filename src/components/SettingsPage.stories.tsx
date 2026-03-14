import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SettingsPage } from "./SettingsPage";
import { User, Bell, CreditCard, Shield } from "lucide-react";

const meta: Meta<typeof SettingsPage> = {
  title: "Blocks/Application/SettingsPage",
  component: SettingsPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof SettingsPage>;

const sections = [
  { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
  { id: "billing", label: "Billing", icon: <CreditCard className="h-4 w-4" /> },
  { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
];

const FormRow = ({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-8 py-4 border-b border-white/[0.06] last:border-b-0">
    <div className="md:w-48 shrink-0">
      <label className="text-sm font-medium text-white">{label}</label>
      {description && (
        <p className="text-xs text-white/60 mt-0.5">{description}</p>
      )}
    </div>
    <div className="flex-1">{children}</div>
  </div>
);

const TextInput = ({
  defaultValue,
  placeholder,
}: {
  defaultValue?: string;
  placeholder?: string;
}) => (
  <input
    type="text"
    defaultValue={defaultValue}
    placeholder={placeholder}
    className="w-full max-w-sm bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-1 focus:ring-white/20"
  />
);

const ToggleRow = ({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) => (
  <div className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-b-0">
    <div>
      <p className="text-sm text-white">{label}</p>
      <p className="text-xs text-white/60">{description}</p>
    </div>
    <button
      type="button"
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        defaultChecked ? "bg-green" : "bg-white/10"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
          defaultChecked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  </div>
);

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState("profile");
    return (
      <SettingsPage
        title="Settings"
        description="Manage your account preferences and configuration."
        sections={sections}
        activeSection={active}
        onSectionChange={setActive}
      >
        <SettingsPage.Section
          id="profile"
          title="Profile"
          description="Your public profile information."
        >
          <div className="space-y-0">
            <FormRow label="Display name" description="Visible to other users">
              <TextInput defaultValue="Jane Doe" />
            </FormRow>
            <FormRow label="Email" description="Primary contact email">
              <TextInput defaultValue="jane@acme.co" />
            </FormRow>
            <FormRow label="Bio" description="Brief description for your profile">
              <textarea
                defaultValue="Product designer based in San Francisco."
                className="w-full max-w-sm bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none h-20"
              />
            </FormRow>
          </div>
        </SettingsPage.Section>

        <SettingsPage.Section
          id="notifications"
          title="Notifications"
          description="Choose what notifications you receive."
        >
          <div className="space-y-0">
            <ToggleRow
              label="Email notifications"
              description="Receive updates via email"
              defaultChecked
            />
            <ToggleRow
              label="Push notifications"
              description="Receive push notifications in your browser"
              defaultChecked
            />
            <ToggleRow
              label="Marketing emails"
              description="Occasional product updates and announcements"
            />
          </div>
        </SettingsPage.Section>

        <SettingsPage.Section
          id="billing"
          title="Billing"
          description="Manage your subscription and payment methods."
        >
          <div className="bg-white/[0.02] rounded-lg border border-white/[0.06] p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Pro Plan</p>
              <p className="text-xs text-white/60">$29/month, renews March 15</p>
            </div>
            <button
              type="button"
              className="text-xs text-white/60 hover:text-white border border-white/10 px-3 py-1.5 rounded-md transition-colors"
            >
              Manage
            </button>
          </div>
        </SettingsPage.Section>

        <SettingsPage.Section
          id="security"
          title="Security"
          description="Protect your account with additional security."
        >
          <div className="space-y-0">
            <FormRow label="Password" description="Last changed 30 days ago">
              <button
                type="button"
                className="text-sm text-white/60 hover:text-white border border-white/10 px-3 py-1.5 rounded-md transition-colors"
              >
                Change password
              </button>
            </FormRow>
            <FormRow
              label="Two-factor authentication"
              description="Add an extra layer of security"
            >
              <button
                type="button"
                className="text-sm text-green border border-green/20 bg-green/5 px-3 py-1.5 rounded-md transition-colors hover:bg-green/10"
              >
                Enable 2FA
              </button>
            </FormRow>
          </div>
        </SettingsPage.Section>
      </SettingsPage>
    );
  },
};
