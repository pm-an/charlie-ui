import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DashboardLayout } from "./DashboardLayout";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Bell,
  Search,
  Menu,
  ChevronLeft,
  Package,
} from "lucide-react";

const meta: Meta<typeof DashboardLayout> = {
  title: "Blocks/Application/DashboardLayout",
  component: DashboardLayout,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof DashboardLayout>;

const SidebarNav = () => (
  <nav className="flex flex-col gap-1 px-3">
    {[
      { icon: <LayoutDashboard className="h-4 w-4" />, label: "Dashboard", active: true },
      { icon: <Users className="h-4 w-4" />, label: "Customers" },
      { icon: <Package className="h-4 w-4" />, label: "Products" },
      { icon: <BarChart3 className="h-4 w-4" />, label: "Analytics" },
      { icon: <Settings className="h-4 w-4" />, label: "Settings" },
    ].map((item) => (
      <button
        key={item.label}
        type="button"
        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors w-full ${
          item.active
            ? "bg-white/5 text-white font-medium"
            : "text-white/60 hover:bg-white/5 hover:text-white"
        }`}
      >
        {item.icon}
        <span>{item.label}</span>
      </button>
    ))}
  </nav>
);

const HeaderContent = ({ onMenuClick }: { onMenuClick?: () => void }) => (
  <div className="flex items-center justify-between w-full">
    <div className="flex items-center gap-3">
      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden text-white/60 hover:text-white p-1"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
      <div className="flex items-center gap-2 text-white/60 text-sm">
        <Search className="h-4 w-4" />
        <span>Search...</span>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <button type="button" className="text-white/60 hover:text-white p-1 relative">
        <Bell className="h-5 w-5" />
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red rounded-full" />
      </button>
      <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white font-medium">
        JD
      </div>
    </div>
  </div>
);

export const Default: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(true);
    return (
      <DashboardLayout
        sidebarCollapsed={collapsed}
        onSidebarToggle={() => setCollapsed(!collapsed)}
      >
        <DashboardLayout.Sidebar
          logo={
            <span className="text-white font-bold text-lg">Acme</span>
          }
          footer={
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white font-medium">
                JD
              </div>
              <div className="min-w-0">
                <div className="text-sm text-white truncate">Jane Doe</div>
                <div className="text-xs text-white/60 truncate">jane@acme.co</div>
              </div>
            </div>
          }
        >
          <SidebarNav />
        </DashboardLayout.Sidebar>
        <div className="flex-1 flex flex-col">
          <DashboardLayout.Header>
            <HeaderContent onMenuClick={() => setCollapsed(!collapsed)} />
          </DashboardLayout.Header>
          <DashboardLayout.Content>
            <h1 className="text-xl font-bold text-white mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Revenue", "Customers", "Orders"].map((stat) => (
                <div
                  key={stat}
                  className="bg-card-gradient rounded-xl border border-white/[0.06] p-6"
                >
                  <p className="text-sm text-white/60">{stat}</p>
                  <p className="text-2xl font-bold text-white mt-1">$12,345</p>
                </div>
              ))}
            </div>
          </DashboardLayout.Content>
        </div>
      </DashboardLayout>
    );
  },
};

export const Collapsed: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(true);
    return (
      <DashboardLayout
        sidebarCollapsed={collapsed}
        onSidebarToggle={() => setCollapsed(!collapsed)}
      >
        <DashboardLayout.Sidebar
          logo={
            collapsed ? (
              <span className="text-white font-bold text-lg">A</span>
            ) : (
              <span className="text-white font-bold text-lg">Acme</span>
            )
          }
        >
          <nav className="flex flex-col gap-1 px-3">
            {[
              { icon: <LayoutDashboard className="h-4 w-4" />, label: "Dashboard", active: true },
              { icon: <Users className="h-4 w-4" />, label: "Customers" },
              { icon: <BarChart3 className="h-4 w-4" />, label: "Analytics" },
              { icon: <Settings className="h-4 w-4" />, label: "Settings" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 py-2 text-sm rounded-md transition-colors w-full ${
                  collapsed ? "justify-center px-0" : "px-3"
                } ${
                  item.active
                    ? "bg-white/5 text-white font-medium"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </DashboardLayout.Sidebar>
        <div className="flex-1 flex flex-col">
          <DashboardLayout.Header>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                className="text-white/60 hover:text-white p-1"
              >
                <ChevronLeft
                  className={`h-5 w-5 transition-transform ${collapsed ? "rotate-180" : ""}`}
                />
              </button>
              <span className="text-sm text-white/60">
                {collapsed ? "Expand" : "Collapse"} sidebar
              </span>
            </div>
          </DashboardLayout.Header>
          <DashboardLayout.Content>
            <p className="text-white/60 text-sm">
              Toggle the sidebar using the chevron icon in the header.
            </p>
          </DashboardLayout.Content>
        </div>
      </DashboardLayout>
    );
  },
};

export const WithContent: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(true);
    return (
      <DashboardLayout
        sidebarCollapsed={collapsed}
        onSidebarToggle={() => setCollapsed(!collapsed)}
      >
        <DashboardLayout.Sidebar
          logo={<span className="text-white font-bold text-lg">Acme</span>}
        >
          <SidebarNav />
        </DashboardLayout.Sidebar>
        <div className="flex-1 flex flex-col">
          <DashboardLayout.Header>
            <HeaderContent onMenuClick={() => setCollapsed(!collapsed)} />
          </DashboardLayout.Header>
          <DashboardLayout.Content>
            <h1 className="text-xl font-bold text-white mb-2">Analytics Overview</h1>
            <p className="text-sm text-white/60 mb-6">
              Track your key metrics and performance.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Revenue", value: "$48,250", change: "+12.5%" },
                { label: "Active Users", value: "2,345", change: "+8.1%" },
                { label: "New Orders", value: "186", change: "+23.4%" },
                { label: "Conversion Rate", value: "3.24%", change: "-1.2%" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card-gradient rounded-xl border border-white/[0.06] p-5"
                >
                  <p className="text-xs text-white/60 font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <span
                      className={`text-xs font-medium ${
                        stat.change.startsWith("+") ? "text-green" : "text-red"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-card-gradient rounded-xl border border-white/[0.06] p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { user: "Alice Chen", action: "created a new project", time: "2 min ago" },
                  { user: "Bob Smith", action: "deployed to production", time: "15 min ago" },
                  { user: "Carol Davis", action: "updated billing settings", time: "1 hour ago" },
                ].map((activity) => (
                  <div
                    key={activity.time}
                    className="flex items-center justify-between py-2 border-b border-white/[0.06] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white font-medium">
                        {activity.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <span className="text-sm text-white">{activity.user}</span>{" "}
                        <span className="text-sm text-white/60">{activity.action}</span>
                      </div>
                    </div>
                    <span className="text-xs text-white/60">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </DashboardLayout.Content>
        </div>
      </DashboardLayout>
    );
  },
};
