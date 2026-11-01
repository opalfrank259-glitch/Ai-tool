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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          details: Json
          id: string
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          details?: Json
          id?: string
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          details?: Json
          id?: string
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_kits: {
        Row: {
          address: string | null
          client_id: string | null
          colors: Json
          contact_number: string | null
          created_at: string
          id: string
          is_default: boolean
          name: string
          primary_font: string | null
          rules: Json
          secondary_font: string | null
          tagline: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          client_id?: string | null
          colors?: Json
          contact_number?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          primary_font?: string | null
          rules?: Json
          secondary_font?: string | null
          tagline?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          client_id?: string | null
          colors?: Json
          contact_number?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          primary_font?: string | null
          rules?: Json
          secondary_font?: string | null
          tagline?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_kits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_accounts: {
        Row: {
          balance: number
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_ledger: {
        Row: {
          created_at: string
          delta: number
          id: string
          idempotency_key: string | null
          metadata: Json
          reason: string
          reference_id: string | null
          reference_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          delta: number
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          reason: string
          reference_id?: string | null
          reference_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          delta?: number
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          reason?: string
          reference_id?: string | null
          reference_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_chunks: {
        Row: {
          app_versions: string[]
          content: string
          created_at: string
          id: string
          metadata: Json
          review_status: string
          reviewed_at: string | null
          reviewer: string | null
          source_url: string | null
          topic: string
        }
        Insert: {
          app_versions?: string[]
          content: string
          created_at?: string
          id: string
          metadata?: Json
          review_status?: string
          reviewed_at?: string | null
          reviewer?: string | null
          source_url?: string | null
          topic: string
        }
        Update: {
          app_versions?: string[]
          content?: string
          created_at?: string
          id?: string
          metadata?: Json
          review_status?: string
          reviewed_at?: string | null
          reviewer?: string | null
          source_url?: string | null
          topic?: string
        }
        Relationships: []
      }
      lesson_steps: {
        Row: {
          client_step_id: string
          created_at: string
          id: string
          objective: string | null
          payload: Json
          position: number
          project_id: string
          status: string
          title: string
          title_urdu: string | null
          tool_name: string | null
          updated_at: string
        }
        Insert: {
          client_step_id: string
          created_at?: string
          id?: string
          objective?: string | null
          payload?: Json
          position: number
          project_id: string
          status?: string
          title: string
          title_urdu?: string | null
          tool_name?: string | null
          updated_at?: string
        }
        Update: {
          client_step_id?: string
          created_at?: string
          id?: string
          objective?: string | null
          payload?: Json
          position?: number
          project_id?: string
          status?: string
          title?: string
          title_urdu?: string | null
          tool_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_steps_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_conversations: {
        Row: {
          created_at: string
          id: string
          language: string
          project_id: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string
          project_id?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          project_id?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          current_step_id: string | null
          high_thinking: boolean
          id: string
          input_tokens: number | null
          language: string
          model_name: string | null
          output_tokens: number | null
          speaker: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          current_step_id?: string | null
          high_thinking?: boolean
          id?: string
          input_tokens?: number | null
          language?: string
          model_name?: string | null
          output_tokens?: number | null
          speaker: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          current_step_id?: string | null
          high_thinking?: boolean
          id?: string
          input_tokens?: number | null
          language?: string
          model_name?: string | null
          output_tokens?: number | null
          speaker?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "mentor_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      model_runs: {
        Row: {
          created_at: string
          error_message: string | null
          estimated_cost_usd: number
          function_name: string
          id: string
          input_tokens: number
          latency_ms: number | null
          metadata: Json
          model_name: string
          output_tokens: number
          project_id: string | null
          status: string
          thinking_level: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          estimated_cost_usd?: number
          function_name: string
          id?: string
          input_tokens?: number
          latency_ms?: number | null
          metadata?: Json
          model_name: string
          output_tokens?: number
          project_id?: string | null
          status?: string
          thinking_level?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          estimated_cost_usd?: number
          function_name?: string
          id?: string
          input_tokens?: number
          latency_ms?: number | null
          metadata?: Json
          model_name?: string
          output_tokens?: number
          project_id?: string | null
          status?: string
          thinking_level?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "model_runs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_runs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_assignments: {
        Row: {
          category: string
          created_at: string
          difficulty: string
          hint_ladder: Json
          id: string
          is_published: boolean
          objective: string
          rubric: Json
          scenario: string
          seed_key: string | null
          time_estimate: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          difficulty: string
          hint_ladder?: Json
          id?: string
          is_published?: boolean
          objective: string
          rubric?: Json
          scenario: string
          seed_key?: string | null
          time_estimate?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          difficulty?: string
          hint_ladder?: Json
          id?: string
          is_published?: boolean
          objective?: string
          rubric?: Json
          scenario?: string
          seed_key?: string | null
          time_estimate?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      practice_attempts: {
        Row: {
          assignment_id: string
          completed_at: string | null
          created_at: string
          feedback: Json
          id: string
          project_id: string | null
          score: number | null
          started_at: string
          status: string
          submitted_asset_id: string | null
          submitted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assignment_id: string
          completed_at?: string | null
          created_at?: string
          feedback?: Json
          id?: string
          project_id?: string | null
          score?: number | null
          started_at?: string
          status?: string
          submitted_asset_id?: string | null
          submitted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assignment_id?: string
          completed_at?: string | null
          created_at?: string
          feedback?: Json
          id?: string
          project_id?: string | null
          score?: number | null
          started_at?: string
          status?: string
          submitted_asset_id?: string | null
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_attempts_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "practice_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practice_attempts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practice_attempts_submitted_asset_id_fkey"
            columns: ["submitted_asset_id"]
            isOneToOne: false
            referencedRelation: "project_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practice_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          app_name: string
          app_version: string | null
          created_at: string
          display_name: string
          id: string
          language: string
          role: string
          skill_level: string
          updated_at: string
        }
        Insert: {
          app_name?: string
          app_version?: string | null
          created_at?: string
          display_name?: string
          id: string
          language?: string
          role?: string
          skill_level?: string
          updated_at?: string
        }
        Update: {
          app_name?: string
          app_version?: string | null
          created_at?: string
          display_name?: string
          id?: string
          language?: string
          role?: string
          skill_level?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_assets: {
        Row: {
          asset_type: string
          bucket_id: string
          created_at: string
          file_name: string | null
          id: string
          metadata: Json
          mime_type: string | null
          project_id: string | null
          size_bytes: number | null
          storage_path: string
          user_id: string
        }
        Insert: {
          asset_type?: string
          bucket_id: string
          created_at?: string
          file_name?: string | null
          id?: string
          metadata?: Json
          mime_type?: string | null
          project_id?: string | null
          size_bytes?: number | null
          storage_path: string
          user_id: string
        }
        Update: {
          asset_type?: string
          bucket_id?: string
          created_at?: string
          file_name?: string | null
          id?: string
          metadata?: Json
          mime_type?: string | null
          project_id?: string | null
          size_bytes?: number | null
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_assets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_blueprints: {
        Row: {
          client_id: string | null
          created_at: string
          id: string
          payload: Json
          project_id: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          id?: string
          payload?: Json
          project_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          id?: string
          payload?: Json
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_blueprints_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_briefs: {
        Row: {
          approved: boolean
          assumptions: Json
          created_at: string
          deliverables: Json
          facts: Json
          id: string
          interpreted: Json
          missing_required_facts: Json
          optional_preferences: Json
          placeholders: Json
          project_id: string
          updated_at: string
          version: number
        }
        Insert: {
          approved?: boolean
          assumptions?: Json
          created_at?: string
          deliverables?: Json
          facts?: Json
          id?: string
          interpreted?: Json
          missing_required_facts?: Json
          optional_preferences?: Json
          placeholders?: Json
          project_id: string
          updated_at?: string
          version?: number
        }
        Update: {
          approved?: boolean
          assumptions?: Json
          created_at?: string
          deliverables?: Json
          facts?: Json
          id?: string
          interpreted?: Json
          missing_required_facts?: Json
          optional_preferences?: Json
          placeholders?: Json
          project_id?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_briefs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_concepts: {
        Row: {
          approved: boolean
          client_id: string
          created_at: string
          id: string
          mood: string | null
          payload: Json
          project_id: string
          revision_note: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approved?: boolean
          client_id: string
          created_at?: string
          id?: string
          mood?: string | null
          payload?: Json
          project_id: string
          revision_note?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approved?: boolean
          client_id?: string
          created_at?: string
          id?: string
          mood?: string | null
          payload?: Json
          project_id?: string
          revision_note?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_concepts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          app_name: string
          approved_concept_client_id: string | null
          category: string
          created_at: string
          current_step_id: string | null
          id: string
          idea_text: string
          metadata: Json
          mode: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          app_name?: string
          approved_concept_client_id?: string | null
          category?: string
          created_at?: string
          current_step_id?: string | null
          id?: string
          idea_text: string
          metadata?: Json
          mode?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          app_name?: string
          approved_concept_client_id?: string | null
          category?: string
          created_at?: string
          current_step_id?: string | null
          id?: string
          idea_text?: string
          metadata?: Json
          mode?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      qa_reviews: {
        Row: {
          created_at: string
          findings: Json
          id: string
          project_id: string
          summary: string
          top_fixes: Json
        }
        Insert: {
          created_at?: string
          findings?: Json
          id?: string
          project_id: string
          summary: string
          top_fixes?: Json
        }
        Update: {
          created_at?: string
          findings?: Json
          id?: string
          project_id?: string
          summary?: string
          top_fixes?: Json
        }
        Relationships: [
          {
            foreignKeyName: "qa_reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      reference_analyses: {
        Row: {
          analysis: Json
          category: string
          client_id: string | null
          created_at: string
          id: string
          image_url: string | null
          is_public: boolean
          owner_id: string | null
          project_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          analysis?: Json
          category: string
          client_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_public?: boolean
          owner_id?: string | null
          project_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          analysis?: Json
          category?: string
          client_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_public?: boolean
          owner_id?: string | null
          project_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reference_analyses_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reference_analyses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      step_verifications: {
        Row: {
          client_verification_id: string | null
          created_at: string
          id: string
          lesson_step_id: string | null
          method: string
          needs_new_submission: boolean
          passed: boolean | null
          payload: Json
          project_id: string
          verified_at: string
        }
        Insert: {
          client_verification_id?: string | null
          created_at?: string
          id?: string
          lesson_step_id?: string | null
          method: string
          needs_new_submission?: boolean
          passed?: boolean | null
          payload?: Json
          project_id: string
          verified_at?: string
        }
        Update: {
          client_verification_id?: string | null
          created_at?: string
          id?: string
          lesson_step_id?: string | null
          method?: string
          needs_new_submission?: boolean
          passed?: boolean | null
          payload?: Json
          project_id?: string
          verified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "step_verifications_lesson_step_id_fkey"
            columns: ["lesson_step_id"]
            isOneToOne: false
            referencedRelation: "lesson_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "step_verifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      refund_credits: {
        Args: {
          p_amount: number
          p_idempotency_key?: string
          p_reason: string
          p_reference_id?: string
          p_reference_type?: string
          p_user_id: string
        }
        Returns: number
      }
      spend_credits: {
        Args: {
          p_amount: number
          p_idempotency_key?: string
          p_reason: string
          p_reference_id?: string
          p_reference_type?: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

