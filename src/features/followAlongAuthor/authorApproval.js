import { canAccessFollowAlongApprovals, getAuthorRoles } from './authorAccess.js';
import { normalizeAuthorDraft } from './authorDraftService.js';

export const AUTHOR_APPROVAL_STORAGE_AUTHORITY = Object.freeze({
  LOCAL_BROWSER: 'local_browser',
  TRUSTED_SERVER: 'trusted_server'
});

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((result, key) => {
      result[key] = canonicalize(value[key]);
      return result;
    }, {});
  }
  return value;
}

function canonicalJson(value) {
  return JSON.stringify(canonicalize(value));
}

async function sha256(value, cryptoProvider = globalThis.crypto) {
  if (!cryptoProvider?.subtle?.digest) throw new Error('Secure release-candidate hashing is unavailable.');
  const bytes = new TextEncoder().encode(value);
  const digest = await cryptoProvider.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function timestamp(now) {
  const value = typeof now === 'function' ? now() : now;
  return (value instanceof Date ? value : new Date(value || Date.now())).toISOString();
}

export function getAuthorApproverRoles(user) {
  const roles = getAuthorRoles(user);
  if (!canAccessFollowAlongApprovals(user)) return [];
  return roles.filter(role => role === 'admin' || role === 'approver');
}

export function canApproveAuthorRelease({ user, createdBy, storageAuthority } = {}) {
  if (storageAuthority !== AUTHOR_APPROVAL_STORAGE_AUTHORITY.TRUSTED_SERVER) return { allowed: false, reason: 'Final approval requires trusted shared server storage.' };
  if (!clean(user?.id)) return { allowed: false, reason: 'A signed-in approver is required.' };
  if (!getAuthorApproverRoles(user).length) return { allowed: false, reason: 'A server-managed admin or approver role is required.' };
  if (user.id === createdBy) return { allowed: false, reason: 'The draft author cannot approve their own release candidate.' };
  return { allowed: true, reason: '' };
}

export function buildAuthorReleaseSnapshot(draft) {
  const normalized = normalizeAuthorDraft(draft);
  return clone({
    schema: normalized.schema,
    draft: {
      draftId: normalized.draft?.draftId,
      revision: normalized.draft?.revision,
      createdAt: normalized.draft?.createdAt,
      createdBy: normalized.draft?.createdBy,
      updatedAt: normalized.draft?.updatedAt,
      updatedBy: normalized.draft?.updatedBy
    },
    programme: { ...normalized.programme, publicationVisibility: 'unpublished' },
    sources: normalized.sources || [],
    presentation: normalized.presentation || {},
    storage: normalized.storage || {},
    progress: normalized.progress || {},
    capabilities: normalized.capabilities || {},
    phases: normalized.phases || [],
    tasks: normalized.tasks || [],
    resources: normalized.resources || {},
    warnings: normalized.warnings || {},
    cleanup: { ...(normalized.cleanup || {}), manualOnly: true },
    extensions: normalized.extensions || {},
    review: { ...(normalized.review || {}), approvalDecision: 'pending' },
    publication: { ...(normalized.publication || {}), publishStatus: 'not_published' }
  });
}

export async function createAuthorReleaseCandidate({ draft, userId, planningValidation, contentValidation, reviewValidation, now = () => new Date(), cryptoProvider } = {}) {
  if (!draft?.draft?.draftId) return { success: false, error: 'A private draft is required.' };
  if (draft.draft.createdBy !== userId) return { success: false, error: 'Only the draft owner can prepare its release candidate.' };
  if (draft.review?.reviewStatus !== 'ready_for_approval') return { success: false, error: 'Move the reviewed draft to Ready for Approval first.' };
  if (!planningValidation?.valid || !contentValidation?.valid || !reviewValidation?.valid) return { success: false, error: 'Every planning, content and review validation must pass.' };
  if (draft.review?.approvalDecision !== 'pending') return { success: false, error: 'The draft approval decision must remain pending.' };
  if (draft.programme?.publicationVisibility !== 'unpublished' || draft.publication?.publishStatus !== 'not_published') return { success: false, error: 'A release candidate must remain unpublished.' };

  try {
    const snapshot = buildAuthorReleaseSnapshot(draft);
    const contentHash = await sha256(canonicalJson(snapshot), cryptoProvider);
    const candidate = {
      candidateId: `release-${draft.draft.draftId}-r${draft.draft.revision}-${contentHash.slice(0, 12)}`,
      candidateVersion: '1.0.0',
      status: 'awaiting_trusted_approval',
      storageAuthority: AUTHOR_APPROVAL_STORAGE_AUTHORITY.LOCAL_BROWSER,
      immutable: true,
      sourceDraftId: draft.draft.draftId,
      sourceRevision: draft.draft.revision,
      createdBy: userId,
      createdAt: timestamp(now),
      contentHashAlgorithm: 'SHA-256',
      contentHash,
      approval: { decision: 'pending', approvedBy: null, approvedAt: null },
      publication: { status: 'not_published' },
      snapshot
    };
    return { success: true, candidate };
  } catch (error) {
    return { success: false, error: error?.message || 'Unable to prepare the release candidate.' };
  }
}

export async function verifyAuthorReleaseCandidate(candidate, cryptoProvider) {
  if (!candidate?.snapshot || !candidate?.contentHash) return { valid: false, error: 'The release candidate is incomplete.' };
  try {
    const actualHash = await sha256(canonicalJson(candidate.snapshot), cryptoProvider);
    return { valid: actualHash === candidate.contentHash, expectedHash: candidate.contentHash, actualHash, error: actualHash === candidate.contentHash ? '' : 'The release candidate content has changed.' };
  } catch (error) {
    return { valid: false, error: error?.message || 'Unable to verify the release candidate.' };
  }
}

export async function compareAuthorReleaseCandidate(candidate, draft, cryptoProvider) {
  if (!candidate?.snapshot || !draft) return { matches: false, error: 'The release candidate and current draft are required.' };
  try {
    const currentHash = await sha256(canonicalJson(buildAuthorReleaseSnapshot(draft)), cryptoProvider);
    return { matches: currentHash === candidate.contentHash && draft.draft?.revision === candidate.sourceRevision, candidateHash: candidate.contentHash, currentHash, candidateRevision: candidate.sourceRevision, currentRevision: draft.draft?.revision };
  } catch (error) {
    return { matches: false, error: error?.message || 'Unable to compare the current draft.' };
  }
}

export async function approveAuthorReleaseCandidate({ candidate, currentDraft, approver, storageAuthority, planningValidation, contentValidation, reviewValidation, now = () => new Date(), cryptoProvider } = {}) {
  const access = canApproveAuthorRelease({ user: approver, createdBy: candidate?.createdBy, storageAuthority });
  if (!access.allowed) return { success: false, error: access.reason };
  if (candidate?.status !== 'awaiting_trusted_approval' || candidate?.approval?.decision !== 'pending') return { success: false, error: 'The release candidate is not awaiting approval.' };
  const integrity = await verifyAuthorReleaseCandidate(candidate, cryptoProvider);
  if (!integrity.valid) return { success: false, error: integrity.error };
  const comparison = await compareAuthorReleaseCandidate(candidate, currentDraft, cryptoProvider);
  if (!comparison.matches) return { success: false, error: 'The draft changed after this release candidate was prepared.' };
  if (!planningValidation?.valid || !contentValidation?.valid || !reviewValidation?.valid) return { success: false, error: 'Every validation must pass again at approval time.' };
  if (currentDraft.review?.reviewStatus !== 'ready_for_approval') return { success: false, error: 'The current draft is no longer Ready for Approval.' };

  return {
    success: true,
    candidate: {
      ...clone(candidate),
      status: 'approved_release_candidate',
      storageAuthority: AUTHOR_APPROVAL_STORAGE_AUTHORITY.TRUSTED_SERVER,
      approval: { decision: 'approved', approvedBy: approver.id, approvedAt: timestamp(now), approvedRevision: candidate.sourceRevision, contentHash: candidate.contentHash },
      publication: { status: 'not_published' }
    }
  };
}

export function serializeAuthorReleaseCandidate(candidate) {
  return JSON.stringify(candidate, null, 2);
}
