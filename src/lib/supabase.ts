import { createClient } from '@supabase/supabase-js';

// These would normally come from environment variables
// For demo purposes, we'll use placeholder values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

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

// Database types for TreeAi
export interface Profile {
  id: string;
  user_name: string;
  company_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  type: 'profile' | 'business_id' | 'ai_assistant' | 'settings' | 'supabase';
  title: string;
  data: any;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface SwipeAction {
  id: string;
  card_id: string;
  direction: 'up' | 'down' | 'left' | 'right';
  label: string;
  action_type: string;
  action_data: any;
  created_at: string;
}

// Supabase MCP Functions
export class SupabaseMCP {
  private client = supabase;

  // Profile operations
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    try {
      const { data, error } = await this.client
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  }

  // Card operations
  async getCards(userId: string): Promise<Card[]> {
    try {
      const { data, error } = await this.client
        .from('cards')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching cards:', error);
      return [];
    }
  }

  async createCard(card: Omit<Card, 'id' | 'created_at' | 'updated_at'>): Promise<Card | null> {
    try {
      const { data, error } = await this.client
        .from('cards')
        .insert({
          ...card,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating card:', error);
      return null;
    }
  }

  async updateCard(cardId: string, updates: Partial<Card>): Promise<Card | null> {
    try {
      const { data, error } = await this.client
        .from('cards')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', cardId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating card:', error);
      return null;
    }
  }

  async deleteCard(cardId: string): Promise<boolean> {
    try {
      const { error } = await this.client
        .from('cards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting card:', error);
      return false;
    }
  }

  // Swipe action operations
  async getSwipeActions(cardId: string): Promise<SwipeAction[]> {
    try {
      const { data, error } = await this.client
        .from('swipe_actions')
        .select('*')
        .eq('card_id', cardId)
        .order('direction');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching swipe actions:', error);
      return [];
    }
  }

  async createSwipeAction(action: Omit<SwipeAction, 'id' | 'created_at'>): Promise<SwipeAction | null> {
    try {
      const { data, error } = await this.client
        .from('swipe_actions')
        .insert({
          ...action,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating swipe action:', error);
      return null;
    }
  }

  // Database management functions
  async getTables(): Promise<string[]> {
    try {
      // This would use the Supabase management API or direct SQL
      // For demo purposes, return mock data
      return ['profiles', 'cards', 'swipe_actions', 'users', 'sessions'];
    } catch (error) {
      console.error('Error fetching tables:', error);
      return [];
    }
  }

  async getTableSchema(tableName: string): Promise<any> {
    try {
      // This would fetch the actual table schema
      // For demo purposes, return mock schema
      const schemas = {
        profiles: {
          columns: [
            { name: 'id', type: 'uuid', nullable: false },
            { name: 'user_name', type: 'text', nullable: false },
            { name: 'company_name', type: 'text', nullable: true },
            { name: 'avatar_url', type: 'text', nullable: true },
            { name: 'created_at', type: 'timestamp', nullable: false },
            { name: 'updated_at', type: 'timestamp', nullable: false }
          ]
        },
        cards: {
          columns: [
            { name: 'id', type: 'uuid', nullable: false },
            { name: 'type', type: 'text', nullable: false },
            { name: 'title', type: 'text', nullable: false },
            { name: 'data', type: 'jsonb', nullable: true },
            { name: 'user_id', type: 'uuid', nullable: false },
            { name: 'created_at', type: 'timestamp', nullable: false },
            { name: 'updated_at', type: 'timestamp', nullable: false }
          ]
        }
      };
      return schemas[tableName as keyof typeof schemas] || null;
    } catch (error) {
      console.error('Error fetching table schema:', error);
      return null;
    }
  }

  async executeQuery(query: string): Promise<any> {
    try {
      // This would execute raw SQL queries
      // For security, this should be heavily restricted in production
      console.log('Executing query:', query);
      
      // Mock response for demo
      return {
        data: [],
        error: null,
        count: 0
      };
    } catch (error) {
      console.error('Error executing query:', error);
      return {
        data: null,
        error: error,
        count: 0
      };
    }
  }

  // Connection status
  async getConnectionStatus(): Promise<'connected' | 'disconnected' | 'connecting'> {
    try {
      // Test connection with a simple query
      const { error } = await this.client
        .from('profiles')
        .select('count')
        .limit(1);

      return error ? 'disconnected' : 'connected';
    } catch (error) {
      return 'disconnected';
    }
  }

  // Database statistics
  async getDatabaseStats(): Promise<{
    tables: number;
    activeConnections: number;
    lastBackup: string;
    storageUsed: string;
  }> {
    try {
      // This would fetch real database statistics
      // For demo purposes, return mock data
      return {
        tables: 12,
        activeConnections: 3,
        lastBackup: '2 hours ago',
        storageUsed: '2.4 GB'
      };
    } catch (error) {
      console.error('Error fetching database stats:', error);
      return {
        tables: 0,
        activeConnections: 0,
        lastBackup: 'Unknown',
        storageUsed: '0 GB'
      };
    }
  }
}

// Export singleton instance
export const supabaseMCP = new SupabaseMCP(); 