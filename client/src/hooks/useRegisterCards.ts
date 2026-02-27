/**
 * Hook to fetch feedback_register rows from Supabase and map them
 * to the FeedbackCard shape used by Board, Timeline, and DecisionLog views.
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

function mapRow(row: RegisterRow): FeedbackCard {
  const assignee = TEAM_MEMBERS.find((m) => m.name === row.assignee_name);
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
    comments: [],
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

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("feedback_register")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Failed to load register cards:", error);
    } else {
      setCards((data as RegisterRow[]).map(mapRow));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const insertCard = useCallback(
    async (card: Partial<RegisterRow>) => {
      const { error } = await supabase.from("feedback_register").insert(card as any);
      if (error) throw error;
      await fetch();
    },
    [fetch]
  );

  return { cards, loading, refetch: fetch, insertCard };
}
