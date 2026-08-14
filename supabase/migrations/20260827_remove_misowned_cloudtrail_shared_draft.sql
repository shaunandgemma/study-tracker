-- Remove only the orphaned CloudTrail Shared Draft created by the AG helper
-- under the Approver account. The correct browser-local Author draft is not
-- stored in these tables and is therefore outside this migration's scope.

BEGIN;

DO $$
DECLARE
  target_draft_id CONSTANT TEXT := 'author-draft-import-9c389609207da8d022aa672f7b27a1d7574c85825a5329545367489eeedf9bde';
  target_fingerprint CONSTANT TEXT := '9c389609207da8d022aa672f7b27a1d7574c85825a5329545367489eeedf9bde';
  incorrect_owner_id CONSTANT UUID := '0a70410c-912f-4a67-a0ad-a8543b6bf6d4';
  intended_author_email CONSTANT TEXT := 'shaun19862010@hotmail.co.uk';
  intended_author_id UUID;
  target public.follow_along_author_drafts%ROWTYPE;
  revision_rows INTEGER := 0;
BEGIN
  SELECT id INTO intended_author_id
  FROM auth.users
  WHERE LOWER(email) = LOWER(intended_author_email)
    AND (
      LOWER(COALESCE(raw_app_meta_data ->> 'role', '')) IN ('author', 'admin')
      OR EXISTS (
        SELECT 1
        FROM jsonb_array_elements_text(COALESCE(raw_app_meta_data -> 'roles', '[]'::jsonb)) AS role_name
        WHERE LOWER(role_name) IN ('author', 'admin')
      )
    );

  IF intended_author_id IS DISTINCT FROM '667ad4ce-312b-4f78-a3fa-366c8b669477'::UUID THEN
    RAISE EXCEPTION 'Step 20260827 stopped: the intended CloudTrail Author identity was not verified.';
  END IF;

  SELECT * INTO target
  FROM public.follow_along_author_drafts
  WHERE draft_id = target_draft_id
  FOR UPDATE;

  -- A previously completed cleanup is safe to leave unchanged.
  IF NOT FOUND THEN
    RETURN;
  END IF;

  IF target.programme_id <> 'cloudtrail-learning-path'
     OR target.revision <> 1
     OR target.status <> 'ready_for_approval'
     OR target.owner_id <> incorrect_owner_id
     OR target.content #>> '{draft,createdBy}' <> incorrect_owner_id::TEXT
     OR target.content #>> '{draft,updatedBy}' <> incorrect_owner_id::TEXT
     OR target.content #>> '{draft,importedFrom,importedBy}' <> incorrect_owner_id::TEXT
     OR target.content #>> '{draft,importedFrom,handoffFingerprint}' <> target_fingerprint
     OR target.content #>> '{programme,programmeId}' <> 'cloudtrail-learning-path'
     OR target.content #>> '{programme,publicationVisibility}' <> 'unpublished'
     OR target.content #>> '{publication,publishStatus}' <> 'not_published' THEN
    RAISE EXCEPTION 'Step 20260827 stopped: the mistaken CloudTrail draft identity, content boundary or ownership did not match.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.follow_along_release_candidates
    WHERE draft_id = target_draft_id
  ) THEN
    RAISE EXCEPTION 'Step 20260827 stopped: the mistaken CloudTrail draft has release-candidate history.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.follow_along_published_programmes
    WHERE programme_id = 'cloudtrail-learning-path'
       OR candidate_id LIKE 'release-' || target_draft_id || '-r%'
  ) THEN
    RAISE EXCEPTION 'Step 20260827 stopped: CloudTrail is already published.';
  END IF;

  SELECT COUNT(*) INTO revision_rows
  FROM public.follow_along_author_revisions
  WHERE draft_id = target_draft_id
    AND revision = 1
    AND owner_id = incorrect_owner_id
    AND content_hash = target.content_hash
    AND content #>> '{draft,createdBy}' = incorrect_owner_id::TEXT
    AND content #>> '{draft,importedFrom,handoffFingerprint}' = target_fingerprint;

  IF revision_rows <> 1 OR (
    SELECT COUNT(*)
    FROM public.follow_along_author_revisions
    WHERE draft_id = target_draft_id
  ) <> 1 THEN
    RAISE EXCEPTION 'Step 20260827 stopped: exactly one matching CloudTrail revision was not verified.';
  END IF;

  INSERT INTO public.follow_along_author_draft_deletions (
    draft_id,
    programme_id,
    deleted_revision,
    deleted_content_hash,
    deleted_by,
    reason
  ) VALUES (
    target.draft_id,
    target.programme_id,
    target.revision,
    target.content_hash,
    target.owner_id,
    'Step 20260827 removed AG-created CloudTrail draft owned by the Approver account'
  );

  DELETE FROM public.follow_along_author_revisions
  WHERE draft_id = target_draft_id
    AND revision = 1
    AND owner_id = incorrect_owner_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Step 20260827 stopped: the verified CloudTrail revision was not removed.';
  END IF;

  DELETE FROM public.follow_along_author_drafts
  WHERE draft_id = target_draft_id
    AND programme_id = 'cloudtrail-learning-path'
    AND revision = 1
    AND owner_id = incorrect_owner_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Step 20260827 stopped: the verified CloudTrail draft was not removed.';
  END IF;
END;
$$;

COMMIT;
