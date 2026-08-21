-- LATT Step 007C: protected learner-content delivery foundation.
--
-- Scope:
-- - Create the empty learner_content_items delivery table.
-- - Protect published payloads with deterministic preview, exact-exam
--   entitlement and trusted non-conflicting staff SELECT policies.
-- - Give browser roles no create, update or delete privilege.
-- - Embed no paid content; the separately generated private seed is ignored by
--   Git and requires a later explicit import approval.

BEGIN;

DO $$
BEGIN
  IF to_regclass('public.learner_content_items') IS NOT NULL THEN
    RAISE EXCEPTION
      '20260905 stopped: public.learner_content_items already exists.';
  END IF;
END;
$$;

CREATE TABLE public.learner_content_items (
  content_id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  parent_content_id TEXT,
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  preview_order SMALLINT,
  publication_status TEXT NOT NULL DEFAULT 'draft',
  content_version INTEGER NOT NULL,
  content_hash TEXT NOT NULL,
  payload JSONB NOT NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

  CONSTRAINT learner_content_items_exam_id_check
    CHECK (exam_id IN (
      'aws-saa-c03',
      'terraform-associate-004',
      'comptia-sec-plus'
    )),

  CONSTRAINT learner_content_items_type_check
    CHECK (content_type IN (
      'checklist_item',
      'knowledge_guide',
      'follow_along',
      'troubleshooting_challenge'
    )),

  CONSTRAINT learner_content_items_parent_check
    CHECK (parent_content_id IS NULL OR btrim(parent_content_id) <> ''),

  CONSTRAINT learner_content_items_title_check
    CHECK (btrim(title) <> ''),

  CONSTRAINT learner_content_items_sort_order_check
    CHECK (sort_order >= 0),

  CONSTRAINT learner_content_items_preview_order_check
    CHECK (
      preview_order IS NULL
      OR preview_order BETWEEN 1 AND CASE content_type
        WHEN 'checklist_item' THEN 10
        WHEN 'knowledge_guide' THEN 10
        WHEN 'follow_along' THEN 2
        WHEN 'troubleshooting_challenge' THEN 2
      END
    ),

  CONSTRAINT learner_content_items_publication_status_check
    CHECK (publication_status IN ('draft', 'published', 'withdrawn')),

  CONSTRAINT learner_content_items_publication_time_check
    CHECK (
      (publication_status = 'published' AND published_at IS NOT NULL)
      OR (publication_status <> 'published')
    ),

  CONSTRAINT learner_content_items_version_check
    CHECK (content_version > 0),

  CONSTRAINT learner_content_items_hash_check
    CHECK (content_hash ~ '^[a-f0-9]{64}$'),

  CONSTRAINT learner_content_items_payload_check
    CHECK (jsonb_typeof(payload) = 'object'),

  CONSTRAINT learner_content_items_created_updated_check
    CHECK (updated_at >= created_at),

  CONSTRAINT learner_content_items_exam_type_id_key
    UNIQUE (exam_id, content_type, content_id),

  CONSTRAINT learner_content_items_preview_key
    UNIQUE (exam_id, content_type, preview_order)
);

COMMENT ON TABLE public.learner_content_items IS
  'Protected published learner payloads. Browser clients receive only deterministic previews, their exact actively entitled exam, or trusted staff content.';

COMMENT ON COLUMN public.learner_content_items.preview_order IS
  'Null means paid/staff only. A positive value marks intentionally public deterministic preview content within the type-specific limit.';

COMMENT ON COLUMN public.learner_content_items.content_hash IS
  'SHA-256 of the canonical protected payload, verified by the protected local seed builder before import.';

CREATE INDEX learner_content_items_exam_type_order_idx
  ON public.learner_content_items (
    exam_id,
    content_type,
    publication_status,
    sort_order,
    content_id
  );

ALTER TABLE public.learner_content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Preview learner content"
  ON public.learner_content_items
  FOR SELECT
  TO anon, authenticated
  USING (
    publication_status = 'published'
    AND preview_order IS NOT NULL
  );

CREATE POLICY "Entitled exact-exam learner content"
  ON public.learner_content_items
  FOR SELECT
  TO authenticated
  USING (
    publication_status = 'published'
    AND EXISTS (
      SELECT 1
      FROM public.exam_entitlements entitlement
      WHERE entitlement.user_id = auth.uid()
        AND entitlement.exam_id = learner_content_items.exam_id
        AND entitlement.status = 'active'
        AND entitlement.starts_at <= clock_timestamp()
        AND entitlement.expires_at > clock_timestamp()
    )
  );

CREATE POLICY "Trusted role learner content"
  ON public.learner_content_items
  FOR SELECT
  TO authenticated
  USING (
    publication_status = 'published'
    AND (
      (
        lower(COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'admin'
        OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::JSONB) ? 'admin'
      )
      OR (
        (
          lower(COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'author'
          OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::JSONB) ? 'author'
        )
        AND NOT (
          lower(COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'approver'
          OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::JSONB) ? 'approver'
        )
      )
      OR (
        (
          lower(COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'approver'
          OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::JSONB) ? 'approver'
        )
        AND NOT (
          lower(COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'author'
          OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::JSONB) ? 'author'
        )
      )
    )
  );

REVOKE ALL PRIVILEGES
  ON TABLE public.learner_content_items
  FROM PUBLIC, anon, authenticated;

GRANT SELECT
  ON TABLE public.learner_content_items
  TO anon, authenticated;

DO $$
DECLARE
  policy_count INTEGER;
  permission_name TEXT;
  rls_enabled BOOLEAN;
BEGIN
  IF (SELECT COUNT(*) FROM public.learner_content_items) <> 0 THEN
    RAISE EXCEPTION
      '20260905 stopped: learner_content_items was not created empty.';
  END IF;

  SELECT relrowsecurity INTO rls_enabled
  FROM pg_class
  WHERE oid = 'public.learner_content_items'::regclass;

  IF rls_enabled IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION '20260905 stopped: row level security is not enabled.';
  END IF;

  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'learner_content_items'
    AND cmd = 'SELECT'
    AND policyname IN (
      'Preview learner content',
      'Entitled exact-exam learner content',
      'Trusted role learner content'
    );

  IF policy_count <> 3 THEN
    RAISE EXCEPTION
      '20260905 stopped: the three protected SELECT policies are incomplete.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'learner_content_items'
      AND cmd <> 'SELECT'
  ) THEN
    RAISE EXCEPTION
      '20260905 stopped: a browser write policy exists unexpectedly.';
  END IF;

  FOREACH permission_name IN ARRAY ARRAY[
    'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER'
  ]
  LOOP
    IF has_table_privilege(
      'anon',
      'public.learner_content_items',
      permission_name
    ) OR has_table_privilege(
      'authenticated',
      'public.learner_content_items',
      permission_name
    ) THEN
      RAISE EXCEPTION
        '20260905 stopped: a browser role has unexpected % privilege.',
        permission_name;
    END IF;
  END LOOP;

  IF NOT has_table_privilege(
    'anon',
    'public.learner_content_items',
    'SELECT'
  ) OR NOT has_table_privilege(
    'authenticated',
    'public.learner_content_items',
    'SELECT'
  ) THEN
    RAISE EXCEPTION
      '20260905 stopped: browser SELECT privileges are incomplete.';
  END IF;
END;
$$;

COMMIT;
