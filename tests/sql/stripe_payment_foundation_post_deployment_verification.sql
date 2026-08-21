-- LATT Step 008B3: read-only post-deployment verification for migration 20260908.
-- Run in the linked Supabase SQL Editor. Every statement is inside a read-only
-- transaction and the transaction always ends with ROLLBACK.

BEGIN;
SET TRANSACTION READ ONLY;

WITH
expected_payment_tables(table_name) AS (
  VALUES
    ('payment_exam_products'),
    ('payment_customers'),
    ('payment_exam_subscriptions'),
    ('payment_webhook_events'),
    ('exam_entitlement_events')
),
payment_row_counts AS (
  SELECT jsonb_build_object(
    'payment_exam_products', (SELECT COUNT(*) FROM public.payment_exam_products),
    'payment_customers', (SELECT COUNT(*) FROM public.payment_customers),
    'payment_exam_subscriptions', (SELECT COUNT(*) FROM public.payment_exam_subscriptions),
    'payment_webhook_events', (SELECT COUNT(*) FROM public.payment_webhook_events),
    'exam_entitlement_events', (SELECT COUNT(*) FROM public.exam_entitlement_events)
  ) AS counts,
  (
    (SELECT COUNT(*) FROM public.payment_exam_products)
    + (SELECT COUNT(*) FROM public.payment_customers)
    + (SELECT COUNT(*) FROM public.payment_exam_subscriptions)
    + (SELECT COUNT(*) FROM public.payment_webhook_events)
    + (SELECT COUNT(*) FROM public.exam_entitlement_events)
  ) AS total_rows
),
function_identity AS (
  SELECT to_regprocedure(
    'public.reconcile_stripe_exam_entitlement(text,text,uuid,text,boolean,text,text,text,text,text,boolean,timestamp with time zone,timestamp with time zone,timestamp with time zone,text,timestamp with time zone,text,text)'
  ) AS function_oid
),
checks(check_order, check_name, passed, detail) AS (
  SELECT
    1,
    'migration_20260908_recorded_once',
    (SELECT COUNT(*) FROM supabase_migrations.schema_migrations WHERE version = '20260908') = 1,
    format(
      'history rows: %s',
      (SELECT COUNT(*) FROM supabase_migrations.schema_migrations WHERE version = '20260908')
    )

  UNION ALL

  SELECT
    2,
    'five_expected_payment_tables_exist',
    (
      SELECT COUNT(*)
      FROM expected_payment_tables expected
      JOIN pg_catalog.pg_class relation
        ON relation.relname = expected.table_name
      JOIN pg_catalog.pg_namespace schema_record
        ON schema_record.oid = relation.relnamespace
       AND schema_record.nspname = 'public'
       AND relation.relkind = 'r'
    ) = 5,
    format(
      'tables found: %s of 5',
      (
        SELECT COUNT(*)
        FROM expected_payment_tables expected
        JOIN pg_catalog.pg_class relation
          ON relation.relname = expected.table_name
        JOIN pg_catalog.pg_namespace schema_record
          ON schema_record.oid = relation.relnamespace
         AND schema_record.nspname = 'public'
         AND relation.relkind = 'r'
      )
    )

  UNION ALL

  SELECT
    3,
    'payment_foundation_is_empty',
    total_rows = 0,
    counts::TEXT
  FROM payment_row_counts

  UNION ALL

  SELECT
    4,
    'rls_enabled_on_all_payment_tables',
    (
      SELECT COUNT(*)
      FROM expected_payment_tables expected
      JOIN pg_catalog.pg_class relation
        ON relation.relname = expected.table_name
      JOIN pg_catalog.pg_namespace schema_record
        ON schema_record.oid = relation.relnamespace
       AND schema_record.nspname = 'public'
      WHERE relation.relrowsecurity = TRUE
    ) = 5,
    format(
      'RLS tables: %s of 5',
      (
        SELECT COUNT(*)
        FROM expected_payment_tables expected
        JOIN pg_catalog.pg_class relation
          ON relation.relname = expected.table_name
        JOIN pg_catalog.pg_namespace schema_record
          ON schema_record.oid = relation.relnamespace
         AND schema_record.nspname = 'public'
        WHERE relation.relrowsecurity = TRUE
      )
    )

  UNION ALL

  SELECT
    5,
    'payment_tables_have_no_application_policy',
    (
      SELECT COUNT(*)
      FROM pg_catalog.pg_policies policy
      JOIN expected_payment_tables expected
        ON expected.table_name = policy.tablename
      WHERE policy.schemaname = 'public'
    ) = 0,
    format(
      'policies found: %s',
      (
        SELECT COUNT(*)
        FROM pg_catalog.pg_policies policy
        JOIN expected_payment_tables expected
          ON expected.table_name = policy.tablename
        WHERE policy.schemaname = 'public'
      )
    )

  UNION ALL

  SELECT
    6,
    'application_roles_have_no_direct_payment_table_privilege',
    (
      SELECT COUNT(*)
      FROM expected_payment_tables expected
      CROSS JOIN (
        VALUES ('anon'), ('authenticated'), ('service_role')
      ) role_record(role_name)
      CROSS JOIN (
        VALUES
          ('SELECT'), ('INSERT'), ('UPDATE'), ('DELETE'),
          ('TRUNCATE'), ('REFERENCES'), ('TRIGGER')
      ) privilege_record(privilege_name)
      WHERE has_table_privilege(
        role_record.role_name,
        'public.' || expected.table_name,
        privilege_record.privilege_name
      )
    ) = 0,
    format(
      'unexpected grants: %s',
      (
        SELECT COUNT(*)
        FROM expected_payment_tables expected
        CROSS JOIN (
          VALUES ('anon'), ('authenticated'), ('service_role')
        ) role_record(role_name)
        CROSS JOIN (
          VALUES
            ('SELECT'), ('INSERT'), ('UPDATE'), ('DELETE'),
            ('TRUNCATE'), ('REFERENCES'), ('TRIGGER')
        ) privilege_record(privilege_name)
        WHERE has_table_privilege(
          role_record.role_name,
          'public.' || expected.table_name,
          privilege_record.privilege_name
        )
      )
    )

  UNION ALL

  SELECT
    7,
    'reconciliation_function_is_security_definer',
    function_oid IS NOT NULL
      AND COALESCE((SELECT prosecdef FROM pg_catalog.pg_proc WHERE oid = function_oid), FALSE),
    format('function oid: %s', COALESCE(function_oid::TEXT, 'missing'))
  FROM function_identity

  UNION ALL

  SELECT
    8,
    'reconciliation_function_is_service_role_only',
    function_oid IS NOT NULL
      AND NOT has_function_privilege('anon', function_oid, 'EXECUTE')
      AND NOT has_function_privilege('authenticated', function_oid, 'EXECUTE')
      AND has_function_privilege('service_role', function_oid, 'EXECUTE'),
    CASE
      WHEN function_oid IS NULL THEN 'function missing'
      ELSE format(
        'anon=%s authenticated=%s service_role=%s',
        has_function_privilege('anon', function_oid, 'EXECUTE'),
        has_function_privilege('authenticated', function_oid, 'EXECUTE'),
        has_function_privilege('service_role', function_oid, 'EXECUTE')
      )
    END
  FROM function_identity

  UNION ALL

  SELECT
    9,
    'reconciliation_function_has_fixed_search_path',
    function_oid IS NOT NULL
      AND COALESCE(
        (SELECT proconfig @> ARRAY['search_path=public, extensions']
         FROM pg_catalog.pg_proc WHERE oid = function_oid),
        FALSE
      ),
    COALESCE(
      (SELECT array_to_string(proconfig, '; ')
       FROM pg_catalog.pg_proc WHERE oid = function_oid),
      'function missing'
    )
  FROM function_identity

  UNION ALL

  SELECT
    10,
    'learner_entitlement_browser_privileges_unchanged',
    NOT has_table_privilege('anon', 'public.exam_entitlements', 'SELECT')
      AND has_table_privilege('authenticated', 'public.exam_entitlements', 'SELECT')
      AND NOT has_table_privilege('authenticated', 'public.exam_entitlements', 'INSERT')
      AND NOT has_table_privilege('authenticated', 'public.exam_entitlements', 'UPDATE')
      AND NOT has_table_privilege('authenticated', 'public.exam_entitlements', 'DELETE'),
    format(
      'anon_select=%s authenticated_select=%s authenticated_write=%s',
      has_table_privilege('anon', 'public.exam_entitlements', 'SELECT'),
      has_table_privilege('authenticated', 'public.exam_entitlements', 'SELECT'),
      has_table_privilege('authenticated', 'public.exam_entitlements', 'INSERT')
        OR has_table_privilege('authenticated', 'public.exam_entitlements', 'UPDATE')
        OR has_table_privilege('authenticated', 'public.exam_entitlements', 'DELETE')
    )

  UNION ALL

  SELECT
    11,
    'learner_entitlement_rls_policy_unchanged',
    COALESCE(
      (SELECT relrowsecurity
       FROM pg_catalog.pg_class
       WHERE oid = 'public.exam_entitlements'::regclass),
      FALSE
    )
      AND (
        SELECT COUNT(*)
        FROM pg_catalog.pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'exam_entitlements'
          AND policyname = 'Learners read own exam entitlements'
          AND cmd = 'SELECT'
      ) = 1
      AND NOT EXISTS (
        SELECT 1
        FROM pg_catalog.pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'exam_entitlements'
          AND cmd <> 'SELECT'
      ),
    format(
      'SELECT policies=%s write policies=%s',
      (
        SELECT COUNT(*)
        FROM pg_catalog.pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'exam_entitlements'
          AND cmd = 'SELECT'
      ),
      (
        SELECT COUNT(*)
        FROM pg_catalog.pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'exam_entitlements'
          AND cmd <> 'SELECT'
      )
    )

  UNION ALL

  SELECT
    12,
    'existing_content_and_progress_tables_keep_rls',
    (
      SELECT COUNT(*)
      FROM pg_catalog.pg_class relation
      JOIN pg_catalog.pg_namespace schema_record
        ON schema_record.oid = relation.relnamespace
      WHERE schema_record.nspname = 'public'
        AND relation.relname IN (
          'learner_content_items',
          'learner_item_progress',
          'exam_attempts',
          'user_learning_path_progress',
          'user_learning_path_resources'
        )
        AND relation.relrowsecurity = TRUE
    ) = 5,
    format(
      'RLS tables: %s of 5',
      (
        SELECT COUNT(*)
        FROM pg_catalog.pg_class relation
        JOIN pg_catalog.pg_namespace schema_record
          ON schema_record.oid = relation.relnamespace
        WHERE schema_record.nspname = 'public'
          AND relation.relname IN (
            'learner_content_items',
            'learner_item_progress',
            'exam_attempts',
            'user_learning_path_progress',
            'user_learning_path_resources'
          )
          AND relation.relrowsecurity = TRUE
      )
    )
)
SELECT check_name, passed, detail
FROM checks
ORDER BY check_order;

ROLLBACK;
