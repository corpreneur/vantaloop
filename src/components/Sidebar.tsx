/*
 * Design: "Clean Slate" -- Monochrome Workspace with Warm Accents
 * Persistent sidebar with view navigation, epic filters, and team members.
 * Typography: Instrument Serif for section headers, Satoshi for body.
 * Color: B/W with muted copper accent for selected states.
 */

import { EPICS, TEAM_MEMBERS, VIEWS, type EpicId, type ViewId } from "@/lib/data";
import { LayoutGrid, Clock, Gavel, Bot, Users, Filter, ChevronDown, ChevronRight, Inbox } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

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
}

export default function Sidebar({
  activeView,
  onChangeView,
  selectedEpics,
  onToggleEpic,
  onClearFilters,
}: SidebarProps) {
  const [epicsOpen, setEpicsOpen] = useState(true);
  const [teamOpen, setTeamOpen] = useState(true);

  return (
    <aside className="w-[260px] shrink-0 border-r border-border bg-sidebar h-screen sticky top-0 flex flex-col">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 border-b border-border">
        <h1 className="font-display text-xl tracking-tight text-foreground leading-tight">
          Vanta / Metalab
        </h1>
        <p className="label-meta text-muted-foreground mt-1">
          Design Feedback Board
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* Views */}
        {VIEWS.map((view) => {
          const active = activeView === view.id;
          return (
            <button
              key={view.id}
              onClick={() => onChangeView(view.id)}
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

        {/* Team section */}
        <div className="pt-4">
          <button
            onClick={() => setTeamOpen(!teamOpen)}
            className="flex items-center gap-1.5 px-2 py-1 w-full text-left"
          >
            {teamOpen ? (
              <ChevronDown size={12} className="text-muted-foreground" />
            ) : (
              <ChevronRight size={12} className="text-muted-foreground" />
            )}
            <span className="label-meta text-muted-foreground">Team</span>
          </button>

          {teamOpen && (
            <div className="mt-1 space-y-0.5">
              {TEAM_MEMBERS.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center gap-2.5 px-2 py-1.5"
                >
                  <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-medium">
                      {member.initials}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground truncate">
                    {member.name}
                  </span>
                  <span className="label-meta text-muted-foreground/60 ml-auto text-[9px]">
                    {member.team}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Triage link */}
      <div className="px-3 pt-4">
        <Link
          href="/triage"
          className="flex items-center gap-2.5 px-2 py-2 rounded-md w-full text-left text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors duration-150"
        >
          <Inbox size={15} strokeWidth={1.5} />
          <span className="text-sm font-medium">Intake Triage</span>
        </Link>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border">
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
      </div>
    </aside>
  );
}
