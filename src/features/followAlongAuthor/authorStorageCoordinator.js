import { deleteAuthorDraft, loadAuthorDrafts, saveAuthorDraft, storeNewAuthorDraft } from './authorDraftService.js';
import { buildAuthorCandidateReadinessPreview, isStep94VerifiedSqsDraft } from './authorCandidateReadiness.js';
import { fingerprintAuthorHandoffJson } from './authorHandoffPreview.js';
import { createAuthorSharedStorageService, isAuthorSharedStorageEnabled } from './authorSharedStorageService.js';

export const AUTHOR_STORAGE_MODE = Object.freeze({
  LOCAL: 'private_local_browser',
  SHARED: 'shared_supabase'
});

export const AUTHOR_DRAFT_COPY_STATUS = Object.freeze({
  READY: 'ready_to_copy',
  CONFLICT: 'remote_draft_already_exists'
});

function localDraftResult(userId, storage) {
  return loadAuthorDrafts({ userId, storage });
}

function draftId(draft) {
  return String(draft?.draft?.draftId || '');
}

function draftRevision(draft) {
  return Number(draft?.draft?.revision) || 1;
}

const SHA256_PATTERN = /^[a-f0-9]{64}$/;

function contentCounts(draft) {
  const tasks = draft?.tasks || [];
  return {
    phaseCount: (draft?.phases || []).length,
    taskCount: tasks.length,
    checkboxCount: tasks.flatMap(task => task.consoleSteps || []).flatMap(step => step.instructions || []).length,
    verificationCheckCount: tasks.flatMap(task => task.verification || []).length,
    cleanupItemCount: tasks.flatMap(task => task.cleanup || []).length + (draft?.cleanup?.steps || []).length,
    officialAwsSourceCount: (draft?.sources || []).length
  };
}

function verifiedHandoff(draft) {
  const source = draft?.draft?.importedFrom || {};
  const fingerprint = String(source.handoffFingerprint || '').trim().toLowerCase();
  return source.type === 'author_assistant_handoff'
    && source.importStep === '92'
    && source.acceptedStages === '1-11'
    && SHA256_PATTERN.test(fingerprint)
    && SHA256_PATTERN.test(String(source.authorDraftContentFingerprint || '').trim().toLowerCase())
    && draft?.draft?.draftId === `author-draft-import-${fingerprint}`;
}

async function copySummary(localDraft, remoteDraft) {
  const [localContentFingerprint, remoteContentFingerprint] = await Promise.all([
    fingerprintAuthorHandoffJson(localDraft),
    remoteDraft ? fingerprintAuthorHandoffJson(remoteDraft) : Promise.resolve(null)
  ]);
  const source = localDraft?.draft?.importedFrom || {};
  return {
    draftId: draftId(localDraft),
    title: localDraft?.programme?.displayName || localDraft?.programme?.serviceName || 'Untitled Follow Along',
    serviceName: localDraft?.programme?.serviceName || '',
    localRevision: draftRevision(localDraft),
    localUpdatedAt: localDraft?.draft?.updatedAt || null,
    remoteRevision: remoteDraft ? draftRevision(remoteDraft) : null,
    ownerId: localDraft?.draft?.createdBy || '',
    programmeId: localDraft?.programme?.programmeId || '',
    serviceSlug: localDraft?.programme?.serviceSlug || '',
    assistantSessionId: source.sessionId || '',
    handoffFingerprint: source.handoffFingerprint || '',
    isVerifiedHandoff: verifiedHandoff(localDraft),
    localContentFingerprint,
    remoteContentFingerprint,
    remoteContentMatches: remoteDraft ? localContentFingerprint === remoteContentFingerprint : null,
    counts: contentCounts(localDraft),
    status: remoteDraft ? AUTHOR_DRAFT_COPY_STATUS.CONFLICT : AUTHOR_DRAFT_COPY_STATUS.READY,
    canCopy: !remoteDraft,
    localWillRemain: true
  };
}

