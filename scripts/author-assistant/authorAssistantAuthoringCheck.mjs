import { validateAuthorContent } from '../../src/features/followAlongAuthor/authorContent.js';
import { createAuthorDraft } from '../../src/features/followAlongAuthor/authorDraftService.js';
import { validateAuthorPlanning } from '../../src/features/followAlongAuthor/authorPlanning.js';
import { AUTHOR_ASSISTANT_SCHEMA_VERSION } from './authorAssistantCore.mjs';
import { fingerprintJson, verifyStage84DAcceptanceFingerprint } from './authorAssistantStage84D.mjs';
import { verifyStage85BAcceptanceFingerprint } from './authorAssistantStage85B.mjs';
import { verifyStage86AAcceptanceFingerprint } from './authorAssistantStage86A.mjs';

const ENCODING_DAMAGE = /(?:â€[™œ“”˜¦]|â€™|â€œ|â€|ï¿½|\uFFFD)/;

function matchesFingerprint(value, expected) {
  return fingerprintJson(value) === expected;
}

export function validateStage87Inputs({
  session,
  acceptedSources,
  blueprint,
  blueprintAcceptance,
  sourceAmendment84B,
  consistencyCorrection84C,
  stageSix,
  stageSixAcceptance,
  stageSeven,
  stageSevenAcceptance,
  stageEight,
  stageEightAcceptance
} = {}) {
  const sessionId = session?.sessionId;
  if (
    !sessionId
    || session.status !== 'stage_8_accepted'
    || session.inputs?.shortName !== 'SQS'
    || acceptedSources?.sessionId !== sessionId
    || acceptedSources.status !== 'accepted'
    || blueprint?.sessionId !== sessionId
    || blueprint.status !== 'human_accepted'
    || blueprintAcceptance?.sessionId !== sessionId
    || stageSix?.sessionId !== sessionId
    || stageSix.status !== 'human_accepted'
    || stageSixAcceptance?.sessionId !== sessionId
    || stageSixAcceptance.status !== 'accepted'
    || stageSeven?.sessionId !== sessionId
    || stageSeven.status !== 'human_accepted'
    || stageSevenAcceptance?.sessionId !== sessionId
    || stageSevenAcceptance.status !== 'accepted'
    || stageEight?.sessionId !== sessionId
    || stageEight.status !== 'human_accepted'
    || stageEightAcceptance?.sessionId !== sessionId
    || stageEightAcceptance.status !== 'accepted'
    || stageEightAcceptance.approvalStep !== '86A'
  ) throw new Error('Step 87 requires the complete matching accepted SQS Stages 1-8 package.');

  if (!verifyStage84DAcceptanceFingerprint(stageSix, stageSixAcceptance)) throw new Error('The accepted Stage 6 fingerprint no longer matches.');
  if (!verifyStage85BAcceptanceFingerprint(stageSeven, stageSevenAcceptance)) throw new Error('The accepted Stage 7 fingerprint no longer matches.');
  if (!verifyStage86AAcceptanceFingerprint(stageEight, stageEightAcceptance)) throw new Error('The accepted Stage 8 fingerprint no longer matches.');

  const expected = stageEightAcceptance.supportingRecordFingerprints || {};
  const records = { acceptedSources, blueprint, blueprintAcceptance, sourceAmendment84B, consistencyCorrection84C, stageSixInstructions: stageSix, stageSixAcceptance, stageSeven, stageSevenAcceptance };
  if (Object.entries(records).some(([key, value]) => !matchesFingerprint(value, expected[key]))) {
    throw new Error('An accepted Stages 1-8 supporting record no longer matches its fingerprint.');
  }
  if (
    session.boundaries?.authorStagesPrepared?.join(',') !== '1,2,3,4,5,6,7,8'
    || session.boundaries?.stage8Accepted !== true
    || session.boundaries?.stage9Prepared !== false
    || session.boundaries?.authorDraftWritten !== false
    || session.boundaries?.awsConnected !== false
    || session.boundaries?.supabaseConnected !== false
    || session.boundaries?.candidatePrepared !== false
    || session.boundaries?.published !== false
  ) throw new Error('Step 87 stopped because a local-only safety boundary changed.');
  return true;
}

