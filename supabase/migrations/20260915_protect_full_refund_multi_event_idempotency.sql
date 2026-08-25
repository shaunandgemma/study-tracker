-- Step 009J2: make qualifying full-refund reconciliation idempotent across
-- Stripe's separate refund.created, charge.refunded and refund.updated events.
--
-- The first qualifying event may revoke one exact active exam entitlement.
-- A later unique qualifying event may be processed without another transition
-- only when the private audit proves that this same learner, exam and Stripe
-- Subscription already received exactly one full_refund active-to-revoked
-- transition and the current refunded Invoice still matches the Subscription's
-- stored payment-backed Invoice. Every ambiguous or unrelated revoked state
-- remains fail closed.

BEGIN;

DO $migration$
DECLARE
  function_oid REGPROCEDURE := to_regprocedure(
    'public.reconcile_stripe_exam_entitlement(text,text,uuid,text,boolean,text,text,text,text,text,boolean,timestamp with time zone,timestamp with time zone,timestamp with time zone,text,timestamp with time zone,text,text)'
  );
  function_body TEXT;
  declaration_fragment CONSTANT TEXT := $fragment$
  subscription_write_count INTEGER := 0;
  entitlement_changed BOOLEAN := FALSE;
$fragment$;
  declaration_replacement CONSTANT TEXT := $fragment$
  subscription_write_count INTEGER := 0;
  prior_full_refund_transition_count INTEGER := 0;
  entitlement_changed BOOLEAN := FALSE;
$fragment$;
  entitlement_guard_fragment CONSTANT TEXT := $fragment$
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
$fragment$;
  entitlement_guard_replacement CONSTANT TEXT := $fragment$
  IF p_access_action = 'revoke'
     AND p_reason_code = 'full_refund' THEN
    IF previous_entitlement.user_id IS NULL THEN
      RAISE EXCEPTION
        'A full refund requires an existing exact-exam entitlement.'
        USING ERRCODE = '23514';
    ELSIF previous_entitlement.status = 'active' THEN
      -- The first qualifying event proceeds to the single revocation branch.
      NULL;
    ELSIF previous_entitlement.status = 'revoked' THEN
      SELECT count(*) INTO prior_full_refund_transition_count
      FROM public.exam_entitlement_events entitlement_event
      JOIN public.payment_webhook_events webhook_event
        ON webhook_event.stripe_event_id = entitlement_event.stripe_event_id
      WHERE entitlement_event.user_id = p_user_id
        AND entitlement_event.exam_id = p_exam_id
        AND entitlement_event.source_type = 'stripe_subscription'
        AND entitlement_event.source_reference = p_stripe_subscription_id
        AND entitlement_event.previous_status = 'active'
        AND entitlement_event.new_status = 'revoked'
        AND entitlement_event.previous_expiry IS NOT DISTINCT FROM previous_entitlement.expires_at
        AND entitlement_event.new_expiry IS NOT DISTINCT FROM previous_entitlement.expires_at
        AND entitlement_event.reason_code = 'full_refund'
        AND entitlement_event.stripe_event_id IS DISTINCT FROM p_stripe_event_id
        AND webhook_event.event_type IN (
          'charge.refunded',
          'refund.created',
          'refund.updated'
        )
        AND webhook_event.provider_object_id = p_stripe_subscription_id
        AND webhook_event.livemode = p_livemode
        AND webhook_event.processing_status = 'processed';

      IF prior_full_refund_transition_count <> 1 THEN
        RAISE EXCEPTION
          'A revoked entitlement lacks one exact prior full-refund transition.'
          USING ERRCODE = '23514';
      END IF;

      -- The existing revocation branch now records this unique webhook event as
      -- processed with entitlementChanged=false and writes no second audit row.
    ELSE
      RAISE EXCEPTION
        'A full refund encountered an unsupported entitlement state.'
        USING ERRCODE = '23514';
    END IF;
  END IF;
$fragment$;
  declaration_matches INTEGER;
  entitlement_guard_matches INTEGER;
BEGIN
  IF function_oid IS NULL THEN
    RAISE EXCEPTION
      '20260915 stopped: the Stripe reconciliation prerequisite is missing.';
  END IF;

  SELECT procedure.prosrc INTO function_body
  FROM pg_proc procedure
  WHERE procedure.oid = function_oid::oid;

  declaration_matches := (
    length(function_body) - length(replace(function_body, declaration_fragment, ''))
  ) / length(declaration_fragment);
  entitlement_guard_matches := (
    length(function_body) - length(replace(function_body, entitlement_guard_fragment, ''))
  ) / length(entitlement_guard_fragment);

  IF declaration_matches <> 1 OR entitlement_guard_matches <> 1 THEN
    RAISE EXCEPTION
      '20260915 stopped: the deployed reconciliation definition is not the reviewed 20260914 contract.';
  END IF;

  function_body := replace(
    function_body,
    declaration_fragment,
    declaration_replacement
  );
  function_body := replace(
    function_body,
    entitlement_guard_fragment,
    entitlement_guard_replacement
  );

  EXECUTE format($definition$
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
    AS %L
  $definition$, function_body);
END;
$migration$;

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
  'Service-role-only Stripe reconciliation. The first verified full-refund event revokes one exact active exam entitlement; later unique events require one exact prior full-refund transition and make no further entitlement change.';

DO $verification$
DECLARE
  function_oid REGPROCEDURE := to_regprocedure(
    'public.reconcile_stripe_exam_entitlement(text,text,uuid,text,boolean,text,text,text,text,text,boolean,timestamp with time zone,timestamp with time zone,timestamp with time zone,text,timestamp with time zone,text,text)'
  );
  function_body TEXT;
BEGIN
  IF function_oid IS NULL THEN
    RAISE EXCEPTION
      '20260915 stopped: the updated Stripe reconciliation function is missing.';
  END IF;

  SELECT procedure.prosrc INTO function_body
  FROM pg_proc procedure
  WHERE procedure.oid = function_oid::oid;

  IF function_body NOT LIKE '%prior_full_refund_transition_count INTEGER := 0;%'
     OR function_body NOT LIKE '%prior_full_refund_transition_count <> 1%'
     OR function_body NOT LIKE '%entitlement_event.source_reference = p_stripe_subscription_id%'
     OR function_body NOT LIKE '%webhook_event.processing_status = ''processed''%'
     OR has_function_privilege('anon', function_oid, 'EXECUTE')
     OR has_function_privilege('authenticated', function_oid, 'EXECUTE')
     OR NOT has_function_privilege('service_role', function_oid, 'EXECUTE') THEN
    RAISE EXCEPTION
      '20260915 stopped: reconciliation idempotency or privileges are incorrect.';
  END IF;
END;
$verification$;

COMMIT;
