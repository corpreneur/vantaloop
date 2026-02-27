import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  Inbox, CheckSquare, Search, ExternalLink,
  ChevronRight, Clock, Filter,
  XCircle, Loader2, ArrowLeft, ArrowUpRight
} from "lucide-react";

type IntakeStatus = "new" | "triaged" | "promoted" | "dismissed";

const STATUS_COLORS: Record<IntakeStatus, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  triaged: "bg-amber-50 text-amber-700 border-amber-200",
  promoted: "bg-green-50 text-green-700 border-green-200",
  dismissed: "bg-neutral-100 text-neutral-500 border-neutral-200",
};

const TYPE_LABELS: Record<string, string> = {
  "concept-direction": "Concept",
  "information-architecture": "IA",
  "interaction-pattern": "Interaction",
  "visual-design": "Visual",
  "copy-content": "Copy",
  general: "General",
};

const SOURCE_LABELS: Record<string, string> = {
  form: "Web Form",
  sms: "SMS",
  email: "Email",
  manual: "Manual",
};

type IntakeItem = {
  id: string;
  title: string;
  body: string | null;
  submitter_name: string | null;
  submitter_contact: string | null;
  source: string;
  status: IntakeStatus;
  feedback_type: string | null;
  goal_of_share: string | null;
  whats_working: string | null;
  questions_risks: string | null;
  suggestions: string | null;
  decision_needed: string | null;
  triage_notes: string | null;
  triaged_by: string | null;
  created_at: string;
  updated_at: string;
};

