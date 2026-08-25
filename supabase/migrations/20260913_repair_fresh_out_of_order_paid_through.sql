-- Step 009H3D: repair one sandbox Subscription field erased before 20260912.
--
-- Scope:
-- - Repair only paid_through for the fresh out-of-order AWS SAA-C03 test
--   Subscription.
-- - Require the exact audited Subscription, processed invoice.paid event,
--   active entitlement and invoice_paid entitlement-event evidence.
-- - Abort unless exactly one row qualifies.
-- - Preserve every other payment, entitlement and learner-progress record.

BEGIN;

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
  baseline_before JSONB;
  baseline_after JSONB;
  matching_rows INTEGER := 0;
  updated_rows INTEGER := 0;
BEGIN
  IF reconciliation_function IS NULL THEN
    RAISE EXCEPTION
      '20260913 stopped: the corrected Stripe reconciliation function is missing.';
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
     OR has_function_privilege('anon', reconciliation_function, 'EXECUTE')
     OR has_function_privilege('authenticated', reconciliation_function, 'EXECUTE')
     OR NOT has_function_privilege('service_role', reconciliation_function, 'EXECUTE') THEN
    RAISE EXCEPTION
      '20260913 stopped: migration 20260912 is not deployed with its exact privilege boundary.';
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
  ) INTO baseline_before;

  IF baseline_before IS DISTINCT FROM jsonb_build_object(
    'payment_exam_products', 3,
    'payment_customers', 3,
    'payment_exam_subscriptions', 3,
    'payment_webhook_events', 20,
    'exam_entitlement_events', 4,
    'exam_entitlements', 3,
    'learner_item_progress', 0,
    'exam_attempts', 12
  ) THEN
    RAISE EXCEPTION
      '20260913 stopped: a protected baseline count changed: %.',
      baseline_before;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.payment_exam_subscriptions
  WHERE stripe_subscription_id = 'sub_1U7vR33Ne8JYQdqLwXcMRAJs'
    AND user_id = 'a54a5e55-482f-4bd2-adc1-d58f2b4f235b'::uuid
    AND exam_id = 'aws-saa-c03'
    AND livemode = false
    AND stripe_customer_id = 'cus_V8BoF00adTS1kw'
    AND stripe_product_id = 'prod_V73CMqyLhOZvIe'
    AND stripe_price_id = 'price_1U6p6S3Ne8JYQdqLX9pxvu22'
    AND provider_status = 'active'
    AND cancel_at_period_end = false
    AND current_period_start = '2026-08-24 10:49:02+00'::timestamptz
    AND current_period_end = '2027-08-24 10:49:02+00'::timestamptz
    AND paid_through IS NULL
    AND latest_invoice_id = 'in_1U7vR33Ne8JYQdqLND2NszLw'
    AND latest_provider_event_created_at = '2026-08-24 11:07:03+00'::timestamptz;

  IF matching_rows <> 1 THEN
    RAISE EXCEPTION
      '20260913 stopped: the exact fresh Subscription precondition matched % rows.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.payment_webhook_events
  WHERE stripe_event_id = 'evt_1U7vR63Ne8JYQdqLVViJHkme'
    AND event_type = 'invoice.paid'
    AND provider_object_id = 'sub_1U7vR33Ne8JYQdqLwXcMRAJs'
    AND livemode = false
    AND provider_created_at = '2026-08-24 10:49:04+00'::timestamptz
    AND processing_status = 'processed'
    AND safe_error_code IS NULL
    AND processed_at = '2026-08-24 10:49:06.523980+00'::timestamptz;

  IF matching_rows <> 1 THEN
    RAISE EXCEPTION
      '20260913 stopped: the exact processed invoice.paid evidence matched % rows.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.exam_entitlements
  WHERE user_id = 'a54a5e55-482f-4bd2-adc1-d58f2b4f235b'::uuid
    AND exam_id = 'aws-saa-c03'
    AND status = 'active'
    AND starts_at = '2026-08-24 10:49:02+00'::timestamptz
    AND expires_at = '2027-08-24 10:49:02+00'::timestamptz;

  IF matching_rows <> 1 THEN
    RAISE EXCEPTION
      '20260913 stopped: the exact active entitlement evidence matched % rows.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.exam_entitlement_events
  WHERE user_id = 'a54a5e55-482f-4bd2-adc1-d58f2b4f235b'::uuid
    AND exam_id = 'aws-saa-c03'
    AND source_type = 'stripe_subscription'
    AND source_reference = 'sub_1U7vR33Ne8JYQdqLwXcMRAJs'
    AND previous_status IS NULL
    AND new_status = 'active'
    AND previous_expiry IS NULL
    AND new_expiry = '2027-08-24 10:49:02+00'::timestamptz
    AND reason_code = 'invoice_paid'
    AND stripe_event_id = 'evt_1U7vR63Ne8JYQdqLVViJHkme'
    AND created_at = '2026-08-24 10:49:06.548400+00'::timestamptz;

  IF matching_rows <> 1 THEN
    RAISE EXCEPTION
      '20260913 stopped: the exact invoice_paid entitlement evidence matched % rows.',
      matching_rows;
  END IF;

  UPDATE public.payment_exam_subscriptions
  SET paid_through = '2027-08-24 10:49:02+00'::timestamptz
  WHERE stripe_subscription_id = 'sub_1U7vR33Ne8JYQdqLwXcMRAJs'
    AND user_id = 'a54a5e55-482f-4bd2-adc1-d58f2b4f235b'::uuid
    AND exam_id = 'aws-saa-c03'
    AND livemode = false
    AND stripe_customer_id = 'cus_V8BoF00adTS1kw'
    AND stripe_product_id = 'prod_V73CMqyLhOZvIe'
    AND stripe_price_id = 'price_1U6p6S3Ne8JYQdqLX9pxvu22'
    AND provider_status = 'active'
    AND cancel_at_period_end = false
    AND current_period_start = '2026-08-24 10:49:02+00'::timestamptz
    AND current_period_end = '2027-08-24 10:49:02+00'::timestamptz
    AND paid_through IS NULL
    AND latest_invoice_id = 'in_1U7vR33Ne8JYQdqLND2NszLw'
    AND latest_provider_event_created_at = '2026-08-24 11:07:03+00'::timestamptz;

  GET DIAGNOSTICS updated_rows = ROW_COUNT;

  IF updated_rows <> 1 THEN
    RAISE EXCEPTION
      '20260913 stopped: the paid-through repair updated % rows.',
      updated_rows;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.payment_exam_subscriptions
    WHERE stripe_subscription_id = 'sub_1U7vR33Ne8JYQdqLwXcMRAJs'
      AND user_id = 'a54a5e55-482f-4bd2-adc1-d58f2b4f235b'::uuid
      AND exam_id = 'aws-saa-c03'
      AND livemode = false
      AND stripe_customer_id = 'cus_V8BoF00adTS1kw'
      AND stripe_product_id = 'prod_V73CMqyLhOZvIe'
      AND stripe_price_id = 'price_1U6p6S3Ne8JYQdqLX9pxvu22'
      AND provider_status = 'active'
      AND cancel_at_period_end = false
      AND current_period_start = '2026-08-24 10:49:02+00'::timestamptz
      AND current_period_end = '2027-08-24 10:49:02+00'::timestamptz
      AND paid_through = '2027-08-24 10:49:02+00'::timestamptz
      AND latest_invoice_id = 'in_1U7vR33Ne8JYQdqLND2NszLw'
      AND latest_provider_event_created_at = '2026-08-24 11:07:03+00'::timestamptz
  ) THEN
    RAISE EXCEPTION
      '20260913 stopped: the exact repaired Subscription state was not verified.';
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
  ) INTO baseline_after;

  IF baseline_after IS DISTINCT FROM baseline_before THEN
    RAISE EXCEPTION
      '20260913 stopped: a protected row count changed: before %, after %.',
      baseline_before,
      baseline_after;
  END IF;
END;
$$;

COMMIT;
