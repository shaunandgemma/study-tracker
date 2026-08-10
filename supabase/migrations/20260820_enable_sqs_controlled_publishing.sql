-- Enable controlled publishing for the accepted Amazon SQS Follow Along only.
-- This migration adds no approval or publication action.

BEGIN;

INSERT INTO public.follow_along_publishable_programmes (
  programme_id,
  service_slug,
  publish_token,
  service_name,
  enabled
) VALUES (
  'sqs-learning-path',
  'sqs',
  'SQS',
  'Amazon Simple Queue Service',
  TRUE
)
ON CONFLICT (programme_id) DO UPDATE
SET service_slug = EXCLUDED.service_slug,
    publish_token = EXCLUDED.publish_token,
    service_name = EXCLUDED.service_name,
    enabled = EXCLUDED.enabled,
    updated_at = NOW();

COMMIT;
