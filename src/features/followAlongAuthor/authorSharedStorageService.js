import { supabase } from '../../lib/supabase.js';
import { isControlledPublishingEnabled } from '../followAlongs/published/publishedFollowAlongService.js';
import { buildAuthorReleaseSnapshot } from './authorApproval.js';
import { normalizeAuthorDraft } from './authorDraftService.js';

const runtimeEnv = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' ? process.env || {} : {});

export const AUTHOR_SHARED_STORAGE_FLAG = 'VITE_FOLLOW_ALONG_AUTHOR_SHARED_STORAGE';
export const AUTHOR_TRUSTED_APPROVAL_FLAG = 'VITE_FOLLOW_ALONG_TRUSTED_APPROVAL';
export const CONTROLLED_PUBLISHING_PILOT_CANDIDATE_ID = 'release-author-draft-e6dee7a5-5868-423f-bcfe-7c74d92b3ad6-r13-36f6c49225f0';
export const CONTROLLED_PUBLISHING_CONFIRMATION = 'PUBLISH LAMBDA';

export function getControlledPublishingConfirmation(candidate) {
  const serviceSlug = String(candidate?.snapshot?.programme?.serviceSlug || '').trim();
  const token = serviceSlug.replace(/[^a-z0-9]+/gi, ' ').trim().toUpperCase();
  return token ? `PUBLISH ${token}` : '';
}
export const AUTHOR_SHARED_STORAGE_TABLES = Object.freeze({
  drafts: 'follow_along_author_drafts',
  revisions: 'follow_along_author_revisions',
  candidates: 'follow_along_release_candidates'
});

export function publishedDraftIdFromCandidateId(candidateId) {
  const match = String(candidateId || '').match(/^release-(.+)-r\d+-[a-f0-9]{12}$/i);
  return match?.[1] || '';
}

export function isAuthorSharedStorageEnabled(environment = runtimeEnv) {
  return String(environment?.[AUTHOR_SHARED_STORAGE_FLAG] || '').toLowerCase() === 'true';
}

export function isAuthorTrustedApprovalEnabled(environment = runtimeEnv) {
  return String(environment?.[AUTHOR_TRUSTED_APPROVAL_FLAG] || '').toLowerCase() === 'true';
}

export function getAuthorStorageMode({ enabled = isAuthorSharedStorageEnabled(), remoteAvailable = true } = {}) {
  return enabled && remoteAvailable ? 'shared_supabase' : 'private_local_browser';
}

function disabled() {
  return { success: false, disabled: true, storageMode: 'private_local_browser', error: 'Shared Author storage is disabled. The existing private browser drafts remain active.' };
}

