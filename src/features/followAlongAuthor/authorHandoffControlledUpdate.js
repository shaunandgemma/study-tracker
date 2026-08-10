import { fingerprintAuthorHandoffJson, validateAuthorHandoffImportPreview } from './authorHandoffPreview.js';
import { validateAuthorContent } from './authorContent.js';
import { validateAuthorPlanning } from './authorPlanning.js';
import { validateAuthorReview } from './authorReview.js';

export const AUTHOR_HANDOFF_UPDATE_STORAGE_MODE = 'shared_supabase';
export const AUTHOR_HANDOFF_UPDATE_CONFIRMATION = 'update_one_existing_shared_draft';

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function timestamp(now) {
  const value = typeof now === 'function' ? now() : now;
  return (value instanceof Date ? value : new Date(value || Date.now())).toISOString();
}

function updateTarget(handoffPackage) {
  const target = handoffPackage?.updateTarget;
  if (handoffPackage?.generationMode !== 'update_existing' || !target) throw new Error('This package is not an existing Follow Along update.');
  if (!clean(target.programmeId) || !Number.isInteger(Number(target.sourceRevision)) || Number(target.sourceRevision) < 1) {
    throw new Error('The update package has no valid published target revision.');
  }
  return target;
}

function draftIdFromCandidateId(candidateId) {
  const match = String(candidateId || '').match(/^release-(.+)-r\d+-[a-f0-9]{12}$/i);
  return match?.[1] || '';
}

function comparableAcceptedContent(value) {
  const content = structuredClone(value || {});
  delete content.draft;
  delete content.review;
  delete content.publication;
  return content;
}

function assertTargetIdentity(content, target) {
  const programme = content?.programme || {};
  if (
    clean(programme.programmeId) !== clean(target.programmeId)
    || clean(programme.pathId) !== clean(target.programmeId)
    || clean(programme.serviceSlug) !== clean(target.serviceSlug)
    || clean(programme.serviceName) !== clean(target.serviceName)
    || clean(programme.shortName) !== clean(target.shortName)
  ) throw new Error('The generated update changed the selected Follow Along identity.');
}

function buildUpdatedDraft({ handoffPackage, acceptance, preview, currentUser, existingDraft, updatedAt }) {
  const content = structuredClone(handoffPackage.authorDraftContent);
  const target = updateTarget(handoffPackage);
  assertTargetIdentity(content, target);
  return {
    ...content,
    draft: {
      ...structuredClone(existingDraft.draft),
      revision: Number(existingDraft.draft.revision),
      status: 'draft',
      createdAt: existingDraft.draft.createdAt,
      createdBy: existingDraft.draft.createdBy,
      updatedAt,
      updatedBy: currentUser.id,
      basedOnProgrammeId: target.programmeId,
      importedFrom: structuredClone(existingDraft.draft.importedFrom || null),
      lastAssistantUpdate: {
        type: 'author_assistant_handoff_update',
        importStep: 'update-existing',
        sessionId: preview.sessionId,
        handoffFingerprint: preview.handoffFingerprint,
        acceptanceAuditFingerprint: preview.acceptanceAuditFingerprint,
        authorDraftContentFingerprint: clean(acceptance?.authorDraftContentFingerprint?.value),
        basePublishedRevision: Number(target.sourceRevision),
        updatedAt,
        updatedBy: currentUser.id
      },
      notes: 'Updated from a browser-verified Author Assistant handoff package.'
    }
  };
}

