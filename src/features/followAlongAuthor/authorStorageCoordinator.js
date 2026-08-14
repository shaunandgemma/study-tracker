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
  CONFLICT: 'remote_draft_already_exists',
  UPDATE_READY: 'ready_to_update_existing_programme',
  UPDATE_BLOCKED: 'existing_programme_update_blocked'
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
  const identityMatches = draft?.draft?.draftId === `author-draft-import-${fingerprint}`
    || (source.importStep === '92-local-revision-update'
      && SHA256_PATTERN.test(String(source.previousHandoffFingerprint || '').trim().toLowerCase())
      && draft?.draft?.draftId === `author-draft-import-${String(source.previousHandoffFingerprint).trim().toLowerCase()}`);
  return source.type === 'author_assistant_handoff'
    && ['92', '92-local-revision-update'].includes(source.importStep)
    && source.acceptedStages === '1-11'
    && SHA256_PATTERN.test(fingerprint)
    && SHA256_PATTERN.test(String(source.authorDraftContentFingerprint || '').trim().toLowerCase())
    && identityMatches;
}

function programmeId(draft) {
  return String(draft?.programme?.programmeId || '').trim();
}

function comparableDraftContent(draft) {
  const content = structuredClone(draft || {});
  delete content.draft;
  delete content.review;
  delete content.publication;
  return content;
}

function activeCandidateForDraft(candidate, remoteDraft, publishedCandidateIds = new Set()) {
  const candidateId = String(candidate?.candidate_id || candidate?.candidateId || '');
  const candidateDraftId = candidate?.draft_id || candidate?.sourceDraftId;
  const candidateRevision = Number(candidate?.source_revision ?? candidate?.sourceRevision);
  const decision = String(candidate?.approval_decision ?? candidate?.approval?.decision ?? '').toLowerCase();
  const status = String(candidate?.status || '').toLowerCase();
  const final = publishedCandidateIds.has(candidateId)
    || Boolean(candidate?.published_at || candidate?.publishedAt)
    || decision === 'rejected'
    || status === 'rejected'
    || status === 'published';
  return !final && candidateDraftId === draftId(remoteDraft) && candidateRevision === draftRevision(remoteDraft);
}

