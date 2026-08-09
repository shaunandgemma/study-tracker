import { supabase } from '../../lib/supabase.js';
import { isControlledPublishingEnabled } from '../followAlongs/published/publishedFollowAlongService.js';
import { normalizeAuthorDraft } from './authorDraftService.js';

const runtimeEnv = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' ? process.env || {} : {});

export const AUTHOR_SHARED_STORAGE_FLAG = 'VITE_FOLLOW_ALONG_AUTHOR_SHARED_STORAGE';
export const AUTHOR_TRUSTED_APPROVAL_FLAG = 'VITE_FOLLOW_ALONG_TRUSTED_APPROVAL';
export const CONTROLLED_PUBLISHING_PILOT_CANDIDATE_ID = 'release-author-draft-e6dee7a5-5868-423f-bcfe-7c74d92b3ad6-r13-36f6c49225f0';
export const CONTROLLED_PUBLISHING_CONFIRMATION = 'PUBLISH LAMBDA';
export const AUTHOR_SHARED_STORAGE_TABLES = Object.freeze({
  drafts: 'follow_along_author_drafts',
  revisions: 'follow_along_author_revisions',
  candidates: 'follow_along_release_candidates'
});

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
        const { data, error } = await client.from(AUTHOR_SHARED_STORAGE_TABLES.drafts).select('draft_id, revision, status, content_hash, updated_at, content').order('updated_at', { ascending: false });
        if (error) return failure(error);
        return { success: true, storageMode: 'shared_supabase', drafts: (data || []).map(row => normalizeAuthorDraft(row.content)), rows: data || [] };
      } catch (error) {
        return failure(error);
      }
    },

    async loadDraft(draftId) {
      if (!requireEnabled()) return disabled();
      try {
        const { data, error } = await client.from(AUTHOR_SHARED_STORAGE_TABLES.drafts).select('draft_id, revision, status, content_hash, updated_at, content').eq('draft_id', draftId).maybeSingle();
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
        const draftResult = await client.from(AUTHOR_SHARED_STORAGE_TABLES.drafts).select('content_hash, revision, status, owner_id').eq('draft_id', candidate.sourceDraftId).single();
        if (draftResult.error) return failure(draftResult.error, 'Unable to verify the shared draft.');
        if (draftResult.data.revision !== candidate.sourceRevision || draftResult.data.status !== 'ready_for_approval') return { success: false, conflict: true, error: 'The shared draft revision is not Ready for Approval.' };
        const row = {
          candidate_id: candidate.candidateId,
          draft_id: candidate.sourceDraftId,
          source_revision: candidate.sourceRevision,
          created_by: candidate.createdBy,
          snapshot: candidate.snapshot,
          draft_content_hash: draftResult.data.content_hash
        };
        const { data, error } = await client.from(AUTHOR_SHARED_STORAGE_TABLES.candidates).insert(row).select('*').single();
        if (error) return failure(error, 'Unable to store the shared release candidate.');
        return { success: true, storageMode: 'shared_supabase', candidate: data };
      } catch (error) {
        return failure(error, 'Unable to store the shared release candidate.');
      }
    },

    async listReleaseCandidates() {
      if (!requireEnabled()) return disabled();
      try {
        const { data, error } = await client.from(AUTHOR_SHARED_STORAGE_TABLES.candidates).select('*').order('created_at', { ascending: true });
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

    async publishReleaseCandidate(candidateId, confirmation) {
      if (!requireEnabled() || !publishingEnabled) return { ...disabled(), error: 'Controlled publishing is disabled.' };
      if (candidateId !== CONTROLLED_PUBLISHING_PILOT_CANDIDATE_ID) return { success: false, error: 'Only the approved Lambda pilot candidate can be published in Step 54.' };
      if (confirmation !== CONTROLLED_PUBLISHING_CONFIRMATION) return { success: false, error: `Enter ${CONTROLLED_PUBLISHING_CONFIRMATION} exactly before publishing.` };
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
