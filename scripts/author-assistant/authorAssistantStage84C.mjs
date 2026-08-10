const OLD_QUEUE_NAME = 'beginner-test-queue';
const CANONICAL_QUEUE_NAME = 'sqs-beginner-test';
const SAFE_SCOPE_TASK_ID = 'task-sqs-confirm-safe-scope-and-required-access-001';
const REGION_SOURCE_URL = 'https://docs.aws.amazon.com/awsconsolehelpdocs/latest/gsg/select-region.html';

function countOccurrences(value, wanted) {
  return String(value).split(wanted).length - 1;
}

export function validateStage84CInputs({ session, acceptedSources, blueprint, instructions, sourceAmendmentAudit } = {}) {
  if (
    session?.status !== 'stage_6_ready_for_review'
    || session?.inputs?.shortName !== 'SQS'
    || acceptedSources?.sessionId !== session.sessionId
    || blueprint?.sessionId !== session.sessionId
    || instructions?.sessionId !== session.sessionId
    || sourceAmendmentAudit?.sessionId !== session.sessionId
    || sourceAmendmentAudit?.approvalStep !== '84B'
    || sourceAmendmentAudit?.status !== 'applied_locally'
    || instructions?.boundaryAlignment?.approvalStep !== '84B'
  ) {
    throw new Error('Step 84C requires the matching completed Step 84B local session.');
  }
  if (
    session.boundaries?.authorDraftWritten !== false
    || session.boundaries?.stage7Prepared !== false
    || instructions.stageBoundary?.writtenToAuthor !== false
    || instructions.stageBoundary?.notPrepared?.join(',') !== '7,8,9,10,11,12'
  ) {
    throw new Error('Step 84C stopped because a safety boundary changed.');
  }
  const safeTask = instructions.tasks.find(task => task.taskId === SAFE_SCOPE_TASK_ID);
  if (!safeTask || safeTask.status !== 'prepared') throw new Error('The Step 84C safe-scope task is not ready.');
  const serializedTask = JSON.stringify(safeTask);
  if (countOccurrences(serializedTask, OLD_QUEUE_NAME) !== 2 || countOccurrences(serializedTask, CANONICAL_QUEUE_NAME) !== 0) {
    throw new Error('Step 84C stopped because the expected single queue-name checkbox changed.');
  }
  const regionFinding = acceptedSources.manualReviewFindings?.find(finding => /sources found do not provide.*selecting the preferred Region/i.test(finding));
  const iamFinding = acceptedSources.manualReviewFindings?.find(finding => /least-privilege IAM policy document/i.test(finding));
  if (!regionFinding || !iamFinding) throw new Error('Step 84C could not confirm the historical Region and active IAM findings.');
  if (!acceptedSources.sources.some(source => source.url === REGION_SOURCE_URL)) {
    throw new Error('Step 84C cannot resolve the Region finding without the approved Region source.');
  }
  if (acceptedSources.manualReviewResolutions?.some(item => item.approvalStep === '84C')) {
    throw new Error('Step 84C has already been applied.');
  }
  return { safeTask, regionFinding, iamFinding };
}

export function buildStage84CLocalCorrection({
  session,
  acceptedSources,
  blueprint,
  instructions,
  sourceAmendmentAudit,
  now = () => new Date()
} = {}) {
  const { regionFinding, iamFinding } = validateStage84CInputs({
    session,
    acceptedSources,
    blueprint,
    instructions,
    sourceAmendmentAudit
  });
  const appliedAt = now().toISOString();
  const correctedInstructions = structuredClone(instructions);
  const safeTask = correctedInstructions.tasks.find(task => task.taskId === SAFE_SCOPE_TASK_ID);
  const nameStep = safeTask.consoleSteps.find(step => step.instructions?.some(item => item.text.includes(OLD_QUEUE_NAME)));
  const nameInstruction = nameStep?.instructions?.find(item => item.text.includes(OLD_QUEUE_NAME));
  if (!nameStep || !nameInstruction) throw new Error('Step 84C could not find the approved queue-name checkbox.');
  nameInstruction.text = nameInstruction.text.replace(OLD_QUEUE_NAME, CANONICAL_QUEUE_NAME);
  nameStep.instruction = nameStep.instructions.map(item => item.text.trim()).filter(Boolean).join('\n');

  const correctedAcceptedSources = {
    ...acceptedSources,
    manualReviewResolutions: [
      ...(acceptedSources.manualReviewResolutions || []),
      {
        approvalStep: '84C',
        status: 'resolved',
        resolvedAt: appliedAt,
        finding: regionFinding,
        resolution: 'Resolved by the exact AWS Management Console Region-selection source accepted in Step 84B.',
        supportingSourceUrls: [REGION_SOURCE_URL]
      }
    ]
  };
  const updatedSession = {
    ...session,
    status: 'stage_6_ready_for_review',
    currentStep: 'local_stage_6_instruction_review',
    updatedAt: appliedAt,
    boundaries: {
      ...session.boundaries,
      authorDraftWritten: false,
      stage6Prepared: true,
      stage7Prepared: false
    }
  };
  const audit = {
    schemaVersion: 1,
    kind: 'author_stage_6_consistency_correction',
    status: 'applied_locally',
    sessionId: session.sessionId,
    approvalStep: '84C',
    appliedAt,
    taskId: SAFE_SCOPE_TASK_ID,
    changedInstructionId: nameInstruction.id,
    oldQueueName: OLD_QUEUE_NAME,
    canonicalQueueName: CANONICAL_QUEUE_NAME,
    historicalFindingPreserved: regionFinding,
    historicalFindingStatus: 'resolved',
    activeIamFindingPreserved: iamFinding,
    stage6Accepted: false,
    wroteToAuthor: false,
    beganStage7: false
  };
  return { session: updatedSession, acceptedSources: correctedAcceptedSources, instructions: correctedInstructions, audit };
}

export const STAGE_84C_SAFE_SCOPE_TASK_ID = SAFE_SCOPE_TASK_ID;
export const STAGE_84C_OLD_QUEUE_NAME = OLD_QUEUE_NAME;
export const STAGE_84C_CANONICAL_QUEUE_NAME = CANONICAL_QUEUE_NAME;
