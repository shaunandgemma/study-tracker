export const AUTHOR_MODE_STATUSES = Object.freeze(['available', 'not_applicable']);
export const AUTHOR_VERIFICATION_MODES = Object.freeze(['console', 'cli', 'either']);
export const AUTHOR_RESOURCE_TYPES = Object.freeze(['network', 'compute', 'storage', 'database', 'identity', 'security', 'monitoring', 'other']);

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function slugify(value) {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);
}

function uniqueId(base, existing) {
  const safeBase = base || 'item';
  if (!existing.has(safeBase)) return safeBase;
  let suffix = 2;
  while (existing.has(`${safeBase}-${suffix}`)) suffix += 1;
  return `${safeBase}-${suffix}`;
}

function numbered(items, field = 'stepNumber') {
  return items.map((item, index) => ({ ...item, [field]: index + 1 }));
}

function updateTask(draft, taskId, updater) {
  if (!(draft.tasks || []).some(task => task.id === taskId)) return { success: false, error: 'The task could not be found.' };
  return { success: true, draft: { ...draft, tasks: draft.tasks.map(task => task.id === taskId ? updater(task) : task) } };
}

export function isOfficialAwsDocumentationUrl(value) {
  try {
    const url = new URL(clean(value));
    return url.protocol === 'https:' && (url.hostname === 'docs.aws.amazon.com' || url.hostname === 'aws.amazon.com' || url.hostname.endsWith('.aws.amazon.com'));
  } catch {
    return false;
  }
}

export function isOfficialTerraformDocumentationUrl(value) {
  try {
    const url = new URL(clean(value));
    return url.protocol === 'https:'
      && url.hostname === 'developer.hashicorp.com'
      && (url.pathname === '/terraform' || url.pathname.startsWith('/terraform/'));
  } catch {
    return false;
  }
}

export function isApprovedAuthorDocumentationUrl(value) {
  return isOfficialAwsDocumentationUrl(value) || isOfficialTerraformDocumentationUrl(value);
}

function documentationPublisher(value) {
  return isOfficialTerraformDocumentationUrl(value) ? 'HashiCorp' : 'AWS';
}

export function addAuthorSource(draft, input = {}) {
  const title = clean(input.title);
  const url = clean(input.url);
  if (!title) return { success: false, error: 'Enter the official document title.' };
  if (!isApprovedAuthorDocumentationUrl(url)) return { success: false, error: 'Use an approved official AWS or HashiCorp Terraform documentation link.' };
  const sources = draft.sources || [];
  const id = uniqueId(`source-${slugify(title)}`, new Set(sources.map(source => source.id)));
  const source = { id, title, url, publisher: documentationPublisher(url), sourceType: 'official_documentation', purpose: clean(input.purpose), taskIds: [] };
  return { success: true, source, draft: { ...draft, sources: [...sources, source] } };
}

export function updateAuthorSource(draft, sourceId, changes = {}) {
  const current = (draft.sources || []).find(source => source.id === sourceId);
  if (!current) return { success: false, error: 'The documentation source could not be found.' };
  if (changes.url !== undefined && !isApprovedAuthorDocumentationUrl(changes.url)) return { success: false, error: 'Use an approved official AWS or HashiCorp Terraform documentation link.' };
  const nextUrl = changes.url === undefined ? current.url : changes.url;
  const source = { ...current, ...changes, id: current.id, publisher: documentationPublisher(nextUrl), sourceType: 'official_documentation', taskIds: current.taskIds || [] };
  return { success: true, draft: { ...draft, sources: draft.sources.map(item => item.id === sourceId ? source : item) } };
}

export function setAuthorSourceTaskLink(draft, sourceId, taskId, linked) {
  if (!(draft.sources || []).some(source => source.id === sourceId)) return { success: false, error: 'The documentation source could not be found.' };
  if (!(draft.tasks || []).some(task => task.id === taskId)) return { success: false, error: 'The task could not be found.' };
  const sources = draft.sources.map(source => source.id === sourceId ? { ...source, taskIds: linked ? [...new Set([...(source.taskIds || []), taskId])] : (source.taskIds || []).filter(id => id !== taskId) } : source);
  const tasks = draft.tasks.map(task => task.id === taskId ? { ...task, sourceIds: linked ? [...new Set([...(task.sourceIds || []), sourceId])] : (task.sourceIds || []).filter(id => id !== sourceId) } : task);
  return { success: true, draft: { ...draft, sources, tasks } };
}

