import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sidebar } from "./Sidebar";
import { Button } from "./Button";
import {
  Home,
  Settings,
  Users,
  FileText,
  BarChart3,
  Mail,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Layers,
  Inbox,
  Calendar,
} from "lucide-react";

const meta: Meta<typeof Sidebar> = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: function SidebarDefault() {
    return (
      <div className="h-screen bg-bg">
        <Sidebar>
          <Sidebar.Header>
            <span className="text-white font-bold text-lg tracking-tight">
              Charlie UI
            </span>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.Item icon={<Home className="h-5 w-5" />} label="Home" active />
              <Sidebar.Item icon={<BarChart3 className="h-5 w-5" />} label="Analytics" />
              <Sidebar.Item icon={<Users className="h-5 w-5" />} label="Customers" />
              <Sidebar.Item icon={<FileText className="h-5 w-5" />} label="Documents" />
              <Sidebar.Item icon={<Mail className="h-5 w-5" />} label="Messages" />
            </Sidebar.Group>
            <Sidebar.Separator />
            <Sidebar.Group label="Settings">
              <Sidebar.Item icon={<Settings className="h-5 w-5" />} label="General" />
              <Sidebar.Item icon={<Shield className="h-5 w-5" />} label="Security" />
              <Sidebar.Item icon={<CreditCard className="h-5 w-5" />} label="Billing" />
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>
            <Sidebar.Item icon={<HelpCircle className="h-5 w-5" />} label="Help & Support" />
          </Sidebar.Footer>
        </Sidebar>
        <div className="ml-[260px] p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-white/60">Main content area</p>
        </div>
      </div>
    );
  },
};

export const Collapsed: Story = {
  render: function SidebarCollapsed() {
    return (
      <div className="h-screen bg-bg">
        <Sidebar collapsed>
          <Sidebar.Header>
            <Layers className="h-6 w-6 text-accent" />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.Item icon={<Home className="h-5 w-5" />} label="Home" active />
              <Sidebar.Item icon={<BarChart3 className="h-5 w-5" />} label="Analytics" />
              <Sidebar.Item icon={<Users className="h-5 w-5" />} label="Customers" />
              <Sidebar.Item icon={<FileText className="h-5 w-5" />} label="Documents" />
              <Sidebar.Item icon={<Mail className="h-5 w-5" />} label="Messages" />
            </Sidebar.Group>
            <Sidebar.Separator />
            <Sidebar.Group>
              <Sidebar.Item icon={<Settings className="h-5 w-5" />} label="Settings" />
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>
            <Sidebar.Item icon={<HelpCircle className="h-5 w-5" />} label="Help" />
          </Sidebar.Footer>
        </Sidebar>
        <div className="ml-[68px] p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-white/60">Collapsed sidebar with icon-only navigation</p>
        </div>
      </div>
    );
  },
};

export const RightSide: Story = {
  render: function SidebarRight() {
    return (
      <div className="h-screen bg-bg">
        <Sidebar side="right">
          <Sidebar.Header>
            <span className="text-white font-bold text-lg tracking-tight">
              Panel
            </span>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group label="Navigation">
              <Sidebar.Item icon={<Home className="h-5 w-5" />} label="Overview" active />
              <Sidebar.Item icon={<Inbox className="h-5 w-5" />} label="Inbox" />
              <Sidebar.Item icon={<Calendar className="h-5 w-5" />} label="Calendar" />
              <Sidebar.Item icon={<Users className="h-5 w-5" />} label="Team" />
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>
            <Sidebar.Item icon={<LogOut className="h-5 w-5" />} label="Sign out" />
          </Sidebar.Footer>
        </Sidebar>
        <div className="mr-[260px] p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Right-side Sidebar</h1>
          <p className="text-white/60">Sidebar positioned on the right edge</p>
        </div>
      </div>
    );
  },
};

export const WithBadges: Story = {
  render: function SidebarBadges() {
    return (
      <div className="h-screen bg-bg">
        <Sidebar>
          <Sidebar.Header>
            <span className="text-white font-bold text-lg tracking-tight">
              Acme Inc
            </span>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.Item icon={<Home className="h-5 w-5" />} label="Dashboard" active />
              <Sidebar.Item icon={<Inbox className="h-5 w-5" />} label="Inbox" badge={12} />
              <Sidebar.Item icon={<Bell className="h-5 w-5" />} label="Notifications" badge={3} />
              <Sidebar.Item icon={<Mail className="h-5 w-5" />} label="Messages" badge="99+" />
              <Sidebar.Item icon={<Users className="h-5 w-5" />} label="Team" />
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>
            <Sidebar.Item icon={<Settings className="h-5 w-5" />} label="Settings" />
          </Sidebar.Footer>
        </Sidebar>
        <div className="ml-[260px] p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-white/60">Items with badge counts</p>
        </div>
      </div>
    );
  },
};

