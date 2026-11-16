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
      profiles: {
        Row: {
          accent_color: string
          bio: string
          city: string
          contacts: Json
          created_at: string
          display_name: string
          headline: string
          id: string
          is_published: boolean
          layout_style: string
          program: string
          show_contacts: boolean
          show_skills: boolean
          skills: string[]
          updated_at: string
          username: string
        }
        Insert: {
          accent_color?: string
          bio?: string
          city?: string
          contacts?: Json
          created_at?: string
          display_name?: string
          headline?: string
          id: string
          is_published?: boolean
          layout_style?: string
          program?: string
          show_contacts?: boolean
          show_skills?: boolean
          skills?: string[]
          updated_at?: string
          username: string
        }
        Update: {
          accent_color?: string
          bio?: string
          city?: string
          contacts?: Json
          created_at?: string
          display_name?: string
          headline?: string
          id?: string
          is_published?: boolean
          layout_style?: string
          program?: string
          show_contacts?: boolean
          show_skills?: boolean
          skills?: string[]
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      project_images: {
        Row: {
          alt_text: string
          caption: string | null
          id: string
          position: number
          project_id: string
          storage_path: string
        }
        Insert: {
          alt_text?: string
          caption?: string | null
          id?: string
          position: number
          project_id: string
          storage_path: string
        }
        Update: {
          alt_text?: string
          caption?: string | null
          id?: string
          position?: number
          project_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_sources: {
        Row: {
          id: string
          label: string
          position: number
          project_id: string
          url: string
        }
        Insert: {
          id?: string
          label: string
          position: number
          project_id: string
          url: string
        }
        Update: {
          id?: string
          label?: string
          position?: number
          project_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_sources_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string
          course: string | null
          created_at: string
          id: string
          owner_id: string
          period: string | null
          role: string | null
          skills: string[]
          slug: string
          status: string
          story: Json
          summary: string
          team_size: number | null
          title: string
          tools: string[]
          updated_at: string
          work_type: string
        }
        Insert: {
          category?: string
          course?: string | null
          created_at?: string
          id?: string
          owner_id: string
          period?: string | null
          role?: string | null
          skills?: string[]
          slug: string
          status?: string
          story?: Json
          summary?: string
          team_size?: number | null
          title: string
          tools?: string[]
          updated_at?: string
          work_type?: string
        }
        Update: {
          category?: string
          course?: string | null
          created_at?: string
          id?: string
          owner_id?: string
          period?: string | null
          role?: string | null
          skills?: string[]
          slug?: string
          status?: string
          story?: Json
          summary?: string
          team_size?: number | null
          title?: string
          tools?: string[]
          updated_at?: string
          work_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_discussions: {
        Row: {
          author_id: string
          author_name: string
          body: string
          created_at: string
          id: string
          reply_to_id: string | null
          team_id: string
        }
        Insert: {
          author_id: string
          author_name: string
          body: string
          created_at?: string
          id?: string
          reply_to_id?: string | null
          team_id: string
        }
        Update: {
          author_id?: string
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          reply_to_id?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_discussions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_discussions_reply_to_id_team_id_fkey"
            columns: ["reply_to_id", "team_id"]
            isOneToOne: false
            referencedRelation: "team_discussions"
            referencedColumns: ["id", "team_id"]
          },
          {
            foreignKeyName: "team_discussions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      team_intros: {
        Row: {
          bring: string
          contact: string
          created_at: string
          id: string
          joined_at: string | null
          learn: string
          proof_url: string
          review: string
          role: string
          sender_id: string
          sender_name: string
          team_id: string
          weekly_hours: string
        }
        Insert: {
          bring: string
          contact: string
          created_at?: string
          id?: string
          joined_at?: string | null
          learn?: string
          proof_url?: string
          review?: string
          role: string
          sender_id: string
          sender_name: string
          team_id: string
          weekly_hours: string
        }
        Update: {
          bring?: string
          contact?: string
          created_at?: string
          id?: string
          joined_at?: string | null
          learn?: string
          proof_url?: string
          review?: string
          role?: string
          sender_id?: string
          sender_name?: string
          team_id?: string
          weekly_hours?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_intros_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_intros_team_id_role_fkey"
            columns: ["team_id", "role"]
            isOneToOne: false
            referencedRelation: "team_roles"
            referencedColumns: ["team_id", "title"]
          },
        ]
      }
      team_posts: {
        Row: {
          competition: string
          created_at: string
          current_members: number
          deadline: string
          id: string
          meeting_note: string
          owner_id: string
          status: string
          summary: string
          target_members: number
          title: string
          updated_at: string
          weekly_hours: number
        }
        Insert: {
          competition?: string
          created_at?: string
          current_members?: number
          deadline?: string
          id: string
          meeting_note?: string
          owner_id: string
          status?: string
          summary: string
          target_members: number
          title: string
          updated_at?: string
          weekly_hours: number
        }
        Update: {
          competition?: string
          created_at?: string
          current_members?: number
          deadline?: string
          id?: string
          meeting_note?: string
          owner_id?: string
          status?: string
          summary?: string
          target_members?: number
          title?: string
          updated_at?: string
          weekly_hours?: number
        }
        Relationships: [
          {
            foreignKeyName: "team_posts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_roles: {
        Row: {
          id: string
          position: number
          skills: string[]
          team_id: string
          title: string
        }
        Insert: {
          id?: string
          position: number
          skills?: string[]
          team_id: string
          title: string
        }
        Update: {
          id?: string
          position?: number
          skills?: string[]
          team_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_roles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_posts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