export function composeAcceptedAuthorDraft(inputs, { now = () => new Date() } = {}) {
  const { session, blueprint, stageSix, stageSeven, stageEight } = inputs;
  const base = createAuthorDraft({
    userId: 'author-assistant-local-stage-9',
    input: {
      serviceName: session.inputs.serviceName,
      shortName: session.inputs.shortName,
      displayName: blueprint.programme.displayName,
      description: blueprint.programme.description
    },
    now,
    idFactory: () => session.sessionId
  });
  const instructionsByTask = new Map(stageSix.tasks.map(task => [task.taskId, task]));
  const checksByTask = new Map(stageSeven.tasks.map(task => [task.taskId, task]));
  const cleanupByTask = new Map([[stageEight.taskCleanup.taskId, stageEight.taskCleanup.steps]]);
  return {
    ...base,
    programme: { ...base.programme, ...blueprint.programme },
    phases: structuredClone(blueprint.phases),
    sources: structuredClone(blueprint.sources),
    tasks: blueprint.tasks.map(task => {
      const instructions = instructionsByTask.get(task.id);
      const checks = checksByTask.get(task.id);
      return {
        ...task,
        status: 'draft',
        modeAvailability: structuredClone(instructions.modeAvailability),
        consoleSteps: structuredClone(instructions.consoleSteps),
        cliSteps: structuredClone(instructions.cliSteps),
        createdResourceKeys: [...checks.createdResourceKeys],
        verification: structuredClone(checks.verification),
        cleanup: structuredClone(cleanupByTask.get(task.id) || [])
      };
    }),
    resources: structuredClone(stageSeven.resources),
    cleanup: {
      steps: structuredClone(stageEight.programmeCleanup.steps),
      completionGate: stageEight.programmeCleanup.completionGate,
      manualOnly: stageEight.programmeCleanup.manualOnly,
      ordering: stageEight.programmeCleanup.ordering
    }
  };
}

export function composeStageNineDraft(inputs, { now = () => new Date() } = {}) {
  validateStage87Inputs(inputs);
  return composeAcceptedAuthorDraft(inputs, { now });
}

function encodingErrors(inputs) {
  const records = [inputs.blueprint, inputs.stageSix, inputs.stageSeven, inputs.stageEight];
  const labels = ['Stages 1-5 blueprint', 'Stage 6 instructions', 'Stage 7 resources and checks', 'Stage 8 cleanup'];
  return records.flatMap((record, index) => ENCODING_DAMAGE.test(JSON.stringify(record))
    ? [{ section: 'encoding', id: `accepted-record-${index + 1}`, message: `${labels[index]} contains damaged text encoding that must be corrected without changing its meaning.` }]
    : []);
}