export async function prepareAuthorHandoffControlledUpdate({
  handoffPackage,
  acceptance,
  currentUser,
  existingDrafts = [],
  releaseCandidates = [],
  storageMode = AUTHOR_HANDOFF_UPDATE_STORAGE_MODE,
  now = () => new Date(),
  cryptoImpl = globalThis.crypto
} = {}) {
  const preview = await validateAuthorHandoffImportPreview({ handoffPackage, acceptance, currentUser, cryptoImpl });
  const target = updateTarget(handoffPackage);
  assertTargetIdentity(handoffPackage.authorDraftContent, target);
  const targetDraftId = draftIdFromCandidateId(target.candidateId);
  const existingDraft = (existingDrafts || []).find(draft => draft?.draft?.draftId === targetDraftId) || null;
  const sharedMode = storageMode === AUTHOR_HANDOFF_UPDATE_STORAGE_MODE;
  const owned = existingDraft?.draft?.createdBy === currentUser.id;
  const revisionMatches = Number(existingDraft?.draft?.revision) === Number(target.sourceRevision);
  const publishedCandidate = (releaseCandidates || []).find(candidate => (candidate?.candidate_id || candidate?.candidateId) === target.candidateId) || null;
  const candidateDraftId = publishedCandidate?.draft_id || publishedCandidate?.sourceDraftId;
  const candidateRevision = Number(publishedCandidate?.source_revision ?? publishedCandidate?.sourceRevision);
  const candidateMatchesTarget = candidateDraftId === targetDraftId && candidateRevision === Number(target.sourceRevision);
  const [currentComparableFingerprint, candidateComparableFingerprint] = existingDraft && publishedCandidate?.snapshot
    ? await Promise.all([
        fingerprintAuthorHandoffJson(comparableAcceptedContent(existingDraft), cryptoImpl),
        fingerprintAuthorHandoffJson(comparableAcceptedContent(publishedCandidate.snapshot), cryptoImpl)
      ])
    : [null, null];
  const baseContentMatches = Boolean(currentComparableFingerprint && currentComparableFingerprint === candidateComparableFingerprint);
  const duplicate = existingDraft?.draft?.lastAssistantUpdate?.handoffFingerprint === preview.handoffFingerprint;
  const updatedAt = timestamp(now);
  const draft = existingDraft ? buildUpdatedDraft({ handoffPackage, acceptance, preview, currentUser, existingDraft, updatedAt }) : null;

  if (draft) {
    const sourceFingerprint = await fingerprintAuthorHandoffJson(handoffPackage.authorDraftContent, cryptoImpl);
    if (sourceFingerprint !== clean(acceptance?.authorDraftContentFingerprint?.value)) throw new Error('The accepted update content changed during preparation.');
    const validations = [validateAuthorPlanning(draft), validateAuthorContent(draft), validateAuthorReview(draft)];
    if (validations.some(result => !result.valid)) throw new Error('The update no longer passes the current Author checks.');
  }

  let blockedReason = '';
  if (!sharedMode) blockedReason = 'Select Shared Drafts before applying an update.';
  else if (!targetDraftId) blockedReason = 'The published candidate does not identify an original Shared Draft.';
  else if (!existingDraft) blockedReason = 'The exact original Shared Draft is not accessible to this Author.';
  else if (!owned) blockedReason = 'The signed-in Author does not own the selected Shared Draft.';
  else if (duplicate) blockedReason = 'This exact accepted update package has already been applied.';
  else if (!revisionMatches && !candidateMatchesTarget) blockedReason = 'The published baseline candidate could not be verified. Nothing was updated.';
  else if (!revisionMatches && !baseContentMatches) blockedReason = `The Shared Draft is revision ${existingDraft.draft.revision} and its editable content differs from published revision ${target.sourceRevision}. Review those newer changes before generating another update.`;

  const canUpdate = !blockedReason;
  const planFingerprint = await fingerprintAuthorHandoffJson({
    operation: 'update_existing', storageMode, sessionId: preview.sessionId,
    handoffFingerprint: preview.handoffFingerprint, intendedAuthor: preview.intendedAuthor,
    target, targetDraftId, existingDraftId: existingDraft?.draft?.draftId || null,
    expectedRevision: existingDraft?.draft?.revision || null, baseContentMatches, candidateMatchesTarget, draft
  }, cryptoImpl);

  return {
    operation: 'update_existing', step: 'controlled-update', preview, target, targetDraftId, existingDraft, draft,
    updatedAt, storageMode, storageLabel: 'Shared Drafts - private controlled storage',
    planFingerprint, draftFingerprint: draft ? await fingerprintAuthorHandoffJson(draft, cryptoImpl) : null,
    beforeRevision: existingDraft?.draft?.revision || null,
    afterRevision: existingDraft ? Number(existingDraft.draft.revision) + 1 : null,
    canUpdate, blockedReason, revisionMatches, baseContentMatches, candidateMatchesTarget,
    boundaries: { updatesExactlyOneOwnedSharedDraft: true, createsNewDraft: false, preservesProgrammeIdentity: true, awsConnection: false, releaseCandidatePrepared: false, approvalPerformed: false, published: false }
  };
}