export function removeAuthorSource(draft, sourceId) {
  const source = (draft.sources || []).find(item => item.id === sourceId);
  if (!source) return { success: false, error: 'The documentation source could not be found.' };
  if ((source.taskIds || []).length) return { success: false, error: 'Unlink this source from every task before removing it.' };
  return { success: true, draft: { ...draft, sources: draft.sources.filter(item => item.id !== sourceId) } };
}

export function setAuthorTaskMode(draft, taskId, mode, status, reason = '') {
  if (!['console', 'cli'].includes(mode) || !AUTHOR_MODE_STATUSES.includes(status)) return { success: false, error: 'Choose a supported instruction mode and status.' };
  return updateTask(draft, taskId, task => ({ ...task, modeAvailability: { ...task.modeAvailability, [mode]: { status, reason: status === 'available' ? '' : clean(reason) } } }));
}

export function addAuthorInstructionStep(draft, taskId, mode, input = {}) {
  if (!['console', 'cli'].includes(mode)) return { success: false, error: 'Choose Console or CLI instructions.' };
  const field = mode === 'console' ? 'consoleSteps' : 'cliSteps';
  let added;
  const result = updateTask(draft, taskId, task => {
    const steps = task[field] || [];
    const id = uniqueId(`${taskId}-${mode}-step-${steps.length + 1}-${slugify(input.title || input.command)}`, new Set(steps.map(step => step.id)));
    added = mode === 'console'
      ? {
          id,
          stepNumber: steps.length + 1,
          number: steps.length + 1,
          title: clean(input.title),
          instruction: clean(input.instruction),
          instructions: clean(input.instruction)
            ? [{ id: `${id}-instruction-1`, text: clean(input.instruction), detail: clean(input.detail) }]
            : [],
          jsonBlocks: [],
          commands: [],
          expectedResult: clean(input.expectedResult),
          warning: clean(input.warning)
        }
      : {
          id,
          stepNumber: steps.length + 1,
          number: steps.length + 1,
          command: clean(input.command),
          explanation: clean(input.explanation),
          expectedResult: clean(input.expectedResult),
          instructions: [],
          commands: clean(input.command)
            ? [{ id: `${id}-command-1`, text: clean(input.command), explanation: clean(input.explanation), expectedOutput: clean(input.expectedResult) }]
            : []
        };
    return { ...task, [field]: [...steps, added] };
  });
  return result.success ? { ...result, step: added } : result;
}

export function updateAuthorInstructionStep(draft, taskId, mode, stepId, changes = {}) {
  const field = mode === 'console' ? 'consoleSteps' : mode === 'cli' ? 'cliSteps' : '';
  if (!field) return { success: false, error: 'Choose Console or CLI instructions.' };
  return updateTask(draft, taskId, task => {
    if (!(task[field] || []).some(step => step.id === stepId)) return task;
    return {
      ...task,
      [field]: task[field].map(step => {
        if (step.id !== stepId) return step;
        const updated = { ...step, ...changes, id: step.id, stepNumber: step.stepNumber, number: step.stepNumber };
        if (mode === 'cli' && ['command', 'explanation', 'expectedResult'].some(key => changes[key] !== undefined)) {
          const command = {
            ...(updated.commands?.[0] || {}),
            id: updated.commands?.[0]?.id || `${step.id}-command-1`,
            text: clean(updated.command),
            explanation: clean(updated.explanation),
            expectedOutput: clean(updated.expectedResult)
          };
          updated.commands = clean(updated.command) ? [command] : [];
        }
        return updated;
      })
    };
  });
}

function updateConsoleInstructionItems(draft, taskId, stepId, updater) {
  return updateTask(draft, taskId, task => ({
    ...task,
    consoleSteps: (task.consoleSteps || []).map(step => {
      if (step.id !== stepId) return step;
      const instructions = updater(step.instructions || []);
      return {
        ...step,
        instructions,
        instruction: instructions.map(item => clean(item.text)).filter(Boolean).join('\n')
      };
    })
  }));
}

