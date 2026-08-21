import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { TROUBLESHOOTING_CHALLENGES } from '../src/data/troubleshootingChallenges/index.js';

export const PRIVATE_TROUBLESHOOTING_SEED_DIRECTORY = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../docs/user-access-and-payments/private-content-seeds/troubleshooting-challenges'
);

const EXPECTED_COUNTS = Object.freeze({
  'aws-saa-c03': 23,
  'terraform-associate-004': 32
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

function validateChallenge(challenge) {
  const requiredText = ['id', 'examId', 'category', 'title', 'difficulty', 'summary', 'scenario', 'task'];
  if (requiredText.some(field => typeof challenge?.[field] !== 'string' || !challenge[field].trim())) {
    throw new Error(`Challenge ${challenge?.id || '(unknown)'} has incomplete identity or learner text.`);
  }
  if (!Number.isInteger(challenge.order) || challenge.order < 1) {
    throw new Error(`Challenge ${challenge.id} has an invalid order.`);
  }
  if (!Array.isArray(challenge.evidence) || !challenge.evidence.length
      || !Array.isArray(challenge.successCriteria) || !challenge.successCriteria.length
      || !Array.isArray(challenge.hints) || !challenge.hints.length
      || !Array.isArray(challenge.validationQuestions) || !challenge.validationQuestions.length
      || !challenge.solution || typeof challenge.solution !== 'object') {
    throw new Error(`Challenge ${challenge.id} has an incomplete protected payload.`);
  }
}

export function buildProtectedTroubleshootingSeed(challenges = TROUBLESHOOTING_CHALLENGES) {
  const source = [...challenges];
  source.forEach(validateChallenge);

  const ids = source.map(challenge => challenge.id);
  if (new Set(ids).size !== ids.length) throw new Error('Troubleshooting Challenge IDs are not unique.');

  const rows = [];
  for (const [examId, expectedCount] of Object.entries(EXPECTED_COUNTS)) {
    const examChallenges = source
      .filter(challenge => challenge.examId === examId)
      .sort((left, right) => left.order - right.order || left.id.localeCompare(right.id));

    if (examChallenges.length !== expectedCount) {
      throw new Error(`${examId} must contain exactly ${expectedCount} challenges.`);
    }

    examChallenges.forEach((challenge, index) => {
      const payloadCanonical = stableStringify(challenge);
      rows.push(Object.freeze({
        content_id: challenge.id,
        exam_id: challenge.examId,
        content_type: 'troubleshooting_challenge',
        parent_content_id: null,
        title: challenge.title,
        sort_order: challenge.order,
        preview_order: index < 2 ? index + 1 : null,
        publication_status: 'published',
        content_version: 1,
        content_hash: sha256(payloadCanonical),
        payload: challenge
      }));
    });
  }

  if (rows.length !== source.length) {
    throw new Error('A challenge uses an unsupported exam ID.');
  }

  const fingerprintLines = rows
    .map(row => `${row.exam_id}:${row.sort_order}:${row.content_id}:${row.content_hash}`)
    .join('\n');

  return Object.freeze({
    schemaVersion: '007C-1',
    contentType: 'troubleshooting_challenge',
    counts: Object.freeze({
      total: rows.length,
      byExam: EXPECTED_COUNTS,
      previewByExam: Object.freeze({
        'aws-saa-c03': 2,
        'terraform-associate-004': 2
      })
    }),
    manifestFingerprint: sha256(fingerprintLines),
    rows: Object.freeze(rows)
  });
}

const sqlText = value => `'${String(value).replaceAll("'", "''")}'`;

export function buildPrivateTroubleshootingSeedSql(seed) {
  const values = seed.rows.map(row => `  (
    ${sqlText(row.content_id)},
    ${sqlText(row.exam_id)},
    ${sqlText(row.content_type)},
    NULL,
    ${sqlText(row.title)},
    ${row.sort_order},
    ${row.preview_order ?? 'NULL'},
    ${sqlText(row.publication_status)},
    ${row.content_version},
    ${sqlText(row.content_hash)},
    ${sqlText(stableStringify(row.payload))}::JSONB,
    clock_timestamp()
  )`).join(',\n');

  return `-- PRIVATE STEP 007C TROUBLESHOOTING CONTENT SEED
-- Generated from the locally verified 55-challenge catalogue.
-- This file is inside an ignored local directory. Do not commit or publish it.
-- Run only after migration 20260905 has been separately approved and deployed.

BEGIN;

CREATE TEMP TABLE troubleshooting_progress_count_before AS
SELECT COUNT(*)::BIGINT AS row_count
FROM public.learner_item_progress
WHERE progress_type = 'troubleshooting_challenge';

DO $$
BEGIN
  IF to_regclass('public.learner_content_items') IS NULL THEN
    RAISE EXCEPTION '007C seed stopped: learner_content_items does not exist.';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.learner_content_items
    WHERE content_type = 'troubleshooting_challenge'
  ) THEN
    RAISE EXCEPTION '007C seed stopped: Troubleshooting content already exists.';
  END IF;
END;
$$;

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
) VALUES
${values};

DO $$
DECLARE
  actual_manifest_fingerprint TEXT;
BEGIN
  IF (
    SELECT COUNT(*) FROM public.learner_content_items
    WHERE content_type = 'troubleshooting_challenge'
  ) <> 55 THEN
    RAISE EXCEPTION '007C seed stopped: expected 55 Troubleshooting Challenges.';
  END IF;

  IF (
    SELECT COUNT(*) FROM public.learner_content_items
    WHERE content_type = 'troubleshooting_challenge'
      AND exam_id = 'aws-saa-c03'
  ) <> 23 OR (
    SELECT COUNT(*) FROM public.learner_content_items
    WHERE content_type = 'troubleshooting_challenge'
      AND exam_id = 'terraform-associate-004'
  ) <> 32 THEN
    RAISE EXCEPTION '007C seed stopped: exact exam counts did not match.';
  END IF;

  IF EXISTS (
    SELECT exam_id
    FROM public.learner_content_items
    WHERE content_type = 'troubleshooting_challenge'
      AND preview_order IS NOT NULL
    GROUP BY exam_id
    HAVING COUNT(*) <> 2
  ) OR (
    SELECT COUNT(DISTINCT exam_id)
    FROM public.learner_content_items
    WHERE content_type = 'troubleshooting_challenge'
      AND preview_order IS NOT NULL
  ) <> 2 THEN
    RAISE EXCEPTION '007C seed stopped: each exam must have exactly two previews.';
  END IF;

  SELECT encode(
    extensions.digest(
      string_agg(
        exam_id || ':' || sort_order || ':' || content_id || ':' || content_hash,
        E'\\n' ORDER BY exam_id, sort_order, content_id
      ),
      'sha256'
    ),
    'hex'
  ) INTO actual_manifest_fingerprint
  FROM public.learner_content_items
  WHERE content_type = 'troubleshooting_challenge';

  IF actual_manifest_fingerprint <> ${sqlText(seed.manifestFingerprint)} THEN
    RAISE EXCEPTION '007C seed stopped: manifest fingerprint did not match.';
  END IF;

  IF (
    SELECT COUNT(*) FROM public.learner_item_progress
    WHERE progress_type = 'troubleshooting_challenge'
  ) <> (
    SELECT row_count FROM troubleshooting_progress_count_before
  ) THEN
    RAISE EXCEPTION '007C seed stopped: learner progress changed unexpectedly.';
  END IF;
END;
$$;

COMMIT;
`;
}

export async function writeProtectedTroubleshootingSeed(outputDirectory = PRIVATE_TROUBLESHOOTING_SEED_DIRECTORY) {
  const seed = buildProtectedTroubleshootingSeed();
  await mkdir(outputDirectory, { recursive: true });
  const jsonPath = resolve(outputDirectory, 'troubleshooting-challenges-seed.json');
  const sqlPath = resolve(outputDirectory, 'troubleshooting-challenges-seed.sql');
  const summaryPath = resolve(outputDirectory, 'troubleshooting-challenges-seed-summary.txt');
  await writeFile(jsonPath, `${JSON.stringify(seed, null, 2)}\n`, 'utf8');
  await writeFile(sqlPath, buildPrivateTroubleshootingSeedSql(seed), 'utf8');
  await writeFile(summaryPath, [
    'LATT STEP 007C PRIVATE TROUBLESHOOTING SEED',
    '',
    `Total challenges: ${seed.counts.total}`,
    `AWS SAA-C03: ${seed.counts.byExam['aws-saa-c03']}`,
    `Terraform Associate (004): ${seed.counts.byExam['terraform-associate-004']}`,
    'Preview challenges per exam: 2',
    `Manifest SHA-256: ${seed.manifestFingerprint}`,
    '',
    'Not imported. Do not commit or publish the JSON or SQL seed.'
  ].join('\n'), 'utf8');
  return { seed, jsonPath, sqlPath, summaryPath };
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (invokedPath === import.meta.url) {
  const result = await writeProtectedTroubleshootingSeed();
  console.log('Protected Troubleshooting seed created locally.');
  console.log(`Challenges: ${result.seed.counts.total}`);
  console.log(`Manifest SHA-256: ${result.seed.manifestFingerprint}`);
  console.log(`JSON: ${result.jsonPath}`);
  console.log(`SQL: ${result.sqlPath}`);
  console.log('Nothing was imported or deployed.');
}
