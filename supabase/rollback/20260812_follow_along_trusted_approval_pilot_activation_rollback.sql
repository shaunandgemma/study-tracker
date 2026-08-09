-- Emergency stop for Step 53. This preserves every draft, revision and candidate.
DO $$
DECLARE
  updated_rows INTEGER := 0;
BEGIN
  UPDATE public.follow_along_author_configuration
  SET trusted_approval_enabled = FALSE,
      updated_at = NOW()
  WHERE singleton = TRUE
    AND trusted_approval_enabled = TRUE;

  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  IF updated_rows <> 1 THEN
    RAISE EXCEPTION 'Trusted approval rollback expected exactly one enabled row.';
  END IF;
END;
$$;