export function addAuthorInstructionItem(draft, taskId, stepId, input = {}) {
  let added;
  const result = updateConsoleInstructionItems(draft, taskId, stepId, items => {
    const id = uniqueId(`${stepId}-instruction-${items.length + 1}`, new Set(items.map(item => item.id)));
    added = { id, text: clean(input.text), detail: clean(input.detail) };
    return [...items, added];
  });
  return result.success ? { ...result, instruction: added } : result;
}

export function updateAuthorInstructionItem(draft, taskId, stepId, instructionId, changes = {}) {
  return updateConsoleInstructionItems(draft, taskId, stepId, items => items.map(item => item.id === instructionId
    ? { ...item, ...changes, id: item.id }
    : item));
}

export function moveAuthorInstructionItem(draft, taskId, stepId, instructionId, direction) {
  if (![-1, 1].includes(direction)) return { success: false, error: 'Choose a valid instruction direction.' };
  return updateConsoleInstructionItems(draft, taskId, stepId, items => {
    const index = items.findIndex(item => item.id === instructionId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= items.length) return items;
    const reordered = [...items];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    return reordered;
  });
}

export function removeAuthorInstructionItem(draft, taskId, stepId, instructionId) {
  return updateConsoleInstructionItems(draft, taskId, stepId, items => items.filter(item => item.id !== instructionId));
}

function parseJsonContainer(value) {
  try {
    const parsed = JSON.parse(clean(value));
    return parsed && typeof parsed === 'object' ? { success: true, value: parsed } : { success: false };
  } catch {
    return { success: false };
  }
}

function updateConsoleJsonBlocks(draft, taskId, stepId, updater) {
  return updateTask(draft, taskId, task => ({
    ...task,
    consoleSteps: (task.consoleSteps || []).map(step => step.id === stepId
      ? { ...step, jsonBlocks: updater(step.jsonBlocks || []) }
      : step)
  }));
}

export function addAuthorJsonBlock(draft, taskId, stepId, input = {}) {
  const title = clean(input.title);
  const content = clean(input.content);
  if (!title) return { success: false, error: 'Enter a title for the JSON block.' };
  if (!parseJsonContainer(content).success) return { success: false, error: 'Enter valid JSON containing an object or array.' };
  let added;
  const result = updateConsoleJsonBlocks(draft, taskId, stepId, blocks => {
    const id = uniqueId(`${stepId}-json-${blocks.length + 1}-${slugify(title)}`, new Set(blocks.map(block => block.id)));
    added = { id, title, content, language: 'json', sourceIds: [...new Set(input.sourceIds || [])] };
    return [...blocks, added];
  });
  return result.success ? { ...result, jsonBlock: added } : result;
}

export function updateAuthorJsonBlock(draft, taskId, stepId, blockId, changes = {}) {
  return updateConsoleJsonBlocks(draft, taskId, stepId, blocks => blocks.map(block => block.id === blockId
    ? (() => {
      const content = changes.content === undefined ? block.content : changes.content;
      return { ...block, ...changes, id: block.id, language: parseJsonContainer(content).success ? 'json' : 'text', title: changes.title === undefined ? block.title : clean(changes.title), content };
    })()
    : block));
}

export function removeAuthorJsonBlock(draft, taskId, stepId, blockId) {
  return updateConsoleJsonBlocks(draft, taskId, stepId, blocks => blocks.filter(block => block.id !== blockId));
}

export function removeAuthorInstructionStep(draft, taskId, mode, stepId) {
  const field = mode === 'console' ? 'consoleSteps' : mode === 'cli' ? 'cliSteps' : '';
  if (!field) return { success: false, error: 'Choose Console or CLI instructions.' };
  return updateTask(draft, taskId, task => ({
    ...task,
    [field]: numbered((task[field] || []).filter(step => step.id !== stepId)).map(step => ({ ...step, number: step.stepNumber }))
  }));
}

