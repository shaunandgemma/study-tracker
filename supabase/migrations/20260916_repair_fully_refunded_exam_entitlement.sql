-- Step 009K5: repair the one AWS SAA-C03 entitlement whose qualifying full
-- refund was processed before the corrected Dahlia resolver was deployed.
--
-- This migration is intentionally a one-use, fail-closed data repair. It:
-- - requires the exact audited Subscription, entitlement, refund events and
--   prior entitlement history;
-- - changes only the target entitlement status and updated_at;
-- - appends exactly one full_refund audit transition;
-- - preserves every payment, Subscription, other entitlement and progress row.

BEGIN;

SELECT pg_advisory_xact_lock(
  hashtextextended('latt:20260916:full-refund-entitlement-repair', 0)
);

LOCK TABLE
  public.payment_exam_products,
  public.payment_customers,
  public.payment_exam_subscriptions,
  public.payment_webhook_events,
  public.exam_entitlement_events,
  public.exam_entitlements,
  public.learner_item_progress,
  public.exam_attempts
  IN SHARE ROW EXCLUSIVE MODE;

DO $$
DECLARE
  reconciliation_function REGPROCEDURE := to_regprocedure(
    'public.reconcile_stripe_exam_entitlement(text,text,uuid,text,boolean,text,text,text,text,text,boolean,timestamp with time zone,timestamp with time zone,timestamp with time zone,text,timestamp with time zone,text,text)'
  );
  reconciliation_definition TEXT;
  migration_count INTEGER := 0;
  matching_rows INTEGER := 0;
  updated_rows INTEGER := 0;
  inserted_rows INTEGER := 0;
  counts_before JSONB;
  counts_after JSONB;
  payment_products_before JSONB;
  payment_customers_before JSONB;
  payment_subscriptions_before JSONB;
  webhook_events_before JSONB;
  progress_before JSONB;
  attempts_before JSONB;
  non_target_entitlements_before JSONB;
  entitlement_events_before JSONB;
  payment_products_after JSONB;
  payment_customers_after JSONB;
  payment_subscriptions_after JSONB;
  webhook_events_after JSONB;
  progress_after JSONB;
  attempts_after JSONB;
  non_target_entitlements_after JSONB;
  prior_entitlement_events_after JSONB;
