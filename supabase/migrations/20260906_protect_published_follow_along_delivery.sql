-- LATT Step 007E2: protect published Follow Along learner delivery.
--
-- This migration contains no Follow Along payload. It copies the current
-- approved runtime rows inside the database, keeps the existing publication
-- tables authoritative, and atomically mirrors future publications.

BEGIN;

ALTER TABLE public.follow_along_publishable_programmes
  ADD COLUMN exam_id TEXT,
  ADD COLUMN learner_sort_order INTEGER,
  ADD COLUMN preview_order SMALLINT;

CREATE OR REPLACE FUNCTION public.follow_along_runtime_exam_id(
  p_runtime JSONB,
  p_allow_legacy_inference BOOLEAN DEFAULT FALSE
)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  supplied_exam TEXT;
  programme_id TEXT;
  category_name TEXT;
BEGIN
  IF jsonb_typeof(p_runtime) IS DISTINCT FROM 'object' THEN
    RETURN NULL;
  END IF;

  supplied_exam := lower(btrim(COALESCE(
    NULLIF(p_runtime #>> '{programme,examId}', ''),
    NULLIF(p_runtime #>> '{programme,examCode}', ''),
    NULLIF(p_runtime #>> '{tasks,0,examId}', ''),
    NULLIF(p_runtime #>> '{tasks,0,examCode}', ''),
    ''
  )));

  IF supplied_exam IN ('aws-saa-c03', 'aws saa-c03', 'saa-c03') THEN
    RETURN 'aws-saa-c03';
  ELSIF supplied_exam IN (
    'terraform-associate-004',
    'terraform 004',
    'terraform associate 004'
  ) THEN
    RETURN 'terraform-associate-004';
  ELSIF supplied_exam IN (
    'comptia-sec-plus',
    'comptia security+',
    'comptia security+ sy0-701',
    'sy0-701'
  ) THEN
    RETURN 'comptia-sec-plus';
  ELSIF supplied_exam <> '' THEN
    RETURN NULL;
  END IF;

  IF p_allow_legacy_inference IS DISTINCT FROM TRUE THEN
    RETURN NULL;
  END IF;

  programme_id := lower(btrim(COALESCE(
    p_runtime #>> '{programme,programmeId}',
    p_runtime #>> '{programme,pathId}',
    ''
  )));
  category_name := lower(btrim(COALESCE(
    p_runtime #>> '{programme,category}',
    ''
  )));

  IF programme_id = 'cloudformation-terraform-learning-path' THEN
    RETURN 'aws-saa-c03';
  ELSIF programme_id LIKE 'terraform-%'
     OR programme_id LIKE 'hcp-terraform-%'
     OR category_name LIKE '%terraform%' THEN
    RETURN 'terraform-associate-004';
  END IF;

  -- Historical published programmes predate exact exam ownership and were all
  -- created for the AWS SAA-C03 workspace unless identified above.
  RETURN 'aws-saa-c03';
END;
$$;

REVOKE ALL ON FUNCTION public.follow_along_runtime_exam_id(JSONB, BOOLEAN)
  FROM PUBLIC, anon, authenticated;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.learner_content_items
    WHERE content_type = 'follow_along'
  ) THEN
    RAISE EXCEPTION
      '20260906 stopped: protected Follow Along rows already exist.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.follow_along_published_programmes published
    LEFT JOIN public.follow_along_publishable_programmes allowed
      ON allowed.programme_id = published.programme_id
    WHERE published.publication_status = 'published'
      AND allowed.programme_id IS NULL
  ) THEN
    RAISE EXCEPTION
      '20260906 stopped: a published programme is missing its server allow-list row.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.follow_along_published_programmes published
    WHERE published.publication_status = 'published'
      AND (
        jsonb_typeof(published.runtime_content) IS DISTINCT FROM 'object'
        OR jsonb_typeof(published.runtime_content -> 'programme') IS DISTINCT FROM 'object'
        OR jsonb_typeof(published.runtime_content -> 'phases') IS DISTINCT FROM 'array'
        OR jsonb_typeof(published.runtime_content -> 'tasks') IS DISTINCT FROM 'array'
        OR btrim(COALESCE(published.runtime_content #>> '{programme,programmeId}', ''))
           IS DISTINCT FROM published.programme_id
        OR btrim(COALESCE(published.runtime_content #>> '{programme,pathId}', ''))
           IS DISTINCT FROM published.programme_id
        OR btrim(COALESCE(published.runtime_content #>> '{programme,displayName}', '')) = ''
        OR public.follow_along_runtime_exam_id(published.runtime_content, TRUE) IS NULL
      )
  ) THEN
    RAISE EXCEPTION
      '20260906 stopped: a published runtime package has invalid identity or structure.';
  END IF;
END;
$$;

CREATE TEMP TABLE step007e2_catalogue ON COMMIT DROP AS
WITH mapped AS (
  SELECT
    published.programme_id,
    public.follow_along_runtime_exam_id(published.runtime_content, TRUE) AS exam_id,
    published.published_at,
    CASE
      WHEN published.programme_id = 'rds-learning-path' THEN 0
      WHEN published.programme_id = 'dynamodb-learning-path' THEN 1
      WHEN published.programme_id = 'lambda-learning-path' THEN 2
      WHEN published.programme_id = 'api-gateway-learning-path' THEN 3
      WHEN published.programme_id = 'terraform-configuration-foundations-learning-path' THEN 0
      WHEN published.programme_id = 'terraform-beginner-learning-path' THEN 1
      WHEN published.programme_id = 'terraform-state-backend-learning-path' THEN 2
      ELSE 100
    END AS established_priority
  FROM public.follow_along_published_programmes published
  WHERE published.publication_status = 'published'
), ranked AS (
  SELECT
    programme_id,
    exam_id,
    row_number() OVER (
      PARTITION BY exam_id
      ORDER BY established_priority, published_at, programme_id
    ) - 1 AS learner_sort_order
  FROM mapped
)
SELECT
  programme_id,
  exam_id,
  learner_sort_order::INTEGER,
  CASE
    WHEN learner_sort_order < 2 THEN learner_sort_order + 1
    ELSE NULL
  END::SMALLINT AS preview_order
FROM ranked;

UPDATE public.follow_along_publishable_programmes allowed
SET exam_id = catalogue.exam_id,
    learner_sort_order = catalogue.learner_sort_order,
    preview_order = catalogue.preview_order,
    updated_at = clock_timestamp()
FROM step007e2_catalogue catalogue
WHERE allowed.programme_id = catalogue.programme_id;

ALTER TABLE public.follow_along_publishable_programmes
  ADD CONSTRAINT follow_along_publishable_programmes_exam_check
    CHECK (
      exam_id IS NULL
      OR exam_id IN (
        'aws-saa-c03',
        'terraform-associate-004',
        'comptia-sec-plus'
      )
    ),
  ADD CONSTRAINT follow_along_publishable_programmes_sort_check
    CHECK (learner_sort_order IS NULL OR learner_sort_order >= 0),
  ADD CONSTRAINT follow_along_publishable_programmes_preview_check
    CHECK (preview_order IS NULL OR preview_order BETWEEN 1 AND 2),
  ADD CONSTRAINT follow_along_publishable_programmes_mapping_check
    CHECK (
      (exam_id IS NULL AND learner_sort_order IS NULL AND preview_order IS NULL)
      OR (exam_id IS NOT NULL AND learner_sort_order IS NOT NULL)
    );

CREATE UNIQUE INDEX follow_along_publishable_programmes_exam_sort_key
  ON public.follow_along_publishable_programmes (exam_id, learner_sort_order)
  WHERE exam_id IS NOT NULL;

CREATE UNIQUE INDEX follow_along_publishable_programmes_exam_preview_key
  ON public.follow_along_publishable_programmes (exam_id, preview_order)
  WHERE preview_order IS NOT NULL;

CREATE TEMP TABLE step007e2_progress_guard ON COMMIT DROP AS
SELECT
  (SELECT COUNT(*) FROM public.user_learning_path_progress) AS progress_rows,
  (SELECT COUNT(*) FROM public.user_learning_path_resources) AS resource_rows;

INSERT INTO public.learner_content_items (
  content_id,
  exam_id,
  content_type,
  parent_content_id,
  title,
  sort_order,
  preview_order,
  publication_status,
  content_version,
  content_hash,
  payload,
  published_at
)
SELECT
  'follow-along:' || published.programme_id,
  allowed.exam_id,
  'follow_along',
  NULL,
  btrim(published.runtime_content #>> '{programme,displayName}'),
  allowed.learner_sort_order,
  allowed.preview_order,
  published.publication_status,
  published.source_revision,
  public.follow_along_jsonb_sha256(published.runtime_content),
  published.runtime_content,
  published.published_at
FROM public.follow_along_published_programmes published
JOIN public.follow_along_publishable_programmes allowed
  ON allowed.programme_id = published.programme_id
WHERE published.publication_status = 'published';

CREATE OR REPLACE FUNCTION public.prepare_published_follow_along_delivery()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  allowed public.follow_along_publishable_programmes%ROWTYPE;
  supplied_exam_id TEXT;
  next_sort_order INTEGER;
BEGIN
  SELECT * INTO allowed
  FROM public.follow_along_publishable_programmes
  WHERE programme_id = NEW.programme_id
    AND enabled = TRUE
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION
      'Protected Follow Along delivery requires an enabled server catalogue row.'
      USING ERRCODE = '23514';
  END IF;

  supplied_exam_id := public.follow_along_runtime_exam_id(NEW.runtime_content, FALSE);

  IF allowed.exam_id IS NULL THEN
    IF supplied_exam_id IS NULL THEN
      RAISE EXCEPTION
        'A new Follow Along must declare one supported exact exam ID.'
        USING ERRCODE = '23514';
    END IF;

    PERFORM pg_advisory_xact_lock(hashtext('follow-along-order:' || supplied_exam_id));
    SELECT COALESCE(MAX(learner_sort_order) + 1, 0)
    INTO next_sort_order
    FROM public.follow_along_publishable_programmes
    WHERE exam_id = supplied_exam_id;

    UPDATE public.follow_along_publishable_programmes
    SET exam_id = supplied_exam_id,
        learner_sort_order = next_sort_order,
        preview_order = NULL,
        updated_at = clock_timestamp()
    WHERE programme_id = NEW.programme_id
    RETURNING * INTO allowed;
  ELSIF supplied_exam_id IS NOT NULL
     AND supplied_exam_id IS DISTINCT FROM allowed.exam_id THEN
    RAISE EXCEPTION
      'The approved Follow Along exam ID does not match its server catalogue.'
      USING ERRCODE = '23514';
  END IF;

  IF allowed.learner_sort_order IS NULL THEN
    RAISE EXCEPTION
      'Protected Follow Along delivery requires a stable learner sort order.'
      USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_published_follow_along_delivery()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  allowed public.follow_along_publishable_programmes%ROWTYPE;
  delivery_title TEXT;
BEGIN
  SELECT * INTO allowed
  FROM public.follow_along_publishable_programmes
  WHERE programme_id = NEW.programme_id;

  IF NOT FOUND OR allowed.exam_id IS NULL OR allowed.learner_sort_order IS NULL THEN
    RAISE EXCEPTION
      'Protected Follow Along delivery catalogue is incomplete.'
      USING ERRCODE = '23514';
  END IF;

  delivery_title := btrim(COALESCE(
    NEW.runtime_content #>> '{programme,displayName}',
    ''
  ));
  IF delivery_title = '' THEN
    RAISE EXCEPTION
      'Protected Follow Along delivery requires a display name.'
      USING ERRCODE = '23514';
  END IF;

  INSERT INTO public.learner_content_items (
    content_id,
    exam_id,
    content_type,
    parent_content_id,
    title,
    sort_order,
    preview_order,
    publication_status,
    content_version,
    content_hash,
    payload,
    published_at,
    updated_at
  ) VALUES (
    'follow-along:' || NEW.programme_id,
    allowed.exam_id,
    'follow_along',
    NULL,
    delivery_title,
    allowed.learner_sort_order,
    allowed.preview_order,
    NEW.publication_status,
    NEW.source_revision,
    public.follow_along_jsonb_sha256(NEW.runtime_content),
    NEW.runtime_content,
    NEW.published_at,
    clock_timestamp()
  )
  ON CONFLICT (content_id) DO UPDATE
  SET exam_id = EXCLUDED.exam_id,
      content_type = EXCLUDED.content_type,
      parent_content_id = EXCLUDED.parent_content_id,
      title = EXCLUDED.title,
      sort_order = EXCLUDED.sort_order,
      preview_order = EXCLUDED.preview_order,
      publication_status = EXCLUDED.publication_status,
      content_version = EXCLUDED.content_version,
      content_hash = EXCLUDED.content_hash,
      payload = EXCLUDED.payload,
      published_at = EXCLUDED.published_at,
      updated_at = EXCLUDED.updated_at;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.prepare_published_follow_along_delivery()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sync_published_follow_along_delivery()
  FROM PUBLIC, anon, authenticated;

CREATE TRIGGER follow_along_prepare_protected_delivery
BEFORE INSERT OR UPDATE OF
  programme_id,
  runtime_content,
  publication_status,
  source_revision
ON public.follow_along_published_programmes
FOR EACH ROW
EXECUTE FUNCTION public.prepare_published_follow_along_delivery();

CREATE TRIGGER follow_along_sync_protected_delivery
AFTER INSERT OR UPDATE OF
  programme_id,
  runtime_content,
  publication_status,
  source_revision,
  content_hash,
  published_at
ON public.follow_along_published_programmes
FOR EACH ROW
EXECUTE FUNCTION public.sync_published_follow_along_delivery();

DO $$
DECLARE
  published_count INTEGER;
  protected_count INTEGER;
  progress_before BIGINT;
  resources_before BIGINT;
BEGIN
  SELECT COUNT(*) INTO published_count
  FROM public.follow_along_published_programmes
  WHERE publication_status = 'published';

  SELECT COUNT(*) INTO protected_count
  FROM public.learner_content_items
  WHERE content_type = 'follow_along';

  IF protected_count <> published_count THEN
    RAISE EXCEPTION
      '20260906 stopped: expected % protected Follow Alongs but found %.',
      published_count,
      protected_count;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.follow_along_published_programmes published
    JOIN public.follow_along_publishable_programmes allowed
      ON allowed.programme_id = published.programme_id
    LEFT JOIN public.learner_content_items protected
      ON protected.content_id = 'follow-along:' || published.programme_id
    WHERE published.publication_status = 'published'
      AND (
        protected.content_id IS NULL
        OR protected.exam_id IS DISTINCT FROM allowed.exam_id
        OR protected.sort_order IS DISTINCT FROM allowed.learner_sort_order
        OR protected.preview_order IS DISTINCT FROM allowed.preview_order
        OR protected.content_version IS DISTINCT FROM published.source_revision
        OR protected.content_hash IS DISTINCT FROM
           public.follow_along_jsonb_sha256(published.runtime_content)
        OR protected.payload IS DISTINCT FROM published.runtime_content
      )
  ) THEN
    RAISE EXCEPTION
      '20260906 stopped: protected Follow Along parity verification failed.';
  END IF;

  IF EXISTS (
    SELECT exam_id
    FROM public.learner_content_items
    WHERE content_type = 'follow_along'
      AND preview_order IS NOT NULL
    GROUP BY exam_id
    HAVING COUNT(*) > 2
       OR MIN(preview_order) <> 1
       OR MAX(preview_order) <> COUNT(*)
  ) THEN
    RAISE EXCEPTION
      '20260906 stopped: deterministic Follow Along previews are invalid.';
  END IF;

  SELECT progress_rows, resource_rows
  INTO progress_before, resources_before
  FROM step007e2_progress_guard;

  IF progress_before IS DISTINCT FROM
       (SELECT COUNT(*) FROM public.user_learning_path_progress)
     OR resources_before IS DISTINCT FROM
       (SELECT COUNT(*) FROM public.user_learning_path_resources) THEN
    RAISE EXCEPTION
      '20260906 stopped: learner Follow Along progress changed unexpectedly.';
  END IF;
END;
$$;

COMMENT ON FUNCTION public.follow_along_runtime_exam_id(JSONB, BOOLEAN)
IS 'Normalises an explicit supported Follow Along exam ID; legacy inference is available only for the guarded initial backfill.';

COMMENT ON FUNCTION public.sync_published_follow_along_delivery()
IS 'Atomically mirrors the approved current Follow Along runtime into entitlement-aware learner delivery.';

COMMIT;
