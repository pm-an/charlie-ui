import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { VirtualList } from "./VirtualList";

const meta: Meta<typeof VirtualList> = {
  title: "Data Display/VirtualList",
  component: VirtualList,
  tags: ["autodocs"],
  argTypes: {
    height: { control: "number" },
    itemHeight: { control: "number" },
    overscan: { control: "number" },
    loading: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof VirtualList>;

// Generate 10,000 simple items
const simpleItems = Array.from({ length: 10_000 }, (_, i) => ({
  id: i,
  label: `Item ${i + 1}`,
}));

export const Default: Story = {
  args: {
    items: simpleItems,
    height: 400,
    itemHeight: 40,
    overscan: 5,
    renderItem: (item: (typeof simpleItems)[number], index: number) => (
      <div className="flex items-center px-4 text-sm text-white/80 border-b border-white/5 h-full">
        <span className="text-white/30 w-16 tabular-nums">{index + 1}.</span>
        <span>{item.label}</span>
      </div>
    ),
  },
};

// Users with avatar-like info
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
};

const roles = [
  "Engineer",
  "Designer",
  "Product Manager",
  "Data Scientist",
  "DevOps",
  "QA Lead",
];
const firstNames = [
  "Alex",
  "Jordan",
  "Taylor",
  "Morgan",
  "Casey",
  "Riley",
  "Quinn",
  "Avery",
  "Sage",
  "Dakota",
];
const lastNames = [
  "Chen",
  "Park",
  "Silva",
  "Andersen",
  "Nakamura",
  "Okafor",
  "Mueller",
  "Johansson",
  "Kapoor",
  "Reeves",
];

const users: User[] = Array.from({ length: 5_000 }, (_, i) => {
  const first = firstNames[i % firstNames.length];
  const last = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
  return {
    id: i,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
    role: roles[i % roles.length],
    avatar: first[0] + last[0],
  };
});

export const CustomRender: Story = {
  args: {
    items: users,
    height: 400,
    itemHeight: 56,
    overscan: 5,
    getItemKey: (item: User) => item.id,
    renderItem: (item: User) => (
      <div className="flex items-center gap-3 px-4 h-full border-b border-white/5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white/70">
          {item.avatar}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-white/90 truncate">
            {item.name}
          </span>
          <span className="text-xs text-white/40 truncate">{item.email}</span>
        </div>
        <span className="ml-auto text-xs text-white/30 shrink-0">
          {item.role}
        </span>
      </div>
    ),
  },
};

export const InfiniteScroll: Story = {
  render: function InfiniteScrollStory() {
    const [items, setItems] = React.useState(() =>
      Array.from({ length: 100 }, (_, i) => ({
        id: i,
        label: `Item ${i + 1}`,
      }))
    );
    const [loading, setLoading] = React.useState(false);

    const loadMore = React.useCallback(() => {
      if (loading) return;
      setLoading(true);
      setTimeout(() => {
        setItems((prev) => {
          const start = prev.length;
          const next = Array.from({ length: 50 }, (_, i) => ({
            id: start + i,
            label: `Item ${start + i + 1}`,
          }));
          return [...prev, ...next];
        });
        setLoading(false);
      }, 800);
    }, [loading]);

    return (
      <div>
        <p className="text-sm text-white/50 mb-2">
          {items.length} items loaded. Scroll to the bottom to load more.
        </p>
        <VirtualList
          items={items}
          height={400}
          itemHeight={40}
          overscan={5}
          onEndReached={loadMore}
          endReachedThreshold={200}
          loading={loading}
          getItemKey={(item) => item.id}
          renderItem={(item, index) => (
            <div className="flex items-center px-4 text-sm text-white/80 border-b border-white/5 h-full">
              <span className="text-white/30 w-16 tabular-nums">
                {index + 1}.
              </span>
              <span>{item.label}</span>
            </div>
          )}
        />
      </div>
    );
  },
};

export const Loading: Story = {
  args: {
    items: simpleItems.slice(0, 20),
    height: 400,
    itemHeight: 40,
    overscan: 5,
    loading: true,
    renderItem: (item: (typeof simpleItems)[number], index: number) => (
      <div className="flex items-center px-4 text-sm text-white/80 border-b border-white/5 h-full">
        <span className="text-white/30 w-16 tabular-nums">{index + 1}.</span>
        <span>{item.label}</span>
      </div>
    ),
  },
};

export const Empty: Story = {
  args: {
    items: [],
    height: 300,
    itemHeight: 40,
    emptyContent: (
      <div className="flex flex-col items-center gap-2">
        <span className="text-lg text-white/30">No results found</span>
        <span className="text-sm text-white/20">
          Try adjusting your search or filters
        </span>
      </div>
    ),
    renderItem: () => null,
  },
};

export const WithCustomKeys: Story = {
  args: {
    items: Array.from({ length: 1_000 }, (_, i) => ({
      uuid: `user-${crypto.randomUUID?.() ?? i}`,
      name: `User ${i + 1}`,
    })),
    height: 400,
    itemHeight: 40,
    overscan: 5,
    getItemKey: (item: { uuid: string }) => item.uuid,
    renderItem: (item: { uuid: string; name: string }, index: number) => (
      <div className="flex items-center justify-between px-4 text-sm border-b border-white/5 h-full">
        <span className="text-white/80">{item.name}</span>
        <span className="text-xs text-white/20 font-mono">
          {item.uuid.slice(0, 8)}...
        </span>
      </div>
    ),
  },
};
