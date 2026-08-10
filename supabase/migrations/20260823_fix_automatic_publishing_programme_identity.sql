-- Correct automatic publishing registration to read programmeId from the
-- immutable candidate snapshot. The release-candidate table has no programme_id column.

BEGIN;

CREATE OR REPLACE FUNCTION public.register_approved_follow_along_for_publishing()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  candidate_programme_id TEXT;
  candidate_service_slug TEXT;
  candidate_service_name TEXT;
  candidate_publish_token TEXT;
BEGIN
  IF NOT (
    OLD.status = 'awaiting_trusted_approval'
    AND OLD.approval_decision = 'pending'
    AND NEW.status = 'approved_release_candidate'
    AND NEW.approval_decision = 'approved'
    AND NEW.approved_by IS NOT NULL
    AND NEW.approved_at IS NOT NULL
  ) THEN
    RETURN NEW;
  END IF;

  candidate_programme_id := trim(NEW.snapshot #>> '{programme,programmeId}');
  candidate_service_slug := lower(trim(NEW.snapshot #>> '{programme,serviceSlug}'));
  candidate_service_name := trim(NEW.snapshot #>> '{programme,serviceName}');

  IF candidate_programme_id IS NULL
     OR candidate_service_slug IS NULL
     OR candidate_service_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
     OR candidate_programme_id IS DISTINCT FROM (candidate_service_slug || '-learning-path')
     OR candidate_service_name IS NULL
     OR candidate_service_name = '' THEN
    RAISE EXCEPTION 'Approved candidate has invalid controlled-publishing programme identity.';
  END IF;

  candidate_publish_token := upper(replace(candidate_service_slug, '-', ' '));

  INSERT INTO public.follow_along_publishable_programmes (
    programme_id,
    service_slug,
    publish_token,
    service_name,
    enabled
  ) VALUES (
    candidate_programme_id,
    candidate_service_slug,
    candidate_publish_token,
    candidate_service_name,
    TRUE
  )
  ON CONFLICT (programme_id) DO UPDATE
  SET service_slug = EXCLUDED.service_slug,
      publish_token = EXCLUDED.publish_token,
      service_name = EXCLUDED.service_name,
      enabled = TRUE,
      updated_at = NOW();

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.register_approved_follow_along_for_publishing() FROM PUBLIC, anon, authenticated;

COMMENT ON FUNCTION public.register_approved_follow_along_for_publishing()
IS 'Registers a valid newly approved candidate using programme identity from its immutable snapshot.';

COMMIT;
