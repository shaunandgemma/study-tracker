import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { exportQuestionsToFile } from './exportQuestions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const CANONICAL_EXAM_CODE = 'aws-saa-c03';
const ACCEPTED_SOURCE_EXAM_CODES = new Set(['SAA-C03', CANONICAL_EXAM_CODE]);
const EXPECTED_QUESTION_COUNT = 250;
const UPSERT_BATCH_SIZE = 50;
const TOPIC_INSERT_BATCH_SIZE = 500;

const correctedBankPath = path.join(projectRoot, 'data', 'SAA-C03-question-bank-upgraded-250.json');
const backupPath = path.join(projectRoot, 'data', 'backups', 'saa-c03-before-corrected-import.json');

function loadEnvLocal() {
  const envPath = path.join(projectRoot, '.env.local');
  if (!fs.existsSync(envPath)) return;

  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) return;

    const key = trimmed.substring(0, equalsIndex).trim();
    const value = trimmed.substring(equalsIndex + 1).trim();
    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  });
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function chunk(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function assertExactIdSet(actualIds, expectedIds, label) {
  const actualSet = new Set(actualIds);
  const expectedSet = new Set(expectedIds);

  if (actualIds.length !== actualSet.size) {
    throw new Error(`${label} contains duplicate IDs.`);
  }

  const missingIds = expectedIds.filter(id => !actualSet.has(id));
  const unexpectedIds = actualIds.filter(id => !expectedSet.has(id));

  if (
    actualIds.length !== EXPECTED_QUESTION_COUNT ||
    actualSet.size !== expectedSet.size ||
    missingIds.length > 0 ||
    unexpectedIds.length > 0
  ) {
    throw new Error(
      `${label} ID set does not exactly match the corrected bank. ` +
      `Expected ${EXPECTED_QUESTION_COUNT}, found ${actualIds.length}. ` +
      `Missing: ${missingIds.join(', ') || 'none'}. ` +
      `Unexpected: ${unexpectedIds.join(', ') || 'none'}.`
    );
  }
}

export function normalizeAndValidateQuestions(sourceQuestions) {
  if (!Array.isArray(sourceQuestions)) {
    throw new Error('Corrected question bank must be a JSON array.');
  }

  if (sourceQuestions.length !== EXPECTED_QUESTION_COUNT) {
    throw new Error(
      `Corrected question bank must contain exactly ${EXPECTED_QUESTION_COUNT} questions; ` +
      `found ${sourceQuestions.length}.`
    );
  }

  const seenQuestionIds = new Set();
  const sourceExamCodeCounts = {};
  const validationErrors = [];

  const normalizedQuestions = sourceQuestions.map((question, index) => {
    const label = question?.id || `Question #${index + 1}`;

    if (!question || typeof question !== 'object' || Array.isArray(question)) {
      validationErrors.push(`${label}: Question must be an object.`);
      return question;
    }

    if (typeof question.id !== 'string' || !question.id.trim()) {
      validationErrors.push(`${label}: Missing or invalid id.`);
    } else if (seenQuestionIds.has(question.id)) {
      validationErrors.push(`${label}: Duplicate question ID.`);
    } else {
      seenQuestionIds.add(question.id);
    }

    if (!ACCEPTED_SOURCE_EXAM_CODES.has(question.exam_code)) {
      validationErrors.push(
        `${label}: exam_code must be "SAA-C03" or "${CANONICAL_EXAM_CODE}", ` +
        `found ${JSON.stringify(question.exam_code)}.`
      );
    } else {
      sourceExamCodeCounts[question.exam_code] = (sourceExamCodeCounts[question.exam_code] || 0) + 1;
    }

    if (typeof question.difficulty !== 'string' || !question.difficulty.trim()) {
      validationErrors.push(`${label}: Missing or invalid difficulty.`);
    }

    if (question.type !== 'single' && question.type !== 'multiple') {
      validationErrors.push(`${label}: type must be "single" or "multiple".`);
    }

    if (typeof question.question !== 'string' || !question.question.trim()) {
      validationErrors.push(`${label}: Question text must be non-empty.`);
    }

    if (!Array.isArray(question.options)) {
      validationErrors.push(`${label}: options must be an array.`);
    } else {
      if (question.type === 'single' && question.options.length !== 4) {
        validationErrors.push(`${label}: Single-answer questions must have exactly 4 options.`);
      }
      if (question.type === 'multiple' && ![5, 6].includes(question.options.length)) {
        validationErrors.push(`${label}: Multiple-answer questions must have 5 or 6 options.`);
      }
      if (question.options.some(option => typeof option !== 'string' || !option.trim())) {
        validationErrors.push(`${label}: All options must be non-empty strings.`);
      }
    }

    const optionCount = Array.isArray(question.options) ? question.options.length : 0;

    if (question.type === 'single') {
      if (
        !Number.isInteger(question.correctAnswer) ||
        question.correctAnswer < 0 ||
        question.correctAnswer >= optionCount
      ) {
        validationErrors.push(
          `${label}: Single-answer questions must have a valid zero-based correctAnswer index.`
        );
      }

      if (question.correctAnswers !== null) {
        validationErrors.push(
          `${label}: Single-answer questions must have correctAnswers set to null.`
        );
      }
    }

    if (question.type === 'multiple') {
      if (question.correctAnswer !== null) {
        validationErrors.push(
          `${label}: Multiple-answer questions must have correctAnswer set to null.`
        );
      }

      if (!Array.isArray(question.correctAnswers)) {
        validationErrors.push(
          `${label}: Multiple-answer questions must have a correctAnswers array.`
        );
      } else {
        const uniqueCorrectAnswers = new Set(question.correctAnswers);

        if (uniqueCorrectAnswers.size !== question.correctAnswers.length) {
          validationErrors.push(
            `${label}: correctAnswers must contain unique indexes.`
          );
        }

        if (![2, 3].includes(question.correctAnswers.length)) {
          validationErrors.push(
            `${label}: Multiple-answer questions must have exactly 2 or 3 correct indexes.`
          );
        }

        if (
          question.correctAnswers.some(answerIndex =>
            !Number.isInteger(answerIndex) ||
            answerIndex < 0 ||
            answerIndex >= optionCount
          )
        ) {
          validationErrors.push(
            `${label}: correctAnswers contains an invalid zero-based option index.`
          );
        }
      }
    }

    if (typeof question.explanation !== 'string' || !question.explanation.trim()) {
      validationErrors.push(`${label}: explanation must be a non-empty string.`);
    }

    if (!Array.isArray(question.topics) || question.topics.length === 0) {
      validationErrors.push(`${label}: topics must be a non-empty array.`);
    } else {
      const uniqueTopics = new Set(question.topics);
      if (uniqueTopics.size !== question.topics.length) {
        validationErrors.push(`${label}: Duplicate topic mappings are not allowed.`);
      }

      const invalidTopics = question.topics.filter(
        topicId => typeof topicId !== 'string' || !topicId.trim()
      );
      if (invalidTopics.length > 0) {
        validationErrors.push(`${label}: Invalid topic IDs: ${invalidTopics.join(', ')}.`);
      }
    }

    return {
      ...question,
      exam_code: CANONICAL_EXAM_CODE
    };
  });

  if (validationErrors.length > 0) {
    throw new Error(`Corrected question bank validation failed:\n- ${validationErrors.join('\n- ')}`);
  }

  if (normalizedQuestions.some(question => question.exam_code !== CANONICAL_EXAM_CODE)) {
    throw new Error(`In-memory normalization failed to produce only ${CANONICAL_EXAM_CODE} records.`);
  }

  return {
    questions: normalizedQuestions,
    sourceExamCodeCounts
  };
}

function mapQuestionToDatabaseRow(question) {
  return {
    id: question.id,
    exam_code: CANONICAL_EXAM_CODE,
    difficulty: question.difficulty,
    question_type: question.type,
    question_text: question.question,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3],
    option_e: question.options[4] ?? null,
    option_f: question.options[5] ?? null,
    correct_answer:
      question.type === 'single'
        ? question.correctAnswer
        : question.correctAnswers[0],
    correct_answers:
      question.type === 'single'
        ? [question.correctAnswer]
        : question.correctAnswers,
    explanation: question.explanation
  };
}

