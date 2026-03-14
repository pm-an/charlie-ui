import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DataTable } from "../DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { expectNoA11yViolations } from "../../test/a11y";

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

type TestRow = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const columns: ColumnDef<TestRow, unknown>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
];

const data: TestRow[] = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Engineer" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "Designer" },
  { id: 3, name: "Clara", email: "clara@example.com", role: "Manager" },
  { id: 4, name: "David", email: "david@example.com", role: "Analyst" },
  { id: 5, name: "Elena", email: "elena@example.com", role: "Engineer" },
];

function generateRows(count: number): TestRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 2 === 0 ? "Engineer" : "Designer",
  }));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("DataTable", () => {
  describe("rendering", () => {
    it("renders table with data", () => {
      render(<DataTable data={data} columns={columns} enablePagination={false} />);
      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("bob@example.com")).toBeInTheDocument();
    });

    it("renders correct number of rows", () => {
      render(<DataTable data={data} columns={columns} enablePagination={false} />);
      const tbody = screen.getByRole("table").querySelector("tbody");
      // Each data row
      const rows = within(tbody!).getAllByRole("row");
      expect(rows).toHaveLength(5);
    });

    it("renders column headers", () => {
      render(<DataTable data={data} columns={columns} enablePagination={false} />);
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Role")).toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("sorts data when clicking a header", () => {
      render(
        <DataTable
          data={data}
          columns={columns}
          enableSorting
          enablePagination={false}
        />
      );
      // Click the Name header to sort ascending
      fireEvent.click(screen.getByText("Name"));

      const tbody = screen.getByRole("table").querySelector("tbody");
      const rows = within(tbody!).getAllByRole("row");
      // After ascending sort: Alice, Bob, Clara, David, Elena
      expect(within(rows[0]).getByText("Alice")).toBeInTheDocument();
      expect(within(rows[4]).getByText("Elena")).toBeInTheDocument();

      // Click again for descending
      fireEvent.click(screen.getByText("Name"));
      const rowsDesc = within(tbody!).getAllByRole("row");
      expect(within(rowsDesc[0]).getByText("Elena")).toBeInTheDocument();
      expect(within(rowsDesc[4]).getByText("Alice")).toBeInTheDocument();
    });
  });

  describe("pagination", () => {
    it("shows correct page of data", () => {
      const largeData = generateRows(25);
      render(
        <DataTable
          data={largeData}
          columns={columns}
          enablePagination
          showPagination
          pageSizeOptions={[10, 20, 50]}
        />
      );

      // First page should show first 10 rows
      expect(screen.getByText("Showing 1 to 10 of 25 results")).toBeInTheDocument();
    });

    it("navigates to next page", () => {
      const largeData = generateRows(25);
      render(
        <DataTable
          data={largeData}
          columns={columns}
          enablePagination
          showPagination
        />
      );

      fireEvent.click(screen.getByLabelText("Next page"));
      expect(screen.getByText("Showing 11 to 20 of 25 results")).toBeInTheDocument();
    });

    it("navigates to previous page", () => {
      const largeData = generateRows(25);
      render(
        <DataTable
          data={largeData}
          columns={columns}
          enablePagination
          showPagination
        />
      );

      // Go to page 2 then back
      fireEvent.click(screen.getByLabelText("Next page"));
      fireEvent.click(screen.getByLabelText("Previous page"));
      expect(screen.getByText("Showing 1 to 10 of 25 results")).toBeInTheDocument();
    });

    it("disables previous button on first page", () => {
      const largeData = generateRows(25);
      render(
        <DataTable
          data={largeData}
          columns={columns}
          enablePagination
          showPagination
        />
      );
      expect(screen.getByLabelText("Previous page")).toBeDisabled();
    });

    it("disables next button on last page", () => {
      const largeData = generateRows(15);
      render(
        <DataTable
          data={largeData}
          columns={columns}
          enablePagination
          showPagination
        />
      );

      // Go to page 2 (last page with 15 items / 10 per page)
      fireEvent.click(screen.getByLabelText("Next page"));
      expect(screen.getByLabelText("Next page")).toBeDisabled();
    });
  });

  describe("row selection", () => {
    it("renders checkboxes when enableRowSelection is true", () => {
      render(
        <DataTable
          data={data}
          columns={columns}
          enableRowSelection
          enablePagination={false}
        />
      );
      // Header checkbox + 5 row checkboxes
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(6);
    });

    it("selects a row via checkbox", () => {
      render(
        <DataTable
          data={data}
          columns={columns}
          enableRowSelection
          enablePagination={false}
        />
      );
      const checkboxes = screen.getAllByRole("checkbox");
      // Click the first data row checkbox (index 1 because index 0 is "select all")
      fireEvent.click(checkboxes[1]);
      expect(checkboxes[1]).toBeChecked();
    });

    it("selects all rows via header checkbox", () => {
      render(
        <DataTable
          data={data}
          columns={columns}
          enableRowSelection
          enablePagination={false}
        />
      );
      const checkboxes = screen.getAllByRole("checkbox");
      // Click the "select all" checkbox
      fireEvent.click(checkboxes[0]);
      // All row checkboxes should be checked
      for (let i = 1; i < checkboxes.length; i++) {
        expect(checkboxes[i]).toBeChecked();
      }
    });

    it("calls onRowSelectionChange when selection changes", () => {
      const onSelectionChange = vi.fn();
      render(
        <DataTable
          data={data}
          columns={columns}
          enableRowSelection
          rowSelection={{}}
          onRowSelectionChange={onSelectionChange}
          enablePagination={false}
        />
      );
      const checkboxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkboxes[1]);
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("empty state", () => {
    it("shows default empty message when no data", () => {
      render(
        <DataTable data={[]} columns={columns} enablePagination={false} />
      );
      expect(screen.getByText("No results found.")).toBeInTheDocument();
    });

    it("shows custom empty message", () => {
      render(
        <DataTable
          data={[]}
          columns={columns}
          emptyMessage="Nothing here."
          enablePagination={false}
        />
      );
      expect(screen.getByText("Nothing here.")).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("shows skeleton rows when loading", () => {
      const { container } = render(
        <DataTable data={[]} columns={columns} loading enablePagination={false} />
      );
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      // One full-width skeleton per row, spanning all columns
      expect(skeletons.length).toBe(5);

      // Each skeleton should be inside a td that spans all columns
      const skeletonCells = container.querySelectorAll("td[colspan]");
      expect(skeletonCells.length).toBe(5);
      skeletonCells.forEach((cell) => {
        expect(cell.getAttribute("colspan")).toBe(String(columns.length));
      });
    });

    it("does not show data rows when loading", () => {
      render(
        <DataTable data={data} columns={columns} loading enablePagination={false} />
      );
      expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    });
  });

  describe("global search", () => {
    it("renders search input when showSearch is true", () => {
      render(
        <DataTable
          data={data}
          columns={columns}
          showSearch
          enablePagination={false}
        />
      );
      expect(screen.getByLabelText("Search table")).toBeInTheDocument();
    });

    it("filters rows based on search input", () => {
      render(
        <DataTable
          data={data}
          columns={columns}
          showSearch
          enablePagination={false}
        />
      );
      const input = screen.getByLabelText("Search table");
      fireEvent.change(input, { target: { value: "Alice" } });

      const tbody = screen.getByRole("table").querySelector("tbody");
      const rows = within(tbody!).getAllByRole("row");
      expect(rows).toHaveLength(1);
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    it("uses custom search placeholder", () => {
      render(
        <DataTable
          data={data}
          columns={columns}
          showSearch
          searchPlaceholder="Find users..."
          enablePagination={false}
        />
      );
      expect(screen.getByPlaceholderText("Find users...")).toBeInTheDocument();
    });
  });

  describe("onRowClick", () => {
    it("calls onRowClick callback with row data", () => {
      const onClick = vi.fn();
      render(
        <DataTable
          data={data}
          columns={columns}
          onRowClick={onClick}
          enablePagination={false}
        />
      );

      const tbody = screen.getByRole("table").querySelector("tbody");
      const rows = within(tbody!).getAllByRole("row");
      fireEvent.click(rows[0]);
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith(data[0]);
    });

    it("applies cursor-pointer class when onRowClick is set", () => {
      render(
        <DataTable
          data={data}
          columns={columns}
          onRowClick={() => {}}
          enablePagination={false}
        />
      );

      const tbody = screen.getByRole("table").querySelector("tbody");
      const rows = within(tbody!).getAllByRole("row");
      expect(rows[0]).toHaveClass("cursor-pointer");
    });
  });

  describe("variants", () => {
    it("applies striped variant class on odd rows", () => {
      render(
        <DataTable
          data={data}
          columns={columns}
          variant="striped"
          enablePagination={false}
        />
      );

      const tbody = screen.getByRole("table").querySelector("tbody");
      const rows = within(tbody!).getAllByRole("row");
      // Split into class tokens to avoid false positives from hover:bg-white/[0.02]
      const getClasses = (el: Element) => el.className.split(/\s+/);
      // Odd-indexed rows (index 1, 3) should have bg-white/[0.02] as a direct class
      expect(getClasses(rows[1])).toContain("bg-white/[0.02]");
      expect(getClasses(rows[3])).toContain("bg-white/[0.02]");
      // Even rows should NOT have it as a direct class (only hover: prefixed)
      expect(getClasses(rows[0])).not.toContain("bg-white/[0.02]");
    });

    it("applies minimal variant without borders", () => {
      render(
        <DataTable
          data={data}
          columns={columns}
          variant="minimal"
          enablePagination={false}
        />
      );

      const tbody = screen.getByRole("table").querySelector("tbody");
      const rows = within(tbody!).getAllByRole("row");
      // Minimal variant rows should not have border-t
      expect(rows[0].className).not.toContain("border-t");
    });
  });

  describe("density", () => {
    it("applies compact density classes", () => {
      const { container } = render(
        <DataTable
          data={data}
          columns={columns}
          density="compact"
          enablePagination={false}
        />
      );
      const cells = container.querySelectorAll("td");
      expect(cells[0]).toHaveClass("py-2");
    });

    it("applies spacious density classes", () => {
      const { container } = render(
        <DataTable
          data={data}
          columns={columns}
          density="spacious"
          enablePagination={false}
        />
      );
      const cells = container.querySelectorAll("td");
      expect(cells[0]).toHaveClass("py-4");
    });

    it("applies comfortable density by default", () => {
      const { container } = render(
        <DataTable
          data={data}
          columns={columns}
          enablePagination={false}
        />
      );
      const cells = container.querySelectorAll("td");
      expect(cells[0]).toHaveClass("py-3");
    });
  });

  describe("sticky header", () => {
    it("applies sticky class when stickyHeader is true", () => {
      const { container } = render(
        <DataTable
          data={data}
          columns={columns}
          stickyHeader
          enablePagination={false}
        />
      );
      const thead = container.querySelector("thead");
      expect(thead).toHaveClass("sticky");
    });

    it("does not apply sticky class by default", () => {
      const { container } = render(
        <DataTable
          data={data}
          columns={columns}
          enablePagination={false}
        />
      );
      const thead = container.querySelector("thead");
      expect(thead).not.toHaveClass("sticky");
    });
  });

  describe("className merging", () => {
    it("applies custom className to the wrapper", () => {
      const { container } = render(
        <DataTable
          data={data}
          columns={columns}
          className="my-custom-class"
          enablePagination={false}
        />
      );
      expect(container.firstChild).toHaveClass("my-custom-class");
    });
  });

  describe("controlled vs uncontrolled state", () => {
    it("works in uncontrolled mode (manages own sorting state)", () => {
      render(
        <DataTable
          data={data}
          columns={columns}
          enableSorting
          enablePagination={false}
        />
      );
      // Click Name header to sort
      fireEvent.click(screen.getByText("Name"));
      const tbody = screen.getByRole("table").querySelector("tbody");
      const rows = within(tbody!).getAllByRole("row");
      // Ascending: Alice first
      expect(within(rows[0]).getByText("Alice")).toBeInTheDocument();
    });

    it("works in controlled mode (calls onSortingChange)", () => {
      const onSortingChange = vi.fn();
      render(
        <DataTable
          data={data}
          columns={columns}
          enableSorting
          sorting={[]}
          onSortingChange={onSortingChange}
          enablePagination={false}
        />
      );
      fireEvent.click(screen.getByText("Name"));
      expect(onSortingChange).toHaveBeenCalledTimes(1);
    });

    it("works in controlled pagination mode", () => {
      const onPaginationChange = vi.fn();
      const largeData = generateRows(25);
      render(
        <DataTable
          data={largeData}
          columns={columns}
          enablePagination
          showPagination
          pagination={{ pageIndex: 0, pageSize: 10 }}
          onPaginationChange={onPaginationChange}
        />
      );
      fireEvent.click(screen.getByLabelText("Next page"));
      expect(onPaginationChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("page size selector", () => {
    it("changes page size", () => {
      const largeData = generateRows(30);
      render(
        <DataTable
          data={largeData}
          columns={columns}
          enablePagination
          showPagination
          pageSizeOptions={[5, 10, 20]}
        />
      );

      const select = screen.getByLabelText("Page size");
      fireEvent.change(select, { target: { value: "20" } });

      expect(screen.getByText("Showing 1 to 20 of 30 results")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("renders caption as sr-only when provided", () => {
      const { container } = render(
        <DataTable
          data={data}
          columns={columns}
          caption="User directory"
          enablePagination={false}
        />
      );
      const caption = container.querySelector("caption");
      expect(caption).toBeInTheDocument();
      expect(caption!.textContent).toBe("User directory");
      expect(caption).toHaveClass("sr-only");
    });

    it("does not render caption when not provided", () => {
      const { container } = render(
        <DataTable data={data} columns={columns} enablePagination={false} />
      );
      expect(container.querySelector("caption")).not.toBeInTheDocument();
    });

    it("adds scope='col' to header th elements", () => {
      const { container } = render(
        <DataTable data={data} columns={columns} enablePagination={false} />
      );
      const headers = container.querySelectorAll("th");
      headers.forEach((th) => {
        expect(th).toHaveAttribute("scope", "col");
      });
    });

    it("has aria-sort='none' on sortable headers by default", () => {
      const { container } = render(
        <DataTable
          data={data}
          columns={columns}
          enableSorting
          enablePagination={false}
        />
      );
      const headers = container.querySelectorAll("th");
      headers.forEach((th) => {
        expect(th).toHaveAttribute("aria-sort", "none");
      });
    });

    it("updates aria-sort to ascending on sorted column", () => {
      render(
        <DataTable
          data={data}
          columns={columns}
          enableSorting
          enablePagination={false}
        />
      );
      // Click Name header to sort ascending
      fireEvent.click(screen.getByText("Name"));

      // Find the Name header <th>
      const nameHeader = screen.getByText("Name").closest("th");
      expect(nameHeader).toHaveAttribute("aria-sort", "ascending");

      // Other headers should remain "none"
      const emailHeader = screen.getByText("Email").closest("th");
      expect(emailHeader).toHaveAttribute("aria-sort", "none");
    });

    it("updates aria-sort to descending on second click", () => {
      render(
        <DataTable
          data={data}
          columns={columns}
          enableSorting
          enablePagination={false}
        />
      );
      fireEvent.click(screen.getByText("Name")); // asc
      fireEvent.click(screen.getByText("Name")); // desc

      const nameHeader = screen.getByText("Name").closest("th");
      expect(nameHeader).toHaveAttribute("aria-sort", "descending");
    });

    it("keeps aria-hidden on sort icons", () => {
      const { container } = render(
        <DataTable
          data={data}
          columns={columns}
          enableSorting
          enablePagination={false}
        />
      );
      const iconSpans = container.querySelectorAll('[aria-hidden="true"]');
      expect(iconSpans.length).toBeGreaterThan(0);
    });

    it("passes axe accessibility checks", async () => {
      const { container } = render(
        <DataTable
          data={data}
          columns={columns}
          caption="Test table"
          enablePagination={false}
        />
      );
      await expectNoA11yViolations(container);
    });
  });
});
