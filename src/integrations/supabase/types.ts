export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          background_url: string | null
          created_at: string
          date: string
          id: string
          main_background_url: string | null
          time: string
          type: string
          venue: string
        }
        Insert: {
          background_url?: string | null
          created_at?: string
          date: string
          id?: string
          main_background_url?: string | null
          time: string
          type: string
          venue: string
        }
        Update: {
          background_url?: string | null
          created_at?: string
          date?: string
          id?: string
          main_background_url?: string | null
          time?: string
          type?: string
          venue?: string
        }
        Relationships: []
      }
      guests: {
        Row: {
          accommodation_count: number | null
          accommodation_required: boolean | null
          attributes: string[] | null
          created_at: string
          email: string | null
          events: string[] | null
          host_id: string | null
          id: string
          invitation_sent: boolean | null
          name: string
          phone: string | null
          plus_count: number | null
          rsvp_status: string | null
        }
        Insert: {
          accommodation_count?: number | null
          accommodation_required?: boolean | null
          attributes?: string[] | null
          created_at?: string
          email?: string | null
          events?: string[] | null
          host_id?: string | null
          id?: string
          invitation_sent?: boolean | null
          name: string
          phone?: string | null
          plus_count?: number | null
          rsvp_status?: string | null
        }
        Update: {
          accommodation_count?: number | null
          accommodation_required?: boolean | null
          attributes?: string[] | null
          created_at?: string
          email?: string | null
          events?: string[] | null
          host_id?: string | null
          id?: string
          invitation_sent?: boolean | null
          name?: string
          phone?: string | null
          plus_count?: number | null
          rsvp_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guests_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "hosts"
            referencedColumns: ["id"]
          },
        ]
      }
      hosts: {
        Row: {
          admin_password: string | null
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          is_admin: boolean | null
          name: string
          phone: string
        }
        Insert: {
          admin_password?: string | null
          avatar_url?: string | null
          created_at?: string
          email: string
          id?: string
          is_admin?: boolean | null
          name: string
          phone: string
        }
        Update: {
          admin_password?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          is_admin?: boolean | null
          name?: string
          phone?: string
        }
        Relationships: []
      }
      invitation_templates: {
        Row: {
          created_at: string
          email_content: string | null
          id: string
          name: string
          subject: string | null
          whatsapp_content: string | null
        }
        Insert: {
          created_at?: string
          email_content?: string | null
          id?: string
          name: string
          subject?: string | null
          whatsapp_content?: string | null
        }
        Update: {
          created_at?: string
          email_content?: string | null
          id?: string
          name?: string
          subject?: string | null
          whatsapp_content?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
