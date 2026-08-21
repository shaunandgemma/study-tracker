-- Document 004, Step 004K: entitlement-aware exam-question delivery.
--
-- Scope:
-- - Preserve every existing question and topic mapping.
-- - Mark a deterministic maximum of ten preview questions per exam.
-- - Allow anon and registered-free browsers to read only preview questions.
-- - Allow complete reads only for an active matching entitlement or a trusted
--   Author, Approver or Admin role stored in auth.users.app_metadata.
-- - Remove the former unrestricted public read policies.
-- - Add no browser write path, payment action or service-role credential.

BEGIN;

DO $$
BEGIN
  IF to_regclass('public.exam_questions') IS NULL
     OR to_regclass('public.question_topics') IS NULL
     OR to_regclass('public.exam_entitlements') IS NULL THEN
    RAISE EXCEPTION
      '20260903 stopped: exam_questions, question_topics and exam_entitlements must already exist.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'exam_questions'
      AND column_name = 'preview_order'
  ) THEN
    RAISE EXCEPTION '20260903 stopped: exam_questions.preview_order already exists.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'exam_questions'
      AND policyname <> 'Allow public read access to exam_questions'
  ) OR EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'question_topics'
      AND policyname <> 'Allow public read access to question_topics'
  ) THEN
    RAISE EXCEPTION '20260903 stopped: the live question policy boundary changed.';
  END IF;
END;
$$;

CREATE TEMP TABLE question_delivery_counts_before ON COMMIT DROP AS
SELECT
  (SELECT COUNT(*) FROM public.exam_questions) AS question_count,
  (SELECT COUNT(*) FROM public.question_topics) AS topic_count;

ALTER TABLE public.exam_questions
  ADD COLUMN preview_order SMALLINT NULL,
  ADD CONSTRAINT exam_questions_preview_order_check
    CHECK (preview_order BETWEEN 1 AND 10);

WITH ranked_questions AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY exam_code
      ORDER BY
        COALESCE(
          NULLIF(regexp_replace(id, '[^0-9]', '', 'g'), '')::BIGINT,
          9223372036854775807
        ),
        id
    ) AS question_position
  FROM public.exam_questions
)
UPDATE public.exam_questions questions
SET preview_order = ranked.question_position::SMALLINT
FROM ranked_questions ranked
WHERE ranked.id = questions.id
  AND ranked.question_position <= 10;

CREATE UNIQUE INDEX idx_exam_questions_exam_preview_order
  ON public.exam_questions (exam_code, preview_order)
  WHERE preview_order IS NOT NULL;

COMMENT ON COLUMN public.exam_questions.preview_order IS
  'Trusted deterministic preview position. Null questions require an active matching entitlement or a trusted learning role.';

ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to exam_questions"
  ON public.exam_questions;
DROP POLICY IF EXISTS "Allow public read access to question_topics"
  ON public.question_topics;

CREATE POLICY "Preview exam questions"
  ON public.exam_questions
  FOR SELECT
  TO anon, authenticated
  USING (
    preview_order BETWEEN 1 AND 10
  );

CREATE POLICY "Entitled exam questions"
  ON public.exam_questions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.exam_entitlements entitlement
      WHERE entitlement.user_id = auth.uid()
        AND entitlement.exam_id = exam_questions.exam_code
        AND entitlement.status = 'active'
        AND entitlement.starts_at <= clock_timestamp()
        AND entitlement.expires_at > clock_timestamp()
    )
  );

CREATE POLICY "Trusted role exam questions"
  ON public.exam_questions
  FOR SELECT
  TO authenticated
  USING (
    (
      lower(COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'admin'
      OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::JSONB) ? 'admin'
    )
    OR (
      (
        lower(COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'author'
        OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::JSONB) ? 'author'
      )
      AND NOT (
        lower(COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'approver'
        OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::JSONB) ? 'approver'
      )
    )
    OR (
      (
        lower(COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'approver'
        OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::JSONB) ? 'approver'
      )
      AND NOT (
        lower(COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'author'
        OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::JSONB) ? 'author'
      )
    )
  );

CREATE POLICY "Topics for visible exam questions"
  ON public.question_topics
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.exam_questions visible_question
      WHERE visible_question.id = question_topics.question_id
    )
  );

REVOKE ALL PRIVILEGES
  ON TABLE public.exam_questions, public.question_topics
  FROM PUBLIC, anon, authenticated;

GRANT SELECT
  ON TABLE public.exam_questions, public.question_topics
  TO anon, authenticated;

DO $$
DECLARE
  counts_before RECORD;
  permission_name TEXT;
BEGIN
  SELECT * INTO counts_before FROM question_delivery_counts_before;

  IF (SELECT COUNT(*) FROM public.exam_questions) <> counts_before.question_count
     OR (SELECT COUNT(*) FROM public.question_topics) <> counts_before.topic_count THEN
    RAISE EXCEPTION '20260903 stopped: question or topic rows changed unexpectedly.';
  END IF;

  IF EXISTS (
    SELECT exam_code
    FROM public.exam_questions
    WHERE preview_order IS NOT NULL
    GROUP BY exam_code
    HAVING COUNT(*) > 10
  ) THEN
    RAISE EXCEPTION '20260903 stopped: an exam received more than ten preview questions.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.exam_questions
    WHERE preview_order IS NOT NULL
      AND preview_order NOT BETWEEN 1 AND 10
  ) THEN
    RAISE EXCEPTION '20260903 stopped: an invalid preview position was created.';
  END IF;

  IF (SELECT COUNT(*) FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'exam_questions'
        AND policyname IN (
          'Preview exam questions',
          'Entitled exam questions',
          'Trusted role exam questions'
        )
        AND cmd = 'SELECT') <> 3
     OR (SELECT COUNT(*) FROM pg_policies
         WHERE schemaname = 'public'
           AND tablename = 'question_topics'
           AND policyname = 'Topics for visible exam questions'
           AND cmd = 'SELECT') <> 1 THEN
    RAISE EXCEPTION '20260903 stopped: protected SELECT policies are incomplete.';
  END IF;

  FOREACH permission_name IN ARRAY ARRAY[
    'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER'
  ]
  LOOP
    IF has_table_privilege('anon', 'public.exam_questions', permission_name)
       OR has_table_privilege('authenticated', 'public.exam_questions', permission_name)
       OR has_table_privilege('anon', 'public.question_topics', permission_name)
       OR has_table_privilege('authenticated', 'public.question_topics', permission_name) THEN
      RAISE EXCEPTION
        '20260903 stopped: a browser role has unexpected % on question content.',
        permission_name;
    END IF;
  END LOOP;
END;
$$;

COMMIT;
