import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fingerprintJson } from './authorAssistantStage84D.mjs';
import {
  buildAuthorDraftContent,
  buildSimpleHandoff,
  findCleanupCoverageFindings,
  formatSimplePreview,
  SIMPLE_AUTHOR_ASSISTANT_MODE
} from './authorAssistantSimple.mjs';

export const OFFLINE_MANUSCRIPT_FILENAME = 'offline-follow-along-manuscript.json';
export const OFFLINE_PREVIEW_FILENAME = 'offline-follow-along-preview.md';

const PROGRAMME_DIFFICULTIES = new Set(['Beginner', 'Beginner to Intermediate', 'Intermediate', 'Intermediate to Advanced', 'Advanced']);
const TASK_DIFFICULTIES = new Set(['Easy', 'Medium', 'Hard']);
const CREDENTIAL_PATTERN = /AKIA[0-9A-Z]{12,}|aws_secret_access_key\s*[=:]|aws_session_token\s*[=:]|-----BEGIN [A-Z ]*PRIVATE KEY-----|github_pat_[A-Za-z0-9_]+/i;
const DESTRUCTIVE_PATH_PATTERN = /(?:\brm\s+-rf\s+(?:\/|~|\$HOME)(?:\s|$)|\bRemove-Item\s+(?:-LiteralPath\s+|-Path\s+)?(?:\$HOME|~)(?:\s|$)[^\r\n]*-Recurse)/i;

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function list(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  if (typeof value === 'string') return clean(value);
  return clean(value?.text || value?.instruction || value?.content);
}

function slugify(value, maximum = 70) {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, maximum);
}

