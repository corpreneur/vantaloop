/*
 * Design: "Clean Slate" -- Monochrome Workspace with Warm Accents
 * Main page: Sidebar + dynamic view (Board / Timeline / Decision Log / Digest).
 * All 10 enhancements wired together.
 */

import { useState, useCallback, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import KanbanBoard from "@/components/KanbanBoard";
import CardDetail from "@/components/CardDetail";
import FilterBar from "@/components/FilterBar";
import NewCardDialog from "@/components/NewCardDialog";
import TimelineView from "@/components/TimelineView";
import DecisionLog from "@/components/DecisionLog";
import WeeklyDigestView from "@/components/WeeklyDigest";
import {
  INITIAL_CARDS,
  TEAM_MEMBERS,
  type FeedbackCard,
  type EpicId,
  type ViewId,
  type Priority,
  type Comment,
} from "@/lib/data";
import type { NewCardData } from "@/components/NewCardDialog";
import { Search, Plus } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  // State
  const [cards, setCards] = useState<FeedbackCard[]>(INITIAL_CARDS);
  const [activeView, setActiveView] = useState<ViewId>("board");
  const [selectedEpics, setSelectedEpics] = useState<EpicId[]>([]);
  const [selectedCard, setSelectedCard] = useState<FeedbackCard | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [showNewCard, setShowNewCard] = useState(false);

  // Handlers
  const handleToggleEpic = useCallback((epicId: EpicId) => {
    setSelectedEpics((prev) =>
      prev.includes(epicId)
        ? prev.filter((id) => id !== epicId)
        : [...prev, epicId]
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedEpics([]);
    setSelectedPriorities([]);
    setSelectedAssignee(null);
  }, []);

  const handleCardClick = useCallback((card: FeedbackCard) => {
    setSelectedCard(card);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedCard(null);
  }, []);

  const handleTogglePriority = useCallback((p: Priority) => {
    setSelectedPriorities((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }, []);

  const handleSelectAssignee = useCallback((name: string | null) => {
    setSelectedAssignee(name);
  }, []);

  const handleAddComment = useCallback((cardId: string, text: string) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: TEAM_MEMBERS[0], // William Traylor as default
      text,
      timestamp: new Date().toISOString(),
    };
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? { ...c, comments: [...c.comments, newComment], updatedAt: new Date().toISOString().split("T")[0] }
          : c
      )
    );
    // Update selected card if it's the one being commented on
    setSelectedCard((prev) =>
      prev && prev.id === cardId
        ? { ...prev, comments: [...prev.comments, newComment] }
        : prev
    );
  }, []);

  const handleNewCard = useCallback((data: NewCardData) => {
    const now = new Date().toISOString().split("T")[0];
    const newCard: FeedbackCard = {
      id: `card-${Date.now()}`,
      title: data.title,
      epicId: data.epicId,
      columnId: "new-concept",
      priority: data.priority,
      tags: data.tags,
      assignee: data.assigneeIndex >= 0 ? TEAM_MEMBERS[data.assigneeIndex] : undefined,
      createdAt: now,
      updatedAt: now,
      goalOfShare: data.goalOfShare,
      whatsWorking: data.whatsWorking.split("\n").filter(Boolean),
      questionsRisks: data.questionsRisks.split("\n").filter(Boolean),
      suggestions: data.suggestions.split("\n").filter(Boolean),
      decisionNeeded: data.decisionNeeded,
      criticalQuestions: [],
      whatsClear: "",
      whatsConfusing: "",
      hookValue: "",
      happyPath: [],
      hesitationPoints: [],
      comments: [],
    };
    setCards((prev) => [...prev, newCard]);
    toast("Card created and added to New Concept.");
  }, []);

  // Filtered cards
  const filteredCards = useMemo(() => {
    let result = cards;

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.goalOfShare.toLowerCase().includes(q)
      );
    }

    // Epic filter
    if (selectedEpics.length > 0) {
      result = result.filter((c) => selectedEpics.includes(c.epicId));
    }

    // Priority filter
    if (selectedPriorities.length > 0) {
      result = result.filter((c) => selectedPriorities.includes(c.priority));
    }

    // Assignee filter
    if (selectedAssignee) {
      result = result.filter((c) => c.assignee?.name === selectedAssignee);
    }

    return result;
  }, [cards, searchQuery, selectedEpics, selectedPriorities, selectedAssignee]);

  // View titles
  const viewTitles: Record<ViewId, string> = {
    board: "Board",
    timeline: "Timeline",
    "decision-log": "Decision Log",
    digest: "Weekly Digest",
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onChangeView={setActiveView}
        selectedEpics={selectedEpics}
        onToggleEpic={handleToggleEpic}
        onClearFilters={handleClearFilters}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="shrink-0 border-b border-border px-6 py-3 flex items-center justify-between bg-background">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-lg text-foreground">
              {viewTitles[activeView]}
            </h2>
            <div className="flex items-center gap-1.5 text-muted-foreground/40">
              <span className="label-meta">{filteredCards.length} items</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search
                size={14}
                strokeWidth={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40"
              />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 w-56 transition-colors duration-150"
              />
            </div>

            {/* New Card button (#1) */}
            <button
              onClick={() => setShowNewCard(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors duration-150"
            >
              <Plus size={14} strokeWidth={2} />
              New Card
            </button>
          </div>
        </header>

        {/* Filter bar (#4) -- shown on board and timeline views */}
        {(activeView === "board" || activeView === "timeline") && (
          <div className="shrink-0 border-b border-border/60 px-6 py-2 bg-background">
            <FilterBar
              selectedPriorities={selectedPriorities}
              onTogglePriority={handleTogglePriority}
              selectedAssignee={selectedAssignee}
              onSelectAssignee={handleSelectAssignee}
            />
          </div>
        )}

        {/* Dynamic view */}
        {activeView === "board" && (
          <KanbanBoard
            cards={filteredCards}
            selectedEpics={selectedEpics}
            onCardClick={handleCardClick}
          />
        )}
        {activeView === "timeline" && (
          <TimelineView cards={filteredCards} onCardClick={handleCardClick} />
        )}
        {activeView === "decision-log" && (
          <DecisionLog cards={filteredCards} onCardClick={handleCardClick} />
        )}
        {activeView === "digest" && <WeeklyDigestView />}
      </div>

      {/* Card detail overlay */}
      <CardDetail
        card={selectedCard}
        onClose={handleCloseDetail}
        onAddComment={handleAddComment}
      />

      {/* New Card Dialog (#1) */}
      <NewCardDialog
        open={showNewCard}
        onClose={() => setShowNewCard(false)}
        onSubmit={handleNewCard}
      />
    </div>
  );
}
