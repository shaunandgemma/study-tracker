import { validateAuthorContent } from '../../src/features/followAlongAuthor/authorContent.js';
import { validateAuthorPlanning } from '../../src/features/followAlongAuthor/authorPlanning.js';
import {
  addAuthorReviewFinding,
  markAuthorPreviewReviewed,
  setAuthorReviewStatus,
  validateAuthorReview
} from '../../src/features/followAlongAuthor/authorReview.js';
import { AUTHOR_ASSISTANT_SCHEMA_VERSION } from './authorAssistantCore.mjs';
import { composeAcceptedAuthorDraft } from './authorAssistantAuthoringCheck.mjs';
import { fingerprintJson, verifyStage84DAcceptanceFingerprint } from './authorAssistantStage84D.mjs';
import { verifyStage85BAcceptanceFingerprint } from './authorAssistantStage85B.mjs';
import { verifyStage86AAcceptanceFingerprint } from './authorAssistantStage86A.mjs';
import { verifyStage87AAcceptanceFingerprint } from './authorAssistantStage87A.mjs';
import { verifyStage88BAcceptanceFingerprint } from './authorAssistantStage88B.mjs';
import { verifyStage89AAcceptanceFingerprint } from './authorAssistantStage89A.mjs';

const SUPPORTING_RECORD_KEYS = Object.freeze([
  'acceptedSources',
  'blueprint',
  'blueprintAcceptance',
  'sourceAmendment84B',
  'consistencyCorrection84C',
  'stageSix',
  'stageSixAcceptance',
  'stageSeven',
  'stageSevenAcceptance',
  'stageEight',
  'stageEightAcceptance'
]);

function fingerprintContent(handoffPackage) {
  const content = structuredClone(handoffPackage || {});
  delete content.status;
  delete content.preparedAt;
  delete content.handoffFingerprint;
  return content;
}

function supportingRecords(inputs) {
  return Object.fromEntries(SUPPORTING_RECORD_KEYS.map(key => [key, inputs[key]]));
}

function assertMatchingSession(sessionId, records) {
  const mismatched = Object.entries(records).filter(([, record]) => record?.sessionId !== sessionId);
  if (mismatched.length) throw new Error('Step 90 stopped because accepted records belong to different sessions.');
}

function assertSupportingFingerprints(inputs) {
  const expected = inputs.stageNineAcceptance?.supportingRecordFingerprints || {};
  const records = supportingRecords(inputs);
  if (Object.keys(expected).length !== SUPPORTING_RECORD_KEYS.length) {
    throw new Error('Step 90 requires the complete accepted Stages 1-8 fingerprint manifest.');
  }
  for (const [key, record] of Object.entries(records)) {
    if (fingerprintJson(record) !== expected[key]) {
      throw new Error(`Step 90 stopped because the accepted ${key} record no longer matches its fingerprint.`);
    }
  }
  if (fingerprintJson(expected) !== fingerprintJson(inputs.stageNine?.checks?.packageIntegrity?.supportingFingerprints || {})) {
    throw new Error('Step 90 stopped because the Stage 9 integrity manifest changed.');
  }
}

function countDraftContent(draft) {
  return {
    phaseCount: draft.phases.length,
    taskCount: draft.tasks.length,
    checkboxCount: draft.tasks.flatMap(task => task.consoleSteps || []).flatMap(step => step.instructions || []).length,
    verificationCheckCount: draft.tasks.flatMap(task => task.verification || []).length,
    cleanupItemCount: draft.tasks.flatMap(task => task.cleanup || []).length + (draft.cleanup?.steps || []).length,
    learnerResourceValueCount: draft.resources?.schema?.length || 0,
    officialAwsSourceCount: draft.sources.length
  };
}

function buildReviewedDraft(inputs) {
  const draft = composeAcceptedAuthorDraft(inputs, { now: () => new Date(inputs.session.createdAt) });
  const planning = validateAuthorPlanning(draft);
  const content = validateAuthorContent(draft);
  if (!planning.valid || !content.valid) throw new Error('Step 90 stopped because the accepted Author content no longer passes its checks.');

  let reviewed = markAuthorPreviewReviewed(draft);
  const finding = inputs.stageEleven.findings[0];
  const added = addAuthorReviewFinding(reviewed, {
    section: finding.section,
    priority: finding.priority,
    message: finding.message
  });
  if (!added.success) throw new Error(added.error);
  reviewed = added.draft;
  const ready = setAuthorReviewStatus(reviewed, 'ready_for_approval', {
    planningValidation: planning,
    contentValidation: content
  });
  if (!ready.success) throw new Error(ready.error);
  reviewed = ready.draft;
  const review = validateAuthorReview(reviewed);
  if (!review.valid) throw new Error('Step 90 stopped because the reconstructed Author review no longer passes.');

  const expectedState = inputs.stageEleven.reviewState;
  if (
    reviewed.review.learnerPreviewStatus !== expectedState.learnerPreviewStatus
    || reviewed.review.reviewStatus !== expectedState.reviewStatus
    || reviewed.review.approvalDecision !== expectedState.approvalDecision
    || reviewed.programme.publicationVisibility !== expectedState.publicationVisibility
    || reviewed.publication.publishStatus !== expectedState.publishStatus
    || reviewed.review.findings.length !== 1
    || reviewed.review.findings[0].id !== finding.id
    || reviewed.review.findings[0].message !== finding.message
  ) throw new Error('Step 90 stopped because the Author handoff review state differs from accepted Stage 11.');

  return reviewed;
}

