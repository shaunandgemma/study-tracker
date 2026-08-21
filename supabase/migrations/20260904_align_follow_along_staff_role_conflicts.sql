-- Document 006, Step 006B: align Follow Along staff-role conflict handling.
--
-- Scope:
-- - Preserve Admin access to both Author and Approver duties.
-- - Preserve single-role Author and Approver access.
-- - Deny both duties when a non-Admin JWT contains both roles.
-- - Change no rows, ownership rules, candidate state or publication state.

BEGIN;

CREATE OR REPLACE FUNCTION public.follow_along_is_author()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.follow_along_has_app_role(ARRAY['admin'])
    OR (
      public.follow_along_has_app_role(ARRAY['author'])
      AND NOT public.follow_along_has_app_role(ARRAY['approver'])
    );
$$;

CREATE OR REPLACE FUNCTION public.follow_along_is_approver()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.follow_along_has_app_role(ARRAY['admin'])
    OR (
      public.follow_along_has_app_role(ARRAY['approver'])
      AND NOT public.follow_along_has_app_role(ARRAY['author'])
    );
$$;

REVOKE ALL ON FUNCTION public.follow_along_is_author()
  FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.follow_along_is_approver()
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.follow_along_is_author()
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.follow_along_is_approver()
  TO authenticated;

COMMENT ON FUNCTION public.follow_along_is_author() IS
  'Allows Admin or an unconflicted Author role from JWT app_metadata.';
COMMENT ON FUNCTION public.follow_along_is_approver() IS
  'Allows Admin or an unconflicted Approver role from JWT app_metadata.';

COMMIT;
