-- Prevent concurrent trusted-approval requests for the same immutable candidate.
-- A duplicate request fails immediately instead of waiting on a row lock and
-- consuming another PostgREST database connection.

BEGIN;

CREATE OR REPLACE FUNCTION public.approve_follow_along_release_candidate(p_candidate_id TEXT)
RETURNS public.follow_along_release_candidates
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  candidate public.follow_along_release_candidates%ROWTYPE;
  current_draft public.follow_along_author_drafts%ROWTYPE;
  approval_enabled BOOLEAN := FALSE;
BEGIN
  IF NOT pg_try_advisory_xact_lock(hashtextextended(p_candidate_id, 0)) THEN
    RAISE EXCEPTION 'Approval is already in progress for this release candidate.'
      USING ERRCODE = '55P03';
  END IF;

  SELECT trusted_approval_enabled INTO approval_enabled
  FROM public.follow_along_author_configuration
  WHERE singleton = TRUE;

  IF approval_enabled IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'Trusted approval is disabled until server validation is deployed.' USING ERRCODE = '42501';
  END IF;

  IF auth.uid() IS NULL OR NOT public.follow_along_is_approver() THEN
    RAISE EXCEPTION 'A server-managed admin or approver role is required.' USING ERRCODE = '42501';
  END IF;

  BEGIN
    SELECT * INTO candidate
    FROM public.follow_along_release_candidates
    WHERE candidate_id = p_candidate_id
    FOR UPDATE NOWAIT;
  EXCEPTION
    WHEN lock_not_available THEN
      RAISE EXCEPTION 'Approval is already in progress for this release candidate.'
        USING ERRCODE = '55P03';
  END;

  IF NOT FOUND OR candidate.status <> 'awaiting_trusted_approval' OR candidate.approval_decision <> 'pending' THEN
    RAISE EXCEPTION 'Release candidate is not awaiting approval.' USING ERRCODE = '23514';
  END IF;
  IF candidate.created_by = auth.uid() THEN
    RAISE EXCEPTION 'The draft author cannot approve their own release candidate.' USING ERRCODE = '42501';
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
    RAISE EXCEPTION 'Draft changed after release candidate preparation.' USING ERRCODE = '40001';
  END IF;

  UPDATE public.follow_along_release_candidates
  SET status = 'approved_release_candidate',
      approval_decision = 'approved',
      approved_by = auth.uid(),
      approved_at = NOW()
  WHERE candidate_id = p_candidate_id
  RETURNING * INTO candidate;

  RETURN candidate;
END;
$$;

REVOKE ALL ON FUNCTION public.approve_follow_along_release_candidate(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.approve_follow_along_release_candidate(TEXT) TO authenticated;

COMMENT ON FUNCTION public.approve_follow_along_release_candidate(TEXT)
IS 'Approves one immutable candidate and rejects concurrent duplicate approval requests immediately.';

COMMIT;
