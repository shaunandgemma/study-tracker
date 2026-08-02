import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const jsonPath = path.join(projectRoot, 'data', 'saa-c03-question-export.json');
const sqlPath = path.join(projectRoot, 'supabase', 'saa_c03_questions.sql');

if (!fs.existsSync(jsonPath)) {
  console.error(`ERROR: JSON export file not found at ${jsonPath}`);
  process.exit(1);
}

const rawData = fs.readFileSync(jsonPath, 'utf8');
const questions = JSON.parse(rawData);

console.log(`Loaded ${questions.length} questions from ${jsonPath}`);

function formatStructuralStr(val) {
  if (val == null) return 'NULL';
  const escaped = String(val).replace(/'/g, "''");
  return `'${escaped}'`;
}

function formatFreeTextStr(val) {
  if (val == null || val === '') return 'NULL';
  // Use tagged dollar quote $q$...$q$ to prevent parsing issues with single quotes or apostrophes
  return `$q$${val}$q$`;
}

function makeQuestionTuple(q) {
  const qId = formatStructuralStr(q.id);
  const examCode = formatStructuralStr(q.exam_code || 'aws-saa-c03');
  const difficulty = formatStructuralStr(q.difficulty || 'Medium');
  const qType = formatStructuralStr(q.type);
  
  const qText = formatFreeTextStr(q.question);
  
  const opts = q.options || [];
  const optA = formatFreeTextStr(opts[0]);
  const optB = formatFreeTextStr(opts[1]);
  const optC = formatFreeTextStr(opts[2]);
  const optD = formatFreeTextStr(opts[3]);
  const optE = formatFreeTextStr(opts[4]);
  const optF = formatFreeTextStr(opts[5]);
  
  const correctAns = q.correctAnswer;
  const correctAnsArr = q.correctAnswers || [correctAns];
  const arrStr = `ARRAY[${correctAnsArr.join(', ')}]`;
  
  const explanation = formatFreeTextStr(q.explanation);
  
  return `(
  ${qId}, ${examCode}, ${difficulty}, ${qType},
  ${qText},
  ${optA}, ${optB}, ${optC}, ${optD}, ${optE}, ${optF},
  ${correctAns}, ${arrStr},
  ${explanation}
)`;
}

// Build topic mapping tuples
const topicTuples = [];
questions.forEach(q => {
  const qId = q.id;
  (q.topics || []).forEach(tId => {
    topicTuples.push(`  ('${qId}', '${tId}')`);
  });
});

const batchesDef = [
  { label: 'Batch 1: q-saa-1 to q-saa-25', start: 1, end: 25 },
  { label: 'Batch 2: q-saa-26 to q-saa-50', start: 26, end: 50 },
  { label: 'Batch 3: q-saa-51 to q-saa-75', start: 51, end: 75 },
  { label: 'Batch 4: q-saa-76 to q-saa-100', start: 76, end: 100 },
  { label: 'Batch 5A: q-saa-101 to q-saa-105', start: 101, end: 105 },
  { label: 'Batch 5B: q-saa-106 to q-saa-110', start: 106, end: 110 },
  { label: 'Batch 5C: q-saa-111 to q-saa-115', start: 111, end: 115 },
  { label: 'Batch 5D: q-saa-116 to q-saa-120', start: 116, end: 120 },
  { label: 'Batch 5E: q-saa-121 to q-saa-125', start: 121, end: 125 },
  { label: 'Batch 6A: q-saa-126 to q-saa-130', start: 126, end: 130 },
  { label: 'Batch 6B: q-saa-131 to q-saa-135', start: 131, end: 135 },
  { label: 'Batch 6C: q-saa-136 to q-saa-140', start: 136, end: 140 },
  { label: 'Batch 6D: q-saa-141 to q-saa-145', start: 141, end: 145 },
  { label: 'Batch 6E: q-saa-146 to q-saa-150', start: 146, end: 150 }
];

const headerSql = `-- ==============================================================================
-- Supabase Migration Script: AWS SAA-C03 Practice Questions & Topic Mappings
-- Supporting 4, 5, and 6 Option Questions (Choices A-F)
-- Single-Answer & Multiple-Answer (Select TWO / Select THREE) Support
-- Authoritative 150-Question Bank
-- Free-text fields use PostgreSQL Dollar-Quoted Strings ($q$...$q$)
-- ==============================================================================

-- 1. Create Table: exam_questions
CREATE TABLE IF NOT EXISTS exam_questions (
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
  correct_answers INTEGER[],
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe Alter Columns for existing deployments
ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS option_e TEXT;
ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS option_f TEXT;
ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS correct_answers INTEGER[];

UPDATE exam_questions
SET correct_answers = ARRAY[correct_answer]
WHERE correct_answers IS NULL;

-- 2. Create Table: question_topics
CREATE TABLE IF NOT EXISTS question_topics (
  question_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  PRIMARY KEY (question_id, topic_id),
  CONSTRAINT fk_question_id FOREIGN KEY (question_id) REFERENCES exam_questions(id) ON DELETE CASCADE
);

-- 3. Create Indexes
CREATE INDEX IF NOT EXISTS idx_exam_questions_exam_code ON exam_questions(exam_code);
CREATE INDEX IF NOT EXISTS idx_question_topics_topic_id ON question_topics(topic_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_topics ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (Public Read Access)
DROP POLICY IF EXISTS "Allow public read access to exam_questions" ON exam_questions;
CREATE POLICY "Allow public read access to exam_questions"
  ON exam_questions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public read access to question_topics" ON question_topics;
CREATE POLICY "Allow public read access to question_topics"
  ON question_topics FOR SELECT
  USING (true);
`;

const insertHeader = `INSERT INTO exam_questions (
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation
) VALUES`;

const onConflictClause = `ON CONFLICT (id) DO UPDATE SET
  exam_code = EXCLUDED.exam_code,
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
  explanation = EXCLUDED.explanation;`;

const qByNum = {};
questions.forEach(q => {
  const num = parseInt(q.id.replace(/\D/g, ''), 10);
  qByNum[num] = q;
});

const batchSqls = batchesDef.map(b => {
  const tupleList = [];
  for (let num = b.start; num <= b.end; num++) {
    if (qByNum[num]) {
      tupleList.push(makeQuestionTuple(qByNum[num]));
    }
  }
  return `-- ${b.label}\n${insertHeader}\n${tupleList.join(',\n')}\n${onConflictClause}`;
});

const middleSql = batchSqls.join('\n\n');

const topicInsertsSql = `-- 7. Clean up stale topic mappings for SAA-C03 before re-inserting authoritative mappings
DELETE FROM question_topics
WHERE question_id IN (
  SELECT id FROM exam_questions WHERE exam_code = 'aws-saa-c03'
);

-- 8. Insert Authoritative Question-Topic Mappings for all 150 Questions
INSERT INTO question_topics (question_id, topic_id) VALUES
${topicTuples.join(',\n')}
ON CONFLICT (question_id, topic_id) DO NOTHING;
`;

const fullSql = `${headerSql}\n-- 6. Insert 150 SAA-C03 Questions (Batched)\n${middleSql}\n\n${topicInsertsSql}`;

fs.writeFileSync(sqlPath, fullSql, 'utf8');

console.log(`\nSuccessfully generated ${sqlPath}`);
console.log(`Total size: ${fullSql.length} bytes`);
console.log(`Total questions: ${questions.length}`);
console.log(`Total topic mappings: ${topicTuples.length}`);