async function copySummary(localDraft, remoteDraft, { programmeMatch = false, programmeMatchCount = remoteDraft ? 1 : 0, activeCandidates = [] } = {}) {
  const [localContentFingerprint, remoteContentFingerprint, localComparableFingerprint, remoteComparableFingerprint] = await Promise.all([
    fingerprintAuthorHandoffJson(localDraft),
    remoteDraft ? fingerprintAuthorHandoffJson(remoteDraft) : Promise.resolve(null),
    fingerprintAuthorHandoffJson(comparableDraftContent(localDraft)),
    remoteDraft ? fingerprintAuthorHandoffJson(comparableDraftContent(remoteDraft)) : Promise.resolve(null)
  ]);
  const source = localDraft?.draft?.importedFrom || {};
  const exactIdMatch = Boolean(remoteDraft && draftId(remoteDraft) === draftId(localDraft));
  const sameProgrammeDraft = Boolean(remoteDraft && programmeId(remoteDraft) === programmeId(localDraft));
  const canUpdateShared = Boolean(
    remoteDraft
    && sameProgrammeDraft
    && programmeMatchCount === 1
    && verifiedHandoff(localDraft)
    && localDraft?.draft?.createdBy === remoteDraft?.draft?.createdBy
    && activeCandidates.length === 0
    && localComparableFingerprint !== remoteComparableFingerprint
  );
  return {
    draftId: draftId(localDraft),
    title: localDraft?.programme?.displayName || localDraft?.programme?.serviceName || 'Untitled Follow Along',
    serviceName: localDraft?.programme?.serviceName || '',
    localRevision: draftRevision(localDraft),
    localUpdatedAt: localDraft?.draft?.updatedAt || null,
    remoteRevision: remoteDraft ? draftRevision(remoteDraft) : null,
    remoteDraftId: remoteDraft ? draftId(remoteDraft) : null,
    programmeMatch,
    programmeMatchCount,
    activeCandidateCount: activeCandidates.length,
    ownerId: localDraft?.draft?.createdBy || '',
    programmeId: localDraft?.programme?.programmeId || '',
    serviceSlug: localDraft?.programme?.serviceSlug || '',
    assistantSessionId: source.sessionId || '',
    handoffFingerprint: source.handoffFingerprint || '',
    isVerifiedHandoff: verifiedHandoff(localDraft),
    localContentFingerprint,
    remoteContentFingerprint,
    localComparableFingerprint,
    remoteComparableFingerprint,
    remoteContentMatches: remoteDraft ? localComparableFingerprint === remoteComparableFingerprint : null,
    counts: contentCounts(localDraft),
    status: canUpdateShared
      ? AUTHOR_DRAFT_COPY_STATUS.UPDATE_READY
      : exactIdMatch
        ? localComparableFingerprint === remoteComparableFingerprint ? AUTHOR_DRAFT_COPY_STATUS.CONFLICT : AUTHOR_DRAFT_COPY_STATUS.UPDATE_BLOCKED
        : programmeMatch
          ? AUTHOR_DRAFT_COPY_STATUS.UPDATE_BLOCKED
          : AUTHOR_DRAFT_COPY_STATUS.READY,
    canCopy: !remoteDraft && !programmeMatch,
    canUpdateShared,
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

      const [shared, candidates, published] = await Promise.all([
        remote.listDrafts(),
        remote.listReleaseCandidates(),
        remote.listPublishedDrafts()
      ]);
      if (!shared.success) {
        return { ...shared, previewOnly: true, localPreserved: true, localDraftCount: local.drafts.length };
      }
      if (!candidates.success) {
        return { ...candidates, previewOnly: true, localPreserved: true, localDraftCount: local.drafts.length };
      }
      if (!published.success) {
        return { ...published, previewOnly: true, localPreserved: true, localDraftCount: local.drafts.length };
      }

      const publishedCandidateIds = new Set((published.publications || []).map(item => String(item.candidate_id || item.candidateId || '')));

      const remoteById = new Map((shared.drafts || []).map(item => [draftId(item), item]));
      const remoteByProgramme = new Map();
      (shared.drafts || []).forEach(item => {
        const key = programmeId(item);
        if (!key) return;
        remoteByProgramme.set(key, [...(remoteByProgramme.get(key) || []), item]);
      });
      const drafts = await Promise.all(local.drafts.map(item => {
        const exact = remoteById.get(draftId(item));
        if (exact) {
          const activeCandidates = (candidates.candidates || []).filter(candidate => activeCandidateForDraft(candidate, exact, publishedCandidateIds));
          return copySummary(item, exact, { programmeMatch: programmeId(exact) === programmeId(item), programmeMatchCount: 1, activeCandidates });
        }
        const programmeMatches = remoteByProgramme.get(programmeId(item)) || [];
        const matched = programmeMatches.length === 1 ? programmeMatches[0] : null;
        const activeCandidates = matched ? (candidates.candidates || []).filter(candidate => activeCandidateForDraft(candidate, matched, publishedCandidateIds)) : [];
        return copySummary(item, matched, { programmeMatch: programmeMatches.length > 0, programmeMatchCount: programmeMatches.length, activeCandidates });
      }));
      return {
        success: true,
        previewOnly: true,
        localPreserved: true,
        storageMode: AUTHOR_STORAGE_MODE.SHARED,
        localDraftCount: drafts.length,
        readyCount: drafts.filter(item => item.canCopy).length,
        updateReadyCount: drafts.filter(item => item.canUpdateShared).length,
        conflictCount: drafts.filter(item => !item.canCopy && !item.canUpdateShared).length,
        drafts
      };
    },

    async updateSharedDraftFromLocal({
      localDraftId,
      sharedDraftId,
      confirmation,
      expectedLocalRevision,
      expectedSharedRevision,
      expectedLocalContentFingerprint,
      expectedSharedContentFingerprint
    } = {}) {
      if (getMode() !== AUTHOR_STORAGE_MODE.SHARED) {
        return { success: false, disabled: true, localPreserved: true, error: 'Select Shared Drafts before updating the existing programme.' };
      }
      if (!localDraftId || !sharedDraftId || confirmation !== `UPDATE ${sharedDraftId} FROM ${localDraftId}`) {
        return { success: false, confirmationRequired: true, localPreserved: true, error: 'Confirm the exact Local and Shared Draft IDs before updating.' };
      }

      const local = loadLocal();
      if (!local.success) return { ...local, localPreserved: true };
      const source = local.drafts.find(item => draftId(item) === localDraftId);
      if (!source) return { success: false, notFound: true, localPreserved: true, error: 'The verified Local Draft could not be found.' };
      if (!verifiedHandoff(source) || source.draft.createdBy !== userId) return { success: false, localPreserved: true, error: 'The Local Draft is not a verified handoff owned by this Author.' };
      if (draftRevision(source) !== Number(expectedLocalRevision)) return { success: false, conflict: true, localPreserved: true, error: `The Local Draft changed to revision ${draftRevision(source)} after the preview.` };

      const [shared, candidates, published] = await Promise.all([
        remote.listDrafts(),
        remote.listReleaseCandidates(),
        remote.listPublishedDrafts()
      ]);
      if (!shared.success) return { ...shared, success: false, localPreserved: true };
      if (!candidates.success) return { ...candidates, success: false, localPreserved: true };
      if (!published.success) return { ...published, success: false, localPreserved: true };
      const matches = (shared.drafts || []).filter(item => programmeId(item) === programmeId(source));
      if (matches.length !== 1 || draftId(matches[0]) !== sharedDraftId) {
        return { success: false, conflict: true, localPreserved: true, error: 'The existing Shared Draft programme match changed after the preview.' };
      }
      const target = matches[0];
      if (target.draft.createdBy !== userId || source.draft.createdBy !== target.draft.createdBy) return { success: false, localPreserved: true, error: 'The signed-in Author does not own both drafts.' };
      if (draftRevision(target) !== Number(expectedSharedRevision)) return { success: false, conflict: true, localPreserved: true, error: `The Shared Draft changed to revision ${draftRevision(target)} after the preview.` };
      const publishedCandidateIds = new Set((published.publications || []).map(item => String(item.candidate_id || item.candidateId || '')));
      if ((candidates.candidates || []).some(candidate => activeCandidateForDraft(candidate, target, publishedCandidateIds))) {
        return { success: false, conflict: true, localPreserved: true, error: 'An active release candidate exists for this Shared Draft revision. Resolve it before updating.' };
      }

      const [localFingerprint, sharedFingerprint] = await Promise.all([
        fingerprintAuthorHandoffJson(source),
        fingerprintAuthorHandoffJson(target)
      ]);
      if (localFingerprint !== expectedLocalContentFingerprint || sharedFingerprint !== expectedSharedContentFingerprint) {
        return { success: false, conflict: true, localPreserved: true, error: 'The Local or Shared Draft content changed after the preview.' };
      }

      const updatedAt = new Date().toISOString();
      const next = {
        ...structuredClone(source),
        draft: {
          ...structuredClone(target.draft),
          revision: draftRevision(target),
          status: 'draft',
          createdAt: target.draft.createdAt,
          createdBy: target.draft.createdBy,
          updatedAt,
          updatedBy: userId,
          basedOnProgrammeId: programmeId(target),
          importedFrom: structuredClone(source.draft.importedFrom),
          lastAssistantUpdate: {
            type: 'verified_local_to_existing_shared_update',
            localDraftId,
            localRevision: draftRevision(source),
            localContentFingerprint: localFingerprint,
            updatedAt,
            updatedBy: userId
          },
          notes: 'Updated from the exact verified Local Draft after a controlled programme comparison.'
        }
      };
      const saved = await remote.saveDraft({ draft: next, expectedRevision: draftRevision(target) });
      if (!saved.success) return { ...saved, success: false, localPreserved: true };
      if (draftId(saved.draft) !== sharedDraftId || draftRevision(saved.draft) !== draftRevision(target) + 1) {
        return { success: false, localPreserved: true, error: 'The saved Shared Draft did not match the approved revision comparison.' };
      }
      const localAfter = loadLocal();
      const preserved = localAfter.success && localAfter.drafts.some(item => draftId(item) === localDraftId && draftRevision(item) === draftRevision(source));
      return {
        success: true,
        updatedCount: 1,
        localPreserved: preserved,
        localDraftId,
        sharedDraftId,
        sharedRevision: draftRevision(saved.draft),
        draft: saved.draft,
        candidateCreated: false,
        approved: false,
        published: false,
        message: `The existing Shared Draft was updated to revision ${draftRevision(saved.draft)}. The verified Local Draft remains unchanged.`
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
