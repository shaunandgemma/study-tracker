import {
  SAA_C03_DOMAINS,
  SAA_C03_FULL_MOCK_ALLOCATION,
  SAA_C03_DOMAIN_WEIGHTS,
  getPrimaryDomainIdForQuestion
} from '../data/saaC03DomainMapping.js';

/**
 * Utility functions for exam question shuffling and answer remapping.
 */

function shuffleArray(items, random = Math.random) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Randomly shuffles the answer OPTIONS for a single question and remaps
 * correctAnswer and correctAnswers indices to match the new option positions.
 *
 * @param {Object} question - The question object
 * @param {Function} random - Optional random number generator
 * @returns {Object} A new question object with shuffled options and remapped correct answer indices
 */
export function shuffleQuestionOptions(question, random = Math.random) {
  if (!question || !Array.isArray(question.options) || question.options.length <= 1) {
    return question;
  }

  // 1. Map options to objects tracking their original index
  const indexedOptions = question.options.map((text, originalIndex) => ({
    text,
    originalIndex
  }));

  // 2. Fisher-Yates shuffle options array
  const shuffledIndexedOptions = [...indexedOptions];
  for (let i = shuffledIndexedOptions.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffledIndexedOptions[i], shuffledIndexedOptions[j]] = [
      shuffledIndexedOptions[j],
      shuffledIndexedOptions[i]
    ];
  }

  // 3. Extract shuffled option texts
  const newOptions = shuffledIndexedOptions.map(item => item.text);

  // 4. Build index mapping: originalIndex -> newIndex
  const origToNewMap = {};
  shuffledIndexedOptions.forEach((item, newIndex) => {
    origToNewMap[item.originalIndex] = newIndex;
  });

  // 5. Retrieve original correct answers array
  const origCorrectAnswers = Array.isArray(question.correctAnswers) && question.correctAnswers.length > 0
    ? question.correctAnswers
    : (typeof question.correctAnswer === 'number' ? [question.correctAnswer] : [0]);

  // 6. Remap correct answer indices to their new positions and sort ascending
  const newCorrectAnswers = origCorrectAnswers
    .map(origIdx => origToNewMap[origIdx])
    .filter(idx => idx !== undefined)
    .sort((a, b) => a - b);

  // 7. Remap single correctAnswer index
  let newCorrectAnswer;
  if (typeof question.correctAnswer === 'number' && origToNewMap[question.correctAnswer] !== undefined) {
    newCorrectAnswer = origToNewMap[question.correctAnswer];
  } else if (newCorrectAnswers.length > 0) {
    newCorrectAnswer = newCorrectAnswers[0];
  } else {
    newCorrectAnswer = 0;
  }

  return {
    ...question,
    options: newOptions,
    correctAnswer: newCorrectAnswer,
    correctAnswers: newCorrectAnswers
  };
}

/**
 * Validates a prepared Full Mock against its fixed domain allocation.
 *
 * @param {Array} questions - Prepared Full Mock questions
 * @param {Object} allocation - Expected count keyed by domain ID
 * @returns {Object} Actual count keyed by domain ID
 */
