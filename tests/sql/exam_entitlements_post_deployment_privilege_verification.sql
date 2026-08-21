-- Step 004H post-deployment verification, remaining security details.
-- Read-only catalog inspection only.

BEGIN;
SET TRANSACTION READ ONLY;

SELECT
  jsonb_build_object(
    'anon_select', has_table_privilege('anon', 'public.exam_entitlements', 'SELECT'),
    'anon_insert', has_table_privilege('anon', 'public.exam_entitlements', 'INSERT'),
    'anon_update', has_table_privilege('anon', 'public.exam_entitlements', 'UPDATE'),
    'anon_delete', has_table_privilege('anon', 'public.exam_entitlements', 'DELETE'),
    'authenticated_select', has_table_privilege('authenticated', 'public.exam_entitlements', 'SELECT'),
    'authenticated_insert', has_table_privilege('authenticated', 'public.exam_entitlements', 'INSERT'),
    'authenticated_update', has_table_privilege('authenticated', 'public.exam_entitlements', 'UPDATE'),
    'authenticated_delete', has_table_privilege('authenticated', 'public.exam_entitlements', 'DELETE')
  ) AS browser_privileges,
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'name', constraint_name,
        'definition', pg_get_constraintdef(oid)
      )
      ORDER BY constraint_name
    )
    FROM (
      SELECT conname AS constraint_name, oid
      FROM pg_constraint
      WHERE conrelid = 'public.exam_entitlements'::regclass
    ) entitlement_constraints
  ) AS constraints,
  (
    SELECT jsonb_agg(indexname ORDER BY indexname)
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'exam_entitlements'
  ) AS indexes,
  (
    SELECT COUNT(*)
    FROM supabase_migrations.schema_migrations
    WHERE version = '20260902'
  ) AS migration_history_count;

ROLLBACK;
