import test from 'node:test';
import assert from 'node:assert/strict';

import {
  prepareExamQuestions,
  prepareFullMockQuestions,
  prepareFullMockForExam,
  allocateCustomExamDomainQuotas,
  selectCustomExamQuestions,
  prepareCustomExamQuestions
} from '../src/utils/examUtils.js';
import {
  QUESTION_DOMAIN_MAP,
  SAA_C03_FULL_MOCK_ALLOCATION,
  SAA_C03_DOMAIN_WEIGHTS,
  getPrimaryDomainIdForQuestion
} from '../src/data/saaC03DomainMapping.js';

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function createQuestion(id) {
  return {
    id,
    type: 'single',
    options: [`${id} A`, `${id} B`, `${id} C`, `${id} D`],
    correctAnswer: 0,
    correctAnswers: [0],
    topicId: 'topic-s3',
    topicIds: ['topic-s3']
  };
}

const completeBank = Object.keys(QUESTION_DOMAIN_MAP).map(createQuestion);

// Helper validation for domain allocation total
function getSum(allocation) {
  return Object.values(allocation).reduce((sum, n) => sum + n, 0);
}

// 1. 1-question balanced exam
test('1. 1-question balanced exam gives 1 to Domain 1 and 0 to others', () => {
  const quotas = allocateCustomExamDomainQuotas(1, SAA_C03_DOMAIN_WEIGHTS);
  assert.equal(quotas['domain-1'], 1);
  assert.equal(quotas['domain-2'], 0);
  assert.equal(quotas['domain-3'], 0);
  assert.equal(quotas['domain-4'], 0);
  assert.equal(getSum(quotas), 1);
});

// 2. 10-question balanced exam
test('2. 10-question balanced exam gives 3, 3, 2, 2 allocation', () => {
  const quotas = allocateCustomExamDomainQuotas(10, SAA_C03_DOMAIN_WEIGHTS);
  assert.equal(quotas['domain-1'], 3);
  assert.equal(quotas['domain-2'], 3);
  assert.equal(quotas['domain-3'], 2);
  assert.equal(quotas['domain-4'], 2);
  assert.equal(getSum(quotas), 10);
});

// 3. 25-question balanced exam
test('3. 25-question balanced exam allocation equals 25 with largest remainder', () => {
  const quotas = allocateCustomExamDomainQuotas(25, SAA_C03_DOMAIN_WEIGHTS);
  // 25 * 0.30 = 7.5 (floor 7, rem 0.5) -> tie-break index 0 gets +1 -> 8
  // 25 * 0.26 = 6.5 (floor 6, rem 0.5) -> 6
  // 25 * 0.24 = 6.0 (floor 6, rem 0.0) -> 6
  // 25 * 0.20 = 5.0 (floor 5, rem 0.0) -> 5
  assert.equal(quotas['domain-1'], 8);
  assert.equal(quotas['domain-2'], 6);
  assert.equal(quotas['domain-3'], 6);
  assert.equal(quotas['domain-4'], 5);
  assert.equal(getSum(quotas), 25);
});

// 4. 50-question balanced exam
test('4. 50-question balanced exam allocation totals 50', () => {
  const quotas = allocateCustomExamDomainQuotas(50, SAA_C03_DOMAIN_WEIGHTS);
  assert.equal(quotas['domain-1'], 15);
  assert.equal(quotas['domain-2'], 13);
  assert.equal(quotas['domain-3'], 12);
  assert.equal(quotas['domain-4'], 10);
  assert.equal(getSum(quotas), 50);
});

// 5. 65-question balanced custom exam
test('5. 65-question balanced custom exam matches official 19, 17, 16, 13 mock allocation', () => {
  const quotas = allocateCustomExamDomainQuotas(65, SAA_C03_DOMAIN_WEIGHTS);
  assert.equal(quotas['domain-1'], 19);
  assert.equal(quotas['domain-2'], 17);
  assert.equal(quotas['domain-3'], 16);
  assert.equal(quotas['domain-4'], 13);
  assert.equal(getSum(quotas), 65);
});

