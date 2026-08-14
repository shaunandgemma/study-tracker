import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { DEFAULT_EXAMS } from '../src/data/examData.js';

test('AWS SAA-C03 Knowledge Guide scaffold mirrors every checklist row', () => {
  const exam = DEFAULT_EXAMS.find(candidate => candidate.id === 'aws-saa-c03');
  const rows = exam.topics.flatMap(topic => (topic.items || []).map(item => ({ topic, item })));
  assert.equal(rows.length, 1547);
  for (const { topic, item } of rows) {
    const folder = topic.id.replace(/^topic-/, '');
    assert.equal(existsSync(`src/data/awsKnowledgeGuide/${folder}/${item.id}.js`), true);
  }
});
