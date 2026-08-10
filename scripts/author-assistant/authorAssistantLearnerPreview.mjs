import { createAuthorPreviewModel, getAuthorPreviewModes } from '../../src/features/followAlongAuthor/authorReview.js';
import { AUTHOR_ASSISTANT_SCHEMA_VERSION } from './authorAssistantCore.mjs';
import { composeAcceptedAuthorDraft } from './authorAssistantAuthoringCheck.mjs';
import { fingerprintJson } from './authorAssistantStage84D.mjs';
import { verifyStage87AAcceptanceFingerprint } from './authorAssistantStage87A.mjs';

function matches(value, expected) {
  return fingerprintJson(value) === expected;
}

export function validateStage88Inputs({ session, stageNine, stageNineAcceptance, supportingRecords = {}, ...draftInputs } = {}) {
  const sessionId = session?.sessionId;
  if (
    !sessionId
    || session.status !== 'stage_9_accepted'
    || stageNine?.sessionId !== sessionId
    || stageNine.status !== 'human_accepted'
    || stageNineAcceptance?.sessionId !== sessionId
    || stageNineAcceptance.status !== 'accepted'
    || stageNineAcceptance.approvalStep !== '87A'
    || stageNine.summary?.passed !== true
    || stageNine.summary.errorCount !== 0
  ) throw new Error('Step 88 requires the matching accepted zero-error Stage 9 report.');
  if (!verifyStage87AAcceptanceFingerprint(stageNine, stageNineAcceptance)) throw new Error('The accepted Stage 9 fingerprint no longer matches.');
  const expected = stageNineAcceptance.supportingRecordFingerprints || {};
  if (Object.entries(supportingRecords).some(([key, value]) => !matches(value, expected[key])) || Object.keys(supportingRecords).length !== Object.keys(expected).length) {
    throw new Error('An accepted Stages 1-8 record no longer matches the Stage 9 acceptance.');
  }
  if (
    draftInputs.blueprint !== supportingRecords.blueprint
    || draftInputs.stageSix !== supportingRecords.stageSix
    || draftInputs.stageSeven !== supportingRecords.stageSeven
    || draftInputs.stageEight !== supportingRecords.stageEight
    || stageNine.basedOnStage8Fingerprint?.value !== draftInputs.stageEight?.acceptanceFingerprint?.value
    || session.boundaries?.authorStagesPrepared?.join(',') !== '1,2,3,4,5,6,7,8,9'
    || session.boundaries?.stage9Accepted !== true
    || session.boundaries?.stage10Prepared !== false
    || session.boundaries?.authorDraftWritten !== false
    || session.boundaries?.awsConnected !== false
    || session.boundaries?.supabaseConnected !== false
  ) throw new Error('Step 88 stopped because a local-only safety boundary changed.');
  return true;
}

function learnerStep(step) {
  return {
    id: step.id,
    stepNumber: step.stepNumber,
    title: step.title,
    instructions: (step.instructions || []).map(item => ({ id: item.id, text: item.text, detail: item.detail || '' })),
    expectedResult: step.expectedResult,
    warning: step.warning || ''
  };
}

function learnerCleanup(step, taskTitle) {
  return { id: step.id, stepNumber: step.stepNumber, title: step.title, taskTitle, instruction: step.instruction, verification: step.verification };
}

