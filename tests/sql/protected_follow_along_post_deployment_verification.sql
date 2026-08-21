-- Step 007E5 post-deployment verification. Read-only and rollback-only.
BEGIN;
SET TRANSACTION READ ONLY;

WITH source_rows AS (
  SELECT *
  FROM public.follow_along_published_programmes
  WHERE publication_status = 'published'
), protected_rows AS (
  SELECT *
  FROM public.learner_content_items
  WHERE content_type = 'follow_along'
)
SELECT
  (SELECT COUNT(*) FROM source_rows) AS published_source_count,
  (SELECT COUNT(*) FROM protected_rows) AS protected_count,
  (SELECT COUNT(*) FROM protected_rows WHERE exam_id = 'aws-saa-c03') AS aws_count,
  (SELECT COUNT(*) FROM protected_rows WHERE exam_id = 'terraform-associate-004') AS terraform_count,
  (SELECT COUNT(*) FROM protected_rows WHERE exam_id = 'comptia-sec-plus') AS comptia_count,
  (SELECT COUNT(*) FROM protected_rows WHERE preview_order IS NOT NULL) AS preview_total;

SELECT exam_id, preview_order, content_id
FROM public.learner_content_items
WHERE content_type = 'follow_along'
  AND preview_order IS NOT NULL
ORDER BY exam_id, preview_order;

WITH protected AS (
  SELECT *
  FROM public.learner_content_items
  WHERE content_type = 'follow_along'
)
SELECT COUNT(*) AS parity_mismatches
FROM public.follow_along_published_programmes source
JOIN public.follow_along_publishable_programmes catalogue
  ON catalogue.programme_id = source.programme_id
LEFT JOIN protected delivered
  ON delivered.content_id = 'follow-along:' || source.programme_id
WHERE source.publication_status = 'published'
  AND (
    delivered.content_id IS NULL
    OR delivered.exam_id IS DISTINCT FROM catalogue.exam_id
    OR delivered.sort_order IS DISTINCT FROM catalogue.learner_sort_order
    OR delivered.preview_order IS DISTINCT FROM catalogue.preview_order
    OR delivered.content_version IS DISTINCT FROM source.source_revision
    OR delivered.content_hash IS DISTINCT FROM
       public.follow_along_jsonb_sha256(source.runtime_content)
    OR delivered.payload IS DISTINCT FROM source.runtime_content
  );

SELECT
  (SELECT relrowsecurity
   FROM pg_class
   WHERE oid = 'public.learner_content_items'::regclass) AS rls_enabled,
  (SELECT COUNT(*)
   FROM pg_policies
   WHERE schemaname = 'public'
     AND tablename = 'learner_content_items'
     AND cmd = 'SELECT') AS select_policy_count,
  has_table_privilege('anon', 'public.learner_content_items', 'SELECT') AS anon_select,
  has_table_privilege('authenticated', 'public.learner_content_items', 'SELECT') AS authenticated_select,
  has_table_privilege('anon', 'public.learner_content_items', 'INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER')
    OR has_table_privilege('authenticated', 'public.learner_content_items', 'INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER')
    AS any_browser_write_privilege;

SELECT set_config('request.jwt.claims', '{}', TRUE);
SET LOCAL ROLE anon;
SELECT 'anonymous' AS identity, COUNT(*) AS visible_total,
       COUNT(*) FILTER (WHERE preview_order IS NULL) AS visible_paid_only
FROM public.learner_content_items
WHERE content_type = 'follow_along';
RESET ROLE;

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated","app_metadata":{"role":"learner","roles":["learner"]}}',
  TRUE
);
SET LOCAL ROLE authenticated;
SELECT 'registered_free' AS identity, COUNT(*) AS visible_total,
       COUNT(*) FILTER (WHERE preview_order IS NULL) AS visible_paid_only
FROM public.learner_content_items
WHERE content_type = 'follow_along';
RESET ROLE;

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated","app_metadata":{"role":"author","roles":["author"]}}',
  TRUE
);
SET LOCAL ROLE authenticated;
SELECT 'author_only' AS identity, COUNT(*) AS visible_total,
       COUNT(*) FILTER (WHERE preview_order IS NULL) AS visible_paid_only
FROM public.learner_content_items
WHERE content_type = 'follow_along';
RESET ROLE;

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated","app_metadata":{"role":"approver","roles":["approver"]}}',
  TRUE
);
SET LOCAL ROLE authenticated;
SELECT 'approver_only' AS identity, COUNT(*) AS visible_total,
       COUNT(*) FILTER (WHERE preview_order IS NULL) AS visible_paid_only
FROM public.learner_content_items
WHERE content_type = 'follow_along';
RESET ROLE;

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated","app_metadata":{"role":"admin","roles":["admin"]}}',
  TRUE
);
SET LOCAL ROLE authenticated;
SELECT 'admin' AS identity, COUNT(*) AS visible_total,
       COUNT(*) FILTER (WHERE preview_order IS NULL) AS visible_paid_only
FROM public.learner_content_items
WHERE content_type = 'follow_along';
RESET ROLE;

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated","app_metadata":{"role":"author","roles":["author","approver"]}}',
  TRUE
);
SET LOCAL ROLE authenticated;
SELECT 'author_approver_conflict' AS identity, COUNT(*) AS visible_total,
       COUNT(*) FILTER (WHERE preview_order IS NULL) AS visible_paid_only
FROM public.learner_content_items
WHERE content_type = 'follow_along';
RESET ROLE;

SELECT version
FROM supabase_migrations.schema_migrations
WHERE version = '20260906';

ROLLBACK;
