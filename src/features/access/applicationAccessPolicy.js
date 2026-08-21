export const APPLICATION_ACCOUNT_TYPES = Object.freeze({
  SIGNED_OUT: 'signed_out',
  DEMO: 'demo',
  REGISTERED_FREE: 'registered_free',
  PAID_LEARNER: 'paid_learner',
  AUTHOR: 'author',
  APPROVER: 'approver',
  ADMIN: 'admin'
});

export const APPLICATION_CONTENT_SCOPES = Object.freeze({
  NONE: 'none',
  PREVIEW: 'preview',
  ENTITLED_EXAMS: 'entitled_exams',
  ALL_EXAMS: 'all_exams'
});

export const APPLICATION_EXAM_IDS = Object.freeze([
  'aws-saa-c03',
  'terraform-associate-004',
  'comptia-sec-plus'
]);

const DEMO_USER_ID = 'demo-read-only';
const PRIVILEGED_ROLES = new Set(['author', 'approver', 'admin']);

const cleanText = value => typeof value === 'string' ? value.trim() : '';

export function isDemoIdentity(user) {
  return user?.is_demo === true || user?.id === DEMO_USER_ID;
}

export function getApplicationRoles(user) {
  const metadata = user?.app_metadata;
  if (!metadata || typeof metadata !== 'object') return [];

  const roles = [];
  if (typeof metadata.role === 'string') roles.push(metadata.role);
  if (Array.isArray(metadata.roles)) roles.push(...metadata.roles);

  return [...new Set(roles
    .map(role => cleanText(role).toLowerCase())
    .filter(Boolean))];
}

export function isAdminUser(user) {
  return Boolean(user?.id) && !isDemoIdentity(user) && getApplicationRoles(user).includes('admin');
}

function toTimestamp(value) {
  if (value === null || value === undefined || value === '') return null;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : Number.NaN;
}

export function getActiveExamEntitlementIds(verifiedEntitlements = [], now = Date.now()) {
  return getActiveExamEntitlementSummaries(verifiedEntitlements, now)
    .map(entitlement => entitlement.examId);
}

export function getActiveExamEntitlementSummaries(verifiedEntitlements = [], now = Date.now()) {
  const nowTimestamp = now instanceof Date ? now.getTime() : Number(now);
  if (!Number.isFinite(nowTimestamp) || !Array.isArray(verifiedEntitlements)) return [];

  const activeEntitlements = verifiedEntitlements.flatMap(entitlement => {
    if (!entitlement || typeof entitlement !== 'object') return [];

    const examId = cleanText(entitlement.examId || entitlement.exam_id);
    const status = cleanText(entitlement.status).toLowerCase();
    const startsAt = toTimestamp(entitlement.startsAt ?? entitlement.starts_at);
    const expiresAt = toTimestamp(entitlement.expiresAt ?? entitlement.expires_at);

    if (!APPLICATION_EXAM_IDS.includes(examId) || status !== 'active') return [];
    if (!Number.isFinite(startsAt) || !Number.isFinite(expiresAt) || expiresAt <= startsAt) return [];
    if (startsAt > nowTimestamp) return [];
    if (expiresAt <= nowTimestamp) return [];

    return [{
      examId,
      startsAt: new Date(startsAt).toISOString(),
      expiresAt: new Date(expiresAt).toISOString()
    }];
  });

  const byExamId = new Map();
  for (const entitlement of activeEntitlements) {
    const previous = byExamId.get(entitlement.examId);
    if (!previous || new Date(entitlement.expiresAt).getTime() > new Date(previous.expiresAt).getTime()) {
      byExamId.set(entitlement.examId, entitlement);
    }
  }

  return [...byExamId.values()]
    .sort((left, right) => left.examId.localeCompare(right.examId))
    .map(entitlement => Object.freeze(entitlement));
}

export function getNextExamEntitlementBoundary(verifiedEntitlements = [], now = Date.now()) {
  const nowTimestamp = now instanceof Date ? now.getTime() : Number(now);
  if (!Number.isFinite(nowTimestamp) || !Array.isArray(verifiedEntitlements)) return null;

  const boundaries = verifiedEntitlements.flatMap(entitlement => {
    if (!entitlement || typeof entitlement !== 'object') return [];

    const examId = cleanText(entitlement.examId || entitlement.exam_id);
    const status = cleanText(entitlement.status).toLowerCase();
    const startsAt = toTimestamp(entitlement.startsAt ?? entitlement.starts_at);
    const expiresAt = toTimestamp(entitlement.expiresAt ?? entitlement.expires_at);

    if (!APPLICATION_EXAM_IDS.includes(examId) || status !== 'active') return [];
    if (!Number.isFinite(startsAt) || !Number.isFinite(expiresAt) || expiresAt <= startsAt) return [];
    if (startsAt > nowTimestamp) return [startsAt];
    if (expiresAt > nowTimestamp) return [expiresAt];
    return [];
  });

  return boundaries.length ? Math.min(...boundaries) : null;
}