export function buildStageTenLearnerPreview(inputs, { now = () => new Date() } = {}) {
  validateStage88Inputs(inputs);
  const draft = composeAcceptedAuthorDraft(inputs, { now });
  const model = createAuthorPreviewModel(draft);
  const tasks = model.tasks.map(task => ({
    id: task.id,
    phaseNumber: task.phaseNumber,
    phaseTitle: task.phaseTitle,
    title: task.title,
    goal: task.goal,
    whyItMatters: task.whyItMatters,
    difficulty: task.difficulty,
    estimatedMinutes: task.estimatedMinutes,
    region: task.region,
    prerequisites: [...(task.prerequisites || [])],
    isOptional: Boolean(task.isOptional),
    availableModes: getAuthorPreviewModes(task),
    consoleSteps: (task.consoleSteps || []).map(learnerStep),
    verification: (task.verification || []).map(check => ({ id: check.id, title: check.title, instruction: check.instruction, expectedResult: check.expectedResult, mode: check.mode })),
    officialAwsReferences: (task.sources || []).map(source => ({ id: source.id, title: source.title, url: source.url })),
    cleanup: (task.cleanup || []).map(step => learnerCleanup(step, task.title))
  }));
  if (tasks.some(task => task.availableModes.join(',') !== 'console' || task.consoleSteps.length < 1)) throw new Error('Every SQS learner-preview task must retain its accepted Console-only path.');
  if (tasks.some(task => !task.officialAwsReferences.length || !task.verification.length)) throw new Error('Every learner-preview task needs verification and an official AWS reference.');
  const checkboxCount = tasks.flatMap(task => task.consoleSteps).flatMap(step => step.instructions).length;
  const verificationCount = tasks.flatMap(task => task.verification).length;
  const taskCleanup = tasks.flatMap(task => task.cleanup);
  const programmeCleanup = model.cleanup.steps.map(step => learnerCleanup(step, 'Final programme check'));
  const cleanupCount = taskCleanup.length + programmeCleanup.length;
  const expected = inputs.stageNine.summary;
  if (tasks.length !== expected.taskCount || checkboxCount !== expected.checkboxCount || verificationCount !== expected.verificationCheckCount || cleanupCount !== expected.cleanupItemCount) {
    throw new Error('The learner preview counts do not match the accepted Stage 9 report.');
  }
  const document = {
    schemaVersion: AUTHOR_ASSISTANT_SCHEMA_VERSION,
    kind: 'author_stage_10_local_learner_preview',
    status: 'awaiting_human_preview_review',
    sessionId: inputs.session.sessionId,
    generatedAt: now().toISOString(),
    basedOnStage9Fingerprint: { ...inputs.stageNine.acceptanceFingerprint },
    stageBoundary: { preparedLocally: [10], notPrepared: [11, 12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false, candidatePrepared: false, published: false },
    privacyBoundary: {
      learnerFacingFieldsOnly: true,
      privateReviewFindingsIncluded: false,
      acceptanceFingerprintsIncluded: false,
      aiResponseDataIncluded: false,
      futureCliGuidanceIncluded: false,
      commandsExecuted: false,
      progressSaved: false
    },
    programme: {
      shortName: model.programme.shortName,
      displayName: model.programme.displayName,
      subtitle: model.programme.subtitle,
      description: model.programme.description,
      learningOutcome: model.programme.learningOutcome,
      difficulty: model.programme.difficulty,
      estimatedMinutes: model.programme.estimatedMinutes,
      defaultRegion: model.programme.defaultRegion
    },
    phases: model.phases.map(phase => ({ id: phase.id, phaseNumber: phase.phaseNumber, title: phase.title, description: phase.description, taskIds: phase.tasks.map(task => task.id) })),
    tasks,
    warnings: { cost: model.warnings.cost || '', safety: model.warnings.safety || '', credentials: model.warnings.credentials || '', region: model.warnings.region || '' },
    cleanup: { taskSteps: taskCleanup, programmeSteps: programmeCleanup, manualOnly: true, completionGate: model.cleanup.completionGate },
    summary: { taskCount: tasks.length, phaseCount: model.phases.length, checkboxCount, verificationCheckCount: verificationCount, cleanupItemCount: cleanupCount, officialAwsReferenceCount: new Set(tasks.flatMap(task => task.officialAwsReferences.map(source => source.url))).size, availableModes: ['console'] },
    acceptedStagesOneToNineChanged: false
  };
  const learnerFacingContent = JSON.stringify({ programme: document.programme, phases: document.phases, tasks: document.tasks, warnings: document.warnings, cleanup: document.cleanup });
  if (/manualReviewFindings|retainedManualReviewFindings|responseId|futureCliBoundary|supportingFingerprints|acceptanceFingerprint|acceptance-87a|OPENAI_API_KEY/i.test(learnerFacingContent)) throw new Error('Private Author Assistant data entered the learner preview.');
  return document;
}

export function formatStageTenPreview(document) {
  const lines = [
    `AUTHOR STAGE 10 LOCAL LEARNER PREVIEW - ${document.programme.shortName}`,
    '',
    document.programme.displayName,
    document.programme.subtitle,
    `Outcome: ${document.programme.learningOutcome}`,
    `Region: ${document.programme.defaultRegion}`,
    `Estimated time: ${document.programme.estimatedMinutes ? `${document.programme.estimatedMinutes} minutes` : 'Self-paced'}`,
    '',
    'LEARNER JOURNEY'
  ];
  document.phases.forEach(phase => {
    lines.push('', `${phase.phaseNumber}. ${phase.title}`);
    phase.taskIds.forEach(taskId => {
      const task = document.tasks.find(item => item.id === taskId);
      lines.push(`   - ${task.title}: ${task.goal}`);
      lines.push(`     Checkboxes: ${task.consoleSteps.flatMap(step => step.instructions).length}; verification checks: ${task.verification.length}`);
    });
  });
  lines.push('', 'CLEANUP PREVIEW', `Manual cleanup items: ${document.summary.cleanupItemCount}`, '', 'PRIVACY AND SAFETY', 'Learner-facing fields only: yes', 'Future CLI guidance included: no', 'Commands executed: no', 'Progress saved: no', '', 'BOUNDARIES', 'Nothing was written to Author, Supabase or AWS.', 'Stage 11 has not started.', '');
  return lines.join('\n');
}
