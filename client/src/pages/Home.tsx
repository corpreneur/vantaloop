/*
 * Design: "Clean Slate" -- Monochrome Workspace with Warm Accents
 * Main page: Sidebar + dynamic view (Board / Timeline / Decision Log / Digest).
 * Now connected to Supabase for real data persistence.
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
import { useRegisterCards } from "@/hooks/useRegisterCards";
import {
  TEAM_MEMBERS,
  INITIAL_CARDS,
  type FeedbackCard,
  type EpicId,
  type ViewId,
  type Priority,
  type Comment,
} from "@/lib/data";
import type { NewCardData } from "@/components/NewCardDialog";
import { Search, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const { cards: dbCards, loading, refetch, insertCard } = useRegisterCards();

  // Fall back to mock data if DB is empty
  const cards = dbCards.length > 0 ? dbCards : (loading ? [] : INITIAL_CARDS);

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
    // Comments are local-only for now (no comments table yet)
    toast("Comment added (local only).");
  }, []);

  const handleNewCard = useCallback(async (data: NewCardData) => {
    try {
      await insertCard({
        title: data.title,
        epic_id: data.epicId,
        column_id: "new-concept",
        priority: data.priority as any,
        tags: data.tags as any,
        assignee_name: data.assigneeIndex >= 0 ? TEAM_MEMBERS[data.assigneeIndex]?.name : null,
        goal_of_share: data.goalOfShare,
        decision_needed: data.decisionNeeded,
        whats_working: data.whatsWorking.split("\n").filter(Boolean),
        questions_risks: data.questionsRisks.split("\n").filter(Boolean),
        suggestions: data.suggestions.split("\n").filter(Boolean),
      });
      toast("Card created and added to New Concept.");
    } catch (err: any) {
      toast.error("Failed to create card: " + err.message);
    }
  }, [insertCard]);

  // Filtered cards
  const filteredCards = useMemo(() => {
    let result = cards;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.goalOfShare.toLowerCase().includes(q)
      );
    }
    if (selectedEpics.length > 0) {
      result = result.filter((c) => selectedEpics.includes(c.epicId));
    }
    if (selectedPriorities.length > 0) {
      result = result.filter((c) => selectedPriorities.includes(c.priority));
    }
    if (selectedAssignee) {
      result = result.filter((c) => c.assignee?.name === selectedAssignee);
    }
    return result;
  }, [cards, searchQuery, selectedEpics, selectedPriorities, selectedAssignee]);

  const viewTitles: Record<ViewId, string> = {
    board: "Board",
    timeline: "Timeline",
    "decision-log": "Decision Log",
    digest: "Weekly Digest",
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        activeView={activeView}
        onChangeView={setActiveView}
        selectedEpics={selectedEpics}
        onToggleEpic={handleToggleEpic}
        onClearFilters={handleClearFilters}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="shrink-0 border-b border-border px-6 py-3 flex items-center justify-between bg-background">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-lg text-foreground">
              {viewTitles[activeView]}
            </h2>
            <div className="flex items-center gap-1.5 text-muted-foreground/40">
              <span className="label-meta">{filteredCards.length} items</span>
            </div>
            {loading && <Loader2 size={14} className="animate-spin text-muted-foreground" />}
          </div>

          <div className="flex items-center gap-3">
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

            <button
              onClick={() => setShowNewCard(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors duration-150"
            >
              <Plus size={14} strokeWidth={2} />
              New Card
            </button>
          </div>
        </header>

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

      <CardDetail
        card={selectedCard}
        onClose={handleCloseDetail}
        onAddComment={handleAddComment}
      />

      <NewCardDialog
        open={showNewCard}
        onClose={() => setShowNewCard(false)}
        onSubmit={handleNewCard}
      />
    </div>
  );
}
