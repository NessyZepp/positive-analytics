export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      analytics_reports: {
        Row: {
          id: string
          twitch_username: string
          report_data: Json
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          twitch_username: string
          report_data: Json
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          twitch_username?: string
          report_data?: Json
          created_at?: string
          expires_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clean_expired_reports: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
