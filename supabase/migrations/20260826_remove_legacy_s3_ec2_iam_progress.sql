-- Step 164: remove progress owned only by the retired hard-coded S3, EC2,
-- and IAM Follow Alongs. Controlled publishing records and all other data
-- are outside this migration's delete boundary.

BEGIN;

CREATE TABLE IF NOT EXISTS public.follow_along_legacy_progress_removals (
  removal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  removed_path_ids TEXT[] NOT NULL,
  removed_progress_rows INTEGER NOT NULL CHECK (removed_progress_rows >= 0),
  removed_resource_rows INTEGER NOT NULL CHECK (removed_resource_rows >= 0),
  removed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reason TEXT NOT NULL
);

ALTER TABLE public.follow_along_legacy_progress_removals ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.follow_along_legacy_progress_removals FROM PUBLIC, anon, authenticated;

DO $$
DECLARE
  legacy_path_ids CONSTANT TEXT[] := ARRAY[
    's3-learning-path',
    'ec2-learning-path',
    'iam-learning-path'
  ];
  progress_rows INTEGER := 0;
  resource_rows INTEGER := 0;
BEGIN
  LOCK TABLE public.follow_along_published_programmes IN SHARE MODE;
  LOCK TABLE public.user_learning_path_progress IN SHARE ROW EXCLUSIVE MODE;
  LOCK TABLE public.user_learning_path_resources IN SHARE ROW EXCLUSIVE MODE;

  IF EXISTS (
    SELECT 1
    FROM public.follow_along_published_programmes
    WHERE programme_id = ANY(legacy_path_ids)
  ) THEN
    RAISE EXCEPTION 'Step 164 stopped: a controlled published S3, EC2, or IAM replacement already exists.';
  END IF;

  DELETE FROM public.user_learning_path_resources
  WHERE path_id = ANY(legacy_path_ids);
  GET DIAGNOSTICS resource_rows = ROW_COUNT;

  DELETE FROM public.user_learning_path_progress
  WHERE path_id = ANY(legacy_path_ids);
  GET DIAGNOSTICS progress_rows = ROW_COUNT;

  INSERT INTO public.follow_along_legacy_progress_removals (
    removed_path_ids,
    removed_progress_rows,
    removed_resource_rows,
    reason
  ) VALUES (
    legacy_path_ids,
    progress_rows,
    resource_rows,
    'Step 164 retirement of hard-coded S3, EC2, and IAM Follow Alongs'
  );
END;
$$;

COMMIT;
