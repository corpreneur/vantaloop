/*
 * Design: "Clean Slate" -- Monochrome Workspace with Warm Accents
 * New Card creation dialog with structured template pre-filled (#1).
 * Multi-step form guiding the user through feedback fields.
 */

import { useState } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EPICS, FEEDBACK_TAGS, TEAM_MEMBERS, type EpicId, type FeedbackTag, type Priority } from "@/lib/data";
import { toast } from "sonner";

interface NewCardDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewCardData) => void;
}

export interface NewCardData {
  title: string;
  epicId: EpicId;
  priority: Priority;
  tags: FeedbackTag[];
  assigneeIndex: number;
  goalOfShare: string;
  decisionNeeded: string;
  whatsWorking: string;
  questionsRisks: string;
  suggestions: string;
}

const STEPS = [
  { id: 1, title: "Basics", description: "Title, epic, and priority" },
  { id: 2, title: "Goal & Decision", description: "What decision do you need?" },
  { id: 3, title: "Feedback Details", description: "Working, risks, suggestions" },
];

export default function NewCardDialog({ open, onClose, onSubmit }: NewCardDialogProps) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [epicId, setEpicId] = useState<EpicId>("EPIC-01");
  const [priority, setPriority] = useState<Priority>("P1");
  const [tags, setTags] = useState<FeedbackTag[]>([]);
  const [assigneeIndex, setAssigneeIndex] = useState(0);
  const [goalOfShare, setGoalOfShare] = useState("");
  const [decisionNeeded, setDecisionNeeded] = useState("");
  const [whatsWorking, setWhatsWorking] = useState("");
  const [questionsRisks, setQuestionsRisks] = useState("");
  const [suggestions, setSuggestions] = useState("");

  const toggleTag = (tag: FeedbackTag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (!title.trim() || !goalOfShare.trim()) {
      toast("Title and Goal of this share are required.");
      return;
    }
    onSubmit({
      title, epicId, priority, tags, assigneeIndex,
      goalOfShare, decisionNeeded, whatsWorking, questionsRisks, suggestions,
    });
    // Reset
    setStep(1);
    setTitle("");
    setEpicId("EPIC-01");
    setPriority("P1");
    setTags([]);
    setAssigneeIndex(0);
    setGoalOfShare("");
    setDecisionNeeded("");
    setWhatsWorking("");
    setQuestionsRisks("");
    setSuggestions("");
    onClose();
    toast("Card created and added to New Concept column.");
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-background border border-border rounded-lg shadow-lg w-full max-w-[560px] max-h-[85vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 className="font-display text-xl text-foreground">New Feedback Card</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Step {step} of {STEPS.length}: {STEPS[step - 1].description}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Step indicator */}
              <div className="px-6 pt-4 pb-2 flex gap-2">
                {STEPS.map((s) => (
                  <div
                    key={s.id}
                    className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                      s.id <= step ? "bg-foreground" : "bg-border"
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="px-6 py-4 space-y-5">
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <Field label="Title *">
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Mobile App Concept Direction"
                        className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40"
                      />
                    </Field>

                    <Field label="Epic">
                      <div className="flex flex-wrap gap-2">
                        {EPICS.map((epic) => (
                          <button
                            key={epic.id}
                            onClick={() => setEpicId(epic.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border transition-colors ${
                              epicId === epic.id
                                ? "border-foreground bg-foreground text-background"
                                : "border-border text-muted-foreground hover:border-foreground/40"
                            }`}
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: epicId === epic.id ? "white" : epic.color }}
                            />
                            {epic.name}
                          </button>
                        ))}
                      </div>
                    </Field>

                    <Field label="Priority">
                      <div className="flex gap-2">
                        {(["P0", "P1", "P2", "P3"] as Priority[]).map((p) => (
                          <button
                            key={p}
                            onClick={() => setPriority(p)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                              priority === p
                                ? "border-foreground bg-foreground text-background"
                                : "border-border text-muted-foreground hover:border-foreground/40"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </Field>

                    <Field label="Feedback Type Tags">
                      <div className="flex flex-wrap gap-2">
                        {FEEDBACK_TAGS.map((tag) => (
                          <button
                            key={tag.id}
                            onClick={() => toggleTag(tag.id)}
                            className={`px-2.5 py-1 rounded-md text-xs border transition-colors ${
                              tags.includes(tag.id)
                                ? "border-foreground bg-foreground text-background"
                                : "border-border text-muted-foreground hover:border-foreground/40"
                            }`}
                          >
                            {tag.label}
                          </button>
                        ))}
                      </div>
                    </Field>

                    <Field label="Assignee">
                      <div className="flex flex-wrap gap-2">
                        {TEAM_MEMBERS.map((member, i) => (
                          <button
                            key={member.name}
                            onClick={() => setAssigneeIndex(i)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border transition-colors ${
                              assigneeIndex === i
                                ? "border-foreground bg-foreground text-background"
                                : "border-border text-muted-foreground hover:border-foreground/40"
                            }`}
                          >
                            {member.initials} -- {member.name}
                          </button>
                        ))}
                      </div>
                    </Field>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <Field label="Goal of this share * (what decision do you need?)">
                      <textarea
                        value={goalOfShare}
                        onChange={(e) => setGoalOfShare(e.target.value)}
                        placeholder="Present two concept directions for the mobile app onboarding flow and get alignment on which to pursue."
                        rows={3}
                        className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40 resize-none"
                      />
                    </Field>

                    <Field label="Decision needed today (pick 1-2 options)">
                      <input
                        type="text"
                        value={decisionNeeded}
                        onChange={(e) => setDecisionNeeded(e.target.value)}
                        placeholder="Which concept direction to prototype"
                        className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40"
                      />
                    </Field>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <p className="text-xs text-muted-foreground">
                      These fields are optional. Use bullet points (one per line) for multiple items.
                    </p>

                    <Field label="What's working (2-3 bullets)">
                      <textarea
                        value={whatsWorking}
                        onChange={(e) => setWhatsWorking(e.target.value)}
                        placeholder="Strong visual identity established in the brand guidelines&#10;Clear user persona for creative entrepreneurs"
                        rows={3}
                        className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40 resize-none"
                      />
                    </Field>

                    <Field label="Questions / Risks (2-3 bullets)">
                      <textarea
                        value={questionsRisks}
                        onChange={(e) => setQuestionsRisks(e.target.value)}
                        placeholder="Concept A is more innovative but riskier from a usability standpoint&#10;Concept B is safer but may not differentiate enough"
                        rows={3}
                        className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40 resize-none"
                      />
                    </Field>

                    <Field label="Suggestions (specific, testable changes)">
                      <textarea
                        value={suggestions}
                        onChange={(e) => setSuggestions(e.target.value)}
                        placeholder="Test both concepts with 3-5 users before committing"
                        rows={2}
                        className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40 resize-none"
                      />
                    </Field>
                  </motion.div>
                )}
              </div>

              {/* Footer nav */}
              <div className="sticky bottom-0 bg-background border-t border-border px-6 py-3 flex items-center justify-between">
                <button
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  disabled={step === 1}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} strokeWidth={1.5} />
                  Back
                </button>

                {step < STEPS.length ? (
                  <button
                    onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
                    className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors"
                  >
                    Next
                    <ChevronRight size={14} strokeWidth={1.5} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-1.5 text-sm font-medium bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors"
                  >
                    Create Card
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label-meta text-muted-foreground mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
