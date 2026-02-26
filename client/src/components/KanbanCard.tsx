/*
 * Design: "Clean Slate" -- Monochrome Workspace with Warm Accents
 * Individual feedback card on the Kanban board.
 * Warm gray surface (#F5F5F0), 1px border, left accent for epic color.
 * Hover: border transitions from light gray to black over 150ms.
 */

import { EPICS, type FeedbackCard } from "@/lib/data";
import { MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react";

interface KanbanCardProps {
  card: FeedbackCard;
  onClick: (card: FeedbackCard) => void;
}

const PRIORITY_LABELS: Record<string, { label: string; style: string }> = {
  P0: { label: "P0", style: "bg-foreground text-background" },
  P1: { label: "P1", style: "bg-muted-foreground/20 text-foreground" },
  P2: { label: "P2", style: "bg-muted text-muted-foreground" },
  P3: { label: "P3", style: "bg-muted text-muted-foreground/60" },
};

export default function KanbanCard({ card, onClick }: KanbanCardProps) {
  const epic = EPICS.find((e) => e.id === card.epicId);
  const priority = PRIORITY_LABELS[card.priority];
  const feedbackCount =
    card.whatsWorking.length +
    card.questionsRisks.length +
    card.suggestions.length;
  const hasDecision = !!card.decision;

  return (
    <button
      onClick={() => onClick(card)}
      className="w-full text-left group"
    >
      <div
        className="relative bg-card rounded-md border border-border p-4 transition-all duration-150 group-hover:border-foreground/40 group-hover:shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        style={{ borderLeftWidth: "3px", borderLeftColor: epic?.color }}
      >
        {/* Epic tag + Priority */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="label-meta text-muted-foreground">
            {epic?.id}
          </span>
          <span
            className={`label-meta px-1.5 py-0.5 rounded-sm ${priority.style}`}
          >
            {priority.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-foreground leading-snug mb-2">
          {card.title}
        </h3>

        {/* Goal preview */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {card.goalOfShare}
        </p>

        {/* Footer: metadata */}
        <div className="flex items-center gap-3 pt-2 border-t border-border/60">
          {/* Assignee */}
          {card.assignee && (
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center">
                <span className="text-[8px] font-medium">
                  {card.assignee.initials}
                </span>
              </div>
            </div>
          )}

          {/* Feedback count */}
          <div className="flex items-center gap-1 text-muted-foreground">
            <MessageSquare size={11} strokeWidth={1.5} />
            <span className="text-[10px]">{feedbackCount}</span>
          </div>

          {/* Critical questions count */}
          {card.criticalQuestions.length > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <AlertCircle size={11} strokeWidth={1.5} />
              <span className="text-[10px]">
                {card.criticalQuestions.length}
              </span>
            </div>
          )}

          {/* Decision indicator */}
          {hasDecision && (
            <div className="flex items-center gap-1 text-accent ml-auto">
              <CheckCircle2 size={11} strokeWidth={1.5} />
              <span className="text-[10px] font-medium">Decided</span>
            </div>
          )}

          {/* Date */}
          <span className="text-[10px] text-muted-foreground/60 ml-auto">
            {card.createdAt}
          </span>
        </div>
      </div>
    </button>
  );
}
