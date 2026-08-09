-- Step 54 non-destructive rollback.
-- Hides the pilot and disables further publication without removing history.

BEGIN;

UPDATE public.follow_along_author_configuration
SET controlled_publishing_enabled = FALSE,
    updated_at = NOW()
WHERE singleton = TRUE;

UPDATE public.follow_along_published_programmes
SET publication_status = 'withdrawn',
    withdrawn_at = COALESCE(withdrawn_at, NOW())
WHERE candidate_id = 'release-author-draft-e6dee7a5-5868-423f-bcfe-7c74d92b3ad6-r13-36f6c49225f0'
  AND publication_status = 'published';

REVOKE EXECUTE ON FUNCTION public.publish_follow_along_release_candidate(TEXT, TEXT) FROM authenticated;

COMMIT;
