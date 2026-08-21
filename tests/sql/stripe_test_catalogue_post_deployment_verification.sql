-- Step 008D: read-only post-deployment verification for migration 20260909.
-- This transaction cannot change data and always ends with ROLLBACK.

BEGIN;
SET TRANSACTION READ ONLY;

WITH
expected_catalogue(exam_id, stripe_product_id, stripe_annual_price_id) AS (
  VALUES
    ('aws-saa-c03', 'prod_V73CMqyLhOZvIe', 'price_1U6p6S3Ne8JYQdqLX9pxvu22'),
    ('terraform-associate-004', 'prod_V73DdOKBBVtyOf', 'price_1U6p7A3Ne8JYQdqLSFLCNE8W'),
    ('comptia-sec-plus', 'prod_V73E3DraGTbgV2', 'price_1U6p7f3Ne8JYQdqLFEQS3gPb')
),
catalogue_mismatches AS (
  SELECT exam_id, stripe_product_id, stripe_annual_price_id
  FROM expected_catalogue
  EXCEPT
  SELECT exam_id, stripe_product_id, stripe_annual_price_id
  FROM public.payment_exam_products
  WHERE livemode = FALSE

  UNION ALL

  SELECT exam_id, stripe_product_id, stripe_annual_price_id
  FROM public.payment_exam_products
  WHERE livemode = FALSE
  EXCEPT
  SELECT exam_id, stripe_product_id, stripe_annual_price_id
  FROM expected_catalogue
),
checks AS (
  SELECT
    1 AS check_order,
    'migration_20260909_recorded_once'::TEXT AS check_name,
    (SELECT COUNT(*) FROM supabase_migrations.schema_migrations WHERE version = '20260909') = 1 AS passed,
    jsonb_build_object(
      'historyRows',
      (SELECT COUNT(*) FROM supabase_migrations.schema_migrations WHERE version = '20260909')
    ) AS detail

  UNION ALL

  SELECT
    2,
    'exact_three_verified_test_mappings',
    (SELECT COUNT(*) FROM public.payment_exam_products WHERE livemode = FALSE) = 3
      AND (SELECT COUNT(*) FROM catalogue_mismatches) = 0,
    jsonb_build_object(
      'testRows', (SELECT COUNT(*) FROM public.payment_exam_products WHERE livemode = FALSE),
      'mismatches', (SELECT COUNT(*) FROM catalogue_mismatches)
    )

  UNION ALL

  SELECT
    3,
    'three_enabled_gbp_1999_yearly_catalogue_rows',
    (SELECT COUNT(*) FROM public.payment_exam_products
      WHERE livemode = FALSE
        AND currency = 'gbp'
        AND unit_amount = 1999
        AND enabled = TRUE) = 3,
    jsonb_build_object(
      'matchingRows',
      (SELECT COUNT(*) FROM public.payment_exam_products
        WHERE livemode = FALSE
          AND currency = 'gbp'
          AND unit_amount = 1999
          AND enabled = TRUE)
    )

  UNION ALL

  SELECT
    4,
    'no_live_stripe_mapping',
    NOT EXISTS (SELECT 1 FROM public.payment_exam_products WHERE livemode = TRUE),
    jsonb_build_object(
      'liveRows',
      (SELECT COUNT(*) FROM public.payment_exam_products WHERE livemode = TRUE)
    )

  UNION ALL

  SELECT
    5,
    'no_customer_subscription_webhook_or_entitlement_event',
    (SELECT COUNT(*) FROM public.payment_customers) = 0
      AND (SELECT COUNT(*) FROM public.payment_exam_subscriptions) = 0
      AND (SELECT COUNT(*) FROM public.payment_webhook_events) = 0
      AND (SELECT COUNT(*) FROM public.exam_entitlement_events) = 0,
    jsonb_build_object(
      'customers', (SELECT COUNT(*) FROM public.payment_customers),
      'subscriptions', (SELECT COUNT(*) FROM public.payment_exam_subscriptions),
      'webhooks', (SELECT COUNT(*) FROM public.payment_webhook_events),
      'entitlementEvents', (SELECT COUNT(*) FROM public.exam_entitlement_events)
    )

  UNION ALL

  SELECT
    6,
    'catalogue_has_no_direct_application_role_access',
    NOT has_table_privilege('anon', 'public.payment_exam_products', 'SELECT')
      AND NOT has_table_privilege('authenticated', 'public.payment_exam_products', 'SELECT')
      AND NOT has_table_privilege('service_role', 'public.payment_exam_products', 'SELECT')
      AND NOT has_table_privilege('anon', 'public.payment_exam_products', 'INSERT')
      AND NOT has_table_privilege('authenticated', 'public.payment_exam_products', 'INSERT')
      AND NOT has_table_privilege('service_role', 'public.payment_exam_products', 'INSERT'),
    jsonb_build_object(
      'anonSelect', has_table_privilege('anon', 'public.payment_exam_products', 'SELECT'),
      'authenticatedSelect', has_table_privilege('authenticated', 'public.payment_exam_products', 'SELECT'),
      'serviceRoleSelect', has_table_privilege('service_role', 'public.payment_exam_products', 'SELECT')
    )

  UNION ALL

  SELECT
    7,
    'learner_entitlements_remain_empty',
    (SELECT COUNT(*) FROM public.exam_entitlements) = 0,
    jsonb_build_object('entitlementRows', (SELECT COUNT(*) FROM public.exam_entitlements))

  UNION ALL

  SELECT
    8,
    'historical_exam_attempts_remain_preserved',
    (SELECT COUNT(*) FROM public.exam_attempts) = 12,
    jsonb_build_object('examAttemptRows', (SELECT COUNT(*) FROM public.exam_attempts))

  UNION ALL

  SELECT
    9,
    'learner_progress_tables_keep_rls',
    (SELECT COUNT(*)
      FROM pg_catalog.pg_class record
      JOIN pg_catalog.pg_namespace schema_record ON schema_record.oid = record.relnamespace
      WHERE schema_record.nspname = 'public'
        AND record.relname IN (
          'learner_item_progress',
          'exam_attempts',
          'user_learning_path_progress',
          'user_learning_path_resources'
        )
        AND record.relrowsecurity = TRUE) = 4,
    jsonb_build_object(
      'rlsTables',
      (SELECT COUNT(*)
        FROM pg_catalog.pg_class record
        JOIN pg_catalog.pg_namespace schema_record ON schema_record.oid = record.relnamespace
        WHERE schema_record.nspname = 'public'
          AND record.relname IN (
            'learner_item_progress',
            'exam_attempts',
            'user_learning_path_progress',
            'user_learning_path_resources'
          )
          AND record.relrowsecurity = TRUE),
      'learnerItemProgressRows', (SELECT COUNT(*) FROM public.learner_item_progress),
      'followAlongProgressRows', (SELECT COUNT(*) FROM public.user_learning_path_progress),
      'followAlongResourceRows', (SELECT COUNT(*) FROM public.user_learning_path_resources)
    )

  UNION ALL

  SELECT
    10,
    'learner_entitlement_browser_boundary_unchanged',
    NOT has_table_privilege('anon', 'public.exam_entitlements', 'SELECT')
      AND has_table_privilege('authenticated', 'public.exam_entitlements', 'SELECT')
      AND NOT has_table_privilege('authenticated', 'public.exam_entitlements', 'INSERT')
      AND NOT has_table_privilege('authenticated', 'public.exam_entitlements', 'UPDATE')
      AND NOT has_table_privilege('authenticated', 'public.exam_entitlements', 'DELETE'),
    jsonb_build_object(
      'anonSelect', has_table_privilege('anon', 'public.exam_entitlements', 'SELECT'),
      'authenticatedSelect', has_table_privilege('authenticated', 'public.exam_entitlements', 'SELECT'),
      'authenticatedWrite',
        has_table_privilege('authenticated', 'public.exam_entitlements', 'INSERT')
        OR has_table_privilege('authenticated', 'public.exam_entitlements', 'UPDATE')
        OR has_table_privilege('authenticated', 'public.exam_entitlements', 'DELETE')
    )
)
SELECT check_name, passed, detail
FROM checks
ORDER BY check_order;

ROLLBACK;