export function buildApplicationAccessPolicy(user, options = {}) {
  const roles = getApplicationRoles(user);
  const roleSet = new Set(roles);
  const authenticated = Boolean(user?.id) && !isDemoIdentity(user);
  const verifiedEntitlements = Array.isArray(options.verifiedEntitlements)
    ? options.verifiedEntitlements
    : [];
  const ownedVerifiedEntitlements = authenticated
    ? verifiedEntitlements.filter(entitlement => (
      entitlement?.user_id === user.id || entitlement?.userId === user.id
    ))
    : [];
  const activeExamEntitlements = getActiveExamEntitlementSummaries(
    ownedVerifiedEntitlements,
    options.now ?? Date.now()
  );
  const activeExamIds = activeExamEntitlements.map(entitlement => entitlement.examId);
  const isAdmin = authenticated && roleSet.has('admin');
  const hasAuthorRole = authenticated && roleSet.has('author');
  const hasApproverRole = authenticated && roleSet.has('approver');
  const roleConflict = !isAdmin && hasAuthorRole && hasApproverRole;

  let accountType = APPLICATION_ACCOUNT_TYPES.SIGNED_OUT;
  if (isDemoIdentity(user)) accountType = APPLICATION_ACCOUNT_TYPES.DEMO;
  else if (isAdmin) accountType = APPLICATION_ACCOUNT_TYPES.ADMIN;
  else if (roleConflict) accountType = APPLICATION_ACCOUNT_TYPES.REGISTERED_FREE;
  else if (hasAuthorRole) accountType = APPLICATION_ACCOUNT_TYPES.AUTHOR;
  else if (hasApproverRole) accountType = APPLICATION_ACCOUNT_TYPES.APPROVER;
  else if (authenticated && activeExamIds.length) accountType = APPLICATION_ACCOUNT_TYPES.PAID_LEARNER;
  else if (authenticated) accountType = APPLICATION_ACCOUNT_TYPES.REGISTERED_FREE;

  const privilegedLearningAccess = authenticated
    && !roleConflict
    && roles.some(role => PRIVILEGED_ROLES.has(role));
  const contentScope = accountType === APPLICATION_ACCOUNT_TYPES.SIGNED_OUT
    ? APPLICATION_CONTENT_SCOPES.NONE
    : privilegedLearningAccess
      ? APPLICATION_CONTENT_SCOPES.ALL_EXAMS
      : activeExamIds.length
        ? APPLICATION_CONTENT_SCOPES.ENTITLED_EXAMS
        : APPLICATION_CONTENT_SCOPES.PREVIEW;

  return Object.freeze({
    accountType,
    roles: Object.freeze([...roles]),
    activeExamIds: Object.freeze([...activeExamIds]),
    activeExamEntitlements: Object.freeze([...activeExamEntitlements]),
    contentScope,
    roleConflict,
    isAuthenticated: authenticated,
    usesTemporaryProgress: accountType === APPLICATION_ACCOUNT_TYPES.DEMO,
    canUseAccountProgress: authenticated,
    canAccessAuthor: !roleConflict && (isAdmin || hasAuthorRole),
    canAccessApprovals: !roleConflict && (isAdmin || hasApproverRole),
    canManageContent: isAdmin,
    hasAllExamAccess: contentScope === APPLICATION_CONTENT_SCOPES.ALL_EXAMS
  });
}

export function canAccessCompleteExam(accessPolicy, examId) {
  const cleanExamId = cleanText(examId);
  if (!cleanExamId || !accessPolicy) return false;
  if (accessPolicy.hasAllExamAccess === true) return true;
  return Array.isArray(accessPolicy.activeExamIds) && accessPolicy.activeExamIds.includes(cleanExamId);
}

export function isExamPreviewOnly(accessPolicy, examId) {
  if (!accessPolicy || accessPolicy.contentScope === APPLICATION_CONTENT_SCOPES.NONE) return true;
  return !canAccessCompleteExam(accessPolicy, examId);
}

export function getExamAccessDetails(accessPolicy, examId) {
  const cleanExamId = cleanText(examId);
  if (!cleanExamId || !accessPolicy) {
    return Object.freeze({ examId: cleanExamId, kind: 'signed_out', complete: false, expiresAt: null });
  }
  if (accessPolicy.hasAllExamAccess === true) {
    return Object.freeze({ examId: cleanExamId, kind: 'staff', complete: true, expiresAt: null });
  }

  const entitlement = Array.isArray(accessPolicy.activeExamEntitlements)
    ? accessPolicy.activeExamEntitlements.find(item => item?.examId === cleanExamId)
    : null;
  if (entitlement) {
    return Object.freeze({
      examId: cleanExamId,
      kind: 'paid',
      complete: true,
      expiresAt: entitlement.expiresAt
    });
  }

  return Object.freeze({
    examId: cleanExamId,
    kind: accessPolicy.accountType === APPLICATION_ACCOUNT_TYPES.DEMO ? 'demo' : 'preview',
    complete: false,
    expiresAt: null
  });
}