function failure(error, fallback = 'Shared Author storage is unavailable.') {
  return { success: false, storageMode: 'private_local_browser', error: error?.message || fallback, errorCode: error?.code || null };
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

function safeDraft(draft, revision = draft?.draft?.revision) {
  const normalized = normalizeAuthorDraft(draft);
  return {
    ...normalized,
    draft: { ...normalized.draft, revision },
    programme: { ...normalized.programme, publicationVisibility: 'unpublished' },
    review: { ...normalized.review, approvalDecision: 'pending' },
    publication: { ...normalized.publication, publishStatus: 'not_published' }
  };
}

function databaseStatus(draft) {
  if (draft?.review?.reviewStatus === 'ready_for_approval') return 'ready_for_approval';
  return ['draft', 'researching', 'changes_requested'].includes(draft?.draft?.status) ? draft.draft.status : 'draft';
}

function draftRow(draft, revision = draft?.draft?.revision) {
  const content = safeDraft(draft, revision);
  return {
    draft_id: content.draft.draftId,
    owner_id: content.draft.createdBy,
    programme_id: content.programme.programmeId,
    revision,
    status: databaseStatus(content),
    content
  };
}

export function createAuthorSharedStorageService(client = supabase, { enabled = isAuthorSharedStorageEnabled(), publishingEnabled = isControlledPublishingEnabled() } = {}) {
  const requireEnabled = () => enabled && client;

  return {
    enabled: Boolean(enabled),
    publishingEnabled: Boolean(publishingEnabled),
    storageMode: getAuthorStorageMode({ enabled, remoteAvailable: Boolean(client) }),

    async listDrafts() {
      if (!requireEnabled()) return disabled();
      try {
        const { data, error } = await client.from(AUTHOR_SHARED_STORAGE_TABLES.drafts).select('draft_id, owner_id, revision, status, content_hash, updated_at, content').order('updated_at', { ascending: false });
        if (error) return failure(error);
        return { success: true, storageMode: 'shared_supabase', drafts: (data || []).map(row => normalizeAuthorDraft(row.content)), rows: data || [] };
      } catch (error) {
        return failure(error);
      }
    },

    async listPublishedDrafts() {
      if (!requireEnabled()) return disabled();
      try {
        const { data, error } = await client.from('follow_along_published_programmes').select('programme_id,candidate_id,source_revision,published_at').order('published_at', { ascending: true });
        if (error) return failure(error, 'Unable to load live Follow Along status.');
        const publications = (data || []).map(row => ({ ...row, draftId: publishedDraftIdFromCandidateId(row.candidate_id) })).filter(row => row.draftId);
        return { success: true, storageMode: 'shared_supabase', publications, publishedDraftIds: publications.map(row => row.draftId) };
      } catch (error) {
        return failure(error, 'Unable to load live Follow Along status.');
      }
    },

    async loadDraft(draftId) {
      if (!requireEnabled()) return disabled();
      try {
        const { data, error } = await client.from(AUTHOR_SHARED_STORAGE_TABLES.drafts).select('draft_id, owner_id, revision, status, content_hash, updated_at, content').eq('draft_id', draftId).maybeSingle();
        if (error) return failure(error);
        if (!data) return { success: false, notFound: true, storageMode: 'shared_supabase', error: 'The shared draft could not be found.' };
        return { success: true, storageMode: 'shared_supabase', draft: normalizeAuthorDraft(data.content), row: data };
      } catch (error) {
        return failure(error);
      }
    },

    async storeNewDraft(draft) {
      if (!requireEnabled()) return disabled();
      if (!draft?.draft?.draftId || !draft?.draft?.createdBy) return { success: false, error: 'A complete owned draft is required.' };
      try {
        const row = draftRow(draft, 1);
        const { data, error } = await client.from(AUTHOR_SHARED_STORAGE_TABLES.drafts).insert(row).select('draft_id, revision, status, content_hash, updated_at, content').single();
        if (error) return failure(error, 'Unable to create the shared draft.');
        return { success: true, storageMode: 'shared_supabase', draft: normalizeAuthorDraft(data.content), row: data };
      } catch (error) {
        return failure(error, 'Unable to create the shared draft.');
      }
    },

    async saveDraft({ draft, expectedRevision }) {
      if (!requireEnabled()) return disabled();
      if (!draft?.draft?.draftId || !Number.isInteger(Number(expectedRevision))) return { success: false, error: 'A draft and expected revision are required.' };
      const nextRevision = Number(expectedRevision) + 1;
      try {
        const row = draftRow(draft, nextRevision);
        const { data, error } = await client.from(AUTHOR_SHARED_STORAGE_TABLES.drafts).update({ programme_id: row.programme_id, revision: row.revision, status: row.status, content: row.content }).eq('draft_id', row.draft_id).eq('revision', Number(expectedRevision)).select('draft_id, revision, status, content_hash, updated_at, content').maybeSingle();
        if (error) return failure(error, 'Unable to save the shared draft.');
        if (!data) return { success: false, conflict: true, storageMode: 'shared_supabase', error: 'The shared draft has a newer revision.' };
        return { success: true, storageMode: 'shared_supabase', draft: normalizeAuthorDraft(data.content), row: data };
      } catch (error) {
        return failure(error, 'Unable to save the shared draft.');
      }
    },

    async deleteDraft({ draftId, expectedRevision, confirmation }) {
      if (!requireEnabled()) return disabled();
      if (!draftId || confirmation !== `DELETE ${draftId}`) return { success: false, confirmationRequired: true, error: 'Confirm the exact Shared Draft before deleting it.' };
      try {
        const { data, error } = await client.rpc('delete_unpublished_follow_along_author_draft', {
          p_draft_id: draftId,
          p_expected_revision: Number(expectedRevision),
          p_confirmation: confirmation
        });
        if (error) return failure(error, 'Unable to delete the Shared Draft.');
        return { success: true, storageMode: 'shared_supabase', deletion: data, deletedDraftId: draftId, deletedRevision: Number(expectedRevision) };
      } catch (error) {
        return failure(error, 'Unable to delete the Shared Draft.');
      }
    },

    async listRevisions(draftId) {
      if (!requireEnabled()) return disabled();
      try {
        const { data, error } = await client.from(AUTHOR_SHARED_STORAGE_TABLES.revisions).select('revision_id, draft_id, revision, status, content_hash, recorded_by, recorded_at').eq('draft_id', draftId).order('revision', { ascending: false });
        if (error) return failure(error, 'Unable to load shared draft history.');
        return { success: true, storageMode: 'shared_supabase', revisions: data || [] };
      } catch (error) {
        return failure(error, 'Unable to load shared draft history.');
      }
    },

    async storeReleaseCandidate(candidate) {
      if (!requireEnabled()) return disabled();
      if (!candidate?.candidateId || !candidate?.snapshot || !candidate?.sourceDraftId) return { success: false, error: 'A complete release candidate is required.' };
      try {
        const draftResult = await client.from(AUTHOR_SHARED_STORAGE_TABLES.drafts).select('content_hash, revision, status, owner_id, content').eq('draft_id', candidate.sourceDraftId).single();
        if (draftResult.error) return failure(draftResult.error, 'Unable to verify the shared draft.');
        if (draftResult.data.revision !== candidate.sourceRevision || draftResult.data.status !== 'ready_for_approval') return { success: false, conflict: true, error: 'The shared draft revision is not Ready for Approval.' };
        if (canonicalJson(buildAuthorReleaseSnapshot(draftResult.data.content)) !== canonicalJson(candidate.snapshot)) return { success: false, conflict: true, error: 'Save this updated draft before preparing its release candidate.' };
        const row = {
          candidate_id: candidate.candidateId,
          draft_id: candidate.sourceDraftId,
          source_revision: candidate.sourceRevision,
          created_by: candidate.createdBy,
          snapshot: candidate.snapshot,
          draft_content_hash: draftResult.data.content_hash
        };
        const { data, error } = await client.from(AUTHOR_SHARED_STORAGE_TABLES.candidates).insert(row).select('*').single();
        if (error?.code === '23505') {
          const existingResult = await client.from(AUTHOR_SHARED_STORAGE_TABLES.candidates).select('*').eq('candidate_id', candidate.candidateId).maybeSingle();
          if (existingResult.error) return failure(existingResult.error, 'Unable to verify the existing shared release candidate.');
          const existing = existingResult.data;
          const isExactCandidate = existing
            && existing.candidate_id === candidate.candidateId
            && existing.draft_id === candidate.sourceDraftId
            && existing.source_revision === candidate.sourceRevision
            && existing.created_by === candidate.createdBy
            && canonicalJson(existing.snapshot) === canonicalJson(candidate.snapshot)
            && existing.draft_content_hash === draftResult.data.content_hash;
          if (!isExactCandidate) return { success: false, conflict: true, storageMode: 'shared_supabase', error: 'This draft revision already has a different immutable release candidate.' };
          return { success: true, reused: true, storageMode: 'shared_supabase', candidate: existing };
        }
        if (error) return failure(error, 'Unable to store the shared release candidate.');
        return { success: true, storageMode: 'shared_supabase', candidate: data };
      } catch (error) {
        return failure(error, 'Unable to store the shared release candidate.');
      }
    },

    async listReleaseCandidates() {
      if (!requireEnabled()) return disabled();
      try {
        const { data, error } = await client.from(AUTHOR_SHARED_STORAGE_TABLES.candidates).select('*').order('created_at', { ascending: false });
        if (error) return failure(error, 'Unable to load the approval queue.');
        return { success: true, storageMode: 'shared_supabase', candidates: data || [] };
      } catch (error) {
        return failure(error, 'Unable to load the approval queue.');
      }
    },

    async approveReleaseCandidate(candidateId) {
      if (!requireEnabled()) return disabled();
      try {
        const { data, error } = await client.rpc('approve_follow_along_release_candidate', { p_candidate_id: candidateId });
        if (error) return failure(error, 'Trusted approval failed.');
        return { success: true, storageMode: 'shared_supabase', candidate: data };
      } catch (error) {
        return failure(error, 'Trusted approval failed.');
      }
    },

    async rejectReleaseCandidate(candidateId, reason) {
      if (!requireEnabled()) return disabled();
      const cleanReason = String(reason || '').trim();
      if (cleanReason.length < 5 || cleanReason.length > 500) return { success: false, error: 'Enter a rejection reason between 5 and 500 characters.' };
      try {
        const { data, error } = await client.rpc('reject_follow_along_release_candidate', { p_candidate_id: candidateId, p_reason: cleanReason });
        if (error) return failure(error, 'Release-candidate rejection failed.');
        return { success: true, storageMode: 'shared_supabase', candidate: data };
      } catch (error) {
        return failure(error, 'Release-candidate rejection failed.');
      }
    },

    async publishReleaseCandidate(candidateId, confirmation) {
      if (!requireEnabled() || !publishingEnabled) return { ...disabled(), error: 'Controlled publishing is disabled.' };
      if (!String(candidateId || '').trim()) return { success: false, error: 'A release candidate is required.' };
      if (!/^PUBLISH [A-Z0-9]+(?: [A-Z0-9]+)*$/.test(String(confirmation || ''))) return { success: false, error: 'Enter the displayed PUBLISH [SERVICE] phrase exactly before publishing.' };
      try {
        const { data, error } = await client.rpc('publish_follow_along_release_candidate', { p_candidate_id: candidateId, p_confirmation: confirmation });
        if (error) return failure(error, 'Controlled publication failed.');
        return { success: true, storageMode: 'shared_supabase', publication: data };
      } catch (error) {
        return failure(error, 'Controlled publication failed.');
      }
    }
  };
}
