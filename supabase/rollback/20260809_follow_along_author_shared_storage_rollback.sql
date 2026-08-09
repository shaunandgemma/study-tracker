-- ============================================================
-- Study Tracker: Follow Along Author shared-storage rollback
-- REVIEW-ONLY ROLLBACK: Do not run without an approved backup.
-- This permanently removes only the private Author foundation.
-- It does not remove pgcrypto, the extensions schema, learner
-- data, Generator data, Hands On data, or published Follow Alongs.
-- ============================================================

BEGIN;

-- Remove entry points before the tables and row types they use.
DROP FUNCTION IF EXISTS public.approve_follow_along_release_candidate(TEXT);

-- Drop only the four private Author tables, in dependency order.
-- Their private triggers, indexes and policies are removed with them.
DROP TABLE IF EXISTS public.follow_along_release_candidates;
DROP TABLE IF EXISTS public.follow_along_author_revisions;
DROP TABLE IF EXISTS public.follow_along_author_drafts;
DROP TABLE IF EXISTS public.follow_along_author_configuration;

-- Remove trigger and security helpers after their dependants are gone.
DROP FUNCTION IF EXISTS public.protect_follow_along_release_candidate();
DROP FUNCTION IF EXISTS public.archive_follow_along_author_revision();
DROP FUNCTION IF EXISTS public.protect_follow_along_author_draft();
DROP FUNCTION IF EXISTS public.follow_along_shared_storage_enabled();
DROP FUNCTION IF EXISTS public.follow_along_jsonb_sha256(JSONB);
DROP FUNCTION IF EXISTS public.follow_along_is_approver();
DROP FUNCTION IF EXISTS public.follow_along_is_author();
DROP FUNCTION IF EXISTS public.follow_along_has_app_role(TEXT[]);

-- pgcrypto and the extensions schema may be shared, so they remain.
COMMIT;
