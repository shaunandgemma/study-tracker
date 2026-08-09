export const AUTHOR_DRAFT_STORAGE_VERSION = '1';
export const AUTHOR_DRAFT_STATUS = 'draft';

function resolveStorage(storage) {
  if (storage) return storage;
  try {
    return globalThis.localStorage || null;
  } catch {
    return null;
  }
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function slugify(value) {
  return clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function defaultIdFactory() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function timestamp(now) {
  const value = typeof now === 'function' ? now() : now;
  return (value instanceof Date ? value : new Date(value || Date.now())).toISOString();
}

function privateDraftStatus(status) {
  return ['draft', 'researching', 'changes_requested'].includes(status) ? status : AUTHOR_DRAFT_STATUS;
}

function normalizeInstructionItems(step, taskId) {
  const existing = Array.isArray(step?.instructions) ? step.instructions : [];
  const used = new Set();
  const items = existing.map((item, index) => {
    const base = clean(item?.id) || `${taskId}-${step.id}-instruction-${index + 1}`;
    let id = base;
    let suffix = 2;
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id);
    return {
      ...item,
      id,
      text: clean(item?.text || item?.label),
      detail: clean(item?.detail)
    };
  });
  if (!items.length && clean(step?.instruction)) {
    items.push({
      id: `${taskId}-${step.id}-instruction-1`,
      text: clean(step.instruction),
      detail: ''
    });
  }
  return items;
}

function normalizeConsoleStep(step, index, taskId) {
  const instructions = normalizeInstructionItems(step, taskId);
  return {
    ...step,
    stepNumber: index + 1,
    number: index + 1,
    instruction: clean(step?.instruction) || instructions.map(item => item.text).filter(Boolean).join('\n'),
    instructions,
    commands: Array.isArray(step?.commands) ? step.commands : []
  };
}

function normalizeCliStep(step, index, taskId) {
  const commands = Array.isArray(step?.commands) && step.commands.length
    ? step.commands
    : clean(step?.command)
      ? [{
          id: `${taskId}-${step.id}-command-1`,
          text: clean(step.command),
          explanation: clean(step.explanation),
          expectedOutput: clean(step.expectedResult)
        }]
      : [];
  return {
    ...step,
    stepNumber: index + 1,
    number: index + 1,
    instructions: Array.isArray(step?.instructions) ? step.instructions : [],
    commands
  };
}

function normalizeCleanupStep(step, index) {
  const instruction = clean(step?.instruction || step?.description);
  return {
    ...step,
    stepNumber: index + 1,
    instruction,
    description: clean(step?.description) || instruction
  };
}

export function normalizeAuthorDraft(draft) {
  if (!draft || typeof draft !== 'object') return draft;
  const tasks = (draft.tasks || []).map(task => ({
    ...task,
    consoleSteps: (task.consoleSteps || []).map((step, index) => normalizeConsoleStep(step, index, task.id)),
    cliSteps: (task.cliSteps || []).map((step, index) => normalizeCliStep(step, index, task.id)),
    cleanup: (task.cleanup || []).map(normalizeCleanupStep)
  }));
  return {
    ...draft,
    tasks,
    cleanup: {
      ...(draft.cleanup || {}),
      steps: (draft.cleanup?.steps || []).map(normalizeCleanupStep)
    }
  };
}

export function getAuthorDraftStorageKey(userId) {
  const owner = clean(userId);
  if (!owner) throw new Error('A signed-in author is required.');
  return `studytracker_follow_along_author_v${AUTHOR_DRAFT_STORAGE_VERSION}:${owner}:drafts`;
}

export function createAuthorDraft({ userId, input = {}, now = () => new Date(), idFactory = defaultIdFactory } = {}) {
  const owner = clean(userId);
  if (!owner) throw new Error('A signed-in author is required.');

  const createdAt = timestamp(now);
  const draftId = `author-draft-${idFactory()}`;
  const serviceName = clean(input.serviceName);
  const shortName = clean(input.shortName) || serviceName;
  const displayName = clean(input.displayName) || (shortName ? `${shortName} Follow Along` : 'Untitled Follow Along');
  const serviceSlug = slugify(input.serviceSlug || shortName || serviceName);
  const programmeId = serviceSlug ? `${serviceSlug}-learning-path` : `draft-${slugify(draftId)}`;

  return {
    schema: {
      profile: 'canonical-follow-along',
      version: '1.0.0',
      authorPackageVersion: '1.0.0',
      sharedContractHash: null,
      createdWith: 'author-v1'
    },
    draft: {
      draftId,
      revision: 1,
      status: AUTHOR_DRAFT_STATUS,
      createdAt,
      createdBy: owner,
      updatedAt: createdAt,
      updatedBy: owner,
      basedOnProgrammeId: input.basedOnProgrammeId || null,
      importedFrom: null,
      notes: ''
    },
    programme: {
      serviceSlug,
      serviceName,
      shortName,
      displayName,
      subtitle: '',
      description: clean(input.description),
      learningOutcome: '',
      programmeId,
      pathId: programmeId,
      componentNamespace: '',
      category: '',
      difficulty: 'Intermediate',
      estimatedMinutes: null,
      defaultRegion: '',
      regionScope: 'regional',
      supportedModes: ['console', 'cli', 'both'],
      publicationVisibility: 'unpublished'
    },
    sources: [],
    presentation: { accentColor: '#0891b2', iconLabel: shortName.slice(0, 3).toUpperCase(), iconName: '', badgeText: '' },
    storage: {},
    progress: { initialTaskId: '', supportedModes: ['console', 'cli', 'both'], optionalTasksCountTowardsProgress: false, completionStatuses: ['in_progress', 'completed_retained', 'completed_cleaned'] },
    capabilities: {},
    phases: [],
    tasks: [],
    resources: { schema: [], interpolationAliases: {}, chargeableResourceKeys: [], variables: {} },
    warnings: { cost: '', safety: 'Cleanup is manual only.', credentials: 'Never save AWS secrets or private keys.', region: '' },
    cleanup: { steps: [], completionGate: 'acknowledgement', manualOnly: true, ordering: 'reverse_dependency' },
    extensions: { registrations: [] },
    review: { validationStatus: 'not_run', validationErrors: [], validationWarnings: [], sourceReviewStatus: 'not_run', learnerPreviewStatus: 'not_reviewed', approvalDecision: 'pending' },
    publication: { publishStatus: 'not_published', targetProgrammeId: programmeId, proposedChanges: [] }
  };
}

export function loadAuthorDrafts({ userId, storage } = {}) {
  const target = resolveStorage(storage);
  if (!target) return { success: false, drafts: [], error: 'Private draft storage is unavailable.' };

  try {
    const raw = target.getItem(getAuthorDraftStorageKey(userId));
    if (!raw) return { success: true, drafts: [] };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('The saved draft list is not valid.');
    const drafts = parsed
      .filter(item => item?.draft?.draftId && item?.draft?.createdBy === userId)
      .map(normalizeAuthorDraft);
    return { success: true, drafts };
  } catch (error) {
    return { success: false, drafts: [], error: error?.message || 'Unable to load private drafts.' };
  }
}

function writeDrafts(storage, userId, drafts) {
  storage.setItem(getAuthorDraftStorageKey(userId), JSON.stringify(drafts));
}

export function storeNewAuthorDraft({ userId, draft, storage } = {}) {
  const target = resolveStorage(storage);
  if (!target) return { success: false, error: 'Private draft storage is unavailable.' };
  if (!draft?.draft?.draftId || draft.draft.createdBy !== userId) return { success: false, error: 'This draft does not belong to the signed-in author.' };

  const loaded = loadAuthorDrafts({ userId, storage: target });
  if (!loaded.success) return loaded;
  if (loaded.drafts.some(item => item.draft.draftId === draft.draft.draftId)) return { success: false, error: 'A draft with this ID already exists.' };

  try {
    const normalized = normalizeAuthorDraft(draft);
    const safeDraft = {
      ...normalized,
      draft: { ...draft.draft, status: privateDraftStatus(draft.draft.status) },
      programme: { ...draft.programme, publicationVisibility: 'unpublished' },
      publication: { ...draft.publication, publishStatus: 'not_published' }
    };
    writeDrafts(target, userId, [...loaded.drafts, safeDraft]);
    return { success: true, draft: safeDraft };
  } catch (error) {
    return { success: false, error: error?.message || 'Unable to save the private draft.' };
  }
}

export function saveAuthorDraft({ userId, draft, expectedRevision, storage, now = () => new Date() } = {}) {
  const target = resolveStorage(storage);
  if (!target) return { success: false, error: 'Private draft storage is unavailable.' };
  if (!draft?.draft?.draftId || draft.draft.createdBy !== userId) return { success: false, error: 'This draft does not belong to the signed-in author.' };

  const loaded = loadAuthorDrafts({ userId, storage: target });
  if (!loaded.success) return loaded;
  const index = loaded.drafts.findIndex(item => item.draft.draftId === draft.draft.draftId);
  if (index < 0) return { success: false, error: 'The private draft could not be found.' };

  const saved = loaded.drafts[index];
  const revision = Number(saved.draft.revision) || 1;
  if (expectedRevision !== undefined && Number(expectedRevision) !== revision) {
    return { success: false, conflict: true, error: `A newer revision (${revision}) already exists.` };
  }

  const normalized = normalizeAuthorDraft(draft);
  const updated = {
    ...normalized,
    draft: {
      ...draft.draft,
      createdAt: saved.draft.createdAt,
      createdBy: saved.draft.createdBy,
      revision: revision + 1,
      status: privateDraftStatus(draft.draft.status),
      updatedAt: timestamp(now),
      updatedBy: userId
    },
    programme: { ...draft.programme, publicationVisibility: 'unpublished' },
    publication: { ...draft.publication, publishStatus: 'not_published' }
  };

  try {
    const drafts = [...loaded.drafts];
    drafts[index] = updated;
    writeDrafts(target, userId, drafts);
    return { success: true, draft: updated };
  } catch (error) {
    return { success: false, error: error?.message || 'Unable to save the private draft.' };
  }
}
