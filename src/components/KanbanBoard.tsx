import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { Plus } from "lucide-react";

export type KanbanCard = {
  id: string;
  title: string;
  description?: string;
  tags?: { label: string; color?: string }[];
  assignee?: { name: string; avatar?: string };
};

export type KanbanColumn = {
  id: string;
  title: string;
  color?: string;
  cards: KanbanCard[];
};

export type KanbanBoardProps = HTMLAttributes<HTMLDivElement> & {
  columns: KanbanColumn[];
  onCardClick?: (columnId: string, cardId: string) => void;
  onAddCard?: (columnId: string) => void;
};

const tagColors: Record<string, string> = {
  red: "bg-red-muted text-red",
  blue: "bg-blue-muted text-blue",
  green: "bg-green-muted text-green",
  yellow: "bg-yellow-muted text-yellow",
  purple: "bg-purple/15 text-purple",
  orange: "bg-orange/15 text-orange",
  pink: "bg-pink-400/15 text-pink-400",
};

const columnDotColors: Record<string, string> = {
  red: "bg-red",
  blue: "bg-blue",
  green: "bg-green",
  yellow: "bg-yellow",
  purple: "bg-purple",
  orange: "bg-orange",
  pink: "bg-pink-400",
};

const KanbanBoard = forwardRef<HTMLDivElement, KanbanBoardProps>(
  ({ className, columns, onCardClick, onAddCard, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="kanban-board"
        role="region"
        aria-label="Kanban board"
        className={cn(
          "overflow-x-auto flex gap-4 p-4",
          className
        )}
        {...props}
      >
        {columns.map((column) => (
          <div
            key={column.id}
            role="group"
            aria-label={`${column.title} column, ${column.cards.length} cards`}
            className="min-w-[280px] w-[280px] flex-shrink-0 flex flex-col"
          >
            {/* Column header */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                {column.color && (
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      columnDotColors[column.color] || "bg-white/40"
                    )}
                  />
                )}
                <h3 className="text-sm font-medium text-white">{column.title}</h3>
                <span className="inline-flex items-center rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/60">
                  {column.cards.length}
                </span>
              </div>
              {onAddCard && (
                <button
                  type="button"
                  onClick={() => onAddCard(column.id)}
                  className="p-1 text-white/60 hover:text-white/80 transition-colors rounded hover:bg-white/5"
                  aria-label={`Add card to ${column.title}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Card list */}
            <div className="flex-1 space-y-3">
              {column.cards.map((card) => (
                <div
                  key={card.id}
                  role={onCardClick ? "button" : undefined}
                  tabIndex={onCardClick ? 0 : undefined}
                  onClick={() => onCardClick?.(column.id, card.id)}
                  onKeyDown={(e) => {
                    if (onCardClick && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      onCardClick(column.id, card.id);
                    }
                  }}
                  className={cn(
                    "bg-card-gradient rounded-lg border border-white/[0.06] p-3 transition-colors",
                    onCardClick && "cursor-pointer hover:border-white/15"
                  )}
                >
                  <p className="text-sm font-medium text-white">{card.title}</p>
                  {card.description && (
                    <p className="text-xs text-white/60 mt-1 line-clamp-2">
                      {card.description}
                    </p>
                  )}
                  {/* Bottom row: tags + assignee */}
                  {(card.tags?.length || card.assignee) && (
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-1 flex-wrap">
                        {card.tags?.map((tag) => (
                          <span
                            key={tag.label}
                            className={cn(
                              "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium",
                              tag.color && tagColors[tag.color]
                                ? tagColors[tag.color]
                                : "bg-white/5 text-white/60"
                            )}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                      {card.assignee && (
                        <div className="h-6 w-6 rounded-full bg-white/10 shrink-0 flex items-center justify-center overflow-hidden" title={card.assignee.name}>
                          {card.assignee.avatar ? (
                            <img
                              src={card.assignee.avatar}
                              alt={card.assignee.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] font-medium text-white/60">
                              {card.assignee.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

KanbanBoard.displayName = "KanbanBoard";

export { KanbanBoard };
