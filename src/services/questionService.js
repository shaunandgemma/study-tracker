import { supabase } from '../lib/supabase';

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

/**
 * Fetches all questions for a given exam code from Supabase.
 *
 * @param {string} examCode - The exam identifier, e.g., 'aws-saa-c03'
 * @returns {Promise<Array>} List of practice questions in application format
 */
export async function getExamQuestions(examCode) {
  // 1. Fetch questions for exam code
  const { data: questions, error: qError } = await supabase
    .from('exam_questions')
    .select('*')
    .eq('exam_code', examCode);

  if (qError) {
    console.error('Error fetching exam questions from Supabase:', qError);
    throw new Error('Unable to load exam questions from database.');
  }

  if (!questions || questions.length === 0) {
    return [];
  }

  const questionIds = questions.map(q => q.id);

  // 2. Fetch topic mappings for these questions
  const { data: topicsData, error: tError } = await supabase
    .from('question_topics')
    .select('question_id, topic_id')
    .in('question_id', questionIds);

  if (tError) {
    console.error('Error fetching question topics from Supabase:', tError);
    throw new Error('Unable to load question topics from database.');
  }

  // 3. Build topic lookup map preserving order
  const topicMap = {};
  (topicsData || []).forEach(row => {
    if (!topicMap[row.question_id]) {
      topicMap[row.question_id] = [];
    }
    if (!topicMap[row.question_id].includes(row.topic_id)) {
      topicMap[row.question_id].push(row.topic_id);
    }
  });

  // Sort questions by numerical ID if present (e.g. q-saa-1 ... q-saa-45)
  const sortedQuestions = [...questions].sort((a, b) => {
    const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

  return sortedQuestions.map(q => mapDatabaseToAppQuestion(q, topicMap));
}

/**
 * Fetches questions mapped to a targeted topic ID for an exam code.
 *
 * @param {string} examCode - The exam identifier, e.g., 'aws-saa-c03'
 * @param {string} topicId - The targeted topic identifier, e.g., 'topic-s3'
 * @returns {Promise<Array>} List of practice questions mapped to topicId
 */
export async function getQuestionsByTopic(examCode, topicId) {
  // 1. Fetch matching question IDs from question_topics table
  const { data: matchingTopics, error: tError } = await supabase
    .from('question_topics')
    .select('question_id')
    .eq('topic_id', topicId);

  if (tError) {
    console.error('Error fetching topic mappings from Supabase:', tError);
    throw new Error('Unable to load targeted topic mappings from database.');
  }

  if (!matchingTopics || matchingTopics.length === 0) {
    return [];
  }

  const distinctQuestionIds = Array.from(new Set(matchingTopics.map(m => m.question_id)));

  // 2. Fetch full question details for matching IDs filtered by exam code
  const { data: questions, error: qError } = await supabase
    .from('exam_questions')
    .select('*')
    .in('id', distinctQuestionIds)
    .eq('exam_code', examCode);

  if (qError) {
    console.error('Error fetching targeted topic questions from Supabase:', qError);
    throw new Error('Unable to load targeted topic questions from database.');
  }

  if (!questions || questions.length === 0) {
    return [];
  }

  const foundQuestionIds = questions.map(q => q.id);

  // 3. Fetch all topic mappings for these questions to rebuild complete topicIds arrays
  const { data: allTopicsData, error: allTError } = await supabase
    .from('question_topics')
    .select('question_id, topic_id')
    .in('question_id', foundQuestionIds);

  if (allTError) {
    console.error('Error fetching full topic mappings from Supabase:', allTError);
    throw new Error('Unable to load full topic mappings for targeted questions.');
  }

  const topicMap = {};
  (allTopicsData || []).forEach(row => {
    if (!topicMap[row.question_id]) {
      topicMap[row.question_id] = [];
    }
    if (!topicMap[row.question_id].includes(row.topic_id)) {
      topicMap[row.question_id].push(row.topic_id);
    }
  });

  // Sort by numerical ID
  const sortedQuestions = [...questions].sort((a, b) => {
    const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

  return sortedQuestions.map(q => mapDatabaseToAppQuestion(q, topicMap));
}