BEGIN
  SELECT count(*) INTO migration_count
  FROM supabase_migrations.schema_migrations
  WHERE version = '20260915';

  IF migration_count <> 1 THEN
    RAISE EXCEPTION
      '20260916 stopped: migration 20260915 is not recorded exactly once.';
  END IF;

  IF reconciliation_function IS NULL THEN
    RAISE EXCEPTION
      '20260916 stopped: the protected Stripe reconciliation function is missing.';
  END IF;

  reconciliation_definition := pg_get_functiondef(reconciliation_function);

  IF position(
       'prior_full_refund_transition_count <> 1'
       IN reconciliation_definition
     ) = 0
     OR position(
       'entitlement_event.source_reference = p_stripe_subscription_id'
       IN reconciliation_definition
     ) = 0
     OR has_function_privilege('anon', reconciliation_function, 'EXECUTE')
     OR has_function_privilege('authenticated', reconciliation_function, 'EXECUTE')
     OR NOT has_function_privilege('service_role', reconciliation_function, 'EXECUTE') THEN
    RAISE EXCEPTION
      '20260916 stopped: the deployed 20260915 reconciliation or privilege boundary differs.';
  END IF;

  SELECT jsonb_build_object(
    'payment_exam_products', (SELECT count(*) FROM public.payment_exam_products),
    'payment_customers', (SELECT count(*) FROM public.payment_customers),
    'payment_exam_subscriptions', (SELECT count(*) FROM public.payment_exam_subscriptions),
    'payment_webhook_events', (SELECT count(*) FROM public.payment_webhook_events),
    'exam_entitlement_events', (SELECT count(*) FROM public.exam_entitlement_events),
    'exam_entitlements', (SELECT count(*) FROM public.exam_entitlements),
    'learner_item_progress', (SELECT count(*) FROM public.learner_item_progress)
  ) INTO counts_before;

  IF counts_before IS DISTINCT FROM jsonb_build_object(
    'payment_exam_products', 3,
    'payment_customers', 3,
    'payment_exam_subscriptions', 3,
    'payment_webhook_events', 24,
    'exam_entitlement_events', 4,
    'exam_entitlements', 3,
    'learner_item_progress', 3
  ) THEN
    RAISE EXCEPTION
      '20260916 stopped: an approved protected baseline count changed: %.',
      counts_before;
  END IF;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.exam_id, row_value.livemode),
    '[]'::jsonb
  ) INTO payment_products_before
  FROM public.payment_exam_products row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.user_id, row_value.livemode),
    '[]'::jsonb
  ) INTO payment_customers_before
  FROM public.payment_customers row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.stripe_subscription_id),
    '[]'::jsonb
  ) INTO payment_subscriptions_before
  FROM public.payment_exam_subscriptions row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.stripe_event_id),
    '[]'::jsonb
  ) INTO webhook_events_before
  FROM public.payment_webhook_events row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.user_id, row_value.exam_id, row_value.progress_type, row_value.content_id),
    '[]'::jsonb
  ) INTO progress_before
  FROM public.learner_item_progress row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.id),
    '[]'::jsonb
  ) INTO attempts_before
  FROM public.exam_attempts row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.user_id, row_value.exam_id),
    '[]'::jsonb
  ) INTO non_target_entitlements_before
  FROM public.exam_entitlements row_value
  WHERE NOT (
    row_value.user_id = '8bf0e3bc-bed7-43bf-a4db-e8f788c19852'::uuid
    AND row_value.exam_id = 'aws-saa-c03'
  );

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.event_id),
    '[]'::jsonb
  ) INTO entitlement_events_before
  FROM public.exam_entitlement_events row_value;

  SELECT count(*) INTO matching_rows
  FROM public.payment_exam_subscriptions
  WHERE stripe_subscription_id = 'sub_1U7LH93Ne8JYQdqLKUFDoY7s'
    AND user_id = '8bf0e3bc-bed7-43bf-a4db-e8f788c19852'::uuid
    AND exam_id = 'aws-saa-c03'
    AND livemode = false
    AND stripe_customer_id = 'cus_V7aJjrJFCVjm5I'
    AND stripe_product_id = 'prod_V73CMqyLhOZvIe'
    AND stripe_price_id = 'price_1U6p6S3Ne8JYQdqLX9pxvu22'
    AND provider_status = 'past_due'
    AND cancel_at_period_end = false
    AND current_period_start = '2028-08-22 20:03:34+00'::timestamptz
    AND current_period_end = '2029-08-22 20:03:34+00'::timestamptz
    AND paid_through IS NULL
    AND latest_invoice_id = 'in_1U7LYD3Ne8JYQdqLIobN0T3Q'
    AND latest_provider_event_created_at = '2026-08-22 21:17:45+00'::timestamptz
    AND created_at = '2026-08-22 20:12:27.853114+00'::timestamptz
    AND updated_at = '2026-08-22 22:17:59.598301+00'::timestamptz;

  IF matching_rows <> 1 THEN
    RAISE EXCEPTION
      '20260916 stopped: the exact refunded Subscription precondition matched % rows.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.exam_entitlements
  WHERE user_id = '8bf0e3bc-bed7-43bf-a4db-e8f788c19852'::uuid
    AND exam_id = 'aws-saa-c03'
    AND status = 'active'
    AND starts_at = '2026-08-22 20:03:34+00'::timestamptz
    AND expires_at = '2028-08-22 20:03:34+00'::timestamptz
    AND created_at = '2026-08-22 20:12:27.865110+00'::timestamptz
    AND updated_at = '2026-08-22 20:30:09.292899+00'::timestamptz;

  IF matching_rows <> 1 THEN
    RAISE EXCEPTION
      '20260916 stopped: the exact active entitlement precondition matched % rows.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.payment_webhook_events
  WHERE stripe_event_id IN (
      'evt_3U7LYG3Ne8JYQdqL1wBsusMg',
      'evt_3U7LYG3Ne8JYQdqL1NzRE6te',
      'evt_3U7LYG3Ne8JYQdqL1EQ1GYzN'
    )
    AND provider_object_id = 'sub_1U7LH93Ne8JYQdqLKUFDoY7s'
    AND livemode = false
    AND provider_created_at = '2026-08-24 14:24:03+00'::timestamptz
    AND processing_status = 'processed'
    AND processed_at IS NOT NULL
    AND safe_error_code IS NULL
    AND (
      (stripe_event_id = 'evt_3U7LYG3Ne8JYQdqL1wBsusMg' AND event_type = 'charge.refunded')
      OR
      (stripe_event_id = 'evt_3U7LYG3Ne8JYQdqL1NzRE6te' AND event_type = 'refund.created')
      OR
      (stripe_event_id = 'evt_3U7LYG3Ne8JYQdqL1EQ1GYzN' AND event_type = 'refund.updated')
    );

  IF matching_rows <> 3 THEN
    RAISE EXCEPTION
      '20260916 stopped: the three exact processed full-refund events matched % rows.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.exam_entitlement_events
  WHERE user_id = '8bf0e3bc-bed7-43bf-a4db-e8f788c19852'::uuid
    AND exam_id = 'aws-saa-c03'
    AND source_type = 'stripe_subscription'
    AND source_reference = 'sub_1U7LH93Ne8JYQdqLKUFDoY7s';

  IF matching_rows <> 2 THEN
    RAISE EXCEPTION
      '20260916 stopped: the exact prior entitlement history contains % rows.',
      matching_rows;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.exam_entitlement_events
    WHERE user_id = '8bf0e3bc-bed7-43bf-a4db-e8f788c19852'::uuid
      AND exam_id = 'aws-saa-c03'
      AND source_type = 'stripe_subscription'
      AND source_reference = 'sub_1U7LH93Ne8JYQdqLKUFDoY7s'
      AND previous_status IS NULL
      AND new_status = 'active'
      AND previous_expiry IS NULL
      AND new_expiry = '2027-08-22 20:03:34+00'::timestamptz
      AND reason_code = 'invoice_paid'
      AND stripe_event_id = 'evt_1U7LHB3Ne8JYQdqLlvuMu8kp'
  ) OR NOT EXISTS (
    SELECT 1
    FROM public.exam_entitlement_events
    WHERE user_id = '8bf0e3bc-bed7-43bf-a4db-e8f788c19852'::uuid
      AND exam_id = 'aws-saa-c03'
      AND source_type = 'stripe_subscription'
      AND source_reference = 'sub_1U7LH93Ne8JYQdqLKUFDoY7s'
      AND previous_status = 'active'
      AND new_status = 'active'
      AND previous_expiry = '2027-08-22 20:03:34+00'::timestamptz
      AND new_expiry = '2028-08-22 20:03:34+00'::timestamptz
      AND reason_code = 'invoice_paid'
      AND stripe_event_id = 'evt_1U7LYK3Ne8JYQdqLb1E3I2lR'
  ) THEN
    RAISE EXCEPTION
      '20260916 stopped: the two exact invoice_paid entitlement transitions differ.';
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.exam_entitlement_events
  WHERE user_id = '8bf0e3bc-bed7-43bf-a4db-e8f788c19852'::uuid
    AND exam_id = 'aws-saa-c03'
    AND source_type = 'stripe_subscription'
    AND source_reference = 'sub_1U7LH93Ne8JYQdqLKUFDoY7s'
    AND reason_code = 'full_refund';

  IF matching_rows <> 0 THEN
    RAISE EXCEPTION
      '20260916 stopped: a full_refund transition already exists.';
  END IF;

  UPDATE public.exam_entitlements
  SET status = 'revoked',
      updated_at = clock_timestamp()
  WHERE user_id = '8bf0e3bc-bed7-43bf-a4db-e8f788c19852'::uuid
    AND exam_id = 'aws-saa-c03'
    AND status = 'active'
    AND starts_at = '2026-08-22 20:03:34+00'::timestamptz
    AND expires_at = '2028-08-22 20:03:34+00'::timestamptz
    AND created_at = '2026-08-22 20:12:27.865110+00'::timestamptz
    AND updated_at = '2026-08-22 20:30:09.292899+00'::timestamptz;

  GET DIAGNOSTICS updated_rows = ROW_COUNT;

  IF updated_rows <> 1 THEN
    RAISE EXCEPTION
      '20260916 stopped: the entitlement repair updated % rows.',
      updated_rows;
  END IF;

  INSERT INTO public.exam_entitlement_events (
    user_id,
    exam_id,
    source_type,
    source_reference,
    previous_status,
    new_status,
    previous_expiry,
    new_expiry,
    reason_code,
    stripe_event_id
  ) VALUES (
    '8bf0e3bc-bed7-43bf-a4db-e8f788c19852'::uuid,
    'aws-saa-c03',
    'stripe_subscription',
    'sub_1U7LH93Ne8JYQdqLKUFDoY7s',
    'active',
    'revoked',
    '2028-08-22 20:03:34+00'::timestamptz,
    '2028-08-22 20:03:34+00'::timestamptz,
    'full_refund',
    'evt_3U7LYG3Ne8JYQdqL1wBsusMg'
  );

  GET DIAGNOSTICS inserted_rows = ROW_COUNT;

  IF inserted_rows <> 1 THEN
    RAISE EXCEPTION
      '20260916 stopped: the entitlement audit append inserted % rows.',
      inserted_rows;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.exam_entitlements
    WHERE user_id = '8bf0e3bc-bed7-43bf-a4db-e8f788c19852'::uuid
      AND exam_id = 'aws-saa-c03'
      AND status = 'revoked'
      AND starts_at = '2026-08-22 20:03:34+00'::timestamptz
      AND expires_at = '2028-08-22 20:03:34+00'::timestamptz
      AND created_at = '2026-08-22 20:12:27.865110+00'::timestamptz
      AND updated_at > '2026-08-22 20:30:09.292899+00'::timestamptz
  ) THEN
    RAISE EXCEPTION
      '20260916 stopped: the exact repaired entitlement state was not verified.';
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.exam_entitlement_events
  WHERE user_id = '8bf0e3bc-bed7-43bf-a4db-e8f788c19852'::uuid
    AND exam_id = 'aws-saa-c03'
    AND source_type = 'stripe_subscription'
    AND source_reference = 'sub_1U7LH93Ne8JYQdqLKUFDoY7s'
    AND previous_status = 'active'
    AND new_status = 'revoked'
    AND previous_expiry = '2028-08-22 20:03:34+00'::timestamptz
    AND new_expiry = '2028-08-22 20:03:34+00'::timestamptz
    AND reason_code = 'full_refund'
    AND stripe_event_id = 'evt_3U7LYG3Ne8JYQdqL1wBsusMg';

  IF matching_rows <> 1 THEN
    RAISE EXCEPTION
      '20260916 stopped: the exact full_refund transition count is %.',
      matching_rows;
  END IF;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.exam_id, row_value.livemode),
    '[]'::jsonb
  ) INTO payment_products_after
  FROM public.payment_exam_products row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.user_id, row_value.livemode),
    '[]'::jsonb
  ) INTO payment_customers_after
  FROM public.payment_customers row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.stripe_subscription_id),
    '[]'::jsonb
  ) INTO payment_subscriptions_after
  FROM public.payment_exam_subscriptions row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.stripe_event_id),
    '[]'::jsonb
  ) INTO webhook_events_after
  FROM public.payment_webhook_events row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.user_id, row_value.exam_id, row_value.progress_type, row_value.content_id),
    '[]'::jsonb
  ) INTO progress_after
  FROM public.learner_item_progress row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.id),
    '[]'::jsonb
  ) INTO attempts_after
  FROM public.exam_attempts row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.user_id, row_value.exam_id),
    '[]'::jsonb
  ) INTO non_target_entitlements_after
  FROM public.exam_entitlements row_value
  WHERE NOT (
    row_value.user_id = '8bf0e3bc-bed7-43bf-a4db-e8f788c19852'::uuid
    AND row_value.exam_id = 'aws-saa-c03'
  );

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.event_id),
    '[]'::jsonb
  ) INTO prior_entitlement_events_after
  FROM public.exam_entitlement_events row_value
  WHERE NOT (
    row_value.user_id = '8bf0e3bc-bed7-43bf-a4db-e8f788c19852'::uuid
    AND row_value.exam_id = 'aws-saa-c03'
    AND row_value.stripe_event_id = 'evt_3U7LYG3Ne8JYQdqL1wBsusMg'
  );

  IF payment_products_after IS DISTINCT FROM payment_products_before
     OR payment_customers_after IS DISTINCT FROM payment_customers_before
     OR payment_subscriptions_after IS DISTINCT FROM payment_subscriptions_before
     OR webhook_events_after IS DISTINCT FROM webhook_events_before
     OR progress_after IS DISTINCT FROM progress_before
     OR attempts_after IS DISTINCT FROM attempts_before
     OR non_target_entitlements_after IS DISTINCT FROM non_target_entitlements_before
     OR prior_entitlement_events_after IS DISTINCT FROM entitlement_events_before THEN
    RAISE EXCEPTION
      '20260916 stopped: a protected non-target row changed during the repair.';
  END IF;

  SELECT jsonb_build_object(
    'payment_exam_products', (SELECT count(*) FROM public.payment_exam_products),
    'payment_customers', (SELECT count(*) FROM public.payment_customers),
    'payment_exam_subscriptions', (SELECT count(*) FROM public.payment_exam_subscriptions),
    'payment_webhook_events', (SELECT count(*) FROM public.payment_webhook_events),
    'exam_entitlement_events', (SELECT count(*) FROM public.exam_entitlement_events),
    'exam_entitlements', (SELECT count(*) FROM public.exam_entitlements),
    'learner_item_progress', (SELECT count(*) FROM public.learner_item_progress)
  ) INTO counts_after;

  IF counts_after IS DISTINCT FROM jsonb_build_object(
    'payment_exam_products', 3,
    'payment_customers', 3,
    'payment_exam_subscriptions', 3,
    'payment_webhook_events', 24,
    'exam_entitlement_events', 5,
    'exam_entitlements', 3,
    'learner_item_progress', 3
  ) THEN
    RAISE EXCEPTION
      '20260916 stopped: the final protected counts are incorrect: %.',
      counts_after;
  END IF;
END;
$$;

COMMIT;
