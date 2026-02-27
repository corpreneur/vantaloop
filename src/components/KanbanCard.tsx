/*
 * Design: "Clean Slate" -- Monochrome Workspace with Warm Accents
 * Individual feedback card on the Kanban board.
 * Enhancements: feedback type tags (#9), stale indicator (#10), comment count (#2).
 */

import { EPICS, FEEDBACK_TAGS, isCardStale, type FeedbackCard } from "@/lib/data";
import { MessageSquare, AlertCircle, CheckCircle2, Clock } from "lucide-react";

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
  const stale = isCardStale(card);

  return (
    <button
      onClick={() => onClick(card)}
      className="w-full text-left group"
    >
      <div
        className={`relative bg-card rounded-md border p-4 transition-all duration-150 group-hover:border-foreground/40 group-hover:shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${
          stale ? "border-destructive/40" : "border-border"
        }`}
        style={{ borderLeftWidth: "3px", borderLeftColor: epic?.color }}
      >
        {/* Stale indicator (#10) */}
        {stale && (
          <div className="flex items-center gap-1.5 mb-2 px-1.5 py-0.5 bg-destructive/8 rounded-sm w-fit">
            <Clock size={10} strokeWidth={2} className="text-destructive" />
            <span className="text-[9px] font-medium text-destructive uppercase tracking-wide">
              Stale -- 5+ days
            </span>
          </div>
        )}

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
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2">
          {card.goalOfShare}
        </p>

        {/* Feedback type tags (#9) */}
        {card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {card.tags.map((tagId) => {
              const tag = FEEDBACK_TAGS.find((t) => t.id === tagId);
              if (!tag) return null;
              return (
                <span
                  key={tagId}
                  className="text-[9px] px-1.5 py-0.5 rounded-sm bg-secondary text-muted-foreground border border-border/60"
                >
                  {tag.label}
                </span>
              );
            })}
          </div>
        )}

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

          {/* Comment count (#2) */}
          {card.comments.length > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare size={11} strokeWidth={1.5} className="fill-muted-foreground/20" />
              <span className="text-[10px]">{card.comments.length}</span>
            </div>
          )}

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
