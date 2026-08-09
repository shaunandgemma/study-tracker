-- Step 54 correction: remove the programme_id PL/pgSQL name collision.
-- Publication rules, approved content and learner data remain unchanged.

BEGIN;

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
  runtime_snapshot JSONB;
  summary JSONB;
  target_programme_id TEXT;
  published_time TIMESTAMPTZ := NOW();
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
  IF p_candidate_id IS DISTINCT FROM configuration.pilot_publish_candidate_id
     OR p_candidate_id IS DISTINCT FROM 'release-author-draft-e6dee7a5-5868-423f-bcfe-7c74d92b3ad6-r13-36f6c49225f0' THEN
    RAISE EXCEPTION 'Only the approved Lambda pilot candidate can be published in Step 54.' USING ERRCODE = '42501';
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
    RAISE EXCEPTION 'The approved candidate is not the unpublished Lambda pilot package.' USING ERRCODE = '23514';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.follow_along_published_programmes AS published
    WHERE published.programme_id = 'lambda-learning-path'
       OR published.candidate_id = p_candidate_id
  ) THEN
    RAISE EXCEPTION 'The Lambda pilot candidate already has a publication record.' USING ERRCODE = '23505';
  END IF;

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
    'operation', 'add_one_programme',
    'programmeId', target_programme_id,
    'service', 'AWS Lambda',
    'phaseCount', jsonb_array_length(COALESCE(candidate.snapshot -> 'phases', '[]'::JSONB)),
    'taskCount', jsonb_array_length(COALESCE(candidate.snapshot -> 'tasks', '[]'::JSONB)),
    'sourceRevision', candidate.source_revision,
    'contentHash', candidate.content_hash,
    'approvedTaskInstructionsChanged', FALSE,
    'existingFollowAlongsChanged', FALSE,
    'learnerProgressChanged', FALSE,
    'generatorDependencyAdded', FALSE,
    'handsOnDependencyAdded', FALSE
  );

  INSERT INTO public.follow_along_published_programmes (
    programme_id,
    candidate_id,
    source_revision,
    content_hash,
    runtime_content,
    change_summary,
    publication_status,
    published_by,
    published_at
  ) VALUES (
    target_programme_id,
    candidate.candidate_id,
    candidate.source_revision,
    candidate.content_hash,
    runtime_snapshot,
    summary,
    'published',
    auth.uid(),
    published_time
  );

  RETURN jsonb_build_object(
    'programmeId', target_programme_id,
    'candidateId', candidate.candidate_id,
    'publishedAt', published_time,
    'changeSummary', summary
  );
END;
$$;

REVOKE ALL ON FUNCTION public.publish_follow_along_release_candidate(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.publish_follow_along_release_candidate(TEXT, TEXT) TO authenticated;

COMMIT;
