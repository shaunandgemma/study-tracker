-- LATT Step 007E8: retire broad learner reads from the authoritative
-- Follow Along publication table after protected-delivery parity passed.
--
-- This migration changes privileges and one SELECT policy only. It preserves
-- every publication, protected learner row, draft, revision, candidate,
-- approval, progress row, trigger and controlled-publishing function.

BEGIN;

LOCK TABLE public.follow_along_published_programmes IN SHARE MODE;
LOCK TABLE public.learner_content_items IN SHARE MODE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_class table_record
    JOIN pg_namespace table_schema ON table_schema.oid = table_record.relnamespace
    WHERE table_schema.nspname = 'public'
      AND table_record.relname = 'follow_along_published_programmes'
      AND table_record.relrowsecurity
  ) THEN
    RAISE EXCEPTION '20260907 stopped: authoritative Follow Along RLS is not enabled.';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_class table_record
    JOIN pg_namespace table_schema ON table_schema.oid = table_record.relnamespace
    WHERE table_schema.nspname = 'public'
      AND table_record.relname = 'learner_content_items'
      AND table_record.relrowsecurity
  ) THEN
    RAISE EXCEPTION '20260907 stopped: protected learner-content RLS is not enabled.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.follow_along_published_programmes published
    LEFT JOIN public.learner_content_items protected
      ON protected.content_id = 'follow-along:' || published.programme_id
     AND protected.content_type = 'follow_along'
    WHERE published.publication_status = 'published'
      AND (
        protected.content_id IS NULL
        OR protected.publication_status IS DISTINCT FROM 'published'
        OR protected.content_version IS DISTINCT FROM published.source_revision
        OR protected.content_hash IS DISTINCT FROM
          public.follow_along_jsonb_sha256(published.runtime_content)
        OR protected.payload IS DISTINCT FROM published.runtime_content
      )
  ) THEN
    RAISE EXCEPTION '20260907 stopped: protected Follow Along parity is incomplete.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.learner_content_items protected
    LEFT JOIN public.follow_along_published_programmes published
      ON protected.content_id = 'follow-along:' || published.programme_id
     AND published.publication_status = 'published'
    WHERE protected.content_type = 'follow_along'
      AND protected.publication_status = 'published'
      AND published.programme_id IS NULL
  ) THEN
    RAISE EXCEPTION '20260907 stopped: protected Follow Along source parity is incomplete.';
  END IF;
END;
$$;

DROP POLICY IF EXISTS "Learners read active published Follow Alongs"
  ON public.follow_along_published_programmes;
DROP POLICY IF EXISTS "Trusted staff read published Follow Along metadata"
  ON public.follow_along_published_programmes;

REVOKE ALL PRIVILEGES ON TABLE public.follow_along_published_programmes
  FROM PUBLIC, anon, authenticated;
REVOKE SELECT (
  programme_id,
  candidate_id,
  source_revision,
  content_hash,
  runtime_content,
  change_summary,
  publication_status,
  published_by,
  published_at,
  withdrawn_at
) ON public.follow_along_published_programmes
  FROM PUBLIC, anon, authenticated;

GRANT SELECT (
  programme_id,
  candidate_id,
  source_revision,
  publication_status,
  published_at,
  withdrawn_at
) ON public.follow_along_published_programmes
  TO authenticated;

CREATE POLICY "Trusted staff read published Follow Along metadata"
  ON public.follow_along_published_programmes
  FOR SELECT
  TO authenticated
  USING (
    public.follow_along_is_author()
    OR public.follow_along_is_approver()
  );

DO $$
BEGIN
  IF has_column_privilege('anon', 'public.follow_along_published_programmes', 'runtime_content', 'SELECT')
     OR has_column_privilege('authenticated', 'public.follow_along_published_programmes', 'runtime_content', 'SELECT') THEN
    RAISE EXCEPTION '20260907 stopped: legacy runtime_content remains browser-readable.';
  END IF;

  IF has_column_privilege('anon', 'public.follow_along_published_programmes', 'programme_id', 'SELECT') THEN
    RAISE EXCEPTION '20260907 stopped: anonymous legacy publication access remains.';
  END IF;

  IF NOT has_column_privilege('authenticated', 'public.follow_along_published_programmes', 'programme_id', 'SELECT')
     OR NOT has_column_privilege('authenticated', 'public.follow_along_published_programmes', 'candidate_id', 'SELECT')
     OR NOT has_column_privilege('authenticated', 'public.follow_along_published_programmes', 'source_revision', 'SELECT')
     OR NOT has_column_privilege('authenticated', 'public.follow_along_published_programmes', 'published_at', 'SELECT') THEN
    RAISE EXCEPTION '20260907 stopped: required staff publication metadata is unavailable.';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'follow_along_published_programmes'
      AND policyname = 'Trusted staff read published Follow Along metadata'
      AND cmd = 'SELECT'
      AND roles = ARRAY['authenticated']::NAME[]
  ) THEN
    RAISE EXCEPTION '20260907 stopped: trusted staff metadata policy is incomplete.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'follow_along_published_programmes'
      AND policyname = 'Learners read active published Follow Alongs'
  ) THEN
    RAISE EXCEPTION '20260907 stopped: legacy learner policy remains active.';
  END IF;
END;
$$;

COMMENT ON POLICY "Trusted staff read published Follow Along metadata"
  ON public.follow_along_published_programmes IS
  'Allows only unconflicted Author, unconflicted Approver or Admin identities to read non-payload publication history metadata.';

COMMIT;
