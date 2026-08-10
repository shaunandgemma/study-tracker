import { createHash } from 'node:crypto';

const EXPECTED_TASK_COUNT = 6;
const EXPECTED_CHECKBOX_COUNT = 24;
const CANONICAL_QUEUE_NAME = 'sqs-beginner-test';
const OBSOLETE_QUEUE_NAME = 'beginner-test-queue';

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function fingerprintJson(value) {
  return createHash('sha256').update(stableStringify(value), 'utf8').digest('hex');
}

function checkboxCount(instructions) {
  return instructions.tasks.reduce((total, task) => total + task.consoleSteps.reduce(
    (taskTotal, step) => taskTotal + step.instructions.length,
    0
  ), 0);
}

export function validateStage84DAcceptanceInputs({
  session,
  acceptedSources,
  blueprint,
  instructions,
  blueprintAcceptance,
  sourceAmendmentAudit,
  consistencyAudit
} = {}) {
  const sessionId = session?.sessionId;
  if (
    !sessionId
    || session.status !== 'stage_6_ready_for_review'
    || session.inputs?.shortName !== 'SQS'
    || acceptedSources?.sessionId !== sessionId
    || blueprint?.sessionId !== sessionId
    || instructions?.sessionId !== sessionId
    || blueprintAcceptance?.sessionId !== sessionId
    || sourceAmendmentAudit?.sessionId !== sessionId
    || consistencyAudit?.sessionId !== sessionId
  ) {
    throw new Error('Step 84D requires the complete matching local SQS review records.');
  }
  if (
    instructions.status !== 'awaiting_human_stage_6_review'
    || blueprint.status !== 'human_accepted'
    || blueprintAcceptance.status !== 'accepted'
    || sourceAmendmentAudit.status !== 'applied_locally'
    || sourceAmendmentAudit.approvalStep !== '84B'
    || consistencyAudit.status !== 'applied_locally'
    || consistencyAudit.approvalStep !== '84C'
    || consistencyAudit.stage6Accepted !== false
  ) {
    throw new Error('Step 84D requires the completed Steps 83A, 84B and 84C review boundary.');
  }
  if (
    session.boundaries?.authorDraftWritten !== false
    || session.boundaries?.stage7Prepared !== false
    || instructions.stageBoundary?.writtenToAuthor !== false
    || instructions.stageBoundary?.connectedToSupabase !== false
    || instructions.stageBoundary?.connectedToAws !== false
    || instructions.stageBoundary?.notPrepared?.join(',') !== '7,8,9,10,11,12'
  ) {
    throw new Error('Step 84D stopped because a safety boundary changed.');
  }
  if (
    !Array.isArray(instructions.tasks)
    || instructions.tasks.length !== EXPECTED_TASK_COUNT
    || instructions.tasks.some(task => task.status !== 'prepared')
    || checkboxCount(instructions) !== EXPECTED_CHECKBOX_COUNT
  ) {
    throw new Error('Step 84D requires exactly six prepared tasks and 24 checkboxes.');
  }
  const instructionText = JSON.stringify(instructions.tasks);
  if (instructionText.includes(OBSOLETE_QUEUE_NAME) || !instructionText.includes(CANONICAL_QUEUE_NAME)) {
    throw new Error('Step 84D stopped because the canonical queue-name correction is missing.');
  }
  if (!acceptedSources.manualReviewResolutions?.some(item => item.approvalStep === '84C' && item.status === 'resolved')) {
    throw new Error('Step 84D requires the resolved Region-source finding.');
  }
  if (!acceptedSources.manualReviewFindings?.some(finding => /least-privilege IAM policy document/i.test(finding))) {
    throw new Error('Step 84D requires the active IAM warning.');
  }
  return { taskCount: instructions.tasks.length, checkboxCount: checkboxCount(instructions) };
}

export function buildStage84DLocalAcceptance({
  session,
  acceptedSources,
  blueprint,
  instructions,
  blueprintAcceptance,
  sourceAmendmentAudit,
  consistencyAudit,
  now = () => new Date()
} = {}) {
  const counts = validateStage84DAcceptanceInputs({
    session,
    acceptedSources,
    blueprint,
    instructions,
    blueprintAcceptance,
    sourceAmendmentAudit,
    consistencyAudit
  });
  const acceptedAt = now().toISOString();
  const fingerprintContent = {
    tasks: instructions.tasks,
    protectedSourceUrlsUsed: instructions.protectedSourceUrlsUsed,
    manualReviewFindings: instructions.manualReviewFindings,
    boundaryAlignment: instructions.boundaryAlignment
  };
  const instructionFingerprint = fingerprintJson(fingerprintContent);
  const acceptedInstructions = {
    ...instructions,
    status: 'human_accepted',
    acceptedAt,
    acceptanceFingerprint: {
      algorithm: 'sha256-json-v1',
      value: instructionFingerprint
    }
  };
  const updatedSession = {
    ...session,
    status: 'stage_6_accepted',
    currentStep: 'local_stage_6_instructions_accepted',
    updatedAt: acceptedAt,
    boundaries: {
      ...session.boundaries,
      authorDraftWritten: false,
      stage6Prepared: true,
      stage6Accepted: true,
      stage7Prepared: false
    }
  };
  const acceptance = {
    schemaVersion: 1,
    kind: 'author_stage_6_human_acceptance',
    status: 'accepted',
    sessionId: session.sessionId,
    approvalStep: '84D',
    acceptedAt,
    instructionFingerprint: {
      algorithm: 'sha256-json-v1',
      value: instructionFingerprint
    },
    taskCount: counts.taskCount,
    checkboxCount: counts.checkboxCount,
    supportFingerprints: {
      acceptedSources: fingerprintJson(acceptedSources),
      blueprint: fingerprintJson(blueprint),
      blueprintAcceptance: fingerprintJson(blueprintAcceptance),
      sourceAmendment84B: fingerprintJson(sourceAmendmentAudit),
      consistencyCorrection84C: fingerprintJson(consistencyAudit)
    },
    supportRecordsChanged: false,
    wroteToAuthor: false,
    beganStage7: false
  };
  return { session: updatedSession, instructions: acceptedInstructions, acceptance, fingerprintContent };
}

export function verifyStage84DAcceptanceFingerprint(instructions, acceptance) {
  const fingerprintContent = {
    tasks: instructions.tasks,
    protectedSourceUrlsUsed: instructions.protectedSourceUrlsUsed,
    manualReviewFindings: instructions.manualReviewFindings,
    boundaryAlignment: instructions.boundaryAlignment
  };
  return fingerprintJson(fingerprintContent) === acceptance?.instructionFingerprint?.value;
}
