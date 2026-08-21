-- LATT Step 008D: exact Stripe test-mode exam catalogue.
--
-- Scope:
-- - Insert exactly three verified Stripe sandbox Product/annual Price mappings.
-- - Enable only the approved GBP 19.99 yearly test mappings.
-- - Create no live-mode mapping and change no entitlement or learner progress.

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
      RAISE EXCEPTION '20260909 stopped: public.% is missing.', relation_name;
    END IF;
  END LOOP;

  IF EXISTS (SELECT 1 FROM public.payment_exam_products) THEN
    RAISE EXCEPTION
      '20260909 stopped: the protected Stripe product catalogue is not empty.';
  END IF;

  IF EXISTS (SELECT 1 FROM public.payment_customers)
     OR EXISTS (SELECT 1 FROM public.payment_exam_subscriptions)
     OR EXISTS (SELECT 1 FROM public.payment_webhook_events)
     OR EXISTS (SELECT 1 FROM public.exam_entitlement_events) THEN
    RAISE EXCEPTION
      '20260909 stopped: payment activity exists before the test catalogue seed.';
  END IF;
END;
$$;

LOCK TABLE public.payment_exam_products IN SHARE ROW EXCLUSIVE MODE;
LOCK TABLE public.payment_customers IN SHARE MODE;
LOCK TABLE public.payment_exam_subscriptions IN SHARE MODE;
LOCK TABLE public.payment_webhook_events IN SHARE MODE;
LOCK TABLE public.exam_entitlement_events IN SHARE MODE;
LOCK TABLE public.exam_entitlements IN SHARE MODE;
LOCK TABLE public.learner_item_progress IN SHARE MODE;
LOCK TABLE public.exam_attempts IN SHARE MODE;
LOCK TABLE public.user_learning_path_progress IN SHARE MODE;
LOCK TABLE public.user_learning_path_resources IN SHARE MODE;

CREATE TEMP TABLE step008d_existing_row_guard ON COMMIT DROP AS
SELECT
  (SELECT COUNT(*) FROM public.payment_customers) AS customer_rows,
  (SELECT COUNT(*) FROM public.payment_exam_subscriptions) AS subscription_rows,
  (SELECT COUNT(*) FROM public.payment_webhook_events) AS webhook_rows,
  (SELECT COUNT(*) FROM public.exam_entitlement_events) AS entitlement_event_rows,
  (SELECT COUNT(*) FROM public.exam_entitlements) AS entitlement_rows,
  (SELECT COUNT(*) FROM public.learner_item_progress) AS learner_item_progress_rows,
  (SELECT COUNT(*) FROM public.exam_attempts) AS exam_attempt_rows,
  (SELECT COUNT(*) FROM public.user_learning_path_progress) AS follow_along_progress_rows,
  (SELECT COUNT(*) FROM public.user_learning_path_resources) AS follow_along_resource_rows;

INSERT INTO public.payment_exam_products (
  exam_id,
  livemode,
  stripe_product_id,
  stripe_annual_price_id,
  currency,
  unit_amount,
  enabled
) VALUES
  (
    'aws-saa-c03',
    FALSE,
    'prod_V73CMqyLhOZvIe',
    'price_1U6p6S3Ne8JYQdqLX9pxvu22',
    'gbp',
    1999,
    TRUE
  ),
  (
    'terraform-associate-004',
    FALSE,
    'prod_V73DdOKBBVtyOf',
    'price_1U6p7A3Ne8JYQdqLSFLCNE8W',
    'gbp',
    1999,
    TRUE
  ),
  (
    'comptia-sec-plus',
    FALSE,
    'prod_V73E3DraGTbgV2',
    'price_1U6p7f3Ne8JYQdqLFEQS3gPb',
    'gbp',
    1999,
    TRUE
  );

DO $$
DECLARE
  guard step008d_existing_row_guard%ROWTYPE;
BEGIN
  SELECT * INTO guard FROM step008d_existing_row_guard;

  IF (SELECT COUNT(*) FROM public.payment_exam_products) <> 3
     OR (SELECT COUNT(*) FROM public.payment_exam_products WHERE livemode = FALSE) <> 3
     OR EXISTS (SELECT 1 FROM public.payment_exam_products WHERE livemode = TRUE)
     OR (SELECT COUNT(*) FROM public.payment_exam_products
         WHERE currency = 'gbp' AND unit_amount = 1999 AND enabled = TRUE) <> 3 THEN
    RAISE EXCEPTION
      '20260909 stopped: the exact three enabled GBP 19.99 test mappings were not created.';
  END IF;

  IF EXISTS (
    SELECT *
    FROM (VALUES
      ('aws-saa-c03', 'prod_V73CMqyLhOZvIe', 'price_1U6p6S3Ne8JYQdqLX9pxvu22'),
      ('terraform-associate-004', 'prod_V73DdOKBBVtyOf', 'price_1U6p7A3Ne8JYQdqLSFLCNE8W'),
      ('comptia-sec-plus', 'prod_V73E3DraGTbgV2', 'price_1U6p7f3Ne8JYQdqLFEQS3gPb')
    ) AS expected(exam_id, stripe_product_id, stripe_annual_price_id)
    EXCEPT
    SELECT exam_id, stripe_product_id, stripe_annual_price_id
    FROM public.payment_exam_products
    WHERE livemode = FALSE
  ) THEN
    RAISE EXCEPTION
      '20260909 stopped: a Stripe test Product or Price mapping does not match the verified catalogue.';
  END IF;

  IF guard.customer_rows IS DISTINCT FROM (SELECT COUNT(*) FROM public.payment_customers)
     OR guard.subscription_rows IS DISTINCT FROM (SELECT COUNT(*) FROM public.payment_exam_subscriptions)
     OR guard.webhook_rows IS DISTINCT FROM (SELECT COUNT(*) FROM public.payment_webhook_events)
     OR guard.entitlement_event_rows IS DISTINCT FROM (SELECT COUNT(*) FROM public.exam_entitlement_events)
     OR guard.entitlement_rows IS DISTINCT FROM (SELECT COUNT(*) FROM public.exam_entitlements)
     OR guard.learner_item_progress_rows IS DISTINCT FROM (SELECT COUNT(*) FROM public.learner_item_progress)
     OR guard.exam_attempt_rows IS DISTINCT FROM (SELECT COUNT(*) FROM public.exam_attempts)
     OR guard.follow_along_progress_rows IS DISTINCT FROM (SELECT COUNT(*) FROM public.user_learning_path_progress)
     OR guard.follow_along_resource_rows IS DISTINCT FROM (SELECT COUNT(*) FROM public.user_learning_path_resources) THEN
    RAISE EXCEPTION
      '20260909 stopped: payment activity, entitlement or learner progress rows changed.';
  END IF;

  IF has_table_privilege('anon', 'public.payment_exam_products', 'SELECT')
     OR has_table_privilege('authenticated', 'public.payment_exam_products', 'SELECT')
     OR has_table_privilege('service_role', 'public.payment_exam_products', 'SELECT') THEN
    RAISE EXCEPTION
      '20260909 stopped: the protected catalogue gained a direct application-role privilege.';
  END IF;
END;
$$;

COMMIT;
