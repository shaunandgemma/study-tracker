-- Step 009N1: repair the preserved paid Subscription's missing paid-through.
--
-- This is an exact, one-use, fail-closed data repair. It updates only
-- payment_exam_subscriptions.paid_through for the audited AWS SAA-C03
-- sandbox Subscription and preserves every other protected row and field.

BEGIN;

SELECT pg_advisory_xact_lock(
  hashtextextended('latt:20260917:preserved-paid-through-repair', 0)
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
  counts_before JSONB;
  counts_after JSONB;
  products_before JSONB;
  products_after JSONB;
  customers_before JSONB;
  customers_after JSONB;
  non_target_subscriptions_before JSONB;
  non_target_subscriptions_after JSONB;
  target_subscription_before JSONB;
  target_subscription_after JSONB;
  webhook_events_before JSONB;
  webhook_events_after JSONB;
  entitlements_before JSONB;
  entitlements_after JSONB;
  entitlement_events_before JSONB;
  entitlement_events_after JSONB;
  progress_before JSONB;
  progress_after JSONB;
  attempts_before JSONB;
  attempts_after JSONB;
BEGIN
  SELECT count(*) INTO migration_count
  FROM supabase_migrations.schema_migrations
  WHERE version IN ('20260912', '20260913', '20260914', '20260915', '20260916');

  IF migration_count <> 5 THEN
    RAISE EXCEPTION
      '20260917 stopped: migrations 20260912 through 20260916 are not each recorded exactly once.';
  END IF;

  IF reconciliation_function IS NULL THEN
    RAISE EXCEPTION
      '20260917 stopped: the protected Stripe reconciliation function is missing.';
  END IF;

  reconciliation_definition := pg_get_functiondef(reconciliation_function);

  IF position(
       'ELSE payment_exam_subscriptions.paid_through'
       IN reconciliation_definition
     ) = 0
     OR position(
       'ELSE payment_exam_subscriptions.latest_invoice_id'
       IN reconciliation_definition
     ) = 0
     OR position(
       'prior_full_refund_transition_count <> 1'
       IN reconciliation_definition
     ) = 0
     OR has_function_privilege('anon', reconciliation_function, 'EXECUTE')
     OR has_function_privilege('authenticated', reconciliation_function, 'EXECUTE')
     OR NOT has_function_privilege('service_role', reconciliation_function, 'EXECUTE') THEN
    RAISE EXCEPTION
      '20260917 stopped: the deployed reconciliation or privilege boundary differs from the audited contract.';
  END IF;

  SELECT jsonb_build_object(
    'payment_exam_products', (SELECT count(*) FROM public.payment_exam_products),
    'payment_customers', (SELECT count(*) FROM public.payment_customers),
    'payment_exam_subscriptions', (SELECT count(*) FROM public.payment_exam_subscriptions),
    'payment_webhook_events', (SELECT count(*) FROM public.payment_webhook_events),
    'exam_entitlement_events', (SELECT count(*) FROM public.exam_entitlement_events),
    'exam_entitlements', (SELECT count(*) FROM public.exam_entitlements),
    'learner_item_progress', (SELECT count(*) FROM public.learner_item_progress),
    'exam_attempts', (SELECT count(*) FROM public.exam_attempts)
  ) INTO counts_before;

  IF counts_before IS DISTINCT FROM jsonb_build_object(
    'payment_exam_products', 3,
    'payment_customers', 3,
    'payment_exam_subscriptions', 3,
    'payment_webhook_events', 25,
    'exam_entitlement_events', 6,
    'exam_entitlements', 3,
    'learner_item_progress', 3,
    'exam_attempts', 12
  ) THEN
    RAISE EXCEPTION
      '20260917 stopped: an approved protected baseline count changed: %.',
      counts_before;
  END IF;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.exam_id, row_value.livemode),
    '[]'::jsonb
  ) INTO products_before
  FROM public.payment_exam_products row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.user_id, row_value.livemode),
    '[]'::jsonb
  ) INTO customers_before
  FROM public.payment_customers row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.stripe_subscription_id),
    '[]'::jsonb
  ) INTO non_target_subscriptions_before
  FROM public.payment_exam_subscriptions row_value
  WHERE row_value.stripe_subscription_id <> 'sub_1U6ser3Ne8JYQdqLp5IpnM4x';

  SELECT to_jsonb(row_value) - 'paid_through'
  INTO target_subscription_before
  FROM public.payment_exam_subscriptions row_value
  WHERE row_value.stripe_subscription_id = 'sub_1U6ser3Ne8JYQdqLp5IpnM4x';

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.stripe_event_id),
    '[]'::jsonb
  ) INTO webhook_events_before
  FROM public.payment_webhook_events row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.user_id, row_value.exam_id),
    '[]'::jsonb
  ) INTO entitlements_before
  FROM public.exam_entitlements row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.event_id),
    '[]'::jsonb
  ) INTO entitlement_events_before
  FROM public.exam_entitlement_events row_value;

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

  SELECT count(*) INTO matching_rows
  FROM public.payment_exam_products
  WHERE exam_id = 'aws-saa-c03'
    AND livemode = false
    AND stripe_product_id = 'prod_V73CMqyLhOZvIe'
    AND stripe_annual_price_id = 'price_1U6p6S3Ne8JYQdqLX9pxvu22'
    AND currency = 'gbp'
    AND unit_amount = 1999
    AND enabled = true;

  IF matching_rows <> 1 THEN
    RAISE EXCEPTION
      '20260917 stopped: the exact private product mapping matched % rows.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.payment_customers
  WHERE user_id = 'df06f24d-3620-4889-ae2a-6883d87d29a2'::uuid
    AND livemode = false
    AND stripe_customer_id = 'cus_V76jo6wpeXM5Y9';

  IF matching_rows <> 1 THEN
    RAISE EXCEPTION
      '20260917 stopped: the exact private Customer binding matched % rows.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.payment_exam_subscriptions
  WHERE stripe_subscription_id = 'sub_1U6ser3Ne8JYQdqLp5IpnM4x'
    AND user_id = 'df06f24d-3620-4889-ae2a-6883d87d29a2'::uuid
    AND exam_id = 'aws-saa-c03'
    AND livemode = false
    AND stripe_customer_id = 'cus_V76jo6wpeXM5Y9'
    AND stripe_product_id = 'prod_V73CMqyLhOZvIe'
    AND stripe_price_id = 'price_1U6p6S3Ne8JYQdqLX9pxvu22'
    AND provider_status = 'active'
    AND cancel_at_period_end = false
    AND current_period_start = '2026-08-21 13:38:55+00'::timestamptz
    AND current_period_end = '2027-08-21 13:38:55+00'::timestamptz
    AND paid_through IS NULL
    AND latest_invoice_id = 'in_1U6seq3Ne8JYQdqLl2elRcEu'
    AND latest_provider_event_created_at = '2026-08-21 14:02:24+00'::timestamptz
    AND created_at = '2026-08-21 13:39:00.500781+00'::timestamptz
    AND updated_at = '2026-08-21 14:02:26.798626+00'::timestamptz;

  IF matching_rows <> 1 THEN
    RAISE EXCEPTION
      '20260917 stopped: the exact preserved Subscription precondition matched % rows.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.payment_exam_subscriptions
  WHERE provider_status = 'active'
    AND paid_through IS NULL;

  IF matching_rows <> 1 THEN
    RAISE EXCEPTION
      '20260917 stopped: active NULL paid-through isolation matched % rows.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.payment_webhook_events
  WHERE stripe_event_id = 'evt_1U6ses3Ne8JYQdqLNlUmLdJ5'
    AND event_type = 'invoice.paid'
    AND provider_object_id = 'sub_1U6ser3Ne8JYQdqLp5IpnM4x'
    AND livemode = false
    AND provider_created_at = '2026-08-21 13:38:58+00'::timestamptz
    AND received_at = '2026-08-21 13:39:00.494605+00'::timestamptz
    AND processing_status = 'processed'
    AND safe_error_code IS NULL
    AND processed_at = '2026-08-21 13:39:00.486664+00'::timestamptz;

  IF matching_rows <> 1 THEN
    RAISE EXCEPTION
      '20260917 stopped: the exact processed invoice.paid evidence matched % rows.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.exam_entitlements
  WHERE user_id = 'df06f24d-3620-4889-ae2a-6883d87d29a2'::uuid
    AND exam_id = 'aws-saa-c03'
    AND status = 'active'
    AND starts_at = '2026-08-21 13:38:55+00'::timestamptz
    AND expires_at = '2027-08-21 13:38:55+00'::timestamptz;

  IF matching_rows <> 1 THEN
    RAISE EXCEPTION
      '20260917 stopped: the exact active entitlement evidence matched % rows.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.exam_entitlement_events
  WHERE user_id = 'df06f24d-3620-4889-ae2a-6883d87d29a2'::uuid
    AND exam_id = 'aws-saa-c03'
    AND source_type = 'stripe_subscription'
    AND source_reference = 'sub_1U6ser3Ne8JYQdqLp5IpnM4x'
    AND previous_status IS NULL
    AND new_status = 'active'
    AND previous_expiry IS NULL
    AND new_expiry = '2027-08-21 13:38:55+00'::timestamptz
    AND reason_code = 'invoice_paid'
    AND stripe_event_id = 'evt_1U6ses3Ne8JYQdqLNlUmLdJ5'
    AND created_at = '2026-08-21 13:39:00.505431+00'::timestamptz;

  IF matching_rows <> 1 THEN
    RAISE EXCEPTION
      '20260917 stopped: the exact invoice_paid entitlement transition matched % rows.',
      matching_rows;
  END IF;

  UPDATE public.payment_exam_subscriptions
  SET paid_through = '2027-08-21 13:38:55+00'::timestamptz
  WHERE stripe_subscription_id = 'sub_1U6ser3Ne8JYQdqLp5IpnM4x'
    AND user_id = 'df06f24d-3620-4889-ae2a-6883d87d29a2'::uuid
    AND exam_id = 'aws-saa-c03'
    AND livemode = false
    AND stripe_customer_id = 'cus_V76jo6wpeXM5Y9'
    AND stripe_product_id = 'prod_V73CMqyLhOZvIe'
    AND stripe_price_id = 'price_1U6p6S3Ne8JYQdqLX9pxvu22'
    AND provider_status = 'active'
    AND cancel_at_period_end = false
    AND current_period_start = '2026-08-21 13:38:55+00'::timestamptz
    AND current_period_end = '2027-08-21 13:38:55+00'::timestamptz
    AND paid_through IS NULL
    AND latest_invoice_id = 'in_1U6seq3Ne8JYQdqLl2elRcEu'
    AND latest_provider_event_created_at = '2026-08-21 14:02:24+00'::timestamptz
    AND created_at = '2026-08-21 13:39:00.500781+00'::timestamptz
    AND updated_at = '2026-08-21 14:02:26.798626+00'::timestamptz;

  GET DIAGNOSTICS updated_rows = ROW_COUNT;

  IF updated_rows <> 1 THEN
    RAISE EXCEPTION
      '20260917 stopped: the paid-through repair updated % rows.',
      updated_rows;
  END IF;

  SELECT to_jsonb(row_value) - 'paid_through'
  INTO target_subscription_after
  FROM public.payment_exam_subscriptions row_value
  WHERE row_value.stripe_subscription_id = 'sub_1U6ser3Ne8JYQdqLp5IpnM4x'
    AND row_value.paid_through = '2027-08-21 13:38:55+00'::timestamptz;

  IF target_subscription_after IS NULL
     OR target_subscription_after IS DISTINCT FROM target_subscription_before THEN
    RAISE EXCEPTION
      '20260917 stopped: a non-target Subscription field changed.';
  END IF;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.exam_id, row_value.livemode),
    '[]'::jsonb
  ) INTO products_after
  FROM public.payment_exam_products row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.user_id, row_value.livemode),
    '[]'::jsonb
  ) INTO customers_after
  FROM public.payment_customers row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.stripe_subscription_id),
    '[]'::jsonb
  ) INTO non_target_subscriptions_after
  FROM public.payment_exam_subscriptions row_value
  WHERE row_value.stripe_subscription_id <> 'sub_1U6ser3Ne8JYQdqLp5IpnM4x';

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.stripe_event_id),
    '[]'::jsonb
  ) INTO webhook_events_after
  FROM public.payment_webhook_events row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.user_id, row_value.exam_id),
    '[]'::jsonb
  ) INTO entitlements_after
  FROM public.exam_entitlements row_value;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(row_value) ORDER BY row_value.event_id),
    '[]'::jsonb
  ) INTO entitlement_events_after
  FROM public.exam_entitlement_events row_value;

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

  IF products_after IS DISTINCT FROM products_before
     OR customers_after IS DISTINCT FROM customers_before
     OR non_target_subscriptions_after IS DISTINCT FROM non_target_subscriptions_before
     OR webhook_events_after IS DISTINCT FROM webhook_events_before
     OR entitlements_after IS DISTINCT FROM entitlements_before
     OR entitlement_events_after IS DISTINCT FROM entitlement_events_before
     OR progress_after IS DISTINCT FROM progress_before
     OR attempts_after IS DISTINCT FROM attempts_before THEN
    RAISE EXCEPTION
      '20260917 stopped: a protected non-target row changed during the repair.';
  END IF;

  SELECT jsonb_build_object(
    'payment_exam_products', (SELECT count(*) FROM public.payment_exam_products),
    'payment_customers', (SELECT count(*) FROM public.payment_customers),
    'payment_exam_subscriptions', (SELECT count(*) FROM public.payment_exam_subscriptions),
    'payment_webhook_events', (SELECT count(*) FROM public.payment_webhook_events),
    'exam_entitlement_events', (SELECT count(*) FROM public.exam_entitlement_events),
    'exam_entitlements', (SELECT count(*) FROM public.exam_entitlements),
    'learner_item_progress', (SELECT count(*) FROM public.learner_item_progress),
    'exam_attempts', (SELECT count(*) FROM public.exam_attempts)
  ) INTO counts_after;

  IF counts_after IS DISTINCT FROM counts_before THEN
    RAISE EXCEPTION
      '20260917 stopped: a protected row count changed: before %, after %.',
      counts_before,
      counts_after;
  END IF;
END;
$$;

COMMIT;
