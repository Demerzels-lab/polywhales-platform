-- Migration: update_rls_policies_for_user_auth
-- Created at: 1762961486

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access on tracked_wallets" ON tracked_wallets;
DROP POLICY IF EXISTS "Allow public insert on tracked_wallets" ON tracked_wallets;
DROP POLICY IF EXISTS "Allow public delete on tracked_wallets" ON tracked_wallets;

-- Create new user-specific policies for tracked_wallets
CREATE POLICY "Users can view own wallets" ON tracked_wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallets" ON tracked_wallets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wallets" ON tracked_wallets
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallets" ON tracked_wallets
  FOR UPDATE USING (auth.uid() = user_id);

-- Service role still needs full access for edge functions
CREATE POLICY "Service role full access on tracked_wallets" ON tracked_wallets
  FOR ALL USING (auth.role() = 'service_role');

-- Update betting_activities policies to allow viewing activities from tracked wallets
DROP POLICY IF EXISTS "Allow public read access on betting_activities" ON betting_activities;

CREATE POLICY "Users can view activities from tracked wallets" ON betting_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tracked_wallets 
      WHERE tracked_wallets.wallet_address = betting_activities.wallet_address 
      AND tracked_wallets.user_id = auth.uid()
    )
  );;