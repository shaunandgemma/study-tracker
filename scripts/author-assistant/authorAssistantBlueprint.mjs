import {
  addAuthorPhase,
  addAuthorTask,
  updateAuthorTask,
  validateAuthorPlanning
} from '../../src/features/followAlongAuthor/authorPlanning.js';
import { addAuthorSource, setAuthorSourceTaskLink } from '../../src/features/followAlongAuthor/authorContent.js';
import { createAuthorDraft } from '../../src/features/followAlongAuthor/authorDraftService.js';
import { AUTHOR_ASSISTANT_SCHEMA_VERSION } from './authorAssistantCore.mjs';
import {
  DEFAULT_AUTHOR_ASSISTANT_MODEL,
  formatOpenAiRequestError,
  OPENAI_RESPONSES_URL
} from './authorAssistantResearch.mjs';

const PROGRAMME_DIFFICULTIES = Object.freeze(['Beginner', 'Beginner to Intermediate', 'Intermediate', 'Intermediate to Advanced', 'Advanced']);
const TASK_DIFFICULTIES = Object.freeze(['Easy', 'Medium', 'Hard']);
const REGION_SCOPES = Object.freeze(['regional', 'global', 'mixed']);

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function optionalMinutes(value) {
  if (value === null || value === undefined || value === '') return null;
  const minutes = Number(value);
  return Number.isFinite(minutes) && minutes > 0 ? Math.round(minutes) : null;
}

function acceptedUrls(acceptedSources) {
  return (acceptedSources?.sources || []).map(source => source.url);
}

function blueprintSchema(sourceUrls) {
  return {
    type: 'object',
    properties: {
      programme: {
        type: 'object',
        properties: {
          displayName: { type: 'string' },
          subtitle: { type: 'string' },
          category: { type: 'string' },
          description: { type: 'string' },
          learningOutcome: { type: 'string' },
          difficulty: { type: 'string', enum: PROGRAMME_DIFFICULTIES },
          regionScope: { type: 'string', enum: REGION_SCOPES }
        },
        required: ['displayName', 'subtitle', 'category', 'description', 'learningOutcome', 'difficulty', 'regionScope'],
        additionalProperties: false
      },
      phases: {
        type: 'array',
        minItems: 4,
        items: {
          type: 'object',
          properties: {
            phaseNumber: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            isOptional: { type: 'boolean' }
          },
          required: ['phaseNumber', 'title', 'description', 'isOptional'],
          additionalProperties: false
        }
      },
      tasks: {
        type: 'array',
        minItems: 3,
        items: {
          type: 'object',
          properties: {
            taskNumber: { type: 'integer' },
            phaseNumber: { type: 'integer' },
            title: { type: 'string' },
            feature: { type: 'string' },
            goal: { type: 'string' },
            whyItMatters: { type: 'string' },
            difficulty: { type: 'string', enum: TASK_DIFFICULTIES },
            estimatedMinutes: { type: ['integer', 'null'] },
            isOptional: { type: 'boolean' },
            prerequisiteTaskNumbers: { type: 'array', items: { type: 'integer' } },
            sourceUrls: {
              type: 'array',
              minItems: 1,
              items: { type: 'string', enum: sourceUrls }
            }
          },
          required: [
            'taskNumber',
            'phaseNumber',
            'title',
            'feature',
            'goal',
            'whyItMatters',
            'difficulty',
            'estimatedMinutes',
            'isOptional',
            'prerequisiteTaskNumbers',
            'sourceUrls'
          ],
          additionalProperties: false
        }
      },
      manualReviewFindings: { type: 'array', items: { type: 'string' } }
    },
    required: ['programme', 'phases', 'tasks', 'manualReviewFindings'],
    additionalProperties: false
  };
}

function requireAcceptedSources(session, acceptedSources) {
  if (!session?.sessionId || acceptedSources?.sessionId !== session.sessionId || acceptedSources?.status !== 'accepted') {
    throw new Error('Accepted AWS documentation sources are required before preparing a blueprint.');
  }
  const urls = acceptedUrls(acceptedSources);
  if (!urls.length || new Set(urls).size !== urls.length) throw new Error('Accepted AWS sources must contain unique URLs.');
  for (const value of urls) {
    const url = new URL(value);
    if (url.protocol !== 'https:' || (url.hostname !== 'docs.aws.amazon.com' && !url.hostname.endsWith('.docs.aws.amazon.com'))) {
      throw new Error('Every blueprint source must be an accepted docs.aws.amazon.com URL.');
    }
  }
  return urls;
}

