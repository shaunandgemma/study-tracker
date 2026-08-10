import { validateAuthorContent } from '../../src/features/followAlongAuthor/authorContent.js';
import { validateAuthorPlanning } from '../../src/features/followAlongAuthor/authorPlanning.js';
import { addAuthorReviewFinding, markAuthorPreviewReviewed, setAuthorReviewStatus, validateAuthorReview } from '../../src/features/followAlongAuthor/authorReview.js';
import { AUTHOR_ASSISTANT_SCHEMA_VERSION } from './authorAssistantCore.mjs';
import { composeAcceptedAuthorDraft } from './authorAssistantAuthoringCheck.mjs';
import { fingerprintJson } from './authorAssistantStage84D.mjs';
import { verifyStage87AAcceptanceFingerprint } from './authorAssistantStage87A.mjs';
import { verifyStage88BAcceptanceFingerprint } from './authorAssistantStage88B.mjs';

const IAM_PATTERN = /least-privilege|already authorized|administrator|every required permission|IAM policy/i;
const IAM_ADVISORY = 'Approver should confirm that the learner uses an account or role already authorized by an administrator for the required SQS Console actions. No IAM policy is created or recommended.';

export function validateStage89Inputs({ session, stageNine, stageNineAcceptance, stageTen, stageTenAcceptance, correctionAudit } = {}) {
  const sessionId = session?.sessionId;
  if (
    !sessionId || session.status !== 'stage_10_accepted'
    || stageNine?.sessionId !== sessionId || stageNine.status !== 'human_accepted'
    || stageNineAcceptance?.sessionId !== sessionId || stageNineAcceptance.status !== 'accepted'
    || stageTen?.sessionId !== sessionId || stageTen.status !== 'human_accepted'
    || stageTenAcceptance?.sessionId !== sessionId || stageTenAcceptance.status !== 'accepted' || stageTenAcceptance.approvalStep !== '88B'
    || correctionAudit?.sessionId !== sessionId || correctionAudit.approvalStep !== '88A'
  ) throw new Error('Step 89 requires the complete matching accepted Stage 10 package.');
  if (!verifyStage87AAcceptanceFingerprint(stageNine, stageNineAcceptance)) throw new Error('The accepted Stage 9 fingerprint no longer matches.');
  if (!verifyStage88BAcceptanceFingerprint(stageTen, stageTenAcceptance)) throw new Error('The accepted Stage 10 fingerprint no longer matches.');
  if (
    stageTen.basedOnStage9Fingerprint?.value !== stageNine.acceptanceFingerprint?.value
    || correctionAudit.newFingerprints?.stageNine !== stageNine.acceptanceFingerprint?.value
    || correctionAudit.futureCliGuidancePreserved !== true
    || session.boundaries?.authorStagesPrepared?.join(',') !== '1,2,3,4,5,6,7,8,9,10'
    || session.boundaries?.stage10Accepted !== true || session.boundaries?.stage11Prepared !== false
    || session.boundaries?.authorDraftWritten !== false || session.boundaries?.awsConnected !== false || session.boundaries?.supabaseConnected !== false
  ) throw new Error('Step 89 stopped because an accepted-package or local-only safety boundary changed.');
  return true;
}

function reviewDraft(draft) {
  const planning = validateAuthorPlanning(draft); const content = validateAuthorContent(draft);
  if (!planning.valid || !content.valid) throw new Error('Stage 11 cannot begin because the accepted Author checks no longer pass.');
  let reviewed = markAuthorPreviewReviewed(draft);
  const added = addAuthorReviewFinding(reviewed, { section: 'warnings', priority: 'advisory', message: IAM_ADVISORY });
  if (!added.success) throw new Error(added.error);
  reviewed = added.draft;
  const ready = setAuthorReviewStatus(reviewed, 'ready_for_approval', { planningValidation: planning, contentValidation: content });
  if (!ready.success) throw new Error(ready.error);
  reviewed = ready.draft;
  const review = validateAuthorReview(reviewed);
  if (!review.valid) throw new Error('The structured Author review did not pass the app review rules.');
  return { draft: reviewed, planning, content, review };
}

