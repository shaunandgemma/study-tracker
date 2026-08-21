import assert from 'node:assert/strict';
import test from 'node:test';
import { TERRAFORM_ASSOCIATE_EXAM } from '../src/data/exams/terraformAssociateExam.js';
import { TERRAFORM_ASSOCIATE_QUESTIONS } from '../src/data/exams/terraformAssociateQuestions.js';

const questions = TERRAFORM_ASSOCIATE_QUESTIONS;
const topicIds = new Set(TERRAFORM_ASSOCIATE_EXAM.topics.map(topic => topic.id));

function wordCount(value) {
  return String(value)
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

test('Terraform 004 question bank has valid exam-style structure and explanations', () => {
  assert.equal(questions.length, 100);
  assert.ok(questions.filter(question => question.type === 'multiple').length >= 20);

  for (const question of questions) {
    assert.ok(topicIds.has(question.topicId), `${question.id} has an unknown topic`);
    assert.match(question.difficulty, /^(Easy|Medium|Hard)$/);
    assert.ok(question.question.length >= 45, `${question.id} has an underspecified stem`);
    assert.ok(question.explanation.length >= 100, `${question.id} needs a fuller explanation`);
    assert.ok(question.options.length >= 4 && question.options.length <= 6);
    assert.equal(new Set(question.options).size, question.options.length, `${question.id} repeats an option`);

    const correct = question.type === 'multiple'
      ? question.correctAnswers
      : [question.correctAnswer];

    assert.ok(correct.length >= 1);
    assert.equal(new Set(correct).size, correct.length);
    for (const index of correct) {
      assert.ok(Number.isInteger(index) && index >= 0 && index < question.options.length);
    }

    if (question.type === 'multiple') {
      assert.match(question.question, /Select two\.$/);
      assert.equal(correct.length, 2);
    }
  }
});

test('correct choices do not reveal themselves as conspicuous length outliers', () => {
  for (const question of questions) {
    const correct = question.type === 'multiple'
      ? question.correctAnswers
      : [question.correctAnswer];
    const lengths = question.options.map(wordCount);
    const longestDistractor = Math.max(
      ...lengths.filter((unused, index) => !correct.includes(index))
    );

    for (const index of correct) {
      const conspicuous = lengths[index] >= longestDistractor * 1.6
        && lengths[index] - longestDistractor >= 4;
      assert.equal(
        conspicuous,
        false,
        `${question.id} correct option ${index} is a conspicuous length outlier`
      );
    }
  }
});

test('all eight official objective groups are represented', () => {
  const representedTopics = new Set(questions.map(question => question.topicId));
  assert.deepEqual(representedTopics, topicIds);
});

test('questions 51 through 100 cover every published Terraform 004 sub-objective', () => {
  const secondSet = questions.filter(question => {
    const number = Number(question.id.replace('q-tf004-', ''));
    return number >= 51 && number <= 100;
  });
  const expectedObjectives = TERRAFORM_ASSOCIATE_EXAM.topics
    .flatMap(topic => topic.items.map(item => item.id));
  const representedObjectives = new Set(secondSet.map(question => question.objectiveId));

  assert.equal(secondSet.length, 50);
  assert.equal(representedObjectives.size, expectedObjectives.length);
  for (const objectiveId of expectedObjectives) {
    assert.ok(representedObjectives.has(objectiveId), `missing ${objectiveId}`);
  }
});
