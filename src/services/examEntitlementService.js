import { supabase } from '../lib/supabase.js';
import { APPLICATION_EXAM_IDS } from '../features/access/applicationAccessPolicy.js';

export const EXAM_ENTITLEMENTS_TABLE = 'exam_entitlements';
export const EXAM_ENTITLEMENT_COLUMNS = 'user_id,exam_id,status,starts_at,expires_at,created_at,updated_at';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ENTITLEMENT_STATUSES = new Set(['active', 'revoked']);

function failure(error, extra = {}) {
  return {
    success: false,
    verified: false,
    rows: [],
    error: error?.message || String(error || 'Unable to verify exam access.'),
    ...extra
  };
}

function validTimestamp(value) {
  return typeof value === 'string' && Number.isFinite(new Date(value).getTime());
}

export function validateExamEntitlementRow(row, expectedUserId) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) {
    return { valid: false, error: 'An entitlement row was not an object.' };
  }
  if (row.user_id !== expectedUserId) {
    return { valid: false, error: 'An entitlement row did not belong to the signed-in learner.' };
  }
  if (!APPLICATION_EXAM_IDS.includes(row.exam_id)) {
    return { valid: false, error: 'An entitlement row used an unsupported exam ID.' };
  }
  if (!ENTITLEMENT_STATUSES.has(row.status)) {
    return { valid: false, error: 'An entitlement row used an unsupported status.' };
  }
  if (!validTimestamp(row.starts_at) || !validTimestamp(row.expires_at)) {
    return { valid: false, error: 'An entitlement row used an invalid access period.' };
  }
  if (new Date(row.expires_at).getTime() <= new Date(row.starts_at).getTime()) {
    return { valid: false, error: 'An entitlement row used an invalid access window.' };
  }

  return {
    valid: true,
    row: Object.freeze({
      user_id: row.user_id,
      exam_id: row.exam_id,
      status: row.status,
      starts_at: row.starts_at,
      expires_at: row.expires_at,
      created_at: row.created_at ?? null,
      updated_at: row.updated_at ?? null
    })
  };
}

export function createExamEntitlementService(options = {}) {
  const client = options.supabaseClient || supabase;

  const loadOwnEntitlements = async ({ userId } = {}) => {
    const expectedUserId = String(userId || '').trim();
    if (!UUID_PATTERN.test(expectedUserId)) {
      return failure('Authenticated learner ID is required.', { validationError: true });
    }

    try {
      const { data, error } = await client
        .from(EXAM_ENTITLEMENTS_TABLE)
        .select(EXAM_ENTITLEMENT_COLUMNS)
        .eq('user_id', expectedUserId)
        .order('exam_id', { ascending: true });

      if (error) return failure(error, { loadFailed: true });
      if (!Array.isArray(data)) return failure('The entitlement response was not a list.', { verificationFailed: true });

      const verifiedRows = [];
      for (const row of data) {
        const validation = validateExamEntitlementRow(row, expectedUserId);
        if (!validation.valid) {
          return failure(validation.error, { verificationFailed: true });
        }
        verifiedRows.push(validation.row);
      }

      return {
        success: true,
        verified: true,
        rows: Object.freeze(verifiedRows)
      };
    } catch (error) {
      return failure(error, { loadFailed: true });
    }
  };

  return Object.freeze({ loadOwnEntitlements });
}

export const examEntitlementService = createExamEntitlementService();
