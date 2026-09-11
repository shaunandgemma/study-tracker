import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildSimpleHandoff,
  formatSimplePreview,
  saveSimpleHandoff,
  SIMPLE_AUTHOR_ASSISTANT_MODE
} from './authorAssistantSimple.mjs';
import { validateAuthorContent } from '../../src/features/followAlongAuthor/authorContent.js';
import { validateAuthorPlanning } from '../../src/features/followAlongAuthor/authorPlanning.js';
import { validateAuthorReview } from '../../src/features/followAlongAuthor/authorReview.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const baseSessionId = 'author-assistant-rds-451073fe-d52f-411e-9d7d-91c9d91bbbf4';
const outputSessionId = 'author-assistant-rds-training-user-numbered-20260825';
const baseDirectory = path.join(projectRoot, 'docs', 'author-assistant', 'handoffs', baseSessionId);
const outputRoot = path.join(projectRoot, 'docs', 'author-assistant', 'handoffs');
const basePackagePath = path.join(baseDirectory, 'author-local-handoff-package.json');
const expectedBaseFingerprint = 'e005cc6d7a4ca23d9ad3c1a828fef15a53de1805ac25dcdc6601510d7cf45988';
const targetTaskId = 'task-rds-protect-the-root-user-and-create-the-training-iam-user-001';
const targetStepId = `${targetTaskId}-console-step-1-create-the-dedicated-training-user`;

const replacement = Object.freeze({
  description: 'Use an existing administrator account with sufficient IAM permissions to create the dedicated training user fa-rds-alb-ec2-lab-user. The AWS root user is not used at any point.',
  instructions: [
    '1. Sign in to AWS using an existing administrator account with sufficient IAM permissions.',
    '2. Open IAM.',
    '3. Choose Users.',
    '4. Choose Create user.',
    '5. Enter fa-rds-alb-ec2-lab-user.',
    '6. Select Provide user access to the AWS Management Console.',
    '7. Select I want to create an IAM user.',
    '8. Choose Custom password and enter a unique, secure temporary password.',
    '9. Select User must create a new password at next sign-in.',
    '10. Choose Next.',
    '11. On Set permissions, attach no permissions policies and do not give the user administrator permissions. Choose Next.',
    '12. On Review and create, verify the user name and console-access settings, then choose Create user.',
    '13. Securely record the AWS account IAM user sign-in URL shown after the user is created.'
  ],
  warning: 'Do not give the training user administrator access. Only the permissions required for this Follow Along should be added. Do not record the temporary password in screenshots, Follow Along notes, or source files.',
  expectedResult: 'The dedicated fa-rds-alb-ec2-lab-user IAM user exists with console access and a required password change at first sign-in. It has no lab permissions yet and can be given only the permissions required for this Follow Along.'
});

function assertValid(result, label) {
  if (result.valid) return;
  const messages = result.errors.map(error => error.message).join('; ');
  throw new Error(`${label} validation failed: ${messages}`);
}

function exactChangePreview({ basePackage, handoffPackage, before, after }) {
  const lines = [
    'CONTROLLED RDS FOLLOW ALONG REVISION - REVIEW ONLY',
    '',
    `Programme: ${handoffPackage.updateTarget.displayName}`,
    `Programme ID: ${handoffPackage.updateTarget.programmeId}`,
    `Fail-closed base revision: ${handoffPackage.updateTarget.sourceRevision}`,
    `Fail-closed base content hash: ${handoffPackage.updateTarget.contentHash}`,
    `Base handoff fingerprint: ${basePackage.handoffFingerprint.value}`,
    `Proposed handoff fingerprint: ${handoffPackage.handoffFingerprint.value}`,
    `Task ID preserved: ${targetTaskId}`,
    `Step ID preserved: ${targetStepId}`,
    'Instruction IDs preserved: 13 of 13',
    '',
    'BEFORE',
    JSON.stringify(before, null, 2),
    '',
    'AFTER',
    JSON.stringify(after, null, 2),
    '',
    'BOUNDARY',
    '- Local review package only.',
    '- A matching local human-acceptance audit may be created after review; it does not write to the app or publish content.',
    '- No Author, Supabase, AWS, publication, deployment, learner-progress, or other Follow Along change was made.',
    '- Import must fail closed if the live RDS publication is no longer the recorded revision and content hash.',
    ''
  ];
  return lines.join('\n');
}

const basePackage = JSON.parse(await readFile(basePackagePath, 'utf8'));
if (basePackage.handoffFingerprint?.value !== expectedBaseFingerprint) {
  throw new Error('The verified RDS baseline package changed. No revision was created.');
}
if (
  basePackage.generationMode !== SIMPLE_AUTHOR_ASSISTANT_MODE.UPDATE
  || basePackage.updateTarget?.programmeId !== 'rds-learning-path'
  || basePackage.updateTarget?.sourceRevision !== 4
) {
  throw new Error('The RDS baseline identity or publication revision did not match. No revision was created.');
}

const authorDraftContent = structuredClone(basePackage.authorDraftContent);
const task = authorDraftContent.tasks.find(item => item.id === targetTaskId);
const step = task?.consoleSteps?.find(item => item.id === targetStepId);
if (!task || !step || step.instructions?.length !== replacement.instructions.length) {
  throw new Error('The exact RDS training-user step or its 13 instruction IDs did not match. No revision was created.');
}

const before = structuredClone(step);
step.description = replacement.description;
step.instruction = replacement.instructions[0];
step.instructions = step.instructions.map((instruction, index) => ({
  ...instruction,
  text: replacement.instructions[index]
}));
step.warning = replacement.warning;
step.expectedResult = replacement.expectedResult;
const after = structuredClone(step);

assertValid(validateAuthorPlanning(authorDraftContent), 'Planning');
assertValid(validateAuthorContent(authorDraftContent), 'Content');
assertValid(validateAuthorReview(authorDraftContent), 'Review');

const inputs = {
  generationMode: SIMPLE_AUTHOR_ASSISTANT_MODE.UPDATE,
  updateTarget: structuredClone(basePackage.updateTarget),
  serviceName: basePackage.updateTarget.serviceName,
  shortName: basePackage.updateTarget.shortName,
  learnerLevel: authorDraftContent.programme.difficulty,
  preferredRegion: authorDraftContent.programme.defaultRegion,
  updateRequest: 'Update only the Create the dedicated training user console step with the approved wording and numbered instruction text while preserving its functional checkboxes and IDs.'
};
const proposal = {
  kind: 'controlled_manual_content_revision',
  approvedScope: 'one_rds_console_step',
  baseHandoffFingerprint: expectedBaseFingerprint,
  targetTaskId,
  targetStepId
};
const now = () => new Date('2026-08-25T12:00:00.000Z');
const { session, handoffPackage } = buildSimpleHandoff({
  inputs,
  proposal,
  authorDraftContent,
  sessionId: outputSessionId,
  now
});
const previewText = formatSimplePreview(handoffPackage);
const files = await saveSimpleHandoff({ session, handoffPackage, previewText, root: outputRoot });
const changePreviewPath = path.join(path.dirname(files.packagePath), 'controlled-change-preview.txt');
await writeFile(changePreviewPath, exactChangePreview({ basePackage, handoffPackage, before, after }), 'utf8');

process.stdout.write(`${JSON.stringify({
  packagePath: files.packagePath,
  previewPath: files.previewPath,
  changePreviewPath,
  handoffFingerprint: handoffPackage.handoffFingerprint.value,
  baseRevision: handoffPackage.updateTarget.sourceRevision,
  acceptanceCreated: false,
  published: false
}, null, 2)}\n`);