export function addAuthorResource(draft, taskId, input = {}) {
  const task = (draft.tasks || []).find(item => item.id === taskId);
  if (!task) return { success: false, error: 'The task could not be found.' };
  const label = clean(input.label);
  if (!label) return { success: false, error: 'Enter a resource name.' };
  const schema = draft.resources?.schema || [];
  const key = uniqueId(`resource-${slugify(label)}`, new Set(schema.map(resource => resource.key)));
  const resource = { key, label, sourceTaskId: taskId, type: AUTHOR_RESOURCE_TYPES.includes(input.type) ? input.type : 'other', description: clean(input.description), required: input.required !== false };
  return { success: true, resource, draft: { ...draft, tasks: draft.tasks.map(item => item.id === taskId ? { ...item, createdResourceKeys: [...new Set([...(item.createdResourceKeys || []), key])] } : item), resources: { ...draft.resources, schema: [...schema, resource] } } };
}

export function updateAuthorResource(draft, resourceKey, changes = {}) {
  const schema = draft.resources?.schema || [];
  if (!schema.some(resource => resource.key === resourceKey)) return { success: false, error: 'The resource could not be found.' };
  const resources = { ...draft.resources, schema: schema.map(resource => resource.key === resourceKey ? { ...resource, ...changes, key: resource.key, sourceTaskId: resource.sourceTaskId } : resource) };
  return { success: true, draft: { ...draft, resources } };
}

export function removeAuthorResource(draft, resourceKey) {
  if (!(draft.resources?.schema || []).some(resource => resource.key === resourceKey)) return { success: false, error: 'The resource could not be found.' };
  const usedByCleanup = [...(draft.tasks || []).flatMap(task => task.cleanup || []), ...(draft.cleanup?.steps || [])].some(step => (step.resourceKeys || []).includes(resourceKey));
  if (usedByCleanup) return { success: false, error: 'Remove this resource from cleanup instructions before removing it.' };
  return { success: true, draft: { ...draft, tasks: draft.tasks.map(task => ({ ...task, createdResourceKeys: (task.createdResourceKeys || []).filter(key => key !== resourceKey) })), resources: { ...draft.resources, schema: draft.resources.schema.filter(resource => resource.key !== resourceKey) } } };
}

export function addAuthorVerification(draft, taskId, input = {}) {
  let added;
  const result = updateTask(draft, taskId, task => {
    const checks = task.verification || [];
    added = { id: uniqueId(`verify-${checks.length + 1}-${slugify(input.title)}`, new Set(checks.map(check => check.id))), title: clean(input.title), instruction: clean(input.instruction), expectedResult: clean(input.expectedResult), mode: AUTHOR_VERIFICATION_MODES.includes(input.mode) ? input.mode : 'either' };
    return { ...task, verification: [...checks, added] };
  });
  return result.success ? { ...result, verification: added } : result;
}

export function updateAuthorVerification(draft, taskId, verificationId, changes = {}) {
  return updateTask(draft, taskId, task => ({ ...task, verification: (task.verification || []).map(check => check.id === verificationId ? { ...check, ...changes, id: check.id } : check) }));
}

export function removeAuthorVerification(draft, taskId, verificationId) {
  return updateTask(draft, taskId, task => ({ ...task, verification: (task.verification || []).filter(check => check.id !== verificationId) }));
}

export function addAuthorCleanupStep(draft, taskId, input = {}) {
  if (taskId) {
    let added;
    const result = updateTask(draft, taskId, task => {
      const steps = task.cleanup || [];
      added = { id: uniqueId(`${taskId}-cleanup-${steps.length + 1}-${slugify(input.title)}`, new Set(steps.map(step => step.id))), stepNumber: steps.length + 1, title: clean(input.title), instruction: clean(input.instruction), description: clean(input.instruction), verification: clean(input.verification), resourceKeys: [...new Set(input.resourceKeys || [])] };
      return { ...task, cleanup: [...steps, added] };
    });
    return result.success ? { ...result, step: added } : result;
  }
  const steps = draft.cleanup?.steps || [];
  const step = { id: uniqueId(`programme-cleanup-${steps.length + 1}-${slugify(input.title)}`, new Set(steps.map(item => item.id))), stepNumber: steps.length + 1, title: clean(input.title), instruction: clean(input.instruction), description: clean(input.instruction), verification: clean(input.verification), resourceKeys: [...new Set(input.resourceKeys || [])] };
  return { success: true, step, draft: { ...draft, cleanup: { ...draft.cleanup, manualOnly: true, steps: [...steps, step] } } };
}

