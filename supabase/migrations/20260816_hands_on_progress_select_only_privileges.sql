-- Step 61 least-privilege follow-up discovered by post-deployment verification.
-- Remove every inherited ordinary-role table privilege, then grant SELECT only.

BEGIN;

DO $$
BEGIN
  IF to_regclass('public.hands_on_task_progress') IS NULL THEN
    RAISE EXCEPTION 'Required archive table public.hands_on_task_progress does not exist';
  END IF;
END
$$;

REVOKE ALL PRIVILEGES
  ON TABLE public.hands_on_task_progress
  FROM anon, authenticated;

GRANT SELECT
  ON TABLE public.hands_on_task_progress
  TO anon, authenticated;

DO $$
BEGIN
  IF NOT has_table_privilege('anon', 'public.hands_on_task_progress', 'SELECT')
    OR NOT has_table_privilege('authenticated', 'public.hands_on_task_progress', 'SELECT')
  THEN
    RAISE EXCEPTION 'Ordinary Supabase roles must retain SELECT on the Hands On archive';
  END IF;

  IF has_table_privilege('anon', 'public.hands_on_task_progress', 'INSERT')
    OR has_table_privilege('anon', 'public.hands_on_task_progress', 'UPDATE')
    OR has_table_privilege('anon', 'public.hands_on_task_progress', 'DELETE')
    OR has_table_privilege('anon', 'public.hands_on_task_progress', 'TRUNCATE')
    OR has_table_privilege('anon', 'public.hands_on_task_progress', 'REFERENCES')
    OR has_table_privilege('anon', 'public.hands_on_task_progress', 'TRIGGER')
    OR has_table_privilege('anon', 'public.hands_on_task_progress', 'MAINTAIN')
    OR has_table_privilege('authenticated', 'public.hands_on_task_progress', 'INSERT')
    OR has_table_privilege('authenticated', 'public.hands_on_task_progress', 'UPDATE')
    OR has_table_privilege('authenticated', 'public.hands_on_task_progress', 'DELETE')
    OR has_table_privilege('authenticated', 'public.hands_on_task_progress', 'TRUNCATE')
    OR has_table_privilege('authenticated', 'public.hands_on_task_progress', 'REFERENCES')
    OR has_table_privilege('authenticated', 'public.hands_on_task_progress', 'TRIGGER')
    OR has_table_privilege('authenticated', 'public.hands_on_task_progress', 'MAINTAIN')
  THEN
    RAISE EXCEPTION 'Ordinary Supabase roles have a non-SELECT archive privilege';
  END IF;
END
$$;

COMMIT;