function buildTopicRows(questions) {
  return questions.flatMap(question =>
    question.topics.map(topicId => ({
      question_id: question.id,
      topic_id: topicId
    }))
  );
}

async function fetchExistingQuestionIds(supabase) {
  const { data, error } = await supabase
    .from('exam_questions')
    .select('id')
    .eq('exam_code', CANONICAL_EXAM_CODE);

  if (error) {
    throw new Error(`Failed to fetch existing ${CANONICAL_EXAM_CODE} question IDs: ${error.message}`);
  }

  return (data || []).map(row => row.id);
}

async function fetchTopicMappings(supabase, questionIds) {
  const { data, error } = await supabase
    .from('question_topics')
    .select('question_id, topic_id')
    .in('question_id', questionIds);

  if (error) {
    throw new Error(`Failed to fetch existing question_topics rows: ${error.message}`);
  }

  return data || [];
}

async function upsertQuestionRows(supabase, rows) {
  let updatedCount = 0;

  for (const rowBatch of chunk(rows, UPSERT_BATCH_SIZE)) {
    const { data, error } = await supabase
      .from('exam_questions')
      .upsert(rowBatch, { onConflict: 'id' })
      .select('id');

    if (error) {
      throw new Error(`Failed to upsert exam_questions: ${error.message}`);
    }
    if (!data || data.length !== rowBatch.length) {
      throw new Error(
        `exam_questions upsert returned ${data?.length || 0} rows for a batch of ${rowBatch.length}.`
      );
    }

    updatedCount += data.length;
  }

  return updatedCount;
}

