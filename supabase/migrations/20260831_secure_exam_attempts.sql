-- Document 003: secure exam attempts before public learner registration.
--
-- Scope:
-- - Preserve the 12 existing ownerless attempt rows exactly as they are.
-- - Bind every future attempt to the authenticated learner at the database boundary.
-- - Replace public attempt policies with authenticated own-row policies.
-- - Remove unnecessary browser-role privileges.
--
-- ROLLBACK NOTE:
-- Do not restore the former public SELECT or INSERT policies. If rollback is
-- required, stop new attempt writes, preserve the nullable user_id column and
-- investigate through a separately reviewed corrective migration.

BEGIN;

DO $$
DECLARE
  attempt_count BIGINT;
  policy_count INTEGER;
BEGIN
  IF to_regclass('public.exam_attempts') IS NULL THEN
    RAISE EXCEPTION '20260831 stopped: public.exam_attempts does not exist.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'exam_attempts'
      AND column_name = 'user_id'
  ) THEN
    RAISE EXCEPTION '20260831 stopped: exam_attempts.user_id already exists.';
  END IF;

  SELECT COUNT(*) INTO attempt_count
  FROM public.exam_attempts;

  IF attempt_count <> 12 THEN
    RAISE EXCEPTION
      '20260831 stopped: expected exactly 12 legacy exam attempts, found %.',
      attempt_count;
  END IF;

  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'exam_attempts';

  IF policy_count <> 2 OR EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'exam_attempts'
      AND policyname NOT IN (
        'Allow public read on exam_attempts',
        'Allow public insert on exam_attempts'
      )
  ) THEN
    RAISE EXCEPTION '20260831 stopped: the live exam_attempts policy boundary changed.';
  END IF;
END;
$$;

ALTER TABLE public.exam_attempts
  ADD COLUMN user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.exam_attempts.user_id IS
  'Authenticated learner owner. Null is retained only for the 12 legacy attempts that predate account ownership.';

CREATE INDEX idx_exam_attempts_user_exam_completed
  ON public.exam_attempts (user_id, exam_code, completed_at DESC);

CREATE OR REPLACE FUNCTION public.assign_exam_attempt_owner()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog
AS $$
DECLARE
  requester_id UUID := auth.uid();
BEGIN
  IF requester_id IS NULL THEN
    RAISE EXCEPTION 'Authenticated learner required to save an exam attempt.'
      USING ERRCODE = '42501';
  END IF;

  IF NEW.user_id IS NOT NULL AND NEW.user_id IS DISTINCT FROM requester_id THEN
    RAISE EXCEPTION 'An exam attempt cannot be created for another learner.'
      USING ERRCODE = '42501';
  END IF;

  NEW.user_id := requester_id;
  RETURN NEW;
END;
$$;

REVOKE ALL PRIVILEGES ON FUNCTION public.assign_exam_attempt_owner()
  FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trigger_assign_exam_attempt_owner ON public.exam_attempts;
CREATE TRIGGER trigger_assign_exam_attempt_owner
  BEFORE INSERT ON public.exam_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_exam_attempt_owner();

ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on exam_attempts"
  ON public.exam_attempts;
DROP POLICY IF EXISTS "Allow public insert on exam_attempts"
  ON public.exam_attempts;

CREATE POLICY "Learners read own exam attempts"
  ON public.exam_attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Learners insert own exam attempts"
  ON public.exam_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

REVOKE ALL PRIVILEGES ON TABLE public.exam_attempts
  FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT
  ON TABLE public.exam_attempts
  TO authenticated;

DO $$
DECLARE
  attempt_count BIGINT;
  ownerless_count BIGINT;
  policy_count INTEGER;
  permission_name TEXT;
BEGIN
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE user_id IS NULL)
  INTO attempt_count, ownerless_count
  FROM public.exam_attempts;

  IF attempt_count <> 12 OR ownerless_count <> 12 THEN
    RAISE EXCEPTION
      '20260831 stopped: legacy preservation failed; total %, ownerless %.',
      attempt_count,
      ownerless_count;
  END IF;

  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'exam_attempts'
    AND policyname IN (
      'Learners read own exam attempts',
      'Learners insert own exam attempts'
    );

  IF policy_count <> 2 THEN
    RAISE EXCEPTION '20260831 stopped: authenticated own-row policies were not created.';
  END IF;

  FOREACH permission_name IN ARRAY ARRAY[
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER'
  ]
  LOOP
    IF has_table_privilege('anon', 'public.exam_attempts', permission_name) THEN
      RAISE EXCEPTION '20260831 stopped: anon still has % on exam_attempts.', permission_name;
    END IF;
  END LOOP;

  IF NOT has_table_privilege('authenticated', 'public.exam_attempts', 'SELECT')
     OR NOT has_table_privilege('authenticated', 'public.exam_attempts', 'INSERT') THEN
    RAISE EXCEPTION '20260831 stopped: authenticated SELECT/INSERT grants are incomplete.';
  END IF;

  FOREACH permission_name IN ARRAY ARRAY[
    'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER'
  ]
  LOOP
    IF has_table_privilege('authenticated', 'public.exam_attempts', permission_name) THEN
      RAISE EXCEPTION
        '20260831 stopped: authenticated still has unnecessary % on exam_attempts.',
        permission_name;
    END IF;
  END LOOP;
END;
$$;

COMMIT;