function officialSource(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

function normalizedUrl(value) {
  const url = new URL(clean(value));
  url.hash = '';
  return url.toString().replace(/\/$/, '');
}

function publisherFor(url, supplied) {
  if (clean(supplied)) return clean(supplied);
  const host = new URL(url).hostname;
  if (host.endsWith('amazon.com')) return 'AWS';
  if (host === 'developer.hashicorp.com') return 'HashiCorp';
  if (host === 'cloud.google.com') return 'Google Cloud';
  if (host === 'kubernetes.io') return 'Kubernetes';
  if (host === 'learn.microsoft.com') return 'Microsoft';
  return host;
}

function regionScope(region) {
  const value = clean(region).toLowerCase();
  if (value === 'global') return 'global';
  if (value.includes('global') && value !== 'global') return 'mixed';
  return 'regional';
}

function difficulty(value) {
  const supplied = clean(value);
  return PROGRAMME_DIFFICULTIES.has(supplied) ? supplied : 'Beginner';
}

function taskDifficulty(value) {
  const supplied = clean(value);
  return TASK_DIFFICULTIES.has(supplied) ? supplied : 'Easy';
}

function examIdForWorkspace(value) {
  const workspace = clean(value).toLowerCase();
  if (workspace.includes('terraform')) return 'terraform-associate-004';
  if (workspace.includes('security+') || workspace.includes('security plus')) return 'comptia-sec-plus';
  if (workspace.includes('saa-c03') || workspace.includes('solutions architect')) return 'aws-saa-c03';
  return '';
}

function sourceUrlsFor(sourceIds, sourceById, fallback = []) {
  const ids = list(sourceIds);
  const urls = ids.map(id => sourceById.get(clean(id))?.url).filter(Boolean);
  return [...new Set(urls.length ? urls : fallback)];
}

function normalizeBlocks(step, sourceById, fallbackSourceUrls) {
  return [...list(step?.editableBlocks), ...list(step?.jsonBlocks), ...list(step?.codeBlocks)].map((block, index) => ({
    title: clean(block?.title || block?.filename) || `Editable block ${index + 1}`,
    content: clean(block?.content || block?.text),
    language: clean(block?.language) || 'text',
    sourceUrls: sourceUrlsFor(block?.sourceIds, sourceById, fallbackSourceUrls)
  }));
}

function normalizeConsoleSteps(task, sourceById, taskSourceUrls) {
  const steps = list(task.consoleSteps).length ? list(task.consoleSteps) : list(task.graphicalSteps);
  return steps.map((step, index) => {
    const sourceUrls = sourceUrlsFor(step?.sourceIds, sourceById, taskSourceUrls);
    return {
      title: clean(step?.title) || `Console step ${index + 1}`,
      instructions: list(step?.instructions).map(text).filter(Boolean),
      jsonBlocks: normalizeBlocks(step, sourceById, sourceUrls),
      expectedResult: clean(step?.expectedResult),
      warning: clean(step?.warning),
      sourceUrls
    };
  });
}

function normalizeCliSteps(task, sourceById, taskSourceUrls) {
  const supplied = [...list(task.cliSteps), ...list(task.terraformSteps), ...list(task.commandSteps)];
  return supplied.flatMap((step, stepIndex) => {
    const commands = clean(step?.command) ? [clean(step.command)] : list(step?.commands).map(text).filter(Boolean);
    const sourceUrls = sourceUrlsFor(step?.sourceIds, sourceById, taskSourceUrls);
    return commands.map((command, commandIndex) => ({
      command,
      explanation: clean(step?.explanation || step?.why) || `Run command ${commandIndex + 1} for ${clean(step?.title) || `CLI step ${stepIndex + 1}`}.`,
      expectedResult: clean(step?.expectedResult),
      warning: clean(step?.warning),
      sourceUrls
    }));
  });
}

function verificationMode(value) {
  const mode = clean(value).toLowerCase();
  if (['console', 'graphical', 'browser'].includes(mode)) return 'console';
  if (['cli', 'terraform', 'terminal'].includes(mode)) return 'cli';
  return 'either';
}

function requireValue(condition, message, errors) {
  if (!condition) errors.push(message);
}

function warningText(value) {
  return clean(value?.text || value);
}

function commandBlockExpectedResult(task) {
  return list(task?.expectedResults).map(text).filter(Boolean).join(' ') || 'The command completes with the expected documented result.';
}

function externalResourceTarget(resource) {
  const exactName = clean(resource?.exactName || resource?.resourceNameOrPlaceholder || resource?.name);
  if (exactName) return exactName;
  const generatedValue = clean(resource?.generatedValue || resource?.nameRule);
  if (!generatedValue) return '';
  return `[${generatedValue.replace(/[^A-Za-z0-9]+/g, '_').toUpperCase()}]`;
}

function alternateCleanupMatch(resource, cleanupSteps) {
  const target = externalResourceTarget(resource);
  const resourceText = [resource?.id, resource?.label, target, resource?.generatedValue].map(clean).join(' ').toLowerCase();
  if (/ephemeral/.test(resourceText)) {
    const destroyStep = cleanupSteps.find(step => /terraform destroy/i.test(`${clean(step?.resource)} ${clean(step?.action)}`));
    if (destroyStep) return destroyStep;
  }
  const targetText = target.toLowerCase();
  const direct = cleanupSteps.find(step => {
    const cleanupTarget = clean(step?.resource).toLowerCase();
    return cleanupTarget.length >= 4 && targetText.length >= 4
      && (cleanupTarget.includes(targetText) || targetText.includes(cleanupTarget));
  });
  if (direct) return direct;
  const ignored = new Set(['resource', 'temporary', 'training', 'terraform', 'providers', 'provider', 'created', 'this', 'only', 'with', 'from', 'then', 'after']);
  const terms = new Set(resourceText.split(/[^a-z0-9]+/).filter(term => term.length > 2 && !ignored.has(term)));
  return cleanupSteps
    .map(step => {
      const candidate = `${clean(step?.resource)} ${clean(step?.action)}`.toLowerCase();
      const score = [...terms].filter(term => candidate.includes(term)).length;
      return { step, score };
    })
    .sort((left, right) => right.score - left.score)[0]?.step || cleanupSteps.at(-1);
}

function dependencyDepth(resourceId, resourceById, seen = new Set()) {
  if (seen.has(resourceId)) return 0;
  const nextSeen = new Set(seen).add(resourceId);
  const dependencies = list(resourceById.get(resourceId)?.dependsOn).map(clean).filter(Boolean);
  return dependencies.length
    ? 1 + Math.max(...dependencies.map(id => dependencyDepth(id, resourceById, nextSeen)))
    : 0;
}

function canonicalizeAlternatePortableFormat(manuscript) {
  const tasks = list(manuscript.tasks);
  if (clean(manuscript?.manuscriptVersion) !== '1.0' || !tasks.some(task => list(task?.browserSteps).length || list(task?.cliBlocks).length)) return null;
  const resources = list(manuscript.resources);
  const cleanupSteps = list(manuscript.programmeCleanup);
  const taskById = new Map(tasks.map(task => [clean(task.id), task]));
  const resourceById = new Map(resources.map(resource => [clean(resource.id), resource]));
  const cleanupByResourceId = new Map(resources.map(resource => [clean(resource.id), alternateCleanupMatch(resource, cleanupSteps)]));
  const orderedResources = [...resources].sort((left, right) => {
    const depthDifference = dependencyDepth(clean(right.id), resourceById) - dependencyDepth(clean(left.id), resourceById);
    if (depthDifference) return depthDifference;
    return Number(cleanupByResourceId.get(clean(left.id))?.sequence || 999) - Number(cleanupByResourceId.get(clean(right.id))?.sequence || 999);
  });
  return {
    ...manuscript,
    tasks: tasks.map(task => {
      const taskSourceIds = list(task.sourceIds).map(clean).filter(Boolean);
      const expectedResult = list(task.expectedResults).map(text).filter(Boolean).join(' ')
        || 'The documented task result is visible.';
      const warning = list(task.warnings).map(warningText).filter(Boolean).join(' ');
      return {
        id: clean(task.id),
        phaseId: clean(task.phaseId),
        title: clean(task.title),
        feature: clean(task.feature),
        goal: clean(task.goal),
        whyItMatters: clean(task.whyItMatters),
        difficulty: clean(task.difficulty),
        prerequisites: list(task.prerequisites).map(clean).filter(Boolean),
        sourceIds: taskSourceIds,
        createdResourceIds: resources.filter(resource => clean(resource.createdByTaskId) === clean(task.id)).map(resource => clean(resource.id)),
        consoleSteps: [{
          title: clean(task.title),
          instructions: list(task.browserSteps).map(step => text(step?.instruction || step)).filter(Boolean),
          editableBlocks: list(task.editableBlocks).map(block => ({
            title: clean(block?.title || block?.filename),
            filename: clean(block?.filename),
            language: clean(block?.language) || 'text',
            content: clean(block?.content),
            sourceIds: taskSourceIds
          })),
          expectedResult,
          warning,
          sourceIds: taskSourceIds
        }],
        cliSteps: list(task.cliBlocks).map(block => ({
          title: clean(block?.title) || clean(task.title),
          command: clean(block?.content),
          explanation: clean(block?.note || block?.title) || `Complete the ${clean(task.title)} command route.`,
          expectedResult,
          warning,
          sourceIds: taskSourceIds
        })),
        verification: list(task.verificationChecks).map((check, index) => ({
          id: clean(check?.id),
          title: clean(check?.title) || `Verification ${index + 1}`,
          instruction: clean(check?.instruction || check?.text),
          expectedResult: clean(check?.expectedResult || check?.text),
          route: clean(check?.route) || 'either'
        })),
        cleanup: []
      };
    }),
    phases: list(manuscript.phases).map(phase => ({
      ...phase,
      description: clean(phase?.description || phase?.goal) || clean(phase?.title)
    })),
    resources: resources.map(resource => ({
      id: clean(resource.id),
      label: clean(resource.label),
      type: clean(resource.type || resource.label) || 'other',
      exactName: clean(resource.exactName),
      generatedValue: clean(resource.generatedValue),
      createdByTaskId: clean(resource.createdByTaskId),
      dependsOn: list(resource.dependsOn).map(clean).filter(Boolean),
      sensitive: Boolean(resource.sensitive),
      chargeable: Boolean(resource.chargeable)
    })),
    programmeCleanup: orderedResources.map(resource => {
      const cleanup = cleanupByResourceId.get(clean(resource.id));
      const cleanupTask = taskById.get(clean(cleanup?.taskId));
      const target = externalResourceTarget(resource);
      const sourceIds = list(cleanupTask?.sourceIds).map(clean).filter(Boolean);
      const cliCommands = list(cleanupTask?.cliBlocks).map(block => clean(block?.content)).filter(Boolean);
      return {
        resourceId: clean(resource.id),
        title: `Remove ${clean(resource.label || resource.id)}`,
        consoleInstructions: [`${clean(cleanup?.action) || 'Remove only the documented training resource.'} Exact target: ${target}.`],
        cliCommands: cliCommands.length ? cliCommands : [`# Manually remove only ${target} using the documented cleanup route.`],
        verification: `${clean(cleanup?.verification) || 'The documented training resource is absent.'} Exact target checked: ${target}.`,
        sourceIds
      };
    }),
    warnings: {
      cost: warningText(manuscript.warnings?.cost),
      safety: warningText(manuscript.warnings?.safety),
      credentials: warningText(manuscript.warnings?.credentials),
      region: warningText(manuscript.warnings?.region)
    },
    qualityReport: {
      unresolvedIssues: [
        ...list(manuscript.qualityReport?.missingItems).map(text).filter(Boolean),
        ...list(manuscript.qualityReport?.uncertainItems).map(text).filter(Boolean)
      ]
    }
  };
}

function canonicalizeExternalFormat(manuscript) {
  const alternate = canonicalizeAlternatePortableFormat(manuscript);
  if (alternate) return alternate;
  if (clean(manuscript?.manuscriptVersion) === '1.0') return manuscript;
  if (clean(manuscript?.artifactType) !== 'offline-follow-along-manuscript' || clean(manuscript?.artifactVersion) !== '1.0') return manuscript;
  const sourceTaskIds = new Map(list(manuscript.sources).map(source => [clean(source.id), list(source.usedByTaskIds).map(clean).filter(Boolean)]));
  const taskById = new Map(list(manuscript.tasks).map(task => [clean(task.id), task]));
  const resourceInventory = list(manuscript.resourceInventory);
  const cleanupSteps = list(manuscript.cleanup?.steps);
  const cleanupByTaskId = new Map(cleanupSteps.map(step => [clean(step.taskId), step]));
  const region = Object.values(manuscript.programme?.regions || {}).map(text).filter(Boolean).join(' plus ') || 'global';
  return {
    manuscriptVersion: '1.0',
    programme: {
      title: clean(manuscript.programme?.name),
      suggestedProgrammeId: clean(manuscript.programme?.id),
      topic: clean(manuscript.programme?.name),
      examWorkspace: clean(manuscript.programme?.examWorkspace),
      learnerLevel: clean(manuscript.programme?.learnerLevel),
      outcome: clean(manuscript.programme?.requiredOutcome),
      region,
      resourcePrefix: clean(manuscript.programme?.trainingResourcePrefix),
      selfPaced: true,
      serviceName: clean(manuscript.programme?.name).replace(/ Follow Along$/i, ''),
      shortName: clean(manuscript.programme?.shortName) || 'HCP TF',
      description: list(manuscript.programme?.completionDefinition).map(text).filter(Boolean).join(' ')
    },
    sources: list(manuscript.sources).map(source => ({
      id: clean(source.id),
      title: clean(source.title),
      url: clean(source.url),
      publisher: clean(source.publisher),
      purpose: clean(source.purpose),
      taskIds: sourceTaskIds.get(clean(source.id)) || []
    })),
    phases: list(manuscript.phases).map(phase => ({
      id: clean(phase.id),
      title: clean(phase.title),
      description: clean(phase.goal),
      isOptional: false
    })),
    tasks: list(manuscript.tasks).map(task => ({
      id: clean(task.id),
      phaseId: clean(task.phaseId),
      title: clean(task.title),
      feature: clean(task.feature),
      goal: clean(task.goal),
      whyItMatters: clean(task.whyItMatters),
      difficulty: clean(task.difficulty),
      prerequisites: list(task.prerequisites).map(clean).filter(Boolean),
      sourceIds: list(task.sourceIds).map(clean).filter(Boolean),
      createdResourceIds: resourceInventory.filter(resource => clean(resource.createdByTaskId) === clean(task.id)).map(resource => clean(resource.id)),
      consoleSteps: [{
        title: clean(task.title),
        instructions: list(task.browserRoute).map(step => text(step?.instruction || step)).filter(Boolean),
        editableBlocks: list(task.codeBlocks).map(block => ({
          title: clean(block.title),
          filename: clean(block.filename),
          language: clean(block.language) || 'text',
          content: clean(block.content),
          sourceIds: list(task.sourceIds).map(clean).filter(Boolean)
        })),
        expectedResult: commandBlockExpectedResult(task),
        warning: list(task.warnings).map(text).filter(Boolean).join(' '),
        sourceIds: list(task.sourceIds).map(clean).filter(Boolean)
      }],
      cliSteps: list(task.cliRoute).map(block => ({
        title: clean(block.title),
        command: clean(block.content),
        explanation: clean(block.note) || clean(block.title),
        expectedResult: commandBlockExpectedResult(task),
        warning: '',
        sourceIds: list(task.sourceIds).map(clean).filter(Boolean)
      })),
      verification: list(task.verificationChecks).map(check => ({
        id: clean(check.id),
        title: clean(check.title) || clean(check.check),
        instruction: clean(check.instruction || check.check),
        expectedResult: clean(check.expectedResult || check.check),
        route: clean(check.route) || 'either'
      })),
      cleanup: []
    })),
    resources: resourceInventory.map(resource => ({
      id: clean(resource.id),
      label: clean(resource.type),
      type: clean(resource.type),
      exactName: externalResourceTarget(resource),
      generatedValue: clean(resource.nameRule),
      createdByTaskId: clean(resource.createdByTaskId),
      dependsOn: list(resource.dependsOn).map(clean).filter(Boolean),
      sensitive: false,
      chargeable: false
    })),
    programmeCleanup: resourceInventory.map(resource => {
      const cleanup = cleanupByTaskId.get(clean(resource.cleanupTaskId));
      const cleanupTask = taskById.get(clean(resource.cleanupTaskId));
      const cleanupSources = list(cleanupTask?.sourceIds).map(clean).filter(Boolean);
      const cliCommands = list(cleanupTask?.cliRoute).map(block => clean(block.content)).filter(Boolean);
      const exactTarget = externalResourceTarget(resource);
      return {
        resourceId: clean(resource.id),
        title: `Remove ${clean(resource.name || resource.type)}`,
        consoleInstructions: cleanup ? [`${clean(cleanup.action)} Exact target: ${exactTarget}.`] : [`Remove only the exact lab target ${exactTarget}.`],
        cliCommands: cliCommands.length ? cliCommands : [`# Manually remove only ${exactTarget} using the documented route above.`],
        verification: cleanup ? `${clean(cleanup.verification)} Exact target checked: ${exactTarget}.` : `${exactTarget} is absent.`,
        sourceIds: cleanupSources.length ? cleanupSources : list(cleanupTask?.sourceIds).map(clean).filter(Boolean)
      };
    }),
    warnings: {
      cost: warningText(manuscript.warnings?.cost),
      safety: warningText(manuscript.warnings?.safety),
      credentials: warningText(manuscript.warnings?.credentials),
      region: warningText(manuscript.warnings?.region)
    },
    qualityReport: {
      unresolvedIssues: []
    },
    boundaries: {
      appReady: manuscript.status?.localStudyTrackerValidationPerformed === true,
      fingerprinted: manuscript.status?.sha256FingerprintCreated === true,
      imported: manuscript.status?.imported === true,
      published: manuscript.status?.published === true
    }
  };
}

export function validateOfflinePreviewMatchesManuscript(manuscript, previewText) {
  const programme = manuscript?.programme || {};
  const title = clean(programme.title || programme.name);
  const resourcePrefix = clean(programme.resourcePrefix || programme.trainingResourcePrefix);
  const preview = clean(previewText);
  const heading = preview.match(/^#\s+(.+)$/m)?.[1]?.trim() || '';
  const missingTaskIds = list(manuscript?.tasks).map(task => clean(task?.id)).filter(id => id && !preview.includes(id));
  if (!title || heading.toLowerCase() !== title.toLowerCase()) {
    throw new Error(`The preview and manuscript programme titles do not match. Preview: ${heading || '(missing)'}. Manuscript: ${title || '(missing)'}.`);
  }
  if (resourcePrefix && !preview.includes(resourcePrefix)) {
    throw new Error(`The preview does not contain the manuscript training prefix ${resourcePrefix}.`);
  }
  if (missingTaskIds.length) {
    throw new Error(`The preview is missing ${missingTaskIds.length} manuscript task ID(s), beginning with ${missingTaskIds[0]}.`);
  }
  return { valid: true, title, resourcePrefix, taskCount: list(manuscript?.tasks).length };
}

export function normalizeOfflineManuscript(manuscript) {
  manuscript = canonicalizeExternalFormat(manuscript);
  const errors = [];
  requireValue(manuscript && typeof manuscript === 'object' && !Array.isArray(manuscript), 'The manuscript must contain one JSON object.', errors);
  if (errors.length) throw new Error(errors.join('\n'));
  requireValue(clean(manuscript.manuscriptVersion) === '1.0', 'manuscriptVersion must be "1.0".', errors);
  const programme = manuscript.programme || {};
  requireValue(clean(programme.title), 'programme.title is required.', errors);
  requireValue(clean(programme.topic), 'programme.topic is required.', errors);
  requireValue(clean(programme.examWorkspace), 'programme.examWorkspace is required.', errors);
  requireValue(clean(programme.outcome), 'programme.outcome is required.', errors);
  requireValue(clean(programme.region), 'programme.region is required.', errors);
  requireValue(clean(programme.resourcePrefix), 'programme.resourcePrefix is required.', errors);

  const sources = list(manuscript.sources);
  requireValue(sources.length > 0, 'At least one official source is required.', errors);
  const sourceIds = sources.map(source => clean(source?.id));
  requireValue(sourceIds.every(Boolean) && new Set(sourceIds).size === sourceIds.length, 'Every source requires a unique id.', errors);
  sources.forEach((source, index) => {
    requireValue(clean(source?.title), `Source ${index + 1} requires a title.`, errors);
    requireValue(officialSource(source?.url), `Source ${index + 1} must use a valid secure HTTPS documentation address.`, errors);
    requireValue(clean(source?.purpose), `Source ${index + 1} requires a purpose.`, errors);
  });
  const normalizedSources = sources.map(source => ({
    id: clean(source.id),
    title: clean(source.title),
    url: normalizedUrl(source.url),
    publisher: publisherFor(source.url, source.publisher),
    sourceType: 'official_documentation',
    purpose: clean(source.purpose),
    taskIds: list(source.taskIds).map(clean).filter(Boolean)
  }));
  const sourceById = new Map(normalizedSources.map(source => [source.id, source]));

  const phases = list(manuscript.phases);
  requireValue(phases.length >= 4, 'At least four phases are required.', errors);
  const phaseIds = phases.map(phase => clean(phase?.id));
  requireValue(phaseIds.every(Boolean) && new Set(phaseIds).size === phaseIds.length, 'Every phase requires a unique id.', errors);
  phases.forEach((phase, index) => requireValue(clean(phase?.title), `Phase ${index + 1} requires a title.`, errors));
  const phaseNumberById = new Map(phaseIds.map((id, index) => [id, index + 1]));

  const tasks = list(manuscript.tasks);
  requireValue(tasks.length >= 3, 'At least three tasks are required.', errors);
  const taskIds = tasks.map(task => clean(task?.id));
  requireValue(taskIds.every(Boolean) && new Set(taskIds).size === taskIds.length, 'Every task requires a unique id.', errors);
  const taskNumberById = new Map(taskIds.map((id, index) => [id, index + 1]));

  const resources = list(manuscript.resources);
  const resourceIds = resources.map(resource => clean(resource?.id));
  requireValue(resourceIds.every(Boolean) && new Set(resourceIds).size === resourceIds.length, 'Every resource requires a unique id.', errors);
  const resourceById = new Map(resources.map(resource => [clean(resource.id), resource]));

  const proposalTasks = tasks.map((task, index) => {
    const taskId = clean(task.id);
    const phaseId = clean(task.phaseId);
    const taskSourceIds = list(task.sourceIds).map(clean).filter(Boolean);
    requireValue(clean(task.title), `Task ${index + 1} requires a title.`, errors);
    requireValue(phaseNumberById.has(phaseId), `Task ${taskId || index + 1} references an unknown phase.`, errors);
    taskSourceIds.forEach(id => requireValue(sourceById.has(id), `Task ${taskId} references unknown source ${id}.`, errors));
    const taskSourceUrls = sourceUrlsFor(taskSourceIds, sourceById);
    requireValue(taskSourceUrls.length > 0, `Task ${taskId} requires at least one official source.`, errors);
    const prerequisiteIds = list(task.prerequisites || task.prerequisiteTaskIds).map(clean).filter(Boolean);
    const prerequisiteTaskNumbers = prerequisiteIds.map(id => taskNumberById.get(id));
    prerequisiteIds.forEach((id, prerequisiteIndex) => {
      const number = prerequisiteTaskNumbers[prerequisiteIndex];
      requireValue(number && number <= index, `Task ${taskId} has invalid prerequisite ${id}; prerequisites must be earlier tasks.`, errors);
    });
    const createdResourceKeys = list(task.createdResourceIds || task.createdResourceKeys).map(clean).filter(Boolean);
    createdResourceKeys.forEach(id => requireValue(resourceById.has(id), `Task ${taskId} declares unknown resource ${id}.`, errors));
    const consoleSteps = normalizeConsoleSteps(task, sourceById, taskSourceUrls);
    const cliSteps = normalizeCliSteps(task, sourceById, taskSourceUrls);
    requireValue(consoleSteps.length > 0, `Task ${taskId} requires complete Console/browser steps.`, errors);
    requireValue(cliSteps.length > 0, `Task ${taskId} requires complete CLI/Terraform steps.`, errors);
    consoleSteps.forEach((step, stepIndex) => {
      requireValue(step.instructions.length > 0, `Task ${taskId} Console step ${stepIndex + 1} requires instructions.`, errors);
      requireValue(step.expectedResult, `Task ${taskId} Console step ${stepIndex + 1} requires an expected result.`, errors);
      step.jsonBlocks.forEach((block, blockIndex) => requireValue(block.content, `Task ${taskId} editable block ${blockIndex + 1} is empty.`, errors));
    });
    cliSteps.forEach((step, stepIndex) => {
      requireValue(step.command, `Task ${taskId} CLI step ${stepIndex + 1} requires a command.`, errors);
      requireValue(step.explanation, `Task ${taskId} CLI step ${stepIndex + 1} requires an explanation.`, errors);
      requireValue(step.expectedResult, `Task ${taskId} CLI step ${stepIndex + 1} requires an expected result.`, errors);
    });
    const verification = list(task.verification).map((check, checkIndex) => ({
      title: clean(check?.title) || `Verification ${checkIndex + 1}`,
      instruction: clean(check?.instruction),
      expectedResult: clean(check?.expectedResult),
      mode: verificationMode(check?.mode || check?.route)
    }));
    requireValue(verification.length > 0, `Task ${taskId} requires at least one verification check.`, errors);
    verification.forEach((check, checkIndex) => {
      requireValue(check.instruction, `Task ${taskId} verification ${checkIndex + 1} requires an instruction.`, errors);
      requireValue(check.expectedResult, `Task ${taskId} verification ${checkIndex + 1} requires an expected result.`, errors);
    });
    const cleanup = list(task.cleanup).map((step, cleanupIndex) => ({
      title: clean(step?.title) || `Task cleanup ${cleanupIndex + 1}`,
      instruction: clean(step?.instruction),
      verification: clean(step?.verification),
      sourceUrls: sourceUrlsFor(step?.sourceIds, sourceById, taskSourceUrls)
    }));
    return {
      phaseNumber: phaseNumberById.get(phaseId),
      title: clean(task.title),
      feature: clean(task.feature || programme.topic),
      goal: clean(task.goal),
      whyItMatters: clean(task.whyItMatters),
      difficulty: taskDifficulty(task.difficulty),
      estimatedMinutes: Number.isFinite(Number(task.estimatedMinutes)) && Number(task.estimatedMinutes) > 0 ? Math.round(Number(task.estimatedMinutes)) : null,
      isOptional: Boolean(task.isOptional),
      prerequisiteTaskNumbers,
      sourceUrls: taskSourceUrls,
      createdResourceKeys,
      consoleSteps,
      cliSteps,
      verification,
      cleanup
    };
  });

  normalizedSources.forEach(source => source.taskIds.forEach(taskId => {
    requireValue(taskNumberById.has(taskId), `Source ${source.id} references unknown task ${taskId}.`, errors);
    const task = tasks[taskNumberById.get(taskId) - 1];
    requireValue(list(task?.sourceIds).map(clean).includes(source.id), `Source ${source.id} and task ${taskId} are not linked reciprocally.`, errors);
  }));
  tasks.forEach(task => list(task.sourceIds).map(clean).forEach(sourceId => {
    const linkedTasks = sourceById.get(sourceId)?.taskIds || [];
    requireValue(linkedTasks.includes(clean(task.id)), `Task ${task.id} and source ${sourceId} are not linked reciprocally.`, errors);
  }));

  const resourceInventory = resources.map((resource, index) => {
    const createdByTaskId = clean(resource.createdByTaskId);
    const exactTarget = clean(resource.exactName || resource.resourceNameOrPlaceholder) || (clean(resource.generatedValue) ? `[${clean(resource.generatedValue).replace(/[^A-Za-z0-9]+/g, '_').toUpperCase()}]` : '');
    requireValue(taskNumberById.has(createdByTaskId), `Resource ${resource.id} references an unknown creation task.`, errors);
    requireValue(exactTarget, `Resource ${resource.id} requires an exactName or generatedValue.`, errors);
    const dependencies = list(resource.dependsOn || resource.dependsOnResourceIds).map(clean).filter(Boolean);
    dependencies.forEach(id => requireValue(resourceById.has(id) && id !== resource.id, `Resource ${resource.id} has invalid dependency ${id}.`, errors));
    const task = proposalTasks[taskNumberById.get(createdByTaskId) - 1];
    if (task && !task.createdResourceKeys.includes(clean(resource.id))) task.createdResourceKeys.push(clean(resource.id));
    return {
      resourceKey: clean(resource.id),
      resourceType: clean(resource.type || resource.label) || 'other',
      resourceNameOrPlaceholder: exactTarget,
      createdByTaskNumber: taskNumberById.get(createdByTaskId),
      dependsOnResourceKeys: dependencies,
      order: index
    };
  });

  const finalCleanup = list(manuscript.programmeCleanup).map((step, index) => {
    const resourceKey = clean(step?.resourceId || step?.resourceKey);
    requireValue(resourceById.has(resourceKey), `Programme cleanup ${index + 1} references unknown resource ${resourceKey || '(missing)'}.`, errors);
    const sourceUrls = sourceUrlsFor(step?.sourceIds, sourceById);
    const consoleInstructions = list(step?.consoleInstructions).map(text).filter(Boolean);
    const cliCommands = list(step?.cliCommands).map(text).filter(Boolean);
    requireValue(clean(step?.title), `Programme cleanup ${index + 1} requires a title.`, errors);
    requireValue(consoleInstructions.length > 0, `Programme cleanup ${index + 1} requires Console/browser instructions.`, errors);
    requireValue(cliCommands.length > 0, `Programme cleanup ${index + 1} requires CLI/Terraform commands.`, errors);
    requireValue(clean(step?.verification), `Programme cleanup ${index + 1} requires visible verification.`, errors);
    requireValue(sourceUrls.length > 0, `Programme cleanup ${index + 1} requires an official source.`, errors);
    return { resourceKey, title: clean(step.title), consoleInstructions, cliCommands, verification: clean(step.verification), sourceUrls };
  });
  requireValue(finalCleanup.length > 0, 'programmeCleanup requires at least one item.', errors);

  const boundaries = manuscript.boundaries || {};
  for (const key of ['appReady', 'fingerprinted', 'imported', 'published']) requireValue(boundaries[key] === false, `boundaries.${key} must be false.`, errors);
  const serialized = JSON.stringify(manuscript);
  const executableText = proposalTasks.flatMap(task => task.cliSteps.map(step => step.command))
    .concat(finalCleanup.flatMap(step => step.cliCommands)).join('\n');
  requireValue(!CREDENTIAL_PATTERN.test(serialized), 'Credential-like content was rejected. Remove all real secrets and access keys.', errors);
  requireValue(!DESTRUCTIVE_PATH_PATTERN.test(executableText), 'A broad destructive filesystem command was rejected.', errors);
  if (errors.length) throw new Error(`Offline manuscript validation failed:\n- ${[...new Set(errors)].join('\n- ')}`);

  const findings = list(manuscript.qualityReport?.unresolvedIssues || manuscript.qualityReport?.findings).map(text).filter(Boolean);
  const proposal = {
    programme: {
      displayName: clean(programme.title),
      subtitle: clean(programme.subtitle) || clean(programme.topic),
      category: clean(programme.category) || clean(programme.examWorkspace),
      description: clean(programme.description) || `A ${clean(programme.learnerLevel) || 'beginner'} Follow Along for ${clean(programme.topic)}.`,
      learningOutcome: clean(programme.outcome),
      difficulty: difficulty(programme.learnerLevel),
      regionScope: regionScope(programme.region),
      estimatedMinutes: programme.selfPaced === true ? null : (Number(programme.estimatedMinutes) || null)
    },
    sources: normalizedSources.map(({ taskIds: _taskIds, ...source }) => source),
    phases: phases.map(phase => ({ title: clean(phase.title), description: clean(phase.description) || clean(phase.title), isOptional: Boolean(phase.isOptional) })),
    resourceInventory,
    tasks: proposalTasks,
    finalCleanup,
    warnings: {
      cost: clean(manuscript.warnings?.cost),
      safety: clean(manuscript.warnings?.safety),
      credentials: clean(manuscript.warnings?.credentials),
      region: clean(manuscript.warnings?.region)
    },
    manualReviewFindings: findings
  };
  const cleanupFindings = findCleanupCoverageFindings(proposal);
  proposal.manualReviewFindings = [...new Set([
    ...proposal.manualReviewFindings,
    ...cleanupFindings.map(finding => `Manual correction required: ${finding}`)
  ])];
  const suggestedProgrammeId = slugify(programme.suggestedProgrammeId) || `${slugify(programme.topic)}-learning-path`;
  const serviceSlug = suggestedProgrammeId.replace(/-learning-path$/, '') || slugify(programme.topic);
  const shortName = clean(programme.shortName) || clean(programme.topic).split(/\s+/).map(part => part[0]).join('').slice(0, 6).toUpperCase();
  const inputs = {
    generationMode: SIMPLE_AUTHOR_ASSISTANT_MODE.NEW,
    serviceName: clean(programme.serviceName) || clean(programme.topic),
    shortName,
    learnerLevel: difficulty(programme.learnerLevel),
    buildOutcome: clean(programme.outcome),
    preferredRegion: clean(programme.region),
    offlineImport: {
      manuscriptVersion: '1.0',
      suggestedProgrammeId,
      serviceSlug,
      examWorkspace: clean(programme.examWorkspace),
      resourcePrefix: clean(programme.resourcePrefix)
    }
  };
  return {
    inputs,
    proposal,
    suggestedProgrammeId,
    serviceSlug,
    examId: examIdForWorkspace(programme.examWorkspace)
  };
}

export function buildOfflineHandoff(manuscript, { now = () => new Date() } = {}) {
  const normalized = normalizeOfflineManuscript(manuscript);
  const { content, checks } = buildAuthorDraftContent(normalized.inputs, normalized.proposal);
  content.programme.programmeId = normalized.suggestedProgrammeId;
  content.programme.pathId = normalized.suggestedProgrammeId;
  content.programme.serviceSlug = normalized.serviceSlug;
  if (normalized.examId) content.programme.examId = normalized.examId;
  content.publication.targetProgrammeId = normalized.suggestedProgrammeId;
  content.schema.createdWith = 'author-assistant-offline-import-v1';
  const manuscriptFingerprint = fingerprintJson(manuscript);
  const sessionId = `author-assistant-offline-${normalized.serviceSlug}-${manuscriptFingerprint.slice(0, 12)}`;
  const { session, handoffPackage } = buildSimpleHandoff({
    inputs: normalized.inputs,
    proposal: normalized.proposal,
    authorDraftContent: content,
    sessionId,
    now
  });
  session.offlineImport = {
    manuscriptFilename: OFFLINE_MANUSCRIPT_FILENAME,
    previewFilename: OFFLINE_PREVIEW_FILENAME,
    manuscriptFingerprint: { algorithm: 'sha256-json-v1', value: manuscriptFingerprint }
  };
  handoffPackage.offlineImport = structuredClone(session.offlineImport);
  // The offline-import evidence is part of the package fingerprint.
  const rebuilt = buildSimpleHandoff({ inputs: normalized.inputs, proposal: normalized.proposal, authorDraftContent: content, sessionId, now });
  rebuilt.session.offlineImport = session.offlineImport;
  rebuilt.handoffPackage.offlineImport = handoffPackage.offlineImport;
  const fingerprintContent = structuredClone(rebuilt.handoffPackage);
  delete fingerprintContent.status;
  delete fingerprintContent.preparedAt;
  delete fingerprintContent.handoffFingerprint;
  rebuilt.handoffPackage.handoffFingerprint = { algorithm: 'sha256-json-v1', value: fingerprintJson(fingerprintContent) };
  return { ...rebuilt, checks, previewText: formatSimplePreview(rebuilt.handoffPackage), manuscriptFingerprint };
}

export function defaultOfflineOutputRoot() {
  return path.resolve(fileURLToPath(new URL('../../docs/author-assistant/handoffs/', import.meta.url)));
}
