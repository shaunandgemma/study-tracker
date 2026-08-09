\set ON_ERROR_STOP on

\echo STEP43_VERIFY_IDENTITY
SELECT current_database() AS database_name, current_user AS database_user;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.follow_along_author_drafts,
     public.follow_along_author_revisions,
     public.follow_along_release_candidates
  TO authenticated;
GRANT SELECT ON public.follow_along_author_drafts TO anon;

\echo STEP43_VERIFY_STRUCTURE
SELECT COUNT(*) = 4 AS four_author_tables_exist
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'follow_along_author_drafts',
    'follow_along_author_revisions',
    'follow_along_release_candidates',
    'follow_along_author_configuration'
  );

SELECT COUNT(*) = 9 AS nine_author_functions_exist
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'follow_along_has_app_role',
    'follow_along_is_author',
    'follow_along_is_approver',
    'follow_along_jsonb_sha256',
    'follow_along_shared_storage_enabled',
    'protect_follow_along_author_draft',
    'archive_follow_along_author_revision',
    'approve_follow_along_release_candidate',
    'protect_follow_along_release_candidate'
  );

SELECT COUNT(*) = 3 AS three_author_triggers_exist
FROM pg_trigger
WHERE NOT tgisinternal
  AND tgname IN (
    'trigger_protect_follow_along_author_draft',
    'trigger_archive_follow_along_author_revision',
    'trigger_protect_follow_along_release_candidate'
  );

SELECT COUNT(*) = 9 AS nine_author_policies_exist
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'follow_along_author_drafts',
    'follow_along_author_revisions',
    'follow_along_release_candidates',
    'follow_along_author_configuration'
  );

SELECT BOOL_AND(relrowsecurity) AS row_level_security_enabled_on_all_four
FROM pg_class
WHERE oid IN (
  'public.follow_along_author_drafts'::regclass,
  'public.follow_along_author_revisions'::regclass,
  'public.follow_along_release_candidates'::regclass,
  'public.follow_along_author_configuration'::regclass
);

\echo STEP43_VERIFY_DEFAULT_DISABLED_STATE
SELECT shared_storage_enabled = FALSE AS storage_starts_disabled,
       trusted_approval_enabled = FALSE AS approval_starts_disabled
FROM public.follow_along_author_configuration
WHERE singleton = TRUE;

SET ROLE anon;
DO $$
DECLARE visible_rows INTEGER;
BEGIN
  BEGIN
    SELECT COUNT(*) INTO visible_rows FROM public.follow_along_author_drafts;
    IF visible_rows <> 0 THEN
      RAISE EXCEPTION 'Anonymous user saw private Author rows while storage was disabled.';
    END IF;
  EXCEPTION
    WHEN insufficient_privilege THEN NULL;
  END;
END;
$$;
RESET ROLE;

SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', FALSE);
SELECT set_config('request.jwt.claims', '{"app_metadata":{"role":"author"}}', FALSE);
DO $$
BEGIN
  BEGIN
    INSERT INTO public.follow_along_author_drafts (
      draft_id, owner_id, programme_id, revision, status, content
    ) VALUES (
      'disabled-write-must-fail',
      '11111111-1111-4111-8111-111111111111',
      'programme-step43',
      1,
      'draft',
      '{"programme":{"publicationVisibility":"unpublished"},"publication":{"publishStatus":"not_published"}}'
    );
    RAISE EXCEPTION 'Author write unexpectedly succeeded while storage was disabled.';
  EXCEPTION
    WHEN insufficient_privilege THEN NULL;
  END;
END;
$$;
RESET ROLE;

UPDATE public.follow_along_author_configuration
SET shared_storage_enabled = TRUE, trusted_approval_enabled = FALSE, updated_at = NOW()
WHERE singleton = TRUE;

\echo STEP43_VERIFY_AUTHOR_OWNERSHIP_AND_REVISIONS
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', FALSE);
SELECT set_config('request.jwt.claims', '{"app_metadata":{"role":"author"}}', FALSE);

INSERT INTO public.follow_along_author_drafts (
  draft_id, owner_id, programme_id, revision, status, content
) VALUES (
  'draft-step43',
  '11111111-1111-4111-8111-111111111111',
  'programme-step43',
  1,
  'draft',
  '{"draft":{"draftId":"draft-step43","createdBy":"11111111-1111-4111-8111-111111111111","revision":1,"status":"draft"},"programme":{"programmeId":"programme-step43","publicationVisibility":"unpublished"},"review":{"reviewStatus":"draft"},"publication":{"publishStatus":"not_published"}}'
);

DO $$
DECLARE visible_rows INTEGER;
BEGIN
  SELECT COUNT(*) INTO visible_rows
  FROM public.follow_along_author_drafts
  WHERE draft_id = 'draft-step43';
  IF visible_rows <> 1 THEN
    RAISE EXCEPTION 'Author could not read their own draft.';
  END IF;
END;
$$;

UPDATE public.follow_along_author_drafts
SET revision = 2,
    status = 'ready_for_approval',
    content = jsonb_set(
      jsonb_set(content, '{draft,revision}', '2'::JSONB),
      '{review,reviewStatus}',
      '"ready_for_approval"'::JSONB
    )
WHERE draft_id = 'draft-step43' AND revision = 1;

