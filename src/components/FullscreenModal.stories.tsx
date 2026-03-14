import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { FullscreenModal } from "./FullscreenModal";
import { Button } from "./Button";

/**
 * FullscreenModal is a backward-compatible wrapper around `<Modal fullscreen>`.
 * Prefer using `<Modal fullscreen>` directly for new code.
 */
const meta: Meta<typeof FullscreenModal> = {
  title: "Overlays/FullscreenModal",
  component: FullscreenModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, iframeHeight: 600 } },
  },
};
export default meta;
type Story = StoryObj<typeof FullscreenModal>;

export const Default: Story = {
  args: {
    open: true,
    title: "Settings",
    description: "Manage your account preferences",
  },
  render: function ModalStory(args) {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <div className="p-6">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open Modal
          </Button>
        </div>
        <FullscreenModal {...args} open={open} onOpenChange={setOpen}>
          <FullscreenModal.Body>
            <div className="space-y-8">
              <section>
                <h3 className="mb-3 text-base font-semibold text-white">
                  Profile
                </h3>
                <p className="text-sm leading-relaxed text-white/60">
                  Update your personal information, avatar, and display name.
                  Changes will be reflected across your entire account.
                </p>
              </section>
              <section>
                <h3 className="mb-3 text-base font-semibold text-white">
                  Notifications
                </h3>
                <p className="text-sm leading-relaxed text-white/60">
                  Control which notifications you receive via email, push, and
                  in-app alerts. You can also configure notification schedules
                  and quiet hours.
                </p>
              </section>
              <section>
                <h3 className="mb-3 text-base font-semibold text-white">
                  Security
                </h3>
                <p className="text-sm leading-relaxed text-white/60">
                  Manage two-factor authentication, active sessions, and API
                  keys. Review your login history and connected devices.
                </p>
              </section>
            </div>
          </FullscreenModal.Body>
          <FullscreenModal.Footer>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Save Changes
            </Button>
          </FullscreenModal.Footer>
        </FullscreenModal>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Settings")).toBeInTheDocument();
    await expect(
      canvas.getByText("Manage your account preferences")
    ).toBeInTheDocument();
  },
};

export const WithoutHeader: Story = {
  args: {
    open: true,
    showClose: false,
  },
  render: function ModalStory(args) {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <div className="p-6">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open Modal
          </Button>
        </div>
        <FullscreenModal {...args} open={open} onOpenChange={setOpen}>
          <FullscreenModal.Body>
            <div className="flex items-center justify-center py-24">
              <p className="text-lg text-white/60">
                Full-screen content without a header bar.
              </p>
            </div>
          </FullscreenModal.Body>
        </FullscreenModal>
      </>
    );
  },
};

export const LongContent: Story = {
  args: {
    open: true,
    title: "Terms of Service",
    description: "Please review our terms before continuing",
  },
  render: function ModalStory(args) {
    const [open, setOpen] = React.useState(true);
    const sections = Array.from({ length: 12 }, (_, i) => ({
      heading: `Section ${i + 1}: ${
        [
          "General Provisions",
          "User Accounts",
          "Privacy Policy",
          "Intellectual Property",
          "Content Guidelines",
          "Payment Terms",
          "Liability Limitations",
          "Dispute Resolution",
          "Data Processing",
          "Service Availability",
          "Termination",
          "Miscellaneous",
        ][i]
      }`,
      body: "This section outlines the terms and conditions that govern your use of the platform. By accessing or using our services, you agree to be bound by these terms. We reserve the right to update these terms at any time, and continued use constitutes acceptance of the revised terms. Please review this section carefully and contact support if you have any questions.",
    }));

    return (
      <>
        <div className="p-6">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open Modal
          </Button>
        </div>
        <FullscreenModal {...args} open={open} onOpenChange={setOpen}>
          <FullscreenModal.Body>
            <div className="space-y-8">
              {sections.map((s) => (
                <section key={s.heading}>
                  <h3 className="mb-3 text-base font-semibold text-white">
                    {s.heading}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/60">
                    {s.body}
                  </p>
                </section>
              ))}
            </div>
          </FullscreenModal.Body>
          <FullscreenModal.Footer>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Decline
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Accept Terms
            </Button>
          </FullscreenModal.Footer>
        </FullscreenModal>
      </>
    );
  },
};