export const WithGroups: Story = {
  render: function SidebarGroups() {
    return (
      <div className="h-screen bg-bg">
        <Sidebar>
          <Sidebar.Header>
            <span className="text-white font-bold text-lg tracking-tight">
              Admin Panel
            </span>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group label="Overview">
              <Sidebar.Item icon={<Home className="h-5 w-5" />} label="Dashboard" active />
              <Sidebar.Item icon={<BarChart3 className="h-5 w-5" />} label="Analytics" />
            </Sidebar.Group>
            <Sidebar.Group label="Management">
              <Sidebar.Item icon={<Users className="h-5 w-5" />} label="Users" />
              <Sidebar.Item icon={<FileText className="h-5 w-5" />} label="Content" />
              <Sidebar.Item icon={<Mail className="h-5 w-5" />} label="Messages" badge={5} />
            </Sidebar.Group>
            <Sidebar.Group label="System">
              <Sidebar.Item icon={<Settings className="h-5 w-5" />} label="Settings" />
              <Sidebar.Item icon={<Shield className="h-5 w-5" />} label="Security" />
              <Sidebar.Item icon={<CreditCard className="h-5 w-5" />} label="Billing" />
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>
            <Sidebar.Item icon={<LogOut className="h-5 w-5" />} label="Sign out" />
          </Sidebar.Footer>
        </Sidebar>
        <div className="ml-[260px] p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Grouped Navigation</h1>
          <p className="text-white/60">Items organized by labeled groups</p>
        </div>
      </div>
    );
  },
};

export const Interactive: Story = {
  render: function SidebarInteractive() {
    const [collapsed, setCollapsed] = React.useState(false);
    const [activeItem, setActiveItem] = React.useState("home");

    return (
      <div className="h-screen bg-bg">
        <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed}>
          <Sidebar.Header>
            {collapsed ? (
              <Layers className="h-6 w-6 text-accent" />
            ) : (
              <span className="text-white font-bold text-lg tracking-tight">
                Charlie UI
              </span>
            )}
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group label="Main">
              <Sidebar.Item
                icon={<Home className="h-5 w-5" />}
                label="Home"
                active={activeItem === "home"}
                onClick={() => setActiveItem("home")}
              />
              <Sidebar.Item
                icon={<BarChart3 className="h-5 w-5" />}
                label="Analytics"
                active={activeItem === "analytics"}
                onClick={() => setActiveItem("analytics")}
              />
              <Sidebar.Item
                icon={<Users className="h-5 w-5" />}
                label="Customers"
                active={activeItem === "customers"}
                onClick={() => setActiveItem("customers")}
                badge={7}
              />
              <Sidebar.Item
                icon={<FileText className="h-5 w-5" />}
                label="Documents"
                active={activeItem === "documents"}
                onClick={() => setActiveItem("documents")}
              />
              <Sidebar.Item
                icon={<Mail className="h-5 w-5" />}
                label="Messages"
                active={activeItem === "messages"}
                onClick={() => setActiveItem("messages")}
                badge={3}
              />
            </Sidebar.Group>
            <Sidebar.Separator />
            <Sidebar.Group label="Account">
              <Sidebar.Item
                icon={<Settings className="h-5 w-5" />}
                label="Settings"
                active={activeItem === "settings"}
                onClick={() => setActiveItem("settings")}
              />
              <Sidebar.Item
                icon={<Shield className="h-5 w-5" />}
                label="Security"
                disabled
              />
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors w-full"
            >
              {collapsed ? (
                <PanelLeftOpen className="h-5 w-5 shrink-0" />
              ) : (
                <>
                  <PanelLeftClose className="h-5 w-5 shrink-0" />
                  <span>Collapse</span>
                </>
              )}
            </button>
          </Sidebar.Footer>
        </Sidebar>
        <div
          className="p-8 transition-all duration-200"
          style={{ marginLeft: collapsed ? 68 : 260 }}
        >
          <h1 className="text-2xl font-bold text-white mb-2">Interactive Sidebar</h1>
          <p className="text-white/60 mb-4">
            Click the collapse button in the footer to toggle between expanded and collapsed states.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? "Expand" : "Collapse"} Sidebar
            </Button>
          </div>
        </div>
      </div>
    );
  },
};
