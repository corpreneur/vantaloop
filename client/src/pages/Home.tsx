/*
 * Design: "Clean Slate" -- Monochrome Workspace with Warm Accents
 * Main page: Sidebar + Kanban Board + Card Detail panel.
 * Asymmetric two-zone layout. Sidebar 260px, board fills remaining.
 */

import { useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import KanbanBoard from "@/components/KanbanBoard";
import CardDetail from "@/components/CardDetail";
import { INITIAL_CARDS, type FeedbackCard, type EpicId } from "@/lib/data";
import { Search } from "lucide-react";

export default function Home() {
  const [selectedEpics, setSelectedEpics] = useState<EpicId[]>([]);
  const [selectedCard, setSelectedCard] = useState<FeedbackCard | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleEpic = useCallback((epicId: EpicId) => {
    setSelectedEpics((prev) =>
      prev.includes(epicId)
        ? prev.filter((id) => id !== epicId)
        : [...prev, epicId]
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedEpics([]);
  }, []);

  const handleCardClick = useCallback((card: FeedbackCard) => {
    setSelectedCard(card);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedCard(null);
  }, []);

  // Filter by search
  const searchedCards = searchQuery
    ? INITIAL_CARDS.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.goalOfShare.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : INITIAL_CARDS;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        selectedEpics={selectedEpics}
        onToggleEpic={handleToggleEpic}
        onClearFilters={handleClearFilters}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="shrink-0 border-b border-border px-6 py-3 flex items-center justify-between bg-background">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-lg text-foreground">Board</h2>
            <div className="flex items-center gap-1.5 text-muted-foreground/40">
              <span className="label-meta">{searchedCards.length} items</span>
            </div>
          </div>

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
        </header>

        {/* Board */}
        <KanbanBoard
          cards={searchedCards}
          selectedEpics={selectedEpics}
          onCardClick={handleCardClick}
        />
      </div>

      {/* Card detail overlay */}
      <CardDetail card={selectedCard} onClose={handleCloseDetail} />
    </div>
  );
}
