import { normalizeAuthorDraft } from './authorDraftService.js';

export const AUTHOR_REVIEW_SECTIONS = Object.freeze(['programme', 'phases', 'tasks', 'sources', 'instructions', 'resources', 'verification', 'cleanup', 'warnings']);
export const AUTHOR_REVIEW_PRIORITIES = Object.freeze(['blocking', 'advisory']);
export const AUTHOR_REVIEW_STATUSES = Object.freeze(['in_review', 'changes_requested', 'ready_for_approval']);

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function slugify(value) {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

function uniqueId(base, existing) {
  if (!existing.has(base)) return base;
  let suffix = 2;
  while (existing.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

function numbered(findings) {
  return findings.map((finding, index) => ({ ...finding, findingNumber: index + 1 }));
}

function safeReview(draft) {
  return {
    validationStatus: 'not_run',
    validationErrors: [],
    validationWarnings: [],
    sourceReviewStatus: 'not_run',
    learnerPreviewStatus: 'not_reviewed',
    approvalDecision: 'pending',
    reviewStatus: 'in_review',
    findings: [],
    ...(draft.review || {})
  };
}

export function createAuthorPreviewModel(draft) {
  const normalized = normalizeAuthorDraft(draft);
  const tasksById = new Map((normalized.tasks || []).map(task => [task.id, task]));
  const sourcesById = new Map((normalized.sources || []).map(source => [source.id, source]));
  const resourcesByKey = new Map((normalized.resources?.schema || []).map(resource => [resource.key, resource]));
  const phases = (normalized.phases || []).map(phase => ({
    ...phase,
    tasks: (phase.taskIds || []).map(taskId => tasksById.get(taskId)).filter(Boolean).map(task => ({
      ...task,
      sources: (task.sourceIds || []).map(sourceId => sourcesById.get(sourceId)).filter(Boolean),
      createdResources: (task.createdResourceKeys || []).map(key => resourcesByKey.get(key)).filter(Boolean)
    }))
  }));
  return {
    programme: normalized.programme || {},
    warnings: normalized.warnings || {},
    phases,
    tasks: phases.flatMap(phase => phase.tasks.map(task => ({ ...task, phaseNumber: phase.phaseNumber, phaseTitle: phase.title }))),
    cleanup: { ...(normalized.cleanup || {}), manualOnly: true },
    sources: normalized.sources || []
  };
}

export function getAuthorPreviewModes(task) {
  return ['console', 'cli'].filter(mode => task?.modeAvailability?.[mode]?.status === 'available' && (task[mode === 'console' ? 'consoleSteps' : 'cliSteps'] || []).length > 0);
}

export function markAuthorPreviewReviewed(draft) {
  const review = safeReview(draft);
  return { ...draft, review: { ...review, learnerPreviewStatus: 'reviewed', reviewStatus: review.reviewStatus === 'ready_for_approval' ? 'in_review' : review.reviewStatus, approvalDecision: 'pending' }, publication: { ...draft.publication, publishStatus: 'not_published' } };
}

export function addAuthorReviewFinding(draft, input = {}) {
  const message = clean(input.message);
  if (!message) return { success: false, error: 'Describe the review finding.' };
  const review = safeReview(draft);
  const findings = review.findings || [];
  const section = AUTHOR_REVIEW_SECTIONS.includes(input.section) ? input.section : 'tasks';
  const priority = AUTHOR_REVIEW_PRIORITIES.includes(input.priority) ? input.priority : 'blocking';
  const id = uniqueId(`finding-${findings.length + 1}-${slugify(message)}`, new Set(findings.map(finding => finding.id)));
  const finding = { id, findingNumber: findings.length + 1, section, priority, message, status: 'open' };
  return { success: true, finding, draft: { ...draft, draft: { ...draft.draft, status: 'changes_requested' }, review: { ...review, findings: [...findings, finding], reviewStatus: 'changes_requested', approvalDecision: 'pending' }, publication: { ...draft.publication, publishStatus: 'not_published' } } };
}

export function updateAuthorReviewFinding(draft, findingId, changes = {}) {
  const review = safeReview(draft);
  if (!(review.findings || []).some(finding => finding.id === findingId)) return { success: false, error: 'The review finding could not be found.' };
  const findings = review.findings.map(finding => finding.id === findingId ? {
    ...finding,
    message: changes.message === undefined ? finding.message : changes.message,
    section: AUTHOR_REVIEW_SECTIONS.includes(changes.section) ? changes.section : finding.section,
    priority: AUTHOR_REVIEW_PRIORITIES.includes(changes.priority) ? changes.priority : finding.priority,
    status: ['open', 'resolved'].includes(changes.status) ? changes.status : finding.status,
    id: finding.id,
    findingNumber: finding.findingNumber
  } : finding);
  return { success: true, draft: { ...draft, review: { ...review, findings, reviewStatus: review.reviewStatus === 'ready_for_approval' ? 'in_review' : review.reviewStatus, approvalDecision: 'pending' }, publication: { ...draft.publication, publishStatus: 'not_published' } } };
}

export function removeAuthorReviewFinding(draft, findingId) {
  const review = safeReview(draft);
  if (!(review.findings || []).some(finding => finding.id === findingId)) return { success: false, error: 'The review finding could not be found.' };
  return { success: true, draft: { ...draft, review: { ...review, findings: numbered(review.findings.filter(finding => finding.id !== findingId)), reviewStatus: 'in_review', approvalDecision: 'pending' }, publication: { ...draft.publication, publishStatus: 'not_published' } } };
}

export function setAuthorReviewStatus(draft, status, { planningValidation, contentValidation } = {}) {
  if (!AUTHOR_REVIEW_STATUSES.includes(status)) return { success: false, error: 'Choose a supported review status.' };
  const review = safeReview(draft);
  if (status === 'ready_for_approval') {
    if (review.learnerPreviewStatus !== 'reviewed') return { success: false, error: 'Mark the learner preview as reviewed first.' };
    if (!planningValidation?.valid || !contentValidation?.valid) return { success: false, error: 'Fix every authoring validation error before requesting approval.' };
    if ((review.findings || []).some(finding => finding.status === 'open' && finding.priority === 'blocking')) return { success: false, error: 'Resolve every open blocking finding before requesting approval.' };
  }
  const draftStatus = status === 'changes_requested' ? 'changes_requested' : 'draft';
  return { success: true, draft: { ...draft, draft: { ...draft.draft, status: draftStatus }, review: { ...review, reviewStatus: status, approvalDecision: 'pending' }, programme: { ...draft.programme, publicationVisibility: 'unpublished' }, publication: { ...draft.publication, publishStatus: 'not_published' } } };
}

export function validateAuthorReview(draft) {
  const errors = [];
  const warnings = [];
  const review = safeReview(draft);
  const findings = review.findings || [];
  if (new Set(findings.map(finding => finding.id)).size !== findings.length) errors.push({ section: 'review', message: 'Review finding IDs must be unique.' });
  findings.forEach((finding, index) => {
    if (finding.findingNumber !== index + 1) errors.push({ section: 'review', id: finding.id, message: 'Review finding numbers must be continuous.' });
    if (!clean(finding.message)) errors.push({ section: 'review', id: finding.id, message: `Review finding ${index + 1} needs a description.` });
    if (!AUTHOR_REVIEW_SECTIONS.includes(finding.section)) errors.push({ section: 'review', id: finding.id, message: `Review finding ${index + 1} has an invalid section.` });
    if (!AUTHOR_REVIEW_PRIORITIES.includes(finding.priority)) errors.push({ section: 'review', id: finding.id, message: `Review finding ${index + 1} has an invalid priority.` });
    if (!['open', 'resolved'].includes(finding.status)) errors.push({ section: 'review', id: finding.id, message: `Review finding ${index + 1} has an invalid status.` });
  });
  if (review.reviewStatus === 'ready_for_approval' && review.learnerPreviewStatus !== 'reviewed') errors.push({ section: 'review', message: 'Ready for approval requires a reviewed learner preview.' });
  if (review.reviewStatus === 'ready_for_approval' && findings.some(finding => finding.status === 'open' && finding.priority === 'blocking')) errors.push({ section: 'review', message: 'Ready for approval cannot contain an open blocking finding.' });
  if (findings.some(finding => finding.status === 'open' && finding.priority === 'advisory')) warnings.push({ section: 'review', message: 'Open advisory findings remain for the approver to consider.' });
  if (review.approvalDecision !== 'pending') errors.push({ section: 'review', message: 'Final approval is not available in Author Version 1 review.' });
  if (draft.publication?.publishStatus !== 'not_published' || draft.programme?.publicationVisibility !== 'unpublished') errors.push({ section: 'review', message: 'Reviewed drafts must remain unpublished.' });
  return { valid: errors.length === 0, errors, warnings };
}
