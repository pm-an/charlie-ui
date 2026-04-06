import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FileManager, type FileItem, type FileManagerBreadcrumb } from "../FileManager";

const sampleFiles: FileItem[] = [
  { id: "1", name: "Documents", type: "folder", modified: "Mar 12, 2026" },
  { id: "2", name: "Photos", type: "folder", modified: "Mar 10, 2026" },
  { id: "3", name: "README.md", type: "file", size: "8.1 KB", modified: "Mar 13, 2026" },
  { id: "4", name: "package.json", type: "file", size: "2.4 KB", modified: "Mar 14, 2026" },
];

const breadcrumbs: FileManagerBreadcrumb[] = [
  { label: "Home", path: "/" },
  { label: "Projects", path: "/projects" },
  { label: "charlie-ui", path: "/projects/charlie-ui" },
];

describe("FileManager", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(<FileManager files={sampleFiles} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      const { container } = render(<FileManager files={sampleFiles} />);
      expect(container.firstChild).toHaveAttribute("data-slot", "file-manager");
    });

    it("applies custom className", () => {
      const { container } = render(
        <FileManager files={sampleFiles} className="custom" />
      );
      expect(container.firstChild).toHaveClass("custom");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<FileManager ref={ref} files={sampleFiles} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("renders file names", () => {
      render(<FileManager files={sampleFiles} />);
      expect(screen.getByText("Documents")).toBeInTheDocument();
      expect(screen.getByText("Photos")).toBeInTheDocument();
      expect(screen.getByText("README.md")).toBeInTheDocument();
      expect(screen.getByText("package.json")).toBeInTheDocument();
    });
  });

  describe("list view", () => {
    it("renders list view by default", () => {
      render(<FileManager files={sampleFiles} />);
      // List view has column headers
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Size")).toBeInTheDocument();
      expect(screen.getByText("Modified")).toBeInTheDocument();
    });

    it("shows file sizes in list view", () => {
      render(<FileManager files={sampleFiles} />);
      expect(screen.getByText("8.1 KB")).toBeInTheDocument();
      expect(screen.getByText("2.4 KB")).toBeInTheDocument();
    });

    it("shows modified dates in list view", () => {
      render(<FileManager files={sampleFiles} />);
      expect(screen.getByText("Mar 12, 2026")).toBeInTheDocument();
    });

    it("shows -- for folder size", () => {
      render(<FileManager files={sampleFiles} />);
      const dashes = screen.getAllByText("--");
      expect(dashes.length).toBeGreaterThanOrEqual(2); // Folders show -- for size
    });

    it("sorts folders before files", () => {
      const { container } = render(<FileManager files={sampleFiles} />);
      const rows = container.querySelectorAll("[role='button']");
      // First two should be folders (Documents, Photos)
      expect(rows[0]).toHaveTextContent("Documents");
      expect(rows[1]).toHaveTextContent("Photos");
    });
  });

  describe("grid view", () => {
    it("renders grid view when specified", () => {
      render(<FileManager files={sampleFiles} view="grid" />);
      // Grid view does not show column headers
      expect(screen.queryByText("Size")).not.toBeInTheDocument();
      expect(screen.queryByText("Modified")).not.toBeInTheDocument();
      // But still shows file names
      expect(screen.getByText("Documents")).toBeInTheDocument();
    });
  });

  describe("breadcrumbs", () => {
    it("renders breadcrumbs when provided", () => {
      render(<FileManager files={sampleFiles} breadcrumbs={breadcrumbs} />);
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Projects")).toBeInTheDocument();
      expect(screen.getByText("charlie-ui")).toBeInTheDocument();
    });

    it("renders currentPath when no breadcrumbs", () => {
      render(<FileManager files={sampleFiles} currentPath="/home/user" />);
      expect(screen.getByText("/home/user")).toBeInTheDocument();
    });

    it("calls onNavigate when breadcrumb is clicked", () => {
      const onNavigate = vi.fn();
      render(
        <FileManager
          files={sampleFiles}
          breadcrumbs={breadcrumbs}
          onNavigate={onNavigate}
        />
      );
      fireEvent.click(screen.getByText("Home"));
      expect(onNavigate).toHaveBeenCalledWith("/");
    });
  });

  describe("view toggle", () => {
    it("renders view toggle buttons", () => {
      render(<FileManager files={sampleFiles} />);
      expect(screen.getByLabelText("List view")).toBeInTheDocument();
      expect(screen.getByLabelText("Grid view")).toBeInTheDocument();
    });

    it("calls onViewChange with grid when grid button clicked", () => {
      const onViewChange = vi.fn();
      render(
        <FileManager files={sampleFiles} onViewChange={onViewChange} />
      );
      fireEvent.click(screen.getByLabelText("Grid view"));
      expect(onViewChange).toHaveBeenCalledWith("grid");
    });

    it("calls onViewChange with list when list button clicked", () => {
      const onViewChange = vi.fn();
      render(
        <FileManager files={sampleFiles} view="grid" onViewChange={onViewChange} />
      );
      fireEvent.click(screen.getByLabelText("List view"));
      expect(onViewChange).toHaveBeenCalledWith("list");
    });

    it("highlights active view button", () => {
      const { rerender } = render(<FileManager files={sampleFiles} view="list" />);
      expect(screen.getByLabelText("List view")).toHaveClass("bg-bg-subtle-hover");

      rerender(<FileManager files={sampleFiles} view="grid" />);
      expect(screen.getByLabelText("Grid view")).toHaveClass("bg-bg-subtle-hover");
    });
  });

  describe("interactions", () => {
    it("calls onFileClick when a file is clicked in list view", () => {
      const onFileClick = vi.fn();
      render(<FileManager files={sampleFiles} onFileClick={onFileClick} />);
      fireEvent.click(screen.getByText("README.md"));
      expect(onFileClick).toHaveBeenCalledWith("3");
    });

    it("calls onFileClick when a file is clicked in grid view", () => {
      const onFileClick = vi.fn();
      render(
        <FileManager files={sampleFiles} view="grid" onFileClick={onFileClick} />
      );
      fireEvent.click(screen.getByText("Documents"));
      expect(onFileClick).toHaveBeenCalledWith("1");
    });

    it("supports keyboard interaction on files", () => {
      const onFileClick = vi.fn();
      render(<FileManager files={sampleFiles} onFileClick={onFileClick} />);
      const items = screen.getAllByRole("button");
      // Find the Documents item (first file row after toolbar buttons)
      const docItem = items.find((el) => el.textContent?.includes("Documents"));
      if (docItem) {
        fireEvent.keyDown(docItem, { key: "Enter" });
        expect(onFileClick).toHaveBeenCalledWith("1");
      }
    });
  });

  describe("empty state", () => {
    it("renders empty state message", () => {
      render(<FileManager files={[]} />);
      expect(screen.getByText("This folder is empty")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("file items have button role", () => {
      render(<FileManager files={sampleFiles} />);
      const buttons = screen.getAllByRole("button");
      // Should include file rows + view toggle buttons
      expect(buttons.length).toBeGreaterThanOrEqual(4);
    });

    it("breadcrumb nav has aria-label", () => {
      render(<FileManager files={sampleFiles} breadcrumbs={breadcrumbs} />);
      expect(screen.getByLabelText("File path")).toBeInTheDocument();
    });

    it("view toggle buttons have aria-labels", () => {
      render(<FileManager files={sampleFiles} />);
      expect(screen.getByLabelText("List view")).toBeInTheDocument();
      expect(screen.getByLabelText("Grid view")).toBeInTheDocument();
    });
  });

  describe("conditional rendering", () => {
    it("renders custom icon when provided", () => {
      const filesWithIcon: FileItem[] = [
        {
          id: "1",
          name: "Custom Icon File",
          type: "file",
          icon: <span data-testid="custom-icon">C</span>,
        },
      ];
      render(<FileManager files={filesWithIcon} />);
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });
  });
});