export function validateStage90Inputs(inputs = {}) {
  const sessionId = inputs.session?.sessionId;
  if (!sessionId || inputs.session.status !== 'stage_11_accepted') {
    throw new Error('Step 90 requires the complete human-accepted Stages 1-11 package.');
  }
  const records = {
    ...supportingRecords(inputs),
    stageNine: inputs.stageNine,
    stageNineAcceptance: inputs.stageNineAcceptance,
    stageTen: inputs.stageTen,
    stageTenAcceptance: inputs.stageTenAcceptance,
    correctionAudit88A: inputs.correctionAudit88A,
    stageEleven: inputs.stageEleven,
    stageElevenAcceptance: inputs.stageElevenAcceptance
  };
  assertMatchingSession(sessionId, records);
  if (
    inputs.acceptedSources?.status !== 'accepted'
    || inputs.blueprint?.status !== 'human_accepted'
    || inputs.blueprintAcceptance?.status !== 'accepted'
    || inputs.stageSix?.status !== 'human_accepted'
    || inputs.stageSixAcceptance?.status !== 'accepted'
    || inputs.stageSeven?.status !== 'human_accepted'
    || inputs.stageSevenAcceptance?.status !== 'accepted'
    || inputs.stageEight?.status !== 'human_accepted'
    || inputs.stageEightAcceptance?.status !== 'accepted'
    || inputs.stageNine?.status !== 'human_accepted'
    || inputs.stageNineAcceptance?.status !== 'accepted'
    || inputs.stageTen?.status !== 'human_accepted'
    || inputs.stageTenAcceptance?.status !== 'accepted'
    || inputs.stageEleven?.status !== 'human_accepted'
    || inputs.stageElevenAcceptance?.status !== 'accepted'
  ) throw new Error('Step 90 requires every local Author stage to remain human accepted.');

  if (!verifyStage84DAcceptanceFingerprint(inputs.stageSix, inputs.stageSixAcceptance)) throw new Error('The accepted Stage 6 fingerprint no longer matches.');
  if (!verifyStage85BAcceptanceFingerprint(inputs.stageSeven, inputs.stageSevenAcceptance)) throw new Error('The accepted Stage 7 fingerprint no longer matches.');
  if (!verifyStage86AAcceptanceFingerprint(inputs.stageEight, inputs.stageEightAcceptance)) throw new Error('The accepted Stage 8 fingerprint no longer matches.');
  if (!verifyStage87AAcceptanceFingerprint(inputs.stageNine, inputs.stageNineAcceptance)) throw new Error('The accepted Stage 9 fingerprint no longer matches.');
  if (!verifyStage88BAcceptanceFingerprint(inputs.stageTen, inputs.stageTenAcceptance)) throw new Error('The accepted Stage 10 fingerprint no longer matches.');
  if (!verifyStage89AAcceptanceFingerprint(inputs.stageEleven, inputs.stageElevenAcceptance)) throw new Error('The accepted Stage 11 fingerprint no longer matches.');
  assertSupportingFingerprints(inputs);

  if (
    inputs.stageSeven.basedOnStage6Fingerprint?.value !== inputs.stageSix.acceptanceFingerprint?.value
    || inputs.stageEight.basedOnStage7Fingerprint?.value !== inputs.stageSeven.acceptanceFingerprint?.value
    || inputs.stageNine.basedOnStage8Fingerprint?.value !== inputs.stageEight.acceptanceFingerprint?.value
    || inputs.stageTen.basedOnStage9Fingerprint?.value !== inputs.stageNine.acceptanceFingerprint?.value
    || inputs.stageEleven.basedOnStage10Fingerprint?.value !== inputs.stageTen.acceptanceFingerprint?.value
    || inputs.correctionAudit88A?.approvalStep !== '88A'
    || inputs.correctionAudit88A?.newFingerprints?.stageNine !== inputs.stageNine.acceptanceFingerprint?.value
    || inputs.correctionAudit88A?.futureCliGuidancePreserved !== true
  ) throw new Error('Step 90 stopped because the accepted fingerprint chain is incomplete.');

  const boundaries = inputs.session.boundaries || {};
  if (
    boundaries.authorStagesPrepared?.join(',') !== '1,2,3,4,5,6,7,8,9,10,11'
    || boundaries.stage11Accepted !== true
    || boundaries.stage12Prepared !== false
    || boundaries.authorDraftWritten !== false
    || boundaries.awsConnected !== false
    || boundaries.supabaseConnected !== false
    || boundaries.candidatePrepared !== false
    || boundaries.published !== false
    || inputs.stageEleven.reviewState?.reviewStatus !== 'ready_for_approval'
    || inputs.stageEleven.reviewState?.approvalDecision !== 'pending'
    || inputs.stageEleven.summary?.openBlockingFindingCount !== 0
    || inputs.stageEleven.safetyBoundary?.authorDraftWritten !== false
    || inputs.stageEleven.safetyBoundary?.releaseCandidatePrepared !== false
    || inputs.stageEleven.safetyBoundary?.published !== false
  ) throw new Error('Step 90 stopped because the local-only handoff boundary changed.');
  return true;
}

