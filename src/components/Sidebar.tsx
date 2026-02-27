/*
 * Design: "Clean Slate" -- Monochrome Workspace with Warm Accents
 * Persistent sidebar with view navigation, epic filters, and team members.
 * Mobile: rendered inside a Sheet overlay.
 */

import { EPICS, VIEWS, type EpicId, type ViewId } from "@/lib/data";
import { LayoutGrid, Clock, Gavel, Bot, Filter, ChevronDown, ChevronRight, Inbox, PenLine, LogOut, UserCog } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import vantaLogo from "@/assets/vanta-logo.jpg";

const VIEW_ICONS: Record<ViewId, React.ReactNode> = {
  board: <LayoutGrid size={15} strokeWidth={1.5} />,
  timeline: <Clock size={15} strokeWidth={1.5} />,
  "decision-log": <Gavel size={15} strokeWidth={1.5} />,
  digest: <Bot size={15} strokeWidth={1.5} />,
};

interface SidebarProps {
  activeView: ViewId;
  onChangeView: (v: ViewId) => void;
  selectedEpics: EpicId[];
  onToggleEpic: (epicId: EpicId) => void;
  onClearFilters: () => void;
  onNavigate?: () => void; // called after view change on mobile to close drawer
}

export function SidebarContent({
  activeView,
  onChangeView,
  selectedEpics,
  onToggleEpic,
  onClearFilters,
  onNavigate,
}: SidebarProps) {
  const { isAdmin } = useRole();
  const [epicsOpen, setEpicsOpen] = useState(false);
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("intake_items")
        .select("*", { count: "exact", head: true })
        .eq("status", "new");
      setNewCount(count ?? 0);
    };
    fetchCount();

    const channel = supabase
      .channel("intake-new-count")
      .on("postgres_changes", { event: "*", schema: "public", table: "intake_items" }, () => fetchCount())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleViewChange = (v: ViewId) => {
    onChangeView(v);
    onNavigate?.();
  };

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Header */}
      <SidebarHeader />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* Feedback Signal - prominent CTA at top */}
        <Link
          href="/intake"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-md w-full text-left bg-foreground text-background font-semibold hover:opacity-90 transition-opacity duration-150 mb-2"
        >
          <PenLine size={16} strokeWidth={2} />
          <span className="text-sm">Feedback Signal</span>
        </Link>

        {/* Intake Triage */}
        <Link
          href="/triage"
          className="flex items-center gap-2.5 px-2 py-2.5 rounded-md w-full text-left text-foreground font-semibold bg-secondary/60 hover:bg-secondary transition-colors duration-150"
        >
          <Inbox size={16} strokeWidth={2} />
          <span className="text-sm flex-1">Intake Triage</span>
          {newCount > 0 && (
            <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-[11px] font-semibold flex items-center justify-center">
              {newCount > 99 ? "99+" : newCount}
            </span>
          )}
        </Link>

        {/* Role Management - admin only */}
        {isAdmin && (
          <Link
            href="/admin/roles"
            className="flex items-center gap-2.5 px-2 py-2 rounded-md w-full text-left text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors duration-150"
          >
            <UserCog size={15} strokeWidth={1.5} />
            <span className="text-sm font-medium">Manage Roles</span>
          </Link>
        )}

        {VIEWS.map((view) => {
          const active = activeView === view.id;
          return (
            <button
              key={view.id}
              onClick={() => handleViewChange(view.id)}
              className={`flex items-center gap-2.5 px-2 py-2 rounded-md w-full text-left transition-colors duration-150 ${
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {VIEW_ICONS[view.id]}
              <span className="text-sm font-medium">{view.label}</span>
            </button>
          );
        })}

        {/* Epics section */}
        <div className="pt-4">
          <button
            onClick={() => setEpicsOpen(!epicsOpen)}
            className="flex items-center gap-1.5 px-2 py-1 w-full text-left"
          >
            {epicsOpen ? (
              <ChevronDown size={12} className="text-muted-foreground" />
            ) : (
              <ChevronRight size={12} className="text-muted-foreground" />
            )}
            <span className="label-meta text-muted-foreground">Epics</span>
          </button>

          {epicsOpen && (
            <div className="mt-1 space-y-0.5">
              {EPICS.map((epic) => {
                const isSelected = selectedEpics.includes(epic.id);
                return (
                  <button
                    key={epic.id}
                    onClick={() => onToggleEpic(epic.id)}
                    className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md w-full text-left transition-colors duration-150 ${
                      isSelected
                        ? "bg-[oklch(0.96_0.03_55)] text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: epic.color }}
                    />
                    <span className="text-sm truncate">{epic.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>




      {/* Footer */}
      <div className="px-5 py-4 border-t border-border space-y-3">
        {selectedEpics.length > 0 && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 text-sm text-accent hover:text-foreground transition-colors duration-150"
          >
            <Filter size={13} strokeWidth={1.5} />
            Clear filters ({selectedEpics.length})
          </button>
        )}
        {selectedEpics.length === 0 && (
          <p className="text-xs text-muted-foreground/60">
            Click an epic to filter the board
          </p>
        )}
        <SignOutButton />
      </div>
    </div>
  );
}

function SidebarHeader() {
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] 
    || user?.email?.split("@")[0] 
    || null;

  return (
    <div className="px-5 pt-6 pb-4 border-b border-border">
      <img src={vantaLogo} alt="Vanta Wireless" className="h-7 mb-2" />
      {firstName ? (
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-muted-foreground">
            Welcome back, <span className="text-foreground font-medium">{firstName}</span>
          </p>
          {isAdmin && (
            <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold rounded bg-foreground text-background">
              Admin
            </span>
          )}
        </div>
      ) : (
        <p className="label-meta text-muted-foreground mt-1">
          Design Feedback Board
        </p>
      )}
    </div>
  );
}

function SignOutButton() {
  const { user, signOut } = useAuth();
  if (!user) return null;
  return (
    <button
      onClick={signOut}
      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors duration-150"
    >
      <LogOut size={13} strokeWidth={1.5} />
      Sign out
    </button>
  );
}

export default function Sidebar(props: SidebarProps) {
  return (
    <aside className="hidden md:flex w-[260px] shrink-0 border-r border-border bg-sidebar h-screen sticky top-0 flex-col">
      <SidebarContent {...props} />
    </aside>
  );
}