export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action_type: string
          actor_name: string | null
          created_at: string
          description: string
          id: string
          intake_id: string | null
          register_id: string | null
        }
        Insert: {
          action_type: string
          actor_name?: string | null
          created_at?: string
          description: string
          id?: string
          intake_id?: string | null
          register_id?: string | null
        }
        Update: {
          action_type?: string
          actor_name?: string | null
          created_at?: string
          description?: string
          id?: string
          intake_id?: string | null
          register_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_intake_id_fkey"
            columns: ["intake_id"]
            isOneToOne: false
            referencedRelation: "intake_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_register_id_fkey"
            columns: ["register_id"]
            isOneToOne: false
            referencedRelation: "feedback_register"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_initials: string
          author_name: string
          author_team: string
          created_at: string
          id: string
          register_id: string
          section: string | null
          text: string
        }
        Insert: {
          author_initials?: string
          author_name: string
          author_team?: string
          created_at?: string
          id?: string
          register_id: string
          section?: string | null
          text: string
        }
        Update: {
          author_initials?: string
          author_name?: string
          author_team?: string
          created_at?: string
          id?: string
          register_id?: string
          section?: string | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_register_id_fkey"
            columns: ["register_id"]
            isOneToOne: false
            referencedRelation: "feedback_register"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_register: {
        Row: {
          assignee_name: string | null
          column_id: Database["public"]["Enums"]["register_column"]
          created_at: string
          critical_questions: string[] | null
          decision: string | null
          decision_needed: string | null
          decision_rationale: string | null
          epic_id: string | null
          goal_of_share: string | null
          happy_path: string[] | null
          hesitation_points: string[] | null
          hook_value: string | null
          id: string
          intake_id: string | null
          priority: Database["public"]["Enums"]["feedback_priority"]
          questions_risks: string[] | null
          suggestions: string[] | null
          tags: Database["public"]["Enums"]["feedback_tag"][] | null
          title: string
          updated_at: string
          whats_clear: string | null
          whats_confusing: string | null
          whats_working: string[] | null
        }
        Insert: {
          assignee_name?: string | null
          column_id?: Database["public"]["Enums"]["register_column"]
          created_at?: string
          critical_questions?: string[] | null
          decision?: string | null
          decision_needed?: string | null
          decision_rationale?: string | null
          epic_id?: string | null
          goal_of_share?: string | null
          happy_path?: string[] | null
          hesitation_points?: string[] | null
          hook_value?: string | null
          id?: string
          intake_id?: string | null
          priority?: Database["public"]["Enums"]["feedback_priority"]
          questions_risks?: string[] | null
          suggestions?: string[] | null
          tags?: Database["public"]["Enums"]["feedback_tag"][] | null
          title: string
          updated_at?: string
          whats_clear?: string | null
          whats_confusing?: string | null
          whats_working?: string[] | null
        }
        Update: {
          assignee_name?: string | null
          column_id?: Database["public"]["Enums"]["register_column"]
          created_at?: string
          critical_questions?: string[] | null
          decision?: string | null
          decision_needed?: string | null
          decision_rationale?: string | null
          epic_id?: string | null
          goal_of_share?: string | null
          happy_path?: string[] | null
          hesitation_points?: string[] | null
          hook_value?: string | null
          id?: string
          intake_id?: string | null
          priority?: Database["public"]["Enums"]["feedback_priority"]
          questions_risks?: string[] | null
          suggestions?: string[] | null
          tags?: Database["public"]["Enums"]["feedback_tag"][] | null
          title?: string
          updated_at?: string
          whats_clear?: string | null
          whats_confusing?: string | null
          whats_working?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_register_intake_id_fkey"
            columns: ["intake_id"]
            isOneToOne: false
            referencedRelation: "intake_items"
            referencedColumns: ["id"]
          },
        ]
      }
      intake_items: {
        Row: {
          body: string | null
          created_at: string
          id: string
          source: Database["public"]["Enums"]["intake_source"]
          status: Database["public"]["Enums"]["intake_status"]
          submitter_contact: string | null
          submitter_name: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          source?: Database["public"]["Enums"]["intake_source"]
          status?: Database["public"]["Enums"]["intake_status"]
          submitter_contact?: string | null
          submitter_name?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          source?: Database["public"]["Enums"]["intake_source"]
          status?: Database["public"]["Enums"]["intake_status"]
          submitter_contact?: string | null
          submitter_name?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      feedback_priority: "P0" | "P1" | "P2" | "P3"
      feedback_tag:
        | "concept-direction"
        | "information-architecture"
        | "interaction-pattern"
        | "visual-design"
        | "copy-content"
      intake_source: "form" | "sms" | "email" | "manual"
      intake_status: "new" | "triaged" | "promoted" | "dismissed"
      register_column:
        | "new-concept"
        | "feedback-submitted"
        | "in-review"
        | "decision-made"
        | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      feedback_priority: ["P0", "P1", "P2", "P3"],
      feedback_tag: [
        "concept-direction",
        "information-architecture",
        "interaction-pattern",
        "visual-design",
        "copy-content",
      ],
      intake_source: ["form", "sms", "email", "manual"],
      intake_status: ["new", "triaged", "promoted", "dismissed"],
      register_column: [
        "new-concept",
        "feedback-submitted",
        "in-review",
        "decision-made",
        "archived",
      ],
    },
  },
} as const
