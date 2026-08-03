import test from 'node:test';
import assert from 'node:assert/strict';

import {
  prepareExamQuestions,
  prepareFullMockQuestions,
  selectFullMockQuestions,
  validateFullMockSelection
} from '../src/utils/examUtils.js';
import {
  QUESTION_DOMAIN_MAP,
  SAA_C03_FULL_MOCK_ALLOCATION,
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
    topicIds: ['topic-s3', 'topic-rds']
  };
}

const completeBank = Object.keys(QUESTION_DOMAIN_MAP).map(createQuestion);

test('the primary-domain map covers the bank and has enough questions for every quota', () => {
  assert.ok(completeBank.length >= 250);

  const poolCounts = completeBank.reduce((counts, question) => {
    const domainId = getPrimaryDomainIdForQuestion(question);
    counts[domainId] = (counts[domainId] || 0) + 1;
    return counts;
  }, {});

  for (const [domainId, requiredCount] of Object.entries(SAA_C03_FULL_MOCK_ALLOCATION)) {
    assert.ok(
      poolCounts[domainId] >= requiredCount,
      `${domainId} has ${poolCounts[domainId]} questions but needs ${requiredCount}`
    );
  }
});

test('Full Mock preparation returns the exact allocation with unique IDs', () => {
  const prepared = prepareFullMockQuestions(completeBank, seededRandom(12345));
  const counts = validateFullMockSelection(prepared);

  assert.equal(prepared.length, 65);
  assert.equal(new Set(prepared.map(question => question.id)).size, 65);
  assert.deepEqual(counts, SAA_C03_FULL_MOCK_ALLOCATION);

  for (const question of prepared) {
    assert.equal(question.correctAnswers.length, 1);
    assert.equal(question.correctAnswer, question.correctAnswers[0]);
    assert.match(question.options[question.correctAnswer], / A$/);
  }
});

test('Full Mock selection randomizes questions within domains and shuffles the combined exam', () => {
  const first = selectFullMockQuestions(completeBank, seededRandom(1));
  const second = selectFullMockQuestions(completeBank, seededRandom(2));

  assert.notDeepEqual(
    first.map(question => question.id),
    second.map(question => question.id)
  );

  const domainSequence = first.map(getPrimaryDomainIdForQuestion);
  const blockedSequence = Object.entries(SAA_C03_FULL_MOCK_ALLOCATION)
    .flatMap(([domainId, count]) => Array(count).fill(domainId));
  assert.notDeepEqual(domainSequence, blockedSequence);
});

test('Full Mock selection stops when a domain pool is short', () => {
  const domainFourQuestions = completeBank.filter(
    question => getPrimaryDomainIdForQuestion(question) === 'domain-4'
  );
  const keepDomainFourIds = new Set(domainFourQuestions.slice(0, 12).map(question => question.id));
  const shortBank = completeBank.filter(question =>
    getPrimaryDomainIdForQuestion(question) !== 'domain-4' ||
    keepDomainFourIds.has(question.id)
  );

  assert.throws(
    () => selectFullMockQuestions(shortBank, seededRandom(7)),
    /Domain 4 requires 13 questions, but the bank contains only 12/
  );
});

test('Full Mock selection rejects duplicate and unmapped bank IDs', () => {
  assert.throws(
    () => selectFullMockQuestions([...completeBank, completeBank[0]], seededRandom(7)),
    /question bank contains duplicate IDs/
  );
  assert.throws(
    () => selectFullMockQuestions([...completeBank, { id: 'q-unmapped', type: 'single', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 }], seededRandom(7)),
    /question q-unmapped has no valid primary SAA-C03 domain/
  );
});

test('generic preparation remains available for targeted quizzes without domain balancing', () => {
  const targetedQuestions = [
    createQuestion('targeted-1'),
    createQuestion('targeted-2'),
    createQuestion('targeted-3')
  ];

  const prepared = prepareExamQuestions(targetedQuestions, null, seededRandom(99));

  assert.equal(prepared.length, targetedQuestions.length);
  assert.deepEqual(
    new Set(prepared.map(question => question.id)),
    new Set(targetedQuestions.map(question => question.id))
  );
});
