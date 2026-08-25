-- Step 009V: remove only the audited public rows for the two completed
-- disposable Stripe sandbox simulations.
--
-- This one-use migration is intentionally fail closed. It preserves Auth,
-- every webhook event, Stripe-managed history, the paid learner, catalogue
-- mappings, progress and every non-target row.

BEGIN;

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SELECT pg_advisory_xact_lock(
  hashtextextended('latt:20260918:disposable-payment-public-cleanup', 0)
);

LOCK TABLE
  public.payment_exam_products,
  public.payment_customers,
  public.payment_exam_subscriptions,
  public.payment_webhook_events,
  public.exam_entitlement_events,
  public.exam_entitlements,
  public.learner_item_progress,
  public.exam_attempts,
  public.hands_on_task_progress,
  public.user_learning_path_progress,
  public.user_learning_path_resources,
  public.user_aws_connections,
  public.follow_along_author_drafts,
  public.follow_along_author_revisions,
  public.follow_along_release_candidates,
  public.follow_along_published_programmes,
  public.follow_along_publication_history,
  public.follow_along_author_draft_deletions
  IN SHARE ROW EXCLUSIVE MODE;

DO $$
DECLARE
  target_a CONSTANT UUID := '8bf0e3bc-bed7-43bf-a4db-e8f788c19852'::uuid;
  target_b CONSTANT UUID := 'a54a5e55-482f-4bd2-adc1-d58f2b4f235b'::uuid;
  migration_count INTEGER := 0;
  matching_rows INTEGER := 0;
  dependency_rows INTEGER := 0;
  deleted_entitlement_events INTEGER := 0;
  deleted_entitlements INTEGER := 0;
  deleted_subscriptions INTEGER := 0;
  deleted_customers INTEGER := 0;
  counts_before JSONB;
  counts_after JSONB;
  products_before JSONB;
  products_after JSONB;
  webhooks_before JSONB;
  webhooks_after JSONB;
  progress_before JSONB;
  progress_after JSONB;
  attempts_before JSONB;
  attempts_after JSONB;
  non_target_customers_before JSONB;
  non_target_customers_after JSONB;
  non_target_subscriptions_before JSONB;
  non_target_subscriptions_after JSONB;
  non_target_entitlements_before JSONB;
  non_target_entitlements_after JSONB;
  non_target_entitlement_events_before JSONB;
  non_target_entitlement_events_after JSONB;
  auth_users_before JSONB;
  auth_users_after JSONB;
  auth_identities_before JSONB;
  auth_identities_after JSONB;
  webhook_fingerprint_before TEXT;
  webhook_fingerprint_after TEXT;
  progress_fingerprint_before TEXT;
  progress_fingerprint_after TEXT;
  attempts_fingerprint_before TEXT;
  attempts_fingerprint_after TEXT;
