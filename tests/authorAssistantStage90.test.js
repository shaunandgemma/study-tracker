import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  buildAuthorHandoffPackage,
  validateStage90Inputs,
  verifyAuthorHandoffPackageFingerprint
} from '../scripts/author-assistant/authorAssistantHandoff.mjs';
import { saveAuthorAssistantHandoffPackage } from '../scripts/author-assistant/authorAssistantCore.mjs';
import { fingerprintJson } from '../scripts/author-assistant/authorAssistantStage84D.mjs';

const sessionId = 'author-assistant-synthetic-step-90';
const taskId = 'task-synthetic-create-001';
const phaseId = 'phase-1-prepare';
const sourceId = 'source-1-synthetic-guide';

function without(value, keys) {
  const copy = structuredClone(value);
  keys.forEach(key => delete copy[key]);
  return copy;
}

function fixture() {
  const acceptedSources = {
    sessionId,
    status: 'accepted',
    sources: [{ documentTitle: 'Synthetic guide', url: 'https://docs.aws.amazon.com/example/latest/guide.html', whyThisSourceApplies: 'Supports the Console task.' }]
  };
  const blueprint = {
    sessionId,
    status: 'human_accepted',
    programme: {
      serviceSlug: 'synthetic', serviceName: 'Amazon Synthetic Service', shortName: 'SYN', displayName: 'Synthetic Follow Along',
      subtitle: 'A safe beginner trial', description: 'Create and inspect one harmless test item.', learningOutcome: 'Create and inspect one harmless test item safely.',
      programmeId: 'synthetic-learning-path', pathId: 'synthetic-learning-path', componentNamespace: '', category: 'Application Integration',
      difficulty: 'Beginner', estimatedMinutes: 10, defaultRegion: 'eu-west-2', regionScope: 'regional', supportedModes: ['console'], publicationVisibility: 'unpublished'
    },
    phases: [{ id: phaseId, phaseNumber: 1, title: 'Prepare', description: 'Create and inspect the harmless test item.', taskIds: [taskId], isOptional: false }],
    sources: [{ id: sourceId, title: 'Synthetic guide', url: 'https://docs.aws.amazon.com/example/latest/guide.html', purpose: 'Supports the Console task.', taskIds: [taskId] }],
    tasks: [{ id: taskId, title: 'Create the test item', service: 'Amazon Synthetic Service', feature: 'Test item', goal: 'Create one harmless test item.', whyItMatters: 'This demonstrates the basic workflow safely.', difficulty: 'Easy', estimatedMinutes: 10, region: 'eu-west-2', phaseId, prerequisites: [], isOptional: false, sourceIds: [sourceId] }]
  };
  const blueprintAcceptance = { sessionId, status: 'accepted', decision: 'accept_local_stages_1_to_5_blueprint' };
  const sourceAmendment84B = { sessionId, status: 'applied_locally', approvalStep: '84B' };
  const consistencyCorrection84C = { sessionId, status: 'applied_locally', approvalStep: '84C' };

  const stageSix = {
    sessionId,
    status: 'human_accepted',
    tasks: [{
      taskId,
      modeAvailability: { console: { status: 'available', reason: '' }, cli: { status: 'not_applicable', reason: 'Console-only handoff.' } },
      consoleSteps: [{ id: 'step-create', stepNumber: 1, title: 'Create the item', instructions: [{ id: 'checkbox-open', text: 'Open the service Console.', detail: '' }], expectedResult: 'The test item is visible.', warning: '' }],
      cliSteps: []
    }],
    protectedSourceUrlsUsed: ['https://docs.aws.amazon.com/example/latest/guide.html'],
    manualReviewFindings: ['Use an account already authorized by an administrator.'],
    boundaryAlignment: { consoleOnly: true }
  };
  const stageSixFingerprint = fingerprintJson({ tasks: stageSix.tasks, protectedSourceUrlsUsed: stageSix.protectedSourceUrlsUsed, manualReviewFindings: stageSix.manualReviewFindings, boundaryAlignment: stageSix.boundaryAlignment });
  stageSix.acceptanceFingerprint = { algorithm: 'sha256-json-v1', value: stageSixFingerprint };
  const stageSixAcceptance = { sessionId, status: 'accepted', approvalStep: '84D', instructionFingerprint: { algorithm: 'sha256-json-v1', value: stageSixFingerprint } };

  const stageSeven = {
    sessionId,
    status: 'human_accepted',
    basedOnStage6Fingerprint: { ...stageSix.acceptanceFingerprint },
    stageBoundary: { preparedLocally: [7], notPrepared: [8, 9, 10, 11, 12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false, candidatePrepared: false, published: false },
    resources: { schema: [], interpolationAliases: {}, chargeableResourceKeys: [], variables: {} },
    tasks: [{ taskId, title: 'Create the test item', createdResourceKeys: [], verification: [{ id: 'verify-visible', title: 'Confirm the item', instruction: 'Inspect the Console list.', expectedResult: 'The test item is visible.', mode: 'console' }] }],
    evidence: { protectedSourceUrls: ['https://docs.aws.amazon.com/example/latest/guide.html'], resources: [], verifications: [{ taskId, verificationId: 'verify-visible', sourceUrls: ['https://docs.aws.amazon.com/example/latest/guide.html'] }] },
    consoleBoundary: { cliCommandsPrepared: false },
    futureCliBoundary: { prepared: false },
    manualReviewFindings: ['Use an account already authorized by an administrator.']
  };
  const stageSevenFingerprint = fingerprintJson({ basedOnStage6Fingerprint: stageSeven.basedOnStage6Fingerprint, stageBoundary: stageSeven.stageBoundary, resources: stageSeven.resources, tasks: stageSeven.tasks, evidence: stageSeven.evidence, consoleBoundary: stageSeven.consoleBoundary, futureCliBoundary: stageSeven.futureCliBoundary, manualReviewFindings: stageSeven.manualReviewFindings });
  stageSeven.acceptanceFingerprint = { algorithm: 'sha256-json-v1', value: stageSevenFingerprint };
  const stageSevenAcceptance = { sessionId, status: 'accepted', approvalStep: '85B', stageSevenFingerprint: { ...stageSeven.acceptanceFingerprint } };

  const cleanupStep = { id: 'cleanup-test-item', stepNumber: 1, title: 'Remove the test item', instruction: 'Delete only the harmless test item in the Console.', verification: 'Confirm the test item is no longer visible.', resourceKeys: [] };
  const programmeStep = { id: 'cleanup-acknowledgement', stepNumber: 1, title: 'Acknowledge cleanup', instruction: 'Record that manual cleanup is complete.', verification: 'The cleanup acknowledgement is recorded.', resourceKeys: [] };
  const stageEight = {
    sessionId,
    status: 'human_accepted',
    basedOnStage7Fingerprint: { ...stageSeven.acceptanceFingerprint },
    stageBoundary: { preparedLocally: [8], notPrepared: [9, 10, 11, 12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false, candidatePrepared: false, published: false },
    approvedCleanupTarget: { taskId, targetType: 'Synthetic test item', targetName: 'synthetic-test' },
    taskCleanup: { taskId, steps: [cleanupStep] },
    programmeCleanup: { steps: [programmeStep], completionGate: 'acknowledgement', manualOnly: true, ordering: 'reverse_dependency' },
    evidence: { protectedSourceUrls: ['https://docs.aws.amazon.com/example/latest/guide.html'], cleanupSteps: [] },
    futureCliBoundary: { prepared: false },
    manualReviewFindings: ['Use an account already authorized by an administrator.']
  };
  const stageEightFingerprint = fingerprintJson({ basedOnStage7Fingerprint: stageEight.basedOnStage7Fingerprint, stageBoundary: stageEight.stageBoundary, approvedCleanupTarget: stageEight.approvedCleanupTarget, taskCleanup: stageEight.taskCleanup, programmeCleanup: stageEight.programmeCleanup, evidence: stageEight.evidence, futureCliBoundary: stageEight.futureCliBoundary, manualReviewFindings: stageEight.manualReviewFindings });
  stageEight.acceptanceFingerprint = { algorithm: 'sha256-json-v1', value: stageEightFingerprint };
  const stageEightAcceptance = { sessionId, status: 'accepted', approvalStep: '86A', stageEightFingerprint: { ...stageEight.acceptanceFingerprint } };

  const supporting = { acceptedSources, blueprint, blueprintAcceptance, sourceAmendment84B, consistencyCorrection84C, stageSix, stageSixAcceptance, stageSeven, stageSevenAcceptance, stageEight, stageEightAcceptance };
  const supportingRecordFingerprints = Object.fromEntries(Object.entries(supporting).map(([key, value]) => [key, fingerprintJson(value)]));
  const stageNine = {
    sessionId,
    kind: 'author_stage_9_local_authoring_check',
    status: 'human_accepted',
    basedOnStage8Fingerprint: { ...stageEight.acceptanceFingerprint },
    checks: { packageIntegrity: { valid: true, supportingFingerprints: { ...supportingRecordFingerprints } } },
    summary: { passed: true, taskCount: 1, checkboxCount: 1, verificationCheckCount: 1, cleanupItemCount: 2, resourceValueCount: 0 },
    retainedManualReviewFindings: ['Use an account already authorized by an administrator.'],
    acceptedAt: '2026-08-10T10:00:00.000Z'
  };
  const stageNineFingerprint = fingerprintJson(without(stageNine, ['status', 'acceptedAt', 'acceptanceFingerprint']));
  stageNine.acceptanceFingerprint = { algorithm: 'sha256-json-v1', value: stageNineFingerprint };
  const stageNineAcceptance = { sessionId, status: 'accepted', approvalStep: '87A', stageNineFingerprint: { ...stageNine.acceptanceFingerprint }, supportingRecordFingerprints: { ...supportingRecordFingerprints } };

  const stageTen = {
    sessionId,
    status: 'human_accepted',
    basedOnStage9Fingerprint: { ...stageNine.acceptanceFingerprint },
    tasks: [{ id: taskId, goal: 'Create one harmless test item.', consoleSteps: stageSix.tasks[0].consoleSteps, verification: stageSeven.tasks[0].verification }],
    cleanup: { taskSteps: [cleanupStep], programmeSteps: [programmeStep] },
    summary: { taskCount: 1, checkboxCount: 1, verificationCheckCount: 1, cleanupItemCount: 2, availableModes: ['console'] },
    acceptedAt: '2026-08-10T10:05:00.000Z'
  };
  const stageTenFingerprint = fingerprintJson(without(stageTen, ['status', 'generatedAt', 'acceptedAt', 'acceptanceFingerprint']));
  stageTen.acceptanceFingerprint = { algorithm: 'sha256-json-v1', value: stageTenFingerprint };
  const stageTenAcceptance = { sessionId, status: 'accepted', approvalStep: '88B', stageTenFingerprint: { ...stageTen.acceptanceFingerprint }, taskCount: 1, checkboxCount: 1, verificationCheckCount: 1, cleanupItemCount: 2 };
  const correctionAudit88A = { sessionId, status: 'applied_locally', approvalStep: '88A', newFingerprints: { stageNine: stageNineFingerprint }, futureCliGuidancePreserved: true };

  const advisory = 'Use an authorized administrator-approved role.';
  const stageEleven = {
    sessionId,
    status: 'human_accepted',
    basedOnStage10Fingerprint: { ...stageTen.acceptanceFingerprint },
    reviewState: { learnerPreviewStatus: 'reviewed', reviewStatus: 'ready_for_approval', approvalDecision: 'pending', publicationVisibility: 'unpublished', publishStatus: 'not_published' },
    validations: { planning: { valid: true }, content: { valid: true }, structuredReview: { valid: true } },
    findings: [{ id: 'finding-1-use-an-authorized-administrator-approved-role', findingNumber: 1, section: 'warnings', priority: 'advisory', message: advisory, status: 'open', consolidatedFrom: ['Use an account already authorized by an administrator.'] }],
    summary: { openBlockingFindingCount: 0, openAdvisoryFindingCount: 1, resolvedFindingCount: 0 },
    safetyBoundary: { approvalPerformed: false, releaseCandidatePrepared: false, published: false, authorDraftWritten: false, awsConnected: false, supabaseConnected: false },
    acceptedAt: '2026-08-10T10:10:00.000Z'
  };
  const stageElevenFingerprint = fingerprintJson(without(stageEleven, ['status', 'reviewedAt', 'acceptedAt', 'acceptanceFingerprint']));
  stageEleven.acceptanceFingerprint = { algorithm: 'sha256-json-v1', value: stageElevenFingerprint };
  const stageElevenAcceptance = { sessionId, status: 'accepted', approvalStep: '89A', stageElevenFingerprint: { ...stageEleven.acceptanceFingerprint } };
  const session = {
    sessionId,
    status: 'stage_11_accepted',
    createdAt: '2026-08-10T09:00:00.000Z',
    inputs: { serviceName: 'Amazon Synthetic Service', shortName: 'SYN', learnerLevel: 'Beginner', buildOutcome: 'Create a harmless test item', preferredRegion: 'eu-west-2' },
    boundaries: { authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], stage11Accepted: true, stage12Prepared: false, authorDraftWritten: false, awsConnected: false, supabaseConnected: false, candidatePrepared: false, published: false }
  };
  return { session, ...supporting, stageNine, stageNineAcceptance, correctionAudit88A, stageTen, stageTenAcceptance, stageEleven, stageElevenAcceptance };
}

test('Step 90 local Author handoff package', async t => {
  await t.test('1. builds a fingerprinted identity-free Author handoff without beginning Stage 12', () => {
    const handoff = buildAuthorHandoffPackage(fixture(), { now: () => new Date('2026-08-10T12:00:00.000Z') });
    assert.equal(handoff.status, 'awaiting_human_handoff_review');
    assert.equal(verifyAuthorHandoffPackageFingerprint(handoff), true);
    assert.equal('draft' in handoff.authorDraftContent, false);
    assert.equal(handoff.identityBinding.assignedAuthorId, null);
    assert.equal(handoff.identityBinding.assignedDraftId, null);
    assert.equal(handoff.handoffBoundary.stage12Started, false);
    assert.equal(handoff.handoffBoundary.authorDraftWritten, false);
    assert.equal(handoff.handoffBoundary.candidateIdGenerated, false);
  });

  await t.test('2. preserves accepted Author content, checks, cleanup and fingerprint chain', () => {
    const inputs = fixture();
    const handoff = buildAuthorHandoffPackage(inputs);
    assert.deepEqual(handoff.authorDraftContent.programme, inputs.blueprint.programme);
    assert.deepEqual(handoff.authorDraftContent.phases, inputs.blueprint.phases);
    assert.deepEqual(handoff.authorDraftContent.sources, inputs.blueprint.sources);
    assert.deepEqual(handoff.authorDraftContent.tasks[0].consoleSteps, inputs.stageSix.tasks[0].consoleSteps);
    assert.deepEqual(handoff.authorDraftContent.tasks[0].verification, inputs.stageSeven.tasks[0].verification);
    assert.deepEqual(handoff.authorDraftContent.tasks[0].cleanup, inputs.stageEight.taskCleanup.steps);
    assert.deepEqual(handoff.authorDraftContent.cleanup.steps, inputs.stageEight.programmeCleanup.steps);
    assert.equal(handoff.acceptedFingerprintChain.stage11.value, inputs.stageElevenAcceptance.stageElevenFingerprint.value);
    assert.deepEqual(handoff.summary, { phaseCount: 1, taskCount: 1, checkboxCount: 1, verificationCheckCount: 1, cleanupItemCount: 2, learnerResourceValueCount: 0, officialAwsSourceCount: 1 });
  });

  await t.test('3. changed accepted content or a broken fingerprint chain stops the handoff', () => {
    const changed = fixture();
    changed.stageSix.tasks[0].consoleSteps[0].instructions[0].text = 'Changed after acceptance.';
    assert.throws(() => validateStage90Inputs(changed), /Stage 6 fingerprint no longer matches/);
    const broken = fixture();
    broken.stageEleven.basedOnStage10Fingerprint.value = '0'.repeat(64);
    assert.throws(() => validateStage90Inputs(broken), /Stage 11 fingerprint no longer matches|fingerprint chain is incomplete/);
  });

  await t.test('4. an external-write, candidate or Stage 12 boundary stops the handoff', () => {
    for (const field of ['authorDraftWritten', 'supabaseConnected', 'awsConnected', 'candidatePrepared', 'published']) {
      const inputs = fixture();
      inputs.session.boundaries[field] = true;
      assert.throws(() => validateStage90Inputs(inputs), /local-only handoff boundary changed/);
    }
    const stageTwelve = fixture();
    stageTwelve.session.boundaries.stage12Prepared = true;
    assert.throws(() => validateStage90Inputs(stageTwelve), /local-only handoff boundary changed/);
  });

  await t.test('5. save writes only the local handoff, preview and session boundary', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step90-'));
    try {
      const inputs = fixture();
      const directory = path.join(root, sessionId);
      await mkdir(directory);
      const acceptedPath = path.join(directory, 'accepted-stage-record.json');
      await writeFile(acceptedPath, '{"preserved":true}\n', 'utf8');
      const acceptedBefore = await readFile(acceptedPath, 'utf8');
      const handoff = buildAuthorHandoffPackage(inputs);
      const saved = await saveAuthorAssistantHandoffPackage({ sessionRoot: root, existingSession: inputs.session, handoffPackage: handoff, previewText: 'local preview', now: () => new Date('2026-08-10T12:05:00.000Z') });
      assert.equal(JSON.parse(await readFile(saved.packagePath, 'utf8')).kind, 'author_local_handoff_package');
      assert.equal(await readFile(saved.previewPath, 'utf8'), 'local preview');
      assert.equal(await readFile(acceptedPath, 'utf8'), acceptedBefore);
      const session = JSON.parse(await readFile(path.join(directory, 'session.json'), 'utf8'));
      assert.equal(session.status, 'handoff_package_ready_for_review');
      assert.equal(session.boundaries.handoffPackagePrepared, true);
      assert.equal(session.boundaries.stage12Prepared, false);
      assert.equal(session.boundaries.authorDraftWritten, false);
      assert.deepEqual((await readdir(directory)).sort(), ['accepted-stage-record.json', 'author-local-handoff-package.json', 'author-local-handoff-package.txt', 'session.json']);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('6. command has no AI, Author, Supabase, AWS, candidate or publishing write dependency', async () => {
    const command = await readFile(new URL('../scripts/author-assistant/prepareStage90.mjs', import.meta.url), 'utf8');
    assert.doesNotMatch(command, /OPENAI_API_KEY|fetch\s*\(|@supabase|aws-sdk|saveAuthorDraft|storeNewDraft|storeReleaseCandidate|publishReleaseCandidate/i);
    const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    assert.equal(packageJson.scripts['author-assistant:stage-90'], 'node scripts/author-assistant/prepareStage90.mjs');
  });
});
