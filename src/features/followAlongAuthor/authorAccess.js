const AUTHOR_ROLES = new Set(['author', 'admin']);
const APPROVER_ROLES = new Set(['approver', 'admin']);
const PRIVILEGED_FOLLOW_ALONG_ROLES = new Set(['author', 'approver', 'admin']);

export function getAuthorRoles(user) {
  const appMetadata = user?.app_metadata;
  if (!appMetadata || typeof appMetadata !== 'object') return [];

  const roles = [];
  if (typeof appMetadata.role === 'string') roles.push(appMetadata.role);
  if (Array.isArray(appMetadata.roles)) roles.push(...appMetadata.roles);

  return [...new Set(roles.map(role => String(role).trim().toLowerCase()).filter(Boolean))];
}

export function canAccessFollowAlongAuthor(user) {
  return Boolean(user?.id) && getAuthorRoles(user).some(role => AUTHOR_ROLES.has(role));
}

export function canAccessFollowAlongApprovals(user) {
  return Boolean(user?.id) && getAuthorRoles(user).some(role => APPROVER_ROLES.has(role));
}

export function isPrivilegedFollowAlongAccount(user) {
  return Boolean(user?.id) && getAuthorRoles(user).some(role => PRIVILEGED_FOLLOW_ALONG_ROLES.has(role));
}

export function isAuthorApprovalEntryRequested(location = globalThis.location) {
  return String(location?.hash || '').toLowerCase() === '#author/approvals';
}

export function isAuthorEntryRequested(location = globalThis.location) {
  const hash = String(location?.hash || '').toLowerCase();
  return hash === '#author' || hash.startsWith('#author/');
}