export function createAuthorStorageCoordinator({
  userId,
  storage,
  environment,
  enabled,
  sharedService,
  initialMode = AUTHOR_STORAGE_MODE.LOCAL
} = {}) {
  const sharedEnabled = enabled === undefined ? isAuthorSharedStorageEnabled(environment) : Boolean(enabled);
  const remote = sharedService || createAuthorSharedStorageService(undefined, { enabled: sharedEnabled });
  let selectedMode = initialMode === AUTHOR_STORAGE_MODE.SHARED && sharedEnabled && remote?.enabled !== false
    ? AUTHOR_STORAGE_MODE.SHARED
    : AUTHOR_STORAGE_MODE.LOCAL;

  const getMode = () => selectedMode;

  const loadLocal = () => localDraftResult(userId, storage);

  return {
    isSharedConfigured: sharedEnabled,
    getMode,

    selectSharedMode() {
      if (!sharedEnabled || remote?.enabled === false) {
        selectedMode = AUTHOR_STORAGE_MODE.LOCAL;
        return { success: false, disabled: true, storageMode: AUTHOR_STORAGE_MODE.LOCAL, error: 'Shared Author storage is disabled.' };
      }
      selectedMode = AUTHOR_STORAGE_MODE.SHARED;
      return { success: true, storageMode: AUTHOR_STORAGE_MODE.SHARED, message: 'Shared Drafts mode selected for this Author session.' };
    },

    returnToLocalMode() {
      selectedMode = AUTHOR_STORAGE_MODE.LOCAL;
      return {
        success: true,
        storageMode: AUTHOR_STORAGE_MODE.LOCAL,
        message: 'This Author session is using private browser drafts. No local draft was removed.'
      };
    },

    async listDrafts() {
      if (getMode() === AUTHOR_STORAGE_MODE.LOCAL) {
        const result = loadLocal();
        return { ...result, storageMode: AUTHOR_STORAGE_MODE.LOCAL };
      }
      return remote.listDrafts();
    },

    async listPublishedDrafts() {
      if (getMode() !== AUTHOR_STORAGE_MODE.SHARED) return { success: true, storageMode: AUTHOR_STORAGE_MODE.LOCAL, publications: [], publishedDraftIds: [] };
      return remote.listPublishedDrafts();
    },

    async listReleaseCandidates() {
      if (getMode() !== AUTHOR_STORAGE_MODE.SHARED) return { success: true, storageMode: AUTHOR_STORAGE_MODE.LOCAL, candidates: [] };
      return remote.listReleaseCandidates();
    },

    async loadDraft(requestedDraftId) {
      if (!requestedDraftId) return { success: false, notFound: true, storageMode: getMode(), error: 'A draft ID is required.' };
      if (getMode() === AUTHOR_STORAGE_MODE.SHARED) return remote.loadDraft(requestedDraftId);
      const local = loadLocal();
      if (!local.success) return { ...local, storageMode: AUTHOR_STORAGE_MODE.LOCAL };
      const draft = local.drafts.find(item => draftId(item) === requestedDraftId);
      return draft
        ? { success: true, draft, storageMode: AUTHOR_STORAGE_MODE.LOCAL }
        : { success: false, notFound: true, storageMode: AUTHOR_STORAGE_MODE.LOCAL, error: 'The private draft could not be found.' };
    },

    async storeNewDraft(draft) {
      if (getMode() === AUTHOR_STORAGE_MODE.SHARED) return remote.storeNewDraft(draft);
      const result = storeNewAuthorDraft({ userId, draft, storage });
      return { ...result, storageMode: AUTHOR_STORAGE_MODE.LOCAL };
    },

    async saveDraft({ draft, expectedRevision } = {}) {
      if (getMode() === AUTHOR_STORAGE_MODE.SHARED) return remote.saveDraft({ draft, expectedRevision });
      const result = saveAuthorDraft({ userId, draft, expectedRevision, storage });
      return { ...result, storageMode: AUTHOR_STORAGE_MODE.LOCAL };
    },

    async deleteDraft({ draftId: requestedDraftId, expectedRevision, confirmation } = {}) {
      if (getMode() === AUTHOR_STORAGE_MODE.SHARED) return remote.deleteDraft({ draftId: requestedDraftId, expectedRevision, confirmation });
      return deleteAuthorDraft({ userId, draftId: requestedDraftId, expectedRevision, confirmation, storage });
    },

    async storeReleaseCandidate(candidate) {
      if (getMode() !== AUTHOR_STORAGE_MODE.SHARED) {
        return { success: false, disabled: true, storageMode: AUTHOR_STORAGE_MODE.LOCAL, error: 'Trusted approval requires a shared draft.' };
      }
      return remote.storeReleaseCandidate(candidate);
    },

    async previewReleaseCandidateReadiness({ draft, authorEmail, planningValidation, contentValidation, reviewValidation } = {}) {
      if (getMode() !== AUTHOR_STORAGE_MODE.SHARED) {
        return { success: false, disabled: true, previewOnly: true, error: 'Select the private Shared Draft before checking candidate readiness.' };
      }
      if (!isStep94VerifiedSqsDraft(draft)) {
        return { success: false, wrongTarget: true, previewOnly: true, error: 'Step 94 is limited to the exact verified SQS handoff draft.' };
      }
      const [saved, candidateResult] = await Promise.all([
        remote.loadDraft(draft.draft.draftId),
        remote.listReleaseCandidates()
      ]);
      if (!saved.success) return { ...saved, success: false, previewOnly: true };
      if (!candidateResult.success) return { ...candidateResult, success: false, previewOnly: true };
      return buildAuthorCandidateReadinessPreview({
        draft,
        userId,
        authorEmail,
        storageMode: getMode(),
        serverDraft: saved.draft,
        serverRow: saved.row,
        candidates: candidateResult.candidates || [],
        planningValidation,
        contentValidation,
        reviewValidation
      });
    },

    async previewLocalDraftCopies() {
      const local = loadLocal();
      if (!local.success) return { ...local, previewOnly: true, localPreserved: true, storageMode: AUTHOR_STORAGE_MODE.LOCAL };

      if (getMode() !== AUTHOR_STORAGE_MODE.SHARED) {
        return {
          success: false,
          disabled: true,
          previewOnly: true,
          localPreserved: true,
          storageMode: AUTHOR_STORAGE_MODE.LOCAL,
          drafts: await Promise.all(local.drafts.map(item => copySummary(item, null))),
          error: 'Shared Author storage is disabled. Local drafts remain unchanged.'
        };
      }

      const shared = await remote.listDrafts();
      if (!shared.success) {
        return { ...shared, previewOnly: true, localPreserved: true, localDraftCount: local.drafts.length };
      }

      const remoteById = new Map((shared.drafts || []).map(item => [draftId(item), item]));
      const drafts = await Promise.all(local.drafts.map(item => copySummary(item, remoteById.get(draftId(item)))));
      return {
        success: true,
        previewOnly: true,
        localPreserved: true,
        storageMode: AUTHOR_STORAGE_MODE.SHARED,
        localDraftCount: drafts.length,
        readyCount: drafts.filter(item => item.canCopy).length,
        conflictCount: drafts.filter(item => !item.canCopy).length,
        drafts
      };
    },

    async copyLocalDraft({ draftId: requestedDraftId, confirmedDraftId, expectedLocalRevision } = {}) {
      if (getMode() !== AUTHOR_STORAGE_MODE.SHARED) {
        return { success: false, disabled: true, localPreserved: true, storageMode: AUTHOR_STORAGE_MODE.LOCAL, error: 'Shared Author storage is disabled.' };
      }
      if (!requestedDraftId || confirmedDraftId !== requestedDraftId) {
        return { success: false, confirmationRequired: true, localPreserved: true, error: 'Confirm this exact draft before copying it.' };
      }

      const local = loadLocal();
      if (!local.success) return { ...local, localPreserved: true };
      const source = local.drafts.find(item => draftId(item) === requestedDraftId);
      if (!source) return { success: false, notFound: true, localPreserved: true, error: 'The local draft could not be found.' };
      if (expectedLocalRevision !== undefined && draftRevision(source) !== Number(expectedLocalRevision)) {
        return { success: false, conflict: true, localPreserved: true, error: `The local draft changed to revision ${draftRevision(source)} after the preview.` };
      }

      const existing = await remote.loadDraft(requestedDraftId);
      if (existing.success) {
        return {
          success: false,
          conflict: true,
          localPreserved: true,
          remoteRevision: draftRevision(existing.draft),
          error: 'A shared draft with this ID already exists. Nothing was overwritten.'
        };
      }
      if (!existing.notFound) return { ...existing, success: false, localPreserved: true };

      const copied = await remote.storeNewDraft(source);
      if (!copied.success) {
        return {
          ...copied,
          success: false,
          conflict: copied.errorCode === '23505',
          localPreserved: true,
          error: copied.errorCode === '23505' ? 'A shared draft with this ID was created before this copy finished. Nothing was overwritten.' : copied.error
        };
      }

      const afterCopy = loadLocal();
      const localStillExists = afterCopy.success && afterCopy.drafts.some(item => draftId(item) === requestedDraftId);
      const [localContentFingerprint, sharedContentFingerprint] = await Promise.all([
        fingerprintAuthorHandoffJson(source),
        fingerprintAuthorHandoffJson(copied.draft)
      ]);
      return {
        success: true,
        storageMode: AUTHOR_STORAGE_MODE.SHARED,
        draft: copied.draft,
        row: copied.row,
        localPreserved: true,
        localVerified: localStillExists,
        exactContentVerified: localContentFingerprint === sharedContentFingerprint,
        localContentFingerprint,
        sharedContentFingerprint,
        initialSharedRevision: draftRevision(copied.draft),
        message: localContentFingerprint === sharedContentFingerprint
          ? 'The exact draft was copied to shared storage at revision 1. The private browser draft remains available.'
          : 'The shared copy was created but its returned content did not match the private draft fingerprint. Stop before Stage 12.'
      };
    }
  };
}