export function validateFullMockSelection(
  questions,
  allocation = SAA_C03_FULL_MOCK_ALLOCATION
) {
  if (!Array.isArray(questions)) {
    throw new Error('Unable to start Full Mock: prepared questions must be an array.');
  }

  const expectedTotal = Object.values(allocation).reduce((sum, count) => sum + count, 0);
  if (questions.length !== expectedTotal) {
    throw new Error(
      `Unable to start Full Mock: expected exactly ${expectedTotal} questions, ` +
      `but prepared ${questions.length}.`
    );
  }

  const questionIds = questions.map(question => question?.id);
  if (questionIds.some(id => typeof id !== 'string' || !id)) {
    throw new Error('Unable to start Full Mock: every selected question must have an ID.');
  }
  if (new Set(questionIds).size !== questionIds.length) {
    throw new Error('Unable to start Full Mock: duplicate question IDs were selected.');
  }

  const actualCounts = Object.fromEntries(
    Object.keys(allocation).map(domainId => [domainId, 0])
  );

  questions.forEach(question => {
    const domainId = getPrimaryDomainIdForQuestion(question);
    if (!domainId || actualCounts[domainId] === undefined) {
      throw new Error(
        `Unable to start Full Mock: question ${question.id} has no valid primary SAA-C03 domain.`
      );
    }
    actualCounts[domainId] += 1;
  });

  Object.entries(allocation).forEach(([domainId, expectedCount]) => {
    if (actualCounts[domainId] !== expectedCount) {
      const domain = SAA_C03_DOMAINS.find(item => item.id === domainId);
      throw new Error(
        `Unable to start Full Mock: ${domain?.code || domainId} requires ` +
        `${expectedCount} questions, but ${actualCounts[domainId]} were selected.`
      );
    }
  });

  return actualCounts;
}

/**
 * Selects a fixed, domain-balanced 65-question SAA-C03 Full Mock.
 * Questions are randomized within each domain, then the combined selection is
 * shuffled so domains are not presented in blocks.
 *
 * @param {Array} questions - Complete SAA-C03 question bank
 * @param {Function} random - Optional random number generator
 * @returns {Array} Domain-balanced questions without option shuffling
 */
export function selectFullMockQuestions(questions, random = Math.random) {
  if (!Array.isArray(questions)) {
    throw new Error('Unable to start Full Mock: question bank must be an array.');
  }

  const questionIds = questions.map(question => question?.id);
  if (questionIds.some(id => typeof id !== 'string' || !id)) {
    throw new Error('Unable to start Full Mock: every bank question must have an ID.');
  }
  if (new Set(questionIds).size !== questionIds.length) {
    throw new Error('Unable to start Full Mock: the question bank contains duplicate IDs.');
  }

  const domainPools = Object.fromEntries(
    Object.keys(SAA_C03_FULL_MOCK_ALLOCATION).map(domainId => [domainId, []])
  );

  questions.forEach(question => {
    const domainId = getPrimaryDomainIdForQuestion(question);
    if (!domainId || !domainPools[domainId]) {
      throw new Error(
        `Unable to start Full Mock: question ${question.id} has no valid primary SAA-C03 domain.`
      );
    }
    domainPools[domainId].push(question);
  });

  const selectedQuestions = [];
  Object.entries(SAA_C03_FULL_MOCK_ALLOCATION).forEach(([domainId, requiredCount]) => {
    const pool = domainPools[domainId];
    if (pool.length < requiredCount) {
      const domain = SAA_C03_DOMAINS.find(item => item.id === domainId);
      throw new Error(
        `Unable to start Full Mock: ${domain?.code || domainId} requires ` +
        `${requiredCount} questions, but the bank contains only ${pool.length}.`
      );
    }

    selectedQuestions.push(...shuffleArray(pool, random).slice(0, requiredCount));
  });

  const shuffledSelection = shuffleArray(selectedQuestions, random);
  validateFullMockSelection(shuffledSelection);
  return shuffledSelection;
}

/**
 * Selects and prepares a fixed, domain-balanced SAA-C03 Full Mock.
 *
 * @param {Array} questions - Complete SAA-C03 question bank
 * @param {Function} random - Optional random number generator
 * @returns {Array} Prepared 65-question Full Mock
 */
export function prepareFullMockQuestions(questions, random = Math.random) {
  const selectedQuestions = selectFullMockQuestions(questions, random);
  const preparedQuestions = selectedQuestions.map(question =>
    shuffleQuestionOptions(question, random)
  );
  validateFullMockSelection(preparedQuestions);
  return preparedQuestions;
}

