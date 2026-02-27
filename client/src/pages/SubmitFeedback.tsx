import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, Send, ChevronDown } from "lucide-react";

const FEEDBACK_TYPES = [
  { value: "concept-direction", label: "Concept Direction" },
  { value: "information-architecture", label: "Information Architecture" },
  { value: "interaction-pattern", label: "Interaction Pattern" },
  { value: "visual-design", label: "Visual Design" },
  { value: "copy-content", label: "Copy / Content" },
  { value: "general", label: "General" },
] as const;

type FeedbackType = (typeof FEEDBACK_TYPES)[number]["value"];

export default function SubmitFeedback() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("general");
  const [goalOfShare, setGoalOfShare] = useState("");
  const [whatsWorking, setWhatsWorking] = useState("");
  const [questionsRisks, setQuestionsRisks] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [decisionNeeded, setDecisionNeeded] = useState("");

  const submitMutation = trpc.intake.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Feedback submitted successfully.");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit feedback.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subject.trim()) {
      toast.error("Name and subject are required.");
      return;
    }
    submitMutation.mutate({
      submitterName: name.trim(),
      feedbackType,
      subject: subject.trim(),
      goalOfShare: goalOfShare.trim() || undefined,
      whatsWorking: whatsWorking.trim() || undefined,
      questionsRisks: questionsRisks.trim() || undefined,
      suggestions: suggestions.trim() || undefined,
      decisionNeeded: decisionNeeded.trim() || undefined,
    });
  };

  const handleReset = () => {
    setSubmitted(false);
    setName("");
    setSubject("");
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
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-foreground mb-2">Thank you</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your feedback has been received and will be reviewed by the team during the next triage session.
            </p>
          </div>
          <Button variant="outline" onClick={handleReset} className="mt-4">
            Submit another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-md bg-foreground flex items-center justify-center">
              <span className="text-background font-bold text-sm">V</span>
            </div>
            <span className="label-meta text-muted-foreground">VantaLoop</span>
          </div>
          <h1 className="font-display text-3xl text-foreground mt-4">Share your feedback</h1>
          <p className="text-muted-foreground text-sm mt-2 leading-relaxed max-w-lg">
            Use this form to share design feedback on the Metalab interface work. 
            Your submission will be reviewed by William and Sue during the weekly triage.
          </p>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* Required fields */}
        <div className="space-y-5">
          <div>
            <label className="label-meta text-muted-foreground block mb-2">Your name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Glenn Teuber"
              className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-colors"
              required
            />
          </div>

          <div>
            <label className="label-meta text-muted-foreground block mb-2">Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief title for this feedback"
              className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-colors"
              required
            />
          </div>

          <div>
            <label className="label-meta text-muted-foreground block mb-2">Feedback type</label>
            <div className="relative">
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-md text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-colors"
              >
                {FEEDBACK_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Structured template fields */}
        <div className="border-t border-border pt-8 space-y-5">
          <p className="text-xs text-muted-foreground/60 uppercase tracking-wider font-medium">Structured Feedback (optional but encouraged)</p>

          <div>
            <label className="label-meta text-muted-foreground block mb-2">Goal of this share</label>
            <p className="text-xs text-muted-foreground/50 mb-2">What decision do you need from this feedback?</p>
            <textarea
              value={goalOfShare}
              onChange={(e) => setGoalOfShare(e.target.value)}
              rows={2}
              placeholder="e.g. Decide whether to proceed with concept A or B for the onboarding flow"
              className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="label-meta text-muted-foreground block mb-2">What's working</label>
            <p className="text-xs text-muted-foreground/50 mb-2">2-3 things that feel right about the current direction</p>
            <textarea
              value={whatsWorking}
              onChange={(e) => setWhatsWorking(e.target.value)}
              rows={3}
              placeholder="e.g. The navigation hierarchy is clear and intuitive..."
              className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="label-meta text-muted-foreground block mb-2">Questions / Risks</label>
            <p className="text-xs text-muted-foreground/50 mb-2">What concerns or open questions do you have?</p>
            <textarea
              value={questionsRisks}
              onChange={(e) => setQuestionsRisks(e.target.value)}
              rows={3}
              placeholder="e.g. How does this scale when the user has 50+ items?"
              className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="label-meta text-muted-foreground block mb-2">Suggestions</label>
            <p className="text-xs text-muted-foreground/50 mb-2">Specific, testable changes you would recommend</p>
            <textarea
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              rows={3}
              placeholder="e.g. Try a progressive disclosure pattern for the settings panel"
              className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="label-meta text-muted-foreground block mb-2">Decision needed today</label>
            <p className="text-xs text-muted-foreground/50 mb-2">Pick 1-2 options you want the group to decide on</p>
            <textarea
              value={decisionNeeded}
              onChange={(e) => setDecisionNeeded(e.target.value)}
              rows={2}
              placeholder="e.g. Should we proceed with the card-based layout or the list view?"
              className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="border-t border-border pt-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground/40">* Required fields</p>
          <Button
            type="submit"
            disabled={submitMutation.isPending}
            className="bg-foreground text-background hover:bg-foreground/90 gap-2"
          >
            <Send className="w-4 h-4" />
            {submitMutation.isPending ? "Submitting..." : "Submit feedback"}
          </Button>
        </div>
      </form>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <p className="text-xs text-muted-foreground/40">
            VantaLoop — Vanta Wireless &times; Metalab Design Feedback
          </p>
        </div>
      </footer>
    </div>
  );
}
