import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TERRAFORM_ASSOCIATE_EXAM } from '../src/data/exams/terraformAssociateExam.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(
  projectRoot,
  'supabase',
  'migrations',
  '20260830_expand_terraform_004_exam_questions_to_100.sql'
);

function sqlText(value) {
  const text = String(value ?? '');
  for (let suffix = 0; suffix < 100; suffix += 1) {
    const tag = suffix === 0 ? '$tfq$' : `$tfq${suffix}$`;
    if (!text.includes(tag)) return `${tag}${text}${tag}`;
  }
  throw new Error('Unable to find a safe PostgreSQL dollar-quote tag.');
}

function sqlNullableText(value) {
  return value == null ? 'NULL' : sqlText(value);
}

const questions = TERRAFORM_ASSOCIATE_EXAM.questions;
const topicIds = new Set(TERRAFORM_ASSOCIATE_EXAM.topics.map(topic => topic.id));

if (questions.length !== 100) {
  throw new Error(`Expected exactly 100 Terraform questions, found ${questions.length}.`);
}

const ids = new Set();
for (const question of questions) {
  if (ids.has(question.id)) throw new Error(`Duplicate question ID: ${question.id}`);
  ids.add(question.id);
  if (!topicIds.has(question.topicId)) throw new Error(`Unknown topic ${question.topicId} on ${question.id}.`);
  if (!Array.isArray(question.options) || question.options.length < 4 || question.options.length > 6) {
    throw new Error(`${question.id} must have between four and six options.`);
  }
}

const values = questions.map(question => {
  const correctAnswers = question.type === 'multiple'
    ? question.correctAnswers
    : [question.correctAnswer];
  const primaryAnswer = correctAnswers[0];
  const paddedOptions = [...question.options, null, null].slice(0, 6);

  return `  (${[
    sqlText(question.id),
    sqlText('terraform-associate-004'),
    sqlText(question.difficulty),
    sqlText(question.type),
    sqlText(question.question),
    ...paddedOptions.map(sqlNullableText),
    primaryAnswer,
    `ARRAY[${correctAnswers.join(', ')}]::INTEGER[]`,
    sqlText(question.explanation),
    sqlText(question.topicId)
  ].join(', ')})`;
}).join(',\n');

const sql = `-- Publish the 100 locally reviewed Terraform Associate (004) questions.
-- Scope: Terraform questions q-tf004-1 through q-tf004-100 and their topic links only.
-- AWS questions, exam attempts, Follow Alongs, drafts and approvals are not changed.

BEGIN;

CREATE TEMP TABLE terraform_004_question_seed (
  id TEXT PRIMARY KEY,
  exam_code TEXT NOT NULL,
  difficulty TEXT,
  question_type TEXT NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  option_e TEXT,
  option_f TEXT,
  correct_answer INTEGER NOT NULL,
  correct_answers INTEGER[] NOT NULL,
  explanation TEXT,
  topic_id TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO terraform_004_question_seed (
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation, topic_id
) VALUES
${values};

DO $migration_guard$
BEGIN
  IF (SELECT COUNT(*) FROM terraform_004_question_seed) <> 100 THEN
    RAISE EXCEPTION 'Terraform question publication stopped: expected 100 seed questions.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.exam_questions existing
    JOIN terraform_004_question_seed seed ON seed.id = existing.id
    WHERE existing.exam_code <> 'terraform-associate-004'
  ) THEN
    RAISE EXCEPTION 'Terraform question publication stopped: a question ID belongs to another exam.';
  END IF;
END
$migration_guard$;

INSERT INTO public.exam_questions (
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation
)
SELECT
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation
FROM terraform_004_question_seed
ON CONFLICT (id) DO UPDATE SET
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  question_text = EXCLUDED.question_text,
  option_a = EXCLUDED.option_a,
  option_b = EXCLUDED.option_b,
  option_c = EXCLUDED.option_c,
  option_d = EXCLUDED.option_d,
  option_e = EXCLUDED.option_e,
  option_f = EXCLUDED.option_f,
  correct_answer = EXCLUDED.correct_answer,
  correct_answers = EXCLUDED.correct_answers,
  explanation = EXCLUDED.explanation
WHERE public.exam_questions.exam_code = EXCLUDED.exam_code;

DELETE FROM public.question_topics mappings
USING terraform_004_question_seed seed
WHERE mappings.question_id = seed.id;

INSERT INTO public.question_topics (question_id, topic_id)
SELECT id, topic_id
FROM terraform_004_question_seed
ON CONFLICT (question_id, topic_id) DO NOTHING;

DO $publication_check$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM public.exam_questions questions
    JOIN terraform_004_question_seed seed ON seed.id = questions.id
    WHERE questions.exam_code = 'terraform-associate-004'
  ) <> 100 THEN
    RAISE EXCEPTION 'Terraform question publication failed verification: question count is not 100.';
  END IF;

  IF (
    SELECT COUNT(*)
    FROM public.question_topics mappings
    JOIN terraform_004_question_seed seed
      ON seed.id = mappings.question_id
     AND seed.topic_id = mappings.topic_id
  ) <> 100 THEN
    RAISE EXCEPTION 'Terraform question publication failed verification: topic mapping count is not 100.';
  END IF;
END
$publication_check$;

COMMIT;
`;

fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`Generated ${path.relative(projectRoot, outputPath)} with ${questions.length} questions.`);