export function updateAuthorCleanupStep(draft, taskId, stepId, changes = {}) {
  const aligned = changes.instruction !== undefined ? { ...changes, description: clean(changes.instruction) } : changes;
  if (taskId) return updateTask(draft, taskId, task => ({ ...task, cleanup: (task.cleanup || []).map(step => step.id === stepId ? { ...step, ...aligned, id: step.id, stepNumber: step.stepNumber } : step) }));
  return { success: true, draft: { ...draft, cleanup: { ...draft.cleanup, manualOnly: true, steps: (draft.cleanup?.steps || []).map(step => step.id === stepId ? { ...step, ...aligned, id: step.id, stepNumber: step.stepNumber } : step) } } };
}

export function removeAuthorCleanupStep(draft, taskId, stepId) {
  if (taskId) return updateTask(draft, taskId, task => ({ ...task, cleanup: numbered((task.cleanup || []).filter(step => step.id !== stepId)) }));
  return { success: true, draft: { ...draft, cleanup: { ...draft.cleanup, manualOnly: true, steps: numbered((draft.cleanup?.steps || []).filter(step => step.id !== stepId)) } } };
}

function containsCredential(command) {
  return /AKIA[0-9A-Z]{12,}|aws_secret_access_key\s*=|aws_session_token\s*=|-----BEGIN [A-Z ]*PRIVATE KEY-----/i.test(command);
}

export function isDeferredAuthorContent(value) {
  const text = clean(value);
  if (!text) return false;
  return /\b(?:catalogue\s+(?:scope|only)|placeholder\s+(?:content|instruction|step)|coming\s+soon|tbd|todo)\b/i.test(text)
    || /\bdefer(?:red|ring)?\b.{0,100}\b(?:console|cli|instruction|step|command|content)\b/i.test(text)
    || /\b(?:console|cli|instruction|step|command|content)s?\b.{0,80}\b(?:will|shall)\s+be\s+(?:added|written|provided|completed)\s+later\b/i.test(text)
    || /\bto\s+be\s+(?:added|written|provided|completed)\s+later\b/i.test(text);
}

