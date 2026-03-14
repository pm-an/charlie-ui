"use client";

import {
  type HTMLAttributes,
  type ReactNode,
  useRef,
  useState,
  useCallback,
} from "react";
import { cn } from "../utils/cn";
import { Spinner } from "./Spinner";

const scrollbarClasses = [
  "[&::-webkit-scrollbar]:w-1.5",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:bg-white/10",
  "[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&::-webkit-scrollbar-thumb:hover]:bg-white/20",
];

type VirtualListProps<T> = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  items: T[];
  height: number | string;
  itemHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  loading?: boolean;
  loadingContent?: ReactNode;
  emptyContent?: ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
};

function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 5,
  onEndReached,
  endReachedThreshold = 200,
  loading = false,
  loadingContent,
  emptyContent,
  getItemKey,
  className,
  style,
  ...props
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const endReachedFiredRef = useRef(false);

  const totalHeight = items.length * itemHeight;

  const viewportHeight =
    containerRef.current?.clientHeight ??
    (typeof height === "number" ? height : 400);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + viewportHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      setScrollTop(target.scrollTop);

      if (onEndReached) {
        const distanceFromBottom =
          totalHeight - (target.scrollTop + target.clientHeight);
        if (distanceFromBottom < endReachedThreshold) {
          if (!endReachedFiredRef.current) {
            endReachedFiredRef.current = true;
            onEndReached();
          }
        } else {
          endReachedFiredRef.current = false;
        }
      }
    },
    [onEndReached, totalHeight, endReachedThreshold]
  );

  if (items.length === 0) {
    return (
      <div
        data-slot="virtual-list"
        className={cn(
          "flex items-center justify-center text-white/50",
          className
        )}
        style={{ height, ...style }}
        role="list"
        {...props}
      >
        {emptyContent ?? "No items"}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      data-slot="virtual-list"
      onScroll={handleScroll}
      className={cn("overflow-auto", scrollbarClasses, className)}
      style={{ height, ...style }}
      role="list"
      {...props}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{ position: "absolute", top: offsetY, left: 0, right: 0 }}
        >
          {visibleItems.map((item, i) => {
            const actualIndex = startIndex + i;
            const key = getItemKey
              ? getItemKey(item, actualIndex)
              : actualIndex;
            return (
              <div key={key} style={{ height: itemHeight }} role="listitem">
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-4">
          {loadingContent ?? (
            <Spinner size="sm" color="currentColor" />
          )}
        </div>
      )}
    </div>
  );
}

export { VirtualList };
export type { VirtualListProps };
