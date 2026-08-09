import { loadAuthorDrafts, saveAuthorDraft, storeNewAuthorDraft } from './authorDraftService.js';
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

function copySummary(localDraft, remoteDraft) {
  return {
    draftId: draftId(localDraft),
    title: localDraft?.programme?.displayName || localDraft?.programme?.serviceName || 'Untitled Follow Along',
    serviceName: localDraft?.programme?.serviceName || '',
    localRevision: draftRevision(localDraft),
    localUpdatedAt: localDraft?.draft?.updatedAt || null,
    remoteRevision: remoteDraft ? draftRevision(remoteDraft) : null,
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

    async storeReleaseCandidate(candidate) {
      if (getMode() !== AUTHOR_STORAGE_MODE.SHARED) {
        return { success: false, disabled: true, storageMode: AUTHOR_STORAGE_MODE.LOCAL, error: 'Trusted approval requires a shared draft.' };
      }
      return remote.storeReleaseCandidate(candidate);
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
          drafts: local.drafts.map(item => copySummary(item, null)),
          error: 'Shared Author storage is disabled. Local drafts remain unchanged.'
        };
      }

      const shared = await remote.listDrafts();
      if (!shared.success) {
        return { ...shared, previewOnly: true, localPreserved: true, localDraftCount: local.drafts.length };
      }

      const remoteById = new Map((shared.drafts || []).map(item => [draftId(item), item]));
      const drafts = local.drafts.map(item => copySummary(item, remoteById.get(draftId(item))));
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
      return {
        success: true,
        storageMode: AUTHOR_STORAGE_MODE.SHARED,
        draft: copied.draft,
        row: copied.row,
        localPreserved: true,
        localVerified: localStillExists,
        message: 'The draft was copied to shared storage. The private browser draft remains available.'
      };
    }
  };
}