export function validateAuthorContent(draft) {
  const errors = [];
  const warnings = [];
  const tasks = draft.tasks || [];
  const sources = draft.sources || [];
  const sourceIds = new Set(sources.map(source => source.id));
  const taskIds = new Set(tasks.map(task => task.id));
  const resources = draft.resources?.schema || [];
  const resourceKeys = new Set(resources.map(resource => resource.key));

  if (!sources.length) errors.push({ section: 'sources', message: 'Add at least one approved official documentation source.' });
  sources.forEach(source => {
    if (!clean(source.title)) errors.push({ section: 'sources', id: source.id, message: 'Every documentation source needs a title.' });
    if (!isApprovedAuthorDocumentationUrl(source.url)) errors.push({ section: 'sources', id: source.id, message: `${source.title || 'A source'} must use an approved official AWS or HashiCorp Terraform link.` });
    if (!clean(source.purpose)) errors.push({ section: 'sources', id: source.id, message: `${source.title || 'A source'} needs a short reason for using it.` });
    if (!(source.taskIds || []).length) warnings.push({ section: 'sources', id: source.id, message: `${source.title || 'A source'} is not linked to a task.` });
    (source.taskIds || []).forEach(taskId => {
      if (!taskIds.has(taskId)) errors.push({ section: 'sources', id: source.id, message: `${source.title || 'A source'} links to an unknown task.` });
      else if (!(tasks.find(task => task.id === taskId)?.sourceIds || []).includes(source.id)) errors.push({ section: 'sources', id: source.id, message: `${source.title || 'A source'} has a one-sided task link.` });
    });
  });

  tasks.forEach(task => {
    if (!(task.sourceIds || []).length) errors.push({ section: 'sources', id: task.id, message: `${task.title || 'A task'} needs an approved official documentation source.` });
    (task.sourceIds || []).forEach(sourceId => {
      if (!sourceIds.has(sourceId)) errors.push({ section: 'sources', id: task.id, message: `${task.title || 'A task'} references an unknown source.` });
      else if (!(sources.find(source => source.id === sourceId)?.taskIds || []).includes(task.id)) errors.push({ section: 'sources', id: task.id, message: `${task.title || 'A task'} has a one-sided source link.` });
    });

    const modes = task.modeAvailability || {};
    const availableModes = ['console', 'cli'].filter(mode => modes[mode]?.status === 'available');
    if (!availableModes.length) errors.push({ section: 'instructions', id: task.id, message: `${task.title || 'A task'} needs a Console or CLI learning path.` });
    ['console', 'cli'].forEach(mode => {
      const availability = modes[mode] || {};
      if (!AUTHOR_MODE_STATUSES.includes(availability.status)) errors.push({ section: 'instructions', id: task.id, message: `${task.title || 'A task'} has an invalid ${mode} status.` });
      if (availability.status === 'not_applicable' && !clean(availability.reason)) errors.push({ section: 'instructions', id: task.id, message: `Explain why ${mode} is not used for ${task.title || 'this task'}.` });
      const steps = task[mode === 'console' ? 'consoleSteps' : 'cliSteps'] || [];
      if (availability.status === 'available' && !steps.length) errors.push({ section: 'instructions', id: task.id, message: `${task.title || 'A task'} needs at least one ${mode} step.` });
      steps.forEach((step, index) => {
        if (step.stepNumber !== index + 1) errors.push({ section: 'instructions', id: task.id, message: `${task.title || 'A task'} has incorrect ${mode} step numbering.` });
        if (mode === 'console') {
          const instructions = Array.isArray(step.instructions) ? step.instructions : [];
          if (!clean(step.title) || !clean(step.expectedResult) || !instructions.length) errors.push({ section: 'instructions', id: task.id, message: `Complete the title, expected result and at least one checkbox instruction in ${task.title || 'the task'} Console step ${index + 1}.` });
          if ([step.title, step.expectedResult, ...instructions.map(item => item.text)].some(isDeferredAuthorContent)) errors.push({ section: 'instructions', id: task.id, message: `${task.title || 'A task'} Console step ${index + 1} contains placeholder or deferred content.` });
          if (new Set(instructions.map(item => item.id)).size !== instructions.length || instructions.some(item => !clean(item.id))) errors.push({ section: 'instructions', id: task.id, message: `${task.title || 'A task'} Console step ${index + 1} needs unique stable checkbox IDs.` });
          instructions.forEach((item, itemIndex) => {
            if (!clean(item.text)) errors.push({ section: 'instructions', id: task.id, message: `Checkbox instruction ${itemIndex + 1} in ${task.title || 'the task'} Console step ${index + 1} needs exact learner text.` });
          });
          const jsonBlocks = Array.isArray(step.jsonBlocks) ? step.jsonBlocks : [];
          if (new Set(jsonBlocks.map(block => block.id)).size !== jsonBlocks.length || jsonBlocks.some(block => !clean(block.id))) errors.push({ section: 'instructions', id: task.id, message: `${task.title || 'A task'} Console step ${index + 1} needs unique stable JSON block IDs.` });
          jsonBlocks.forEach((block, blockIndex) => {
            if (!clean(block.title) || !clean(block.content)) errors.push({ section: 'instructions', id: task.id, message: `JSON block ${blockIndex + 1} in ${task.title || 'the task'} Console step ${index + 1} needs a title and JSON content.` });
            else if (block.language !== 'text' && !parseJsonContainer(block.content).success) errors.push({ section: 'instructions', id: task.id, message: `JSON block ${blockIndex + 1} in ${task.title || 'the task'} Console step ${index + 1} is not valid JSON.` });
            else if (block.language === 'text') warnings.push({ section: 'instructions', id: task.id, message: `${block.title || `Reference block ${blockIndex + 1}`} in ${task.title || 'the task'} is editable JSON-shaped guidance rather than strict JSON; review it before learner use.` });
            if (containsCredential(block.content)) errors.push({ section: 'safety', id: task.id, message: `${task.title || 'A task'} contains credential-like text in a JSON block.` });
          });
        }
        if (mode === 'cli' && (!clean(step.command) || !clean(step.explanation) || !clean(step.expectedResult))) errors.push({ section: 'instructions', id: task.id, message: `Complete every field in ${task.title || 'the task'} CLI step ${index + 1}.` });
        if (mode === 'cli' && [step.command, step.explanation, step.expectedResult].some(isDeferredAuthorContent)) errors.push({ section: 'instructions', id: task.id, message: `${task.title || 'A task'} CLI step ${index + 1} contains placeholder or deferred content.` });
        if (mode === 'cli' && containsCredential(step.command)) errors.push({ section: 'safety', id: task.id, message: `${task.title || 'A task'} contains credential-like text in a CLI command.` });
        if (mode === 'cli' && /\s(&&|;|\|)\s/.test(step.command)) warnings.push({ section: 'safety', id: task.id, message: `${task.title || 'A task'} has a chained CLI command; split it into easier steps.` });
      });
    });

    if (!(task.verification || []).length) errors.push({ section: 'verification', id: task.id, message: `${task.title || 'A task'} needs at least one verification check.` });
    (task.verification || []).forEach(check => {
      if (!clean(check.title) || !clean(check.instruction) || !clean(check.expectedResult)) errors.push({ section: 'verification', id: task.id, message: `Complete every verification field for ${task.title || 'a task'}.` });
      if (!AUTHOR_VERIFICATION_MODES.includes(check.mode)) errors.push({ section: 'verification', id: task.id, message: `${task.title || 'A task'} has an invalid verification mode.` });
    });

    (task.createdResourceKeys || []).forEach(key => {
      const resource = resources.find(item => item.key === key);
      if (!resource) errors.push({ section: 'resources', id: task.id, message: `${task.title || 'A task'} references an unknown resource.` });
      else if (resource.sourceTaskId !== task.id) errors.push({ section: 'resources', id: task.id, message: `${resource.label || key} belongs to a different task.` });
    });
  });

  resources.forEach(resource => {
    const task = tasks.find(item => item.id === resource.sourceTaskId);
    if (!clean(resource.label) || !clean(resource.description)) errors.push({ section: 'resources', id: resource.key, message: `${resource.label || 'A resource'} needs a name and capture explanation.` });
    if (!task || !(task.createdResourceKeys || []).includes(resource.key)) errors.push({ section: 'resources', id: resource.key, message: `${resource.label || 'A resource'} is not connected to its creating task.` });
  });

  const allCleanup = [...tasks.flatMap(task => task.cleanup || []), ...(draft.cleanup?.steps || [])];
  allCleanup.forEach(step => {
    if (!clean(step.title) || !clean(step.instruction) || !clean(step.verification)) errors.push({ section: 'cleanup', id: step.id, message: 'Every cleanup step needs a title, instruction and verification.' });
    (step.resourceKeys || []).forEach(key => { if (!resourceKeys.has(key)) errors.push({ section: 'cleanup', id: step.id, message: 'A cleanup step references an unknown resource.' }); });
  });
  resources.forEach(resource => {
    if (!allCleanup.some(step => (step.resourceKeys || []).includes(resource.key))) errors.push({ section: 'cleanup', id: resource.key, message: `${resource.label || 'A resource'} needs a cleanup step.` });
  });
  if (resources.length && !(draft.cleanup?.steps || []).length) errors.push({ section: 'cleanup', message: 'Add a final programme cleanup check.' });
  if (draft.cleanup?.manualOnly !== true) errors.push({ section: 'cleanup', message: 'Cleanup must remain manual in Author Version 1.' });
  if (resources.length && !clean(draft.warnings?.cost)) warnings.push({ section: 'warnings', message: 'Add a clear cost warning for learners.' });
  if (!clean(draft.warnings?.credentials)) errors.push({ section: 'warnings', message: 'Add a credential safety warning.' });
  if (!clean(draft.warnings?.safety)) errors.push({ section: 'warnings', message: 'Add a cleanup safety warning.' });

  return { valid: errors.length === 0, errors, warnings };
}
