import type { Meta, StoryObj } from "@storybook/react-vite";
import { KanbanBoard, type KanbanColumn } from "./KanbanBoard";

const meta: Meta<typeof KanbanBoard> = {
  title: "Blocks/Application/KanbanBoard",
  component: KanbanBoard,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof KanbanBoard>;

const sampleColumns: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    color: "blue",
    cards: [
      {
        id: "1",
        title: "Update user authentication flow",
        description: "Migrate from session-based to JWT authentication with refresh token rotation",
        tags: [
          { label: "Backend", color: "purple" },
          { label: "Security", color: "red" },
        ],
        assignee: { name: "Sarah Chen" },
      },
      {
        id: "2",
        title: "Design system audit",
        description: "Review all components for consistency with the updated brand guidelines",
        tags: [{ label: "Design", color: "pink" }],
        assignee: { name: "Alex Rivera" },
      },
      {
        id: "3",
        title: "Write API documentation",
        description: "Document all REST endpoints with request/response examples",
        tags: [{ label: "Docs", color: "green" }],
      },
      {
        id: "4",
        title: "Add dark mode toggle",
        tags: [{ label: "Frontend", color: "blue" }],
        assignee: { name: "Jordan Lee" },
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "yellow",
    cards: [
      {
        id: "5",
        title: "Implement search functionality",
        description: "Full-text search with filters for date range, category, and status",
        tags: [
          { label: "Frontend", color: "blue" },
          { label: "Backend", color: "purple" },
        ],
        assignee: { name: "Maria Garcia" },
      },
      {
        id: "6",
        title: "Optimize database queries",
        description: "Add indexes and optimize N+1 queries on the dashboard endpoint",
        tags: [{ label: "Performance", color: "orange" }],
        assignee: { name: "David Kim" },
      },
      {
        id: "7",
        title: "Set up CI/CD pipeline",
        description: "Configure GitHub Actions for automated testing and deployment",
        tags: [{ label: "DevOps", color: "green" }],
        assignee: { name: "Sarah Chen" },
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "green",
    cards: [
      {
        id: "8",
        title: "Configure Storybook",
        description: "Set up Storybook with autodocs and theme support",
        tags: [{ label: "Tooling", color: "purple" }],
        assignee: { name: "Alex Rivera" },
      },
      {
        id: "9",
        title: "Create Button component",
        tags: [{ label: "Frontend", color: "blue" }],
        assignee: { name: "Jordan Lee" },
      },
      {
        id: "10",
        title: "Set up Vitest testing framework",
        description: "Configure Vitest with jsdom, Testing Library, and coverage reporting",
        tags: [
          { label: "Testing", color: "green" },
          { label: "Tooling", color: "purple" },
        ],
        assignee: { name: "Maria Garcia" },
      },
      {
        id: "11",
        title: "Initial project scaffolding",
        description: "Set up Vite, TypeScript, Tailwind CSS, and ESLint configuration",
        tags: [{ label: "Setup", color: "orange" }],
        assignee: { name: "David Kim" },
      },
      {
        id: "12",
        title: "Design color palette",
        tags: [{ label: "Design", color: "pink" }],
        assignee: { name: "Alex Rivera" },
      },
    ],
  },
];

export const Default: Story = {
  args: {
    columns: sampleColumns,
    onCardClick: (columnId, cardId) =>
      console.log(`Card clicked: ${cardId} in ${columnId}`),
    onAddCard: (columnId) => console.log(`Add card to: ${columnId}`),
  },
};

export const Empty: Story = {
  args: {
    columns: [
      { id: "todo", title: "To Do", color: "blue", cards: [] },
      { id: "in-progress", title: "In Progress", color: "yellow", cards: [] },
      { id: "done", title: "Done", color: "green", cards: [] },
    ],
    onAddCard: (columnId) => console.log(`Add card to: ${columnId}`),
  },
};
