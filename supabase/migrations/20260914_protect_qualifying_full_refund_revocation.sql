-- Step 009J: protect authoritative full-refund entitlement revocation.
--
-- A full refund may revoke only the exact exam entitlement when its successful,
-- fully refunded Charge resolves through a unique Invoice Payment to the same
-- paid Invoice already stored as the Subscription's payment-backed authority.
-- Partial, pending, failed and ambiguous refunds remain manual-review no-change.
-- This migration changes only the existing service-role reconciliation function.

BEGIN;

DO $$
BEGIN
  IF to_regprocedure(
    'public.reconcile_stripe_exam_entitlement(text,text,uuid,text,boolean,text,text,text,text,text,boolean,timestamp with time zone,timestamp with time zone,timestamp with time zone,text,timestamp with time zone,text,text)'
  ) IS NULL THEN
    RAISE EXCEPTION
      '20260914 stopped: the Stripe reconciliation prerequisite is missing.';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.reconcile_stripe_exam_entitlement(
  p_stripe_event_id TEXT,
  p_event_type TEXT,
  p_user_id UUID,
  p_exam_id TEXT,
  p_livemode BOOLEAN,
  p_stripe_customer_id TEXT,
  p_stripe_subscription_id TEXT,
  p_stripe_product_id TEXT,
  p_stripe_price_id TEXT,
  p_provider_status TEXT,
  p_cancel_at_period_end BOOLEAN,
  p_current_period_start TIMESTAMPTZ,
  p_current_period_end TIMESTAMPTZ,
  p_paid_through TIMESTAMPTZ,
  p_latest_invoice_id TEXT,
  p_provider_event_created_at TIMESTAMPTZ,
  p_access_action TEXT,
  p_reason_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  accepted_product public.payment_exam_products%ROWTYPE;
  existing_subscription public.payment_exam_subscriptions%ROWTYPE;
  previous_entitlement public.exam_entitlements%ROWTYPE;
  resulting_entitlement public.exam_entitlements%ROWTYPE;
  inserted_event_count INTEGER := 0;
  customer_write_count INTEGER := 0;
  subscription_write_count INTEGER := 0;
  entitlement_changed BOOLEAN := FALSE;
  processed_time TIMESTAMPTZ := clock_timestamp();
BEGIN
  IF p_stripe_event_id IS NULL
     OR p_stripe_event_id !~ '^evt_[A-Za-z0-9]+$'
     OR p_event_type NOT IN (
       'checkout.session.completed',
       'invoice.paid',
       'invoice.payment_failed',
       'customer.subscription.updated',
       'customer.subscription.deleted',
       'charge.refunded',
       'refund.created',
       'refund.updated'
     )
     OR p_user_id IS NULL
     OR p_exam_id NOT IN (
       'aws-saa-c03',
       'terraform-associate-004',
       'comptia-sec-plus'
     )
     OR p_stripe_customer_id !~ '^cus_[A-Za-z0-9]+$'
     OR p_stripe_subscription_id !~ '^sub_[A-Za-z0-9]+$'
     OR p_stripe_product_id !~ '^prod_[A-Za-z0-9]+$'
     OR p_stripe_price_id !~ '^price_[A-Za-z0-9]+$'
     OR (p_latest_invoice_id IS NOT NULL AND p_latest_invoice_id !~ '^in_[A-Za-z0-9]+$')
     OR p_provider_status NOT IN (
       'incomplete',
       'incomplete_expired',
       'trialing',
       'active',
       'past_due',
       'canceled',
       'unpaid',
       'paused'
     )
     OR p_provider_event_created_at IS NULL
     OR p_access_action NOT IN ('activate', 'revoke', 'no_change')
     OR p_reason_code IS NULL
     OR p_reason_code !~ '^[a-z0-9_]{1,80}$' THEN
    RAISE EXCEPTION
      'Stripe entitlement reconciliation input is invalid.'
      USING ERRCODE = '22023';
  END IF;

  IF p_event_type IN ('charge.refunded', 'refund.created', 'refund.updated') THEN
    IF NOT (
      (p_access_action = 'revoke' AND p_reason_code = 'full_refund')
      OR
      (p_access_action = 'no_change' AND p_reason_code = 'refund_manual_review')
    ) THEN
      RAISE EXCEPTION
        'Stripe refund action and reason classification is invalid.'
        USING ERRCODE = '23514';
    END IF;
  ELSIF p_reason_code IN ('full_refund', 'refund_manual_review') THEN
    RAISE EXCEPTION
      'Stripe refund reason cannot be used for a non-refund event.'
      USING ERRCODE = '23514';
  END IF;

  SELECT * INTO accepted_product
  FROM public.payment_exam_products
  WHERE exam_id = p_exam_id
    AND livemode = p_livemode
    AND stripe_product_id = p_stripe_product_id
    AND stripe_annual_price_id = p_stripe_price_id
    AND enabled = TRUE
  FOR SHARE;

  IF NOT FOUND THEN
    RAISE EXCEPTION
      'Stripe product, price, exam or mode is not enabled.'
      USING ERRCODE = '23514';
  END IF;

  INSERT INTO public.payment_webhook_events (
    stripe_event_id,
    event_type,
    provider_object_id,
    livemode,
    provider_created_at,
    processing_status
  ) VALUES (
    p_stripe_event_id,
    p_event_type,
    p_stripe_subscription_id,
    p_livemode,
    p_provider_event_created_at,
    'received'
  )
  ON CONFLICT (stripe_event_id) DO NOTHING;

  GET DIAGNOSTICS inserted_event_count = ROW_COUNT;

  IF inserted_event_count = 0 THEN
    RETURN jsonb_build_object(
      'processed', FALSE,
      'duplicate', TRUE,
      'eventId', p_stripe_event_id,
      'examId', p_exam_id
    );
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.payment_customers customer
    WHERE customer.livemode = p_livemode
      AND (
        (customer.user_id = p_user_id AND customer.stripe_customer_id <> p_stripe_customer_id)
        OR (customer.stripe_customer_id = p_stripe_customer_id AND customer.user_id <> p_user_id)
      )
  ) THEN
    RAISE EXCEPTION
      'Stripe Customer ownership does not match the authenticated learner mapping.'
      USING ERRCODE = '23514';
  END IF;

  INSERT INTO public.payment_customers (
    user_id,
    livemode,
    stripe_customer_id
  ) VALUES (
    p_user_id,
    p_livemode,
    p_stripe_customer_id
  )
  ON CONFLICT (user_id, livemode) DO UPDATE
  SET updated_at = clock_timestamp()
  WHERE payment_customers.stripe_customer_id = EXCLUDED.stripe_customer_id;

  GET DIAGNOSTICS customer_write_count = ROW_COUNT;

  IF customer_write_count <> 1 THEN
    RAISE EXCEPTION
      'Stripe Customer mapping could not be reconciled safely.'
      USING ERRCODE = '23514';
  END IF;

  SELECT * INTO existing_subscription
  FROM public.payment_exam_subscriptions
  WHERE stripe_subscription_id = p_stripe_subscription_id
  FOR UPDATE;

  IF FOUND AND (
    existing_subscription.user_id IS DISTINCT FROM p_user_id
    OR existing_subscription.exam_id IS DISTINCT FROM p_exam_id
    OR existing_subscription.livemode IS DISTINCT FROM p_livemode
    OR existing_subscription.stripe_customer_id IS DISTINCT FROM p_stripe_customer_id
    OR existing_subscription.stripe_product_id IS DISTINCT FROM p_stripe_product_id
    OR existing_subscription.stripe_price_id IS DISTINCT FROM p_stripe_price_id
  ) THEN
    RAISE EXCEPTION
      'Stripe Subscription ownership or exact-exam mapping changed unexpectedly.'
      USING ERRCODE = '23514';
  END IF;

  IF existing_subscription.stripe_subscription_id IS NOT NULL
     AND p_provider_event_created_at < existing_subscription.latest_provider_event_created_at THEN
    UPDATE public.payment_webhook_events
    SET processing_status = 'ignored',
        safe_error_code = 'stale_provider_event',
        processed_at = processed_time
    WHERE stripe_event_id = p_stripe_event_id;

    RETURN jsonb_build_object(
      'processed', FALSE,
      'duplicate', FALSE,
      'stale', TRUE,
      'eventId', p_stripe_event_id,
      'examId', p_exam_id
    );
  END IF;

  IF p_access_action = 'revoke'
     AND p_reason_code = 'full_refund' THEN
    IF existing_subscription.stripe_subscription_id IS NULL THEN
      RAISE EXCEPTION
        'A full refund cannot create a missing Stripe Subscription state.'
        USING ERRCODE = '23514';
    END IF;

    IF p_latest_invoice_id IS NULL
       OR existing_subscription.latest_invoice_id IS NULL
       OR existing_subscription.latest_invoice_id IS DISTINCT FROM p_latest_invoice_id THEN
      RAISE EXCEPTION
        'A full refund Invoice does not match the Subscription payment-backed Invoice.'
        USING ERRCODE = '23514';
    END IF;

    -- Full refunds revoke only exact-exam access. They do not replace any
    -- authoritative Subscription lifecycle or payment-backed field.
    subscription_write_count := 1;
  ELSIF p_access_action = 'no_change'
     AND p_reason_code = 'refund_manual_review' THEN
    IF existing_subscription.stripe_subscription_id IS NULL THEN
      RAISE EXCEPTION
        'A refund event cannot create a missing Stripe Subscription state.'
        USING ERRCODE = '23514';
    END IF;

    -- Refund events are payment-review signals, not authoritative Subscription
    -- lifecycle events. Record the webhook decision without changing any stored
    -- Subscription field or advancing its authoritative event timestamp.
    subscription_write_count := 1;
  ELSE
    INSERT INTO public.payment_exam_subscriptions (
      stripe_subscription_id,
      user_id,
      exam_id,
      livemode,
      stripe_customer_id,
      stripe_product_id,
      stripe_price_id,
      provider_status,
      cancel_at_period_end,
      current_period_start,
      current_period_end,
      paid_through,
      latest_invoice_id,
      latest_provider_event_created_at
    ) VALUES (
      p_stripe_subscription_id,
      p_user_id,
      p_exam_id,
      p_livemode,
      p_stripe_customer_id,
      p_stripe_product_id,
      p_stripe_price_id,
      p_provider_status,
      p_cancel_at_period_end,
      p_current_period_start,
      p_current_period_end,
      CASE
        WHEN p_event_type = 'invoice.paid'
         AND p_access_action = 'activate' THEN p_paid_through
        ELSE NULL
      END,
      CASE
        WHEN p_event_type = 'invoice.paid'
         AND p_access_action = 'activate' THEN p_latest_invoice_id
        ELSE NULL
      END,
      p_provider_event_created_at
    )
    ON CONFLICT (stripe_subscription_id) DO UPDATE
    SET user_id = EXCLUDED.user_id,
        exam_id = EXCLUDED.exam_id,
        livemode = EXCLUDED.livemode,
        stripe_customer_id = EXCLUDED.stripe_customer_id,
        stripe_product_id = EXCLUDED.stripe_product_id,
        stripe_price_id = EXCLUDED.stripe_price_id,
        provider_status = EXCLUDED.provider_status,
        cancel_at_period_end = EXCLUDED.cancel_at_period_end,
        current_period_start = EXCLUDED.current_period_start,
        current_period_end = EXCLUDED.current_period_end,
        paid_through = CASE
          WHEN p_event_type = 'invoice.paid'
           AND p_access_action = 'activate' THEN EXCLUDED.paid_through
          ELSE payment_exam_subscriptions.paid_through
        END,
        latest_invoice_id = CASE
          WHEN p_event_type = 'invoice.paid'
           AND p_access_action = 'activate' THEN EXCLUDED.latest_invoice_id
          ELSE payment_exam_subscriptions.latest_invoice_id
        END,
        latest_provider_event_created_at = EXCLUDED.latest_provider_event_created_at,
        updated_at = clock_timestamp();

    GET DIAGNOSTICS subscription_write_count = ROW_COUNT;

    IF subscription_write_count <> 1 THEN
      RAISE EXCEPTION
        'Stripe Subscription state could not be reconciled safely.'
        USING ERRCODE = '23514';
    END IF;
  END IF;

  SELECT * INTO previous_entitlement
  FROM public.exam_entitlements
  WHERE user_id = p_user_id
    AND exam_id = p_exam_id
  FOR UPDATE;

  IF p_access_action = 'revoke'
     AND p_reason_code = 'full_refund'
     AND (
       previous_entitlement.user_id IS NULL
       OR previous_entitlement.status IS DISTINCT FROM 'active'
     ) THEN
    RAISE EXCEPTION
      'A full refund requires an existing active exact-exam entitlement.'
      USING ERRCODE = '23514';
  END IF;

  IF p_access_action = 'activate' THEN
    IF p_provider_status NOT IN ('active', 'trialing')
       OR p_current_period_start IS NULL
       OR p_current_period_end IS NULL
       OR p_current_period_end <= p_current_period_start
       OR p_paid_through IS NULL
       OR p_paid_through IS DISTINCT FROM p_current_period_end
       OR p_paid_through <= clock_timestamp() THEN
      RAISE EXCEPTION
        'Stripe activation requires a current paid active period.'
        USING ERRCODE = '23514';
    END IF;

    INSERT INTO public.exam_entitlements (
      user_id,
      exam_id,
      status,
      starts_at,
      expires_at
    ) VALUES (
      p_user_id,
      p_exam_id,
      'active',
      p_current_period_start,
      p_paid_through
    )
    ON CONFLICT (user_id, exam_id) DO UPDATE
    SET status = 'active',
        starts_at = LEAST(exam_entitlements.starts_at, EXCLUDED.starts_at),
        expires_at = GREATEST(exam_entitlements.expires_at, EXCLUDED.expires_at),
        updated_at = clock_timestamp()
    RETURNING * INTO resulting_entitlement;

    entitlement_changed := previous_entitlement.user_id IS NULL
      OR previous_entitlement.status IS DISTINCT FROM resulting_entitlement.status
      OR previous_entitlement.expires_at IS DISTINCT FROM resulting_entitlement.expires_at;

  ELSIF p_access_action = 'revoke' THEN
    IF previous_entitlement.user_id IS NOT NULL
       AND previous_entitlement.status IS DISTINCT FROM 'revoked' THEN
      UPDATE public.exam_entitlements
      SET status = 'revoked',
          updated_at = clock_timestamp()
      WHERE user_id = p_user_id
        AND exam_id = p_exam_id
      RETURNING * INTO resulting_entitlement;

      entitlement_changed := TRUE;
    ELSE
      resulting_entitlement := previous_entitlement;
    END IF;
  ELSE
    resulting_entitlement := previous_entitlement;
  END IF;

  IF entitlement_changed THEN
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
      p_user_id,
      p_exam_id,
      'stripe_subscription',
      p_stripe_subscription_id,
      previous_entitlement.status,
      resulting_entitlement.status,
      previous_entitlement.expires_at,
      resulting_entitlement.expires_at,
      p_reason_code,
      p_stripe_event_id
    );
  END IF;

  UPDATE public.payment_webhook_events
  SET processing_status = 'processed',
      safe_error_code = NULL,
      processed_at = processed_time
  WHERE stripe_event_id = p_stripe_event_id;

  RETURN jsonb_build_object(
    'processed', TRUE,
    'duplicate', FALSE,
    'stale', FALSE,
    'entitlementChanged', entitlement_changed,
    'eventId', p_stripe_event_id,
    'examId', p_exam_id,
    'accessAction', p_access_action
  );
