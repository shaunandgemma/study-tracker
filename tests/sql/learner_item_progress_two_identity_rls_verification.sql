-- Document 004, Step 004F: two-identity learner progress RLS verification.
--
-- Run only in the linked Supabase SQL Editor.
-- Every test row is transaction-local and the script ends with ROLLBACK.
-- No existing learner progress row is updated or deleted.

BEGIN;

DO $$
DECLARE
  identity_count INTEGER;
  existing_test_rows INTEGER;
BEGIN
  SELECT COUNT(*) INTO identity_count
  FROM auth.users
  WHERE id IN (
    '667ad4ce-312b-4f78-a3fa-366c8b669477'::UUID,
    '0a70410c-912f-4a67-a0ad-a8543b6bf6d4'::UUID
  );

  IF identity_count <> 2 THEN
    RAISE EXCEPTION 'Step 004F stopped: both approved authenticated identities must exist.';
  END IF;

  SELECT COUNT(*) INTO existing_test_rows
  FROM public.learner_item_progress
  WHERE content_id IN (
    '__step004f_identity_a_20260820__',
    '__step004f_identity_b_20260820__'
  );

  IF existing_test_rows <> 0 THEN
    RAISE EXCEPTION 'Step 004F stopped: disposable test identifiers already exist.';
  END IF;
END;
$$;

CREATE TEMPORARY TABLE step004f_results (
  test_order INTEGER PRIMARY KEY,
  test_name TEXT NOT NULL,
  passed BOOLEAN NOT NULL,
  observed_rows INTEGER NOT NULL
) ON COMMIT DROP;

GRANT SELECT, INSERT ON TABLE pg_temp.step004f_results TO authenticated;

-- Identity A creates and reads only its own disposable row.
SET LOCAL ROLE authenticated;
SELECT set_config(
  'request.jwt.claim.sub',
  '667ad4ce-312b-4f78-a3fa-366c8b669477',
  TRUE
);
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"667ad4ce-312b-4f78-a3fa-366c8b669477","role":"authenticated"}',
  TRUE
);

INSERT INTO public.learner_item_progress (
  user_id,
  exam_id,
  progress_type,
  content_id,
  progress_data,
  progress_version
) VALUES (
  '667ad4ce-312b-4f78-a3fa-366c8b669477',
  'terraform-associate-004',
  'study_item',
  '__step004f_identity_a_20260820__',
  '{"completed":true}'::JSONB,
  1
);

INSERT INTO pg_temp.step004f_results
SELECT
  1,
  'Identity A reads its own row',
  COUNT(*) = 1,
  COUNT(*)::INTEGER
FROM public.learner_item_progress
WHERE content_id = '__step004f_identity_a_20260820__';

RESET ROLE;

-- Identity B creates and reads only its own disposable row.
SET LOCAL ROLE authenticated;
SELECT set_config(
  'request.jwt.claim.sub',
  '0a70410c-912f-4a67-a0ad-a8543b6bf6d4',
  TRUE
);
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"0a70410c-912f-4a67-a0ad-a8543b6bf6d4","role":"authenticated"}',
  TRUE
);

INSERT INTO public.learner_item_progress (
  user_id,
  exam_id,
  progress_type,
  content_id,
  progress_data,
  progress_version
) VALUES (
  '0a70410c-912f-4a67-a0ad-a8543b6bf6d4',
  'terraform-associate-004',
  'study_item',
  '__step004f_identity_b_20260820__',
  '{"completed":true}'::JSONB,
  1
);

INSERT INTO pg_temp.step004f_results
SELECT
  2,
  'Identity B reads its own row',
  COUNT(*) = 1,
  COUNT(*)::INTEGER
FROM public.learner_item_progress
WHERE content_id = '__step004f_identity_b_20260820__';

INSERT INTO pg_temp.step004f_results
SELECT
  3,
  'Identity B cannot read Identity A row',
  COUNT(*) = 0,
  COUNT(*)::INTEGER
FROM public.learner_item_progress
WHERE user_id = '667ad4ce-312b-4f78-a3fa-366c8b669477'
  AND content_id = '__step004f_identity_a_20260820__';

