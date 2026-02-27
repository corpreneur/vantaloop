/*
 * Design: "Clean Slate" -- Monochrome Workspace with Warm Accents
 * Main Kanban board with horizontally scrolling columns.
 * Filters cards by selected epics from the sidebar.
 */

import { COLUMNS, type FeedbackCard, type EpicId } from "@/lib/data";
import KanbanColumn from "./KanbanColumn";

interface KanbanBoardProps {
  cards: FeedbackCard[];
  selectedEpics: EpicId[];
  onCardClick: (card: FeedbackCard) => void;
}

export default function KanbanBoard({
  cards,
  selectedEpics,
  onCardClick,
}: KanbanBoardProps) {
  const filteredCards =
    selectedEpics.length === 0
      ? cards
      : cards.filter((c) => selectedEpics.includes(c.epicId));

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="flex gap-4 p-4 md:p-6 h-full min-h-0">
        {COLUMNS.map((column) => {
          const columnCards = filteredCards.filter(
            (c) => c.columnId === column.id
          );
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={columnCards}
              onCardClick={onCardClick}
            />
          );
        })}
      </div>
    </div>
  );
}
