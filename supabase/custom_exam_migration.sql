-- ============================================================
-- ExamPulse: Custom Exam Mode Idempotent Schema Migration
-- Safe to run in Supabase SQL Editor.
-- Adds optional metadata columns for Custom Exam mode while preserving all existing attempts.
-- ============================================================

-- 1. Ensure exam_mode allows 'custom' (column type is TEXT; no ENUM or CHECK constraint blocking 'custom')

-- 2. Add optional metadata columns for Custom Exam attempts (idempotent)
ALTER TABLE exam_attempts
  ADD COLUMN IF NOT EXISTS selection_type TEXT,                -- 'balanced' | 'random' | 'all'
  ADD COLUMN IF NOT EXISTS requested_question_count INTEGER,    -- requested question count
  ADD COLUMN IF NOT EXISTS actual_question_count INTEGER,       -- actual question count selected
  ADD COLUMN IF NOT EXISTS timer_type TEXT,                     -- 'timed' | 'untimed'
  ADD COLUMN IF NOT EXISTS domain_allocation JSONB;             -- JSON map of actual domain question distribution

-- 3. Add index for exam_mode filtering (idempotent)
CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam_mode
  ON exam_attempts (exam_mode);
