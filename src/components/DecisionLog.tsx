/*
 * Design: "Clean Slate" -- Monochrome Workspace with Warm Accents
 * Decision Log view (#8).
 * Filtered view showing only cards that have reached "Decision Made",
 * with the rationale prominently displayed.
 * Becomes the institutional memory of the design partnership.
 */

import { EPICS, type FeedbackCard } from "@/lib/data";
import { Gavel, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface DecisionLogProps {
  cards: FeedbackCard[];
  onCardClick: (card: FeedbackCard) => void;
}

export default function DecisionLog({ cards, onCardClick }: DecisionLogProps) {
  // Only show cards with decisions
  const decided = cards.filter((c) => !!c.decision);
  const undecided = cards.filter((c) => !c.decision && c.columnId !== "archived");

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="font-display text-2xl text-foreground mb-1">Decision Log</h2>
          <p className="text-sm text-muted-foreground">
            Institutional memory of design decisions. {decided.length} decisions recorded, {undecided.length} items pending.
          </p>
        </div>

        {/* Decided cards */}
        {decided.length > 0 && (
          <div className="space-y-4 mb-10">
            <h3 className="label-meta text-foreground flex items-center gap-2">
              <Gavel size={13} strokeWidth={1.5} />
              Decisions Recorded
            </h3>
            {decided.map((card, i) => {
              const epic = EPICS.find((e) => e.id === card.epicId);
              return (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => onCardClick(card)}
                  className="w-full text-left group"
                >
                  <div className="bg-card border border-border rounded-md p-5 transition-all duration-150 group-hover:border-foreground/40 group-hover:shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    {/* Card header */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: epic?.color }}
                      />
                      <span className="label-meta text-muted-foreground">{epic?.id} / {epic?.name}</span>
                      <span className="text-muted-foreground/30 mx-1">|</span>
                      <span className="label-meta text-muted-foreground/60">{card.createdAt}</span>
                    </div>

                    <h3 className="text-base font-medium text-foreground mb-2">{card.title}</h3>

                    {/* Decision */}
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 size={14} strokeWidth={1.5} className="text-accent shrink-0" />
                      <span className="text-sm font-medium text-foreground">{card.decision}</span>
                    </div>

                    {/* Rationale */}
                    {card.decisionRationale && (
                      <div className="p-3 bg-[oklch(0.96_0.03_55)] rounded-md border border-accent/20">
                        <p className="label-meta text-accent mb-1">Rationale</p>
                        <p className="text-sm text-foreground leading-relaxed">{card.decisionRationale}</p>
                      </div>
                    )}

                    {/* Goal context */}
                    <div className="mt-3 pt-3 border-t border-border/60">
                      <p className="text-xs text-muted-foreground/60 mb-0.5">Original goal</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{card.goalOfShare}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Pending decisions */}
        {undecided.length > 0 && (
          <div className="space-y-3">
            <h3 className="label-meta text-muted-foreground flex items-center gap-2">
              <ArrowRight size={13} strokeWidth={1.5} />
              Pending Decisions ({undecided.length})
            </h3>
            {undecided.map((card, i) => {
              const epic = EPICS.find((e) => e.id === card.epicId);
              return (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.03 }}
                  onClick={() => onCardClick(card)}
                  className="w-full text-left group"
                >
                  <div className="bg-card border border-border rounded-md p-4 transition-all duration-150 group-hover:border-foreground/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: epic?.color }}
                        />
                        <span className="text-sm font-medium text-foreground">{card.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`label-meta px-1.5 py-0.5 rounded-sm ${
                          card.priority === "P0" ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                        }`}>
                          {card.priority}
                        </span>
                        <span className="label-meta text-muted-foreground/60">{card.columnId.replace("-", " ")}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-4">{card.decisionNeeded}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {decided.length === 0 && undecided.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-muted-foreground/40">No items to display</p>
          </div>
        )}
      </div>
    </div>
  );
}
