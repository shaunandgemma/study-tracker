-- Study Tracker: guarded trusted-approval pilot activation.
-- Approval remains separate from publication and changes no learner data.

DO $$
DECLARE
  updated_rows INTEGER := 0;
  confirmed_approvers INTEGER := 0;
BEGIN
  IF to_regprocedure('public.approve_follow_along_release_candidate(text)') IS NULL THEN
    RAISE EXCEPTION 'The protected Follow Along approval function is missing.';
  END IF;

  IF to_regclass('public.follow_along_release_candidates') IS NULL
     OR to_regclass('public.follow_along_author_configuration') IS NULL THEN
    RAISE EXCEPTION 'The Follow Along approval tables are missing.';
  END IF;

  SELECT COUNT(*) INTO confirmed_approvers
  FROM auth.users
  WHERE email_confirmed_at IS NOT NULL
    AND (
      LOWER(COALESCE(raw_app_meta_data ->> 'role', '')) IN ('approver', 'admin')
      OR EXISTS (
        SELECT 1
        FROM jsonb_array_elements_text(COALESCE(raw_app_meta_data -> 'roles', '[]'::jsonb)) AS role_name
        WHERE LOWER(role_name) IN ('approver', 'admin')
      )
    );

  IF confirmed_approvers < 1 THEN
    RAISE EXCEPTION 'Trusted approval requires at least one confirmed server-managed Approver or Admin account.';
  END IF;

  UPDATE public.follow_along_author_configuration
  SET trusted_approval_enabled = TRUE,
      updated_at = NOW()
  WHERE singleton = TRUE
    AND shared_storage_enabled = TRUE
    AND trusted_approval_enabled = FALSE;

  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  IF updated_rows <> 1 THEN
    RAISE EXCEPTION 'Trusted approval activation requires one shared-storage row with approval disabled.';
  END IF;
END;
$$;

DO $$
DECLARE
  shared_enabled BOOLEAN;
  approval_enabled BOOLEAN;
BEGIN
  SELECT shared_storage_enabled, trusted_approval_enabled
  INTO shared_enabled, approval_enabled
  FROM public.follow_along_author_configuration
  WHERE singleton = TRUE;

  IF shared_enabled IS DISTINCT FROM TRUE OR approval_enabled IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'Trusted approval activation verification failed.';
  END IF;
END;
$$;

