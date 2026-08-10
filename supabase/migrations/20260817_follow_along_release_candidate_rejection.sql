-- Safe refusal of obsolete or duplicate Follow Along release candidates.
-- Candidate content remains immutable and no approval record is deleted.

BEGIN;

ALTER TABLE public.follow_along_release_candidates
  ADD COLUMN IF NOT EXISTS rejected_by UUID REFERENCES auth.users(id) ON DELETE RESTRICT,
  ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

ALTER TABLE public.follow_along_release_candidates
  DROP CONSTRAINT IF EXISTS follow_along_release_candidate_rejection_shape;

ALTER TABLE public.follow_along_release_candidates
  ADD CONSTRAINT follow_along_release_candidate_rejection_shape CHECK (
    (status <> 'superseded' AND rejected_by IS NULL AND rejected_at IS NULL AND rejection_reason IS NULL)
    OR
    (status = 'superseded' AND (
      (rejected_by IS NULL AND rejected_at IS NULL AND rejection_reason IS NULL)
      OR
      (rejected_by IS NOT NULL AND rejected_at IS NOT NULL AND char_length(btrim(rejection_reason)) BETWEEN 5 AND 500)
    ))
  );

CREATE OR REPLACE FUNCTION public.reject_follow_along_release_candidate(
  p_candidate_id TEXT,
  p_reason TEXT
)
RETURNS public.follow_along_release_candidates
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  candidate public.follow_along_release_candidates%ROWTYPE;
  approval_enabled BOOLEAN := FALSE;
  clean_reason TEXT := btrim(COALESCE(p_reason, ''));
BEGIN
  SELECT trusted_approval_enabled INTO approval_enabled
  FROM public.follow_along_author_configuration
  WHERE singleton = TRUE;

  IF approval_enabled IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'Trusted approval is disabled.' USING ERRCODE = '42501';
  END IF;
  IF auth.uid() IS NULL OR NOT public.follow_along_is_approver() THEN
    RAISE EXCEPTION 'A server-managed admin or approver role is required.' USING ERRCODE = '42501';
  END IF;
  IF char_length(clean_reason) < 5 OR char_length(clean_reason) > 500 THEN
    RAISE EXCEPTION 'Enter a rejection reason between 5 and 500 characters.' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO candidate
  FROM public.follow_along_release_candidates
  WHERE candidate_id = p_candidate_id
  FOR UPDATE;

  IF NOT FOUND OR candidate.status <> 'awaiting_trusted_approval' OR candidate.approval_decision <> 'pending' THEN
    RAISE EXCEPTION 'Release candidate is not awaiting a decision.' USING ERRCODE = '23514';
  END IF;
  IF candidate.created_by = auth.uid() THEN
    RAISE EXCEPTION 'The draft author cannot reject their own release candidate.' USING ERRCODE = '42501';
  END IF;

  UPDATE public.follow_along_release_candidates
  SET status = 'superseded',
      rejected_by = auth.uid(),
      rejected_at = NOW(),
      rejection_reason = clean_reason
  WHERE candidate_id = p_candidate_id
  RETURNING * INTO candidate;

  RETURN candidate;
END;
$$;

CREATE OR REPLACE FUNCTION public.protect_follow_along_release_candidate()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  current_draft public.follow_along_author_drafts%ROWTYPE;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'awaiting_trusted_approval'
       AND OLD.approval_decision = 'pending'
       AND NEW.status = 'approved_release_candidate'
       AND NEW.approval_decision = 'approved'
       AND NEW.approved_by = auth.uid()
       AND NEW.rejected_by IS NULL
       AND NEW.rejected_at IS NULL
       AND NEW.rejection_reason IS NULL
       AND public.follow_along_is_approver()
       AND NEW.created_by <> auth.uid()
       AND NEW.candidate_id = OLD.candidate_id
       AND NEW.draft_id = OLD.draft_id
       AND NEW.source_revision = OLD.source_revision
       AND NEW.created_by = OLD.created_by
       AND NEW.snapshot = OLD.snapshot
       AND NEW.content_hash = OLD.content_hash
       AND NEW.draft_content_hash = OLD.draft_content_hash
       AND NEW.created_at = OLD.created_at THEN
      RETURN NEW;
    END IF;

    IF OLD.status = 'awaiting_trusted_approval'
       AND OLD.approval_decision = 'pending'
       AND NEW.status = 'superseded'
       AND NEW.approval_decision = 'pending'
       AND NEW.approved_by IS NULL
       AND NEW.approved_at IS NULL
       AND NEW.rejected_by = auth.uid()
       AND NEW.rejected_at IS NOT NULL
       AND char_length(btrim(NEW.rejection_reason)) BETWEEN 5 AND 500
       AND public.follow_along_is_approver()
       AND NEW.created_by <> auth.uid()
       AND NEW.candidate_id = OLD.candidate_id
       AND NEW.draft_id = OLD.draft_id
       AND NEW.source_revision = OLD.source_revision
       AND NEW.created_by = OLD.created_by
       AND NEW.snapshot = OLD.snapshot
       AND NEW.content_hash = OLD.content_hash
       AND NEW.draft_content_hash = OLD.draft_content_hash
       AND NEW.created_at = OLD.created_at THEN
      RETURN NEW;
    END IF;

    RAISE EXCEPTION 'Release candidates are immutable outside trusted approval or rejection.' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO current_draft
  FROM public.follow_along_author_drafts
  WHERE draft_id = NEW.draft_id;

  IF NOT FOUND
     OR current_draft.owner_id IS DISTINCT FROM auth.uid()
     OR NEW.created_by IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Only the draft owner can prepare a release candidate.' USING ERRCODE = '42501';
  END IF;
  IF current_draft.status <> 'ready_for_approval' OR NEW.source_revision <> current_draft.revision THEN
    RAISE EXCEPTION 'Release candidate revision is not Ready for Approval.' USING ERRCODE = '23514';
  END IF;
  IF NEW.draft_content_hash <> current_draft.content_hash THEN
    RAISE EXCEPTION 'Release candidate does not match the current draft content.' USING ERRCODE = '23514';
  END IF;
  IF NEW.snapshot #>> '{programme,publicationVisibility}' IS DISTINCT FROM 'unpublished'
     OR NEW.snapshot #>> '{publication,publishStatus}' IS DISTINCT FROM 'not_published' THEN
    RAISE EXCEPTION 'Release candidates must remain unpublished.' USING ERRCODE = '23514';
  END IF;

  NEW.status := 'awaiting_trusted_approval';
  NEW.approval_decision := 'pending';
  NEW.approved_by := NULL;
  NEW.approved_at := NULL;
  NEW.rejected_by := NULL;
  NEW.rejected_at := NULL;
  NEW.rejection_reason := NULL;
  NEW.content_hash := public.follow_along_jsonb_sha256(NEW.snapshot);
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.reject_follow_along_release_candidate(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reject_follow_along_release_candidate(TEXT, TEXT) TO authenticated;

COMMENT ON FUNCTION public.reject_follow_along_release_candidate(TEXT, TEXT)
  IS 'Approver-only refusal that preserves the immutable candidate and records its reason.';

COMMIT;
