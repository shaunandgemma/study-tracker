-- Step 004K post-deployment verification. Read-only and rollback-only.
BEGIN;
SET TRANSACTION READ ONLY;

SELECT
  exam_code,
  COUNT(*) AS total_questions,
  COUNT(*) FILTER (WHERE preview_order IS NOT NULL) AS preview_questions,
  MIN(preview_order) AS first_preview_position,
  MAX(preview_order) AS last_preview_position
FROM public.exam_questions
GROUP BY exam_code
ORDER BY exam_code;

SELECT
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('exam_questions', 'question_topics')
ORDER BY tablename, policyname;

SELECT
  grantee,
  table_name,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('exam_questions', 'question_topics')
  AND grantee IN ('anon', 'authenticated')
ORDER BY table_name, grantee, privilege_type;

SELECT version
FROM supabase_migrations.schema_migrations
WHERE version = '20260903';

ROLLBACK;