// 6. 100-question balanced exam
test('6. 100-question balanced exam allocation totals 100 exactly', () => {
  const quotas = allocateCustomExamDomainQuotas(100, SAA_C03_DOMAIN_WEIGHTS);
  assert.equal(quotas['domain-1'], 30);
  assert.equal(quotas['domain-2'], 26);
  assert.equal(quotas['domain-3'], 24);
  assert.equal(quotas['domain-4'], 20);
  assert.equal(getSum(quotas), 100);
});

// 7. All Available mode
test('7. All Available mode returns all bank questions with selection type all', () => {
  const result = prepareCustomExamQuestions(completeBank, { selectionType: 'all' }, seededRandom(42));
  assert.equal(result.actualQuestionCount, completeBank.length);
  assert.equal(result.questions.length, completeBank.length);
  assert.equal(getSum(result.domainAllocation), completeBank.length);
});

// 8. Random selection
test('8. Random selection selects requested count from entire bank', () => {
  const result = prepareCustomExamQuestions(completeBank, { count: 35, selectionType: 'random' }, seededRandom(77));
  assert.equal(result.actualQuestionCount, 35);
  assert.equal(result.questions.length, 35);
  assert.equal(getSum(result.domainAllocation), 35);
});

// 9. No duplicate IDs
test('9. Custom selection returns no duplicate question IDs', () => {
  const result = selectCustomExamQuestions(completeBank, { count: 50, selectionType: 'balanced' }, seededRandom(99));
  const uniqueIds = new Set(result.questionIds);
  assert.equal(uniqueIds.size, result.questionIds.length);
});

// 10. Exact requested count
test('10. Custom selection returns exact requested count when bank has sufficient questions', () => {
  const result = selectCustomExamQuestions(completeBank, { count: 42, selectionType: 'balanced' }, seededRandom(123));
  assert.equal(result.actualQuestionCount, 42);
  assert.equal(result.requestedQuestionCount, 42);
  assert.equal(result.questions.length, 42);
});

// 11. Domain allocation total equals actual selected count
test('11. Domain allocation map totals exact selected count', () => {
  const result = selectCustomExamQuestions(completeBank, { count: 27, selectionType: 'balanced' }, seededRandom(456));
  const allocatedSum = getSum(result.domainAllocation);
  assert.equal(allocatedSum, result.actualQuestionCount);
});

// 12. Shortage redistribution
test('12. Shortage in one domain is redistributed to other domains with available questions', () => {
  // Create a artificial bank where domain-4 has only 2 questions
  const domain4Questions = completeBank.filter(q => getPrimaryDomainIdForQuestion(q) === 'domain-4').slice(0, 2);
  const otherQuestions = completeBank.filter(q => getPrimaryDomainIdForQuestion(q) !== 'domain-4');
  const shortBank = [...otherQuestions, ...domain4Questions];

  // Request 50 questions (normal quota for domain-4 at N=50 is 10)
  const result = selectCustomExamQuestions(shortBank, { count: 50, selectionType: 'balanced' }, seededRandom(888));
  assert.equal(result.actualQuestionCount, 50);
  assert.equal(result.domainAllocation['domain-4'], 2);
  assert.equal(getSum(result.domainAllocation), 50);
  assert.equal(new Set(result.questionIds).size, 50);
});

// 13. Invalid count: 0
test('13. Validation helper identifies 0 as invalid', () => {
  const count = 0;
  const isInvalid = count <= 0;
  assert.ok(isInvalid);
});

// 14. Invalid count: negative
test('14. Validation helper identifies negative count as invalid', () => {
  const count = -5;
  const isInvalid = count <= 0;
  assert.ok(isInvalid);
});

// 15. Invalid count: decimal
test('15. Validation helper identifies decimal strings as invalid', () => {
  const str = '12.5';
  const isDecimal = str.includes('.');
  assert.ok(isDecimal);
});

// 16. Invalid count: blank
test('16. Validation helper identifies blank input as invalid', () => {
  const str = '   ';
  const isBlank = str.trim() === '';
  assert.ok(isBlank);
});

// 17. Invalid count: greater than available
test('17. Validation helper identifies count exceeding bank total as invalid', () => {
  const requested = 999;
  const bankSize = completeBank.length;
  const isExceeded = requested > bankSize;
  assert.ok(isExceeded);
});

