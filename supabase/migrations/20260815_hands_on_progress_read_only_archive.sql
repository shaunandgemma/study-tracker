-- Step 61: retain historical Hands On progress as a read-only archive.
-- This migration changes permissions only. It does not update or delete rows.
-- It does not alter hands_on_tasks or any Follow Along, exam, auth, or AWS table.

BEGIN;

DO $$
BEGIN
  IF to_regclass('public.hands_on_task_progress') IS NULL THEN
    RAISE EXCEPTION 'Required archive table public.hands_on_task_progress does not exist';
  END IF;
END
$$;

ALTER TABLE public.hands_on_task_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own task progress"
  ON public.hands_on_task_progress;

DROP POLICY IF EXISTS "Users can update own task progress"
  ON public.hands_on_task_progress;

DROP POLICY IF EXISTS "Users can delete own task progress"
  ON public.hands_on_task_progress;

-- RLS already blocks these operations after the policies are removed. Revoking
-- the table privileges provides a second, explicit read-only boundary.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE
  ON TABLE public.hands_on_task_progress
  FROM anon, authenticated;

GRANT SELECT
  ON TABLE public.hands_on_task_progress
  TO anon, authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'hands_on_task_progress'
      AND policyname = 'Users can view own task progress'
      AND cmd = 'SELECT'
  ) THEN
    RAISE EXCEPTION 'The historical Hands On SELECT policy must remain present';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'hands_on_task_progress'
      AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
  ) THEN
    RAISE EXCEPTION 'A Hands On progress write policy remains after archival';
  END IF;

  IF has_table_privilege('anon', 'public.hands_on_task_progress', 'INSERT')
    OR has_table_privilege('anon', 'public.hands_on_task_progress', 'UPDATE')
    OR has_table_privilege('anon', 'public.hands_on_task_progress', 'DELETE')
    OR has_table_privilege('anon', 'public.hands_on_task_progress', 'TRUNCATE')
    OR has_table_privilege('authenticated', 'public.hands_on_task_progress', 'INSERT')
    OR has_table_privilege('authenticated', 'public.hands_on_task_progress', 'UPDATE')
    OR has_table_privilege('authenticated', 'public.hands_on_task_progress', 'DELETE')
    OR has_table_privilege('authenticated', 'public.hands_on_task_progress', 'TRUNCATE')
  THEN
    RAISE EXCEPTION 'Ordinary Supabase roles still have Hands On progress write privileges';
  END IF;
END
$$;

COMMENT ON TABLE public.hands_on_task_progress IS
  'Read-only historical Hands On progress archive retained by approved Step 59 policy.';

COMMIT;

-- ROLLBACK NOTE (manual and separately approved only):
-- Re-grant INSERT, UPDATE, and DELETE to authenticated, then recreate the three
-- original own-row policies from 20260801_hands_on_tasks.sql. Do not edit the
-- original migration and do not apply this rollback without explicit approval.
