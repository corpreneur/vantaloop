/*
 * Design: "Clean Slate" -- Monochrome Workspace with Warm Accents
 * Timeline / Activity view (#3).
 * Shows a chronological arc of all feedback activity across epics.
 * Useful for William and Glenn to see velocity and bottlenecks.
 */

import { EPICS, COLUMNS, FEEDBACK_TAGS, isCardStale, type FeedbackCard } from "@/lib/data";
import { Clock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface TimelineViewProps {
  cards: FeedbackCard[];
  onCardClick: (card: FeedbackCard) => void;
}

export default function TimelineView({ cards, onCardClick }: TimelineViewProps) {
  // Sort by updatedAt descending
  const sorted = [...cards].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  // Group by date
  const grouped: Record<string, FeedbackCard[]> = {};
  sorted.forEach((card) => {
    const date = card.updatedAt.split("T")[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(card);
  });

  const dateKeys = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const formatDate = (d: string) => {
    const date = new Date(d + "T00:00:00");
    const today = new Date("2026-02-26T00:00:00");
    const diff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="font-display text-2xl text-foreground mb-1">Timeline</h2>
          <p className="text-sm text-muted-foreground">
            Chronological view of all feedback activity across epics. {sorted.length} items total.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border" />

          {dateKeys.map((date, dateIdx) => (
            <div key={date} className="mb-8">
              {/* Date header */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: dateIdx * 0.05 }}
                className="flex items-center gap-3 mb-4 relative"
              >
                <div className="w-[31px] h-[31px] rounded-full bg-foreground text-background flex items-center justify-center z-10 shrink-0">
                  <Clock size={13} strokeWidth={1.5} />
                </div>
                <span className="label-meta text-foreground">{formatDate(date)}</span>
                <span className="text-[10px] text-muted-foreground/40">{date}</span>
              </motion.div>

              {/* Cards for this date */}
              <div className="ml-[40px] space-y-3">
                {grouped[date].map((card, i) => {
                  const epic = EPICS.find((e) => e.id === card.epicId);
                  const column = COLUMNS.find((c) => c.id === card.columnId);
                  const stale = isCardStale(card);

                  return (
                    <motion.button
                      key={card.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: dateIdx * 0.05 + i * 0.03 }}
                      onClick={() => onCardClick(card)}
                      className="w-full text-left group"
                    >
                      <div
                        className={`bg-card border rounded-md p-4 transition-all duration-150 group-hover:border-foreground/40 group-hover:shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${
                          stale ? "border-destructive/40" : "border-border"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: epic?.color }}
                              />
                              <span className="label-meta text-muted-foreground">{epic?.id}</span>
                              <ArrowRight size={10} className="text-muted-foreground/30" />
                              <span className="label-meta text-muted-foreground">{column?.title}</span>
                              {stale && (
                                <span className="text-[9px] text-destructive font-medium uppercase tracking-wide ml-1">Stale</span>
                              )}
                            </div>
                            <h3 className="text-sm font-medium text-foreground mb-1">{card.title}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-1">{card.goalOfShare}</p>

                            {/* Tags */}
                            {card.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {card.tags.map((tagId) => {
                                  const tag = FEEDBACK_TAGS.find((t) => t.id === tagId);
                                  return tag ? (
                                    <span key={tagId} className="text-[9px] px-1.5 py-0.5 rounded-sm bg-secondary text-muted-foreground border border-border/60">
                                      {tag.label}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className={`label-meta px-1.5 py-0.5 rounded-sm ${
                              card.priority === "P0" ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                            }`}>
                              {card.priority}
                            </span>
                            {card.decision && (
                              <div className="flex items-center gap-1 text-accent">
                                <CheckCircle2 size={11} strokeWidth={1.5} />
                                <span className="text-[9px] font-medium">Decided</span>
                              </div>
                            )}
                            {card.comments.length > 0 && (
                              <span className="text-[10px] text-muted-foreground">{card.comments.length} comments</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
