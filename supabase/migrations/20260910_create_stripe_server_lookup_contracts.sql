-- LATT Step 008E1: minimal server-only Stripe lookup and customer-binding contracts.
--
-- Scope:
-- - Expose only narrowly scoped SECURITY DEFINER functions to service_role.
-- - Keep all private payment tables inaccessible through direct Data API queries.
-- - Create no Stripe object and change no payment, entitlement or progress row.

BEGIN;

DO $$
DECLARE
  relation_name TEXT;
BEGIN
  FOREACH relation_name IN ARRAY ARRAY[
    'payment_exam_products',
    'payment_customers',
    'payment_exam_subscriptions',
    'payment_webhook_events',
    'exam_entitlement_events',
    'exam_entitlements',
    'learner_item_progress',
    'exam_attempts',
    'user_learning_path_progress',
    'user_learning_path_resources'
  ]
  LOOP
    IF to_regclass('public.' || relation_name) IS NULL THEN
      RAISE EXCEPTION '20260910 stopped: public.% is missing.', relation_name;
    END IF;
  END LOOP;

  IF to_regprocedure('public.get_stripe_exam_checkout_context(uuid,text,boolean)') IS NOT NULL
     OR to_regprocedure('public.bind_stripe_customer(uuid,boolean,text)') IS NOT NULL
     OR to_regprocedure('public.get_stripe_portal_context(uuid,boolean)') IS NOT NULL THEN
    RAISE EXCEPTION '20260910 stopped: a Stripe server lookup contract already exists.';
  END IF;

  IF (SELECT COUNT(*) FROM public.payment_exam_products) <> 3
     OR (SELECT COUNT(*) FROM public.payment_exam_products
         WHERE livemode = FALSE AND enabled = TRUE AND currency = 'gbp' AND unit_amount = 1999) <> 3
     OR EXISTS (SELECT 1 FROM public.payment_exam_products WHERE livemode = TRUE) THEN
    RAISE EXCEPTION '20260910 stopped: the exact approved Stripe test catalogue is unavailable.';
  END IF;

  IF EXISTS (SELECT 1 FROM public.payment_customers)
     OR EXISTS (SELECT 1 FROM public.payment_exam_subscriptions)
     OR EXISTS (SELECT 1 FROM public.payment_webhook_events)
     OR EXISTS (SELECT 1 FROM public.exam_entitlement_events) THEN
    RAISE EXCEPTION '20260910 stopped: payment activity exists before the server contracts are created.';
  END IF;
END;
$$;

LOCK TABLE public.payment_exam_products IN SHARE MODE;
LOCK TABLE public.payment_customers IN SHARE MODE;
LOCK TABLE public.payment_exam_subscriptions IN SHARE MODE;
LOCK TABLE public.payment_webhook_events IN SHARE MODE;
LOCK TABLE public.exam_entitlement_events IN SHARE MODE;
LOCK TABLE public.exam_entitlements IN SHARE MODE;
LOCK TABLE public.learner_item_progress IN SHARE MODE;
LOCK TABLE public.exam_attempts IN SHARE MODE;
LOCK TABLE public.user_learning_path_progress IN SHARE MODE;
LOCK TABLE public.user_learning_path_resources IN SHARE MODE;

CREATE TEMP TABLE step008e1_existing_row_guard ON COMMIT DROP AS
SELECT
  (SELECT COUNT(*) FROM public.payment_exam_products) AS product_rows,
  (SELECT COUNT(*) FROM public.payment_customers) AS customer_rows,
  (SELECT COUNT(*) FROM public.payment_exam_subscriptions) AS subscription_rows,
  (SELECT COUNT(*) FROM public.payment_webhook_events) AS webhook_rows,
  (SELECT COUNT(*) FROM public.exam_entitlement_events) AS entitlement_event_rows,
  (SELECT COUNT(*) FROM public.exam_entitlements) AS entitlement_rows,
  (SELECT COUNT(*) FROM public.learner_item_progress) AS learner_item_progress_rows,
  (SELECT COUNT(*) FROM public.exam_attempts) AS exam_attempt_rows,
  (SELECT COUNT(*) FROM public.user_learning_path_progress) AS follow_along_progress_rows,
  (SELECT COUNT(*) FROM public.user_learning_path_resources) AS follow_along_resource_rows;