export function buildAuthorHandoffPackage(inputs, { now = () => new Date() } = {}) {
  validateStage90Inputs(inputs);
  const reviewedDraft = buildReviewedDraft(inputs);
  const authorDraftContent = structuredClone(reviewedDraft);
  delete authorDraftContent.draft;
  const counts = countDraftContent(reviewedDraft);
  const expected = inputs.stageTenAcceptance;
  if (
    counts.taskCount !== expected.taskCount
    || counts.checkboxCount !== expected.checkboxCount
    || counts.verificationCheckCount !== expected.verificationCheckCount
    || counts.cleanupItemCount !== expected.cleanupItemCount
  ) throw new Error('Step 90 stopped because handoff counts differ from the accepted learner preview.');

  const acceptedRecordManifest = Object.fromEntries(Object.entries({
    ...supportingRecords(inputs),
    stageNine: inputs.stageNine,
    stageNineAcceptance: inputs.stageNineAcceptance,
    correctionAudit88A: inputs.correctionAudit88A,
    stageTen: inputs.stageTen,
    stageTenAcceptance: inputs.stageTenAcceptance,
    stageEleven: inputs.stageEleven,
    stageElevenAcceptance: inputs.stageElevenAcceptance
  }).map(([key, value]) => [key, { algorithm: 'sha256-json-v1', value: fingerprintJson(value) }]));

  const handoffPackage = {
    schemaVersion: AUTHOR_ASSISTANT_SCHEMA_VERSION,
    kind: 'author_local_handoff_package',
    status: 'awaiting_human_handoff_review',
    sessionId: inputs.session.sessionId,
    preparedAt: now().toISOString(),
    service: {
      officialName: inputs.session.inputs.serviceName,
      shortName: inputs.session.inputs.shortName
    },
    acceptedFingerprintChain: {
      stage6: { ...inputs.stageSixAcceptance.instructionFingerprint },
      stage7: { ...inputs.stageSevenAcceptance.stageSevenFingerprint },
      stage8: { ...inputs.stageEightAcceptance.stageEightFingerprint },
      stage9: { ...inputs.stageNineAcceptance.stageNineFingerprint },
      stage10: { ...inputs.stageTenAcceptance.stageTenFingerprint },
      stage11: { ...inputs.stageElevenAcceptance.stageElevenFingerprint }
    },
    acceptedRecordManifest,
    authorDraftContent,
    identityBinding: {
      status: 'required_before_author_write',
      assignedAuthorId: null,
      assignedDraftId: null,
      assignedRevision: null,
      rule: 'A later separately approved write step must bind the currently signed-in Author and create a new draft identity.'
    },
    summary: counts,
    handoffBoundary: {
      localPackageOnly: true,
      stage12Started: false,
      authorDraftWritten: false,
      authorIdentityBound: false,
      connectedToAuthor: false,
      connectedToSupabase: false,
      connectedToAws: false,
      releaseCandidatePrepared: false,
      candidateIdGenerated: false,
      approvalPerformed: false,
      published: false
    },
    acceptedStagesOneToElevenChanged: false
  };
  handoffPackage.handoffFingerprint = {
    algorithm: 'sha256-json-v1',
    value: fingerprintJson(fingerprintContent(handoffPackage))
  };
  return handoffPackage;
}

export function verifyAuthorHandoffPackageFingerprint(handoffPackage) {
  return fingerprintJson(fingerprintContent(handoffPackage)) === handoffPackage?.handoffFingerprint?.value;
}

export function formatAuthorHandoffPreview(handoffPackage) {
  const summary = handoffPackage.summary;
  return [
    `AUTHOR LOCAL HANDOFF PACKAGE - ${handoffPackage.service.shortName}`,
    '',
    `Programme: ${handoffPackage.authorDraftContent.programme.displayName}`,
    `Phases: ${summary.phaseCount}`,
    `Tasks: ${summary.taskCount}`,
    `Separate editable checkboxes: ${summary.checkboxCount}`,
    `Verification checks: ${summary.verificationCheckCount}`,
    `Cleanup items: ${summary.cleanupItemCount}`,
    `Learner resource values: ${summary.learnerResourceValueCount}`,
    `Official AWS sources: ${summary.officialAwsSourceCount}`,
    `SHA-256 handoff fingerprint: ${handoffPackage.handoffFingerprint.value}`,
    '',
    'IDENTITY BOUNDARY',
    'No Author account or draft ID is attached.',
    'A later separately approved step must bind the signed-in Author before any write.',
    '',
    'BOUNDARIES',
    'Nothing was written to Author, Supabase or AWS.',
    'No release candidate or candidate ID was created.',
    'Nothing was approved or published.',
    'Stage 12 has not started.',
    ''
  ].join('\n');
}