async function deleteTopicMappings(supabase, questionIds) {
  const { data, error } = await supabase
    .from('question_topics')
    .delete()
    .in('question_id', questionIds)
    .select('question_id, topic_id');

  if (error) {
    throw new Error(`Failed to delete existing question_topics rows: ${error.message}`);
  }

  return (data || []).length;
}

async function insertTopicMappings(supabase, topicRows) {
  let insertedCount = 0;

  for (const rowBatch of chunk(topicRows, TOPIC_INSERT_BATCH_SIZE)) {
    const { data, error } = await supabase
      .from('question_topics')
      .insert(rowBatch)
      .select('question_id, topic_id');

    if (error) {
      throw new Error(`Failed to insert corrected question_topics rows: ${error.message}`);
    }
    if (!data || data.length !== rowBatch.length) {
      throw new Error(
        `question_topics insert returned ${data?.length || 0} rows for a batch of ${rowBatch.length}.`
      );
    }

    insertedCount += data.length;
  }

  return insertedCount;
}

function assertTopicMappingsMatch(actualRows, expectedRows) {
  const toKey = row => `${row.question_id}\u0000${row.topic_id}`;
  const actualKeys = actualRows.map(toKey);
  const expectedKeys = expectedRows.map(toKey);
  const actualSet = new Set(actualKeys);
  const expectedSet = new Set(expectedKeys);

  const missing = expectedKeys.filter(key => !actualSet.has(key));
  const unexpected = actualKeys.filter(key => !expectedSet.has(key));

  if (
    actualKeys.length !== actualSet.size ||
    actualSet.size !== expectedSet.size ||
    missing.length > 0 ||
    unexpected.length > 0
  ) {
    throw new Error(
      `Post-write topic mapping verification failed. ` +
      `Expected ${expectedRows.length}, found ${actualRows.length}.`
    );
  }
}

async function restoreFromBackup(supabase, backupQuestions) {
  const { questions } = normalizeAndValidateQuestions(backupQuestions);
  const questionIds = questions.map(question => question.id);
  const questionRows = questions.map(mapQuestionToDatabaseRow);
  const topicRows = buildTopicRows(questions);

  await upsertQuestionRows(supabase, questionRows);
  await deleteTopicMappings(supabase, questionIds);
  await insertTopicMappings(supabase, topicRows);
}

