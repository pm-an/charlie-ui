import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatCard } from "./StatCard";
import { DollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react";

const meta: Meta<typeof StatCard> = {
  title: "Cards/StatCard",
  component: StatCard,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: {
    label: "Total Revenue",
    value: "45,231",
    prefix: "$",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Total Revenue",
    value: "45,231",
    prefix: "$",
    icon: <DollarSign className="h-5 w-5" />,
  },
};

export const PositiveChange: Story = {
  args: {
    label: "Active Users",
    value: "2,350",
    change: 12.5,
    changeLabel: "vs last month",
    icon: <Users className="h-5 w-5" />,
  },
};

export const NegativeChange: Story = {
  args: {
    label: "Bounce Rate",
    value: "24.3",
    suffix: "%",
    change: -3.2,
    changeLabel: "vs last week",
  },
};

export const NeutralChange: Story = {
  args: {
    label: "Page Views",
    value: "8,192",
    change: 0,
    changeLabel: "no change",
  },
};

export const WithPrefix: Story = {
  args: {
    label: "Monthly Revenue",
    value: "12,450",
    prefix: "\u20AC",
    change: 8.3,
    changeLabel: "vs last month",
  },
};

export const WithSuffix: Story = {
  args: {
    label: "Conversion Rate",
    value: "3.24",
    suffix: "%",
    change: 1.1,
    changeLabel: "vs last quarter",
  },
};

export const Loading: Story = {
  args: {
    label: "Total Revenue",
    value: "",
    loading: true,
    icon: <DollarSign className="h-5 w-5" />,
  },
};

export const NoChange: Story = {
  args: {
    label: "Total Orders",
    value: "1,284",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Revenue"
        value="45,231"
        prefix="$"
        change={12.5}
        changeLabel="vs last month"
        icon={<DollarSign className="h-5 w-5" />}
      />
      <StatCard
        label="Active Users"
        value="2,350"
        change={-3.2}
        changeLabel="vs yesterday"
        icon={<Users className="h-5 w-5" />}
      />
      <StatCard
        label="Orders"
        value="1,284"
        change={0}
        changeLabel="no change"
        icon={<ShoppingCart className="h-5 w-5" />}
      />
      <StatCard
        label="Growth"
        value="18.2"
        suffix="%"
        change={4.1}
        changeLabel="this quarter"
        icon={<TrendingUp className="h-5 w-5" />}
        loading={false}
      />
    </div>
  ),
};
