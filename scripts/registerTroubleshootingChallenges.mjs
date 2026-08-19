import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repositoryRoot = path.resolve(import.meta.dirname, '..');
const challengeRoot = path.join(repositoryRoot, 'src', 'data', 'troubleshootingChallenges');
const generatedFile = path.join(challengeRoot, 'generatedChallengeCatalogue.js');

const ignoredFiles = new Set([
  'index.js',
  'generatedChallengeCatalogue.js'
]);

function findChallengeFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .flatMap(entry => {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) return findChallengeFiles(absolutePath);
      if (!entry.isFile() || path.extname(entry.name) !== '.js' || ignoredFiles.has(entry.name)) return [];
      return [absolutePath];
    })
    .sort((left, right) => left.localeCompare(right));
}

function requireText(challenge, field, relativePath) {
  if (typeof challenge[field] !== 'string' || !challenge[field].trim()) {
    throw new Error(`${relativePath}: ${field} must be non-empty text.`);
  }
}

function validateChallenge(challenge, relativePath) {
  if (!challenge || typeof challenge !== 'object') {
    throw new Error(`${relativePath}: the default export must be a challenge object.`);
  }

  [
    'id',
    'examId',
    'category',
    'title',
    'difficulty',
    'summary',
    'scenario',
    'task'
  ].forEach(field => requireText(challenge, field, relativePath));

  if (!Number.isInteger(challenge.order) || challenge.order < 1) {
    throw new Error(`${relativePath}: order must be a positive whole number.`);
  }

  if (!Array.isArray(challenge.evidence) || challenge.evidence.length < 2) {
    throw new Error(`${relativePath}: evidence must contain at least two items.`);
  }

  for (const evidence of challenge.evidence) {
    for (const field of ['id', 'title', 'kind', 'content']) requireText(evidence, field, relativePath);
    if (!['code', 'text'].includes(evidence.kind)) {
      throw new Error(`${relativePath}: evidence kind must be code or text.`);
    }
  }

  if (!Array.isArray(challenge.successCriteria) || challenge.successCriteria.length < 4) {
    throw new Error(`${relativePath}: successCriteria must contain at least four items.`);
  }

  if (!Array.isArray(challenge.hints) || challenge.hints.length !== 3) {
    throw new Error(`${relativePath}: hints must contain exactly three items.`);
  }

  if (!Array.isArray(challenge.validationQuestions) || challenge.validationQuestions.length !== 2) {
    throw new Error(`${relativePath}: validationQuestions must contain exactly two questions.`);
  }

  for (const question of challenge.validationQuestions) {
    for (const field of ['id', 'prompt', 'correctOptionId', 'explanation']) {
      requireText(question, field, relativePath);
    }
    if (!Array.isArray(question.options) || question.options.length !== 4) {
      throw new Error(`${relativePath}: every validation question must contain exactly four options.`);
    }
    for (const option of question.options) {
      requireText(option, 'id', relativePath);
      requireText(option, 'text', relativePath);
    }
    if (!question.options.some(option => option.id === question.correctOptionId)) {
      throw new Error(`${relativePath}: correctOptionId must match one question option.`);
    }
  }

  if (!challenge.solution || typeof challenge.solution !== 'object') {
    throw new Error(`${relativePath}: solution must be present.`);
  }
  ['rootCause', 'fix', 'prevention'].forEach(field => requireText(challenge.solution, field, relativePath));
}

const challengeFiles = findChallengeFiles(challengeRoot);
if (challengeFiles.length === 0) {
  throw new Error('No troubleshooting challenge files were found.');
}

const challenges = [];
for (const absolutePath of challengeFiles) {
  const relativePath = path.relative(challengeRoot, absolutePath).split(path.sep).join('/');
  const moduleUrl = `${pathToFileURL(absolutePath).href}?registration=${fs.statSync(absolutePath).mtimeMs}`;
  let challengeModule;
  try {
    challengeModule = await import(moduleUrl);
  } catch (error) {
    throw new Error(
      `${relativePath}: the challenge file could not be loaded. `
      + 'Terraform interpolation inside a JavaScript template string must escape its dollar sign. '
      + `Original error: ${error.message}`,
      { cause: error }
    );
  }
  validateChallenge(challengeModule.default, relativePath);
  challenges.push({ absolutePath, relativePath, challenge: challengeModule.default });
}

const seenIds = new Map();
const seenExamOrders = new Map();
for (const entry of challenges) {
  const existingId = seenIds.get(entry.challenge.id);
  if (existingId) {
    throw new Error(`Duplicate challenge ID ${entry.challenge.id}: ${existingId} and ${entry.relativePath}.`);
  }
  seenIds.set(entry.challenge.id, entry.relativePath);

  const examOrder = `${entry.challenge.examId}:${entry.challenge.order}`;
  const existingOrder = seenExamOrders.get(examOrder);
  if (existingOrder) {
    throw new Error(`Duplicate order ${entry.challenge.order} for ${entry.challenge.examId}: ${existingOrder} and ${entry.relativePath}.`);
  }
  seenExamOrders.set(examOrder, entry.relativePath);
}

const examOrders = new Map();
for (const entry of challenges) {
  const entries = examOrders.get(entry.challenge.examId) || [];
  entries.push(entry);
  examOrders.set(entry.challenge.examId, entries);
}
for (const [examId, entries] of examOrders) {
  const orders = entries.map(entry => entry.challenge.order).sort((left, right) => left - right);
  const expectedOrders = Array.from({ length: orders.length }, (_, index) => index + 1);
  if (orders.some((order, index) => order !== expectedOrders[index])) {
    throw new Error(`${examId}: challenge order numbers must be continuous from 1. Found ${orders.join(', ')}.`);
  }
}

const imports = challenges.map((entry, index) => (
  `import challenge${index + 1} from './${entry.relativePath}';`
));
const identifiers = challenges.map((_, index) => `  challenge${index + 1}`);
const generatedContent = `${[
  '// This file is generated by scripts/registerTroubleshootingChallenges.mjs.',
  '// Add or edit challenge files in the exam subfolders, then run npm run troubleshooting:register.',
  ...imports,
  '',
  'export default Object.freeze([',
  identifiers.join(',\n'),
  ']);',
  ''
].join('\n')}`;

const existingContent = fs.existsSync(generatedFile) ? fs.readFileSync(generatedFile, 'utf8') : '';
if (existingContent !== generatedContent) {
  fs.writeFileSync(generatedFile, generatedContent, 'utf8');
  console.log(`Registered ${challenges.length} troubleshooting challenges.`);
  console.log(`Updated: ${generatedFile}`);
} else {
  console.log(`Troubleshooting catalogue already contains all ${challenges.length} challenge files.`);
}