function printReport({
  mode,
  validatedQuestionCount,
  existingDatabaseCount,
  updatedQuestionCount,
  wouldUpdateQuestionCount,
  deletedTopicMappingCount,
  wouldDeleteTopicMappingCount,
  insertedTopicMappingCount,
  wouldInsertTopicMappingCount,
  skippedCount,
  failedCount
}) {
  console.log('\n========================================');
  console.log('   SAA-C03 Replacement Import Report');
  console.log('========================================');
  console.log(`Mode: ${mode}`);
  console.log(`Validated question count: ${validatedQuestionCount}`);
  console.log(`Existing database count: ${existingDatabaseCount}`);
  console.log(`Updated exam_questions count: ${updatedQuestionCount}`);
  if (mode === 'DRY RUN') {
    console.log(`Would update exam_questions count: ${wouldUpdateQuestionCount}`);
  }
  console.log(`Deleted topic mapping count: ${deletedTopicMappingCount}`);
  if (mode === 'DRY RUN') {
    console.log(`Would delete topic mapping count: ${wouldDeleteTopicMappingCount}`);
  }
  console.log(`Inserted topic mapping count: ${insertedTopicMappingCount}`);
  if (mode === 'DRY RUN') {
    console.log(`Would insert topic mapping count: ${wouldInsertTopicMappingCount}`);
  }
  console.log(`Skipped count: ${skippedCount}`);
  console.log(`Failed count: ${failedCount}`);
}

