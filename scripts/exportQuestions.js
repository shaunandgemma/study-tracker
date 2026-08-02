import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

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

export async function exportQuestionsToFile({
  outputPath = path.join(projectRoot, 'data', 'saa-c03-question-export.json'),
  supabaseClient = null,
  examCode = 'aws-saa-c03'
} = {}) {
  console.log('\n========================================');
  console.log('      AWS SAA-C03 QUESTION EXPORTER     ');
  console.log('========================================\n');

  let supabase = supabaseClient;

  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !apiKey) {
      throw new Error('Supabase URL or API Key missing in environment.');
    }

    supabase = createClient(supabaseUrl, apiKey);
  }

  // 1. Fetch all SAA-C03 questions from exam_questions table
  const { data: questions, error: qError } = await supabase
    .from('exam_questions')
    .select('*')
    .eq('exam_code', examCode);

  if (qError) {
    throw new Error(`Failed to fetch exam_questions from Supabase: ${qError.message}`);
  }

  // Safety Check: If no questions are returned, print error and abort to protect existing file
  if (!questions || questions.length === 0) {
    throw new Error('No SAA-C03 questions were returned from Supabase. Export aborted; the existing output was not overwritten.');
  }

  const questionIds = questions.map(q => q.id);

  // 2. Fetch topic mappings from question_topics table
  const { data: topicsData, error: tError } = await supabase
    .from('question_topics')
    .select('question_id, topic_id')
    .in('question_id', questionIds);

  if (tError) {
    throw new Error(`Failed to fetch question_topics from Supabase: ${tError.message}`);
  }

  // Build topic lookup map
  const topicMap = {};
  (topicsData || []).forEach(row => {
    if (!topicMap[row.question_id]) {
      topicMap[row.question_id] = [];
    }
    if (!topicMap[row.question_id].includes(row.topic_id)) {
      topicMap[row.question_id].push(row.topic_id);
    }
  });

  let singleCount = 0;
  let multipleCount = 0;
  let selectTwoCount = 0;
  let selectThreeCount = 0;

  // 3. Format question objects
  const formattedQuestions = questions.map(q => {
    let correctAnswersArr = [];
    if (Array.isArray(q.correct_answers) && q.correct_answers.length > 0) {
      correctAnswersArr = q.correct_answers.map(n => Number(n));
    } else if (typeof q.correct_answer === 'number') {
      correctAnswersArr = [q.correct_answer];
    }

    const isMultiple = q.question_type === 'multiple' || correctAnswersArr.length > 1;

    if (isMultiple) {
      multipleCount++;
      if (correctAnswersArr.length === 3) {
        selectThreeCount++;
      } else {
        selectTwoCount++;
      }
    } else {
      singleCount++;
    }

    const singleCorrectAnswer = typeof q.correct_answer === 'number' ? q.correct_answer : (correctAnswersArr[0] ?? 0);

    const options = [
      q.option_a,
      q.option_b,
      q.option_c,
      q.option_d,
      q.option_e,
      q.option_f
    ].filter(opt => opt != null && opt !== '');

    return {
      id: q.id,
      exam_code: q.exam_code || 'aws-saa-c03',
      difficulty: q.difficulty || 'Medium',
      type: isMultiple ? 'multiple' : 'single',
      question: q.question_text,
      options: options,
      correctAnswer: singleCorrectAnswer,
      correctAnswers: correctAnswersArr.length > 0 ? correctAnswersArr : [singleCorrectAnswer],
      explanation: q.explanation || '',
      topics: topicMap[q.id] || []
    };
  });

  // 4. Natural ID Sorting (e.g. q-saa-1, q-saa-2 ... q-saa-10 ... q-saa-45)
  formattedQuestions.sort((a, b) => {
    const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
    if (numA !== numB) {
      return numA - numB;
    }
    return a.id.localeCompare(b.id);
  });

  // 5. Save JSON export
  const resolvedOutputPath = path.resolve(outputPath);
  const outputDir = path.dirname(resolvedOutputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(resolvedOutputPath, JSON.stringify(formattedQuestions, null, 2), 'utf8');

  // Summary Output
  console.log('Export complete');
  console.log(`Questions exported: ${formattedQuestions.length}`);
  console.log(`Single-answer: ${singleCount}`);
  console.log(`Multiple-answer: ${multipleCount} (Select TWO: ${selectTwoCount}, Select THREE: ${selectThreeCount})`);
  console.log(`File: ${path.relative(projectRoot, resolvedOutputPath)}\n`);

  return {
    questions: formattedQuestions,
    topicMappingCount: (topicsData || []).length,
    outputPath: resolvedOutputPath
  };
}

export async function runExporter() {
  return exportQuestionsToFile();
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  runExporter().catch(err => {
    console.error('Unhandled error during question export:', err);
    process.exitCode = 1;
  });
}
