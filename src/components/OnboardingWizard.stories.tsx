import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { OnboardingWizard } from "./OnboardingWizard";
import { User, Bell, Palette, Rocket } from "lucide-react";

const meta: Meta<typeof OnboardingWizard> = {
  title: "Blocks/Application/OnboardingWizard",
  component: OnboardingWizard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof OnboardingWizard>;

const TextInput = ({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-white">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-1 focus:ring-white/20"
    />
  </div>
);

const defaultSteps = [
  {
    id: "profile",
    title: "Set up your profile",
    description: "Tell us a bit about yourself so we can personalize your experience.",
    content: (
      <div className="space-y-4">
        <TextInput label="Full name" placeholder="Jane Doe" />
        <TextInput label="Email" placeholder="jane@example.com" type="email" />
        <TextInput label="Company" placeholder="Acme Inc." />
      </div>
    ),
  },
  {
    id: "preferences",
    title: "Choose your preferences",
    description: "Select the options that best fit your workflow.",
    content: (
      <div className="space-y-3">
        {[
          { label: "Dark mode", description: "Use dark theme by default", checked: true },
          { label: "Email digest", description: "Weekly summary of activity", checked: false },
          { label: "Desktop notifications", description: "Get notified in real-time", checked: true },
        ].map((pref) => (
          <label
            key={pref.label}
            className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] hover:bg-white/[0.02] cursor-pointer"
          >
            <div>
              <p className="text-sm font-medium text-white">{pref.label}</p>
              <p className="text-xs text-white/60">{pref.description}</p>
            </div>
            <input
              type="checkbox"
              defaultChecked={pref.checked}
              className="h-4 w-4 rounded border-white/10 bg-white/5"
            />
          </label>
        ))}
      </div>
    ),
  },
  {
    id: "complete",
    title: "You're all set!",
    description: "Your workspace is ready. Start building something great.",
    content: (
      <div className="flex flex-col items-center py-4">
        <div className="h-16 w-16 rounded-full bg-green/10 flex items-center justify-center mb-4">
          <Rocket className="h-8 w-8 text-green" />
        </div>
        <p className="text-sm text-white/60 text-center max-w-sm">
          We've set up your workspace with your preferences. You can always
          change these settings later in your account settings.
        </p>
      </div>
    ),
  },
];

export const Default: Story = {
  args: {
    steps: defaultSteps,
  },
};

export const WithIcons: Story = {
  args: {
    steps: [
      {
        id: "account",
        title: "Create your account",
        description: "Enter your details to get started.",
        icon: <User className="h-5 w-5" />,
        content: (
          <div className="space-y-4">
            <TextInput label="Email" placeholder="you@company.com" type="email" />
            <TextInput label="Password" placeholder="Create a password" type="password" />
          </div>
        ),
      },
      {
        id: "notifications",
        title: "Notification preferences",
        description: "Choose how you want to be notified.",
        icon: <Bell className="h-5 w-5" />,
        content: (
          <div className="space-y-3">
            {["Email", "Push", "SMS"].map((channel) => (
              <label
                key={channel}
                className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] cursor-pointer hover:bg-white/[0.02]"
              >
                <input
                  type="checkbox"
                  defaultChecked={channel === "Email"}
                  className="h-4 w-4 rounded border-white/10 bg-white/5"
                />
                <span className="text-sm text-white">{channel} notifications</span>
              </label>
            ))}
          </div>
        ),
      },
      {
        id: "theme",
        title: "Pick a theme",
        description: "Select the look that suits you.",
        icon: <Palette className="h-5 w-5" />,
        content: (
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "Dark", color: "bg-[#0a0a0b]", active: true },
              { name: "Midnight", color: "bg-[#0f172a]", active: false },
              { name: "Charcoal", color: "bg-[#1a1a2e]", active: false },
            ].map((theme) => (
              <button
                key={theme.name}
                type="button"
                className={`p-4 rounded-lg border text-center transition-colors ${
                  theme.active
                    ? "border-white/20 bg-white/5"
                    : "border-white/[0.06] hover:border-white/10"
                }`}
              >
                <div
                  className={`h-8 w-full rounded-md ${theme.color} border border-white/10 mb-2`}
                />
                <span className="text-xs text-white/60">{theme.name}</span>
              </button>
            ))}
          </div>
        ),
      },
    ],
  },
};

export const Controlled: Story = {
  render: () => {
    const [step, setStep] = useState(0);
    return (
      <div className="space-y-4">
        <OnboardingWizard
          steps={defaultSteps}
          activeStep={step}
          onStepChange={setStep}
          onComplete={() => alert("Onboarding complete!")}
        />
        <p className="text-center text-sm text-white/60">
          Current step: {step + 1} of {defaultSteps.length}
        </p>
      </div>
    );
  },
};
