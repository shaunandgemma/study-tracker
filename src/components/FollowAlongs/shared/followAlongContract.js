export const FOLLOW_ALONG_TEMPLATE_PROFILE = 'canonical-follow-along';
export const FOLLOW_ALONG_TEMPLATE_VERSION = '1.0.0';
export const FOLLOW_ALONG_MODES = Object.freeze(['console', 'cli', 'both']);
export const FOLLOW_ALONG_COMPLETION_STATUSES = Object.freeze([
  'in_progress',
  'completed_retained',
  'completed_cleaned'
]);
export const FOLLOW_ALONG_CAPABILITY_STATUSES = Object.freeze([
  'supported',
  'not_applicable',
  'extension'
]);
export const FOLLOW_ALONG_EXTENSION_SLOTS = Object.freeze([
  'dashboard.beforeMetrics',
  'dashboard.afterMetrics',
  'runner.beforeObjective',
  'runner.afterResourceCapture',
  'runner.beforeSteps',
  'runner.afterSteps',
  'cleanup.beforeChecklist',
  'cleanup.afterChecklist'
]);

const REQUIRED_CAPABILITIES = Object.freeze([
  'regionScope',
  'resourceCapture',
  'chargeableResources',
  'cleanup',
  'serviceValidation',
  'taskModes',
  'optionalPanels'
]);

export function normalizeFollowAlongCompletionStatus(status) {
  if (status === 'completed_cleaned') return 'completed_cleaned';
  if (['completed_retained', 'resources_retained', 'resources-retained', 'completed'].includes(status)) {
    return 'completed_retained';
  }
  return 'in_progress';
}

export function resolveCapability(capability) {
  if (!capability || typeof capability !== 'object') {
    return { valid: false, status: null, error: 'Capability must be an object.' };
  }
  const { status, reason, extensionId, slot } = capability;
  if (!FOLLOW_ALONG_CAPABILITY_STATUSES.includes(status)) {
    return { valid: false, status, error: `Unknown capability status: ${status}` };
  }
  if (status === 'not_applicable' && (typeof reason !== 'string' || !reason.trim())) {
    return { valid: false, status, error: 'Not-applicable capability requires an approved reason.' };
  }
  if (status === 'extension') {
    if (typeof reason !== 'string' || !reason.trim()) {
      return { valid: false, status, error: 'Extension capability requires an approved reason.' };
    }
    if (typeof extensionId !== 'string' || !extensionId.trim()) {
      return { valid: false, status, error: 'Extension capability requires extensionId.' };
    }
    if (!FOLLOW_ALONG_EXTENSION_SLOTS.includes(slot)) {
      return { valid: false, status, error: `Extension capability uses unknown slot: ${slot}` };
    }
  }
  return { valid: true, status, reason: reason || '', extensionId: extensionId || null, slot: slot || null };
}

function collectNestedIds(tasks, field) {
  const values = [];
  tasks.forEach(task => {
    [...(task.consoleSteps || []), ...(task.cliSteps || [])].forEach(step => {
      if (field === 'steps') values.push([step.id, task.id]);
      if (field === 'instructions') (step.instructions || []).forEach(item => values.push([item.id, task.id]));
      if (field === 'commands') (step.commands || []).forEach(item => values.push([item.id, task.id]));
    });
  });
  return values;
}

function duplicateIds(entries) {
  const seen = new Set();
  const duplicates = [];
  entries.forEach(([id, scope]) => {
    const key = `${scope}:${id}`;
    if (!id || seen.has(key)) duplicates.push(key);
    seen.add(key);
  });
  return duplicates;
}

