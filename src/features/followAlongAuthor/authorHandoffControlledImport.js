import { fingerprintAuthorHandoffJson, validateAuthorHandoffImportPreview } from './authorHandoffPreview.js';
import { validateAuthorContent } from './authorContent.js';
import { validateAuthorPlanning } from './authorPlanning.js';
import { validateAuthorReview } from './authorReview.js';

export const AUTHOR_HANDOFF_PRIVATE_STORAGE_MODE = 'private_local_browser';
export const AUTHOR_HANDOFF_IMPORT_CONFIRMATION = 'create_one_private_author_draft';
export const AUTHOR_HANDOFF_LOCAL_UPDATE_CONFIRMATION = 'update_one_existing_local_draft';

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function timestamp(now) {
  const value = typeof now === 'function' ? now() : now;
  return (value instanceof Date ? value : new Date(value || Date.now())).toISOString();
}

function exactCopy(value) {
  return structuredClone(value);
}

function deterministicDraftId(handoffFingerprint) {
  return `author-draft-import-${handoffFingerprint}`;
}

function importSource(draft) {
  return draft?.draft?.importedFrom || {};
}

function assertImportableContent(content) {
  if (!content || typeof content !== 'object' || Array.isArray(content)) throw new Error('The accepted Author content is missing.');
  if (content.draft !== undefined) throw new Error('The accepted package must not contain an existing draft identity.');
  if (content.programme?.publicationVisibility !== 'unpublished' || content.publication?.publishStatus !== 'not_published') {
    throw new Error('The accepted package is not an unpublished Author draft.');
  }
  if (content.review?.approvalDecision !== 'pending') throw new Error('The accepted package already contains an approval decision.');
}

function buildPrivateDraft({ handoffPackage, acceptance, preview, currentUser, importedAt }) {
  const acceptedContent = exactCopy(handoffPackage.authorDraftContent);
  assertImportableContent(acceptedContent);
  return {
    ...acceptedContent,
    draft: {
      draftId: deterministicDraftId(preview.handoffFingerprint),
      revision: 1,
      status: 'draft',
      createdAt: importedAt,
      createdBy: currentUser.id,
      updatedAt: importedAt,
      updatedBy: currentUser.id,
      basedOnProgrammeId: null,
      importedFrom: {
        type: 'author_assistant_handoff',
        importStep: '92',
        sessionId: preview.sessionId,
        handoffFingerprint: preview.handoffFingerprint,
        acceptanceAuditFingerprint: preview.acceptanceAuditFingerprint,
        authorDraftContentFingerprint: clean(acceptance?.authorDraftContentFingerprint?.value),
        importedAt,
        importedBy: currentUser.id,
        acceptedStages: '1-11'
      },
      notes: 'Created from a browser-verified Author Assistant handoff package.'
    }
  };
}

function duplicateMatch(draft, { draftId, handoffFingerprint }) {
  const source = importSource(draft);
  return draft?.draft?.draftId === draftId
    || source.handoffFingerprint === handoffFingerprint;
}

export function findAuthorHandoffImportDuplicate(existingDrafts = [], identity = {}) {
  return existingDrafts.find(draft => duplicateMatch(draft, identity)) || null;
}

function findEarlierSessionDraft(existingDrafts = [], sessionId = '') {
  return existingDrafts.find(draft => clean(importSource(draft).sessionId) === clean(sessionId)) || null;
}

function sameProgramme(left, right) {
  return clean(left?.programme?.programmeId) === clean(right?.programme?.programmeId)
    && clean(left?.programme?.pathId) === clean(right?.programme?.pathId);
}

function buildUpdatedLocalDraft({ draft, existingDraft, preview, acceptance, currentUser, importedAt }) {
  return {
    ...draft,
    draft: {
      ...structuredClone(existingDraft.draft),
      revision: Number(existingDraft.draft.revision),
      status: 'draft',
      createdAt: existingDraft.draft.createdAt,
      createdBy: existingDraft.draft.createdBy,
      updatedAt: importedAt,
      updatedBy: currentUser.id,
      importedFrom: {
        type: 'author_assistant_handoff',
        importStep: '92-local-revision-update',
        sessionId: preview.sessionId,
        handoffFingerprint: preview.handoffFingerprint,
        acceptanceAuditFingerprint: preview.acceptanceAuditFingerprint,
        authorDraftContentFingerprint: clean(acceptance?.authorDraftContentFingerprint?.value),
        importedAt,
        importedBy: currentUser.id,
        acceptedStages: '1-11',
        previousHandoffFingerprint: clean(importSource(existingDraft).handoffFingerprint)
      },
      notes: 'Updated in place from a newer browser-verified package for the same Author Assistant session.'
    }
  };
}

function acceptedContentFromDraft(draft) {
  const content = exactCopy(draft);
  delete content.draft;
  return content;
}

async function createPlanFingerprintContent({ preview, draft, storageMode }) {
  return {
    step: '92',
    storageMode,
    sessionId: preview.sessionId,
    handoffFingerprint: preview.handoffFingerprint,
    acceptanceAuditFingerprint: preview.acceptanceAuditFingerprint,
    intendedAuthor: preview.intendedAuthor,
    draft
  };
}