export async function runReplacement({ dryRun = false } = {}) {
  const sourceRawBefore = fs.readFileSync(correctedBankPath);
  const sourceHashBefore = sha256(sourceRawBefore);

  let sourceQuestions;
  try {
    sourceQuestions = JSON.parse(sourceRawBefore.toString('utf8'));
  } catch (error) {
    throw new Error(`Corrected question bank is not valid JSON: ${error.message}`);
  }

  const { questions, sourceExamCodeCounts } = normalizeAndValidateQuestions(sourceQuestions);
  const questionIds = questions.map(question => question.id);
  const questionRows = questions.map(mapQuestionToDatabaseRow);
  const correctedTopicRows = buildTopicRows(questions);

  console.log('\n========================================');
  console.log('   SAA-C03 SAFE REPLACEMENT IMPORTER');
  console.log('========================================\n');
  console.log(`Source: ${path.relative(projectRoot, correctedBankPath)}`);
  console.log(`Validated questions: ${questions.length}`);
  console.log(
    `Source exam_code values accepted: ` +
    [...ACCEPTED_SOURCE_EXAM_CODES]
      .map(code => `${code}=${sourceExamCodeCounts[code] || 0}`)
      .join(', ')
  );
  console.log(`Normalized in memory to: ${CANONICAL_EXAM_CODE}`);
  console.log(`Corrected topic mappings: ${correctedTopicRows.length}`);

  loadEnvLocal();
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY are required. ' +
      'The replacement importer never falls back to the frontend publishable key.'
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const existingQuestionIds = await fetchExistingQuestionIds(supabase);
  assertExactIdSet(existingQuestionIds, questionIds, `Supabase ${CANONICAL_EXAM_CODE} rows`);

  const existingTopicRows = await fetchTopicMappings(supabase, questionIds);

  if (dryRun) {
    const sourceRawAfter = fs.readFileSync(correctedBankPath);
    if (sha256(sourceRawAfter) !== sourceHashBefore) {
      throw new Error('Corrected JSON changed during dry-run validation.');
    }

    console.log('\nDry-run validation passed. No backup or Supabase writes were performed.');
    printReport({
      mode: 'DRY RUN',
      validatedQuestionCount: questions.length,
      existingDatabaseCount: existingQuestionIds.length,
      updatedQuestionCount: 0,
      wouldUpdateQuestionCount: questionRows.length,
      deletedTopicMappingCount: 0,
      wouldDeleteTopicMappingCount: existingTopicRows.length,
      insertedTopicMappingCount: 0,
      wouldInsertTopicMappingCount: correctedTopicRows.length,
      skippedCount: 0,
      failedCount: 0
    });
    return;
  }

  let backupQuestions = null;
  let writesStarted = false;

  try {
    console.log(`\nCreating pre-replacement backup: ${path.relative(projectRoot, backupPath)}`);
    const backupResult = await exportQuestionsToFile({
      outputPath: backupPath,
      supabaseClient: supabase,
      examCode: CANONICAL_EXAM_CODE
    });
    backupQuestions = backupResult.questions;
    assertExactIdSet(
      backupQuestions.map(question => question.id),
      questionIds,
      'Pre-replacement backup'
    );

    // Recheck immediately before writes in case the database changed while the backup was created.
    const preWriteQuestionIds = await fetchExistingQuestionIds(supabase);
    assertExactIdSet(preWriteQuestionIds, questionIds, `Pre-write Supabase ${CANONICAL_EXAM_CODE} rows`);

    writesStarted = true;
    const updatedQuestionCount = await upsertQuestionRows(supabase, questionRows);
    const deletedTopicMappingCount = await deleteTopicMappings(supabase, questionIds);
    const insertedTopicMappingCount = await insertTopicMappings(supabase, correctedTopicRows);

    const finalQuestionIds = await fetchExistingQuestionIds(supabase);
    assertExactIdSet(finalQuestionIds, questionIds, `Post-write Supabase ${CANONICAL_EXAM_CODE} rows`);
    const finalTopicRows = await fetchTopicMappings(supabase, questionIds);
    assertTopicMappingsMatch(finalTopicRows, correctedTopicRows);

    const sourceRawAfter = fs.readFileSync(correctedBankPath);
    if (sha256(sourceRawAfter) !== sourceHashBefore) {
      throw new Error('Corrected JSON changed during the replacement operation.');
    }

    printReport({
      mode: 'LIVE',
      validatedQuestionCount: questions.length,
      existingDatabaseCount: existingQuestionIds.length,
      updatedQuestionCount,
      wouldUpdateQuestionCount: 0,
      deletedTopicMappingCount,
      wouldDeleteTopicMappingCount: 0,
      insertedTopicMappingCount,
      wouldInsertTopicMappingCount: 0,
      skippedCount: 0,
      failedCount: 0
    });
  } catch (error) {
    if (writesStarted && backupQuestions) {
      console.error(`\nReplacement failed after writes began: ${error.message}`);
      console.error('Attempting to restore exam_questions and question_topics from the fresh backup...');
      try {
        await restoreFromBackup(supabase, backupQuestions);
        console.error('Rollback completed successfully.');
      } catch (rollbackError) {
        console.error(`CRITICAL: Rollback failed: ${rollbackError.message}`);
      }
    }
    throw error;
  }
}

function parseArguments(args) {
  const allowedArguments = new Set(['--dry-run']);
  const unknownArguments = args.filter(argument => !allowedArguments.has(argument));
  if (unknownArguments.length > 0) {
    throw new Error(`Unknown argument(s): ${unknownArguments.join(', ')}`);
  }

  return {
    dryRun: args.includes('--dry-run')
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  let options;
  try {
    options = parseArguments(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }

  if (options) {
    runReplacement(options).catch(error => {
      console.error(`\nSAA-C03 replacement failed: ${error.message}`);
      printReport({
        mode: options.dryRun ? 'DRY RUN' : 'LIVE',
        validatedQuestionCount: 0,
        existingDatabaseCount: 0,
        updatedQuestionCount: 0,
        wouldUpdateQuestionCount: 0,
        deletedTopicMappingCount: 0,
        wouldDeleteTopicMappingCount: 0,
        insertedTopicMappingCount: 0,
        wouldInsertTopicMappingCount: 0,
        skippedCount: 0,
        failedCount: 1
      });
      process.exitCode = 1;
    });
  }
}
