-- ============================================================
-- ExamPulse: exam_attempts table — idempotent migration
-- Run this in your Supabase SQL Editor.
--
-- SECURITY NOTE — NO SUPABASE AUTH IN THIS PROJECT:
-- This project currently has no user authentication (no supabase.auth,
-- no login/signup, no user session). All reads and writes use the
-- anonymous public role.
--
-- The current INSERT/SELECT policies therefore allow all anonymous users
-- to write and read ALL attempt rows. This is acceptable for a private
-- or single-user local-development scenario but is NOT suitable for
-- a public multi-user deployment without adding authentication and
-- user-scoped RLS policies (e.g. auth.uid() = user_id).
-- ============================================================

-- 1. Create the exam_attempts table (safe to re-run)
CREATE TABLE IF NOT EXISTS exam_attempts (
  id                   TEXT PRIMARY KEY,
  exam_code            TEXT NOT NULL,
  exam_mode            TEXT NOT NULL,          -- 'full' | 'targeted'
  topic_id             TEXT,                   -- set for 'targeted' mode; stores the selected topic ID
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  completed_at         TIMESTAMPTZ NOT NULL,
  score_percent        INTEGER NOT NULL,
  correct_count        INTEGER NOT NULL,
  total_questions      INTEGER NOT NULL,
  time_used_seconds    INTEGER NOT NULL,
  time_allowed_seconds INTEGER NOT NULL,
  passed               BOOLEAN NOT NULL,
  question_ids         TEXT[] NOT NULL,
  answers              JSONB NOT NULL,          -- { [questionId]: number[] }
  flagged_question_ids TEXT[],
  domain_results       JSONB,
  question_snapshot    JSONB NOT NULL           -- full shuffled question objects as presented
);

-- 2. Add question_bank_version column (idempotent — safe if column already exists)
ALTER TABLE exam_attempts
  ADD COLUMN IF NOT EXISTS question_bank_version TEXT NOT NULL DEFAULT 'saa-c03-v1';

-- 3. Enable Row Level Security (idempotent)
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;

-- 4. Recreate RLS policies (drop first so re-running is safe)
--
-- SECURITY NOTE: Because this project has no Supabase Auth, these
-- policies grant anonymous public access. Do NOT use this in a
-- production multi-user environment. When Auth is added, replace
-- USING (true) with USING (auth.uid() = user_id) and add a
-- user_id UUID NOT NULL REFERENCES auth.users(id) column.

DROP POLICY IF EXISTS "Allow public read on exam_attempts" ON exam_attempts;
CREATE POLICY "Allow public read on exam_attempts"
  ON exam_attempts
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert on exam_attempts" ON exam_attempts;
CREATE POLICY "Allow public insert on exam_attempts"
  ON exam_attempts
  FOR INSERT
  WITH CHECK (true);

-- 5. Indexes (safe to re-run with IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam_code
  ON exam_attempts (exam_code);

CREATE INDEX IF NOT EXISTS idx_exam_attempts_completed_at
  ON exam_attempts (completed_at DESC);
