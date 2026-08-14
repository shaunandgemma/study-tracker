import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_EXAMS } from '../src/data/examData.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'awsKnowledgeGuide');
const exam = DEFAULT_EXAMS.find(candidate => candidate.id === 'aws-saa-c03');

if (!exam) throw new Error('AWS SAA-C03 exam was not found.');

let created = 0;
let preserved = 0;

for (const topic of exam.topics) {
  const folder = join(root, topic.id.replace(/^topic-/, ''));
  mkdirSync(folder, { recursive: true });

  for (const item of topic.items || []) {
    const target = join(folder, `${item.id}.js`);
    if (existsSync(target)) {
      preserved += 1;
      continue;
    }

    const details = JSON.stringify({
      id: item.id,
      topicId: topic.id,
      topicTitle: topic.title,
      objectiveCode: topic.code,
      title: item.text
    });
    writeFileSync(target, `import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';\n\nexport default createAwsKnowledgeGuide(${details});\n`, 'utf8');
    created += 1;
  }
}

console.log(`AWS Knowledge Guide scaffold complete: ${created} created, ${preserved} preserved.`);
