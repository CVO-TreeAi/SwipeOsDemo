import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uyxnnrdyhfhlkklkpzrp.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eG5ucmR5aGZobGtrbGtwenJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNTk3MTgsImV4cCI6MjA2MzgzNTcxOH0.Gld7WP6KHsRbNmxjn6CKEyEM0E3YEcqRXe1wCwTiDUs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations with elevated privileges
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eG5ucmR5aGZobGtrbGtwenJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI1OTcxOCwiZXhwIjoyMDYzODM1NzE4fQ.YN1xmHKjsij9_2c3-j7aqNe4kFW5hgUIm0m-uH-jO2E';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          company_name?: string;
          phone?: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          company_name?: string;
          phone?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string;
          company_name?: string;
          phone?: string;
          is_active?: boolean;
        };
      };
      companies: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          logo_url?: string;
          contact_email: string;
          phone: string;
          owner_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          logo_url?: string;
          contact_email: string;
          phone: string;
          owner_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          logo_url?: string;
          contact_email?: string;
          phone?: string;
          owner_id?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          notifications: boolean;
          dark_mode: boolean;
          auto_sync: boolean;
          location_services: boolean;
          analytics: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
          notifications?: boolean;
          dark_mode?: boolean;
          auto_sync?: boolean;
          location_services?: boolean;
          analytics?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          notifications?: boolean;
          dark_mode?: boolean;
          auto_sync?: boolean;
          location_services?: boolean;
          analytics?: boolean;
        };
      };
      ai_conversations: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          title: string;
          last_message?: string;
          unread_count: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          last_message?: string;
          unread_count?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          last_message?: string;
          unread_count?: number;
          is_active?: boolean;
        };
      };
    };
  };
} 