export function buildBlueprintPayload(session, acceptedSources, { model = DEFAULT_AUTHOR_ASSISTANT_MODEL } = {}) {
  const sourceUrls = requireAcceptedSources(session, acceptedSources);
  return {
    model,
    store: false,
    reasoning: { effort: 'low' },
    instructions: [
      'Prepare only a simple reusable Author programme blueprint for stages 1 to 5.',
      'Use at least four phases. There is no fixed maximum number of phases or tasks. Use as many as the requested learner scope genuinely requires.',
      'Use only facts present in the accepted AWS source records supplied by the application.',
      'Do not browse, add sources, invent commands, write detailed instructions, prepare cleanup, or prepare a release candidate.',
      'Keep the learner journey short, ordered, beginner-friendly when requested, and suitable for later checkbox instructions.',
      'Each task must link to one or more exact accepted source URLs from the response schema.',
      'Every accepted source must support at least one task.',
      'Task numbers and phase numbers must start at 1 and remain sequential.',
      'A task may depend only on earlier task numbers.',
      'Programme and task durations are optional. Use null when no useful estimate exists.',
      'Retain unresolved safety or sourcing matters in manualReviewFindings.'
    ].join(' '),
    input: [
      `Official AWS service name: ${session.inputs.serviceName}`,
      `Short service name: ${session.inputs.shortName}`,
      `Learner level: ${session.inputs.learnerLevel}`,
      `Learner outcome requested: ${session.inputs.buildOutcome}`,
      `Preferred Region: ${session.inputs.preferredRegion}`,
      'Accepted AWS source records:',
      JSON.stringify({ sources: acceptedSources.sources, manualReviewFindings: acceptedSources.manualReviewFindings || [] })
    ].join('\n'),
    text: {
      format: {
        type: 'json_schema',
        name: 'author_stages_1_to_5_blueprint',
        strict: true,
        schema: blueprintSchema(sourceUrls)
      }
    }
  };
}

function extractOutputText(response) {
  for (const item of response?.output || []) {
    if (item?.type !== 'message') continue;
    for (const part of item.content || []) {
      if (part?.type === 'output_text' && clean(part.text)) return part.text;
    }
  }
  throw new Error('The AI response did not contain a structured blueprint.');
}

function validateProposal(session, acceptedSources, proposal) {
  const sourceUrls = new Set(requireAcceptedSources(session, acceptedSources));
  if (!proposal?.programme || !Array.isArray(proposal.phases) || !Array.isArray(proposal.tasks)) {
    throw new Error('The proposed blueprint is incomplete.');
  }
  if (!Array.isArray(proposal.manualReviewFindings)) throw new Error('Blueprint manual review findings are missing.');
  if (proposal.phases.length < 4) throw new Error('The blueprint must contain at least four phases.');
  if (proposal.tasks.length < 3) throw new Error('The blueprint must contain at least three tasks.');
  if (!PROGRAMME_DIFFICULTIES.includes(proposal.programme.difficulty)) throw new Error('The blueprint programme difficulty is invalid.');
  if (!REGION_SCOPES.includes(proposal.programme.regionScope)) throw new Error('The blueprint Region scope is invalid.');

  proposal.phases.forEach((phase, index) => {
    if (phase.phaseNumber !== index + 1 || !clean(phase.title) || !clean(phase.description)) {
      throw new Error('Blueprint phases must be complete and sequential.');
    }
  });
  const usedSources = new Set();
  proposal.tasks.forEach((task, index) => {
    const taskNumber = index + 1;
    if (task.taskNumber !== taskNumber) throw new Error('Blueprint tasks must be sequential.');
    if (!proposal.phases.some(phase => phase.phaseNumber === task.phaseNumber)) throw new Error('A blueprint task references an unknown phase.');
    if (index > 0 && task.phaseNumber < proposal.tasks[index - 1].phaseNumber) {
      throw new Error('Blueprint tasks must follow the phase order.');
    }
    if (![task.title, task.feature, task.goal, task.whyItMatters].every(clean)) throw new Error('Every blueprint task must contain its planning details.');
    if (!TASK_DIFFICULTIES.includes(task.difficulty)) throw new Error('Every blueprint task must have a supported difficulty.');
    if (!Array.isArray(task.prerequisiteTaskNumbers) || new Set(task.prerequisiteTaskNumbers).size !== task.prerequisiteTaskNumbers.length) {
      throw new Error('Blueprint task prerequisites must be unique.');
    }
    if (task.prerequisiteTaskNumbers.some(number => !Number.isInteger(number) || number < 1 || number >= taskNumber)) {
      throw new Error('A blueprint task may depend only on an earlier task.');
    }
    if (!Array.isArray(task.sourceUrls) || !task.sourceUrls.length) throw new Error('Every blueprint task must link to an accepted source.');
    if (new Set(task.sourceUrls).size !== task.sourceUrls.length) throw new Error('Blueprint task source links must be unique.');
    task.sourceUrls.forEach(url => {
      if (!sourceUrls.has(url)) throw new Error('A blueprint task referenced a source that was not accepted.');
      usedSources.add(url);
    });
  });
  for (const phase of proposal.phases) {
    if (!proposal.tasks.some(task => task.phaseNumber === phase.phaseNumber)) {
      throw new Error('Every blueprint phase must contain at least one task.');
    }
  }
  if (usedSources.size !== sourceUrls.size) throw new Error('Every accepted source must support at least one blueprint task.');
  return proposal;
}

