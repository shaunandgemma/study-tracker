-- ============================================================
-- Study Tracker: Follow Along Author shared-storage foundation
-- REVIEW-ONLY MIGRATION: Do not deploy without explicit approval.
-- Does not alter learner registries, Generator or Hands On tables.
-- ============================================================

CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Server-managed JWT role helpers. user_metadata is never trusted.
CREATE OR REPLACE FUNCTION public.follow_along_has_app_role(allowed_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = ANY(allowed_roles), FALSE)
    OR EXISTS (
      SELECT 1
      FROM jsonb_array_elements_text(COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb)) AS role_name
      WHERE role_name = ANY(allowed_roles)
    );
$$;

CREATE OR REPLACE FUNCTION public.follow_along_is_author()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ SELECT public.follow_along_has_app_role(ARRAY['author', 'admin']); $$;

CREATE OR REPLACE FUNCTION public.follow_along_is_approver()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ SELECT public.follow_along_has_app_role(ARRAY['approver', 'admin']); $$;

CREATE OR REPLACE FUNCTION public.follow_along_jsonb_sha256(value JSONB)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
STRICT
SET search_path = public, extensions
AS $$ SELECT encode(digest(convert_to(value::text, 'UTF8'), 'sha256'), 'hex'); $$;

-- Current editable draft. Content remains private and unpublished.
CREATE TABLE IF NOT EXISTS public.follow_along_author_drafts (
  draft_id TEXT PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  programme_id TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1 CHECK (revision > 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'researching', 'changes_requested', 'ready_for_approval')),
  content JSONB NOT NULL,
  content_hash TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  CONSTRAINT follow_along_author_draft_identity UNIQUE (draft_id, revision)
);

