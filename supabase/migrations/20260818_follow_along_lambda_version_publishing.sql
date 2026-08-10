-- Controlled publishing for newer approved Lambda revisions.
-- Replaces only the Lambda learner package and preserves publication history.

BEGIN;

CREATE TABLE IF NOT EXISTS public.follow_along_publication_history (
  candidate_id TEXT PRIMARY KEY REFERENCES public.follow_along_release_candidates(candidate_id) ON DELETE RESTRICT,
  programme_id TEXT NOT NULL,
  source_revision INTEGER NOT NULL CHECK (source_revision > 0),
  content_hash TEXT NOT NULL,
  change_summary JSONB NOT NULL,
  published_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  published_at TIMESTAMPTZ NOT NULL
);

ALTER TABLE public.follow_along_publication_history ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.follow_along_publication_history FROM PUBLIC, anon, authenticated;

INSERT INTO public.follow_along_publication_history (
  candidate_id, programme_id, source_revision, content_hash, change_summary, published_by, published_at
)
SELECT candidate_id, programme_id, source_revision, content_hash, change_summary, published_by, published_at
FROM public.follow_along_published_programmes
ON CONFLICT (candidate_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.publish_follow_along_release_candidate(
  p_candidate_id TEXT,
  p_confirmation TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  candidate public.follow_along_release_candidates%ROWTYPE;
  current_draft public.follow_along_author_drafts%ROWTYPE;
  configuration public.follow_along_author_configuration%ROWTYPE;
  current_publication public.follow_along_published_programmes%ROWTYPE;
  runtime_snapshot JSONB;
  summary JSONB;
  target_programme_id TEXT;
  published_time TIMESTAMPTZ := NOW();
  operation_name TEXT;
BEGIN
  SELECT * INTO configuration
  FROM public.follow_along_author_configuration
  WHERE singleton = TRUE
  FOR SHARE;

  IF configuration.controlled_publishing_enabled IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'Controlled publishing is disabled.' USING ERRCODE = '42501';
  END IF;
  IF auth.uid() IS NULL OR NOT public.follow_along_is_approver() THEN
    RAISE EXCEPTION 'A server-managed admin or approver role is required.' USING ERRCODE = '42501';
  END IF;
  IF p_confirmation IS DISTINCT FROM 'PUBLISH LAMBDA' THEN
    RAISE EXCEPTION 'Enter PUBLISH LAMBDA exactly before publishing.' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO candidate
  FROM public.follow_along_release_candidates
  WHERE candidate_id = p_candidate_id
  FOR UPDATE;

  IF NOT FOUND
     OR candidate.status <> 'approved_release_candidate'
     OR candidate.approval_decision <> 'approved'
     OR candidate.approved_by IS NULL
     OR candidate.approved_at IS NULL THEN
    RAISE EXCEPTION 'The Lambda release candidate is not approved.' USING ERRCODE = '23514';
  END IF;
  IF candidate.created_by = auth.uid() THEN
    RAISE EXCEPTION 'The draft author cannot publish their own release candidate.' USING ERRCODE = '42501';
  END IF;
  IF public.follow_along_jsonb_sha256(candidate.snapshot) <> candidate.content_hash THEN
    RAISE EXCEPTION 'Release candidate fingerprint does not match.' USING ERRCODE = '23514';
  END IF;

  SELECT * INTO current_draft
  FROM public.follow_along_author_drafts
  WHERE draft_id = candidate.draft_id
  FOR SHARE;

  IF NOT FOUND
     OR current_draft.status <> 'ready_for_approval'
     OR current_draft.revision <> candidate.source_revision
     OR current_draft.content_hash <> candidate.draft_content_hash THEN
    RAISE EXCEPTION 'Draft changed after release candidate approval.' USING ERRCODE = '40001';
  END IF;

  target_programme_id := candidate.snapshot #>> '{programme,programmeId}';
  IF target_programme_id IS DISTINCT FROM configuration.pilot_publish_programme_id
     OR target_programme_id IS DISTINCT FROM 'lambda-learning-path'
     OR candidate.snapshot #>> '{programme,pathId}' IS DISTINCT FROM 'lambda-learning-path'
     OR candidate.snapshot #>> '{programme,serviceSlug}' IS DISTINCT FROM 'lambda'
     OR candidate.snapshot #>> '{programme,publicationVisibility}' IS DISTINCT FROM 'unpublished'
     OR candidate.snapshot #>> '{publication,publishStatus}' IS DISTINCT FROM 'not_published' THEN
    RAISE EXCEPTION 'The approved candidate is not an unpublished Lambda package.' USING ERRCODE = '23514';
  END IF;

  SELECT * INTO current_publication
  FROM public.follow_along_published_programmes AS published
  WHERE published.programme_id = target_programme_id
  FOR UPDATE;

  IF FOUND AND current_publication.candidate_id = candidate.candidate_id THEN
    RETURN jsonb_build_object(
      'programmeId', target_programme_id,
      'candidateId', candidate.candidate_id,
      'publishedAt', current_publication.published_at,
      'alreadyPublished', TRUE,
      'changeSummary', current_publication.change_summary
    );
  END IF;

  IF FOUND AND candidate.source_revision <= current_publication.source_revision THEN
    RAISE EXCEPTION 'A newer or equal Lambda revision is already published.' USING ERRCODE = '23514';
  END IF;

  operation_name := CASE WHEN current_publication.programme_id IS NULL THEN 'add_programme' ELSE 'update_programme' END;
  runtime_snapshot := candidate.snapshot - ARRAY['author', 'draft', 'review', 'sources']::TEXT[];
  runtime_snapshot := jsonb_set(runtime_snapshot, '{programme,publicationVisibility}', '"published"'::JSONB, FALSE);
  runtime_snapshot := jsonb_set(
    runtime_snapshot,
    '{publication}',
    jsonb_build_object(
      'publishStatus', 'published',
      'publishedAt', published_time,
      'sourceRevision', candidate.source_revision,
      'approvedContentHash', candidate.content_hash
    ),
    TRUE
  );

  summary := jsonb_build_object(
    'operation', operation_name,
    'programmeId', target_programme_id,
    'service', 'AWS Lambda',
    'previousRevision', current_publication.source_revision,
    'sourceRevision', candidate.source_revision,
    'phaseCount', jsonb_array_length(COALESCE(candidate.snapshot -> 'phases', '[]'::JSONB)),
    'taskCount', jsonb_array_length(COALESCE(candidate.snapshot -> 'tasks', '[]'::JSONB)),
    'contentHash', candidate.content_hash,
    'learnerProgressChanged', FALSE,
    'generatorDependencyAdded', FALSE,
    'handsOnDependencyAdded', FALSE
  );

  IF current_publication.programme_id IS NULL THEN
    INSERT INTO public.follow_along_published_programmes (
      programme_id, candidate_id, source_revision, content_hash, runtime_content,
      change_summary, publication_status, published_by, published_at
    ) VALUES (
      target_programme_id, candidate.candidate_id, candidate.source_revision,
      candidate.content_hash, runtime_snapshot, summary, 'published', auth.uid(), published_time
    );
  ELSE
    INSERT INTO public.follow_along_publication_history (
      candidate_id, programme_id, source_revision, content_hash, change_summary, published_by, published_at
    ) VALUES (
      current_publication.candidate_id, current_publication.programme_id,
      current_publication.source_revision, current_publication.content_hash,
      current_publication.change_summary, current_publication.published_by,
      current_publication.published_at
    ) ON CONFLICT (candidate_id) DO NOTHING;

    UPDATE public.follow_along_published_programmes
    SET candidate_id = candidate.candidate_id,
        source_revision = candidate.source_revision,
        content_hash = candidate.content_hash,
        runtime_content = runtime_snapshot,
        change_summary = summary,
        publication_status = 'published',
        published_by = auth.uid(),
        published_at = published_time,
        withdrawn_at = NULL
    WHERE programme_id = target_programme_id;
  END IF;

  INSERT INTO public.follow_along_publication_history (
    candidate_id, programme_id, source_revision, content_hash, change_summary, published_by, published_at
  ) VALUES (
    candidate.candidate_id, target_programme_id, candidate.source_revision,
    candidate.content_hash, summary, auth.uid(), published_time
  ) ON CONFLICT (candidate_id) DO NOTHING;

  RETURN jsonb_build_object(
    'programmeId', target_programme_id,
    'candidateId', candidate.candidate_id,
    'publishedAt', published_time,
    'alreadyPublished', FALSE,
    'changeSummary', summary
  );
END;
$$;

REVOKE ALL ON FUNCTION public.publish_follow_along_release_candidate(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.publish_follow_along_release_candidate(TEXT, TEXT) TO authenticated;

COMMENT ON TABLE public.follow_along_published_programmes
  IS 'Current sanitized learner Follow Along package for each published programme.';
COMMENT ON TABLE public.follow_along_publication_history
  IS 'Append-only audit of controlled Follow Along publication versions.';

COMMIT;