END;
$$;

REVOKE ALL ON FUNCTION public.reconcile_stripe_exam_entitlement(
  TEXT,
  TEXT,
  UUID,
  TEXT,
  BOOLEAN,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  BOOLEAN,
  TIMESTAMPTZ,
  TIMESTAMPTZ,
  TIMESTAMPTZ,
  TEXT,
  TIMESTAMPTZ,
  TEXT,
  TEXT
)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reconcile_stripe_exam_entitlement(
  TEXT,
  TEXT,
  UUID,
  TEXT,
  BOOLEAN,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  BOOLEAN,
  TIMESTAMPTZ,
  TIMESTAMPTZ,
  TIMESTAMPTZ,
  TEXT,
  TIMESTAMPTZ,
  TEXT,
  TEXT
)
  TO service_role;

COMMENT ON FUNCTION public.reconcile_stripe_exam_entitlement(
  TEXT,
  TEXT,
  UUID,
  TEXT,
  BOOLEAN,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  BOOLEAN,
  TIMESTAMPTZ,
  TIMESTAMPTZ,
  TIMESTAMPTZ,
  TEXT,
  TIMESTAMPTZ,
  TEXT,
  TEXT
) IS
  'Service-role-only Stripe reconciliation. A verified full refund may revoke only the exact active exam entitlement when its paid Invoice matches the Subscription payment-backed Invoice; all other refunds remain no-change.';

DO $$
DECLARE
  function_oid REGPROCEDURE := to_regprocedure(
    'public.reconcile_stripe_exam_entitlement(text,text,uuid,text,boolean,text,text,text,text,text,boolean,timestamp with time zone,timestamp with time zone,timestamp with time zone,text,timestamp with time zone,text,text)'
  );
BEGIN
  IF function_oid IS NULL
     OR has_function_privilege('anon', function_oid, 'EXECUTE')
     OR has_function_privilege('authenticated', function_oid, 'EXECUTE')
     OR NOT has_function_privilege('service_role', function_oid, 'EXECUTE') THEN
    RAISE EXCEPTION
      '20260914 stopped: reconciliation function privileges are incorrect.';
  END IF;
END;
$$;

COMMIT;