export async function prepareAuthorHandoffControlledImport({
  handoffPackage,
  acceptance,
  currentUser,
  existingDrafts = [],
  storageMode = AUTHOR_HANDOFF_PRIVATE_STORAGE_MODE,
  now = () => new Date(),
  cryptoImpl = globalThis.crypto
} = {}) {
  const preview = await validateAuthorHandoffImportPreview({ handoffPackage, acceptance, currentUser, cryptoImpl });
  const importedAt = timestamp(now);
  const draft = buildPrivateDraft({ handoffPackage, acceptance, preview, currentUser, importedAt });
  const sourceContentFingerprint = await fingerprintAuthorHandoffJson(acceptedContentFromDraft(draft), cryptoImpl);
  const expectedContentFingerprint = clean(acceptance?.authorDraftContentFingerprint?.value);
  if (sourceContentFingerprint !== expectedContentFingerprint) throw new Error('The accepted Stage 1-11 content changed during draft preparation.');

  const authorValidation = {
    planning: validateAuthorPlanning(draft),
    content: validateAuthorContent(draft),
    review: validateAuthorReview(draft)
  };
  if (Object.values(authorValidation).some(result => !result.valid)) {
    throw new Error('The accepted package no longer passes the current Author planning, content and review checks.');
  }

  const draftFingerprint = await fingerprintAuthorHandoffJson(draft, cryptoImpl);
  const identity = {
    draftId: draft.draft.draftId,
    sessionId: preview.sessionId,
    handoffFingerprint: preview.handoffFingerprint
  };
  const duplicate = findAuthorHandoffImportDuplicate(existingDrafts, identity);
  const earlierSessionDraft = duplicate ? null : findEarlierSessionDraft(existingDrafts, preview.sessionId);
  const canReviseEarlierSession = Boolean(
    earlierSessionDraft
    && earlierSessionDraft.draft?.createdBy === currentUser.id
    && sameProgramme(earlierSessionDraft, draft)
  );
  const revisedDraft = canReviseEarlierSession
    ? buildUpdatedLocalDraft({ draft, existingDraft: earlierSessionDraft, preview, acceptance, currentUser, importedAt })
    : null;
  const localMode = storageMode === AUTHOR_HANDOFF_PRIVATE_STORAGE_MODE;

  if (revisedDraft) {
    const revisedContent = acceptedContentFromDraft(revisedDraft);
    const revisedContentFingerprint = await fingerprintAuthorHandoffJson(revisedContent, cryptoImpl);
    if (revisedContentFingerprint !== expectedContentFingerprint) throw new Error('The accepted Stage 1-11 content changed during local revision preparation.');
  }

  const operation = revisedDraft ? 'update_existing_local' : 'create_new_local';
  const planDraft = revisedDraft || draft;
  const calculatedPlanFingerprint = await fingerprintAuthorHandoffJson(
    await createPlanFingerprintContent({ preview, draft: planDraft, storageMode }),
    cryptoImpl
  );

  return {
    operation,
    step: '92',
    preview,
    importedAt,
    storageMode,
    storageLabel: 'Local Drafts - private browser storage',
    draft: planDraft,
    draftFingerprint: revisedDraft ? await fingerprintAuthorHandoffJson(revisedDraft, cryptoImpl) : draftFingerprint,
    planFingerprint: calculatedPlanFingerprint,
    sourceContentFingerprint,
    authorValidation,
    acceptedContentUnchanged: true,
    identity,
    duplicate: Boolean(duplicate),
    duplicateDraftId: duplicate?.draft?.draftId || null,
    existingDraft: earlierSessionDraft,
    beforeRevision: earlierSessionDraft?.draft?.revision || null,
    afterRevision: earlierSessionDraft ? Number(earlierSessionDraft.draft.revision) + 1 : null,
    beforeDraftCount: existingDrafts.length,
    afterDraftCount: duplicate || revisedDraft ? existingDrafts.length : existingDrafts.length + 1,
    canCreate: localMode && !duplicate && !revisedDraft,
    canUpdateLocal: localMode && Boolean(revisedDraft),
    blockedReason: !localMode
      ? 'Select Local Drafts before creating this private browser draft.'
      : duplicate
        ? 'This accepted handoff package has already been imported. A second draft will not be created.'
        : earlierSessionDraft && !canReviseEarlierSession
          ? 'An earlier package from this session belongs to a different Author or programme. Nothing was changed.'
        : '',
    boundaries: {
      createsExactlyOnePrivateDraft: !revisedDraft,
      updatesExactlyOneExistingLocalDraft: Boolean(revisedDraft),
      bindsOnlySignedInAuthor: true,
      acceptedStagesOneToElevenUnchanged: true,
      supabaseWrite: false,
      awsConnection: false,
      releaseCandidatePrepared: false,
      approvalPerformed: false,
      published: false,
      stage12Started: false
    }
  };
}

