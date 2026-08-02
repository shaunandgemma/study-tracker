-- ============================================================
-- ExamPulse / Study Tracker: user_aws_connections migration
-- Idempotent migration script for AWS account connections table
-- ============================================================

-- 1. Create the user_aws_connections table (safe to re-run)
CREATE TABLE IF NOT EXISTS user_aws_connections (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           TEXT NOT NULL UNIQUE,                     -- Unique 1 connection per user
  aws_account_id    VARCHAR(12) NOT NULL,
  role_arn          TEXT NOT NULL,
  external_id       TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'disconnected',     -- 'connected' | 'simulation' | 'disconnected' | 'failed' | 'access_denied' | 'account_mismatch' | 'role_unavailable' | 'expired'
  last_verified_at  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add database indexes (idempotent)
CREATE INDEX IF NOT EXISTS idx_user_aws_connections_user_id ON user_aws_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_aws_connections_account_id ON user_aws_connections(aws_account_id);

-- 3. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_user_aws_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_user_aws_connections_updated_at ON user_aws_connections;
CREATE TRIGGER trigger_user_aws_connections_updated_at
  BEFORE UPDATE ON user_aws_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_user_aws_connections_updated_at();

-- 4. Enable Row Level Security
ALTER TABLE user_aws_connections ENABLE ROW LEVEL SECURITY;

-- 5. Recreate RLS Policies (idempotent — drop first)
-- STRICT AUTHENTICATED USER RLS: Requires auth.uid()::text = user_id
DROP POLICY IF EXISTS "Allow read own user_aws_connections" ON user_aws_connections;
CREATE POLICY "Allow read own user_aws_connections"
  ON user_aws_connections
  FOR SELECT
  USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Allow insert own user_aws_connections" ON user_aws_connections;
CREATE POLICY "Allow insert own user_aws_connections"
  ON user_aws_connections
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Allow update own user_aws_connections" ON user_aws_connections;
CREATE POLICY "Allow update own user_aws_connections"
  ON user_aws_connections
  FOR UPDATE
  USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Allow delete own user_aws_connections" ON user_aws_connections;
CREATE POLICY "Allow delete own user_aws_connections"
  ON user_aws_connections
  FOR DELETE
  USING (auth.uid()::text = user_id);
