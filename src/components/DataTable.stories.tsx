import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable } from "./DataTable";
import type { ColumnDef, SortingState, PaginationState, RowSelectionState } from "@tanstack/react-table";

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive" | "Pending";
  joinDate: string;
};

const statuses: User["status"][] = ["Active", "Inactive", "Pending"];
const roles = ["Engineer", "Designer", "Product Manager", "Data Analyst", "Marketing Lead"];
const firstNames = [
  "Alice", "Bob", "Clara", "David", "Elena", "Frank", "Grace", "Henry",
  "Irene", "Jack", "Karen", "Liam", "Mia", "Noah", "Olivia", "Paul",
  "Quinn", "Rachel", "Sam", "Tina", "Uma", "Victor", "Wendy", "Xavier",
  "Yara", "Zach",
];
const lastNames = [
  "Anderson", "Brown", "Clark", "Davis", "Evans", "Foster", "Garcia",
  "Hall", "Irvine", "Jones", "Kim", "Lee", "Martin", "Nguyen", "Owens",
  "Park", "Quinn", "Reed", "Smith", "Taylor", "Underwood", "Vasquez",
  "Wang", "Xie", "Young", "Zhang",
];

function generateUsers(count: number): User[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@example.com`,
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
    joinDate: new Date(2023, i % 12, (i % 28) + 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  }));
}

const sampleUsers = generateUsers(20);
const largeDataset = generateUsers(57);

const columns: ColumnDef<User, any>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as User["status"];
      const color =
        status === "Active"
          ? "text-green-400"
          : status === "Inactive"
            ? "text-red-400"
            : "text-yellow-400";
      return <span className={color}>{status}</span>;
    },
  },
  { accessorKey: "joinDate", header: "Joined" },
];

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof DataTable<User>> = {
  title: "Data Display/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "striped", "minimal"],
    },
    density: {
      control: "select",
      options: ["compact", "comfortable", "spacious"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof DataTable<User>>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    data: sampleUsers,
    columns,
    enablePagination: true,
    showPagination: true,
  },
};

export const Striped: Story = {
  args: {
    data: sampleUsers,
    columns,
    variant: "striped",
  },
};

export const Compact: Story = {
  args: {
    data: sampleUsers,
    columns,
    density: "compact",
  },
};

export const WithSorting: Story = {
  render: function WithSortingStory() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    return (
      <DataTable<User>
        data={sampleUsers}
        columns={columns}
        sorting={sorting}
        onSortingChange={setSorting}
        enableSorting
      />
    );
  },
};

export const WithSearch: Story = {
  render: function WithSearchStory() {
    const [search, setSearch] = React.useState("");
    return (
      <DataTable<User>
        data={sampleUsers}
        columns={columns}
        showSearch
        globalFilter={search}
        onGlobalFilterChange={setSearch}
        searchPlaceholder="Search by name, email, role..."
      />
    );
  },
};

export const WithSelection: Story = {
  render: function WithSelectionStory() {
    const [selection, setSelection] = React.useState<RowSelectionState>({});
    return (
      <div>
        <div className="mb-2 text-xs text-white/40">
          {Object.keys(selection).length} row(s) selected
        </div>
        <DataTable<User>
          data={sampleUsers}
          columns={columns}
          enableRowSelection
          rowSelection={selection}
          onRowSelectionChange={setSelection}
        />
      </div>
    );
  },
};

export const WithPagination: Story = {
  render: function WithPaginationStory() {
    const [pagination, setPagination] = React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
    return (
      <DataTable<User>
        data={largeDataset}
        columns={columns}
        pagination={pagination}
        onPaginationChange={setPagination}
        enablePagination
        showPagination
      />
    );
  },
};

export const Empty: Story = {
  args: {
    data: [],
    columns,
    emptyMessage: "No users match your criteria.",
  },
};

export const Loading: Story = {
  args: {
    data: [],
    columns,
    loading: true,
  },
};

export const ServerSide: Story = {
  render: function ServerSideStory() {
    const allData = React.useMemo(() => generateUsers(100), []);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
    const [loading, setLoading] = React.useState(false);
    const [pageData, setPageData] = React.useState<User[]>(() =>
      allData.slice(0, 10)
    );

    React.useEffect(() => {
      setLoading(true);
      const timer = setTimeout(() => {
        let sorted = [...allData];
        if (sorting.length > 0) {
          const { id, desc } = sorting[0];
          sorted.sort((a, b) => {
            const aVal = String((a as Record<string, unknown>)[id] ?? "");
            const bVal = String((b as Record<string, unknown>)[id] ?? "");
            return desc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
          });
        }
        const start = pagination.pageIndex * pagination.pageSize;
        setPageData(sorted.slice(start, start + pagination.pageSize));
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }, [sorting, pagination, allData]);

    return (
      <DataTable<User>
        data={pageData}
        columns={columns}
        sorting={sorting}
        onSortingChange={setSorting}
        pagination={pagination}
        onPaginationChange={setPagination}
        manualSorting
        manualPagination
        pageCount={Math.ceil(allData.length / pagination.pageSize)}
        loading={loading}
        enableSorting
        enablePagination
        showPagination
      />
    );
  },
};
