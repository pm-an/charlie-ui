import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { KanbanBoard, type KanbanColumn } from "../KanbanBoard";
import { expectNoA11yViolations } from "../../test/a11y";

const sampleColumns: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    color: "blue",
    cards: [
      {
        id: "1",
        title: "Build login page",
        description: "Create the login form with email and password fields",
        tags: [
          { label: "Frontend", color: "blue" },
          { label: "Auth", color: "red" },
        ],
        assignee: { name: "Alice" },
      },
      {
        id: "2",
        title: "Write unit tests",
        tags: [{ label: "Testing", color: "green" }],
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "green",
    cards: [
      {
        id: "3",
        title: "Setup project",
        assignee: { name: "Bob" },
      },
    ],
  },
];

describe("KanbanBoard", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(<KanbanBoard columns={sampleColumns} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      const { container } = render(<KanbanBoard columns={sampleColumns} />);
      expect(container.firstChild).toHaveAttribute("data-slot", "kanban-board");
    });

    it("applies custom className", () => {
      const { container } = render(
        <KanbanBoard columns={sampleColumns} className="custom" />
      );
      expect(container.firstChild).toHaveClass("custom");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<KanbanBoard ref={ref} columns={sampleColumns} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("renders column titles", () => {
      render(<KanbanBoard columns={sampleColumns} />);
      expect(screen.getByText("To Do")).toBeInTheDocument();
      expect(screen.getByText("Done")).toBeInTheDocument();
    });

    it("renders card count badges", () => {
      render(<KanbanBoard columns={sampleColumns} />);
      expect(screen.getByText("2")).toBeInTheDocument(); // To Do has 2 cards
      expect(screen.getByText("1")).toBeInTheDocument(); // Done has 1 card
    });

    it("renders card titles", () => {
      render(<KanbanBoard columns={sampleColumns} />);
      expect(screen.getByText("Build login page")).toBeInTheDocument();
      expect(screen.getByText("Write unit tests")).toBeInTheDocument();
      expect(screen.getByText("Setup project")).toBeInTheDocument();
    });

    it("renders card descriptions", () => {
      render(<KanbanBoard columns={sampleColumns} />);
      expect(
        screen.getByText("Create the login form with email and password fields")
      ).toBeInTheDocument();
    });

    it("renders tags", () => {
      render(<KanbanBoard columns={sampleColumns} />);
      expect(screen.getByText("Frontend")).toBeInTheDocument();
      expect(screen.getByText("Auth")).toBeInTheDocument();
      expect(screen.getByText("Testing")).toBeInTheDocument();
    });

    it("renders assignee initials when no avatar", () => {
      render(<KanbanBoard columns={sampleColumns} />);
      expect(screen.getByText("A")).toBeInTheDocument(); // Alice
      expect(screen.getByText("B")).toBeInTheDocument(); // Bob
    });
  });

  describe("interactions", () => {
    it("calls onCardClick when a card is clicked", () => {
      const onCardClick = vi.fn();
      render(<KanbanBoard columns={sampleColumns} onCardClick={onCardClick} />);
      fireEvent.click(screen.getByText("Build login page"));
      expect(onCardClick).toHaveBeenCalledWith("todo", "1");
    });

    it("calls onCardClick with correct column and card IDs", () => {
      const onCardClick = vi.fn();
      render(<KanbanBoard columns={sampleColumns} onCardClick={onCardClick} />);
      fireEvent.click(screen.getByText("Setup project"));
      expect(onCardClick).toHaveBeenCalledWith("done", "3");
    });

    it("calls onAddCard when add button is clicked", () => {
      const onAddCard = vi.fn();
      render(<KanbanBoard columns={sampleColumns} onAddCard={onAddCard} />);
      const addButtons = screen.getAllByLabelText(/^Add card to /);
      fireEvent.click(addButtons[0]);
      expect(onAddCard).toHaveBeenCalledWith("todo");
    });

    it("does not render add buttons when onAddCard is not provided", () => {
      render(<KanbanBoard columns={sampleColumns} />);
      expect(screen.queryAllByLabelText(/^Add card to /)).toHaveLength(0);
    });

    it("supports keyboard interaction on cards", () => {
      const onCardClick = vi.fn();
      render(<KanbanBoard columns={sampleColumns} onCardClick={onCardClick} />);
      const cards = screen.getAllByRole("button");
      fireEvent.keyDown(cards[0], { key: "Enter" });
      expect(onCardClick).toHaveBeenCalledWith("todo", "1");
    });
  });

  describe("conditional rendering", () => {
    it("renders column color dot when color is provided", () => {
      const { container } = render(<KanbanBoard columns={sampleColumns} />);
      const dots = container.querySelectorAll(".rounded-full.h-2.w-2");
      expect(dots.length).toBeGreaterThanOrEqual(2);
    });

    it("renders empty columns without cards", () => {
      const emptyColumns: KanbanColumn[] = [
        { id: "empty", title: "Empty Column", cards: [] },
      ];
      render(<KanbanBoard columns={emptyColumns} />);
      expect(screen.getByText("Empty Column")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("does not render description when not provided", () => {
      const columns: KanbanColumn[] = [
        {
          id: "col",
          title: "Column",
          cards: [{ id: "c1", title: "Card without desc" }],
        },
      ];
      render(<KanbanBoard columns={columns} />);
      expect(screen.getByText("Card without desc")).toBeInTheDocument();
    });

    it("does not render tags/assignee row when neither provided", () => {
      const columns: KanbanColumn[] = [
        {
          id: "col",
          title: "Column",
          cards: [{ id: "c1", title: "Simple card" }],
        },
      ];
      const { container } = render(<KanbanBoard columns={columns} />);
      // Card should only have the title paragraph
      const card = container.querySelector(".bg-card-gradient");
      expect(card?.children).toHaveLength(1);
    });
  });

  describe("accessibility", () => {
    it("cards have button role when onCardClick is provided", () => {
      const onCardClick = vi.fn();
      render(<KanbanBoard columns={sampleColumns} onCardClick={onCardClick} />);
      const buttons = screen.getAllByRole("button");
      // 3 cards + potential add buttons
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });

    it("add card buttons have aria-label", () => {
      const onAddCard = vi.fn();
      render(<KanbanBoard columns={sampleColumns} onAddCard={onAddCard} />);
      expect(screen.getByLabelText("Add card to To Do")).toBeInTheDocument();
      expect(screen.getByLabelText("Add card to Done")).toBeInTheDocument();
    });

    it("assignee avatars have title attribute", () => {
      const { container } = render(<KanbanBoard columns={sampleColumns} />);
      const assigneeEls = container.querySelectorAll("[title='Alice']");
      expect(assigneeEls.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("accessibility", () => {
    it("board has role region with aria-label", () => {
      render(<KanbanBoard columns={sampleColumns} />);
      const board = screen.getByRole("region", { name: "Kanban board" });
      expect(board).toBeInTheDocument();
    });

    it("columns have role group with aria-label", () => {
      render(<KanbanBoard columns={sampleColumns} />);
      const groups = screen.getAllByRole("group");
      expect(groups.length).toBe(sampleColumns.length);
      expect(groups[0]).toHaveAttribute("aria-label", expect.stringContaining("To Do column"));
    });

    it("passes axe accessibility checks", async () => {
      const { container } = render(<KanbanBoard columns={sampleColumns} />);
      await expectNoA11yViolations(container);
    });
  });
});
