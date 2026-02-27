import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  CheckCircle,
  Send,
  ChevronDown,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import vantaLogo from "@/assets/vanta-logo.jpg";

const FEEDBACK_TYPES = [
  { value: "concept-direction", label: "Concept Direction" },
  { value: "information-architecture", label: "Information Architecture" },
  { value: "interaction-pattern", label: "Interaction Pattern" },
  { value: "visual-design", label: "Visual Design" },
  { value: "copy-content", label: "Copy / Content" },
  { value: "general", label: "General" },
] as const;

type FeedbackType = (typeof FEEDBACK_TYPES)[number]["value"];

const inputClass =
  "w-full px-4 py-2.5 text-sm bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-colors";
const textareaClass = `${inputClass} resize-none`;

export default function TeamIntake() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Fields
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("general");
  const [goalOfShare, setGoalOfShare] = useState("");
  const [whatsWorking, setWhatsWorking] = useState("");
  const [questionsRisks, setQuestionsRisks] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [decisionNeeded, setDecisionNeeded] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subject.trim()) {
      toast.error("Name and subject are required.");
      return;
    }
    setSubmitting(true);
    try {
      const now = new Date();
      const onejan = new Date(now.getFullYear(), 0, 1);
      const weekNum = Math.ceil(
        ((now.getTime() - onejan.getTime()) / 86400000 +
          onejan.getDay() +
          1) /
          7
      );
      const weekId = `${now.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;

      const payload: Record<string, unknown> = {
        title: subject.trim(),
        body: expanded
          ? [goalOfShare, whatsWorking, questionsRisks, suggestions, decisionNeeded]
              .filter(Boolean)
              .join("\n\n") || body.trim() || null
          : body.trim() || null,
        submitter_name: name.trim(),
        source: "form" as const,
        status: "new" as const,
        feedback_type: feedbackType,
        week_id: weekId,
      };

      if (expanded) {
        payload.goal_of_share = goalOfShare.trim() || null;
        payload.whats_working = whatsWorking.trim() || null;
        payload.questions_risks = questionsRisks.trim() || null;
        payload.suggestions = suggestions.trim() || null;
        payload.decision_needed = decisionNeeded.trim() || null;
      }

      const { error } = await supabase
        .from("intake_items")
        .insert(payload as any);

      if (error) throw error;
      setSubmitted(true);
      toast.success("Signal captured.");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setExpanded(false);
    setName("");
    setSubject("");
    setBody("");
    setFeedbackType("general");
    setGoalOfShare("");
    setWhatsWorking("");
    setQuestionsRisks("");
    setSuggestions("");
    setDecisionNeeded("");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-foreground mb-2">
              Signal captured
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your note has been added to this week's triage roster.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" onClick={handleReset}>
              Add another
            </Button>
            <Link href="/triage">
              <Button variant="ghost" className="text-muted-foreground">
                View triage →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-1">
            <img src={vantaLogo} alt="Vanta Wireless" className="h-8" />
            <span className="label-meta text-muted-foreground">
              VantaLoop · Team
            </span>
          </div>
          <h1 className="font-display text-3xl text-foreground mt-4">
            Capture a signal
          </h1>
          <p className="text-muted-foreground text-sm mt-2 leading-relaxed max-w-lg">
            Quick notes from your head → weekly triage roster. Add detail if you
            have it, or keep it brief.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto px-6 py-8 space-y-6"
      >
        {/* Core fields */}
        <div className="space-y-5">
          <div>
            <label className="label-meta text-muted-foreground block mb-2">
              Your name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Stephen"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="label-meta text-muted-foreground block mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's the signal?"
              className={inputClass}
              required
            />
          </div>

          {!expanded && (
            <div>
              <label className="label-meta text-muted-foreground block mb-2">
                Notes
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                placeholder="Quick context, a link, a screenshot reference — anything that helps the team triage this."
                className={textareaClass}
              />
            </div>
          )}

          <div>
            <label className="label-meta text-muted-foreground block mb-2">
              Type
            </label>
            <div className="relative">
              <select
                value={feedbackType}
                onChange={(e) =>
                  setFeedbackType(e.target.value as FeedbackType)
                }
                className={`${inputClass} appearance-none`}
              >
                {FEEDBACK_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <Zap className="w-3.5 h-3.5" />
          <span>
            {expanded
              ? "Collapse structured fields"
              : "Add structured feedback"}
          </span>
        </button>

        {/* Expanded structured fields */}
        {expanded && (
          <div className="border-t border-border pt-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
            <StructuredField
              label="Goal of this share"
              hint="What decision do you need from this feedback?"
              value={goalOfShare}
              onChange={setGoalOfShare}
              placeholder="e.g. Decide whether to proceed with concept A or B"
              rows={2}
            />
            <StructuredField
              label="What's working"
              hint="2-3 things that feel right"
              value={whatsWorking}
              onChange={setWhatsWorking}
              placeholder="e.g. The navigation hierarchy is clear..."
              rows={3}
            />
            <StructuredField
              label="Questions / Risks"
              hint="What concerns or open questions do you have?"
              value={questionsRisks}
              onChange={setQuestionsRisks}
              placeholder="e.g. How does this scale with 50+ items?"
              rows={3}
            />
            <StructuredField
              label="Suggestions"
              hint="Specific, testable changes you'd recommend"
              value={suggestions}
              onChange={setSuggestions}
              placeholder="e.g. Try progressive disclosure for settings"
              rows={3}
            />
            <StructuredField
              label="Decision needed"
              hint="1-2 options for the group to decide on"
              value={decisionNeeded}
              onChange={setDecisionNeeded}
              placeholder="e.g. Card layout vs. list view?"
              rows={2}
            />
          </div>
        )}

        {/* Submit */}
        <div className="border-t border-border pt-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground/40">* Required fields</p>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-foreground text-background hover:bg-foreground/90 gap-2"
          >
            <Send className="w-4 h-4" />
            {submitting ? "Sending..." : "Capture signal"}
          </Button>
        </div>
      </form>

      <footer className="border-t border-border mt-12">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground/40">
            VantaLoop · Team Intake
          </p>
          <Link
            href="/triage"
            className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          >
            Triage →
          </Link>
        </div>
      </footer>
    </div>
  );
}

function StructuredField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  rows = 2,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="label-meta text-muted-foreground block mb-2">
        {label}
      </label>
      <p className="text-xs text-muted-foreground/50 mb-2">{hint}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={textareaClass}
      />
    </div>
  );
}
