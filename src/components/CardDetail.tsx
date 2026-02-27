/*
 * Design: "Clean Slate" -- Monochrome Workspace with Warm Accents
 * Full-width overlay for expanded card detail view.
 * Shows all structured feedback fields from the template.
 * Fade-in overlay at 200ms with content stagger.
 */

import { EPICS, COLUMNS, FEEDBACK_TAGS, isCardStale, TEAM_MEMBERS, type FeedbackCard, type Comment } from "@/lib/data";
import CommentThread from "@/components/CommentThread";
import { X, CheckCircle2, Circle, AlertTriangle, Lightbulb, Target, Eye, Route, Gavel } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/useMobile";

interface CardDetailProps {
  card: FeedbackCard | null;
  onClose: () => void;
  onAddComment?: (cardId: string, text: string) => void;
}

export default function CardDetail({ card, onClose, onAddComment }: CardDetailProps) {
  const isMobile = useIsMobile();
  if (!card) return null;

  const epic = EPICS.find((e) => e.id === card.epicId);
  const column = COLUMNS.find((c) => c.id === card.columnId);

  return (
    <AnimatePresence>
      {card && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 md:bg-black/20 z-[60]"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 40, y: isMobile ? 20 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: isMobile ? 0 : 40, y: isMobile ? 20 : 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 md:inset-auto md:right-0 md:top-0 md:bottom-0 md:w-full md:max-w-[640px] bg-background md:border-l border-border z-[70] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border px-4 md:px-6 py-4 flex items-start justify-between z-10">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: epic?.color }}
                  />
                  <span className="label-meta text-muted-foreground">
                    {epic?.id} / {epic?.name}
                  </span>
                </div>
                <h2 className="font-display text-xl md:text-2xl text-foreground leading-tight">
                  {card.title}
                </h2>
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
                {isCardStale(card) && (
                  <div className="mt-1.5 flex items-center gap-1 text-destructive">
                    <AlertTriangle size={11} strokeWidth={1.5} />
                    <span className="text-[9px] font-medium uppercase tracking-wide">Stale -- needs attention</span>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2">
                  <span className="label-meta text-muted-foreground/60">
                    {column?.title}
                  </span>
                  <span className="text-muted-foreground/30">|</span>
                  <span className="label-meta text-muted-foreground/60">
                    {card.priority}
                  </span>
                  <span className="text-muted-foreground/30">|</span>
                  <span className="label-meta text-muted-foreground/60">
                    {card.createdAt}
                  </span>
                  {card.assignee && (
                    <>
                      <span className="text-muted-foreground/30">|</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center">
                          <span className="text-[8px] font-medium">
                            {card.assignee.initials}
                          </span>
                        </div>
                        <span className="label-meta text-muted-foreground/60">
                          {card.assignee.name}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150 shrink-0 ml-4"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 md:px-6 py-6 space-y-8">
              {/* Goal of this share */}
              <Section
                icon={<Target size={15} strokeWidth={1.5} />}
                title="Goal of this share"
                delay={0}
              >
                <p className="text-sm text-foreground leading-relaxed">
                  {card.goalOfShare}
                </p>
              </Section>

              {/* What's working */}
              <Section
                icon={<CheckCircle2 size={15} strokeWidth={1.5} />}
                title="What's working"
                delay={0.05}
              >
                <ul className="space-y-1.5">
                  {card.whatsWorking.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground leading-relaxed"
                    >
                      <span className="text-muted-foreground/40 mt-1.5 shrink-0">
                        --
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Section>

              {/* Questions / Risks */}
              <Section
                icon={<AlertTriangle size={15} strokeWidth={1.5} />}
                title="Questions / Risks"
                delay={0.1}
              >
                <ul className="space-y-1.5">
                  {card.questionsRisks.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground leading-relaxed"
                    >
                      <span className="text-muted-foreground/40 mt-1.5 shrink-0">
                        --
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Section>

              {/* Suggestions */}
              <Section
                icon={<Lightbulb size={15} strokeWidth={1.5} />}
                title="Suggestions"
                delay={0.15}
              >
                <ul className="space-y-1.5">
                  {card.suggestions.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground leading-relaxed"
                    >
                      <span className="text-muted-foreground/40 mt-1.5 shrink-0">
                        --
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Section>

              {/* Decision needed */}
              <Section
                icon={<Target size={15} strokeWidth={1.5} />}
                title="Decision needed today"
                delay={0.2}
              >
                <p className="text-sm text-foreground font-medium">
                  {card.decisionNeeded}
                </p>
              </Section>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Critical questions */}
              <Section
                icon={<AlertTriangle size={15} strokeWidth={1.5} />}
                title="Critical questions"
                delay={0.25}
              >
                <div className="space-y-2">
                  {(
                    [
                      "Is this the right problem?",
                      "Which concept direction is strongest?",
                      "What are the biggest risks?",
                      "What should we prototype next?",
                    ] as const
                  ).map((q) => {
                    const isSelected = card.criticalQuestions.includes(q);
                    return (
                      <div
                        key={q}
                        className="flex items-center gap-2.5"
                      >
                        {isSelected ? (
                          <CheckCircle2
                            size={14}
                            strokeWidth={1.5}
                            className="text-accent shrink-0"
                          />
                        ) : (
                          <Circle
                            size={14}
                            strokeWidth={1.5}
                            className="text-muted-foreground/30 shrink-0"
                          />
                        )}
                        <span
                          className={`text-sm ${
                            isSelected
                              ? "text-foreground"
                              : "text-muted-foreground/40"
                          }`}
                        >
                          {q}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Section>

              {/* Clarity + Value */}
              <Section
                icon={<Eye size={15} strokeWidth={1.5} />}
                title="Clarity + Value"
                delay={0.3}
              >
                <div className="space-y-3">
                  <FieldRow label="What's clear" value={card.whatsClear} />
                  <FieldRow
                    label="What's confusing"
                    value={card.whatsConfusing}
                  />
                  <FieldRow label="The hook" value={card.hookValue} />
                </div>
              </Section>

              {/* Flow at 10,000 feet */}
              <Section
                icon={<Route size={15} strokeWidth={1.5} />}
                title="Flow at 10,000 feet"
                delay={0.35}
              >
                <div className="space-y-4">
                  <div>
                    <p className="label-meta text-muted-foreground mb-2">
                      Happy path
                    </p>
                    <div className="space-y-1">
                      {card.happyPath.map((step, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-foreground"
                        >
                          <span className="label-meta text-muted-foreground/40 mt-0.5 w-4 text-right shrink-0">
                            {i + 1}
                          </span>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="label-meta text-muted-foreground mb-2">
                      Hesitation points
                    </p>
                    <ul className="space-y-1">
                      {card.hesitationPoints.map((point, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-foreground"
                        >
                          <span className="text-muted-foreground/40 mt-1.5 shrink-0">
                            --
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Section>

              {/* Decision */}
              <div className="border-t border-border" />
              <Section
                icon={<Gavel size={15} strokeWidth={1.5} />}
                title="Decision"
                delay={0.4}
              >
                <div className="space-y-3">
                  {(
                    [
                      "Proceed with concept A",
                      "Proceed with concept B",
                      "Combine A + B",
                      "Pause, redefine problem",
                    ] as const
                  ).map((d) => {
                    const isSelected = card.decision === d;
                    return (
                      <div
                        key={d}
                        className="flex items-center gap-2.5"
                      >
                        {isSelected ? (
                          <CheckCircle2
                            size={14}
                            strokeWidth={1.5}
                            className="text-accent shrink-0"
                          />
                        ) : (
                          <Circle
                            size={14}
                            strokeWidth={1.5}
                            className="text-muted-foreground/30 shrink-0"
                          />
                        )}
                        <span
                          className={`text-sm ${
                            isSelected
                              ? "text-foreground font-medium"
                              : "text-muted-foreground/40"
                          }`}
                        >
                          {d}
                        </span>
                      </div>
                    );
                  })}

                  {card.decisionRationale && (
                    <div className="mt-3 p-3 bg-[oklch(0.96_0.03_55)] rounded-md border border-accent/20">
                      <p className="label-meta text-accent mb-1">Rationale</p>
                      <p className="text-sm text-foreground leading-relaxed">
                        {card.decisionRationale}
                      </p>
                    </div>
                  )}

                  {!card.decision && (
                    <p className="text-sm text-muted-foreground/50 italic">
                      No decision recorded yet
                    </p>
                  )}
                </div>
              </Section>

              {/* Comments (#2) */}
              <div className="border-t border-border" />
              <Section
                icon={<span className="text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>}
                title={`Comments (${card.comments.length})`}
                delay={0.45}
              >
                <CommentThread
                  comments={card.comments}
                  onAddComment={(text) => onAddComment?.(card.id, text)}
                />
              </Section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---- Helper components ---- */

function Section({
  icon,
  title,
  delay,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-muted-foreground">{icon}</span>
        <h3 className="label-meta text-foreground">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground/60 mb-0.5">{label}</p>
      <p className="text-sm text-foreground leading-relaxed">{value}</p>
    </div>
  );
}
