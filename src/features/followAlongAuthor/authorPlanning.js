export const AUTHOR_PROGRAMME_DIFFICULTIES = Object.freeze([
  'Beginner',
  'Beginner to Intermediate',
  'Intermediate',
  'Intermediate to Advanced',
  'Advanced'
]);

export const AUTHOR_TASK_DIFFICULTIES = Object.freeze(['Easy', 'Medium', 'Hard']);
export const AUTHOR_REGION_SCOPES = Object.freeze(['regional', 'global', 'mixed']);

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function slugify(value) {
  return clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

function uniqueId(base, existing) {
  const safeBase = base || 'item';
  if (!existing.has(safeBase)) return safeBase;
  let suffix = 2;
  while (existing.has(`${safeBase}-${suffix}`)) suffix += 1;
  return `${safeBase}-${suffix}`;
}

function numberedPhases(phases) {
  return phases.map((phase, index) => ({ ...phase, phaseNumber: index + 1 }));
}

export function getOrderedAuthorTasks(draft) {
  const byId = new Map((draft.tasks || []).map(task => [task.id, task]));
  return (draft.phases || []).flatMap(phase => (phase.taskIds || []).map(id => byId.get(id)).filter(Boolean));
}

export function addAuthorPhase(draft, input = {}) {
  const title = clean(input.title);
  if (!title) return { success: false, error: 'Enter a phase title.' };
  const phases = draft.phases || [];
  const existing = new Set(phases.map(phase => phase.id));
  const phaseNumber = phases.length + 1;
  const id = uniqueId(`phase-${phaseNumber}-${slugify(title)}`, existing);
  const phase = { id, phaseNumber, title, description: clean(input.description), taskIds: [], isOptional: Boolean(input.isOptional) };
  return { success: true, phase, draft: { ...draft, phases: [...phases, phase] } };
}

export function updateAuthorPhase(draft, phaseId, changes = {}) {
  if (!(draft.phases || []).some(phase => phase.id === phaseId)) return { success: false, error: 'The phase could not be found.' };
  const phases = draft.phases.map(phase => phase.id === phaseId ? {
    ...phase,
    title: changes.title === undefined ? phase.title : changes.title,
    description: changes.description === undefined ? phase.description : changes.description,
    isOptional: changes.isOptional === undefined ? phase.isOptional : Boolean(changes.isOptional)
  } : phase);
  return { success: true, draft: { ...draft, phases } };
}

export function moveAuthorPhase(draft, phaseId, direction) {
  const phases = [...(draft.phases || [])];
  const index = phases.findIndex(phase => phase.id === phaseId);
  const target = index + (direction === 'up' ? -1 : 1);
  if (index < 0 || target < 0 || target >= phases.length) return { success: false, error: 'The phase cannot move in that direction.' };
  [phases[index], phases[target]] = [phases[target], phases[index]];
  return { success: true, draft: { ...draft, phases: numberedPhases(phases) } };
}

export function removeEmptyAuthorPhase(draft, phaseId) {
  const phase = (draft.phases || []).find(item => item.id === phaseId);
  if (!phase) return { success: false, error: 'The phase could not be found.' };
  if ((phase.taskIds || []).length) return { success: false, error: 'Move or remove the tasks before removing this phase.' };
  return { success: true, draft: { ...draft, phases: numberedPhases(draft.phases.filter(item => item.id !== phaseId)) } };
}

export function addAuthorTask(draft, input = {}) {
  const phase = (draft.phases || []).find(item => item.id === input.phaseId);
  if (!phase) return { success: false, error: 'Choose a phase for the task.' };
  const title = clean(input.title);
  if (!title) return { success: false, error: 'Enter a task title.' };

  const tasks = draft.tasks || [];
  const sequence = String(tasks.length + 1).padStart(3, '0');
  const serviceSlug = slugify(draft.programme?.serviceSlug || draft.programme?.shortName || draft.programme?.serviceName) || 'service';
  const id = uniqueId(`task-${serviceSlug}-${slugify(title)}-${sequence}`, new Set(tasks.map(task => task.id)));
  const task = {
    id,
    slug: slugify(title),
    title,
    service: clean(draft.programme?.serviceName),
    feature: clean(input.feature),
    goal: clean(input.goal),
    whyItMatters: clean(input.whyItMatters),
    difficulty: AUTHOR_TASK_DIFFICULTIES.includes(input.difficulty) ? input.difficulty : 'Medium',
    estimatedMinutes: Number(input.estimatedMinutes) || 15,
    region: clean(input.region || draft.programme?.defaultRegion),
    status: 'draft',
    phaseId: phase.id,
    prerequisites: [],
    isOptional: Boolean(input.isOptional),
    sourceIds: [],
    concepts: [],
    values: [],
    modeAvailability: {
      console: { status: 'not_applicable', reason: 'Console instructions have not been authored yet.' },
      cli: { status: 'not_applicable', reason: 'CLI instructions have not been authored yet.' }
    },
    consoleSteps: [],
    cliSteps: [],
    createdResourceKeys: [],
    verification: [],
    cleanup: []
  };

  const phases = draft.phases.map(item => item.id === phase.id ? { ...item, taskIds: [...(item.taskIds || []), id] } : item);
  const progress = draft.progress?.initialTaskId ? draft.progress : { ...draft.progress, initialTaskId: id };
  return { success: true, task, draft: { ...draft, phases, tasks: [...tasks, task], progress } };
}

export function updateAuthorTask(draft, taskId, changes = {}) {
  const current = (draft.tasks || []).find(task => task.id === taskId);
  if (!current) return { success: false, error: 'The task could not be found.' };
  const nextPhaseId = changes.phaseId || current.phaseId;
  if (!(draft.phases || []).some(phase => phase.id === nextPhaseId)) return { success: false, error: 'Choose a valid phase.' };

  const nextTask = {
    ...current,
    ...changes,
    id: current.id,
    slug: current.slug,
    status: 'draft',
    phaseId: nextPhaseId,
    prerequisites: Array.isArray(changes.prerequisites) ? [...new Set(changes.prerequisites)] : current.prerequisites,
    isOptional: changes.isOptional === undefined ? current.isOptional : Boolean(changes.isOptional),
    estimatedMinutes: changes.estimatedMinutes === undefined ? current.estimatedMinutes : Number(changes.estimatedMinutes)
  };

  let phases = draft.phases;
  if (nextPhaseId !== current.phaseId) {
    phases = phases.map(phase => {
      const without = (phase.taskIds || []).filter(id => id !== taskId);
      return phase.id === nextPhaseId ? { ...phase, taskIds: [...without, taskId] } : { ...phase, taskIds: without };
    });
  }
  return { success: true, draft: { ...draft, phases, tasks: draft.tasks.map(task => task.id === taskId ? nextTask : task) } };
}

export function moveAuthorTask(draft, taskId, direction) {
  const task = (draft.tasks || []).find(item => item.id === taskId);
  if (!task) return { success: false, error: 'The task could not be found.' };
  const phase = draft.phases.find(item => item.id === task.phaseId);
  const ids = [...(phase?.taskIds || [])];
  const index = ids.indexOf(taskId);
  const target = index + (direction === 'up' ? -1 : 1);
  if (index < 0 || target < 0 || target >= ids.length) return { success: false, error: 'The task cannot move in that direction.' };
  [ids[index], ids[target]] = [ids[target], ids[index]];
  return { success: true, draft: { ...draft, phases: draft.phases.map(item => item.id === phase.id ? { ...item, taskIds: ids } : item) } };
}

export function removeAuthorTask(draft, taskId) {
  const dependent = (draft.tasks || []).find(task => (task.prerequisites || []).includes(taskId));
  if (dependent) return { success: false, error: `Remove ${taskId} from ${dependent.title}'s prerequisites first.` };
  if (!(draft.tasks || []).some(task => task.id === taskId)) return { success: false, error: 'The task could not be found.' };
  const tasks = draft.tasks.filter(task => task.id !== taskId);
  const phases = draft.phases.map(phase => ({ ...phase, taskIds: (phase.taskIds || []).filter(id => id !== taskId) }));
  const progress = draft.progress?.initialTaskId === taskId ? { ...draft.progress, initialTaskId: getOrderedAuthorTasks({ ...draft, phases, tasks })[0]?.id || '' } : draft.progress;
  return { success: true, draft: { ...draft, phases, tasks, progress } };
}

export function validateAuthorPlanning(draft) {
  const errors = [];
  const warnings = [];
  const programme = draft.programme || {};
  const requiredProgramme = [
    ['serviceName', 'Enter the official AWS service name.'],
    ['shortName', 'Enter the learner-facing short name.'],
    ['displayName', 'Enter the programme title.'],
    ['subtitle', 'Enter a short programme subtitle.'],
    ['description', 'Describe what the learner will build.'],
    ['learningOutcome', 'Describe what the learner should achieve.'],
    ['category', 'Choose an AWS category.']
  ];
  requiredProgramme.forEach(([field, message]) => { if (!clean(programme[field])) errors.push({ section: 'programme', field, message }); });
  if (!AUTHOR_PROGRAMME_DIFFICULTIES.includes(programme.difficulty)) errors.push({ section: 'programme', field: 'difficulty', message: 'Choose a supported programme difficulty.' });
  if (!AUTHOR_REGION_SCOPES.includes(programme.regionScope)) errors.push({ section: 'programme', field: 'regionScope', message: 'Choose regional, global or mixed.' });
  if (programme.regionScope !== 'global' && !clean(programme.defaultRegion)) errors.push({ section: 'programme', field: 'defaultRegion', message: 'Enter the example AWS Region.' });
  if (!Number.isFinite(Number(programme.estimatedMinutes)) || Number(programme.estimatedMinutes) <= 0) errors.push({ section: 'programme', field: 'estimatedMinutes', message: 'Enter a positive programme duration.' });

  const phases = draft.phases || [];
  const tasks = draft.tasks || [];
  if (!phases.length) errors.push({ section: 'phases', message: 'Add at least one phase.' });
  if (!tasks.length) errors.push({ section: 'tasks', message: 'Add at least one task.' });
  const phaseIds = phases.map(phase => phase.id);
  const taskIds = tasks.map(task => task.id);
  if (new Set(phaseIds).size !== phaseIds.length) errors.push({ section: 'phases', message: 'Phase IDs must be unique.' });
  if (new Set(taskIds).size !== taskIds.length) errors.push({ section: 'tasks', message: 'Task IDs must be unique.' });

  phases.forEach((phase, index) => {
    if (phase.phaseNumber !== index + 1) errors.push({ section: 'phases', id: phase.id, message: `${phase.title || phase.id} has an incorrect phase number.` });
    if (!clean(phase.title)) errors.push({ section: 'phases', id: phase.id, message: 'Every phase needs a title.' });
    if (!clean(phase.description)) errors.push({ section: 'phases', id: phase.id, message: `${phase.title || 'A phase'} needs a description.` });
    if (!(phase.taskIds || []).length) warnings.push({ section: 'phases', id: phase.id, message: `${phase.title || 'A phase'} has no tasks yet.` });
  });

  const occurrences = new Map();
  phases.forEach(phase => (phase.taskIds || []).forEach(taskId => {
    occurrences.set(taskId, (occurrences.get(taskId) || 0) + 1);
    if (!taskIds.includes(taskId)) errors.push({ section: 'phases', id: phase.id, message: `${phase.title} contains an unknown task ID.` });
  }));
  tasks.forEach(task => {
    if (occurrences.get(task.id) !== 1) errors.push({ section: 'tasks', id: task.id, message: `${task.title || task.id} must appear in exactly one phase.` });
    const phase = phases.find(item => item.id === task.phaseId);
    if (!phase) errors.push({ section: 'tasks', id: task.id, message: `${task.title || task.id} needs a valid phase.` });
    if (!clean(task.title)) errors.push({ section: 'tasks', id: task.id, message: 'Every task needs a title.' });
    if (!clean(task.goal)) errors.push({ section: 'tasks', id: task.id, message: `${task.title || 'A task'} needs a learner objective.` });
    if (!clean(task.whyItMatters)) errors.push({ section: 'tasks', id: task.id, message: `${task.title || 'A task'} needs a why-it-matters explanation.` });
    if (!clean(task.feature)) errors.push({ section: 'tasks', id: task.id, message: `${task.title || 'A task'} needs an AWS feature.` });
    if (!AUTHOR_TASK_DIFFICULTIES.includes(task.difficulty)) errors.push({ section: 'tasks', id: task.id, message: `${task.title || 'A task'} has an unsupported difficulty.` });
    if (!Number.isFinite(Number(task.estimatedMinutes)) || Number(task.estimatedMinutes) <= 0) errors.push({ section: 'tasks', id: task.id, message: `${task.title || 'A task'} needs a positive duration.` });
  });

  const ordered = getOrderedAuthorTasks(draft);
  const order = new Map(ordered.map((task, index) => [task.id, index]));
  const byId = new Map(tasks.map(task => [task.id, task]));
  tasks.forEach(task => {
    const prerequisites = task.prerequisites || [];
    if (new Set(prerequisites).size !== prerequisites.length) errors.push({ section: 'tasks', id: task.id, message: `${task.title} has duplicate prerequisites.` });
    prerequisites.forEach(prerequisiteId => {
      const prerequisite = byId.get(prerequisiteId);
      if (!prerequisite) errors.push({ section: 'tasks', id: task.id, message: `${task.title} references an unknown prerequisite.` });
      else {
        if ((order.get(prerequisiteId) ?? Infinity) >= (order.get(task.id) ?? -1)) errors.push({ section: 'tasks', id: task.id, message: `${task.title} can depend only on an earlier task.` });
        if (!task.isOptional && prerequisite.isOptional) errors.push({ section: 'tasks', id: task.id, message: `${task.title} is required and cannot depend on optional task ${prerequisite.title}.` });
      }
    });
  });

  const visiting = new Set();
  const visited = new Set();
  const visit = id => {
    if (visiting.has(id)) { errors.push({ section: 'tasks', id, message: 'Task prerequisites contain a circular dependency.' }); return; }
    if (visited.has(id)) return;
    visiting.add(id);
    (byId.get(id)?.prerequisites || []).filter(dep => byId.has(dep)).forEach(visit);
    visiting.delete(id);
    visited.add(id);
  };
  taskIds.forEach(visit);

  return { valid: errors.length === 0, errors, warnings };
}