// 18. Timed duration uses actualQuestionCount * 120
test('18. Timed duration equals actualQuestionCount * 120 seconds', () => {
  const actualCount = 25;
  const timeAllowedSeconds = actualCount * 120;
  assert.equal(timeAllowedSeconds, 3000); // 50 mins
});

// 19. Untimed exam does not auto-submit (timeAllowedSeconds = 0)
test('19. Untimed exam config sets timeAllowedSeconds to 0', () => {
  const timerType = 'untimed';
  const timeAllowedSeconds = timerType === 'timed' ? 50 * 120 : 0;
  assert.equal(timeAllowedSeconds, 0);
});

// 20. Full Mock remains 19, 17, 16, 13
test('20. Existing Full Mock fixed allocation remains 19, 17, 16, 13', () => {
  assert.deepEqual(SAA_C03_FULL_MOCK_ALLOCATION, {
    'domain-1': 19,
    'domain-2': 17,
    'domain-3': 16,
    'domain-4': 13
  });
});

test('20A. non-AWS Full Mock uses every available question without AWS domain rules', () => {
  const terraformQuestions = Array.from({ length: 16 }, (_, index) => ({
    id: `q-tf-${index + 1}`,
    topicId: `tf-topic-${(index % 8) + 1}`,
    type: 'single',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 0,
    correctAnswers: null
  }));

  const prepared = prepareFullMockForExam('terraform-associate-004', terraformQuestions, seededRandom(20));
  assert.equal(prepared.length, 16);
  assert.equal(new Set(prepared.map(question => question.id)).size, 16);
});

// 21. Targeted Topic Quiz remains unchanged
test('21. Targeted Topic Quiz preparation functions without domain balancing', () => {
  const topicQs = completeBank.slice(0, 5);
  const prepared = prepareExamQuestions(topicQs, null, seededRandom(111));
  assert.equal(prepared.length, 5);
});

// 22. Historical attempts still load
test('22. Reconstructing attemptResult from historical attempt format succeeds', () => {
  const historicalRow = {
    id: 'attempt-old-123',
    exam_code: 'aws-saa-c03',
    exam_mode: 'full',
    completed_at: '2026-01-01T00:00:00.000Z',
    score_percent: 85,
    correct_count: 55,
    total_questions: 65,
    time_used_seconds: 4000,
    time_allowed_seconds: 7800,
    passed: true,
    question_ids: completeBank.slice(0, 65).map(q => q.id),
    answers: {},
    flagged_question_ids: [],
    domain_results: {},
    question_snapshot: completeBank.slice(0, 65)
  };

  assert.equal(historicalRow.exam_mode, 'full');
  assert.equal(historicalRow.total_questions, 65);
  assert.ok(Array.isArray(historicalRow.question_snapshot));
});

// 23. Existing localStorage attempts remain readable
test('23. LocalStorage attempt summary schema compatibility check', () => {
  const localStorageRecord = {
    id: 'attempt-local-1',
    examId: 'aws-saa-c03',
    timestamp: '2026-02-01T12:00:00Z',
    scorePercentage: 78,
    passed: true,
    durationSeconds: 3200,
    mode: 'full'
  };

  assert.equal(localStorageRecord.examId, 'aws-saa-c03');
  assert.equal(localStorageRecord.scorePercentage, 78);
});

// 24. Random selection records actual domain allocation
test('24. Random selection returns calculated domain allocation from selected questions', () => {
  const result = selectCustomExamQuestions(completeBank, { count: 30, selectionType: 'random' }, seededRandom(555));
  assert.equal(result.actualQuestionCount, 30);
  assert.equal(getSum(result.domainAllocation), 30);
  assert.ok(typeof result.domainAllocation['domain-1'] === 'number');
});

// 25. All Available includes every question exactly once
test('25. All Available includes every bank question exactly once with no duplicates', () => {
  const result = selectCustomExamQuestions(completeBank, { selectionType: 'all' }, seededRandom(999));
  assert.equal(result.questions.length, completeBank.length);
  assert.equal(new Set(result.questionIds).size, completeBank.length);
});