export async function executeAuthorHandoffControlledImport({
  handoffPackage,
  acceptance,
  currentUser,
  preparedPlan,
  confirmation,
  storageMode = AUTHOR_HANDOFF_PRIVATE_STORAGE_MODE,
  listDrafts,
  storeDraft,
  saveDraft,
  cryptoImpl = globalThis.crypto
} = {}) {
  const updatingLocal = preparedPlan?.operation === 'update_existing_local';
  const requiredConfirmation = updatingLocal ? AUTHOR_HANDOFF_LOCAL_UPDATE_CONFIRMATION : AUTHOR_HANDOFF_IMPORT_CONFIRMATION;
  if (confirmation !== requiredConfirmation) {
    return { success: false, confirmationRequired: true, error: updatingLocal ? 'Confirm the exact Local Draft revision update.' : 'Confirm creation of exactly one private Author draft.' };
  }
  if (storageMode !== AUTHOR_HANDOFF_PRIVATE_STORAGE_MODE) {
    return { success: false, wrongStorageMode: true, error: 'Select Local Drafts before importing this package.' };
  }
  if (typeof listDrafts !== 'function' || typeof storeDraft !== 'function' || (updatingLocal && typeof saveDraft !== 'function')) {
    return { success: false, error: 'Private Author draft storage is unavailable.' };
  }
  if (!preparedPlan?.planFingerprint || preparedPlan.storageMode !== AUTHOR_HANDOFF_PRIVATE_STORAGE_MODE) {
    return { success: false, comparisonRequired: true, error: 'Run the exact pre-import comparison again.' };
  }

  try {
    const currentBeforeRebuild = await listDrafts();
    if (!currentBeforeRebuild?.success) return { success: false, error: currentBeforeRebuild?.error || 'Unable to check existing private drafts.' };
    const rebuiltPlan = await prepareAuthorHandoffControlledImport({
      handoffPackage,
      acceptance,
      currentUser,
      existingDrafts: currentBeforeRebuild.drafts || [],
      storageMode,
      now: () => new Date(preparedPlan.importedAt),
      cryptoImpl
    });
    if (
      rebuiltPlan.planFingerprint !== preparedPlan.planFingerprint
      || rebuiltPlan.draftFingerprint !== preparedPlan.draftFingerprint
      || rebuiltPlan.identity.draftId !== preparedPlan.identity?.draftId
      || rebuiltPlan.preview.intendedAuthor.id !== currentUser?.id
    ) return { success: false, comparisonChanged: true, error: 'The package, Author or import comparison changed. Run the comparison again.' };

    if (updatingLocal) {
      if (rebuiltPlan.operation !== 'update_existing_local' || !rebuiltPlan.canUpdateLocal) {
        return { success: false, conflict: true, error: rebuiltPlan.blockedReason || 'The existing Local Draft changed before the update.' };
      }
      const saved = await saveDraft({ draft: rebuiltPlan.draft, expectedRevision: rebuiltPlan.beforeRevision });
      if (!saved?.success) return { ...saved, success: false, error: saved?.error || 'The Local Draft update was not saved.' };
      if (saved.draft?.draft?.draftId !== rebuiltPlan.existingDraft?.draft?.draftId || Number(saved.draft?.draft?.revision) !== rebuiltPlan.afterRevision) {
        return { success: false, error: 'The saved Local Draft did not match the approved revision comparison.' };
      }
      return {
        success: true,
        updatedCount: 1,
        draft: saved.draft,
        draftId: saved.draft.draft.draftId,
        revision: saved.draft.draft.revision,
        storageMode: AUTHOR_HANDOFF_PRIVATE_STORAGE_MODE,
        stage12Started: false,
        candidateCreated: false,
        approved: false,
        published: false,
        message: 'Exactly one existing Local Draft was updated to its next revision from the verified package.'
      };
    }

    const current = currentBeforeRebuild;
    const duplicate = findAuthorHandoffImportDuplicate(current.drafts || [], rebuiltPlan.identity);
    if (duplicate) {
      return {
        success: false,
        duplicate: true,
        draft: duplicate,
        draftId: duplicate.draft.draftId,
        error: 'This accepted handoff package has already been imported. No second draft was created.'
      };
    }

    const stored = await storeDraft(rebuiltPlan.draft);
    if (!stored?.success) return { ...stored, success: false, error: stored?.error || 'The private draft was not created.' };
    if (stored.draft?.draft?.draftId !== rebuiltPlan.identity.draftId || stored.draft?.draft?.createdBy !== currentUser.id) {
      return { success: false, error: 'The stored draft identity did not match the approved import comparison.' };
    }

    return {
      success: true,
      createdCount: 1,
      draft: stored.draft,
      draftId: stored.draft.draft.draftId,
      revision: stored.draft.draft.revision,
      ownerId: stored.draft.draft.createdBy,
      storageMode: AUTHOR_HANDOFF_PRIVATE_STORAGE_MODE,
      handoffFingerprint: rebuiltPlan.preview.handoffFingerprint,
      stage12Started: false,
      candidateCreated: false,
      approved: false,
      published: false,
      message: 'Exactly one private Author draft was created from the verified package.'
    };
  } catch (error) {
    return { success: false, error: error?.message || 'The controlled Author import stopped safely.' };
  }
}
