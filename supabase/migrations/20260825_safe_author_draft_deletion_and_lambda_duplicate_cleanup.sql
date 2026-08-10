-- Step 162: narrowly remove the verified accidental Lambda revision-one draft
-- and add owner-controlled deletion for future unused, non-live drafts.

BEGIN;

CREATE TABLE IF NOT EXISTS public.follow_along_author_draft_deletions (
  deletion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id TEXT NOT NULL,
  programme_id TEXT NOT NULL,
  deleted_revision INTEGER NOT NULL CHECK (deleted_revision > 0),
  deleted_content_hash TEXT NOT NULL,
  deleted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  deleted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reason TEXT NOT NULL
);

ALTER TABLE public.follow_along_author_draft_deletions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.follow_along_author_draft_deletions FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.delete_unpublished_follow_along_author_draft(
  p_draft_id TEXT,
  p_expected_revision INTEGER,
  p_confirmation TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  target public.follow_along_author_drafts%ROWTYPE;
  deleted_revision_rows INTEGER := 0;
BEGIN
  IF auth.uid() IS NULL OR NOT public.follow_along_is_author() THEN
    RAISE EXCEPTION 'A signed-in Author is required.' USING ERRCODE = '42501';
  END IF;

  IF p_confirmation IS DISTINCT FROM 'DELETE ' || p_draft_id THEN
    RAISE EXCEPTION 'Exact draft deletion confirmation is required.' USING ERRCODE = '23514';
  END IF;

  SELECT * INTO target
  FROM public.follow_along_author_drafts
  WHERE draft_id = p_draft_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'The Shared Draft could not be found.' USING ERRCODE = 'P0002';
  END IF;
  IF target.owner_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Only the draft owner can delete this Shared Draft.' USING ERRCODE = '42501';
  END IF;
  IF target.revision IS DISTINCT FROM p_expected_revision THEN
    RAISE EXCEPTION 'The Shared Draft revision changed. Review it again before deleting.' USING ERRCODE = '40001';
  END IF;
  IF EXISTS (SELECT 1 FROM public.follow_along_release_candidates WHERE draft_id = target.draft_id) THEN
    RAISE EXCEPTION 'A Shared Draft with release-candidate history cannot be deleted.' USING ERRCODE = '23514';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.follow_along_published_programmes
    WHERE candidate_id LIKE 'release-' || target.draft_id || '-r%'
  ) THEN
    RAISE EXCEPTION 'A live production Shared Draft cannot be deleted.' USING ERRCODE = '23514';
  END IF;

  INSERT INTO public.follow_along_author_draft_deletions (
    draft_id, programme_id, deleted_revision, deleted_content_hash, deleted_by, reason
  ) VALUES (
    target.draft_id, target.programme_id, target.revision, target.content_hash, auth.uid(), 'Author confirmed unwanted or duplicate draft'
  );

  DELETE FROM public.follow_along_author_revisions WHERE draft_id = target.draft_id;
  GET DIAGNOSTICS deleted_revision_rows = ROW_COUNT;
  DELETE FROM public.follow_along_author_drafts WHERE draft_id = target.draft_id;

  RETURN jsonb_build_object(
    'deletedDraftId', target.draft_id,
    'deletedProgrammeId', target.programme_id,
    'deletedRevision', target.revision,
    'deletedRevisionRows', deleted_revision_rows,
    'liveDraftDeleted', FALSE,
    'candidateDeleted', FALSE
  );
END;
$$;

REVOKE ALL ON FUNCTION public.delete_unpublished_follow_along_author_draft(TEXT, INTEGER, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_unpublished_follow_along_author_draft(TEXT, INTEGER, TEXT) TO authenticated;

COMMENT ON FUNCTION public.delete_unpublished_follow_along_author_draft(TEXT, INTEGER, TEXT)
IS 'Deletes exactly one owned unused Author draft after revision and exact-confirmation checks; live or candidate-bearing drafts are protected.';

DO $$
DECLARE
  accidental_id CONSTANT TEXT := 'author-draft-import-0d8165e5eee4eb9b108f34b46bef58346da44792d495b635e241896f3c9fdb28';
  original_id CONSTANT TEXT := 'author-draft-e6dee7a5-5868-423f-bcfe-7c74d92b3ad6';
  accidental public.follow_along_author_drafts%ROWTYPE;
  original public.follow_along_author_drafts%ROWTYPE;
BEGIN
  SELECT * INTO original FROM public.follow_along_author_drafts WHERE draft_id = original_id FOR SHARE;
  IF NOT FOUND OR original.programme_id <> 'lambda-learning-path' OR original.revision < 87 THEN
    RAISE EXCEPTION 'Step 162 stopped: the original Lambda revision-87-or-newer draft was not verified.';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.follow_along_published_programmes
    WHERE programme_id = 'lambda-learning-path'
      AND candidate_id = 'release-author-draft-e6dee7a5-5868-423f-bcfe-7c74d92b3ad6-r84-f22215ad2662'
      AND source_revision = 84
  ) THEN
    RAISE EXCEPTION 'Step 162 stopped: the published Lambda revision-84 baseline was not verified.';
  END IF;

  SELECT * INTO accidental FROM public.follow_along_author_drafts WHERE draft_id = accidental_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN;
  END IF;
  IF accidental.programme_id <> 'lambda-learning-path'
     OR accidental.revision <> 1
     OR accidental.content #>> '{draft,importedFrom,handoffFingerprint}' <> '0d8165e5eee4eb9b108f34b46bef58346da44792d495b635e241896f3c9fdb28'
     OR accidental.owner_id <> original.owner_id THEN
    RAISE EXCEPTION 'Step 162 stopped: the accidental Lambda draft identity or ownership did not match.';
  END IF;
  IF EXISTS (SELECT 1 FROM public.follow_along_release_candidates WHERE draft_id = accidental_id) THEN
    RAISE EXCEPTION 'Step 162 stopped: the accidental Lambda draft has release-candidate history.';
  END IF;
  IF EXISTS (SELECT 1 FROM public.follow_along_published_programmes WHERE candidate_id LIKE 'release-' || accidental_id || '-r%') THEN
    RAISE EXCEPTION 'Step 162 stopped: the accidental Lambda draft is live.';
  END IF;

  INSERT INTO public.follow_along_author_draft_deletions (
    draft_id, programme_id, deleted_revision, deleted_content_hash, deleted_by, reason
  ) VALUES (
    accidental.draft_id, accidental.programme_id, accidental.revision,
    accidental.content_hash, accidental.owner_id, 'Step 162 verified accidental Lambda update import'
  );
  DELETE FROM public.follow_along_author_revisions WHERE draft_id = accidental_id;
  DELETE FROM public.follow_along_author_drafts WHERE draft_id = accidental_id;
END;
$$;

COMMIT;