export function buildStageElevenStructuredReview(inputs, { now = () => new Date(), draftOverride = null } = {}) {
  validateStage89Inputs(inputs);
  const draft = draftOverride || composeAcceptedAuthorDraft(inputs, { now });
  const checked = reviewDraft(draft);
  const sourceFindings = [...new Set(inputs.stageNine.retainedManualReviewFindings || [])];
  const iamFindings = sourceFindings.filter(finding => IAM_PATTERN.test(finding));
  if (!iamFindings.length) throw new Error('The active IAM review boundary is missing.');
  const resolvedFindings = sourceFindings.filter(finding => !IAM_PATTERN.test(finding));
  const finding = checked.draft.review.findings[0];
  return {
    schemaVersion: AUTHOR_ASSISTANT_SCHEMA_VERSION,
    kind: 'author_stage_11_local_structured_review',
    status: 'awaiting_human_stage_11_review',
    sessionId: inputs.session.sessionId,
    reviewedAt: now().toISOString(),
    basedOnStage10Fingerprint: { ...inputs.stageTen.acceptanceFingerprint },
    stageBoundary: { preparedLocally: [11], notPrepared: [12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false, candidatePrepared: false, published: false },
    reviewState: {
      learnerPreviewStatus: checked.draft.review.learnerPreviewStatus,
      reviewStatus: checked.draft.review.reviewStatus,
      approvalDecision: checked.draft.review.approvalDecision,
      publicationVisibility: checked.draft.programme.publicationVisibility,
      publishStatus: checked.draft.publication.publishStatus
    },
    validations: {
      planning: { valid: checked.planning.valid, errors: checked.planning.errors, warnings: checked.planning.warnings },
      content: { valid: checked.content.valid, errors: checked.content.errors, warnings: checked.content.warnings },
      structuredReview: { valid: checked.review.valid, errors: checked.review.errors, warnings: checked.review.warnings }
    },
    findings: [{ id: finding.id, findingNumber: finding.findingNumber, section: finding.section, priority: finding.priority, message: finding.message, status: finding.status, consolidatedFrom: iamFindings }],
    resolvedByAcceptedContent: resolvedFindings.map((message, index) => ({ resolutionNumber: index + 1, message, status: 'resolved_by_accepted_stages_6_to_10' })),
    summary: { sourceFindingCount: sourceFindings.length, consolidatedAdvisoryCount: 1, openBlockingFindingCount: 0, openAdvisoryFindingCount: 1, resolvedFindingCount: resolvedFindings.length, planningErrorCount: 0, contentErrorCount: 0, reviewErrorCount: 0 },
    safetyBoundary: { approvalPerformed: false, releaseCandidatePrepared: false, published: false, authorDraftWritten: false, awsConnected: false, supabaseConnected: false },
    acceptedStagesOneToTenChanged: false
  };
}

export function formatStageElevenPreview(document) {
  const lines = [
    'AUTHOR STAGE 11 LOCAL STRUCTURED REVIEW', '',
    `Planning: ${document.validations.planning.valid ? 'passed' : 'failed'}`,
    `Content and safety: ${document.validations.content.valid ? 'passed' : 'failed'}`,
    `Structured review: ${document.validations.structuredReview.valid ? 'passed' : 'failed'}`,
    `Learner preview: ${document.reviewState.learnerPreviewStatus}`,
    `Review state: ${document.reviewState.reviewStatus}`,
    `Approval decision: ${document.reviewState.approvalDecision}`,
    '', 'OPEN ADVISORY FINDINGS'
  ];
  document.findings.forEach(finding => lines.push(`${finding.findingNumber}. [${finding.section}] ${finding.message}`));
  lines.push('', `Original retained findings reviewed: ${document.summary.sourceFindingCount}`, `Resolved by accepted content: ${document.summary.resolvedFindingCount}`, 'Open blocking findings: 0', '', 'BOUNDARIES', 'No approval was performed.', 'No release candidate was prepared.', 'Nothing was written to Author, Supabase or AWS.', 'Stage 12 has not started.', '');
  return lines.join('\n');
}