BEGIN
  SELECT count(*) INTO migration_count
  FROM supabase_migrations.schema_migrations
  WHERE version IN (
    '20260912',
    '20260913',
    '20260914',
    '20260915',
    '20260916',
    '20260917'
  );

  IF migration_count <> 6 THEN
    RAISE EXCEPTION
      '20260918 stopped: migrations 20260912 through 20260917 are not each recorded exactly once.';
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
    'payment_webhook_events', 26,
    'exam_entitlement_events', 6,
    'exam_entitlements', 3,
    'learner_item_progress', 3,
    'exam_attempts', 12
  ) THEN
    RAISE EXCEPTION
      '20260918 stopped: a protected baseline count changed: %.',
      counts_before;
  END IF;

  SELECT md5(string_agg(to_jsonb(row_value)::text, '|' ORDER BY row_value.stripe_event_id))
  INTO webhook_fingerprint_before
  FROM public.payment_webhook_events row_value;

  SELECT md5(COALESCE(string_agg(
    row_to_json(row_value)::text,
    '|'
    ORDER BY row_value.user_id, row_value.exam_id, row_value.progress_type, row_value.content_id
  ), ''))
  INTO progress_fingerprint_before
  FROM public.learner_item_progress row_value;

  SELECT md5(COALESCE(string_agg(
    to_jsonb(row_value)::text,
    '|'
    ORDER BY to_jsonb(row_value)::text
  ), ''))
  INTO attempts_fingerprint_before
  FROM public.exam_attempts row_value;

  IF webhook_fingerprint_before <> '96c237275970d366a275757c9ad2709e'
     OR progress_fingerprint_before <> '02be1138e0ba986b57627663a324cdc9'
     OR attempts_fingerprint_before <> '4a21373ec0ecdfb94fabf1e532e323e1' THEN
    RAISE EXCEPTION
      '20260918 stopped: a protected fingerprint changed: webhook %, progress %, attempts %.',
      webhook_fingerprint_before,
      progress_fingerprint_before,
      attempts_fingerprint_before;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.payment_webhook_events
  WHERE processing_status = 'processed';

  IF matching_rows <> 23 THEN
    RAISE EXCEPTION
      '20260918 stopped: processed webhook count is % instead of 23.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.payment_webhook_events
  WHERE processing_status = 'ignored';

  IF matching_rows <> 3 THEN
    RAISE EXCEPTION
      '20260918 stopped: ignored webhook count is % instead of 3.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.payment_webhook_events
  WHERE (
      provider_object_id = 'sub_1U7LH93Ne8JYQdqLKUFDoY7s'
      AND processing_status = 'processed'
    ) OR (
      provider_object_id = 'sub_1U7vR33Ne8JYQdqLwXcMRAJs'
      AND processing_status = 'processed'
    );

  IF matching_rows <> 18 THEN
    RAISE EXCEPTION
      '20260918 stopped: disposable processed webhook count is % instead of 18.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.payment_webhook_events
  WHERE (
      provider_object_id = 'sub_1U7LH93Ne8JYQdqLKUFDoY7s'
      AND processing_status = 'ignored'
    ) OR (
      provider_object_id = 'sub_1U7vR33Ne8JYQdqLwXcMRAJs'
      AND processing_status = 'ignored'
    );

  IF matching_rows <> 3 THEN
    RAISE EXCEPTION
      '20260918 stopped: disposable ignored webhook count is % instead of 3.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.payment_exam_products
  WHERE (
      exam_id = 'aws-saa-c03'
      AND livemode = false
      AND stripe_product_id = 'prod_V73CMqyLhOZvIe'
      AND stripe_annual_price_id = 'price_1U6p6S3Ne8JYQdqLX9pxvu22'
      AND currency = 'gbp'
      AND unit_amount = 1999
      AND enabled = true
    ) OR (
      exam_id = 'terraform-associate-004'
      AND livemode = false
      AND stripe_product_id = 'prod_V73DdOKBBVtyOf'
      AND stripe_annual_price_id = 'price_1U6p7A3Ne8JYQdqLSFLCNE8W'
      AND currency = 'gbp'
      AND unit_amount = 1999
      AND enabled = true
    ) OR (
      exam_id = 'comptia-sec-plus'
      AND livemode = false
      AND stripe_product_id = 'prod_V73E3DraGTbgV2'
      AND stripe_annual_price_id = 'price_1U6p7f3Ne8JYQdqLFEQS3gPb'
      AND currency = 'gbp'
      AND unit_amount = 1999
      AND enabled = true
    );

  IF matching_rows <> 3 THEN
    RAISE EXCEPTION
      '20260918 stopped: exact protected catalogue mappings matched % rows.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM auth.users row_value
  WHERE (
      row_value.id = target_a
      AND row_value.email = 'latt-stripe-sim-008z@example.com'
      AND row_value.raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb
      AND row_value.raw_user_meta_data = '{"email_verified":true}'::jsonb
    ) OR (
      row_value.id = target_b
      AND row_value.email = 'aaaabbbb@yahoo.com'
      AND row_value.raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb
      AND row_value.raw_user_meta_data = '{"email_verified":true}'::jsonb
    );

  IF matching_rows <> 2 THEN
    RAISE EXCEPTION
      '20260918 stopped: exact disposable Auth users matched % rows.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM auth.identities
  WHERE user_id IN (target_a, target_b);

  IF matching_rows <> 2
     OR (SELECT count(*) FROM auth.identities WHERE user_id = target_a) <> 1
     OR (SELECT count(*) FROM auth.identities WHERE user_id = target_b) <> 1 THEN
    RAISE EXCEPTION
      '20260918 stopped: disposable Auth identity counts differ.';
  END IF;

  SELECT
      (SELECT count(*) FROM auth.sessions WHERE user_id IN (target_a, target_b))
    + (SELECT count(*) FROM auth.refresh_tokens WHERE user_id IN (target_a::text, target_b::text))
    + (SELECT count(*) FROM auth.mfa_factors WHERE user_id IN (target_a, target_b))
    + (SELECT count(*) FROM auth.oauth_authorizations WHERE user_id IN (target_a, target_b))
    + (SELECT count(*) FROM auth.oauth_consents WHERE user_id IN (target_a, target_b))
    + (SELECT count(*) FROM auth.one_time_tokens WHERE user_id IN (target_a, target_b))
    + (SELECT count(*) FROM auth.webauthn_challenges WHERE user_id IN (target_a, target_b))
    + (SELECT count(*) FROM auth.webauthn_credentials WHERE user_id IN (target_a, target_b))
  INTO dependency_rows;

  IF dependency_rows <> 0 THEN
    RAISE EXCEPTION
      '20260918 stopped: disposable Auth dependency count is % instead of 0.',
      dependency_rows;
  END IF;

  SELECT
      (SELECT count(*) FROM public.exam_attempts WHERE user_id IN (target_a, target_b))
    + (SELECT count(*) FROM public.learner_item_progress WHERE user_id IN (target_a, target_b))
    + (SELECT count(*) FROM public.hands_on_task_progress WHERE user_id IN (target_a, target_b))
    + (SELECT count(*) FROM public.user_learning_path_progress WHERE user_id IN (target_a, target_b))
    + (SELECT count(*) FROM public.user_learning_path_resources WHERE user_id IN (target_a, target_b))
    + (SELECT count(*) FROM public.user_aws_connections WHERE user_id IN (target_a::text, target_b::text))
  INTO dependency_rows;

  IF dependency_rows <> 0 THEN
    RAISE EXCEPTION
      '20260918 stopped: disposable learner-data dependency count is % instead of 0.',
      dependency_rows;
  END IF;

  SELECT
      (SELECT count(*) FROM public.follow_along_author_drafts WHERE owner_id IN (target_a, target_b))
    + (SELECT count(*) FROM public.follow_along_author_revisions WHERE owner_id IN (target_a, target_b))
    + (SELECT count(*) FROM public.follow_along_author_revisions WHERE recorded_by IN (target_a, target_b))
    + (SELECT count(*) FROM public.follow_along_release_candidates WHERE created_by IN (target_a, target_b))
    + (SELECT count(*) FROM public.follow_along_release_candidates WHERE approved_by IN (target_a, target_b))
    + (SELECT count(*) FROM public.follow_along_release_candidates WHERE rejected_by IN (target_a, target_b))
    + (SELECT count(*) FROM public.follow_along_published_programmes WHERE published_by IN (target_a, target_b))
    + (SELECT count(*) FROM public.follow_along_publication_history WHERE published_by IN (target_a, target_b))
    + (SELECT count(*) FROM public.follow_along_author_draft_deletions WHERE deleted_by IN (target_a, target_b))
  INTO dependency_rows;

  IF dependency_rows <> 0 THEN
    RAISE EXCEPTION
      '20260918 stopped: disposable staff-work dependency count is % instead of 0.',
      dependency_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.payment_customers
  WHERE (
      user_id = target_a
      AND livemode = false
      AND stripe_customer_id = 'cus_V7aJjrJFCVjm5I'
      AND created_at = '2026-08-22 20:12:27.784182+00'::timestamptz
      AND updated_at = '2026-08-25 15:16:04.931097+00'::timestamptz
    ) OR (
      user_id = target_b
      AND livemode = false
      AND stripe_customer_id = 'cus_V8BoF00adTS1kw'
      AND created_at = '2026-08-24 10:49:06.539337+00'::timestamptz
      AND updated_at = '2026-08-25 13:25:31.681711+00'::timestamptz
    );

  IF matching_rows <> 2 THEN
    RAISE EXCEPTION
      '20260918 stopped: exact disposable Customer bindings matched % rows.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.payment_exam_subscriptions
  WHERE (
      stripe_subscription_id = 'sub_1U7LH93Ne8JYQdqLKUFDoY7s'
      AND user_id = target_a
      AND exam_id = 'aws-saa-c03'
      AND livemode = false
      AND stripe_customer_id = 'cus_V7aJjrJFCVjm5I'
      AND stripe_product_id = 'prod_V73CMqyLhOZvIe'
      AND stripe_price_id = 'price_1U6p6S3Ne8JYQdqLX9pxvu22'
      AND provider_status = 'canceled'
      AND cancel_at_period_end = false
      AND current_period_start = '2028-08-22 20:03:34+00'::timestamptz
      AND current_period_end = '2029-08-22 20:03:34+00'::timestamptz
      AND paid_through IS NULL
      AND latest_invoice_id = 'in_1U7LYD3Ne8JYQdqLIobN0T3Q'
      AND latest_provider_event_created_at = '2026-08-25 15:16:03+00'::timestamptz
      AND created_at = '2026-08-22 20:12:27.853114+00'::timestamptz
      AND updated_at = '2026-08-25 15:16:04.933482+00'::timestamptz
    ) OR (
      stripe_subscription_id = 'sub_1U7vR33Ne8JYQdqLwXcMRAJs'
      AND user_id = target_b
      AND exam_id = 'aws-saa-c03'
      AND livemode = false
      AND stripe_customer_id = 'cus_V8BoF00adTS1kw'
      AND stripe_product_id = 'prod_V73CMqyLhOZvIe'
      AND stripe_price_id = 'price_1U6p6S3Ne8JYQdqLX9pxvu22'
      AND provider_status = 'canceled'
      AND cancel_at_period_end = false
      AND current_period_start = '2026-08-24 10:49:02+00'::timestamptz
      AND current_period_end = '2027-08-24 10:49:02+00'::timestamptz
      AND paid_through = '2027-08-24 10:49:02+00'::timestamptz
      AND latest_invoice_id = 'in_1U7vR33Ne8JYQdqLND2NszLw'
      AND latest_provider_event_created_at = '2026-08-25 13:25:29+00'::timestamptz
      AND created_at = '2026-08-24 10:49:06.545262+00'::timestamptz
      AND updated_at = '2026-08-25 13:25:31.689701+00'::timestamptz
    );

  IF matching_rows <> 2 THEN
    RAISE EXCEPTION
      '20260918 stopped: exact disposable Subscriptions matched % rows.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.exam_entitlements
  WHERE (
      user_id = target_a
      AND exam_id = 'aws-saa-c03'
      AND status = 'revoked'
      AND starts_at = '2026-08-22 20:03:34+00'::timestamptz
      AND expires_at = '2028-08-22 20:03:34+00'::timestamptz
      AND created_at = '2026-08-22 20:12:27.865110+00'::timestamptz
      AND updated_at = '2026-08-25 12:57:44.774085+00'::timestamptz
    ) OR (
      user_id = target_b
      AND exam_id = 'aws-saa-c03'
      AND status = 'revoked'
      AND starts_at = '2026-08-24 10:49:02+00'::timestamptz
      AND expires_at = '2027-08-24 10:49:02+00'::timestamptz
      AND created_at = '2026-08-24 10:49:06.547804+00'::timestamptz
      AND updated_at = '2026-08-25 13:25:31.696774+00'::timestamptz
    );

  IF matching_rows <> 2 THEN
    RAISE EXCEPTION
      '20260918 stopped: exact disposable entitlements matched % rows.',
      matching_rows;
  END IF;

  SELECT count(*) INTO matching_rows
  FROM public.exam_entitlement_events
  WHERE (
      event_id = '7906ce0c-d156-46bf-be39-dd0142684e0e'::uuid
      AND user_id = target_a
      AND exam_id = 'aws-saa-c03'
      AND source_type = 'stripe_subscription'
      AND source_reference = 'sub_1U7LH93Ne8JYQdqLKUFDoY7s'
      AND previous_status IS NULL
      AND new_status = 'active'
      AND previous_expiry IS NULL
      AND new_expiry = '2027-08-22 20:03:34+00'::timestamptz
      AND reason_code = 'invoice_paid'
      AND stripe_event_id = 'evt_1U7LHB3Ne8JYQdqLlvuMu8kp'
      AND created_at = '2026-08-22 20:12:27.869329+00'::timestamptz
    ) OR (
      event_id = '3ff0eafa-7315-41cd-afb5-73e21c8a7610'::uuid
      AND user_id = target_a
      AND exam_id = 'aws-saa-c03'
      AND source_type = 'stripe_subscription'
      AND source_reference = 'sub_1U7LH93Ne8JYQdqLKUFDoY7s'
      AND previous_status = 'active'
      AND new_status = 'active'
      AND previous_expiry = '2027-08-22 20:03:34+00'::timestamptz
      AND new_expiry = '2028-08-22 20:03:34+00'::timestamptz
      AND reason_code = 'invoice_paid'
      AND stripe_event_id = 'evt_1U7LYK3Ne8JYQdqLb1E3I2lR'
      AND created_at = '2026-08-22 20:30:09.293354+00'::timestamptz
    ) OR (
      event_id = '9d70cab3-6dd0-45d8-bce4-c44d59ed3ae6'::uuid
      AND user_id = target_a
      AND exam_id = 'aws-saa-c03'
      AND source_type = 'stripe_subscription'
      AND source_reference = 'sub_1U7LH93Ne8JYQdqLKUFDoY7s'
      AND previous_status = 'active'
      AND new_status = 'revoked'
      AND previous_expiry = '2028-08-22 20:03:34+00'::timestamptz
      AND new_expiry = '2028-08-22 20:03:34+00'::timestamptz
      AND reason_code = 'full_refund'
      AND stripe_event_id = 'evt_3U7LYG3Ne8JYQdqL1wBsusMg'
      AND created_at = '2026-08-25 12:57:44.780363+00'::timestamptz
    ) OR (
      event_id = 'ca95a91f-254a-4669-a8f8-149159963f88'::uuid
      AND user_id = target_b
      AND exam_id = 'aws-saa-c03'
      AND source_type = 'stripe_subscription'
      AND source_reference = 'sub_1U7vR33Ne8JYQdqLwXcMRAJs'
      AND previous_status IS NULL
      AND new_status = 'active'
      AND previous_expiry IS NULL
      AND new_expiry = '2027-08-24 10:49:02+00'::timestamptz
      AND reason_code = 'invoice_paid'
      AND stripe_event_id = 'evt_1U7vR63Ne8JYQdqLVViJHkme'
      AND created_at = '2026-08-24 10:49:06.548400+00'::timestamptz
    ) OR (
      event_id = '5934c0a2-4525-406e-8feb-4242a2d79fc3'::uuid
      AND user_id = target_b
      AND exam_id = 'aws-saa-c03'
      AND source_type = 'stripe_subscription'
      AND source_reference = 'sub_1U7vR33Ne8JYQdqLwXcMRAJs'
      AND previous_status = 'active'
      AND new_status = 'revoked'
      AND previous_expiry = '2027-08-24 10:49:02+00'::timestamptz
      AND new_expiry = '2027-08-24 10:49:02+00'::timestamptz
      AND reason_code = 'subscription_ended'
      AND stripe_event_id = 'evt_1U8KM13Ne8JYQdqLBfgWwcyP'
      AND created_at = '2026-08-25 13:25:31.697848+00'::timestamptz
    );

  IF matching_rows <> 5 THEN
    RAISE EXCEPTION
      '20260918 stopped: exact disposable entitlement transitions matched % rows.',
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
    AND paid_through = '2027-08-21 13:38:55+00'::timestamptz
    AND latest_invoice_id = 'in_1U6seq3Ne8JYQdqLl2elRcEu'
    AND latest_provider_event_created_at = '2026-08-21 14:02:24+00'::timestamptz
    AND created_at = '2026-08-21 13:39:00.500781+00'::timestamptz
    AND updated_at = '2026-08-21 14:02:26.798626+00'::timestamptz;

  IF matching_rows <> 1
     OR NOT EXISTS (
       SELECT 1
       FROM public.payment_customers
       WHERE user_id = 'df06f24d-3620-4889-ae2a-6883d87d29a2'::uuid
         AND livemode = false
         AND stripe_customer_id = 'cus_V76jo6wpeXM5Y9'
     )
     OR NOT EXISTS (
       SELECT 1
       FROM public.exam_entitlements
       WHERE user_id = 'df06f24d-3620-4889-ae2a-6883d87d29a2'::uuid
         AND exam_id = 'aws-saa-c03'
         AND status = 'active'
         AND starts_at = '2026-08-21 13:38:55+00'::timestamptz
         AND expires_at = '2027-08-21 13:38:55+00'::timestamptz
     )
     OR NOT EXISTS (
       SELECT 1
       FROM public.exam_entitlement_events
       WHERE event_id = '5bcba548-f52b-424a-8b23-7ab7e0730d0a'::uuid
         AND user_id = 'df06f24d-3620-4889-ae2a-6883d87d29a2'::uuid
         AND exam_id = 'aws-saa-c03'
         AND source_reference = 'sub_1U6ser3Ne8JYQdqLp5IpnM4x'
         AND previous_status IS NULL
         AND new_status = 'active'
         AND previous_expiry IS NULL
         AND new_expiry = '2027-08-21 13:38:55+00'::timestamptz
         AND reason_code = 'invoice_paid'
         AND stripe_event_id = 'evt_1U6ses3Ne8JYQdqLNlUmLdJ5'
         AND created_at = '2026-08-21 13:39:00.505431+00'::timestamptz
     ) THEN
    RAISE EXCEPTION
      '20260918 stopped: the exact preserved paid learner chain differs.';
  END IF;

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.exam_id, row_value.livemode), '[]'::jsonb)
  INTO products_before
  FROM public.payment_exam_products row_value;

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.stripe_event_id), '[]'::jsonb)
  INTO webhooks_before
  FROM public.payment_webhook_events row_value;

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.user_id, row_value.exam_id, row_value.progress_type, row_value.content_id), '[]'::jsonb)
  INTO progress_before
  FROM public.learner_item_progress row_value;

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.id), '[]'::jsonb)
  INTO attempts_before
  FROM public.exam_attempts row_value;

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.user_id, row_value.livemode), '[]'::jsonb)
  INTO non_target_customers_before
  FROM public.payment_customers row_value
  WHERE row_value.user_id NOT IN (target_a, target_b);

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.stripe_subscription_id), '[]'::jsonb)
  INTO non_target_subscriptions_before
  FROM public.payment_exam_subscriptions row_value
  WHERE row_value.user_id NOT IN (target_a, target_b);

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.user_id, row_value.exam_id), '[]'::jsonb)
  INTO non_target_entitlements_before
  FROM public.exam_entitlements row_value
  WHERE row_value.user_id NOT IN (target_a, target_b);

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.event_id), '[]'::jsonb)
  INTO non_target_entitlement_events_before
  FROM public.exam_entitlement_events row_value
  WHERE row_value.user_id NOT IN (target_a, target_b);

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.id), '[]'::jsonb)
  INTO auth_users_before
  FROM auth.users row_value
  WHERE row_value.id IN (target_a, target_b);

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.id), '[]'::jsonb)
  INTO auth_identities_before
  FROM auth.identities row_value
  WHERE row_value.user_id IN (target_a, target_b);

  DELETE FROM public.exam_entitlement_events
  WHERE event_id IN (
    '7906ce0c-d156-46bf-be39-dd0142684e0e'::uuid,
    '3ff0eafa-7315-41cd-afb5-73e21c8a7610'::uuid,
    '9d70cab3-6dd0-45d8-bce4-c44d59ed3ae6'::uuid,
    'ca95a91f-254a-4669-a8f8-149159963f88'::uuid,
    '5934c0a2-4525-406e-8feb-4242a2d79fc3'::uuid
  )
    AND user_id IN (target_a, target_b);

  GET DIAGNOSTICS deleted_entitlement_events = ROW_COUNT;

  IF deleted_entitlement_events <> 5 THEN
    RAISE EXCEPTION
      '20260918 stopped: entitlement-event cleanup deleted % rows.',
      deleted_entitlement_events;
  END IF;

  DELETE FROM public.exam_entitlements
  WHERE user_id IN (target_a, target_b)
    AND exam_id = 'aws-saa-c03'
    AND status = 'revoked';

  GET DIAGNOSTICS deleted_entitlements = ROW_COUNT;

  IF deleted_entitlements <> 2 THEN
    RAISE EXCEPTION
      '20260918 stopped: entitlement cleanup deleted % rows.',
      deleted_entitlements;
  END IF;

  DELETE FROM public.payment_exam_subscriptions
  WHERE stripe_subscription_id IN (
    'sub_1U7LH93Ne8JYQdqLKUFDoY7s',
    'sub_1U7vR33Ne8JYQdqLwXcMRAJs'
  )
    AND user_id IN (target_a, target_b)
    AND exam_id = 'aws-saa-c03'
    AND livemode = false
    AND provider_status = 'canceled';

  GET DIAGNOSTICS deleted_subscriptions = ROW_COUNT;

  IF deleted_subscriptions <> 2 THEN
    RAISE EXCEPTION
      '20260918 stopped: Subscription cleanup deleted % rows.',
      deleted_subscriptions;
  END IF;

  DELETE FROM public.payment_customers
  WHERE user_id IN (target_a, target_b)
    AND livemode = false
    AND stripe_customer_id IN ('cus_V7aJjrJFCVjm5I', 'cus_V8BoF00adTS1kw');

  GET DIAGNOSTICS deleted_customers = ROW_COUNT;

  IF deleted_customers <> 2 THEN
    RAISE EXCEPTION
      '20260918 stopped: Customer cleanup deleted % rows.',
      deleted_customers;
  END IF;

  IF deleted_entitlement_events
     + deleted_entitlements
     + deleted_subscriptions
     + deleted_customers <> 11 THEN
    RAISE EXCEPTION
      '20260918 stopped: total public cleanup count is not exactly 11.';
  END IF;

  IF EXISTS (SELECT 1 FROM public.exam_entitlement_events WHERE user_id IN (target_a, target_b))
     OR EXISTS (SELECT 1 FROM public.exam_entitlements WHERE user_id IN (target_a, target_b))
     OR EXISTS (SELECT 1 FROM public.payment_exam_subscriptions WHERE user_id IN (target_a, target_b))
     OR EXISTS (SELECT 1 FROM public.payment_customers WHERE user_id IN (target_a, target_b)) THEN
    RAISE EXCEPTION
      '20260918 stopped: a disposable public target row remains.';
  END IF;

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.exam_id, row_value.livemode), '[]'::jsonb)
  INTO products_after
  FROM public.payment_exam_products row_value;

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.stripe_event_id), '[]'::jsonb)
  INTO webhooks_after
  FROM public.payment_webhook_events row_value;

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.user_id, row_value.exam_id, row_value.progress_type, row_value.content_id), '[]'::jsonb)
  INTO progress_after
  FROM public.learner_item_progress row_value;

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.id), '[]'::jsonb)
  INTO attempts_after
  FROM public.exam_attempts row_value;

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.user_id, row_value.livemode), '[]'::jsonb)
  INTO non_target_customers_after
  FROM public.payment_customers row_value;

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.stripe_subscription_id), '[]'::jsonb)
  INTO non_target_subscriptions_after
  FROM public.payment_exam_subscriptions row_value;

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.user_id, row_value.exam_id), '[]'::jsonb)
  INTO non_target_entitlements_after
  FROM public.exam_entitlements row_value;

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.event_id), '[]'::jsonb)
  INTO non_target_entitlement_events_after
  FROM public.exam_entitlement_events row_value;

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.id), '[]'::jsonb)
  INTO auth_users_after
  FROM auth.users row_value
  WHERE row_value.id IN (target_a, target_b);

  SELECT COALESCE(jsonb_agg(to_jsonb(row_value) ORDER BY row_value.id), '[]'::jsonb)
  INTO auth_identities_after
  FROM auth.identities row_value
  WHERE row_value.user_id IN (target_a, target_b);

  IF products_after IS DISTINCT FROM products_before
     OR webhooks_after IS DISTINCT FROM webhooks_before
     OR progress_after IS DISTINCT FROM progress_before
     OR attempts_after IS DISTINCT FROM attempts_before
     OR non_target_customers_after IS DISTINCT FROM non_target_customers_before
     OR non_target_subscriptions_after IS DISTINCT FROM non_target_subscriptions_before
     OR non_target_entitlements_after IS DISTINCT FROM non_target_entitlements_before
     OR non_target_entitlement_events_after IS DISTINCT FROM non_target_entitlement_events_before
     OR auth_users_after IS DISTINCT FROM auth_users_before
     OR auth_identities_after IS DISTINCT FROM auth_identities_before THEN
    RAISE EXCEPTION
      '20260918 stopped: a protected non-target or Auth row changed.';
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

  IF counts_after IS DISTINCT FROM jsonb_build_object(
    'payment_exam_products', 3,
    'payment_customers', 1,
    'payment_exam_subscriptions', 1,
    'payment_webhook_events', 26,
    'exam_entitlement_events', 1,
    'exam_entitlements', 1,
    'learner_item_progress', 3,
    'exam_attempts', 12
  ) THEN
    RAISE EXCEPTION
      '20260918 stopped: final protected counts are incorrect: %.',
      counts_after;
  END IF;

  SELECT md5(string_agg(to_jsonb(row_value)::text, '|' ORDER BY row_value.stripe_event_id))
  INTO webhook_fingerprint_after
  FROM public.payment_webhook_events row_value;

  SELECT md5(COALESCE(string_agg(
    row_to_json(row_value)::text,
    '|'
    ORDER BY row_value.user_id, row_value.exam_id, row_value.progress_type, row_value.content_id
  ), ''))
  INTO progress_fingerprint_after
  FROM public.learner_item_progress row_value;

  SELECT md5(COALESCE(string_agg(
    to_jsonb(row_value)::text,
    '|'
    ORDER BY to_jsonb(row_value)::text
  ), ''))
  INTO attempts_fingerprint_after
  FROM public.exam_attempts row_value;

  IF webhook_fingerprint_after IS DISTINCT FROM webhook_fingerprint_before
     OR progress_fingerprint_after IS DISTINCT FROM progress_fingerprint_before
     OR attempts_fingerprint_after IS DISTINCT FROM attempts_fingerprint_before THEN
    RAISE EXCEPTION
      '20260918 stopped: a protected fingerprint changed during cleanup.';
  END IF;
END;
$$;

COMMIT;
