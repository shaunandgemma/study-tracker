-- LATT Step 008B: private Stripe payment foundation.
--
-- Scope:
-- - Create empty server-only product, customer, subscription and webhook
--   records plus an append-only entitlement transition audit.
-- - Create one service-role-only reconciliation function.
-- - Preserve the existing browser read-only exam_entitlements contract.
-- - Create no Stripe object and change no existing row.

BEGIN;

DO $$
DECLARE
  relation_name TEXT;
BEGIN
  IF to_regclass('public.exam_entitlements') IS NULL
     OR to_regclass('public.learner_content_items') IS NULL
     OR to_regclass('public.learner_item_progress') IS NULL
     OR to_regclass('public.exam_attempts') IS NULL
     OR to_regclass('public.user_learning_path_progress') IS NULL
     OR to_regclass('public.user_learning_path_resources') IS NULL THEN
    RAISE EXCEPTION
      '20260908 stopped: an approved entitlement, content or progress prerequisite is missing.';
  END IF;

  FOREACH relation_name IN ARRAY ARRAY[
    'payment_exam_products',
    'payment_customers',
    'payment_exam_subscriptions',
    'payment_webhook_events',
    'exam_entitlement_events'
  ]
  LOOP
    IF to_regclass('public.' || relation_name) IS NOT NULL THEN
      RAISE EXCEPTION
        '20260908 stopped: public.% already exists.', relation_name;
    END IF;
  END LOOP;

  IF to_regprocedure(
    'public.reconcile_stripe_exam_entitlement(text,text,uuid,text,boolean,text,text,text,text,text,boolean,timestamp with time zone,timestamp with time zone,timestamp with time zone,text,timestamp with time zone,text,text)'
  ) IS NOT NULL THEN
    RAISE EXCEPTION
      '20260908 stopped: the Stripe entitlement reconciliation function already exists.';
  END IF;
END;
$$;

LOCK TABLE public.exam_entitlements IN SHARE MODE;
LOCK TABLE public.learner_content_items IN SHARE MODE;
LOCK TABLE public.learner_item_progress IN SHARE MODE;
LOCK TABLE public.exam_attempts IN SHARE MODE;
LOCK TABLE public.user_learning_path_progress IN SHARE MODE;
LOCK TABLE public.user_learning_path_resources IN SHARE MODE;

CREATE TEMP TABLE step008b_existing_row_guard ON COMMIT DROP AS
SELECT
  (SELECT COUNT(*) FROM public.exam_entitlements) AS entitlement_rows,
  (SELECT COUNT(*) FROM public.learner_content_items) AS protected_content_rows,
  (SELECT COUNT(*) FROM public.learner_item_progress) AS learner_item_progress_rows,
  (SELECT COUNT(*) FROM public.exam_attempts) AS exam_attempt_rows,
  (SELECT COUNT(*) FROM public.user_learning_path_progress) AS follow_along_progress_rows,
  (SELECT COUNT(*) FROM public.user_learning_path_resources) AS follow_along_resource_rows;

CREATE TABLE public.payment_exam_products (
  exam_id TEXT NOT NULL,
  livemode BOOLEAN NOT NULL,
  stripe_product_id TEXT NOT NULL,
  stripe_annual_price_id TEXT NOT NULL,
  currency TEXT NOT NULL,
  unit_amount BIGINT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

  CONSTRAINT payment_exam_products_pkey
    PRIMARY KEY (exam_id, livemode),

  CONSTRAINT payment_exam_products_exam_check
    CHECK (exam_id IN (
      'aws-saa-c03',
      'terraform-associate-004',
      'comptia-sec-plus'
    )),

  CONSTRAINT payment_exam_products_product_format_check
    CHECK (stripe_product_id ~ '^prod_[A-Za-z0-9]+$'),

  CONSTRAINT payment_exam_products_price_format_check
    CHECK (stripe_annual_price_id ~ '^price_[A-Za-z0-9]+$'),

  CONSTRAINT payment_exam_products_currency_check
    CHECK (currency ~ '^[a-z]{3}$'),

  CONSTRAINT payment_exam_products_amount_check
    CHECK (unit_amount > 0),

  CONSTRAINT payment_exam_products_created_updated_check
    CHECK (updated_at >= created_at),

  CONSTRAINT payment_exam_products_product_environment_key
    UNIQUE (stripe_product_id, livemode),

  CONSTRAINT payment_exam_products_price_environment_key
    UNIQUE (stripe_annual_price_id, livemode)
);

COMMENT ON TABLE public.payment_exam_products IS
  'Private server-controlled mapping from one exact exam and Stripe mode to one yearly Stripe Product and Price.';