CREATE FUNCTION public.get_stripe_exam_checkout_context(
  p_user_id UUID,
  p_exam_id TEXT,
  p_livemode BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  product_record public.payment_exam_products%ROWTYPE;
  customer_id TEXT;
  has_current_subscription BOOLEAN;
BEGIN
  IF p_user_id IS NULL
     OR p_exam_id NOT IN ('aws-saa-c03', 'terraform-associate-004', 'comptia-sec-plus') THEN
    RAISE EXCEPTION 'Stripe checkout lookup input is invalid.' USING ERRCODE = '22023';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Stripe checkout user does not exist.' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO product_record
  FROM public.payment_exam_products
  WHERE exam_id = p_exam_id
    AND livemode = p_livemode;

  IF NOT FOUND OR product_record.enabled IS DISTINCT FROM TRUE THEN
    RETURN jsonb_build_object(
      'examId', p_exam_id,
      'livemode', p_livemode,
      'enabled', FALSE,
      'productId', NULL,
      'priceId', NULL,
      'customerId', NULL,
      'hasCurrentSubscription', FALSE
    );
  END IF;

  SELECT stripe_customer_id INTO customer_id
  FROM public.payment_customers
  WHERE user_id = p_user_id
    AND livemode = p_livemode;

  SELECT EXISTS (
    SELECT 1
    FROM public.payment_exam_subscriptions
    WHERE user_id = p_user_id
      AND exam_id = p_exam_id
      AND livemode = p_livemode
      AND provider_status IN ('incomplete', 'trialing', 'active', 'past_due', 'unpaid', 'paused')
  ) INTO has_current_subscription;

  RETURN jsonb_build_object(
    'examId', product_record.exam_id,
    'livemode', product_record.livemode,
    'enabled', product_record.enabled,
    'productId', product_record.stripe_product_id,
    'priceId', product_record.stripe_annual_price_id,
    'customerId', customer_id,
    'hasCurrentSubscription', has_current_subscription
  );
END;
$$;

CREATE FUNCTION public.bind_stripe_customer(
  p_user_id UUID,
  p_livemode BOOLEAN,
  p_stripe_customer_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  existing_by_user public.payment_customers%ROWTYPE;
  existing_by_customer public.payment_customers%ROWTYPE;
BEGIN
  IF p_user_id IS NULL OR p_stripe_customer_id !~ '^cus_[A-Za-z0-9]+$' THEN
    RAISE EXCEPTION 'Stripe Customer binding input is invalid.' USING ERRCODE = '22023';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Stripe Customer binding user does not exist.' USING ERRCODE = '22023';
  END IF;

  -- The table lock makes the two uniqueness checks and insert one atomic binding decision.
  LOCK TABLE public.payment_customers IN SHARE ROW EXCLUSIVE MODE;

  SELECT * INTO existing_by_user
  FROM public.payment_customers
  WHERE user_id = p_user_id
    AND livemode = p_livemode;

  SELECT * INTO existing_by_customer
  FROM public.payment_customers
  WHERE stripe_customer_id = p_stripe_customer_id
    AND livemode = p_livemode;

  IF existing_by_user.user_id IS NOT NULL
     AND existing_by_user.stripe_customer_id IS DISTINCT FROM p_stripe_customer_id THEN
    RAISE EXCEPTION 'The learner already has a different Stripe Customer binding.' USING ERRCODE = '23514';
  END IF;

  IF existing_by_customer.user_id IS NOT NULL
     AND existing_by_customer.user_id IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'The Stripe Customer is already bound to a different learner.' USING ERRCODE = '23514';
  END IF;

  INSERT INTO public.payment_customers (user_id, livemode, stripe_customer_id)
  VALUES (p_user_id, p_livemode, p_stripe_customer_id)
  ON CONFLICT (user_id, livemode) DO UPDATE
  SET updated_at = clock_timestamp()
  WHERE payment_customers.stripe_customer_id = EXCLUDED.stripe_customer_id;

  RETURN jsonb_build_object(
    'bound', TRUE,
    'userId', p_user_id,
    'livemode', p_livemode,
    'customerId', p_stripe_customer_id
  );
END;
$$;

CREATE FUNCTION public.get_stripe_portal_context(
  p_user_id UUID,
  p_livemode BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  customer_id TEXT;
BEGIN
  IF p_user_id IS NULL OR NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Stripe portal lookup input is invalid.' USING ERRCODE = '22023';
  END IF;

  SELECT stripe_customer_id INTO customer_id
  FROM public.payment_customers
  WHERE user_id = p_user_id
    AND livemode = p_livemode;

  RETURN jsonb_build_object(
    'livemode', p_livemode,
    'customerId', customer_id
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_stripe_exam_checkout_context(UUID, TEXT, BOOLEAN)
  FROM PUBLIC, anon, authenticated, service_role;
REVOKE ALL ON FUNCTION public.bind_stripe_customer(UUID, BOOLEAN, TEXT)
  FROM PUBLIC, anon, authenticated, service_role;
REVOKE ALL ON FUNCTION public.get_stripe_portal_context(UUID, BOOLEAN)
  FROM PUBLIC, anon, authenticated, service_role;

GRANT EXECUTE ON FUNCTION public.get_stripe_exam_checkout_context(UUID, TEXT, BOOLEAN) TO service_role;
GRANT EXECUTE ON FUNCTION public.bind_stripe_customer(UUID, BOOLEAN, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_stripe_portal_context(UUID, BOOLEAN) TO service_role;

DO $$
DECLARE
  guard step008e1_existing_row_guard%ROWTYPE;
  relation_name TEXT;
  function_signature TEXT;
BEGIN
  SELECT * INTO guard FROM step008e1_existing_row_guard;

  IF guard.product_rows IS DISTINCT FROM (SELECT COUNT(*) FROM public.payment_exam_products)
     OR guard.customer_rows IS DISTINCT FROM (SELECT COUNT(*) FROM public.payment_customers)
     OR guard.subscription_rows IS DISTINCT FROM (SELECT COUNT(*) FROM public.payment_exam_subscriptions)
     OR guard.webhook_rows IS DISTINCT FROM (SELECT COUNT(*) FROM public.payment_webhook_events)
     OR guard.entitlement_event_rows IS DISTINCT FROM (SELECT COUNT(*) FROM public.exam_entitlement_events)
     OR guard.entitlement_rows IS DISTINCT FROM (SELECT COUNT(*) FROM public.exam_entitlements)
     OR guard.learner_item_progress_rows IS DISTINCT FROM (SELECT COUNT(*) FROM public.learner_item_progress)
     OR guard.exam_attempt_rows IS DISTINCT FROM (SELECT COUNT(*) FROM public.exam_attempts)
     OR guard.follow_along_progress_rows IS DISTINCT FROM (SELECT COUNT(*) FROM public.user_learning_path_progress)
     OR guard.follow_along_resource_rows IS DISTINCT FROM (SELECT COUNT(*) FROM public.user_learning_path_resources) THEN
    RAISE EXCEPTION '20260910 stopped: a protected payment, entitlement or progress row changed.';
  END IF;

  FOREACH relation_name IN ARRAY ARRAY[
    'payment_exam_products',
    'payment_customers',
    'payment_exam_subscriptions',
    'payment_webhook_events',
    'exam_entitlement_events'
  ]
  LOOP
    IF has_table_privilege('anon', 'public.' || relation_name, 'SELECT')
       OR has_table_privilege('authenticated', 'public.' || relation_name, 'SELECT')
       OR has_table_privilege('service_role', 'public.' || relation_name, 'SELECT') THEN
      RAISE EXCEPTION '20260910 stopped: public.% gained direct SELECT access.', relation_name;
    END IF;
  END LOOP;

  FOREACH function_signature IN ARRAY ARRAY[
    'public.get_stripe_exam_checkout_context(uuid,text,boolean)',
    'public.bind_stripe_customer(uuid,boolean,text)',
    'public.get_stripe_portal_context(uuid,boolean)'
  ]
  LOOP
    IF has_function_privilege('anon', function_signature, 'EXECUTE')
       OR has_function_privilege('authenticated', function_signature, 'EXECUTE')
       OR NOT has_function_privilege('service_role', function_signature, 'EXECUTE') THEN
      RAISE EXCEPTION '20260910 stopped: % has an invalid role grant.', function_signature;
    END IF;
  END LOOP;
END;
$$;

COMMIT;
