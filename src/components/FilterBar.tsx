/*
 * Design: "Clean Slate" -- Monochrome Workspace with Warm Accents
 * Top bar filter chips for priority and assignee (#4).
 * Chips toggle on/off with a monochrome active state.
 */

import { TEAM_MEMBERS, type Priority } from "@/lib/data";
import { X } from "lucide-react";

interface FilterBarProps {
  selectedPriorities: Priority[];
  onTogglePriority: (p: Priority) => void;
  selectedAssignee: string | null;
  onSelectAssignee: (name: string | null) => void;
}

const PRIORITIES: Priority[] = ["P0", "P1", "P2", "P3"];

export default function FilterBar({
  selectedPriorities,
  onTogglePriority,
  selectedAssignee,
  onSelectAssignee,
}: FilterBarProps) {
  const hasFilters = selectedPriorities.length > 0 || selectedAssignee !== null;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Priority chips */}
      <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-medium">Priority</span>
      <div className="flex gap-1">
        {PRIORITIES.map((p) => {
          const active = selectedPriorities.includes(p);
          return (
            <button
              key={p}
              onClick={() => onTogglePriority(p)}
              className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border transition-colors duration-150 ${
                active
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground/40"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      <div className="w-px h-4 bg-border mx-1" />

      {/* Assignee chips */}
      <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-medium">Assignee</span>
      <div className="flex gap-1">
        {TEAM_MEMBERS.map((member) => {
          const active = selectedAssignee === member.name;
          return (
            <button
              key={member.name}
              onClick={() => onSelectAssignee(active ? null : member.name)}
              className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-sm border transition-colors duration-150 ${
                active
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground/40"
              }`}
            >
              {member.initials}
            </button>
          );
        })}
      </div>

      {/* Clear all */}
      {hasFilters && (
        <>
          <div className="w-px h-4 bg-border mx-1" />
          <button
            onClick={() => {
              selectedPriorities.forEach((p) => onTogglePriority(p));
              onSelectAssignee(null);
            }}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={10} strokeWidth={2} />
            Clear
          </button>
        </>
      )}
    </div>
  );
}
