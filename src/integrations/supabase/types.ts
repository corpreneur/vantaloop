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
          decision_needed: string | null
          feedback_type: string
          goal_of_share: string | null
          id: string
          promoted_register_id: string | null
          questions_risks: string | null
          source: Database["public"]["Enums"]["intake_source"]
          status: Database["public"]["Enums"]["intake_status"]
          submitter_contact: string | null
          submitter_name: string | null
          submitter_phone: string | null
          suggestions: string | null
          title: string
          triage_notes: string | null
          triaged_at: string | null
          triaged_by: string | null
          updated_at: string
          week_id: string | null
          whats_working: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          decision_needed?: string | null
          feedback_type?: string
          goal_of_share?: string | null
          id?: string
          promoted_register_id?: string | null
          questions_risks?: string | null
          source?: Database["public"]["Enums"]["intake_source"]
          status?: Database["public"]["Enums"]["intake_status"]
          submitter_contact?: string | null
          submitter_name?: string | null
          submitter_phone?: string | null
          suggestions?: string | null
          title: string
          triage_notes?: string | null
          triaged_at?: string | null
          triaged_by?: string | null
          updated_at?: string
          week_id?: string | null
          whats_working?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          decision_needed?: string | null
          feedback_type?: string
          goal_of_share?: string | null
          id?: string
          promoted_register_id?: string | null
          questions_risks?: string | null
          source?: Database["public"]["Enums"]["intake_source"]
          status?: Database["public"]["Enums"]["intake_status"]
          submitter_contact?: string | null
          submitter_name?: string | null
          submitter_phone?: string | null
          suggestions?: string | null
          title?: string
          triage_notes?: string | null
          triaged_at?: string | null
          triaged_by?: string | null
          updated_at?: string
          week_id?: string | null
          whats_working?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "intake_items_promoted_register_id_fkey"
            columns: ["promoted_register_id"]
            isOneToOne: false
            referencedRelation: "feedback_register"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_conversations: {
        Row: {
          created_at: string
          current_step: string
          finalized: boolean
          id: string
          partial_data: Json
          phone_number: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_step?: string
          finalized?: boolean
          id?: string
          partial_data?: Json
          phone_number: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_step?: string
          finalized?: boolean
          id?: string
          partial_data?: Json
          phone_number?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      list_users_with_roles: {
        Args: never
        Returns: {
          avatar_url: string
          created_at: string
          email: string
          full_name: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }[]
      }
      set_user_role: {
        Args: {
          _new_role: Database["public"]["Enums"]["app_role"]
          _target_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "viewer"
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
      app_role: ["admin", "viewer"],
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
