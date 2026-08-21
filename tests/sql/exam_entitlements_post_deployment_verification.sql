-- Step 004H post-deployment verification.
-- Read-only catalog and empty-table inspection only.

BEGIN;
SET TRANSACTION READ ONLY;

SELECT
  to_regclass('public.exam_entitlements')::text AS table_name,
  (SELECT COUNT(*) FROM public.exam_entitlements) AS entitlement_row_count,
  (
    SELECT relrowsecurity
    FROM pg_class
    WHERE oid = 'public.exam_entitlements'::regclass
  ) AS row_level_security_enabled,
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'name', column_name,
        'type', data_type,
        'nullable', is_nullable,
        'default', column_default
      )
      ORDER BY ordinal_position
    )
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'exam_entitlements'
  ) AS columns,
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'name', policyname,
        'command', cmd,
        'roles', roles,
        'using', qual,
        'check', with_check
      )
      ORDER BY policyname
    )
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'exam_entitlements'
  ) AS policies,
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
        'type', constraint_type
      )
      ORDER BY constraint_name
    )
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'exam_entitlements'
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