CREATE TABLE public.payment_customers (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  livemode BOOLEAN NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

  CONSTRAINT payment_customers_pkey
    PRIMARY KEY (user_id, livemode),

  CONSTRAINT payment_customers_customer_format_check
    CHECK (stripe_customer_id ~ '^cus_[A-Za-z0-9]+$'),

  CONSTRAINT payment_customers_created_updated_check
    CHECK (updated_at >= created_at),

  CONSTRAINT payment_customers_customer_environment_key
    UNIQUE (stripe_customer_id, livemode)
);

COMMENT ON TABLE public.payment_customers IS
  'Private binding between one Supabase user and one Stripe Customer in one Stripe mode. Contains no card or bank data.';

CREATE TABLE public.payment_exam_subscriptions (
  stripe_subscription_id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  exam_id TEXT NOT NULL,
  livemode BOOLEAN NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_product_id TEXT NOT NULL,
  stripe_price_id TEXT NOT NULL,
  provider_status TEXT NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  paid_through TIMESTAMPTZ,
  latest_invoice_id TEXT,
  latest_provider_event_created_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

  CONSTRAINT payment_exam_subscriptions_exam_check
    CHECK (exam_id IN (
      'aws-saa-c03',
      'terraform-associate-004',
      'comptia-sec-plus'
    )),

  CONSTRAINT payment_exam_subscriptions_subscription_format_check
    CHECK (stripe_subscription_id ~ '^sub_[A-Za-z0-9]+$'),

  CONSTRAINT payment_exam_subscriptions_customer_format_check
    CHECK (stripe_customer_id ~ '^cus_[A-Za-z0-9]+$'),

  CONSTRAINT payment_exam_subscriptions_product_format_check
    CHECK (stripe_product_id ~ '^prod_[A-Za-z0-9]+$'),

  CONSTRAINT payment_exam_subscriptions_price_format_check
    CHECK (stripe_price_id ~ '^price_[A-Za-z0-9]+$'),

  CONSTRAINT payment_exam_subscriptions_invoice_format_check
    CHECK (latest_invoice_id IS NULL OR latest_invoice_id ~ '^in_[A-Za-z0-9]+$'),

  CONSTRAINT payment_exam_subscriptions_status_check
    CHECK (provider_status IN (
      'incomplete',
      'incomplete_expired',
      'trialing',
      'active',
      'past_due',
      'canceled',
      'unpaid',
      'paused'
    )),

  CONSTRAINT payment_exam_subscriptions_period_check
    CHECK (
      (current_period_start IS NULL AND current_period_end IS NULL)
      OR (
        current_period_start IS NOT NULL
        AND current_period_end IS NOT NULL
        AND current_period_end > current_period_start
      )
    ),

  CONSTRAINT payment_exam_subscriptions_paid_through_check
    CHECK (
      paid_through IS NULL
      OR current_period_end IS NULL
      OR paid_through <= current_period_end
    ),

  CONSTRAINT payment_exam_subscriptions_created_updated_check
    CHECK (updated_at >= created_at),

  CONSTRAINT payment_exam_subscriptions_customer_key
    FOREIGN KEY (user_id, livemode)
    REFERENCES public.payment_customers(user_id, livemode)
    ON DELETE RESTRICT,

  CONSTRAINT payment_exam_subscriptions_product_key
    FOREIGN KEY (exam_id, livemode)
    REFERENCES public.payment_exam_products(exam_id, livemode)
    ON DELETE RESTRICT
);

CREATE UNIQUE INDEX payment_exam_subscriptions_one_current_exam_key
  ON public.payment_exam_subscriptions (user_id, exam_id, livemode)
  WHERE provider_status IN (
    'incomplete',
    'trialing',
    'active',
    'past_due',
    'unpaid',
    'paused'
  );

CREATE INDEX payment_exam_subscriptions_customer_idx
  ON public.payment_exam_subscriptions (stripe_customer_id, livemode);

COMMENT ON TABLE public.payment_exam_subscriptions IS
  'Private reconciled Stripe subscription state. Browser clients have no table privilege.';

