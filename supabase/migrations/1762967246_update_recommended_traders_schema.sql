-- Migration: update_recommended_traders_schema
-- Created at: 1762967246

-- Add performance metrics columns to recommended_traders
ALTER TABLE recommended_traders 
ADD COLUMN IF NOT EXISTS trader_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS total_profit NUMERIC(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS past_month_profit NUMERIC(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS win_rate NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS total_trades INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add index for performance queries
CREATE INDEX IF NOT EXISTS idx_recommended_traders_active_order ON recommended_traders(is_active, display_order);

-- Enable RLS on recommended_traders (public read)
ALTER TABLE recommended_traders ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read active recommended traders
DROP POLICY IF EXISTS "Public read access for active traders" ON recommended_traders;
CREATE POLICY "Public read access for active traders" ON recommended_traders
  FOR SELECT USING (is_active = true);

-- Enable RLS on watchlist if not already
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own watchlist
DROP POLICY IF EXISTS "Users can view own watchlist" ON watchlist;
CREATE POLICY "Users can view own watchlist" ON watchlist
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert to their own watchlist
DROP POLICY IF EXISTS "Users can insert to own watchlist" ON watchlist;
CREATE POLICY "Users can insert to own watchlist" ON watchlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete from their own watchlist
DROP POLICY IF EXISTS "Users can delete from own watchlist" ON watchlist;
CREATE POLICY "Users can delete from own watchlist" ON watchlist
  FOR DELETE USING (auth.uid() = user_id);;