export function buildStageNineAuthoringCheck(inputs, { now = () => new Date() } = {}) {
  const draft = composeStageNineDraft(inputs, { now });
  const planning = validateAuthorPlanning(draft);
  const content = validateAuthorContent(draft);
  const encoding = encodingErrors(inputs);
  const errors = [...planning.errors, ...content.errors, ...encoding];
  const retainedFindings = [...new Set([
    ...(inputs.stageSix.manualReviewFindings || []),
    ...(inputs.stageSeven.manualReviewFindings || []),
    ...(inputs.stageEight.manualReviewFindings || [])
  ])];
  const iamFinding = retainedFindings.find(finding => /least-privilege policy|already authorized|required permission/i.test(finding));
  if (!iamFinding) throw new Error('The accepted IAM limitation is no longer visible.');
  const checkedAt = now().toISOString();
  const supportingFingerprints = {
    acceptedSources: fingerprintJson(inputs.acceptedSources),
    blueprint: fingerprintJson(inputs.blueprint),
    blueprintAcceptance: fingerprintJson(inputs.blueprintAcceptance),
    sourceAmendment84B: fingerprintJson(inputs.sourceAmendment84B),
    consistencyCorrection84C: fingerprintJson(inputs.consistencyCorrection84C),
    stageSix: fingerprintJson(inputs.stageSix),
    stageSixAcceptance: fingerprintJson(inputs.stageSixAcceptance),
    stageSeven: fingerprintJson(inputs.stageSeven),
    stageSevenAcceptance: fingerprintJson(inputs.stageSevenAcceptance),
    stageEight: fingerprintJson(inputs.stageEight),
    stageEightAcceptance: fingerprintJson(inputs.stageEightAcceptance)
  };
  return {
    schemaVersion: AUTHOR_ASSISTANT_SCHEMA_VERSION,
    kind: 'author_stage_9_local_authoring_check',
    status: errors.length ? 'needs_correction' : 'passed_awaiting_human_review',
    sessionId: inputs.session.sessionId,
    checkedAt,
    basedOnStage8Fingerprint: { ...inputs.stageEight.acceptanceFingerprint },
    stageBoundary: {
      preparedLocally: [9],
      notPrepared: [10, 11, 12],
      writtenToAuthor: false,
      connectedToSupabase: false,
      connectedToAws: false,
      candidatePrepared: false,
      published: false
    },
    checks: {
      planning: { valid: planning.valid, errors: planning.errors, warnings: planning.warnings },
      content: { valid: content.valid, errors: content.errors, warnings: content.warnings },
      encoding: { valid: encoding.length === 0, errors: encoding },
      packageIntegrity: { valid: true, supportingFingerprints },
      iamLimitation: { active: true, finding: iamFinding }
    },
    summary: {
      passed: errors.length === 0,
      errorCount: errors.length,
      warningCount: planning.warnings.length + content.warnings.length + retainedFindings.length,
      retainedFindingCount: retainedFindings.length,
      taskCount: draft.tasks.length,
      checkboxCount: draft.tasks.flatMap(task => task.consoleSteps).flatMap(step => step.instructions || []).length,
      verificationCheckCount: draft.tasks.flatMap(task => task.verification || []).length,
      cleanupItemCount: draft.tasks.flatMap(task => task.cleanup || []).length + draft.cleanup.steps.length,
      resourceValueCount: draft.resources.schema.length
    },
    errors,
    warnings: [...planning.warnings, ...content.warnings],
    retainedManualReviewFindings: retainedFindings,
    acceptedStagesOneToEightChanged: false
  };
}

export function formatStageNinePreview(document) {
  const lines = [
    'AUTHOR STAGE 9 LOCAL AUTHORING CHECK',
    '',
    `Result: ${document.summary.passed ? 'PASSED' : 'CORRECTIONS REQUIRED'}`,
    `Planning check: ${document.checks.planning.valid ? 'passed' : 'failed'}`,
    `Content and safety check: ${document.checks.content.valid ? 'passed' : 'failed'}`,
    `Text encoding check: ${document.checks.encoding.valid ? 'passed' : 'failed'}`,
    'Accepted-package integrity: passed',
    `Errors: ${document.summary.errorCount}`,
    `Warnings and retained review findings: ${document.summary.warningCount}`,
    '',
    'PACKAGE COUNTS',
    `Tasks: ${document.summary.taskCount}`,
    `Separate editable checkboxes: ${document.summary.checkboxCount}`,
    `Verification checks: ${document.summary.verificationCheckCount}`,
    `Cleanup items: ${document.summary.cleanupItemCount}`,
    `Learner resource values: ${document.summary.resourceValueCount}`
  ];
  if (document.errors.length) {
    lines.push('', 'CORRECTIONS REQUIRED');
    document.errors.forEach((error, index) => lines.push(`${index + 1}. ${error.message}`));
  }
  lines.push('', 'ACTIVE IAM LIMITATION', document.checks.iamLimitation.finding, '', 'BOUNDARIES', 'Nothing was written to Author, Supabase or AWS.', 'Stage 10 has not started.', '');
  return lines.join('\n');
}
