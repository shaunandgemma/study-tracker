-- Step 008E3: read-only post-deployment verification for migration 20260910.
-- This transaction cannot change data and always ends with ROLLBACK.

BEGIN;
SET TRANSACTION READ ONLY;

WITH
expected_functions(function_signature) AS (
  VALUES
    ('public.get_stripe_exam_checkout_context(uuid,text,boolean)'),
    ('public.bind_stripe_customer(uuid,boolean,text)'),
    ('public.get_stripe_portal_context(uuid,boolean)')
),
private_tables(table_name) AS (
  VALUES
    ('payment_exam_products'),
    ('payment_customers'),
    ('payment_exam_subscriptions'),
    ('payment_webhook_events'),
    ('exam_entitlement_events')
),
function_detail AS (
  SELECT
    expected.function_signature,
    to_regprocedure(expected.function_signature) IS NOT NULL AS exists,
    COALESCE(procedure_record.prosecdef, FALSE) AS security_definer,
    COALESCE(procedure_record.proconfig @> ARRAY['search_path=public, extensions'], FALSE) AS fixed_search_path,
    has_function_privilege('service_role', expected.function_signature, 'EXECUTE') AS service_execute,
    has_function_privilege('anon', expected.function_signature, 'EXECUTE') AS anon_execute,
    has_function_privilege('authenticated', expected.function_signature, 'EXECUTE') AS authenticated_execute
  FROM expected_functions expected
  LEFT JOIN pg_catalog.pg_proc procedure_record
    ON procedure_record.oid = to_regprocedure(expected.function_signature)
),
table_detail AS (
  SELECT
    private_tables.table_name,
    role_name,
    has_table_privilege(role_name, 'public.' || private_tables.table_name, 'SELECT') AS can_select,
    has_table_privilege(role_name, 'public.' || private_tables.table_name, 'INSERT') AS can_insert,
    has_table_privilege(role_name, 'public.' || private_tables.table_name, 'UPDATE') AS can_update,
    has_table_privilege(role_name, 'public.' || private_tables.table_name, 'DELETE') AS can_delete
  FROM private_tables
  CROSS JOIN (VALUES ('anon'), ('authenticated'), ('service_role')) roles(role_name)
),
checks AS (
  SELECT
    1 AS check_order,
    'migration_20260910_recorded_once'::TEXT AS check_name,
    (SELECT COUNT(*) FROM supabase_migrations.schema_migrations WHERE version = '20260910') = 1 AS passed,
    jsonb_build_object(
      'historyRows',
      (SELECT COUNT(*) FROM supabase_migrations.schema_migrations WHERE version = '20260910')
    ) AS detail

  UNION ALL

  SELECT
    2,
    'exact_three_secure_server_contracts',
    (SELECT COUNT(*) FROM function_detail WHERE exists AND security_definer AND fixed_search_path) = 3,
    jsonb_build_object(
      'expectedFunctions', 3,
      'existingSecureFunctions',
      (SELECT COUNT(*) FROM function_detail WHERE exists AND security_definer AND fixed_search_path)
    )

  UNION ALL

  SELECT
    3,
    'service_role_only_function_execution',
    NOT EXISTS (
      SELECT 1 FROM function_detail
      WHERE NOT service_execute OR anon_execute OR authenticated_execute
    ),
    jsonb_build_object(
      'serviceRoleFunctions', (SELECT COUNT(*) FROM function_detail WHERE service_execute),
      'anonFunctions', (SELECT COUNT(*) FROM function_detail WHERE anon_execute),
      'authenticatedFunctions', (SELECT COUNT(*) FROM function_detail WHERE authenticated_execute)
    )

  UNION ALL

  SELECT
    4,
    'private_payment_tables_have_no_direct_application_role_access',
    NOT EXISTS (
      SELECT 1 FROM table_detail
      WHERE can_select OR can_insert OR can_update OR can_delete
    ),
    jsonb_build_object(
      'roleTablePairsChecked', (SELECT COUNT(*) FROM table_detail),
      'privilegedPairs', (SELECT COUNT(*) FROM table_detail WHERE can_select OR can_insert OR can_update OR can_delete)
    )

  UNION ALL

  SELECT
    5,
    'payment_catalogue_and_empty_activity_preserved',
    (SELECT COUNT(*) FROM public.payment_exam_products) = 3
      AND (SELECT COUNT(*) FROM public.payment_customers) = 0
      AND (SELECT COUNT(*) FROM public.payment_exam_subscriptions) = 0
      AND (SELECT COUNT(*) FROM public.payment_webhook_events) = 0
      AND (SELECT COUNT(*) FROM public.exam_entitlement_events) = 0,
    jsonb_build_object(
      'products', (SELECT COUNT(*) FROM public.payment_exam_products),
      'customers', (SELECT COUNT(*) FROM public.payment_customers),
      'subscriptions', (SELECT COUNT(*) FROM public.payment_exam_subscriptions),
      'webhooks', (SELECT COUNT(*) FROM public.payment_webhook_events),
      'entitlementEvents', (SELECT COUNT(*) FROM public.exam_entitlement_events)
    )

  UNION ALL

  SELECT
    6,
    'entitlement_and_progress_rows_preserved',
    (SELECT COUNT(*) FROM public.exam_entitlements) = 0
      AND (SELECT COUNT(*) FROM public.exam_attempts) = 12
      AND (SELECT COUNT(*) FROM public.learner_item_progress) = 0
      AND (SELECT COUNT(*) FROM public.user_learning_path_progress) = 35
      AND (SELECT COUNT(*) FROM public.user_learning_path_resources) = 35,
    jsonb_build_object(
      'entitlements', (SELECT COUNT(*) FROM public.exam_entitlements),
      'examAttempts', (SELECT COUNT(*) FROM public.exam_attempts),
      'learnerItemProgress', (SELECT COUNT(*) FROM public.learner_item_progress),
      'followAlongProgress', (SELECT COUNT(*) FROM public.user_learning_path_progress),
      'followAlongResources', (SELECT COUNT(*) FROM public.user_learning_path_resources)
    )
)
SELECT check_name, passed, detail
FROM checks
ORDER BY check_order;

ROLLBACK;