export async function executeAuthorHandoffControlledUpdate({
  handoffPackage,
  acceptance,
  currentUser,
  preparedPlan,
  confirmation,
  storageMode = AUTHOR_HANDOFF_UPDATE_STORAGE_MODE,
  listDrafts,
  listReleaseCandidates,
  saveDraft,
  cryptoImpl = globalThis.crypto
} = {}) {
  if (confirmation !== AUTHOR_HANDOFF_UPDATE_CONFIRMATION) return { success: false, confirmationRequired: true, error: 'Confirm the exact Shared Draft revision update.' };
  if (storageMode !== AUTHOR_HANDOFF_UPDATE_STORAGE_MODE) return { success: false, wrongStorageMode: true, error: 'Select Shared Drafts before applying this update.' };
  if (typeof listDrafts !== 'function' || typeof listReleaseCandidates !== 'function' || typeof saveDraft !== 'function') return { success: false, error: 'Shared Author draft storage is unavailable.' };
  if (!preparedPlan?.planFingerprint || preparedPlan.operation !== 'update_existing') return { success: false, comparisonRequired: true, error: 'Run the exact update comparison again.' };

  try {
    const [current, candidates] = await Promise.all([listDrafts(), listReleaseCandidates()]);
    if (!current?.success) return { success: false, error: current?.error || 'Unable to check Shared Drafts.' };
    if (!candidates?.success) return { success: false, error: candidates?.error || 'Unable to verify the published baseline candidate.' };
    const rebuilt = await prepareAuthorHandoffControlledUpdate({
      handoffPackage, acceptance, currentUser, existingDrafts: current.drafts || [], releaseCandidates: candidates.candidates || [], storageMode,
      now: () => new Date(preparedPlan.updatedAt), cryptoImpl
    });
    if (!rebuilt.canUpdate) return { success: false, conflict: true, error: rebuilt.blockedReason };
    if (rebuilt.planFingerprint !== preparedPlan.planFingerprint || rebuilt.draftFingerprint !== preparedPlan.draftFingerprint) {
      return { success: false, comparisonChanged: true, error: 'The package, Author or Shared Draft changed. Run the comparison again.' };
    }
    const saved = await saveDraft({ draft: rebuilt.draft, expectedRevision: rebuilt.beforeRevision });
    if (!saved?.success) return { ...saved, success: false, error: saved?.error || 'The Shared Draft update was not saved.' };
    if (saved.draft?.draft?.draftId !== rebuilt.existingDraft.draft.draftId || Number(saved.draft?.draft?.revision) !== rebuilt.afterRevision) {
      return { success: false, error: 'The saved Shared Draft did not match the approved update comparison.' };
    }
    return {
      success: true, updatedCount: 1, draft: saved.draft, draftId: saved.draft.draft.draftId,
      revision: saved.draft.draft.revision, programmeId: rebuilt.target.programmeId,
      candidateCreated: false, approved: false, published: false,
      message: 'Exactly one existing Shared Draft was updated to its next revision.'
    };
  } catch (error) {
    return { success: false, error: error?.message || 'The controlled Shared Draft update stopped safely.' };
  }
}
