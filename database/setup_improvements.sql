-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action_type TEXT NOT NULL,
  action_description TEXT,
  related_entity_type TEXT,
  related_entity_id TEXT,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_email ON activity_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action_type ON activity_logs(action_type);

-- RLS Policies
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to insert (they log their own actions)
CREATE POLICY "Users can insert their own logs" ON activity_logs
  FOR INSERT WITH CHECK (true);

-- Only allow SELECT for all (client-side filtering by role)
CREATE POLICY "Anyone can view logs" ON activity_logs
  FOR SELECT USING (true);

-- Update Miera's email
UPDATE suppliers 
SET data = jsonb_set(data, '{email}', '"najwaamira0813@gmail.com"')
WHERE data->>'email' LIKE '%miera%' OR data->>'name' ILIKE '%miera%';

-- Insert new supplier GUNZZ9XP
INSERT INTO suppliers (id, data, created_at, updated_at)
VALUES (
  'gunzz9xp-' || floor(extract(epoch from now()))::text,
  jsonb_build_object(
    'id', 'gunzz9xp-' || floor(extract(epoch from now()))::text,
    'name', 'GUNZZ9XP',
    'email', 'gunzz9xp@gmail.com',
    'phone', '60142288900',
    'status', 'active'
  ),
  NOW(),
  NOW()
);
