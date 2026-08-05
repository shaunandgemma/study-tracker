import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { DEFAULT_EXAMS } from '../src/data/examData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Helper to load .env.local variables into process.env if available
function loadEnvLocal() {
  const envPath = path.join(projectRoot, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.substring(0, eqIdx).trim();
          const val = trimmed.substring(eqIdx + 1).trim();
          if (key && !process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    });
  }
}

loadEnvLocal();

// Extract valid SAA-C03 topic IDs from examData.js
const saaExam = DEFAULT_EXAMS.find(e => e.id === 'aws-saa-c03');
const validTopicIds = new Set((saaExam?.topics || []).map(t => t.id));

export async function runImporter() {
  const isDryRun = process.argv.includes('--dry-run') || process.argv.includes('-d');

  console.log('\n========================================');
  console.log(`      AWS SAA-C03 QUESTION IMPORTER ${isDryRun ? '(DRY RUN)' : ''}     `);
  console.log('========================================\n');
  if (isDryRun) {
    console.log('🔍 DRY RUN MODE: Validations & duplicate checks will run, but NO changes will be written to database.\n');
  }

  const jsonPath = path.join(projectRoot, 'data', 'question-import.json');

  if (!fs.existsSync(jsonPath)) {
    console.error(`ERROR: Import JSON file not found at ${jsonPath}`);
    process.exit(1);
  }

  let rawData;
  try {
    rawData = fs.readFileSync(jsonPath, 'utf8');
  } catch (err) {
    console.error(`ERROR: Failed to read ${jsonPath}:`, err.message);
    process.exit(1);
  }

  let questions = [];
  try {
    questions = JSON.parse(rawData);
  } catch (err) {
    console.error(`ERROR: Invalid JSON syntax in data/question-import.json:`, err.message);
    process.exit(1);
  }

  if (!Array.isArray(questions)) {
    console.error('ERROR: data/question-import.json must contain a JSON array of question objects.');
    process.exit(1);
  }

  console.log(`Found ${questions.length} question(s) in data/question-import.json.\n`);

  if (questions.length === 0) {
    console.log('No questions to process. Array is empty.');
    process.exit(0);
  }

  // Phase 1: Local Schema & Topic Validation
  const validatedQuestions = [];
  const validationErrors = [];

  questions.forEach((q, idx) => {
    const qNum = idx + 1;
    const qId = q.id || `Question #${qNum}`;

    if (!q.id || typeof q.id !== 'string') {
      validationErrors.push(`${qId}: Missing or invalid "id" field.`);
      return;
    }
    if (!q.exam_code || typeof q.exam_code !== 'string') {
      validationErrors.push(`${qId}: Missing or invalid "exam_code" field.`);
      return;
    }
    if (!q.difficulty || typeof q.difficulty !== 'string') {
      validationErrors.push(`${qId}: Missing or invalid "difficulty" field.`);
      return;
    }
    if (!q.type || (q.type !== 'single' && q.type !== 'multiple')) {
      validationErrors.push(`${qId}: "type" must be either "single" or "multiple".`);
      return;
    }
    if (!q.question || typeof q.question !== 'string' || !q.question.trim()) {
      validationErrors.push(`${qId}: Missing or empty "question" text.`);
      return;
    }
    if (!Array.isArray(q.options)) {
      validationErrors.push(`${qId}: "options" must be an array.`);
      return;
    }

    if (q.type === 'single') {
      if (q.options.length !== 4) {
        validationErrors.push(`${qId}: Single-answer questions must have exactly 4 options.`);
        return;
      }
    } else if (q.type === 'multiple') {
      if (q.options.length !== 5 && q.options.length !== 6) {
        validationErrors.push(`${qId}: Multiple-answer questions must have 5 or 6 options.`);
        return;
      }
    }

    if (q.options.some(opt => typeof opt !== 'string' || !opt.trim())) {
      validationErrors.push(`${qId}: All option strings must be non-empty.`);
      return;
    }

    // Single vs Multiple Answer Index Validation
    if (q.type === 'single') {
      if (typeof q.correctAnswer !== 'number' || !Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
        validationErrors.push(`${qId}: Single-answer questions require "correctAnswer" to be an index between 0 and ${q.options.length - 1}.`);
        return;
      }
    } else if (q.type === 'multiple') {
      if (!Array.isArray(q.correctAnswers)) {
        validationErrors.push(`${qId}: Multiple-answer questions require "correctAnswers" to be an array.`);
        return;
      }
      if (q.correctAnswers.length !== 2 && q.correctAnswers.length !== 3) {
        validationErrors.push(`${qId}: "correctAnswers" array must contain either 2 or 3 answer indexes.`);
        return;
      }
      if (q.correctAnswers.some(val => typeof val !== 'number' || !Number.isInteger(val) || val < 0 || val >= q.options.length)) {
        validationErrors.push(`${qId}: Every value in "correctAnswers" must be an index between 0 and ${q.options.length - 1}.`);
        return;
      }
      if (new Set(q.correctAnswers).size !== q.correctAnswers.length) {
        validationErrors.push(`${qId}: "correctAnswers" array cannot contain duplicate answer indexes.`);
        return;
      }
    }

    if (!q.explanation || typeof q.explanation !== 'string') {
      validationErrors.push(`${qId}: Missing or invalid "explanation" string.`);
      return;
    }
    if (!Array.isArray(q.topics) || q.topics.length === 0) {
      validationErrors.push(`${qId}: Must specify at least one topic ID in "topics".`);
      return;
    }

    // Check each topic ID against validTopicIds
    const invalidTopics = q.topics.filter(tId => !validTopicIds.has(tId));
    if (invalidTopics.length > 0) {
      validationErrors.push(`${qId}: Contains invalid topic ID(s): ${invalidTopics.map(t => `"${t}"`).join(', ')}.`);
      return;
    }

    validatedQuestions.push(q);
  });

  if (validationErrors.length > 0) {
    console.error('CRITICAL: Validation errors detected. Stopping import:\n');
    validationErrors.forEach(err => console.error(` ❌ ${err}`));
    console.error('\nPlease fix the issues in data/question-import.json and try again.');
    process.exit(1);
  }

  console.log('✓ All questions passed local schema and topic validation.\n');

  // Environment credentials for database connection
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('⚠️ WARNING: Admin credentials incomplete in environment.');
    if (!serviceRoleKey) {
      console.warn('  SUPABASE_SERVICE_ROLE_KEY is missing in .env.local.');
      console.warn('  Questions were validated successfully, but cannot be uploaded without the service role key.');
      console.warn('  To upload, add SUPABASE_SERVICE_ROLE_KEY=your_key to .env.local and re-run.\n');
    }
    process.exit(0);
  }

  // Initialize Supabase admin client
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const importedList = [];
  const skippedList = [];
  const failedList = [];

  // Phase 2: Database Operations (Duplicate Check & Transactional Insert)
  for (const q of validatedQuestions) {
    // 1. Check if question ID already exists in exam_questions table
    const { data: existing, error: checkError } = await supabase
      .from('exam_questions')
      .select('id')
      .eq('id', q.id)
      .maybeSingle();

    if (checkError) {
      console.error(`Error checking existence of ${q.id}:`, checkError.message);
      failedList.push(`${q.id} - Database lookup error: ${checkError.message}`);
      continue;
    }

    if (existing) {
      skippedList.push(`${q.id} - question ID already exists`);
      continue;
    }

    if (isDryRun) {
      importedList.push(`${q.id} (Dry Run - would be inserted)`);
      continue;
    }

    const correctAnswersArr = q.type === 'single' ? [q.correctAnswer] : q.correctAnswers;
    const primaryCorrectAns = q.type === 'single' ? q.correctAnswer : q.correctAnswers[0];

    // 2. Insert into exam_questions
    const { error: insertQError } = await supabase
      .from('exam_questions')
      .insert({
        id: q.id,
        exam_code: q.exam_code,
        difficulty: q.difficulty,
        question_type: q.type,
        question_text: q.question,
        option_a: q.options[0],
        option_b: q.options[1],
        option_c: q.options[2],
        option_d: q.options[3],
        option_e: q.options[4] || null,
        option_f: q.options[5] || null,
        correct_answer: primaryCorrectAns,
        correct_answers: correctAnswersArr,
        explanation: q.explanation
      });

    if (insertQError) {
      failedList.push(`${q.id} - Insert to exam_questions failed: ${insertQError.message}`);
      continue;
    }

    // 3. Insert topic mappings into question_topics
    const topicRows = q.topics.map(tId => ({
      question_id: q.id,
      topic_id: tId
    }));

    const { error: insertTopicsError } = await supabase
      .from('question_topics')
      .insert(topicRows);

    if (insertTopicsError) {
      // Transactional rollback: Delete newly created exam_questions row to avoid partial import
      console.warn(`Topic mapping insert failed for ${q.id}. Cleaning up question row...`);
      await supabase.from('exam_questions').delete().eq('id', q.id);

      failedList.push(`${q.id} - Topic mapping insert failed: ${insertTopicsError.message} (Question cleaned up)`);
      continue;
    }

    importedList.push(q.id);
  }

  // Output Final Report Summary
  console.log('========================================');
  console.log(`        Question Import ${isDryRun ? 'Dry Run ' : ''}Complete        `);
  console.log('========================================\n');
  console.log(`${isDryRun ? 'Would Import' : 'Imported'}: ${importedList.length}`);
  console.log(`Skipped:      ${skippedList.length}`);
  console.log(`Failed:       ${failedList.length}\n`);

  if (importedList.length > 0) {
    console.log(`${isDryRun ? 'Would import questions:' : 'Imported questions:'}`);
    importedList.forEach(id => console.log(`  ✓ ${id}`));
    console.log('');
  }

  if (skippedList.length > 0) {
    console.log('Skipped:');
    skippedList.forEach(msg => console.log(`  SKIPPED ${msg}`));
    console.log('');
  }

  if (failedList.length > 0) {
    console.log('Failed:');
    failedList.forEach(msg => console.log(`  ❌ ${msg}`));
    console.log('');
  }
}

if (process.argv[1] && process.argv[1].endsWith('importQuestions.js')) {
  runImporter().catch(err => {
    console.error('Unhandled error during import process:', err);
    process.exit(1);
  });
}
