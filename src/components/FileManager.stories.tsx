import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileManager, type FileItem, type FileManagerBreadcrumb } from "./FileManager";
import { useState } from "react";

const meta: Meta<typeof FileManager> = {
  title: "Blocks/Application/FileManager",
  component: FileManager,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FileManager>;

const sampleFiles: FileItem[] = [
  { id: "1", name: "Documents", type: "folder", modified: "Mar 12, 2026" },
  { id: "2", name: "Photos", type: "folder", modified: "Mar 10, 2026" },
  { id: "3", name: "Projects", type: "folder", modified: "Mar 8, 2026" },
  { id: "4", name: "package.json", type: "file", size: "2.4 KB", modified: "Mar 14, 2026" },
  { id: "5", name: "README.md", type: "file", size: "8.1 KB", modified: "Mar 13, 2026" },
  { id: "6", name: "tsconfig.json", type: "file", size: "1.2 KB", modified: "Mar 11, 2026" },
  { id: "7", name: "vite.config.ts", type: "file", size: "980 B", modified: "Mar 9, 2026" },
  { id: "8", name: ".gitignore", type: "file", size: "245 B", modified: "Mar 1, 2026" },
  { id: "9", name: "index.html", type: "file", size: "1.5 KB", modified: "Feb 28, 2026" },
  { id: "10", name: "eslint.config.js", type: "file", size: "3.2 KB", modified: "Feb 25, 2026" },
];

const breadcrumbs: FileManagerBreadcrumb[] = [
  { label: "Home", path: "/" },
  { label: "Projects", path: "/projects" },
  { label: "charlie-ui", path: "/projects/charlie-ui" },
];

export const Default: Story = {
  render: (args) => {
    const [view, setView] = useState<"grid" | "list">(args.view ?? "list");
    return (
      <div className="max-w-3xl mx-auto p-4">
        <FileManager
          {...args}
          view={view}
          onViewChange={setView}
          onFileClick={(id) => console.log("File clicked:", id)}
        />
      </div>
    );
  },
  args: {
    files: sampleFiles,
    currentPath: "/",
  },
};

export const GridView: Story = {
  args: {
    files: sampleFiles,
    view: "grid",
    onFileClick: (id) => console.log("File clicked:", id),
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    files: sampleFiles.filter((f) => f.type === "file"),
    breadcrumbs,
    onFileClick: (id) => console.log("File clicked:", id),
    onNavigate: (path) => console.log("Navigate to:", path),
  },
};

export const Empty: Story = {
  args: {
    files: [],
    breadcrumbs: [
      { label: "Home", path: "/" },
      { label: "Empty Folder", path: "/empty" },
    ],
  },
};
