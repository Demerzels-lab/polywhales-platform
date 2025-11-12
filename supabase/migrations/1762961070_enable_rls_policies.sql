-- Migration: enable_rls_policies
-- Created at: 1762961070

-- Enable RLS on all tables
ALTER TABLE tracked_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE betting_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow public read access for tracked_wallets
CREATE POLICY "Allow public read access on tracked_wallets" ON tracked_wallets
  FOR SELECT USING (true);

-- Allow public insert on tracked_wallets (for adding wallets from frontend)
CREATE POLICY "Allow public insert on tracked_wallets" ON tracked_wallets
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

-- Allow public delete on tracked_wallets
CREATE POLICY "Allow public delete on tracked_wallets" ON tracked_wallets
  FOR DELETE USING (true);

-- Allow public read access for betting_activities
CREATE POLICY "Allow public read access on betting_activities" ON betting_activities
  FOR SELECT USING (true);

-- Allow service role to insert betting_activities
CREATE POLICY "Allow service role insert on betting_activities" ON betting_activities
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

-- Allow public read access for telegram_subscriptions
CREATE POLICY "Allow public read access on telegram_subscriptions" ON telegram_subscriptions
  FOR SELECT USING (true);

-- Allow service role to insert/update telegram_subscriptions
CREATE POLICY "Allow insert on telegram_subscriptions" ON telegram_subscriptions
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow update on telegram_subscriptions" ON telegram_subscriptions
  FOR UPDATE USING (auth.role() IN ('anon', 'service_role'));

-- Allow service role full access to user_preferences
CREATE POLICY "Allow service role on user_preferences" ON user_preferences
  FOR ALL USING (auth.role() IN ('anon', 'service_role'));

-- Allow service role full access to notifications
CREATE POLICY "Allow service role on notifications" ON notifications
  FOR ALL USING (auth.role() IN ('anon', 'service_role'));;