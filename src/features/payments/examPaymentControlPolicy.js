import { getExamAccessDetails } from '../access/applicationAccessPolicy.js';

export function getExamPaymentControlPolicy(accessPolicy, examId, runtimeEnabled = false) {
  const access = getExamAccessDetails(accessPolicy, examId);

  if (access.kind === 'staff') {
    return Object.freeze({ access, action: null, actionEnabled: false, kind: 'staff' });
  }
  if (access.kind === 'paid') {
    return Object.freeze({
      access,
      action: 'portal',
      actionEnabled: runtimeEnabled === true,
      kind: 'paid'
    });
  }
  if (access.kind === 'demo') {
    return Object.freeze({ access, action: null, actionEnabled: false, kind: 'demo' });
  }

  return Object.freeze({
    access,
    action: 'checkout',
    actionEnabled: runtimeEnabled === true,
    kind: 'preview'
  });
}