DO $$
DECLARE revision_rows INTEGER;
DECLARE stale_updates INTEGER;
BEGIN
  SELECT COUNT(*) INTO revision_rows
  FROM public.follow_along_author_revisions
  WHERE draft_id = 'draft-step43';
  IF revision_rows <> 2 THEN
    RAISE EXCEPTION 'Expected two immutable revisions, received %.', revision_rows;
  END IF;

  UPDATE public.follow_along_author_drafts
  SET revision = 3
  WHERE draft_id = 'draft-step43' AND revision = 1;
  GET DIAGNOSTICS stale_updates = ROW_COUNT;
  IF stale_updates <> 0 THEN
    RAISE EXCEPTION 'A stale revision unexpectedly overwrote the current draft.';
  END IF;

  BEGIN
    INSERT INTO public.follow_along_author_revisions (
      draft_id, revision, owner_id, status, content, content_hash, recorded_by
    ) VALUES (
      'draft-step43', 99,
      '11111111-1111-4111-8111-111111111111',
      'draft', '{}'::JSONB, 'forbidden',
      '11111111-1111-4111-8111-111111111111'
    );
    RAISE EXCEPTION 'Direct revision-history insert unexpectedly succeeded.';
  EXCEPTION
    WHEN insufficient_privilege THEN NULL;
  END;
END;
$$;

INSERT INTO public.follow_along_release_candidates (
  candidate_id, draft_id, source_revision, created_by, snapshot, draft_content_hash
)
SELECT
  'candidate-step43', draft_id, revision, owner_id, content, content_hash
FROM public.follow_along_author_drafts
WHERE draft_id = 'draft-step43';

RESET ROLE;

\echo STEP43_VERIFY_SECOND_AUTHOR_AND_LEARNER_ISOLATION
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '22222222-2222-4222-8222-222222222222', FALSE);
SELECT set_config('request.jwt.claims', '{"app_metadata":{"role":"author"}}', FALSE);
DO $$
DECLARE visible_rows INTEGER;
DECLARE changed_rows INTEGER;
BEGIN
  SELECT COUNT(*) INTO visible_rows FROM public.follow_along_author_drafts;
  IF visible_rows <> 0 THEN
    RAISE EXCEPTION 'Second Author saw the first Author draft.';
  END IF;
  UPDATE public.follow_along_author_drafts SET revision = 3 WHERE draft_id = 'draft-step43';
  GET DIAGNOSTICS changed_rows = ROW_COUNT;
  IF changed_rows <> 0 THEN
    RAISE EXCEPTION 'Second Author changed the first Author draft.';
  END IF;
END;
$$;

SELECT set_config('request.jwt.claim.sub', '44444444-4444-4444-8444-444444444444', FALSE);
SELECT set_config('request.jwt.claims', '{"app_metadata":{"role":"learner"}}', FALSE);
DO $$
DECLARE visible_rows INTEGER;
BEGIN
  SELECT COUNT(*) INTO visible_rows FROM public.follow_along_author_drafts;
  IF visible_rows <> 0 THEN
    RAISE EXCEPTION 'Learner saw a private Author draft.';
  END IF;
END;
$$;
RESET ROLE;

\echo STEP43_VERIFY_APPROVER_VISIBILITY_AND_DISABLED_APPROVAL
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '33333333-3333-4333-8333-333333333333', FALSE);
SELECT set_config('request.jwt.claims', '{"app_metadata":{"role":"approver"}}', FALSE);
DO $$
DECLARE draft_rows INTEGER;
DECLARE revision_rows INTEGER;
DECLARE candidate_rows INTEGER;
BEGIN
  SELECT COUNT(*) INTO draft_rows FROM public.follow_along_author_drafts;
  SELECT COUNT(*) INTO revision_rows FROM public.follow_along_author_revisions;
  SELECT COUNT(*) INTO candidate_rows FROM public.follow_along_release_candidates;
  IF draft_rows <> 1 OR revision_rows <> 2 OR candidate_rows <> 1 THEN
    RAISE EXCEPTION 'Approver queue visibility was incorrect: drafts %, revisions %, candidates %.', draft_rows, revision_rows, candidate_rows;
  END IF;

  BEGIN
    PERFORM public.approve_follow_along_release_candidate('candidate-step43');
    RAISE EXCEPTION 'Approval unexpectedly succeeded while trusted approval was disabled.';
  EXCEPTION
    WHEN insufficient_privilege THEN NULL;
  END;
END;
$$;
RESET ROLE;

UPDATE public.follow_along_author_configuration
SET shared_storage_enabled = FALSE, trusted_approval_enabled = FALSE, updated_at = NOW()
WHERE singleton = TRUE;

\echo STEP43_VERIFY_FINAL_SAFE_STATE
SELECT shared_storage_enabled = FALSE AS storage_returned_to_disabled,
       trusted_approval_enabled = FALSE AS approval_remains_disabled
FROM public.follow_along_author_configuration
WHERE singleton = TRUE;

SELECT COUNT(*) = 1 AS one_test_draft,
       (SELECT COUNT(*) FROM public.follow_along_author_revisions) = 2 AS two_test_revisions,
       (SELECT COUNT(*) FROM public.follow_along_release_candidates) = 1 AS one_test_candidate
FROM public.follow_along_author_drafts;