CREATE TABLE public.payment_webhook_events (
  stripe_event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  provider_object_id TEXT NOT NULL,
  livemode BOOLEAN NOT NULL,
  provider_created_at TIMESTAMPTZ NOT NULL,
  processing_status TEXT NOT NULL DEFAULT 'received',
  safe_error_code TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  processed_at TIMESTAMPTZ,

  CONSTRAINT payment_webhook_events_event_format_check
    CHECK (stripe_event_id ~ '^evt_[A-Za-z0-9]+$'),

  CONSTRAINT payment_webhook_events_type_check
    CHECK (event_type IN (
      'checkout.session.completed',
      'invoice.paid',
      'invoice.payment_failed',
      'customer.subscription.updated',
      'customer.subscription.deleted',
      'charge.refunded',
      'refund.created',
      'refund.updated'
    )),

  CONSTRAINT payment_webhook_events_object_check
    CHECK (btrim(provider_object_id) <> ''),

  CONSTRAINT payment_webhook_events_status_check
    CHECK (processing_status IN ('received', 'processed', 'ignored', 'failed')),

  CONSTRAINT payment_webhook_events_error_check
    CHECK (safe_error_code IS NULL OR safe_error_code ~ '^[a-z0-9_]{1,80}$'),

  CONSTRAINT payment_webhook_events_processed_time_check
    CHECK (
      (processing_status = 'received' AND processed_at IS NULL)
      OR (processing_status <> 'received' AND processed_at IS NOT NULL)
    )
);

CREATE INDEX payment_webhook_events_object_idx
  ON public.payment_webhook_events (
    provider_object_id,
    event_type,
    provider_created_at DESC
  );

COMMENT ON TABLE public.payment_webhook_events IS
  'Private Stripe event idempotency and processing audit. It stores no raw card data or Stripe secret.';

CREATE TABLE public.exam_entitlement_events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  exam_id TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_reference TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  previous_expiry TIMESTAMPTZ,
  new_expiry TIMESTAMPTZ,
  reason_code TEXT NOT NULL,
  stripe_event_id TEXT NOT NULL REFERENCES public.payment_webhook_events(stripe_event_id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

  CONSTRAINT exam_entitlement_events_exam_check
    CHECK (exam_id IN (
      'aws-saa-c03',
      'terraform-associate-004',
      'comptia-sec-plus'
    )),

  CONSTRAINT exam_entitlement_events_source_check
    CHECK (source_type = 'stripe_subscription'),

  CONSTRAINT exam_entitlement_events_reference_check
    CHECK (source_reference ~ '^sub_[A-Za-z0-9]+$'),

  CONSTRAINT exam_entitlement_events_previous_status_check
    CHECK (previous_status IS NULL OR previous_status IN ('active', 'revoked')),

  CONSTRAINT exam_entitlement_events_new_status_check
    CHECK (new_status IN ('active', 'revoked')),

  CONSTRAINT exam_entitlement_events_reason_check
    CHECK (reason_code ~ '^[a-z0-9_]{1,80}$'),

  CONSTRAINT exam_entitlement_events_stripe_event_key
    UNIQUE (stripe_event_id, user_id, exam_id)
);

CREATE INDEX exam_entitlement_events_owner_exam_idx
  ON public.exam_entitlement_events (user_id, exam_id, created_at DESC);

COMMENT ON TABLE public.exam_entitlement_events IS
  'Private append-only audit of server-managed entitlement transitions. It is not learner content or a payment credential store.';

ALTER TABLE public.payment_exam_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_exam_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_entitlement_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL PRIVILEGES ON TABLE
  public.payment_exam_products,
  public.payment_customers,
  public.payment_exam_subscriptions,
  public.payment_webhook_events,
  public.exam_entitlement_events
FROM PUBLIC, anon, authenticated, service_role;

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
    p_paid_through,
    p_latest_invoice_id,
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
      paid_through = EXCLUDED.paid_through,
      latest_invoice_id = EXCLUDED.latest_invoice_id,
      latest_provider_event_created_at = EXCLUDED.latest_provider_event_created_at,
      updated_at = clock_timestamp();

  GET DIAGNOSTICS subscription_write_count = ROW_COUNT;

  IF subscription_write_count <> 1 THEN
    RAISE EXCEPTION
      'Stripe Subscription state could not be reconciled safely.'
      USING ERRCODE = '23514';
  END IF;

  SELECT * INTO previous_entitlement
  FROM public.exam_entitlements
  WHERE user_id = p_user_id
    AND exam_id = p_exam_id
  FOR UPDATE;

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
) FROM PUBLIC, anon, authenticated;

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
) TO service_role;

DO $$
DECLARE
  relation_name TEXT;
  permission_name TEXT;
  rls_enabled BOOLEAN;
  guard step008b_existing_row_guard%ROWTYPE;
