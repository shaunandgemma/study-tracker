-- ============================================================
-- Study Tracker: controlled Follow Along Author storage pilot
-- Enables shared drafts only; trusted approval remains disabled.
-- ============================================================

BEGIN;

DO $$
DECLARE
  updated_rows INTEGER := 0;
BEGIN
  UPDATE public.follow_along_author_configuration
  SET shared_storage_enabled = TRUE,
      updated_at = NOW()
  WHERE singleton = TRUE
    AND shared_storage_enabled = FALSE
    AND trusted_approval_enabled = FALSE;

  GET DIAGNOSTICS updated_rows = ROW_COUNT;

  IF updated_rows <> 1 THEN
    RAISE EXCEPTION 'Shared Drafts pilot activation requires one disabled configuration row with trusted approval off.';
  END IF;
END;
$$;

COMMIT;
