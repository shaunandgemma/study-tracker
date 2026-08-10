-- Enable controlled publishing for the approved Amazon SNS Follow Along only.
-- This migration adds no approval or publication action.

BEGIN;

INSERT INTO public.follow_along_publishable_programmes (
  programme_id,
  service_slug,
  publish_token,
  service_name,
  enabled
) VALUES (
  'sns-learning-path',
  'sns',
  'SNS',
  'Amazon Simple Notification Service',
  TRUE
)
ON CONFLICT (programme_id) DO UPDATE
SET service_slug = EXCLUDED.service_slug,
    publish_token = EXCLUDED.publish_token,
    service_name = EXCLUDED.service_name,
    enabled = EXCLUDED.enabled,
    updated_at = NOW();

COMMIT;
