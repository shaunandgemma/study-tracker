-- Document 004, Step 004A: private account progress storage.
--
-- Scope:
-- - Create only public.learner_item_progress.
-- - Bind every row to auth.uid() at the database boundary.
-- - Permit authenticated learners to read and change only their own progress.
-- - Give anonymous browser sessions no access.
-- - Create no entitlement, payment, signup or protected-content behaviour.

BEGIN;

DO $$
BEGIN
  IF to_regclass('public.learner_item_progress') IS NOT NULL THEN
    RAISE EXCEPTION
      '20260901 stopped: public.learner_item_progress already exists.';
  END IF;
END;
$$;

CREATE TABLE public.learner_item_progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  exam_id TEXT NOT NULL,
  progress_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  progress_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  progress_version SMALLINT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

  CONSTRAINT learner_item_progress_pkey
    PRIMARY KEY (user_id, exam_id, progress_type, content_id),

  CONSTRAINT learner_item_progress_exam_id_check
    CHECK (exam_id IN (
      'aws-saa-c03',
      'terraform-associate-004',
      'comptia-sec-plus'
    )),

  CONSTRAINT learner_item_progress_type_check
    CHECK (progress_type IN (
      'study_item',
      'question_flag',
      'troubleshooting_challenge',
      'workspace_state'
    )),

  CONSTRAINT learner_item_progress_content_id_check
    CHECK (
      content_id = btrim(content_id)
      AND char_length(content_id) BETWEEN 1 AND 200
    ),

  CONSTRAINT learner_item_progress_version_check
    CHECK (progress_version BETWEEN 1 AND 32767),

  CONSTRAINT learner_item_progress_data_object_check
    CHECK (jsonb_typeof(progress_data) = 'object'),

  CONSTRAINT learner_item_progress_data_size_check
    CHECK (octet_length(progress_data::text) <= 65536),

  CONSTRAINT learner_item_progress_allowed_keys_check
    CHECK (
      (progress_type = 'study_item'
        AND progress_data - ARRAY[
          'completed',
          'guide_opened',
          'last_section'
        ]::text[] = '{}'::jsonb)
      OR
      (progress_type = 'question_flag'
        AND progress_data - ARRAY['flagged']::text[] = '{}'::jsonb)
      OR
      (progress_type = 'troubleshooting_challenge'
        AND progress_data - ARRAY[
          'observations',
          'hypothesis',
          'actions',
          'pinned_evidence_ids',
          'revealed_hints',
          'answers',
          'completed',
          'solution_revealed',
          'score'
        ]::text[] = '{}'::jsonb)
      OR
      (progress_type = 'workspace_state'
        AND progress_data - ARRAY[
          'last_view',
          'last_knowledge_item_id',
          'last_troubleshooting_challenge_id'
        ]::text[] = '{}'::jsonb)
    ),

  CONSTRAINT learner_item_progress_value_types_check
    CHECK (
      (NOT (progress_data ? 'completed')
        OR jsonb_typeof(progress_data -> 'completed') = 'boolean')
      AND
      (NOT (progress_data ? 'guide_opened')
        OR jsonb_typeof(progress_data -> 'guide_opened') = 'boolean')
      AND
      (NOT (progress_data ? 'flagged')
        OR jsonb_typeof(progress_data -> 'flagged') = 'boolean')
      AND
      (NOT (progress_data ? 'solution_revealed')
        OR jsonb_typeof(progress_data -> 'solution_revealed') = 'boolean')
      AND
      (NOT (progress_data ? 'pinned_evidence_ids')
        OR jsonb_typeof(progress_data -> 'pinned_evidence_ids') = 'array')
      AND
      (NOT (progress_data ? 'answers')
        OR jsonb_typeof(progress_data -> 'answers') = 'object')
      AND
      (NOT (progress_data ? 'revealed_hints')
        OR jsonb_typeof(progress_data -> 'revealed_hints') = 'number')
      AND
      (NOT (progress_data ? 'score')
        OR progress_data -> 'score' = 'null'::jsonb
        OR jsonb_typeof(progress_data -> 'score') = 'number')
      AND
      (NOT (progress_data ? 'last_section')
        OR jsonb_typeof(progress_data -> 'last_section') = 'string')
      AND
      (NOT (progress_data ? 'last_view')
        OR jsonb_typeof(progress_data -> 'last_view') = 'string')
      AND
      (NOT (progress_data ? 'last_knowledge_item_id')
        OR jsonb_typeof(progress_data -> 'last_knowledge_item_id') = 'string')
      AND
      (NOT (progress_data ? 'last_troubleshooting_challenge_id')
        OR jsonb_typeof(progress_data -> 'last_troubleshooting_challenge_id') = 'string')
      AND
      (NOT (progress_data ? 'observations')
        OR jsonb_typeof(progress_data -> 'observations') = 'string')
      AND
      (NOT (progress_data ? 'hypothesis')
        OR jsonb_typeof(progress_data -> 'hypothesis') = 'string')
      AND
      (NOT (progress_data ? 'actions')
        OR jsonb_typeof(progress_data -> 'actions') = 'string')
    )
);

