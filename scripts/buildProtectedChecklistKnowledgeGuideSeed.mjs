import { createHash } from 'node:crypto';
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { DEFAULT_EXAMS } from '../src/data/examData.js';
import {
  TERRAFORM_KNOWLEDGE_GUIDES,
  TERRAFORM_KNOWLEDGE_GUIDE_ORDER
} from '../src/data/terraformKnowledgeGuide/index.js';

export const PRIVATE_CHECKLIST_GUIDE_SEED_DIRECTORY = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../docs/user-access-and-payments/private-content-seeds/checklists-knowledge-guides'
);

export const CHECKLIST_DELIVERY_PREFIX = 'checklist-item';
export const GUIDE_DELIVERY_PREFIX = 'knowledge-guide';

const EXPECTED_CHECKLIST_COUNTS = Object.freeze({
  'aws-saa-c03': 1547,
  'terraform-associate-004': 37,
  'comptia-sec-plus': 8
});

const EXPECTED_GUIDE_COUNTS = Object.freeze({
  'aws-saa-c03': 1547,
  'terraform-associate-004': 37,
  'comptia-sec-plus': 0
});

export function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function sha256(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

const cleanText = value => typeof value === 'string' ? value.trim() : '';

export function checklistDeliveryId(examId, itemId) {
  return `${CHECKLIST_DELIVERY_PREFIX}:${examId}:${itemId}`;
}

export function knowledgeGuideDeliveryId(examId, guideId) {
  return `${GUIDE_DELIVERY_PREFIX}:${examId}:${guideId}`;
}

async function loadAwsKnowledgeGuides() {
  const guideRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/awsKnowledgeGuide');
  const paths = (await readdir(guideRoot, { recursive: true }))
    .filter(path => path.endsWith('.js') && !path.endsWith('createAwsKnowledgeGuide.js'))
    .sort((left, right) => left.localeCompare(right));
  const guides = [];
  for (const path of paths) {
    const moduleUrl = pathToFileURL(resolve(guideRoot, path)).href;
    const guide = (await import(moduleUrl)).default;
    if (guide) guides.push(guide);
  }
  return guides;
}

function validateExamChecklist(exam) {
  if (!cleanText(exam?.id) || !Array.isArray(exam?.topics)) {
    throw new Error('An exam has no stable ID or checklist topics.');
  }
  const itemIds = exam.topics.flatMap(topic => (
    Array.isArray(topic?.items) ? topic.items.map(item => cleanText(item?.id)) : []
  ));
  if (itemIds.some(itemId => !itemId) || new Set(itemIds).size !== itemIds.length) {
    throw new Error(`${exam.id} has missing or duplicate checklist item IDs.`);
  }
  if (itemIds.length !== EXPECTED_CHECKLIST_COUNTS[exam.id]) {
    throw new Error(`${exam.id} must preserve exactly ${EXPECTED_CHECKLIST_COUNTS[exam.id]} checklist items.`);
  }
}

function validateKnowledgeGuides(examId, guides, checklistIds) {
  const guideIds = guides.map(guide => cleanText(guide?.id));
  if (guideIds.some(guideId => !guideId) || new Set(guideIds).size !== guideIds.length) {
    throw new Error(`${examId} has missing or duplicate Knowledge Guide IDs.`);
  }
  if (guides.length !== EXPECTED_GUIDE_COUNTS[examId]) {
    throw new Error(`${examId} must preserve exactly ${EXPECTED_GUIDE_COUNTS[examId]} Knowledge Guides.`);
  }
  if (guideIds.some(guideId => !checklistIds.has(guideId))) {
    throw new Error(`${examId} has a Knowledge Guide without its matching checklist item.`);
  }
  if (guides.some(guide => !cleanText(guide?.title))) {
    throw new Error(`${examId} has a Knowledge Guide without a title.`);
  }
}

export async function loadExistingChecklistKnowledgeGuideSource() {
  const awsGuides = await loadAwsKnowledgeGuides();
  const terraformGuides = TERRAFORM_KNOWLEDGE_GUIDE_ORDER.map(id => TERRAFORM_KNOWLEDGE_GUIDES[id]);
  return Object.freeze({
    exams: DEFAULT_EXAMS,
    guidesByExam: Object.freeze({
      'aws-saa-c03': Object.freeze(awsGuides),
      'terraform-associate-004': Object.freeze(terraformGuides),
      'comptia-sec-plus': Object.freeze([])
    })
  });
}

export function buildProtectedChecklistKnowledgeGuideSeed({ exams, guidesByExam }) {
  const checklistRows = [];
  const guideRows = [];

  for (const exam of exams) {
    if (!(exam.id in EXPECTED_CHECKLIST_COUNTS)) {
      throw new Error(`Unsupported exam ${exam.id} was included in the checklist source.`);
    }
    validateExamChecklist(exam);
    const guides = [...(guidesByExam[exam.id] || [])];
    const guideMap = new Map(guides.map(guide => [guide.id, guide]));
    const checklistIds = new Set(exam.topics.flatMap(topic => topic.items.map(item => item.id)));
    validateKnowledgeGuides(exam.id, guides, checklistIds);

    let sortOrder = 0;
    for (const [topicIndex, topic] of exam.topics.entries()) {
      for (const [itemIndex, item] of topic.items.entries()) {
        const stableId = item.id;
        const checklistPayload = Object.freeze({
          id: stableId,
          examId: exam.id,
          topic: Object.freeze({
            id: topic.id,
            code: topic.code,
            title: topic.title,
            weight: topic.weight,
            description: topic.description
          }),
          topicIndex,
          itemIndex,
          order: sortOrder,
          checklistItem: item
        });
        const checklistHash = sha256(stableStringify(checklistPayload));
        const previewOrder = sortOrder < 10 ? sortOrder + 1 : null;
        const checklistRowId = checklistDeliveryId(exam.id, stableId);
        checklistRows.push(Object.freeze({
          content_id: checklistRowId,
          exam_id: exam.id,
          content_type: 'checklist_item',
          parent_content_id: null,
          title: item.text,
          sort_order: sortOrder,
          preview_order: previewOrder,
          publication_status: 'published',
          content_version: 1,
          content_hash: checklistHash,
          payload: checklistPayload
        }));

        const guide = guideMap.get(stableId);
        if (guide) {
          const guidePayload = Object.freeze({
            id: stableId,
            examId: exam.id,
            checklistItemId: stableId,
            order: sortOrder,
            knowledgeGuide: guide
          });
          guideRows.push(Object.freeze({
            content_id: knowledgeGuideDeliveryId(exam.id, stableId),
            exam_id: exam.id,
            content_type: 'knowledge_guide',
            parent_content_id: checklistRowId,
            title: guide.title,
            sort_order: sortOrder,
            preview_order: previewOrder,
            publication_status: 'published',
            content_version: 1,
            content_hash: sha256(stableStringify(guidePayload)),
            payload: guidePayload
          }));
        }
        sortOrder += 1;
      }
    }

    const orderedGuideIds = guideRows
      .filter(row => row.exam_id === exam.id)
      .map(row => row.payload.id);
    const expectedGuideIds = exam.topics
      .flatMap(topic => topic.items)
      .map(item => item.id)
      .filter(itemId => guideMap.has(itemId));
    if (stableStringify(orderedGuideIds) !== stableStringify(expectedGuideIds)) {
      throw new Error(`${exam.id} Knowledge Guide order does not match its checklist order.`);
    }
  }

  const allRows = [...checklistRows, ...guideRows]
    .sort((left, right) => (
      left.exam_id.localeCompare(right.exam_id)
      || left.content_type.localeCompare(right.content_type)
      || left.sort_order - right.sort_order
      || left.content_id.localeCompare(right.content_id)
    ));
  if (new Set(allRows.map(row => row.content_id)).size !== allRows.length) {
    throw new Error('Checklist and Knowledge Guide delivery row IDs are not globally unique.');
  }

  const fingerprintFor = rows => sha256(rows
    .map(row => `${row.exam_id}:${row.sort_order}:${row.content_id}:${row.content_hash}`)
    .join('\n'));
  const countsByExam = Object.freeze(Object.fromEntries(exams.map(exam => [exam.id, Object.freeze({
    checklistItems: checklistRows.filter(row => row.exam_id === exam.id).length,
    knowledgeGuides: guideRows.filter(row => row.exam_id === exam.id).length,
    checklistPreviews: checklistRows.filter(row => row.exam_id === exam.id && row.preview_order !== null).length,
    knowledgeGuidePreviews: guideRows.filter(row => row.exam_id === exam.id && row.preview_order !== null).length
  })])));

  return Object.freeze({
    schemaVersion: '007D-1',
    counts: Object.freeze({
      total: allRows.length,
      checklistItems: checklistRows.length,
      knowledgeGuides: guideRows.length,
      byExam: countsByExam
    }),
    checklistFingerprint: fingerprintFor(checklistRows),
    knowledgeGuideFingerprint: fingerprintFor(guideRows),
    manifestFingerprint: fingerprintFor(allRows),
    rows: Object.freeze(allRows)
  });
}

const sqlText = value => `'${String(value).replaceAll("'", "''")}'`;

function sqlInsertValue(row) {
  return `  (
    ${sqlText(row.content_id)},
    ${sqlText(row.exam_id)},
    ${sqlText(row.content_type)},
    ${row.parent_content_id ? sqlText(row.parent_content_id) : 'NULL'},
    ${sqlText(row.title)},
    ${row.sort_order},
    ${row.preview_order ?? 'NULL'},
    ${sqlText(row.publication_status)},
    ${row.content_version},
    ${sqlText(row.content_hash)},
    ${sqlText(stableStringify(row.payload))}::JSONB,
    clock_timestamp()
  )`;
}

export function buildPrivateChecklistKnowledgeGuideSeedSql(seed) {
  const values = seed.rows.map(sqlInsertValue).join(',\n');

  const countChecks = Object.entries(seed.counts.byExam).map(([examId, counts]) => `
  IF (SELECT COUNT(*) FROM public.learner_content_items WHERE exam_id = ${sqlText(examId)} AND content_type = 'checklist_item') <> ${counts.checklistItems}
    OR (SELECT COUNT(*) FROM public.learner_content_items WHERE exam_id = ${sqlText(examId)} AND content_type = 'knowledge_guide') <> ${counts.knowledgeGuides} THEN
    RAISE EXCEPTION '007D seed stopped: ${examId} content counts did not match.';
  END IF;`).join('\n');
  const previewChecks = Object.entries(seed.counts.byExam).map(([examId, counts]) => `
  IF (SELECT COUNT(*) FROM public.learner_content_items WHERE exam_id = ${sqlText(examId)} AND content_type = 'checklist_item' AND preview_order IS NOT NULL) <> ${counts.checklistPreviews}
    OR (SELECT COUNT(*) FROM public.learner_content_items WHERE exam_id = ${sqlText(examId)} AND content_type = 'knowledge_guide' AND preview_order IS NOT NULL) <> ${counts.knowledgeGuidePreviews} THEN
    RAISE EXCEPTION '007D seed stopped: ${examId} deterministic preview counts did not match.';
  END IF;`).join('\n');

  return `-- PRIVATE STEP 007D CHECKLIST AND KNOWLEDGE GUIDE SEED
-- Generated from the existing local exam checklists and independently editable guides.
-- This file is inside an ignored local directory. Do not commit or publish it.
-- It has not been imported or deployed.

BEGIN;

SELECT set_config(
  'latt.step007d1_study_progress_before',
  (SELECT COUNT(*)::TEXT FROM public.learner_item_progress WHERE progress_type = 'study_item'),
  TRUE
);

DO $$
BEGIN
  IF to_regclass('public.learner_content_items') IS NULL THEN
    RAISE EXCEPTION '007D seed stopped: learner_content_items does not exist.';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.learner_content_items
    WHERE content_type IN ('checklist_item', 'knowledge_guide')
  ) THEN
    RAISE EXCEPTION '007D seed stopped: Checklist or Knowledge Guide content already exists.';
  END IF;
END;
$$;

INSERT INTO public.learner_content_items (
  content_id, exam_id, content_type, parent_content_id, title, sort_order,
  preview_order, publication_status, content_version, content_hash, payload, published_at
) VALUES
${values};

DO $$
DECLARE
  actual_manifest_fingerprint TEXT;
BEGIN
  IF (SELECT COUNT(*) FROM public.learner_content_items WHERE content_type = 'checklist_item') <> ${seed.counts.checklistItems}
    OR (SELECT COUNT(*) FROM public.learner_content_items WHERE content_type = 'knowledge_guide') <> ${seed.counts.knowledgeGuides} THEN
    RAISE EXCEPTION '007D seed stopped: total protected content counts did not match.';
  END IF;
${countChecks}
${previewChecks}

  IF EXISTS (
    SELECT checklist.exam_id, checklist.payload ->> 'id'
    FROM public.learner_content_items checklist
    LEFT JOIN public.learner_content_items guide
      ON guide.parent_content_id = checklist.content_id
      AND guide.content_type = 'knowledge_guide'
    WHERE checklist.content_type = 'checklist_item'
      AND checklist.exam_id IN ('aws-saa-c03', 'terraform-associate-004')
      AND (guide.content_id IS NULL OR guide.payload ->> 'id' <> checklist.payload ->> 'id')
  ) THEN
    RAISE EXCEPTION '007D seed stopped: a checklist-to-guide relationship did not match.';
  END IF;

  SELECT encode(
    extensions.digest(
      string_agg(
        exam_id || ':' || sort_order || ':' || content_id || ':' || content_hash,
        E'\\n' ORDER BY exam_id, content_type, sort_order, content_id
      ),
      'sha256'
    ),
    'hex'
  ) INTO actual_manifest_fingerprint
  FROM public.learner_content_items
  WHERE content_type IN ('checklist_item', 'knowledge_guide');

  IF actual_manifest_fingerprint <> ${sqlText(seed.manifestFingerprint)} THEN
    RAISE EXCEPTION '007D seed stopped: manifest fingerprint did not match.';
  END IF;

  IF (SELECT COUNT(*) FROM public.learner_item_progress WHERE progress_type = 'study_item')
    <> current_setting('latt.step007d1_study_progress_before')::BIGINT THEN
    RAISE EXCEPTION '007D seed stopped: learner study progress changed unexpectedly.';
  END IF;
END;
$$;

COMMIT;
`;
}

export function buildPrivateChecklistKnowledgeGuideSeedChunks(seed, maximumBytes = 350000) {
  const chunks = [];
  let currentRows = [];
  let currentBytes = 0;
  for (const row of seed.rows) {
    const value = sqlInsertValue(row);
    const valueBytes = Buffer.byteLength(value, 'utf8');
    if (currentRows.length && currentBytes + valueBytes > maximumBytes) {
      chunks.push(currentRows);
      currentRows = [];
      currentBytes = 0;
    }
    currentRows.push(row);
    currentBytes += valueBytes;
  }
  if (currentRows.length) chunks.push(currentRows);

  return Object.freeze(chunks.map((rows, index) => {
    const expectedRows = rows
      .map(row => `      (${sqlText(row.content_id)}, ${sqlText(row.content_hash)})`)
      .join(',\n');
    const values = rows.map(sqlInsertValue).join(',\n');
    const number = index + 1;
    return `-- PRIVATE STEP 007D1 IMPORT CHUNK ${number} OF ${chunks.length}
-- Exact manifest: ${seed.manifestFingerprint}
-- Safe to rerun: matching rows are retained; conflicting rows stop the chunk.

BEGIN;

SELECT set_config(
  'latt.step007d1_study_progress_before',
  (SELECT COUNT(*)::TEXT FROM public.learner_item_progress WHERE progress_type = 'study_item'),
  TRUE
);

DO $$
BEGIN
  IF to_regclass('public.learner_content_items') IS NULL THEN
    RAISE EXCEPTION '007D1 chunk ${number} stopped: learner_content_items does not exist.';
  END IF;
END;
$$;

INSERT INTO public.learner_content_items (
  content_id, exam_id, content_type, parent_content_id, title, sort_order,
  preview_order, publication_status, content_version, content_hash, payload, published_at
) VALUES
${values}
ON CONFLICT (content_id) DO NOTHING;

DO $$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM public.learner_content_items actual
    JOIN (VALUES
${expectedRows}
    ) expected(content_id, content_hash)
      ON actual.content_id = expected.content_id
      AND actual.content_hash = expected.content_hash
  ) <> ${rows.length} THEN
    RAISE EXCEPTION '007D1 chunk ${number} stopped: exact row fingerprints did not match.';
  END IF;
  IF (SELECT COUNT(*) FROM public.learner_item_progress WHERE progress_type = 'study_item')
    <> current_setting('latt.step007d1_study_progress_before')::BIGINT THEN
    RAISE EXCEPTION '007D1 chunk ${number} stopped: learner study progress changed unexpectedly.';
  END IF;
END;
$$;

COMMIT;

SELECT ${number} AS imported_chunk, ${chunks.length} AS total_chunks, ${rows.length} AS verified_rows;
`;
  }));
}

export function buildPrivateChecklistKnowledgeGuideVerificationSql(seed) {
  return `-- PRIVATE STEP 007D1 READ-ONLY FINAL VERIFICATION
WITH protected AS (
  SELECT * FROM public.learner_content_items
  WHERE content_type IN ('checklist_item', 'knowledge_guide')
), manifest AS (
  SELECT encode(
    extensions.digest(
      string_agg(
        exam_id || ':' || sort_order || ':' || content_id || ':' || content_hash,
        E'\\n' ORDER BY exam_id, content_type, sort_order, content_id
      ),
      'sha256'
    ),
    'hex'
  ) AS fingerprint
  FROM protected
)
SELECT
  (SELECT COUNT(*) FROM protected) AS total_rows,
  (SELECT COUNT(*) FROM protected WHERE content_type = 'checklist_item') AS checklist_items,
  (SELECT COUNT(*) FROM protected WHERE content_type = 'knowledge_guide') AS knowledge_guides,
  (SELECT COUNT(*) FROM protected WHERE preview_order IS NOT NULL) AS preview_rows,
  (SELECT COUNT(*) FROM protected guide
    JOIN protected checklist ON guide.parent_content_id = checklist.content_id
    WHERE guide.content_type = 'knowledge_guide'
      AND checklist.content_type = 'checklist_item'
      AND guide.payload ->> 'id' = checklist.payload ->> 'id') AS verified_guide_links,
  (SELECT fingerprint FROM manifest) AS manifest_fingerprint,
  (SELECT fingerprint FROM manifest) = ${sqlText(seed.manifestFingerprint)} AS fingerprint_matches;
`;
}

export async function writeProtectedChecklistKnowledgeGuideSeed(
  outputDirectory = PRIVATE_CHECKLIST_GUIDE_SEED_DIRECTORY
) {
  const source = await loadExistingChecklistKnowledgeGuideSource();
  const seed = buildProtectedChecklistKnowledgeGuideSeed(source);
  await mkdir(outputDirectory, { recursive: true });
  const jsonPath = resolve(outputDirectory, 'checklists-knowledge-guides-seed.json');
  const sqlPath = resolve(outputDirectory, 'checklists-knowledge-guides-seed.sql');
  const summaryPath = resolve(outputDirectory, 'checklists-knowledge-guides-seed-summary.txt');
  const chunkDirectory = resolve(outputDirectory, 'import-chunks');
  const chunks = buildPrivateChecklistKnowledgeGuideSeedChunks(seed);
  await rm(chunkDirectory, { recursive: true, force: true });
  await mkdir(chunkDirectory, { recursive: true });
  await writeFile(jsonPath, `${JSON.stringify(seed, null, 2)}\n`, 'utf8');
  await writeFile(sqlPath, buildPrivateChecklistKnowledgeGuideSeedSql(seed), 'utf8');
  for (const [index, chunk] of chunks.entries()) {
    await writeFile(resolve(chunkDirectory, `${String(index + 1).padStart(3, '0')}-import.sql`), chunk, 'utf8');
  }
  await writeFile(
    resolve(chunkDirectory, '999-verify.sql'),
    buildPrivateChecklistKnowledgeGuideVerificationSql(seed),
    'utf8'
  );
  await writeFile(summaryPath, [
    'LATT STEP 007D PRIVATE CHECKLIST AND KNOWLEDGE GUIDE SEED',
    '',
    `Checklist items: ${seed.counts.checklistItems}`,
    `Knowledge Guides: ${seed.counts.knowledgeGuides}`,
    `Total protected rows: ${seed.counts.total}`,
    ...Object.entries(seed.counts.byExam).map(([examId, counts]) => (
      `${examId}: ${counts.checklistItems} checklist, ${counts.knowledgeGuides} guides, `
      + `${counts.checklistPreviews} checklist previews, ${counts.knowledgeGuidePreviews} guide previews`
    )),
    `Checklist SHA-256: ${seed.checklistFingerprint}`,
    `Knowledge Guide SHA-256: ${seed.knowledgeGuideFingerprint}`,
    `Manifest SHA-256: ${seed.manifestFingerprint}`,
    `Guarded import chunks: ${chunks.length}`,
    '',
    'Not imported or deployed. Do not commit or publish the JSON or SQL seed.'
  ].join('\n'), 'utf8');
  return { seed, jsonPath, sqlPath, summaryPath };
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (invokedPath === import.meta.url) {
  const result = await writeProtectedChecklistKnowledgeGuideSeed();
  console.log(`Checklist and Knowledge Guide private seed prepared: ${result.summaryPath}`);
  console.log(`Manifest SHA-256: ${result.seed.manifestFingerprint}`);
}
