"use client";

import { forwardRef, useMemo, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "../utils/cn";

/* --- CVA Variants ------------------------------------ */

const paginationButtonVariants = cva(
  [
    "rounded-md text-white/60 hover:bg-white/5 hover:text-white",
    "transition-colors inline-flex items-center justify-center",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
  ],
  {
    variants: {
      size: {
        sm: "h-7 w-7 text-xs",
        md: "h-9 w-9 text-sm",
        lg: "h-11 w-11 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const ELLIPSIS = "ellipsis";

/* --- Page Range Algorithm ---------------------------- */

function generatePageRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | typeof ELLIPSIS)[] {
  // Total page numbers to show: first + last + current + 2*siblings + 2 ellipses
  const totalPageNumbers = siblingCount * 2 + 5;

  // If total pages fit without ellipsis
  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    // Show pages from start: [1, 2, 3, 4, 5, ..., totalPages]
    const leftCount = siblingCount * 2 + 3;
    const leftRange = Array.from({ length: leftCount }, (_, i) => i + 1);
    return [...leftRange, ELLIPSIS, totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    // Show pages from end: [1, ..., 6, 7, 8, 9, 10]
    const rightCount = siblingCount * 2 + 3;
    const rightRange = Array.from(
      { length: rightCount },
      (_, i) => totalPages - rightCount + 1 + i
    );
    return [1, ELLIPSIS, ...rightRange];
  }

  // Both ellipses: [1, ..., 4, 5, 6, ..., 10]
  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [1, ELLIPSIS, ...middleRange, ELLIPSIS, totalPages];
}

/* --- Pagination Component ---------------------------- */

export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, "onChange"> &
  VariantProps<typeof paginationButtonVariants> & {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    showFirstLast?: boolean;
    showPrevNext?: boolean;
    disabled?: boolean;
  };

const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      className,
      size = "md",
      currentPage,
      totalPages,
      onPageChange,
      siblingCount = 1,
      showFirstLast = true,
      showPrevNext = true,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const pages = useMemo(
      () => generatePageRange(currentPage, totalPages, siblingCount),
      [currentPage, totalPages, siblingCount]
    );

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const buttonBase = (extraClass?: string) =>
      cn(paginationButtonVariants({ size }), extraClass);

    return (
      <nav
        ref={ref}
        data-slot="pagination"
        aria-label="Pagination"
        className={cn("flex items-center gap-1", className)}
        {...props}
      >
        {showFirstLast && (
          <button
            type="button"
            className={buttonBase()}
            onClick={() => onPageChange(1)}
            disabled={disabled || isFirstPage}
            aria-label="Go to first page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        )}

        {showPrevNext && (
          <button
            type="button"
            className={buttonBase()}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={disabled || isFirstPage}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {pages.map((page, index) => {
          if (page === ELLIPSIS) {
            return (
              <span
                key={`ellipsis-${index}`}
                className={cn(
                  paginationButtonVariants({ size }),
                  "text-white/60 cursor-default hover:bg-transparent hover:text-white/60"
                )}
                role="presentation"
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              className={buttonBase(
                isActive ? "bg-white/10 text-white font-medium" : undefined
              )}
              onClick={() => onPageChange(page)}
              disabled={disabled}
              aria-current={isActive ? "page" : undefined}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          );
        })}

        {showPrevNext && (
          <button
            type="button"
            className={buttonBase()}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={disabled || isLastPage}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {showFirstLast && (
          <button
            type="button"
            className={buttonBase()}
            onClick={() => onPageChange(totalPages)}
            disabled={disabled || isLastPage}
            aria-label="Go to last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        )}
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";

export { Pagination, paginationButtonVariants };