/**
 * Prepares questions for an exam attempt:
 * 1. Randomly shuffles the order of questions in the array.
 * 2. Optionally selects a maximum number of questions (e.g. 65 for full mock).
 * 3. Randomly shuffles the answer options for each selected question and remaps correct answer indices.
 *
 * @param {Array} questions - List of question objects
 * @param {number|null} maxCount - Optional maximum number of questions to select
 * @param {Function} random - Optional random number generator
 * @returns {Array} New list of question objects prepared for the exam attempt
 */
export function prepareExamQuestions(questions, maxCount = null, random = Math.random) {
  if (!Array.isArray(questions)) return [];

  // 1. Shuffle question order (Fisher-Yates)
  const shuffledQuestions = shuffleArray(questions, random);

  // 2. Select up to maxCount questions if specified
  const selectedQuestions = (typeof maxCount === 'number' && maxCount > 0)
    ? shuffledQuestions.slice(0, maxCount)
    : shuffledQuestions;

  // 3. Shuffle options and remap correct answer indices for each selected question
  return selectedQuestions.map(q => shuffleQuestionOptions(q, random));
}

/**
 * Calculates integer domain quotas for a requested custom exam count using
 * the Largest-Remainder Method (Hamilton / Hare-Niemeyer method).
 *
 * Official SAA-C03 domain weights:
 * - Domain 1: 30%
 * - Domain 2: 26%
 * - Domain 3: 24%
 * - Domain 4: 20%
 *
 * @param {number} requestedCount - Requested question count
 * @param {Object} weights - Map of domain ID to decimal weight
 * @returns {Object} Quota per domain ID totaling requestedCount
 */
export function allocateCustomExamDomainQuotas(
  requestedCount,
  weights = SAA_C03_DOMAIN_WEIGHTS
) {
  const domainIds = ['domain-1', 'domain-2', 'domain-3', 'domain-4'];
  const N = Math.max(0, Math.floor(Number(requestedCount) || 0));
  if (N === 0) {
    return Object.fromEntries(domainIds.map(id => [id, 0]));
  }

  const items = domainIds.map((id, index) => {
    const w = weights[id] || 0;
    const exact = N * w;
    const floor = Math.floor(exact);
    const remainder = exact - floor;
    return { id, index, exact, floor, remainder };
  });

  const baseSum = items.reduce((sum, item) => sum + item.floor, 0);
  let remainderNeeded = N - baseSum;

  const sorted = [...items].sort((a, b) => {
    if (Math.abs(b.remainder - a.remainder) > 1e-9) {
      return b.remainder - a.remainder;
    }
    return a.index - b.index;
  });

  const result = {};
  items.forEach(item => {
    result[item.id] = item.floor;
  });

  for (let i = 0; i < remainderNeeded; i++) {
    result[sorted[i % sorted.length].id] += 1;
  }

  return result;
}

/**
 * Selects questions for a Custom Exam according to specified configuration:
 * - 'balanced': domain balanced using Largest-Remainder + shortage redistribution
 * - 'random': uniform random selection across the bank
 * - 'all': all available bank questions without domain filtering
 *
 * @param {Array} questions - Available SAA-C03 question bank
 * @param {Object} options - Selection config options ({ count, selectionType })
 * @param {Function} random - Optional random number generator
 * @returns {Object} Result object containing questions, questionIds, requestedQuestionCount, actualQuestionCount, domainAllocation
 */