CREATE INDEX IF NOT EXISTS idx_follow_along_author_drafts_owner_updated
  ON public.follow_along_author_drafts (owner_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_follow_along_author_drafts_review_queue
  ON public.follow_along_author_drafts (status, updated_at DESC)
  WHERE status = 'ready_for_approval';

-- Append-only revision history. Clients never insert, update or delete directly.
CREATE TABLE IF NOT EXISTS public.follow_along_author_revisions (
  revision_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id TEXT NOT NULL,
  revision INTEGER NOT NULL CHECK (revision > 0),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  status TEXT NOT NULL,
  content JSONB NOT NULL,
  content_hash TEXT NOT NULL,
  recorded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT follow_along_author_revision_unique UNIQUE (draft_id, revision)
);

CREATE INDEX IF NOT EXISTS idx_follow_along_author_revisions_draft
  ON public.follow_along_author_revisions (draft_id, revision DESC);

-- Tamper-evident package awaiting or holding a trusted approval.
CREATE TABLE IF NOT EXISTS public.follow_along_release_candidates (
  candidate_id TEXT PRIMARY KEY,
  draft_id TEXT NOT NULL REFERENCES public.follow_along_author_drafts(draft_id) ON DELETE RESTRICT,
  source_revision INTEGER NOT NULL CHECK (source_revision > 0),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'awaiting_trusted_approval' CHECK (status IN ('awaiting_trusted_approval', 'approved_release_candidate', 'superseded')),
  snapshot JSONB NOT NULL,
  content_hash TEXT NOT NULL DEFAULT '',
  draft_content_hash TEXT NOT NULL,
  approval_decision TEXT NOT NULL DEFAULT 'pending' CHECK (approval_decision IN ('pending', 'approved')),
  approved_by UUID REFERENCES auth.users(id) ON DELETE RESTRICT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT follow_along_release_candidate_revision UNIQUE (draft_id, source_revision),
  CONSTRAINT follow_along_release_approval_shape CHECK (
    (approval_decision = 'pending' AND approved_by IS NULL AND approved_at IS NULL)
    OR (approval_decision = 'approved' AND approved_by IS NOT NULL AND approved_at IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_follow_along_release_candidates_queue
  ON public.follow_along_release_candidates (status, created_at)
  WHERE status = 'awaiting_trusted_approval';

-- Server-only kill switch. This migration deliberately leaves approval off.
CREATE TABLE IF NOT EXISTS public.follow_along_author_configuration (
  singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
  shared_storage_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  trusted_approval_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.follow_along_author_configuration (
  singleton, shared_storage_enabled, trusted_approval_enabled
) VALUES (TRUE, FALSE, FALSE)
ON CONFLICT (singleton) DO NOTHING;

CREATE OR REPLACE FUNCTION public.follow_along_shared_storage_enabled()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((
    SELECT shared_storage_enabled
    FROM public.follow_along_author_configuration
    WHERE singleton = TRUE
  ), FALSE);
$$;

-- Draft writes enforce ownership, unpublished content and one-step revisions.
CREATE OR REPLACE FUNCTION public.protect_follow_along_author_draft()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF NEW.owner_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Draft owner must match the signed-in user.' USING ERRCODE = '42501';
  END IF;

  IF NEW.content #>> '{programme,publicationVisibility}' IS DISTINCT FROM 'unpublished'
     OR NEW.content #>> '{publication,publishStatus}' IS DISTINCT FROM 'not_published' THEN
    RAISE EXCEPTION 'Author drafts must remain unpublished.' USING ERRCODE = '23514';
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NEW.draft_id <> OLD.draft_id OR NEW.owner_id <> OLD.owner_id OR NEW.created_at <> OLD.created_at THEN
      RAISE EXCEPTION 'Draft identity and owner are immutable.' USING ERRCODE = '23514';
    END IF;
    IF NEW.revision <> OLD.revision + 1 THEN
      RAISE EXCEPTION 'Draft revision must increase by exactly one.' USING ERRCODE = '40001';
    END IF;
  ELSIF NEW.revision <> 1 THEN
    RAISE EXCEPTION 'A new shared draft must start at revision one.' USING ERRCODE = '23514';
  END IF;

  NEW.content_hash := public.follow_along_jsonb_sha256(NEW.content);
  NEW.updated_at := NOW();
  NEW.submitted_at := CASE WHEN NEW.status = 'ready_for_approval' THEN COALESCE(NEW.submitted_at, NOW()) ELSE NULL END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_protect_follow_along_author_draft ON public.follow_along_author_drafts;
CREATE TRIGGER trigger_protect_follow_along_author_draft
  BEFORE INSERT OR UPDATE ON public.follow_along_author_drafts
  FOR EACH ROW EXECUTE FUNCTION public.protect_follow_along_author_draft();

-- Every accepted draft revision is copied into immutable history.
CREATE OR REPLACE FUNCTION public.archive_follow_along_author_revision()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.follow_along_author_revisions (
    draft_id, revision, owner_id, status, content, content_hash, recorded_by
  ) VALUES (
    NEW.draft_id, NEW.revision, NEW.owner_id, NEW.status, NEW.content, NEW.content_hash, auth.uid()
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_archive_follow_along_author_revision ON public.follow_along_author_drafts;
CREATE TRIGGER trigger_archive_follow_along_author_revision
  AFTER INSERT OR UPDATE ON public.follow_along_author_drafts
  FOR EACH ROW EXECUTE FUNCTION public.archive_follow_along_author_revision();

ALTER TABLE public.follow_along_author_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_along_author_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_along_release_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_along_author_configuration ENABLE ROW LEVEL SECURITY;

-- Signed-in users receive only the table operations that have matching RLS policies.
-- Anonymous users and all browser clients remain unable to read server-only switches.
REVOKE ALL ON TABLE public.follow_along_author_drafts FROM anon;
REVOKE ALL ON TABLE public.follow_along_author_revisions FROM anon;
REVOKE ALL ON TABLE public.follow_along_release_candidates FROM anon;
REVOKE ALL ON TABLE public.follow_along_author_configuration FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.follow_along_author_drafts TO authenticated;
GRANT SELECT ON TABLE public.follow_along_author_revisions TO authenticated;
GRANT SELECT, INSERT ON TABLE public.follow_along_release_candidates TO authenticated;

DROP POLICY IF EXISTS "Authors read own Follow Along drafts" ON public.follow_along_author_drafts;
CREATE POLICY "Authors read own Follow Along drafts"
  ON public.follow_along_author_drafts FOR SELECT
  USING (public.follow_along_shared_storage_enabled() AND owner_id = auth.uid() AND public.follow_along_is_author());

DROP POLICY IF EXISTS "Approvers read submitted Follow Along drafts" ON public.follow_along_author_drafts;
CREATE POLICY "Approvers read submitted Follow Along drafts"
  ON public.follow_along_author_drafts FOR SELECT
  USING (public.follow_along_shared_storage_enabled() AND status = 'ready_for_approval' AND public.follow_along_is_approver());

DROP POLICY IF EXISTS "Authors insert own Follow Along drafts" ON public.follow_along_author_drafts;
CREATE POLICY "Authors insert own Follow Along drafts"
  ON public.follow_along_author_drafts FOR INSERT
  WITH CHECK (public.follow_along_shared_storage_enabled() AND owner_id = auth.uid() AND public.follow_along_is_author());

DROP POLICY IF EXISTS "Authors update own Follow Along drafts" ON public.follow_along_author_drafts;
CREATE POLICY "Authors update own Follow Along drafts"
  ON public.follow_along_author_drafts FOR UPDATE
  USING (public.follow_along_shared_storage_enabled() AND owner_id = auth.uid() AND public.follow_along_is_author())
  WITH CHECK (public.follow_along_shared_storage_enabled() AND owner_id = auth.uid() AND public.follow_along_is_author());

-- No client DELETE policy: history-bearing drafts cannot be hard-deleted.

DROP POLICY IF EXISTS "Authors read own Follow Along revisions" ON public.follow_along_author_revisions;
CREATE POLICY "Authors read own Follow Along revisions"
  ON public.follow_along_author_revisions FOR SELECT
  USING (public.follow_along_shared_storage_enabled() AND owner_id = auth.uid() AND public.follow_along_is_author());

DROP POLICY IF EXISTS "Approvers read submitted Follow Along revisions" ON public.follow_along_author_revisions;
CREATE POLICY "Approvers read submitted Follow Along revisions"
  ON public.follow_along_author_revisions FOR SELECT
  USING (
    public.follow_along_shared_storage_enabled()
    AND public.follow_along_is_approver()
    AND EXISTS (
      SELECT 1 FROM public.follow_along_author_drafts draft
      WHERE draft.draft_id = follow_along_author_revisions.draft_id
        AND draft.status = 'ready_for_approval'
    )
  );

-- No client INSERT, UPDATE or DELETE policies on revision history.

DROP POLICY IF EXISTS "Authors read own release candidates" ON public.follow_along_release_candidates;
CREATE POLICY "Authors read own release candidates"
  ON public.follow_along_release_candidates FOR SELECT
  USING (public.follow_along_shared_storage_enabled() AND created_by = auth.uid() AND public.follow_along_is_author());

DROP POLICY IF EXISTS "Approvers read awaiting release candidates" ON public.follow_along_release_candidates;
CREATE POLICY "Approvers read awaiting release candidates"
  ON public.follow_along_release_candidates FOR SELECT
  USING (public.follow_along_shared_storage_enabled() AND public.follow_along_is_approver());

DROP POLICY IF EXISTS "Authors insert own release candidates" ON public.follow_along_release_candidates;
CREATE POLICY "Authors insert own release candidates"
  ON public.follow_along_release_candidates FOR INSERT
  WITH CHECK (public.follow_along_shared_storage_enabled() AND created_by = auth.uid() AND public.follow_along_is_author());

-- No client UPDATE or DELETE policies on release candidates.

-- Trusted approval is the only allowed candidate mutation.
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
  SELECT trusted_approval_enabled INTO approval_enabled
  FROM public.follow_along_author_configuration
  WHERE singleton = TRUE;

  IF approval_enabled IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'Trusted approval is disabled until server validation is deployed.' USING ERRCODE = '42501';
  END IF;

  IF auth.uid() IS NULL OR NOT public.follow_along_is_approver() THEN
    RAISE EXCEPTION 'A server-managed admin or approver role is required.' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO candidate
  FROM public.follow_along_release_candidates
  WHERE candidate_id = p_candidate_id
  FOR UPDATE;

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

-- Candidate inserts are author-owned, revision-bound and always unpublished.
-- The only allowed update shape is the protected approval transition above.
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
    RAISE EXCEPTION 'Release candidates are immutable outside trusted approval.' USING ERRCODE = '42501';
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
  NEW.content_hash := public.follow_along_jsonb_sha256(NEW.snapshot);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_protect_follow_along_release_candidate ON public.follow_along_release_candidates;
CREATE TRIGGER trigger_protect_follow_along_release_candidate
  BEFORE INSERT OR UPDATE ON public.follow_along_release_candidates
  FOR EACH ROW EXECUTE FUNCTION public.protect_follow_along_release_candidate();

REVOKE ALL ON FUNCTION public.approve_follow_along_release_candidate(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.approve_follow_along_release_candidate(TEXT) TO authenticated;

REVOKE ALL ON FUNCTION public.follow_along_has_app_role(TEXT[]) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.follow_along_is_author() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.follow_along_is_approver() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.follow_along_shared_storage_enabled() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.follow_along_has_app_role(TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.follow_along_is_author() TO authenticated;
GRANT EXECUTE ON FUNCTION public.follow_along_is_approver() TO authenticated;
GRANT EXECUTE ON FUNCTION public.follow_along_shared_storage_enabled() TO authenticated;

COMMENT ON TABLE public.follow_along_author_drafts IS 'Private Follow Along Author drafts. No learner publication data.';
COMMENT ON TABLE public.follow_along_author_revisions IS 'Append-only private Follow Along draft revision history.';
COMMENT ON TABLE public.follow_along_release_candidates IS 'Tamper-evident private candidates; approval does not publish.';
COMMENT ON TABLE public.follow_along_author_configuration IS 'Server-only Author feature switches; both remain false in this migration.';