export default function TriageDashboard() {
  const [items, setItems] = useState<IntakeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<IntakeStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [triageNotes, setTriageNotes] = useState("");
  const [triaging, setTriaging] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("intake_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Failed to load intake items:", error);
      toast.error("Failed to load intake items.");
    } else {
      setItems((data ?? []) as IntakeItem[]);
    }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleTriage = async (id: string, newStatus: IntakeStatus) => {
    setTriaging(true);
    try {
      // Update intake item status
      const { error: updateError } = await supabase
        .from("intake_items")
        .update({
          status: newStatus,
          triage_notes: triageNotes || null,
          triaged_by: "Reviewer",
          triaged_at: new Date().toISOString(),
        } as any)
        .eq("id", id);

      if (updateError) throw updateError;

      // If promoted, create a register entry
      if (newStatus === "promoted") {
        const item = items.find((i) => i.id === id);
        if (item) {
          const { data: regData, error: regError } = await supabase
            .from("feedback_register")
            .insert({
              title: item.title,
              intake_id: item.id,
              column_id: "new-concept",
              priority: "P1",
              tags: item.feedback_type && item.feedback_type !== "general"
                ? [item.feedback_type]
                : [],
              goal_of_share: item.goal_of_share || "",
              whats_working: item.whats_working ? [item.whats_working] : [],
              questions_risks: item.questions_risks ? [item.questions_risks] : [],
              suggestions: item.suggestions ? [item.suggestions] : [],
              decision_needed: item.decision_needed || "",
            } as any)
            .select("id")
            .single();

          if (regError) {
            console.error("Failed to create register entry:", regError);
          } else if (regData) {
            // Link the register item back
            await supabase
              .from("intake_items")
              .update({ promoted_register_id: regData.id } as any)
              .eq("id", id);
          }
        }
      }

      toast.success(
        newStatus === "promoted"
          ? "Item promoted to register."
          : newStatus === "dismissed"
          ? "Item dismissed."
          : "Item status updated."
      );
      setSelectedItemId(null);
      setTriageNotes("");
      await fetchItems();
    } catch (err: any) {
      toast.error("Triage failed: " + err.message);
    } finally {
      setTriaging(false);
    }
  };

  const filteredItems = searchQuery
    ? items.filter(
        (i) =>
          i.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.submitter_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  const selectedItem = selectedItemId
    ? items.find((i) => i.id === selectedItemId) ?? null
    : null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
              <span className="text-background font-bold text-xs">V</span>
            </div>
            <span className="font-display text-base text-foreground">VantaLoop</span>
          </div>
          <p className="text-[10px] text-muted-foreground/50 mt-1 uppercase tracking-wider">Intake Triage</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-secondary/50 transition-colors mb-3"
          >
            <ArrowLeft size={15} strokeWidth={1.5} />
            Back to Board
          </Link>

          <div className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm bg-secondary text-foreground font-medium">
            <Inbox size={15} strokeWidth={1.5} />
            Weekly Intake
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="shrink-0 border-b border-border px-6 py-3 flex items-center justify-between bg-background">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-lg text-foreground">Weekly Intake</h2>
            <span className="label-meta text-muted-foreground/50">
              {filteredItems.length} items
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40 w-48 transition-colors"
              />
            </div>
            <a
              href="/submit"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-md transition-colors"
            >
              <ExternalLink size={13} />
              Submit Form
            </a>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {/* Status filter bar */}
            <div className="px-6 py-3 border-b border-border/60 flex items-center gap-2">
              <Filter size={13} className="text-muted-foreground/40" />
              {(["all", "new", "triaged", "promoted", "dismissed"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                    statusFilter === s
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-border hover:border-foreground/20"
                  }`}
                >
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Inbox className="w-10 h-10 text-muted-foreground/20 mb-3" />
                <p className="text-sm text-muted-foreground">No intake items yet.</p>
                <p className="text-xs text-muted-foreground/50 mt-1">
                  Share the submit form to start collecting feedback.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`w-full text-left px-6 py-4 hover:bg-secondary/30 transition-colors ${
                      selectedItemId === item.id ? "bg-secondary/50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-medium rounded border ${STATUS_COLORS[item.status]}`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                          <span className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">
                            {SOURCE_LABELS[item.source] ?? item.source}
                          </span>
                          {item.feedback_type && (
                            <span className="text-[10px] text-muted-foreground/40">
                              {TYPE_LABELS[item.feedback_type] ?? item.feedback_type}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-medium text-foreground truncate">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.submitter_name ?? "Anonymous"}</p>
                      </div>
                      <ChevronRight size={14} className="text-muted-foreground/30 mt-1 shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selectedItem && (
            <div className="w-96 shrink-0 border-l border-border bg-card overflow-y-auto">
              <div className="p-5 space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-medium rounded border ${STATUS_COLORS[selectedItem.status]}`}>
                      {selectedItem.status}
                    </span>
                    <h3 className="font-display text-base text-foreground mt-2">{selectedItem.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      From {selectedItem.submitter_name ?? "Anonymous"} via {SOURCE_LABELS[selectedItem.source] ?? selectedItem.source}
                    </p>
                  </div>
                  <button onClick={() => setSelectedItemId(null)} className="text-muted-foreground/40 hover:text-foreground">
                    <XCircle size={16} />
                  </button>
                </div>

                <div className="space-y-3">
                  <DetailField label="Goal of Share" value={selectedItem.goal_of_share} />
                  <DetailField label="What's Working" value={selectedItem.whats_working} />
                  <DetailField label="Questions / Risks" value={selectedItem.questions_risks} />
                  <DetailField label="Suggestions" value={selectedItem.suggestions} />
                  <DetailField label="Decision Needed" value={selectedItem.decision_needed} />
                  {selectedItem.body && !selectedItem.goal_of_share && (
                    <DetailField label="Body" value={selectedItem.body} />
                  )}
                </div>

                {/* Triage actions */}
                {selectedItem.status === "new" && (
                  <div className="space-y-3 pt-3 border-t border-border/60">
                    <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground/50">Triage Actions</h4>
                    <textarea
                      value={triageNotes}
                      onChange={(e) => setTriageNotes(e.target.value)}
                      placeholder="Triage notes (optional)..."
                      className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40 resize-none h-16"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTriage(selectedItem.id, "promoted")}
                        disabled={triaging}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors disabled:opacity-50"
                      >
                        <ArrowUpRight size={12} />
                        Promote to Register
                      </button>
                      <button
                        onClick={() => handleTriage(selectedItem.id, "triaged")}
                        disabled={triaging}
                        className="px-3 py-1.5 text-xs font-medium border border-border rounded-md text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                        title="Mark as under review"
                      >
                        <Clock size={12} />
                      </button>
                      <button
                        onClick={() => handleTriage(selectedItem.id, "dismissed")}
                        disabled={triaging}
                        className="px-3 py-1.5 text-xs font-medium border border-border rounded-md text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                        title="Dismiss"
                      >
                        <XCircle size={12} />
                      </button>
                    </div>
                  </div>
                )}

                {selectedItem.triage_notes && (
                  <div className="pt-3 border-t border-border/60">
                    <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-1">Triage Notes</h4>
                    <p className="text-sm text-muted-foreground">{selectedItem.triage_notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-1">{label}</h4>
      <p className="text-sm text-foreground leading-relaxed">{value || "Not provided"}</p>
    </div>
  );
}
