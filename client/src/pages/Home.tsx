import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Inbox, CheckSquare, Archive, Search, ExternalLink,
  ChevronRight, Clock, MessageSquare, Filter, ArrowUpRight,
  XCircle, Loader2
} from "lucide-react";

type ViewId = "intake" | "register";
type IntakeStatus = "new" | "under-review" | "promoted" | "dismissed";

const STATUS_COLORS: Record<IntakeStatus, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  "under-review": "bg-amber-50 text-amber-700 border-amber-200",
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

const CHANNEL_LABELS: Record<string, string> = {
  web: "Web Form",
  sms: "SMS",
};

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState<ViewId>("intake");
  const [statusFilter, setStatusFilter] = useState<IntakeStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [triageNotes, setTriageNotes] = useState("");

  // Queries
  const intakeQuery = trpc.intake.list.useQuery(
    statusFilter !== "all" ? { status: statusFilter } : undefined
  );
  const registerQuery = trpc.register.list.useQuery(undefined, {
    enabled: activeView === "register",
  });

  // Mutations
  const triageMutation = trpc.intake.triage.useMutation({
    onSuccess: () => {
      intakeQuery.refetch();
      registerQuery.refetch();
      setSelectedItemId(null);
      setTriageNotes("");
      toast.success("Item triaged successfully.");
    },
    onError: (err) => toast.error(err.message),
  });

  // Auth gate
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="w-12 h-12 rounded-md bg-foreground flex items-center justify-center mx-auto">
            <span className="text-background font-bold text-lg">V</span>
          </div>
          <div>
            <h1 className="font-display text-2xl text-foreground mb-2">VantaLoop Triage</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sign in to review and triage feedback from the Vanta team.
            </p>
          </div>
          <Button asChild className="bg-foreground text-background hover:bg-foreground/90">
            <a href={getLoginUrl()}>Sign in</a>
          </Button>
        </div>
      </div>
    );
  }

  const handleTriage = (id: number, status: "under-review" | "promoted" | "dismissed") => {
    triageMutation.mutate({ id, status, triageNotes: triageNotes || undefined });
  };

  const intakeItems = intakeQuery.data ?? [];
  const registerItems = registerQuery.data ?? [];

  const filteredIntake = searchQuery
    ? intakeItems.filter(
        (i: any) =>
          i.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.submitterName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : intakeItems;

  const selectedItem = selectedItemId
    ? intakeItems.find((i: any) => i.id === selectedItemId)
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
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <button
            onClick={() => setActiveView("intake")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
              activeView === "intake"
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary/50"
            }`}
          >
            <Inbox size={15} strokeWidth={1.5} />
            Weekly Intake
          </button>
          <button
            onClick={() => setActiveView("register")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
              activeView === "register"
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary/50"
            }`}
          >
            <CheckSquare size={15} strokeWidth={1.5} />
            Feedback Register
          </button>
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2">
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-xs font-medium text-accent">{user?.name?.[0] ?? "?"}</span>
            </div>
            <span className="text-xs text-muted-foreground truncate">{user?.name ?? "User"}</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="shrink-0 border-b border-border px-6 py-3 flex items-center justify-between bg-background">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-lg text-foreground">
              {activeView === "intake" ? "Weekly Intake" : "Feedback Register"}
            </h2>
            <span className="label-meta text-muted-foreground/50">
              {activeView === "intake" ? filteredIntake.length : registerItems.length} items
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

        {/* Intake view */}
        {activeView === "intake" && (
          <div className="flex-1 flex overflow-hidden">
            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {/* Status filter tabs */}
              <div className="px-6 py-3 border-b border-border/60 flex items-center gap-2">
                <Filter size={13} className="text-muted-foreground/40" />
                {(["all", "new", "under-review", "promoted", "dismissed"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                      statusFilter === s
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-muted-foreground border-border hover:border-foreground/20"
                    }`}
                  >
                    {s === "all" ? "All" : s === "under-review" ? "Under Review" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>

              {intakeQuery.isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : filteredIntake.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Inbox className="w-10 h-10 text-muted-foreground/20 mb-3" />
                  <p className="text-sm text-muted-foreground">No intake items yet.</p>
                  <p className="text-xs text-muted-foreground/50 mt-1">
                    Share the submit form with the Vanta team to start collecting feedback.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {filteredIntake.map((item: any) => (
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
                            <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-medium rounded border ${STATUS_COLORS[item.status as IntakeStatus]}`}>
                              {item.status === "under-review" ? "Under Review" : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                            <span className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">
                              {CHANNEL_LABELS[item.channel] ?? item.channel}
                            </span>
                            <span className="text-[10px] text-muted-foreground/40">
                              {TYPE_LABELS[item.feedbackType] ?? item.feedbackType}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-foreground truncate">{item.subject}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.submitterName} {item.weekId ? `-- ${item.weekId}` : ""}
                          </p>
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
                <div className="p-5 border-b border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded border ${STATUS_COLORS[(selectedItem as any).status as IntakeStatus]}`}>
                      {(selectedItem as any).status}
                    </span>
                    <button onClick={() => setSelectedItemId(null)} className="text-muted-foreground hover:text-foreground">
                      <XCircle size={16} />
                    </button>
                  </div>
                  <h3 className="font-display text-lg text-foreground">{(selectedItem as any).subject}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    By {(selectedItem as any).submitterName} via {CHANNEL_LABELS[(selectedItem as any).channel]} -- {(selectedItem as any).weekId}
                  </p>
                </div>

                <div className="p-5 space-y-4">
                  {(selectedItem as any).goalOfShare && (
                    <div>
                      <p className="label-meta text-muted-foreground/60 mb-1">Goal of this share</p>
                      <p className="text-sm text-foreground leading-relaxed">{(selectedItem as any).goalOfShare}</p>
                    </div>
                  )}
                  {(selectedItem as any).whatsWorking && (
                    <div>
                      <p className="label-meta text-muted-foreground/60 mb-1">What's working</p>
                      <p className="text-sm text-foreground leading-relaxed">{(selectedItem as any).whatsWorking}</p>
                    </div>
                  )}
                  {(selectedItem as any).questionsRisks && (
                    <div>
                      <p className="label-meta text-muted-foreground/60 mb-1">Questions / Risks</p>
                      <p className="text-sm text-foreground leading-relaxed">{(selectedItem as any).questionsRisks}</p>
                    </div>
                  )}
                  {(selectedItem as any).suggestions && (
                    <div>
                      <p className="label-meta text-muted-foreground/60 mb-1">Suggestions</p>
                      <p className="text-sm text-foreground leading-relaxed">{(selectedItem as any).suggestions}</p>
                    </div>
                  )}
                  {(selectedItem as any).decisionNeeded && (
                    <div>
                      <p className="label-meta text-muted-foreground/60 mb-1">Decision needed</p>
                      <p className="text-sm text-foreground leading-relaxed">{(selectedItem as any).decisionNeeded}</p>
                    </div>
                  )}
                </div>

                {/* Triage actions */}
                {(selectedItem as any).status === "new" && (
                  <div className="p-5 border-t border-border space-y-3">
                    <p className="label-meta text-muted-foreground/60">Triage this item</p>
                    <textarea
                      value={triageNotes}
                      onChange={(e) => setTriageNotes(e.target.value)}
                      placeholder="Triage notes (optional)..."
                      rows={2}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40 resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleTriage((selectedItem as any).id, "promoted")}
                        disabled={triageMutation.isPending}
                        className="bg-green-600 text-white hover:bg-green-700 gap-1.5 flex-1"
                      >
                        <ArrowUpRight size={13} />
                        Promote
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTriage((selectedItem as any).id, "under-review")}
                        disabled={triageMutation.isPending}
                        className="gap-1.5 flex-1"
                      >
                        <Clock size={13} />
                        Review
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTriage((selectedItem as any).id, "dismissed")}
                        disabled={triageMutation.isPending}
                        className="text-muted-foreground gap-1.5"
                      >
                        <Archive size={13} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Register view */}
        {activeView === "register" && (
          <div className="flex-1 overflow-y-auto">
            {registerQuery.isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : registerItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <CheckSquare className="w-10 h-10 text-muted-foreground/20 mb-3" />
                <p className="text-sm text-muted-foreground">No items in the register yet.</p>
                <p className="text-xs text-muted-foreground/50 mt-1">
                  Promote intake items to populate the formal feedback register.
                </p>
              </div>
            ) : (
              <div className="p-6">
                {/* Simple Kanban columns */}
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {(["backlog", "in-progress", "resolved", "archived"] as const).map((col) => {
                    const colItems = registerItems.filter((i: any) => i.columnStatus === col);
                    const colLabels: Record<string, string> = {
                      backlog: "Backlog",
                      "in-progress": "In Progress",
                      resolved: "Resolved",
                      archived: "Archived",
                    };
                    return (
                      <div key={col} className="w-72 shrink-0">
                        <div className="flex items-center gap-2 mb-3 px-1">
                          <span className="label-meta text-muted-foreground/60">{colLabels[col]}</span>
                          <span className="text-[10px] text-muted-foreground/30">{colItems.length}</span>
                        </div>
                        <div className="space-y-2">
                          {colItems.map((item: any) => (
                            <div
                              key={item.id}
                              className="p-3 bg-card border border-border rounded-md hover:border-foreground/10 transition-colors"
                            >
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="text-[10px] font-medium text-accent">{item.priority}</span>
                                <span className="text-[10px] text-muted-foreground/40">
                                  {TYPE_LABELS[item.feedbackType] ?? item.feedbackType}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-foreground">{item.title}</p>
                              {item.assignee && (
                                <p className="text-xs text-muted-foreground mt-1">{item.assignee}</p>
                              )}
                            </div>
                          ))}
                          {colItems.length === 0 && (
                            <div className="p-4 border border-dashed border-border/60 rounded-md text-center">
                              <p className="text-xs text-muted-foreground/30">Empty</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