export function validatePrerequisiteGraph(tasks = []) {
  const errors = [];
  const ids = new Set(tasks.map(task => task.id));
  const optional = new Set(tasks.filter(task => task.isOptional).map(task => task.id));
  const edges = new Map(tasks.map(task => [task.id, task.prerequisites || []]));

  tasks.forEach(task => {
    (task.prerequisites || []).forEach(prerequisiteId => {
      if (!ids.has(prerequisiteId)) errors.push(`Task ${task.id} references unknown prerequisite ${prerequisiteId}.`);
      if (!task.isOptional && optional.has(prerequisiteId)) {
        errors.push(`Required task ${task.id} depends on optional task ${prerequisiteId}.`);
      }
    });
  });

  const visiting = new Set();
  const visited = new Set();
  const visit = id => {
    if (visiting.has(id)) {
      errors.push(`Prerequisite graph contains a cycle at ${id}.`);
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    (edges.get(id) || []).filter(dep => ids.has(dep)).forEach(visit);
    visiting.delete(id);
    visited.add(id);
  };
  tasks.forEach(task => visit(task.id));
  return { valid: errors.length === 0, errors };
}

export function validateFollowAlongConfig(config) {
  const errors = [];
  const requiredSections = [
    'template', 'identity', 'presentation', 'storage', 'progress', 'capabilities',
    'phases', 'tasks', 'resources', 'warnings', 'cleanup', 'extensions',
    'implementationRequirements'
  ];
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    return { valid: false, errors: ['Configuration must be an object.'], warnings: [] };
  }
  requiredSections.forEach(section => {
    if (!(section in config)) errors.push(`Missing required configuration section: ${section}.`);
  });
  if (errors.length) return { valid: false, errors, warnings: [] };

  if (config.template.profile !== FOLLOW_ALONG_TEMPLATE_PROFILE) errors.push('Template profile is not canonical-follow-along.');
  if (config.template.version !== FOLLOW_ALONG_TEMPLATE_VERSION) errors.push('Template version is not supported.');

  for (const field of ['serviceSlug', 'serviceName', 'displayName', 'programmeId', 'pathId', 'componentNamespace']) {
    if (typeof config.identity[field] !== 'string' || !config.identity[field].trim()) {
      errors.push(`Identity field ${field} must be a non-empty string.`);
    }
  }
  if (config.identity.programmeId !== config.identity.pathId) {
    errors.push('Programme ID and path ID must match unless a separately approved adapter is supplied.');
  }

  for (const field of ['guestProgressKey', 'guestResourcesKey', 'storageNamespace', 'remoteProgressTable', 'remoteResourcesTable']) {
    if (typeof config.storage[field] !== 'string' || !config.storage[field].trim()) {
      errors.push(`Storage field ${field} must be a non-empty string.`);
    }
  }

  if (JSON.stringify(config.progress.supportedModes) !== JSON.stringify(FOLLOW_ALONG_MODES)) {
    errors.push('Global supported modes must be console, cli, both in canonical order.');
  }
  if (typeof config.progress.optionalTasksCountTowardsProgress !== 'boolean') {
    errors.push('Optional-task progress policy must be explicit.');
  }
  if (JSON.stringify(config.progress.completionStatuses) !== JSON.stringify(FOLLOW_ALONG_COMPLETION_STATUSES)) {
    errors.push('Completion status contract is invalid.');
  }

  REQUIRED_CAPABILITIES.forEach(name => {
    const result = resolveCapability(config.capabilities[name]);
    if (!result.valid) errors.push(`Capability ${name}: ${result.error}`);
  });

  if (!Array.isArray(config.tasks) || config.tasks.length === 0) errors.push('At least one task is required.');
  if (!Array.isArray(config.phases) || config.phases.length === 0) errors.push('At least one phase is required.');
  const tasks = Array.isArray(config.tasks) ? config.tasks : [];
  const taskIds = tasks.map(task => task.id);
  if (new Set(taskIds).size !== taskIds.length || taskIds.some(id => !id)) errors.push('Task IDs must be non-empty and unique.');
  if (config.progress.initialTaskId && !taskIds.includes(config.progress.initialTaskId)) errors.push('Initial task ID is not in the task catalogue.');

  const phaseIds = new Set();
  const phaseTaskOccurrences = new Map();
  (Array.isArray(config.phases) ? config.phases : []).forEach(phase => {
    if (!phase.id || phaseIds.has(phase.id)) errors.push(`Phase ID is missing or duplicated: ${phase.id}`);
    phaseIds.add(phase.id);
    (phase.taskIds || []).forEach(taskId => {
      phaseTaskOccurrences.set(taskId, (phaseTaskOccurrences.get(taskId) || 0) + 1);
      if (!taskIds.includes(taskId)) errors.push(`Phase ${phase.id} references unknown task ${taskId}.`);
    });
  });
  taskIds.forEach(taskId => {
    if (phaseTaskOccurrences.get(taskId) !== 1) errors.push(`Task ${taskId} must occur in exactly one phase.`);
  });
  tasks.forEach(task => {
    if (!phaseIds.has(task.phaseId)) errors.push(`Task ${task.id} references unknown phase ${task.phaseId}.`);
    for (const mode of ['console', 'cli']) {
      const availability = task.modeAvailability?.[mode];
      if (!availability || !['supported', 'not_applicable'].includes(availability.status)) {
        errors.push(`Task ${task.id} has invalid ${mode} mode availability.`);
      } else if (availability.status === 'not_applicable' && !availability.reason?.trim()) {
        errors.push(`Task ${task.id} ${mode} not-applicable mode requires a reason.`);
      }
    }
  });

  const graph = validatePrerequisiteGraph(tasks);
  errors.push(...graph.errors);
  for (const [label, entries] of [
    ['step', collectNestedIds(tasks, 'steps')],
    ['instruction', collectNestedIds(tasks, 'instructions')],
    ['command', collectNestedIds(tasks, 'commands')]
  ]) {
    const duplicates = duplicateIds(entries);
    if (duplicates.length) errors.push(`Duplicate or missing ${label} IDs: ${duplicates.join(', ')}.`);
  }

  const resourceSchema = Array.isArray(config.resources.schema) ? config.resources.schema : [];
  const resourceKeys = resourceSchema.map(item => item.key);
  if (new Set(resourceKeys).size !== resourceKeys.length || resourceKeys.some(key => !key)) errors.push('Resource keys must be non-empty and unique.');
  resourceSchema.forEach(item => {
    if (!item.type || !item.label) errors.push(`Resource ${item.key} requires type and label.`);
    if (item.validator && !['none', 'pattern', 'identifier'].includes(item.validator.kind)) {
      errors.push(`Resource ${item.key} has unsupported validator kind.`);
    }
  });
  tasks.forEach(task => (task.createdResourceKeys || []).forEach(key => {
    if (!resourceKeys.includes(key)) errors.push(`Task ${task.id} captures undeclared resource ${key}.`);
  }));
  Object.entries(config.resources.interpolationAliases || {}).forEach(([alias, key]) => {
    if (!alias || !resourceKeys.includes(key)) errors.push(`Interpolation alias ${alias} references unknown resource ${key}.`);
  });
  (config.resources.chargeableResourceKeys || []).forEach(key => {
    if (!resourceKeys.includes(key)) errors.push(`Chargeable resource key ${key} is not declared.`);
  });
  if (config.capabilities.resourceCapture.status === 'supported' && resourceSchema.length === 0) errors.push('Supported resource capture requires a resource schema.');
  if (config.capabilities.chargeableResources.status === 'supported' && (config.resources.chargeableResourceKeys || []).length === 0) errors.push('Supported chargeable-resource warnings require declared chargeable keys.');
  if (config.capabilities.regionScope.status === 'supported' && !config.resources.variables?.region && !tasks.some(task => task.region)) errors.push('Supported region scope requires an approved region source.');

  const cleanupSteps = Array.isArray(config.cleanup.steps) ? config.cleanup.steps : [];
  const cleanupIds = cleanupSteps.map(item => item.id);
  if (new Set(cleanupIds).size !== cleanupIds.length || cleanupIds.some(id => !id)) errors.push('Cleanup IDs must be non-empty and unique.');
  if (!['all_items', 'acknowledgement'].includes(config.cleanup.completionGate)) errors.push('Cleanup completion gate is invalid.');
  if (config.cleanup.manualOnly !== true) errors.push('Cleanup must be explicitly manual-only.');
  if (config.cleanup.ordering !== 'reverse_dependency') errors.push('Cleanup ordering must be reverse_dependency.');
  if (config.capabilities.cleanup.status === 'supported' && cleanupSteps.length === 0) errors.push('Supported cleanup requires a cleanup manifest.');
  if (config.capabilities.cleanup.status === 'not_applicable' && config.cleanup.completionGate !== 'acknowledgement') {
    errors.push('Not-applicable cleanup requires acknowledgement gating.');
  }

  const extensionIds = new Set();
  (Array.isArray(config.extensions.registrations) ? config.extensions.registrations : []).forEach(registration => {
    if (!registration.id || extensionIds.has(registration.id)) errors.push(`Extension ID is missing or duplicated: ${registration.id}`);
    extensionIds.add(registration.id);
    if (!FOLLOW_ALONG_EXTENSION_SLOTS.includes(registration.slot)) errors.push(`Extension ${registration.id} uses an unknown slot.`);
    if (!['required', 'complete'].includes(registration.status)) errors.push(`Extension ${registration.id} has invalid implementation status.`);
    if (!registration.reason?.trim() || !registration.componentExport?.trim()) errors.push(`Extension ${registration.id} requires reason and component export.`);
    if (!Array.isArray(registration.requiredCapabilities)) errors.push(`Extension ${registration.id} requires an explicit capability list.`);
    else registration.requiredCapabilities.forEach(name => {
      if (!REQUIRED_CAPABILITIES.includes(name)) errors.push(`Extension ${registration.id} references unknown capability ${name}.`);
    });
  });
  REQUIRED_CAPABILITIES.forEach(name => {
    const capability = config.capabilities[name];
    if (capability?.status !== 'extension') return;
    const registration = (config.extensions.registrations || []).find(item => item.id === capability.extensionId);
    if (!registration || registration.slot !== capability.slot) errors.push(`Capability ${name} does not reference a matching approved extension registration.`);
  });

  return { valid: errors.length === 0, errors, warnings: [] };
}

