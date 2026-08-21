-- Document 004, Step 004H: private exam-entitlement foundation.
--
-- Scope:
-- - Create only public.exam_entitlements.
-- - Store one current entitlement boundary per learner and exam.
-- - Allow authenticated learners to read only their own entitlement rows.
-- - Give browser roles no create, update or delete privilege.
-- - Create no checkout, payment, webhook or automatic access-grant behaviour.

BEGIN;

DO $$
BEGIN
  IF to_regclass('public.exam_entitlements') IS NOT NULL THEN
    RAISE EXCEPTION
      '20260902 stopped: public.exam_entitlements already exists.';
  END IF;
END;
$$;

CREATE TABLE public.exam_entitlements (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  exam_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  starts_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

  CONSTRAINT exam_entitlements_pkey
    PRIMARY KEY (user_id, exam_id),

  CONSTRAINT exam_entitlements_exam_id_check
    CHECK (exam_id IN (
      'aws-saa-c03',
      'terraform-associate-004',
      'comptia-sec-plus'
    )),

  CONSTRAINT exam_entitlements_status_check
    CHECK (status IN ('active', 'revoked')),

  CONSTRAINT exam_entitlements_time_window_check
    CHECK (expires_at > starts_at),

  CONSTRAINT exam_entitlements_created_updated_check
    CHECK (updated_at >= created_at)
);

COMMENT ON TABLE public.exam_entitlements IS
  'Private exam access periods. Rows are written only by a future protected server process; learners receive read-only access to their own rows.';

COMMENT ON COLUMN public.exam_entitlements.user_id IS
  'Authenticated learner receiving access. Browser clients cannot create or change this value.';

COMMENT ON COLUMN public.exam_entitlements.status IS
  'Trusted server-managed state. Expiry is also enforced by the starts_at and expires_at time window.';

COMMENT ON COLUMN public.exam_entitlements.expires_at IS
  'Exclusive end of access. An entitlement is not active when expires_at is equal to or earlier than the current time.';

CREATE INDEX idx_exam_entitlements_owner_status_expiry
  ON public.exam_entitlements (user_id, status, expires_at DESC);

ALTER TABLE public.exam_entitlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Learners read own exam entitlements"
  ON public.exam_entitlements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

REVOKE ALL PRIVILEGES
  ON TABLE public.exam_entitlements
  FROM PUBLIC, anon, authenticated;

GRANT SELECT
  ON TABLE public.exam_entitlements
  TO authenticated;

DO $$
DECLARE
  policy_count INTEGER;
  permission_name TEXT;
  rls_enabled BOOLEAN;
BEGIN
  IF (SELECT COUNT(*) FROM public.exam_entitlements) <> 0 THEN
    RAISE EXCEPTION '20260902 stopped: exam_entitlements was not created empty.';
  END IF;

  SELECT relrowsecurity INTO rls_enabled
  FROM pg_class
  WHERE oid = 'public.exam_entitlements'::regclass;

  IF rls_enabled IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION '20260902 stopped: row level security is not enabled.';
  END IF;

  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'exam_entitlements'
    AND policyname = 'Learners read own exam entitlements'
    AND cmd = 'SELECT';

  IF policy_count <> 1 THEN
    RAISE EXCEPTION '20260902 stopped: the private learner SELECT policy is incomplete.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'exam_entitlements'
      AND cmd <> 'SELECT'
  ) THEN
    RAISE EXCEPTION '20260902 stopped: a browser write policy exists unexpectedly.';
  END IF;

  FOREACH permission_name IN ARRAY ARRAY[
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER'
  ]
  LOOP
    IF has_table_privilege('anon', 'public.exam_entitlements', permission_name) THEN
      RAISE EXCEPTION
        '20260902 stopped: anon has unexpected % on exam_entitlements.',
        permission_name;
    END IF;
  END LOOP;

  IF NOT has_table_privilege(
    'authenticated',
    'public.exam_entitlements',
    'SELECT'
  ) THEN
    RAISE EXCEPTION
      '20260902 stopped: authenticated is missing SELECT on exam_entitlements.';
  END IF;

  FOREACH permission_name IN ARRAY ARRAY[
    'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER'
  ]
  LOOP
    IF has_table_privilege(
      'authenticated',
      'public.exam_entitlements',
      permission_name
    ) THEN
      RAISE EXCEPTION
        '20260902 stopped: authenticated has unexpected % on exam_entitlements.',
        permission_name;
    END IF;
  END LOOP;
END;
$$;

COMMIT;
