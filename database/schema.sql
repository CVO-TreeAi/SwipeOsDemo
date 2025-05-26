-- SwipeOS Wallet Database Schema
-- Run this in your Supabase SQL Editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  company_name TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  logo_url TEXT,
  contact_email TEXT NOT NULL,
  phone TEXT NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notifications BOOLEAN DEFAULT true,
  dark_mode BOOLEAN DEFAULT false,
  auto_sync BOOLEAN DEFAULT true,
  location_services BOOLEAN DEFAULT false,
  analytics BOOLEAN DEFAULT true,
  UNIQUE(user_id)
);

-- Create ai_conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  last_message TEXT,
  unread_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_conversations_updated_at ON ai_conversations;
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO users (email, full_name, avatar_url, company_name, phone, is_active) 
VALUES (
  'john.doe@treeai.com',
  'John Doe',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
  'TreeAi Services',
  '+1 (555) 123-4567',
  true
) ON CONFLICT (email) DO NOTHING;

-- Get the user ID for the sample user
DO $$
DECLARE
    sample_user_id UUID;
BEGIN
    SELECT id INTO sample_user_id FROM users WHERE email = 'john.doe@treeai.com';
    
    -- Insert company data
    INSERT INTO companies (name, logo_url, contact_email, phone, owner_id)
    VALUES (
      'TreeAi Services',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop',
      'contact@treeai.com',
      '+1 (555) 123-4567',
      sample_user_id
    ) ON CONFLICT DO NOTHING;
    
    -- Insert user settings
    INSERT INTO user_settings (user_id, notifications, dark_mode, auto_sync, location_services, analytics)
    VALUES (
      sample_user_id,
      true,
      false,
      true,
      false,
      true
    ) ON CONFLICT (user_id) DO NOTHING;
    
    -- Insert AI conversation
    INSERT INTO ai_conversations (user_id, title, last_message, unread_count, is_active)
    VALUES (
      sample_user_id,
      'TreeAi Assistant',
      'How can I help you today? I''m here to assist with your tree service needs.',
      3,
      true
    ) ON CONFLICT DO NOTHING;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies for demo)
-- In production, you'd want more sophisticated policies based on authentication

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (true); -- For demo, allow all reads

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (true); -- For demo, allow all updates

-- Similar policies for other tables
CREATE POLICY "Users can view companies" ON companies
  FOR SELECT USING (true);

CREATE POLICY "Users can view settings" ON user_settings
  FOR SELECT USING (true);

CREATE POLICY "Users can update settings" ON user_settings
  FOR UPDATE USING (true);

CREATE POLICY "Users can view conversations" ON ai_conversations
  FOR SELECT USING (true);

CREATE POLICY "Users can update conversations" ON ai_conversations
  FOR UPDATE USING (true); 