WITH changed AS (
  UPDATE public.learner_item_progress
  SET progress_data = '{"completed":false}'::JSONB
  WHERE user_id = '667ad4ce-312b-4f78-a3fa-366c8b669477'
    AND content_id = '__step004f_identity_a_20260820__'
  RETURNING 1
)
INSERT INTO pg_temp.step004f_results
SELECT
  4,
  'Identity B cannot update Identity A row',
  COUNT(*) = 0,
  COUNT(*)::INTEGER
FROM changed;

WITH changed AS (
  UPDATE public.learner_item_progress
  SET progress_data = '{"completed":false}'::JSONB
  WHERE content_id = '__step004f_identity_b_20260820__'
  RETURNING 1
)
INSERT INTO pg_temp.step004f_results
SELECT
  5,
  'Identity B updates its own row',
  COUNT(*) = 1,
  COUNT(*)::INTEGER
FROM changed;

RESET ROLE;

-- Identity A receives the same isolation in the opposite direction.
SET LOCAL ROLE authenticated;
SELECT set_config(
  'request.jwt.claim.sub',
  '667ad4ce-312b-4f78-a3fa-366c8b669477',
  TRUE
);
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"667ad4ce-312b-4f78-a3fa-366c8b669477","role":"authenticated"}',
  TRUE
);

INSERT INTO pg_temp.step004f_results
SELECT
  6,
  'Identity A cannot read Identity B row',
  COUNT(*) = 0,
  COUNT(*)::INTEGER
FROM public.learner_item_progress
WHERE user_id = '0a70410c-912f-4a67-a0ad-a8543b6bf6d4'
  AND content_id = '__step004f_identity_b_20260820__';

WITH changed AS (
  UPDATE public.learner_item_progress
  SET progress_data = '{"completed":true}'::JSONB
  WHERE user_id = '0a70410c-912f-4a67-a0ad-a8543b6bf6d4'
    AND content_id = '__step004f_identity_b_20260820__'
  RETURNING 1
)
INSERT INTO pg_temp.step004f_results
SELECT
  7,
  'Identity A cannot update Identity B row',
  COUNT(*) = 0,
  COUNT(*)::INTEGER
FROM changed;

WITH changed AS (
  UPDATE public.learner_item_progress
  SET progress_data = '{"completed":false}'::JSONB
  WHERE content_id = '__step004f_identity_a_20260820__'
  RETURNING 1
)
INSERT INTO pg_temp.step004f_results
SELECT
  8,
  'Identity A updates its own row',
  COUNT(*) = 1,
  COUNT(*)::INTEGER
FROM changed;

RESET ROLE;

DO $$
DECLARE
  failed_tests TEXT;
BEGIN
  SELECT string_agg(test_name, '; ' ORDER BY test_order)
  INTO failed_tests
  FROM pg_temp.step004f_results
  WHERE passed IS NOT TRUE;

  IF failed_tests IS NOT NULL THEN
    RAISE EXCEPTION 'Step 004F RLS verification failed: %', failed_tests;
  END IF;

  IF (
    SELECT progress_data <> '{"completed":false}'::JSONB
    FROM public.learner_item_progress
    WHERE user_id = '667ad4ce-312b-4f78-a3fa-366c8b669477'
      AND content_id = '__step004f_identity_a_20260820__'
  ) THEN
    RAISE EXCEPTION 'Step 004F failed: Identity A own update was not preserved.';
  END IF;

  IF (
    SELECT progress_data <> '{"completed":false}'::JSONB
    FROM public.learner_item_progress
    WHERE user_id = '0a70410c-912f-4a67-a0ad-a8543b6bf6d4'
      AND content_id = '__step004f_identity_b_20260820__'
  ) THEN
    RAISE EXCEPTION 'Step 004F failed: Identity B own update was not preserved.';
  END IF;
END;
$$;

SELECT test_order, test_name, passed, observed_rows
FROM pg_temp.step004f_results
ORDER BY test_order;

ROLLBACK;

SELECT COUNT(*) = 0 AS no_step004f_rows_remain
FROM public.learner_item_progress
WHERE content_id IN (
  '__step004f_identity_a_20260820__',
  '__step004f_identity_b_20260820__'
);