BEGIN
  SELECT * INTO guard FROM step008b_existing_row_guard;

  IF guard.entitlement_rows IS DISTINCT FROM
       (SELECT COUNT(*) FROM public.exam_entitlements)
     OR guard.protected_content_rows IS DISTINCT FROM
       (SELECT COUNT(*) FROM public.learner_content_items)
     OR guard.learner_item_progress_rows IS DISTINCT FROM
       (SELECT COUNT(*) FROM public.learner_item_progress)
     OR guard.exam_attempt_rows IS DISTINCT FROM
       (SELECT COUNT(*) FROM public.exam_attempts)
     OR guard.follow_along_progress_rows IS DISTINCT FROM
       (SELECT COUNT(*) FROM public.user_learning_path_progress)
     OR guard.follow_along_resource_rows IS DISTINCT FROM
       (SELECT COUNT(*) FROM public.user_learning_path_resources) THEN
    RAISE EXCEPTION
      '20260908 stopped: existing entitlement, content or progress rows changed.';
  END IF;

  FOREACH relation_name IN ARRAY ARRAY[
    'payment_exam_products',
    'payment_customers',
    'payment_exam_subscriptions',
    'payment_webhook_events',
    'exam_entitlement_events'
  ]
  LOOP
    IF (SELECT COUNT(*) FROM pg_catalog.pg_class record
        JOIN pg_catalog.pg_namespace schema_record
          ON schema_record.oid = record.relnamespace
        WHERE schema_record.nspname = 'public'
          AND record.relname = relation_name) <> 1 THEN
      RAISE EXCEPTION '20260908 stopped: public.% is missing.', relation_name;
    END IF;

    EXECUTE format(
      'SELECT relrowsecurity FROM pg_class WHERE oid = %L::regclass',
      'public.' || relation_name
    ) INTO rls_enabled;

    IF rls_enabled IS DISTINCT FROM TRUE THEN
      RAISE EXCEPTION '20260908 stopped: RLS is disabled on public.%.', relation_name;
    END IF;

    IF EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = relation_name
    ) THEN
      RAISE EXCEPTION
        '20260908 stopped: public.% has a browser policy unexpectedly.', relation_name;
    END IF;

    FOREACH permission_name IN ARRAY ARRAY[
      'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER'
    ]
    LOOP
      IF has_table_privilege('anon', 'public.' || relation_name, permission_name)
         OR has_table_privilege('authenticated', 'public.' || relation_name, permission_name)
         OR has_table_privilege('service_role', 'public.' || relation_name, permission_name) THEN
        RAISE EXCEPTION
          '20260908 stopped: a non-owner application role has % on public.%.',
          permission_name,
          relation_name;
      END IF;
    END LOOP;
  END LOOP;

  IF has_function_privilege(
       'anon',
       'public.reconcile_stripe_exam_entitlement(text,text,uuid,text,boolean,text,text,text,text,text,boolean,timestamp with time zone,timestamp with time zone,timestamp with time zone,text,timestamp with time zone,text,text)',
       'EXECUTE'
     )
     OR has_function_privilege(
       'authenticated',
       'public.reconcile_stripe_exam_entitlement(text,text,uuid,text,boolean,text,text,text,text,text,boolean,timestamp with time zone,timestamp with time zone,timestamp with time zone,text,timestamp with time zone,text,text)',
       'EXECUTE'
     )
     OR NOT has_function_privilege(
       'service_role',
       'public.reconcile_stripe_exam_entitlement(text,text,uuid,text,boolean,text,text,text,text,text,boolean,timestamp with time zone,timestamp with time zone,timestamp with time zone,text,timestamp with time zone,text,text)',
       'EXECUTE'
     ) THEN
    RAISE EXCEPTION
      '20260908 stopped: reconciliation function privileges are incorrect.';
  END IF;

  IF has_table_privilege('anon', 'public.exam_entitlements', 'SELECT')
     OR NOT has_table_privilege('authenticated', 'public.exam_entitlements', 'SELECT')
     OR has_table_privilege('authenticated', 'public.exam_entitlements', 'INSERT')
     OR has_table_privilege('authenticated', 'public.exam_entitlements', 'UPDATE')
     OR has_table_privilege('authenticated', 'public.exam_entitlements', 'DELETE') THEN
    RAISE EXCEPTION
      '20260908 stopped: the existing learner entitlement privilege boundary changed.';
  END IF;

  IF (SELECT COUNT(*) FROM public.payment_exam_products) <> 0
     OR (SELECT COUNT(*) FROM public.payment_customers) <> 0
     OR (SELECT COUNT(*) FROM public.payment_exam_subscriptions) <> 0
     OR (SELECT COUNT(*) FROM public.payment_webhook_events) <> 0
     OR (SELECT COUNT(*) FROM public.exam_entitlement_events) <> 0 THEN
    RAISE EXCEPTION
      '20260908 stopped: the payment foundation was not created empty.';
  END IF;
END;
$$;

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
  'Service-role-only idempotent Stripe subscription reconciliation. Browser callers cannot execute it.';

COMMIT;