function planningDraftFromProposal(session, acceptedSources, proposal, now) {
  let draft = createAuthorDraft({
    userId: 'author-assistant-local-blueprint',
    input: {
      serviceName: session.inputs.serviceName,
      shortName: session.inputs.shortName,
      displayName: clean(proposal.programme.displayName),
      description: clean(proposal.programme.description)
    },
    now,
    idFactory: () => session.sessionId
  });
  const totalMinutes = proposal.tasks.map(task => optionalMinutes(task.estimatedMinutes)).filter(Number.isFinite).reduce((total, minutes) => total + minutes, 0) || null;
  draft = {
    ...draft,
    programme: {
      ...draft.programme,
      serviceName: session.inputs.serviceName,
      shortName: session.inputs.shortName,
      displayName: clean(proposal.programme.displayName),
      subtitle: clean(proposal.programme.subtitle),
      category: clean(proposal.programme.category),
      description: clean(proposal.programme.description),
      learningOutcome: clean(proposal.programme.learningOutcome),
      difficulty: proposal.programme.difficulty,
      regionScope: proposal.programme.regionScope,
      defaultRegion: proposal.programme.regionScope === 'global' ? '' : session.inputs.preferredRegion,
      estimatedMinutes: totalMinutes
    }
  };

  for (const phaseInput of proposal.phases) {
    const result = addAuthorPhase(draft, phaseInput);
    if (!result.success) throw new Error(result.error);
    draft = result.draft;
  }
  const taskIdsByNumber = new Map();
  for (const taskInput of proposal.tasks) {
    const phaseId = draft.phases[taskInput.phaseNumber - 1]?.id;
    const result = addAuthorTask(draft, {
      ...taskInput,
      estimatedMinutes: optionalMinutes(taskInput.estimatedMinutes),
      phaseId,
      region: session.inputs.preferredRegion
    });
    if (!result.success) throw new Error(result.error);
    draft = result.draft;
    taskIdsByNumber.set(taskInput.taskNumber, result.task.id);
  }
  for (const taskInput of proposal.tasks) {
    const taskId = taskIdsByNumber.get(taskInput.taskNumber);
    const result = updateAuthorTask(draft, taskId, {
      prerequisites: taskInput.prerequisiteTaskNumbers.map(number => taskIdsByNumber.get(number))
    });
    if (!result.success) throw new Error(result.error);
    draft = result.draft;
  }
  const sourceIdByUrl = new Map();
  for (const sourceInput of acceptedSources.sources) {
    const result = addAuthorSource(draft, {
      title: sourceInput.documentTitle,
      url: sourceInput.url,
      purpose: sourceInput.whyThisSourceApplies
    });
    if (!result.success) throw new Error(result.error);
    draft = result.draft;
    sourceIdByUrl.set(sourceInput.url, result.source.id);
  }
  for (const taskInput of proposal.tasks) {
    const taskId = taskIdsByNumber.get(taskInput.taskNumber);
    for (const url of taskInput.sourceUrls) {
      const result = setAuthorSourceTaskLink(draft, sourceIdByUrl.get(url), taskId, true);
      if (!result.success) throw new Error(result.error);
      draft = result.draft;
    }
  }
  return draft;
}

