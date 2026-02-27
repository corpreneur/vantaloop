/**
 * Hook to fetch feedback_register rows + comments from Supabase
 * and map them to the FeedbackCard shape used by all views.
 */
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../src/integrations/supabase/client";
import {
  TEAM_MEMBERS,
  type FeedbackCard,
  type EpicId,
  type ColumnId,
  type Priority,
  type FeedbackTag,
  type CriticalQuestion,
  type Decision,
  type Comment,
} from "@/lib/data";

type RegisterRow = {
  id: string;
  title: string;
  epic_id: string | null;
  column_id: string;
  priority: string;
  tags: string[] | null;
  assignee_name: string | null;
  created_at: string;
  updated_at: string;
  goal_of_share: string | null;
  whats_working: string[] | null;
  questions_risks: string[] | null;
  suggestions: string[] | null;
  decision_needed: string | null;
  critical_questions: string[] | null;
  whats_clear: string | null;
  whats_confusing: string | null;
  hook_value: string | null;
  happy_path: string[] | null;
  hesitation_points: string[] | null;
  decision: string | null;
  decision_rationale: string | null;
};

type CommentRow = {
  id: string;
  register_id: string;
  author_name: string;
  author_initials: string;
  author_team: string;
  text: string;
  section: string | null;
  created_at: string;
};

function mapRow(row: RegisterRow, comments: CommentRow[]): FeedbackCard {
  const assignee = TEAM_MEMBERS.find((m) => m.name === row.assignee_name);
  const cardComments: Comment[] = comments
    .filter((c) => c.register_id === row.id)
    .map((c) => ({
      id: c.id,
      author: TEAM_MEMBERS.find((m) => m.name === c.author_name) ?? {
        name: c.author_name,
        initials: c.author_initials || c.author_name.slice(0, 2).toUpperCase(),
        team: (c.author_team as "Vanta" | "Metalab") ?? "Vanta",
      },
      text: c.text,
      timestamp: c.created_at,
      section: c.section ?? undefined,
    }));

  return {
    id: row.id,
    title: row.title,
    epicId: (row.epic_id ?? "EPIC-01") as EpicId,
    columnId: (row.column_id ?? "new-concept") as ColumnId,
    priority: (row.priority ?? "P1") as Priority,
    tags: (row.tags ?? []) as FeedbackTag[],
    assignee,
    createdAt: row.created_at?.split("T")[0] ?? "",
    updatedAt: row.updated_at ?? row.created_at ?? "",
    comments: cardComments,
    goalOfShare: row.goal_of_share ?? "",
    whatsWorking: row.whats_working ?? [],
    questionsRisks: row.questions_risks ?? [],
    suggestions: row.suggestions ?? [],
    decisionNeeded: row.decision_needed ?? "",
    criticalQuestions: (row.critical_questions ?? []) as CriticalQuestion[],
    whatsClear: row.whats_clear ?? "",
    whatsConfusing: row.whats_confusing ?? "",
    hookValue: row.hook_value ?? "",
    happyPath: row.happy_path ?? [],
    hesitationPoints: row.hesitation_points ?? [],
    decision: (row.decision as Decision) ?? undefined,
    decisionRationale: row.decision_rationale ?? undefined,
  };
}

export function useRegisterCards() {
  const [cards, setCards] = useState<FeedbackCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [regResult, comResult] = await Promise.all([
      supabase.from("feedback_register").select("*").order("updated_at", { ascending: false }),
      supabase.from("comments").select("*").order("created_at", { ascending: true }),
    ]);

    if (regResult.error) {
      console.error("Failed to load register:", regResult.error);
    }

    const rows = (regResult.data ?? []) as RegisterRow[];
    const comments = (comResult.data ?? []) as CommentRow[];
    setCards(rows.map((r) => mapRow(r, comments)));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();

    // Realtime subscription
    const channel = supabase
      .channel("register-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "feedback_register" }, () => fetchAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, () => fetchAll())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchAll]);

  const insertCard = useCallback(
    async (card: Partial<RegisterRow>) => {
      const { error } = await supabase.from("feedback_register").insert(card as any);
      if (error) throw error;
    },
    []
  );

  const addComment = useCallback(
    async (registerId: string, authorName: string, text: string) => {
      const member = TEAM_MEMBERS.find((m) => m.name === authorName);
      const { error } = await supabase.from("comments").insert({
        register_id: registerId,
        author_name: authorName,
        author_initials: member?.initials ?? authorName.slice(0, 2).toUpperCase(),
        author_team: member?.team ?? "Vanta",
        text,
      } as any);
      if (error) throw error;
    },
    []
  );

  return { cards, loading, refetch: fetchAll, insertCard, addComment };
}
