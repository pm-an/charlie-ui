"use client";

import { useState, useMemo, type HTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Skeleton } from "./Skeleton";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
  type PaginationState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

// ---------------------------------------------------------------------------
// CVA variants
// ---------------------------------------------------------------------------

const tableRowVariants = cva("transition-colors", {
  variants: {
    variant: {
      default: "border-t border-white/6 hover:bg-white/[0.02]",
      striped: "hover:bg-white/[0.02]",
      minimal: "hover:bg-white/[0.02]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const tableCellVariants = cva("text-white/80", {
  variants: {
    density: {
      compact: "px-4 py-2 text-xs",
      comfortable: "px-4 py-3 text-sm",
      spacious: "px-4 py-4 text-sm",
    },
  },
  defaultVariants: {
    density: "comfortable",
  },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DataTableVariant = "default" | "striped" | "minimal";
type DataTableDensity = "compact" | "comfortable" | "spacious";

type DataTableProps<TData> = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  // Data
  data: TData[];
  columns: ColumnDef<TData, any>[];

  // Variants
  variant?: DataTableVariant;
  density?: DataTableDensity;

  // Features (controlled)
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;

  // Server-side
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualPagination?: boolean;
  pageCount?: number;

  // UI
  loading?: boolean;
  emptyMessage?: string;
  stickyHeader?: boolean;
  showPagination?: boolean;
  pageSizeOptions?: number[];
  onRowClick?: (row: TData) => void;

  // Search
  globalFilter?: string;
  onGlobalFilterChange?: (filter: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;

  // Enable features
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableRowSelection?: boolean;
  enablePagination?: boolean;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function DataTable<TData>({
  data,
  columns,
  variant = "default",
  density = "comfortable",

  // Controlled state
  sorting,
  onSortingChange,
  columnFilters,
  onColumnFiltersChange,
  rowSelection,
  onRowSelectionChange,
  pagination,
  onPaginationChange,

  // Server-side
  manualSorting,
  manualFiltering,
  manualPagination,
  pageCount,

  // UI
  loading = false,
  emptyMessage = "No results found.",
  stickyHeader = false,
  showPagination = true,
  pageSizeOptions = [10, 20, 50],
  onRowClick,
  className,

  // Search
  globalFilter,
  onGlobalFilterChange,
  searchPlaceholder = "Search...",
  showSearch = false,

  // Enable features
  enableSorting = true,
  enableFiltering,
  enableRowSelection = false,
  enablePagination = true,

  ...props
}: DataTableProps<TData>) {
  // Internal state for uncontrolled mode
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [internalFilters, setInternalFilters] = useState<ColumnFiltersState>(
    []
  );
  const [internalSelection, setInternalSelection] = useState<RowSelectionState>(
    {}
  );
  const [internalPagination, setInternalPagination] =
    useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [internalGlobalFilter, setInternalGlobalFilter] = useState("");

  // Resolved state (controlled or internal)
  const resolvedSorting = sorting ?? internalSorting;
  const resolvedFilters = columnFilters ?? internalFilters;
  const resolvedSelection = rowSelection ?? internalSelection;
  const resolvedPagination = pagination ?? internalPagination;
  const resolvedGlobalFilter = globalFilter ?? internalGlobalFilter;

  // Prepend checkbox column when row selection is enabled
  const finalColumns = useMemo(() => {
    if (!enableRowSelection) return columns;

    const selectionCol: ColumnDef<TData, any> = {
      id: "__select",
      header: ({ table }) => (
        <input
          type="checkbox"
          aria-label="Select all rows"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="accent-accent"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          aria-label={`Select row ${row.index + 1}`}
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="accent-accent"
        />
      ),
      enableSorting: false,
      size: 40,
    };

    return [selectionCol, ...columns];
  }, [columns, enableRowSelection]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      sorting: resolvedSorting,
      columnFilters: resolvedFilters,
      rowSelection: resolvedSelection,
      pagination: resolvedPagination,
      globalFilter: resolvedGlobalFilter,
    },
    onSortingChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(resolvedSorting) : updater;
      onSortingChange ? onSortingChange(next) : setInternalSorting(next);
    },
    onColumnFiltersChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(resolvedFilters) : updater;
      onColumnFiltersChange
        ? onColumnFiltersChange(next)
        : setInternalFilters(next);
    },
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(resolvedSelection) : updater;
      onRowSelectionChange
        ? onRowSelectionChange(next)
        : setInternalSelection(next);
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(resolvedPagination) : updater;
      onPaginationChange
        ? onPaginationChange(next)
        : setInternalPagination(next);
    },
    onGlobalFilterChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater(resolvedGlobalFilter)
          : updater;
      onGlobalFilterChange
        ? onGlobalFilterChange(next)
        : setInternalGlobalFilter(next);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
    getPaginationRowModel:
      manualPagination || !enablePagination
        ? undefined
        : getPaginationRowModel(),
    enableSorting,
    enableRowSelection,
    manualSorting,
    manualFiltering,
    manualPagination,
    pageCount,
  });

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  // Pagination info
  const currentPagination = resolvedPagination;
  const totalRows = manualPagination
    ? (pageCount ?? 0) * currentPagination.pageSize
    : table.getFilteredRowModel().rows.length;
  const from = currentPagination.pageIndex * currentPagination.pageSize + 1;
  const to = Math.min(
    (currentPagination.pageIndex + 1) * currentPagination.pageSize,
    totalRows
  );

  return (
    <div data-slot="data-table" className={cn("w-full", className)} {...props}>
      {/* Search bar */}
      {showSearch && (
        <div className="mb-4 relative flex items-center">
          <span className="absolute left-3 text-white/40 pointer-events-none">
            <Search size={14} />
          </span>
          <input
            type="text"
            value={resolvedGlobalFilter}
            onChange={(e) => {
              const val = e.target.value;
              onGlobalFilterChange
                ? onGlobalFilterChange(val)
                : setInternalGlobalFilter(val);
            }}
            placeholder={searchPlaceholder}
            className={cn(
              "w-full bg-white/5 border border-white/6 rounded-md h-9 pl-9 pr-3 text-sm text-white",
              "placeholder:text-white/40",
              "outline-none transition-all duration-200",
              "focus:ring-1 focus:ring-white/15 focus:border-white/15"
            )}
            aria-label="Search table"
          />
        </div>
      )}

      {/* Table container */}
      <div className="rounded-lg border border-white/6 overflow-hidden">
        <div className={stickyHeader ? "overflow-auto" : undefined}>
          <table className="w-full border-collapse">
            {/* Header */}
            <thead
              className={cn(
                "bg-white/[0.02]",
                stickyHeader && "sticky top-0 z-10 bg-bg-200"
              )}
            >
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort =
                      enableSorting && header.column.getCanSort();
                    const sorted = header.column.getIsSorted();

                    return (
                      <th
                        key={header.id}
                        className={cn(
                          "px-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider",
                          tableCellVariants({ density }),
                          canSort &&
                            "cursor-pointer hover:text-white/60 select-none"
                        )}
                        style={
                          header.column.columnDef.size
                            ? { width: header.column.columnDef.size }
                            : undefined
                        }
                        onClick={
                          canSort
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        <span className="inline-flex items-center gap-1">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {canSort && (
                            <span className="inline-flex" aria-hidden="true">
                              {sorted === "asc" ? (
                                <ArrowUp size={14} />
                              ) : sorted === "desc" ? (
                                <ArrowDown size={14} />
                              ) : (
                                <ArrowUpDown size={14} />
                              )}
                            </span>
                          )}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            {/* Body */}
            <tbody>
              {loading ? (
                // Loading skeleton rows — single full-width skeleton per row
                Array.from({ length: 5 }).map((_, rowIdx) => (
                  <tr
                    key={`skeleton-${rowIdx}`}
                    className={cn(tableRowVariants({ variant }))}
                  >
                    <td
                      colSpan={finalColumns.length}
                      className={tableCellVariants({ density })}
                    >
                      <Skeleton variant="text" height={16} />
                    </td>
                  </tr>
                ))
              ) : rows.length === 0 ? (
                // Empty state
                <tr>
                  <td
                    colSpan={finalColumns.length}
                    className="text-center text-white/40 py-12"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                // Data rows
                rows.map((row, rowIndex) => {
                  const isSelected = row.getIsSelected();
                  const isStripedOdd =
                    variant === "striped" && rowIndex % 2 === 1;

                  return (
                    <tr
                      key={row.id}
                      className={cn(
                        tableRowVariants({ variant }),
                        isSelected && "bg-accent/5",
                        isStripedOdd && "bg-white/[0.02]",
                        onRowClick && "cursor-pointer"
                      )}
                      onClick={() => onRowClick?.(row.original)}
                      data-selected={isSelected || undefined}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={tableCellVariants({ density })}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {showPagination && enablePagination && !loading && rows.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/6">
            {/* Left: info */}
            <span className="text-xs text-white/40">
              Showing {from} to {to} of {totalRows} results
            </span>

            {/* Right: controls */}
            <div className="flex items-center gap-2">
              {/* Page size selector */}
              <select
                value={currentPagination.pageSize}
                onChange={(e) => {
                  const size = Number(e.target.value);
                  const next: PaginationState = {
                    pageIndex: 0,
                    pageSize: size,
                  };
                  onPaginationChange
                    ? onPaginationChange(next)
                    : setInternalPagination(next);
                }}
                className="bg-white/5 border border-white/6 rounded-md h-8 px-2 text-xs text-white/60 outline-none"
                aria-label="Page size"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
                ))}
              </select>

              {/* Previous */}
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className={cn(
                  "h-8 w-8 rounded-md text-xs text-white/60 hover:bg-white/5 inline-flex items-center justify-center",
                  "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                )}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Page indicator */}
              <span className="text-xs text-white/60">
                {currentPagination.pageIndex + 1} /{" "}
                {table.getPageCount() || 1}
              </span>

              {/* Next */}
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className={cn(
                  "h-8 w-8 rounded-md text-xs text-white/60 hover:bg-white/5 inline-flex items-center justify-center",
                  "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                )}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

DataTable.displayName = "DataTable";

export { DataTable, tableRowVariants, tableCellVariants };
export type { DataTableProps, DataTableVariant, DataTableDensity };
