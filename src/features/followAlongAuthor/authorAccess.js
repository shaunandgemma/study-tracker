import {
  buildApplicationAccessPolicy,
  getApplicationRoles
} from '../access/applicationAccessPolicy.js';

export function getAuthorRoles(user) {
  return getApplicationRoles(user);
}

export function canAccessFollowAlongAuthor(user) {
  return buildApplicationAccessPolicy(user).canAccessAuthor;
}

export function canAccessFollowAlongApprovals(user) {
  return buildApplicationAccessPolicy(user).canAccessApprovals;
}

export function isPrivilegedFollowAlongAccount(user) {
  const policy = buildApplicationAccessPolicy(user);
  return policy.canAccessAuthor || policy.canAccessApprovals;
}

export function isAuthorApprovalEntryRequested(location = globalThis.location) {
  return String(location?.hash || '').toLowerCase() === '#author/approvals';
}

export function isAuthorEntryRequested(location = globalThis.location) {
  const hash = String(location?.hash || '').toLowerCase();
  return hash === '#author' || hash.startsWith('#author/');
}

export function isUnsupportedAuthorEntryRequested(location = globalThis.location) {
  const hash = String(location?.hash || '').toLowerCase();
  return isAuthorEntryRequested({ hash })
    && hash !== '#author'
    && hash !== '#author/approvals';
}