export function selectCustomExamQuestions(questions, options = {}, random = Math.random) {
  if (!Array.isArray(questions)) {
    throw new Error('Unable to select custom exam: question bank must be an array.');
  }

  const bankTotal = questions.length;
  const rawType = options.selectionType || 'balanced';
  const isAll = rawType === 'all' || options.count === 'all';
  const requestedCount = isAll ? bankTotal : Math.max(1, Math.floor(Number(options.count) || 1));
  const selectionType = isAll ? 'all' : rawType;

  const domainIds = ['domain-1', 'domain-2', 'domain-3', 'domain-4'];
  const domainPools = Object.fromEntries(domainIds.map(id => [id, []]));

  questions.forEach(q => {
    const domainId = getPrimaryDomainIdForQuestion(q);
    if (domainId && domainPools[domainId]) {
      domainPools[domainId].push(q);
    }
  });

  let selectedQuestions = [];
  let domainAllocation = {};

  if (selectionType === 'all') {
    selectedQuestions = shuffleArray(questions, random);
    domainAllocation = Object.fromEntries(domainIds.map(id => [id, 0]));
    selectedQuestions.forEach(q => {
      const dId = getPrimaryDomainIdForQuestion(q);
      if (dId && domainAllocation[dId] !== undefined) {
        domainAllocation[dId] += 1;
      }
    });
  } else if (selectionType === 'random') {
    const targetCount = Math.min(requestedCount, bankTotal);
    selectedQuestions = shuffleArray(questions, random).slice(0, targetCount);
    domainAllocation = Object.fromEntries(domainIds.map(id => [id, 0]));
    selectedQuestions.forEach(q => {
      const dId = getPrimaryDomainIdForQuestion(q);
      if (dId && domainAllocation[dId] !== undefined) {
        domainAllocation[dId] += 1;
      }
    });
  } else {
    // Balanced selection
    const targetCount = Math.min(requestedCount, bankTotal);
    const quotas = allocateCustomExamDomainQuotas(targetCount, SAA_C03_DOMAIN_WEIGHTS);

    const allocated = {};
    let shortage = 0;

    domainIds.forEach(d => {
      const poolLen = domainPools[d].length;
      const qNeeded = quotas[d];
      if (poolLen >= qNeeded) {
        allocated[d] = qNeeded;
      } else {
        allocated[d] = poolLen;
        shortage += (qNeeded - poolLen);
      }
    });

    // Redistribute shortage
    while (shortage > 0) {
      const candidateDomains = domainIds.filter(d => domainPools[d].length > allocated[d]);
      if (candidateDomains.length === 0) break;

      candidateDomains.sort((a, b) => {
        const idealA = targetCount * (SAA_C03_DOMAIN_WEIGHTS[a] || 0);
        const idealB = targetCount * (SAA_C03_DOMAIN_WEIGHTS[b] || 0);
        const deficitA = idealA - allocated[a];
        const deficitB = idealB - allocated[b];

        if (Math.abs(deficitB - deficitA) > 1e-9) {
          return deficitB - deficitA;
        }

        const orderA = domainIds.indexOf(a);
        const orderB = domainIds.indexOf(b);
        if (orderA !== orderB) {
          return orderA - orderB;
        }

        const remA = domainPools[a].length - allocated[a];
        const remB = domainPools[b].length - allocated[b];
        return remB - remA;
      });

      const winner = candidateDomains[0];
      allocated[winner] += 1;
      shortage -= 1;
    }

    // Pick questions from each domain pool
    const selectedList = [];
    domainIds.forEach(d => {
      const pool = domainPools[d];
      const countToTake = allocated[d];
      const shuffledPool = shuffleArray(pool, random);
      selectedList.push(...shuffledPool.slice(0, countToTake));
    });

    selectedQuestions = shuffleArray(selectedList, random);
    domainAllocation = allocated;
  }

  const questionIds = selectedQuestions.map(q => q.id);

  return {
    questions: selectedQuestions,
    questionIds,
    requestedQuestionCount: isAll ? bankTotal : requestedCount,
    actualQuestionCount: selectedQuestions.length,
    domainAllocation
  };
}

/**
 * Prepares custom exam questions with option shuffling.
 *
 * @param {Array} questions - Question bank
 * @param {Object} options - Selection options ({ count, selectionType })
 * @param {Function} random - Optional random number generator
 * @returns {Object} Custom exam selection result with option-shuffled questions
 */
export function prepareCustomExamQuestions(questions, options = {}, random = Math.random) {
  const result = selectCustomExamQuestions(questions, options, random);
  const preparedQuestions = result.questions.map(q => shuffleQuestionOptions(q, random));
  return {
    ...result,
    questions: preparedQuestions
  };
}
