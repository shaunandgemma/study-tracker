-- ============================================================
-- Study Tracker: Follow Along Author least-privilege correction
-- Removes legacy hosted default grants; no data or feature changes.
-- ============================================================

BEGIN;

-- Start from no browser table privileges, then restore only the operations
-- that have an intentional client workflow and matching RLS policies.
REVOKE ALL ON TABLE public.follow_along_author_drafts
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.follow_along_author_revisions
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.follow_along_release_candidates
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.follow_along_author_configuration
  FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE
  ON TABLE public.follow_along_author_drafts TO authenticated;
GRANT SELECT
  ON TABLE public.follow_along_author_revisions TO authenticated;
GRANT SELECT, INSERT
  ON TABLE public.follow_along_release_candidates TO authenticated;

-- Remove direct legacy browser grants from all Author functions.
REVOKE ALL ON FUNCTION public.approve_follow_along_release_candidate(TEXT)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.follow_along_has_app_role(TEXT[])
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.follow_along_is_author()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.follow_along_is_approver()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.follow_along_shared_storage_enabled()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.follow_along_jsonb_sha256(JSONB)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.protect_follow_along_author_draft()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.archive_follow_along_author_revision()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.protect_follow_along_release_candidate()
  FROM PUBLIC, anon, authenticated;

-- Only these five functions are intentional signed-in entry points/helpers.
GRANT EXECUTE ON FUNCTION public.approve_follow_along_release_candidate(TEXT)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.follow_along_has_app_role(TEXT[])
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.follow_along_is_author()
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.follow_along_is_approver()
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.follow_along_shared_storage_enabled()
  TO authenticated;

COMMIT;
