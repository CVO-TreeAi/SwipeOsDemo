-- SwipeOS Wallet V2 Database Schema
-- New tables for expanded card types and features

-- Card types table
CREATE TABLE IF NOT EXISTS card_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  category TEXT NOT NULL,
  template_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- User cards table with flexible JSONB storage
CREATE TABLE IF NOT EXISTS user_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  card_type_id UUID REFERENCES card_types(id),
  name TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}', -- Flexible storage for different card data
  position INTEGER DEFAULT 0,
  is_favorite BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Card transactions/activity log
CREATE TABLE IF NOT EXISTS card_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES user_cards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL, -- 'used', 'updated', 'shared', 'viewed'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert default card types
INSERT INTO card_types (name, icon, category, template_config) VALUES
-- Original cards
('profile', 'user', 'identity', '{"fields": ["name", "company", "avatar"]}'),
('business_id', 'briefcase', 'identity', '{"fields": ["company_name", "email", "phone"]}'),
('settings', 'cog', 'system', '{"fields": ["notifications", "theme", "security"]}'),
('ai_assistant', 'robot', 'system', '{"fields": ["unread_count", "last_message"]}'),

-- New digital asset cards
('loyalty', 'star', 'rewards', '{"fields": ["store_name", "points", "member_number", "barcode"]}'),
('gift_card', 'gift', 'payment', '{"fields": ["store_name", "balance", "card_number", "pin"]}'),
('membership', 'id-card', 'identity', '{"fields": ["organization", "member_id", "member_type", "valid_until"]}'),
('transit', 'train', 'travel', '{"fields": ["agency", "pass_type", "balance", "expires"]}'),
('event_ticket', 'ticket', 'entertainment', '{"fields": ["event_name", "date", "seat", "qr_code"]}'),
('insurance', 'shield', 'documents', '{"fields": ["provider", "policy_number", "group_number", "member_id"]}'),
('id_card', 'id-badge', 'identity', '{"fields": ["type", "number", "expires", "photo"]}'),
('key_card', 'key', 'access', '{"fields": ["location", "room_number", "access_level", "expires"]}'),
('coupon', 'tag', 'rewards', '{"fields": ["merchant", "discount", "code", "expires"]}'),
('crypto_wallet', 'wallet', 'payment', '{"fields": ["currency", "address", "balance", "network"]}')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX idx_user_cards_user_id ON user_cards(user_id);
CREATE INDEX idx_user_cards_position ON user_cards(position);
CREATE INDEX idx_user_cards_archived ON user_cards(is_archived);
CREATE INDEX idx_card_transactions_card_id ON card_transactions(card_id);
CREATE INDEX idx_card_transactions_created_at ON card_transactions(created_at);

-- Create RLS policies
ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_transactions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own cards
CREATE POLICY "Users can view own cards" ON user_cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cards" ON user_cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cards" ON user_cards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cards" ON user_cards
  FOR DELETE USING (auth.uid() = user_id);

-- Users can only see their own transactions
CREATE POLICY "Users can view own transactions" ON card_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON card_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_cards_updated_at BEFORE UPDATE ON user_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 