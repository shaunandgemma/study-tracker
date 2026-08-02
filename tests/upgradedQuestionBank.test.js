import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const upgradedBankPath = path.resolve('data/SAA-C03-question-bank-upgraded-250.json');

function loadUpgradedBank() {
  const content = fs.readFileSync(upgradedBankPath, 'utf-8');
  return JSON.parse(content);
}

const bank = loadUpgradedBank();

test('1. Bank contains exactly 250 questions', () => {
  assert.equal(bank.length, 250);
});

test('2. All question IDs in the bank are unique', () => {
  const ids = bank.map(q => q.id);
  assert.equal(new Set(ids).size, 250);
});

test('3. Question IDs q-saa-1 through q-saa-250 all exist', () => {
  const expectedIds = new Set(Array.from({ length: 250 }, (_, i) => `q-saa-${i + 1}`));
  const bankIds = new Set(bank.map(q => q.id));
  assert.deepEqual(bankIds, expectedIds);
});

test('4. All questions have valid difficulty values (Easy, Medium, or Hard)', () => {
  const validDiffs = new Set(['Easy', 'Medium', 'Hard']);
  for (const q of bank) {
    assert.ok(validDiffs.has(q.difficulty), `Question ${q.id} has invalid difficulty: ${q.difficulty}`);
  }
});

test('5. All questions have valid question types (single or multiple)', () => {
  const validTypes = new Set(['single', 'multiple']);
  for (const q of bank) {
    assert.ok(validTypes.has(q.type), `Question ${q.id} has invalid type: ${q.type}`);
  }
});

test('6. Correct single-answer schema (correctAnswers is null, correctAnswer is valid index)', () => {
  const singles = bank.filter(q => q.type === 'single');
  for (const q of singles) {
    assert.equal(q.correctAnswers, null, `Single question ${q.id} must have correctAnswers = null`);
    assert.ok(typeof q.correctAnswer === 'number', `Single question ${q.id} must have numeric correctAnswer`);
    assert.ok(q.correctAnswer >= 0 && q.correctAnswer < q.options.length, `Single question ${q.id} correctAnswer out of bounds`);
  }
});

test('7. Correct multiple-answer schema (correctAnswer is null, correctAnswers is array of valid indexes)', () => {
  const multiples = bank.filter(q => q.type === 'multiple');
  for (const q of multiples) {
    assert.equal(q.correctAnswer, null, `Multiple question ${q.id} must have correctAnswer = null`);
    assert.ok(Array.isArray(q.correctAnswers), `Multiple question ${q.id} must have array correctAnswers`);
    assert.ok(q.correctAnswers.length >= 2, `Multiple question ${q.id} must have at least 2 correct answers`);
    for (const ca of q.correctAnswers) {
      assert.ok(ca >= 0 && ca < q.options.length, `Multiple question ${q.id} index ${ca} out of bounds`);
    }
  }
});

test('8. All answer indexes exist in options array', () => {
  for (const q of bank) {
    const maxIdx = q.options.length - 1;
    if (q.type === 'single') {
      assert.ok(q.correctAnswer <= maxIdx);
    } else {
      for (const idx of q.correctAnswers) {
        assert.ok(idx <= maxIdx);
      }
    }
  }
});

test('9. All questions have valid option counts (at least 4 options)', () => {
  for (const q of bank) {
    assert.ok(Array.isArray(q.options) && q.options.length >= 4, `Question ${q.id} must have >= 4 options`);
  }
});

test('10. All questions have valid topic IDs', () => {
  for (const q of bank) {
    const ts = q.topics || (q.topic ? [q.topic] : []);
    assert.ok(Array.isArray(ts) && ts.length > 0, `Question ${q.id} missing topic IDs`);
    assert.ok(ts[0] && ts[0].length > 0, `Question ${q.id} topic ID is empty`);
  }
});

test('11. No empty question prompts', () => {
  for (const q of bank) {
    assert.ok(typeof q.question === 'string' && q.question.trim().length > 0, `Question ${q.id} prompt is empty`);
  }
});

test('12. No empty options', () => {
  for (const q of bank) {
    for (let i = 0; i < q.options.length; i++) {
      assert.ok(typeof q.options[i] === 'string' && q.options[i].trim().length > 0, `Question ${q.id} option ${i} is empty`);
    }
  }
});

test('13. No empty explanations', () => {
  for (const q of bank) {
    assert.ok(typeof q.explanation === 'string' && q.explanation.trim().length > 0, `Question ${q.id} explanation is empty`);
  }
});

test('14. Six named questions were modified with structured sections', () => {
  const namedIds = ['q-saa-41', 'q-saa-58', 'q-saa-70', 'q-saa-172', 'q-saa-174', 'q-saa-199'];
  const namedMap = new Map(bank.filter(q => namedIds.includes(q.id)).map(q => [q.id, q]));
  
  for (const id of namedIds) {
    const q = namedMap.get(id);
    assert.ok(q, `Named question ${id} missing from bank`);
    assert.ok(q.explanation.includes('Exam trigger:'), `Named question ${id} missing Exam trigger`);
    assert.ok(q.explanation.includes('Exam trap:'), `Named question ${id} missing Exam trap`);
    assert.ok(q.explanation.includes('Memory hook:'), `Named question ${id} missing Memory hook`);
  }
});

test('15. Between 40 and 50 early questions were upgraded', () => {
  const candidatesPath = path.resolve('data/early-question-upgrade-candidates.json');
  const candidates = JSON.parse(fs.readFileSync(candidatesPath, 'utf-8'));
  assert.ok(candidates.length >= 40 && candidates.length <= 50, `Upgraded candidates count (${candidates.length}) must be between 40 and 50`);
});

test('16. Multiple-answer correctAnswer is always null', () => {
  const multiples = bank.filter(q => q.type === 'multiple');
  for (const q of multiples) {
    assert.equal(q.correctAnswer, null);
  }
});

test('17. Single-answer correctAnswers is always null', () => {
  const singles = bank.filter(q => q.type === 'single');
  for (const q of singles) {
    assert.equal(q.correctAnswers, null);
  }
});
