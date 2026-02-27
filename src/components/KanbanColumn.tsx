/*
 * Design: "Clean Slate" -- Monochrome Workspace with Warm Accents
 * A single Kanban column with header, card count, and card list.
 * Column headers: left-aligned, thin underline, uppercase metadata label.
 */

import type { Column, FeedbackCard } from "@/lib/data";
import KanbanCard from "./KanbanCard";
import { Plus } from "lucide-react";

interface KanbanColumnProps {
  column: Column;
  cards: FeedbackCard[];
  onCardClick: (card: FeedbackCard) => void;
}

export default function KanbanColumn({
  column,
  cards,
  onCardClick,
}: KanbanColumnProps) {
  return (
    <div className="w-[260px] md:w-[300px] shrink-0 flex flex-col h-full">
      {/* Column header */}
      <div className="px-2 pb-3 border-b border-foreground/10 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="label-meta text-foreground">{column.title}</h2>
            <span className="text-[10px] text-muted-foreground/60 font-medium tabular-nums">
              {cards.length}
            </span>
          </div>
          <button className="p-1 rounded-md text-muted-foreground/40 hover:text-foreground hover:bg-secondary transition-colors duration-150">
            <Plus size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Card list */}
      <div className="flex-1 overflow-y-auto space-y-2.5 px-0.5 pb-4">
        {cards.map((card) => (
          <KanbanCard key={card.id} card={card} onClick={onCardClick} />
        ))}

        {cards.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-xs text-muted-foreground/40">No items</p>
          </div>
        )}
      </div>
    </div>
  );
}