COMMENT ON TABLE public.learner_item_progress IS
  'Private per-item learning progress for authenticated learners. Follow Along progress remains in its dedicated tables.';

COMMENT ON COLUMN public.learner_item_progress.user_id IS
  'Trusted owner assigned from auth.uid() by the database trigger.';

COMMENT ON COLUMN public.learner_item_progress.progress_data IS
  'Small progress values only. Never store credentials, payment data or protected learning content.';

CREATE INDEX idx_learner_item_progress_owner_exam_updated
  ON public.learner_item_progress (user_id, exam_id, updated_at DESC);

CREATE OR REPLACE FUNCTION public.enforce_learner_item_progress_boundary()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog
AS $$
DECLARE
  requester_id UUID := auth.uid();
  trusted_now TIMESTAMPTZ := clock_timestamp();
BEGIN
  IF requester_id IS NULL THEN
    RAISE EXCEPTION 'Authenticated learner required to save progress.'
      USING ERRCODE = '42501';
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.user_id IS NOT NULL AND NEW.user_id IS DISTINCT FROM requester_id THEN
      RAISE EXCEPTION 'Progress cannot be created for another learner.'
        USING ERRCODE = '42501';
    END IF;

    NEW.user_id := requester_id;
    NEW.created_at := trusted_now;
    NEW.updated_at := trusted_now;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.user_id IS DISTINCT FROM requester_id THEN
      RAISE EXCEPTION 'Progress cannot be changed for another learner.'
        USING ERRCODE = '42501';
    END IF;

    IF ROW(
      NEW.user_id,
      NEW.exam_id,
      NEW.progress_type,
      NEW.content_id
    ) IS DISTINCT FROM ROW(
      OLD.user_id,
      OLD.exam_id,
      OLD.progress_type,
      OLD.content_id
    ) THEN
      RAISE EXCEPTION 'Progress ownership and content identity are immutable.'
        USING ERRCODE = '42501';
    END IF;

    NEW.created_at := OLD.created_at;
    NEW.updated_at := trusted_now;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL PRIVILEGES
  ON FUNCTION public.enforce_learner_item_progress_boundary()
  FROM PUBLIC, anon, authenticated;

CREATE TRIGGER trigger_enforce_learner_item_progress_boundary
  BEFORE INSERT OR UPDATE ON public.learner_item_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_learner_item_progress_boundary();

ALTER TABLE public.learner_item_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Learners read own item progress"
  ON public.learner_item_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Learners insert own item progress"
  ON public.learner_item_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Learners update own item progress"
  ON public.learner_item_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

REVOKE ALL PRIVILEGES
  ON TABLE public.learner_item_progress
  FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE
  ON TABLE public.learner_item_progress
  TO authenticated;

DO $$
DECLARE
  policy_count INTEGER;
  permission_name TEXT;
  rls_enabled BOOLEAN;
BEGIN
  IF (SELECT COUNT(*) FROM public.learner_item_progress) <> 0 THEN
    RAISE EXCEPTION '20260901 stopped: learner_item_progress was not created empty.';
  END IF;

  SELECT relrowsecurity INTO rls_enabled
  FROM pg_class
  WHERE oid = 'public.learner_item_progress'::regclass;

  IF rls_enabled IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION '20260901 stopped: row level security is not enabled.';
  END IF;

  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'learner_item_progress'
    AND policyname IN (
      'Learners read own item progress',
      'Learners insert own item progress',
      'Learners update own item progress'
    );

  IF policy_count <> 3 THEN
    RAISE EXCEPTION '20260901 stopped: private learner policies are incomplete.';
  END IF;

  FOREACH permission_name IN ARRAY ARRAY[
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER'
  ]
  LOOP
    IF has_table_privilege('anon', 'public.learner_item_progress', permission_name) THEN
      RAISE EXCEPTION
        '20260901 stopped: anon has unexpected % on learner_item_progress.',
        permission_name;
    END IF;
  END LOOP;

  FOREACH permission_name IN ARRAY ARRAY['SELECT', 'INSERT', 'UPDATE']
  LOOP
    IF NOT has_table_privilege(
      'authenticated',
      'public.learner_item_progress',
      permission_name
    ) THEN
      RAISE EXCEPTION
        '20260901 stopped: authenticated is missing % on learner_item_progress.',
        permission_name;
    END IF;
  END LOOP;

  FOREACH permission_name IN ARRAY ARRAY[
    'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER'
  ]
  LOOP
    IF has_table_privilege(
      'authenticated',
      'public.learner_item_progress',
      permission_name
    ) THEN
      RAISE EXCEPTION
        '20260901 stopped: authenticated has unnecessary % on learner_item_progress.',
        permission_name;
    END IF;
  END LOOP;
END;
$$;

COMMIT;
