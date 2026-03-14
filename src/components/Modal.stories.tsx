import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Modal } from "./Modal";
import { Button } from "./Button";

const meta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, iframeHeight: 500 } },
  },
};
export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    title: "Confirm action",
    description: "Are you sure you want to proceed? This action cannot be undone.",
    size: "md",
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
        <Modal {...args} open={open} onOpenChange={setOpen}>
          <Modal.Body>
            <p className="text-sm text-white/60">
              You are about to delete your project and all associated data.
              This will remove all files, settings, and collaborator access
              permanently.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Delete project
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Modal should be open with title visible
    await expect(canvas.getByRole("dialog")).toBeInTheDocument();
    await expect(canvas.getByText("Confirm action")).toBeInTheDocument();
    // Close via Escape
    await userEvent.keyboard("{Escape}");
    // Open button should still be visible
    await expect(
      canvas.getByRole("button", { name: /Open Modal/ })
    ).toBeVisible();
    // Reopen
    await userEvent.click(
      canvas.getByRole("button", { name: /Open Modal/ })
    );
    await expect(canvas.getByRole("dialog")).toBeInTheDocument();
  },
};

export const Small: Story = {
  args: {
    title: "Rename file",
    size: "sm",
  },
  render: function ModalStory(args) {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <div className="p-6">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open Small Modal
          </Button>
        </div>
        <Modal {...args} open={open} onOpenChange={setOpen}>
          <Modal.Body>
            <label className="block text-sm text-white/60 mb-2">
              File name
            </label>
            <input
              type="text"
              defaultValue="README.md"
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/20"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Rename
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

export const Large: Story = {
  args: {
    title: "Project settings",
    description: "Configure your project preferences and integrations.",
    size: "lg",
  },
  render: function ModalStory(args) {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <div className="p-6">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open Large Modal
          </Button>
        </div>
        <Modal {...args} open={open} onOpenChange={setOpen}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-white mb-1">
                  Project name
                </h4>
                <input
                  type="text"
                  defaultValue="charlie-ui"
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/20"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white mb-1">
                  Description
                </h4>
                <textarea
                  rows={3}
                  defaultValue="A modern React component library built with Tailwind CSS."
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/20 resize-none"
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Save changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

export const ExtraLarge: Story = {
  args: {
    title: "Team members",
    description: "Manage who has access to this workspace.",
    size: "xl",
  },
  render: function ModalStory(args) {
    const [open, setOpen] = React.useState(true);
    const members = [
      { name: "Alice Chen", role: "Admin", email: "alice@acme.com" },
      { name: "Bob Martinez", role: "Editor", email: "bob@acme.com" },
      { name: "Carol Wright", role: "Viewer", email: "carol@acme.com" },
    ];
    return (
      <>
        <div className="p-6">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open XL Modal
          </Button>
        </div>
        <Modal {...args} open={open} onOpenChange={setOpen}>
          <Modal.Body>
            <div className="divide-y divide-white/[0.06]">
              {members.map((m) => (
                <div
                  key={m.email}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{m.name}</p>
                    <p className="text-xs text-white/60">{m.email}</p>
                  </div>
                  <span className="rounded-md border border-white/10 px-2 py-0.5 text-xs text-white/60">
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Invite member
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

export const WithoutHeader: Story = {
  args: {
    showClose: false,
  },
  render: function ModalStory(args) {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <div className="p-6">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open Headerless Modal
          </Button>
        </div>
        <Modal {...args} open={open} onOpenChange={setOpen}>
          <Modal.Body>
            <div className="text-center py-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Welcome aboard!
              </h3>
              <p className="text-sm text-white/60 max-w-sm mx-auto">
                Your workspace is ready. Start by creating your first project
                or inviting your team.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Get started
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

export const LongContent: Story = {
  args: {
    title: "Terms of service",
    description: "Please review the following terms before continuing.",
    size: "lg",
  },
  render: function ModalStory(args) {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <div className="p-6">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open Scrollable Modal
          </Button>
        </div>
        <Modal {...args} open={open} onOpenChange={setOpen}>
          <Modal.Body>
            <div className="space-y-4 text-sm text-white/60">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i}>
                  <h4 className="font-medium text-white mb-1">
                    Section {i + 1}: General provisions
                  </h4>
                  <p>
                    By accessing and using this service, you acknowledge that
                    you have read, understood, and agree to be bound by these
                    terms. These terms apply to all visitors, users, and others
                    who access the service. We reserve the right to modify or
                    replace these terms at any time. Continued use of the
                    service constitutes acceptance of any changes.
                  </p>
                </div>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Decline
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Accept
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

export const Fullscreen: Story = {
  args: {
    title: "Settings",
    description: "Manage your account preferences",
    fullscreen: true,
  },
  render: function ModalStory(args) {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <div className="p-6">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open Fullscreen Modal
          </Button>
        </div>
        <Modal {...args} open={open} onOpenChange={setOpen}>
          <Modal.Body>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};
