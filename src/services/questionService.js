import { supabase } from '../lib/supabase';

export const PROTECTED_EXAM_QUESTION_IDS = Object.freeze([
  'aws-saa-c03',
  'terraform-associate-004',
  'comptia-sec-plus'
]);

const isProtectedExam = examCode => PROTECTED_EXAM_QUESTION_IDS.includes(examCode);

/**
 * Transforms raw database rows and topic mappings into the question structure
 * expected by QuizEngine. Supports 4, 5, or 6 options per question.
 */
function mapDatabaseToAppQuestion(q, topicMap) {
  const topicIds = topicMap[q.id] || [];

  let correctAnswersArray = [];
  if (Array.isArray(q.correct_answers) && q.correct_answers.length > 0) {
    correctAnswersArray = q.correct_answers.map(n => Number(n));
  } else if (typeof q.correct_answer === 'number') {
    correctAnswersArray = [q.correct_answer];
  }

  const isMultiple = q.question_type === 'multiple' || correctAnswersArray.length > 1;
  const singleCorrectAnswer = typeof q.correct_answer === 'number' ? q.correct_answer : (correctAnswersArray[0] ?? 0);

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
    topicId: topicIds[0] || null,
    topicIds: topicIds,
    difficulty: q.difficulty || 'Medium',
    type: isMultiple ? 'multiple' : 'single',
    question: q.question_text,
    options: options,
    correctAnswer: singleCorrectAnswer,
    correctAnswers: correctAnswersArray,
    explanation: q.explanation || ''
  };
}

function mapFallbackQuestions(examCode, localFallbackQuestions = null) {
  const sourceQuestions = Array.isArray(localFallbackQuestions)
    ? localFallbackQuestions
    : [];

  return sourceQuestions
    .map(q => ({
      ...q,
      topicId: q.topics?.[0] || q.topicId || null,
      topicIds: q.topics || (q.topicId ? [q.topicId] : [])
    }));
}

/**
 * Fetches all questions for a given exam code from Supabase, with local fallback.
 *
 * @param {string} examCode - The exam identifier, e.g., 'aws-saa-c03'
 * @returns {Promise<Array>} List of practice questions in application format
 */
export async function getExamQuestions(examCode, localFallbackQuestions = null) {
  try {
    const { data: questions, error: qError } = await supabase
      .from('exam_questions')
      .select('*')
      .eq('exam_code', examCode);

    if (!qError && questions && questions.length > 0) {
      const questionIds = questions.map(q => q.id);

      const { data: topicsData } = await supabase
        .from('question_topics')
        .select('question_id, topic_id')
        .in('question_id', questionIds);

      const topicMap = {};
      (topicsData || []).forEach(row => {
        if (!topicMap[row.question_id]) {
          topicMap[row.question_id] = [];
        }
        if (!topicMap[row.question_id].includes(row.topic_id)) {
          topicMap[row.question_id].push(row.topic_id);
        }
      });

      const sortedQuestions = [...questions].sort((a, b) => {
        const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
        return numA - numB;
      });

      return sortedQuestions.map(q => mapDatabaseToAppQuestion(q, topicMap));
    }

    if (!qError && isProtectedExam(examCode)) return [];
  } catch (err) {
    console.warn('[questionService] Failed to load protected questions from Supabase:', err);
  }

  return isProtectedExam(examCode)
    ? []
    : mapFallbackQuestions(examCode, localFallbackQuestions);
}

/**
 * Fetches questions mapped to a targeted topic ID for an exam code, with local fallback.
 *
 * @param {string} examCode - The exam identifier, e.g., 'aws-saa-c03'
 * @param {string} topicId - The targeted topic identifier, e.g., 'topic-s3'
 * @returns {Promise<Array>} List of practice questions mapped to topicId
 */
export async function getQuestionsByTopic(examCode, topicId, localFallbackQuestions = null) {
  try {
    // 1. Fetch matching question IDs from question_topics table
    const { data: matchingTopics, error: tError } = await supabase
      .from('question_topics')
      .select('question_id')
      .eq('topic_id', topicId);

    if (!tError && matchingTopics && matchingTopics.length > 0) {
      const distinctQuestionIds = Array.from(new Set(matchingTopics.map(m => m.question_id)));

      // 2. Fetch full question details for matching IDs filtered by exam code
      const { data: questions, error: qError } = await supabase
        .from('exam_questions')
        .select('*')
        .in('id', distinctQuestionIds)
        .eq('exam_code', examCode);

      if (!qError && questions && questions.length > 0) {
        const foundQuestionIds = questions.map(q => q.id);

        const { data: allTopicsData } = await supabase
          .from('question_topics')
          .select('question_id, topic_id')
          .in('question_id', foundQuestionIds);

        const topicMap = {};
        (allTopicsData || []).forEach(row => {
          if (!topicMap[row.question_id]) {
            topicMap[row.question_id] = [];
          }
          if (!topicMap[row.question_id].includes(row.topic_id)) {
            topicMap[row.question_id].push(row.topic_id);
          }
        });

        const sortedQuestions = [...questions].sort((a, b) => {
          const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
          const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
          return numA - numB;
        });

        return sortedQuestions.map(q => mapDatabaseToAppQuestion(q, topicMap));
      }
    }

    if (!tError && isProtectedExam(examCode)) return [];
  } catch (err) {
    console.warn('[questionService] Failed to load protected topic questions from Supabase:', err);
  }

  if (isProtectedExam(examCode)) return [];

  // Custom local exams may still use their explicitly supplied browser questions.
  return mapFallbackQuestions(examCode, localFallbackQuestions).filter(q =>
    q.topicId === topicId || (Array.isArray(q.topicIds) && q.topicIds.includes(topicId))
  );
}