export function calculateFollowAlongMetrics(config, completedTaskIds = []) {
  const completed = new Set(completedTaskIds);
  const countedTasks = config.progress.optionalTasksCountTowardsProgress
    ? config.tasks
    : config.tasks.filter(task => !task.isOptional);
  const completedCount = countedTasks.filter(task => completed.has(task.id)).length;
  const totalTasks = countedTasks.length;
  const phaseMetrics = config.phases.map(phase => {
    const phaseTasks = config.tasks.filter(task => phase.taskIds.includes(task.id));
    const counted = config.progress.optionalTasksCountTowardsProgress
      ? phaseTasks
      : phaseTasks.filter(task => !task.isOptional);
    const phaseCompleted = counted.filter(task => completed.has(task.id)).length;
    return {
      ...phase,
      total: counted.length,
      completed: phaseCompleted,
      percent: counted.length ? Math.round((phaseCompleted / counted.length) * 100) : 100,
      isComplete: counted.length === phaseCompleted
    };
  });
  return {
    totalTasks,
    completedCount,
    percentComplete: totalTasks ? Math.round((completedCount / totalTasks) * 100) : 0,
    phaseMetrics
  };
}

export function interpolateFollowAlongVariables(value = '', resources = {}, variables = {}, aliases = {}) {
  if (typeof value !== 'string') return '';
  const bindings = { ...variables };
  Object.entries(resources || {}).forEach(([key, resource]) => {
    const resolved = typeof resource === 'object' ? resource.value ?? resource.providerId : resource;
    if (resolved !== undefined && resolved !== null && resolved !== '') bindings[key] = String(resolved);
  });
  Object.entries(aliases || {}).forEach(([alias, resourceKey]) => {
    if (bindings[resourceKey] !== undefined) bindings[alias] = bindings[resourceKey];
  });
  return Object.entries(bindings).reduce(
    (result, [key, resolved]) => result.replaceAll(`{{${key}}}`, String(resolved)),
    value
  );
}

export function canCompleteCleanup(config, checkedIds = [], acknowledged = false, status = 'in_progress') {
  if (status !== 'completed_cleaned') return true;
  if (config.cleanup.completionGate === 'acknowledgement') return acknowledged === true;
  const checked = new Set(checkedIds);
  return config.cleanup.steps.every(step => checked.has(step.id));
}

export function removeSavedResourceBinding(resources = {}, key) {
  const next = { ...resources };
  delete next[key];
  return next;
}

export function buildCompletionTransition(progress, taskId, decision, nextTaskId) {
  return {
    ...progress,
    currentTaskId: nextTaskId || taskId,
    completedTaskIds: [...new Set([...(progress.completedTaskIds || []), taskId])],
    resourceDecisions: { ...(progress.resourceDecisions || {}), [taskId]: decision }
  };
}

export function canNavigateAfterSave(saveResult) {
  return saveResult?.success === true;
}