export function buildStagesOneToFiveBlueprint({ session, acceptedSources, proposal, responseId = '', model = DEFAULT_AUTHOR_ASSISTANT_MODEL, now = () => new Date() } = {}) {
  validateProposal(session, acceptedSources, proposal);
  const draft = planningDraftFromProposal(session, acceptedSources, proposal, now);
  const planningCheck = validateAuthorPlanning(draft);
  if (!planningCheck.valid) throw new Error('The generated blueprint did not pass the Author planning check.');
  return {
    schemaVersion: AUTHOR_ASSISTANT_SCHEMA_VERSION,
    kind: 'author_stages_1_to_5_blueprint',
    status: 'awaiting_human_blueprint_review',
    sessionId: session.sessionId,
    responseId: clean(responseId),
    model,
    generatedAt: now().toISOString(),
    service: { officialName: session.inputs.serviceName, shortName: session.inputs.shortName },
    stageBoundary: {
      preparedLocally: [1, 2, 3, 4, 5],
      notPrepared: [6, 7, 8, 9, 10, 11, 12],
      writtenToAuthor: false,
      connectedToSupabase: false,
      connectedToAws: false,
      candidatePrepared: false,
      published: false
    },
    programme: draft.programme,
    phases: draft.phases,
    tasks: draft.tasks.map(task => ({
      id: task.id,
      title: task.title,
      service: task.service,
      feature: task.feature,
      goal: task.goal,
      whyItMatters: task.whyItMatters,
      difficulty: task.difficulty,
      estimatedMinutes: task.estimatedMinutes,
      region: task.region,
      phaseId: task.phaseId,
      prerequisites: task.prerequisites,
      isOptional: task.isOptional,
      sourceIds: task.sourceIds
    })),
    sources: draft.sources,
    planningCheck,
    manualReviewFindings: [...new Set([...(acceptedSources.manualReviewFindings || []), ...proposal.manualReviewFindings.map(clean).filter(Boolean)])]
  };
}

export function formatBlueprintPreview(blueprint) {
  const lines = [
    `AUTHOR STAGES 1-5 BLUEPRINT - ${blueprint.service.shortName}`,
    '',
    `Programme: ${blueprint.programme.displayName}`,
    `Outcome: ${blueprint.programme.learningOutcome}`,
    `Region: ${blueprint.programme.defaultRegion || 'global'}`,
    `Estimated time: ${blueprint.programme.estimatedMinutes ? `${blueprint.programme.estimatedMinutes} minutes` : 'Self-paced'}`,
    '',
    'PHASES AND TASKS'
  ];
  const tasksById = new Map(blueprint.tasks.map(task => [task.id, task]));
  blueprint.phases.forEach(phase => {
    lines.push('', `${phase.phaseNumber}. ${phase.title}`, `   ${phase.description}`);
    phase.taskIds.forEach(taskId => {
      const task = tasksById.get(taskId);
      if (task) lines.push(`   - ${task.title} (${task.estimatedMinutes ? `${task.estimatedMinutes} minutes` : 'Self-paced'})`);
    });
  });
  lines.push('', `Accepted AWS sources linked: ${blueprint.sources.length}`);
  lines.push(`Planning check: ${blueprint.planningCheck.valid ? 'passed' : 'failed'}`);
  lines.push('', 'NOT PREPARED', 'Stages 6-12 have not been prepared.', 'Nothing was written to Author, Supabase or AWS.', '');
  return lines.join('\n');
}

export async function requestStagesOneToFiveBlueprint({
  session,
  acceptedSources,
  apiKey,
  model = DEFAULT_AUTHOR_ASSISTANT_MODEL,
  fetchImpl = globalThis.fetch,
  now = () => new Date()
} = {}) {
  if (!clean(apiKey)) throw new Error('OPENAI_API_KEY is not configured. No blueprint request was made.');
  if (typeof fetchImpl !== 'function') throw new Error('Secure network access is unavailable.');
  const payload = buildBlueprintPayload(session, acceptedSources, { model });
  const response = await fetchImpl(OPENAI_RESPONSES_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response?.ok) {
    let apiError = {};
    try {
      apiError = (await response.json())?.error || {};
    } catch {
      // Safe status guidance remains available without the raw provider message.
    }
    throw new Error(formatOpenAiRequestError(response?.status, apiError));
  }
  const apiResponse = await response.json();
  let proposal;
  try {
    proposal = JSON.parse(extractOutputText(apiResponse));
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error('The AI blueprint was not valid structured JSON.');
    throw error;
  }
  return buildStagesOneToFiveBlueprint({
    session,
    acceptedSources,
    proposal,
    responseId: apiResponse.id,
    model,
    now
  });
}
