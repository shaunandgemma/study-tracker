import { supabase } from '../../../lib/supabase.js';

const runtimeEnv = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' ? process.env || {} : {});

export const CONTROLLED_PUBLISHING_FLAG = 'VITE_FOLLOW_ALONG_CONTROLLED_PUBLISHING';
export const PUBLISHED_FOLLOW_ALONG_TABLE = 'follow_along_published_programmes';

const PROGRAMMES_WITHOUT_LEARNER_RESOURCE_CAPTURE = new Set([
  'terraform-import-maintenance-learning-path'
]);

export function isControlledPublishingEnabled(environment = runtimeEnv) {
  return String(environment?.[CONTROLLED_PUBLISHING_FLAG] || '').toLowerCase() === 'true';
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function getPublishedFollowAlongDisplayName(programme) {
  const displayName = clean(programme?.displayName);
  return clean(programme?.programmeId || programme?.pathId) === 'terraform-configuration-foundations-learning-path'
    ? displayName.replace(/^Follow Along 0\s*[—-]\s*/i, '')
    : displayName;
}

function storageDefaults(programme) {
  const slug = clean(programme?.serviceSlug || programme?.shortName || 'follow-along').toLowerCase().replace(/[^a-z0-9]+/g, '_');
  return {
    storageNamespace: `studytracker_${slug}`,
    guestProgressKey: `studytracker_${slug}_progress`,
    guestResourcesKey: `studytracker_${slug}_resources`,
    remoteProgressTable: 'user_learning_path_progress',
    remoteResourcesTable: 'user_learning_path_resources'
  };
}

function capabilityDefaults(snapshot, cleanup) {
  const resourceKeys = snapshot?.resources?.schema || [];
  const chargeableKeys = snapshot?.resources?.chargeableResourceKeys || [];
  const cleanupSteps = cleanup?.steps || [];
  return {
    regionScope: { status: 'supported' },
    resourceCapture: resourceKeys.length
      ? { status: 'supported' }
      : { status: 'not_applicable', reason: 'The approved programme declares no resource bindings to capture.' },
    chargeableResources: chargeableKeys.length
      ? { status: 'supported' }
      : { status: 'not_applicable', reason: 'The approved programme declares no chargeable resource keys.' },
    cleanup: cleanupSteps.length
      ? { status: 'supported' }
      : { status: 'not_applicable', reason: 'The approved programme declares no cleanup manifest.' },
    serviceValidation: { status: 'not_applicable', reason: 'No service-specific automatic validation panel was included in the approved candidate.' },
    taskModes: { status: 'supported' },
    optionalPanels: { status: 'not_applicable', reason: 'No optional service panel was included in the approved candidate.' }
  };
}

function normalizedConsoleSteps(task) {
  return (task.consoleSteps || []).map((step, index) => {
    const instructions = Array.isArray(step.instructions) && step.instructions.length
      ? step.instructions
      : clean(step.instruction)
        ? [{ id: `${task.id}-${step.id}-instruction-1`, text: clean(step.instruction), detail: '' }]
        : [];
    return {
      ...step,
      number: step.number || step.stepNumber || index + 1,
      instructions,
      commands: Array.isArray(step.commands) ? step.commands : []
    };
  });
}

function normalizedCliSteps(task) {
  return (task.cliSteps || []).map((step, index) => ({
    ...step,
    number: step.number || step.stepNumber || index + 1,
    instructions: Array.isArray(step.instructions) ? step.instructions : [],
    commands: Array.isArray(step.commands) && step.commands.length
      ? step.commands
      : clean(step.command)
        ? [{
            id: `${task.id}-${step.id}-command-1`,
            text: clean(step.command),
            explanation: clean(step.explanation),
            expectedOutput: clean(step.expectedResult)
          }]
        : []
  }));
}

function normalizedTasks(tasks = [], { hideResourceCapture = false } = {}) {
  return tasks.map(task => ({
    ...task,
    ...(hideResourceCapture ? { createdResourceKeys: [] } : {}),
    consoleSteps: normalizedConsoleSteps(task),
    cliSteps: normalizedCliSteps(task),
    modeAvailability: {
      ...task.modeAvailability,
      console: task.modeAvailability?.console?.status === 'available'
        ? { ...task.modeAvailability.console, status: 'supported' }
        : task.modeAvailability?.console,
      cli: task.modeAvailability?.cli?.status === 'available'
        ? { ...task.modeAvailability.cli, status: 'supported' }
        : task.modeAvailability?.cli
    }
  }));
}

function normalizedCleanup(snapshot) {
  const taskSteps = (snapshot?.tasks || []).flatMap(task => (task.cleanup || []).map(step => ({
    ...step,
    id: `${task.id}-${step.id}`,
    description: clean(step.description || step.instruction)
  })));
  const programmeSteps = (snapshot?.cleanup?.steps || []).map(step => ({
    ...step,
    description: clean(step.description || step.instruction)
  }));
  return {
    completionGate: 'acknowledgement',
    manualOnly: true,
    ordering: 'reverse_dependency',
    ...(snapshot?.cleanup || {}),
    steps: [...taskSteps, ...programmeSteps]
  };
}

export function buildPublishedFollowAlongConfig(row) {
  const snapshot = row?.runtime_content;
  const programme = snapshot?.programme;
  if (!snapshot || !programme) return null;
  const programmeId = clean(programme.programmeId || programme.pathId);
  const pathId = clean(programme.pathId || programme.programmeId);
  const hideResourceCapture = PROGRAMMES_WITHOUT_LEARNER_RESOURCE_CAPTURE.has(programmeId);
  const storage = { ...storageDefaults(programme), ...(snapshot.storage || {}) };
  const cleanup = normalizedCleanup(snapshot);
  const resources = {
    schema: [],
    interpolationAliases: {},
    chargeableResourceKeys: [],
    ...(snapshot.resources || {}),
    variables: {
      region: programme.defaultRegion,
      ...(snapshot.resources?.variables || {})
    }
  };
  const capabilities = { ...capabilityDefaults(snapshot, cleanup), ...(snapshot.capabilities || {}) };
  if (hideResourceCapture) {
    capabilities.resourceCapture = {
      status: 'not_applicable',
      reason: 'This programme uses fixed, non-secret training names and does not ask learners to save resource bindings.'
    };
  }
  return {
    template: {
      profile: snapshot.schema?.profile,
      version: snapshot.schema?.version,
      sharedContractHash: snapshot.schema?.sharedContractHash || row.content_hash
    },
    identity: {
      serviceSlug: clean(programme.serviceSlug),
      serviceName: clean(programme.serviceName),
      displayName: getPublishedFollowAlongDisplayName(programme),
      description: clean(programme.description),
      programmeId,
      pathId,
      componentNamespace: clean(programme.componentNamespace) || clean(programme.shortName) || 'PublishedFollowAlong'
    },
    presentation: {
      accentColor: '#0891b2',
      iconLabel: clean(programme.shortName).slice(0, 3).toUpperCase() || 'AWS',
      ...(snapshot.presentation || {})
    },
    storage,
    progress: snapshot.progress || {},
    capabilities,
    phases: snapshot.phases || [],
    tasks: normalizedTasks(snapshot.tasks, { hideResourceCapture }),
    resources,
    warnings: snapshot.warnings || {},
    cleanup,
    extensions: snapshot.extensions || { registrations: [] },
    implementationRequirements: snapshot.implementationRequirements || []
  };
}

export function buildPublishedProgrammeCard(row) {
  const snapshot = row?.runtime_content;
  const programme = snapshot?.programme;
  if (!programme) return null;
  const tasks = snapshot.tasks || [];
  const hasConsole = tasks.some(task => task.modeAvailability?.console?.status === 'available' && (task.consoleSteps || []).length > 0);
  const hasCli = tasks.some(task => task.modeAvailability?.cli?.status === 'available' && (task.cliSteps || []).length > 0);
  const supportedModes = [hasConsole && 'console', hasCli && 'cli', hasConsole && hasCli && 'both'].filter(Boolean);
  const assignedTask = tasks.find(task => task.examId || task.examCode);
  const inferredExamId = programme.programmeId === 'cloudformation-terraform-learning-path'
    ? 'aws-saa-c03'
    : clean(programme.category).toLowerCase().includes('terraform')
      || clean(programme.programmeId).startsWith('hcp-terraform-')
      ? 'terraform-associate-004'
    : '';
  const examId = clean(programme.examId || programme.examCode)
    || clean(assignedTask?.examId || assignedTask?.examCode)
    || inferredExamId
    || 'aws-saa-c03';
  return {
    id: programme.programmeId,
    slug: programme.serviceSlug,
    title: getPublishedFollowAlongDisplayName(programme),
    shortTitle: programme.shortName,
    subtitle: programme.subtitle,
    description: programme.description,
    service: programme.serviceName,
    status: 'available',
    taskCount: snapshot.tasks?.length || 0,
    phaseCount: snapshot.phases?.length || 0,
    supportedModes,
    icon: programme.shortName === 'Lambda' ? 'Zap' : 'Layers',
    category: programme.category || 'AWS Services',
    difficulty: programme.difficulty || 'Guided',
    estimatedHours: programme.estimatedMinutes ? `${programme.estimatedMinutes} minutes` : 'Self-paced',
    pathId: programme.pathId,
    publishedAt: row.published_at,
    sourceRevision: row.source_revision,
    candidateId: row.candidate_id,
    examId
  };
}

export function mergePublishedProgrammeCards(existing = [], published = []) {
  const publishedById = new Map(published.filter(Boolean).map(item => [item.id, item]));
  const merged = existing.map(item => publishedById.get(item.id) || item);
  for (const item of publishedById.values()) {
    if (!existing.some(existingItem => existingItem.id === item.id)) merged.push(item);
  }
  return merged;
}

export function createPublishedFollowAlongService(client = supabase, { enabled = isControlledPublishingEnabled() } = {}) {
  const select = 'programme_id,candidate_id,source_revision,content_hash,runtime_content,change_summary,published_at';
  const disabled = { success: true, disabled: true, programmes: [], rows: [] };
  return {
    enabled: Boolean(enabled),
    async listPublishedProgrammes() {
      if (!enabled || !client) return disabled;
      const { data, error } = await client.from(PUBLISHED_FOLLOW_ALONG_TABLE).select(select).order('published_at', { ascending: true });
      if (error) return { success: false, error: error.message || 'Unable to load published Follow Alongs.', programmes: [], rows: [] };
      return { success: true, rows: data || [], programmes: (data || []).map(buildPublishedProgrammeCard).filter(Boolean) };
    },
    async loadPublishedProgramme(programmeId) {
      if (!enabled || !client) return { success: false, disabled: true, error: 'Controlled publishing is disabled.' };
      const { data, error } = await client.from(PUBLISHED_FOLLOW_ALONG_TABLE).select(select).eq('programme_id', programmeId).maybeSingle();
      if (error) return { success: false, error: error.message || 'Unable to load the published Follow Along.' };
      if (!data) return { success: false, notFound: true, error: 'The published Follow Along could not be found.' };
      const config = buildPublishedFollowAlongConfig(data);
      const programme = buildPublishedProgrammeCard(data);
      return config && programme
        ? { success: true, row: data, config, programme }
        : { success: false, error: 'The published Follow Along package is incomplete.' };
    }
  };
}
