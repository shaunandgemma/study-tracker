import { supabase } from '../lib/supabase';

/**
 * The current question bank version identifier for AWS SAA-C03.
 * Increment this (e.g. 'saa-c03-v2') when the question bank is updated,
 * so historical attempts can be identified against the bank version
 * that was active when they were taken.
 */
export const QUESTION_BANK_VERSION = 'saa-c03-v1';

/**
 * Saves a completed exam attempt to Supabase exam_attempts table.
 *
 * exam_mode values:
 *   'full'     — Full 65-question Mock Exam
 *   'targeted' — Targeted Topic Quiz (single topic/service)
 *
 * The question_snapshot stores the exact shuffled questions as presented to the
 * user during the attempt. This allows historical review to reconstruct the
 * exact option order and correct-answer mappings without re-shuffling.
 *
 * @param {Object} attemptData - Full attempt data to persist
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function saveAttemptToSupabase(attemptData) {
  const {
    id,
    examCode,
    examMode,
    topicId,
    completedAt,
    scorePercent,
    correctCount,
    totalQuestions,
    timeUsedSeconds,
    timeAllowedSeconds,
    passed,
    questionIds,
    answers,
    flaggedQuestionIds,
    domainResults,
    questionSnapshot,
    questionBankVersion,
    selectionType,
    requestedQuestionCount,
    actualQuestionCount,
    timerType,
    domainAllocation
  } = attemptData;

  const basePayload = {
    id,
    exam_code: examCode,
    exam_mode: examMode,                         // 'full' | 'targeted' | 'custom'
    topic_id: topicId || null,
    completed_at: completedAt,
    score_percent: scorePercent,
    correct_count: correctCount,
    total_questions: totalQuestions,
    time_used_seconds: timeUsedSeconds,
    time_allowed_seconds: timeAllowedSeconds,
    passed,
    question_ids: questionIds,
    answers,
    flagged_question_ids: flaggedQuestionIds || [],
    domain_results: domainResults || null,
    question_snapshot: questionSnapshot,
    question_bank_version: questionBankVersion || QUESTION_BANK_VERSION
  };

  const richPayload = {
    ...basePayload,
    ...(selectionType ? { selection_type: selectionType } : {}),
    ...(requestedQuestionCount !== undefined ? { requested_question_count: requestedQuestionCount } : {}),
    ...(actualQuestionCount !== undefined ? { actual_question_count: actualQuestionCount } : {}),
    ...(timerType ? { timer_type: timerType } : {}),
    ...(domainAllocation ? { domain_allocation: domainAllocation } : {})
  };

  let { data, error } = await supabase
    .from('exam_attempts')
    .insert([richPayload])
    .select()
    .single();

  // Fallback if dedicated columns don't exist on older database schema
  if (error && (error.code === 'PGRST204' || error.message?.includes('column'))) {
    const fallbackRes = await supabase
      .from('exam_attempts')
      .insert([basePayload])
      .select()
      .single();
    data = fallbackRes.data;
    error = fallbackRes.error;
  }

  if (error) {
    console.error('[attemptService] Failed to save exam attempt to Supabase:', error);
  }

  return { data, error };
}

/**
 * Fetches all saved exam attempts for a given exam code from Supabase,
 * ordered by completion date (newest first).
 *
 * @param {string} examCode - The exam identifier, e.g., 'aws-saa-c03'
 * @returns {Promise<Array>} List of attempt records
 */
export async function fetchAttemptsFromSupabase(examCode) {
  const { data, error } = await supabase
    .from('exam_attempts')
    .select('*')
    .eq('exam_code', examCode)
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('[attemptService] Failed to fetch exam attempts from Supabase:', error);
    return [];
  }

  return data || [];
}
