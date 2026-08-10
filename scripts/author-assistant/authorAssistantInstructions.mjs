import {
  addAuthorInstructionItem,
  addAuthorInstructionStep,
  setAuthorTaskMode
} from '../../src/features/followAlongAuthor/authorContent.js';
import { AUTHOR_ASSISTANT_ALLOWED_DOMAINS, AUTHOR_ASSISTANT_SCHEMA_VERSION } from './authorAssistantCore.mjs';
import {
  DEFAULT_AUTHOR_ASSISTANT_MODEL,
  formatOpenAiRequestError,
  OPENAI_RESPONSES_URL
} from './authorAssistantResearch.mjs';

const TASK_STATUSES = Object.freeze(['prepared', 'needs_manual_review']);

function clean(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function normalizeUrl(value) {
  const url = new URL(value);
  url.hash = '';
  url.search = '';
  return url.toString().replace(/\/$/, '');
}

function instructionSchema(taskIds, sourceUrls, taskCount) {
  return {
    type: 'object',
    properties: {
      tasks: {
        type: 'array',
        minItems: taskCount,
        maxItems: taskCount,
        items: {
          type: 'object',
          properties: {
            taskId: { type: 'string', enum: taskIds },
            status: { type: 'string', enum: TASK_STATUSES },
            manualReviewReason: { type: 'string' },
            consoleSteps: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  instructions: {
                    type: 'array',
                    minItems: 1,
                    items: {
                      type: 'object',
                      properties: {
                        text: { type: 'string' },
                        detail: { type: 'string' }
                      },
                      required: ['text', 'detail'],
                      additionalProperties: false
                    }
                  },
                  expectedResult: { type: 'string' },
                  warning: { type: 'string' },
                  sourceUrls: {
                    type: 'array',
                    minItems: 1,
                    items: { type: 'string', enum: sourceUrls }
                  }
                },
                required: ['title', 'instructions', 'expectedResult', 'warning', 'sourceUrls'],
                additionalProperties: false
              }
            }
          },
          required: ['taskId', 'status', 'manualReviewReason', 'consoleSteps'],
          additionalProperties: false
        }
      },
      manualReviewFindings: { type: 'array', items: { type: 'string' } }
    },
    required: ['tasks', 'manualReviewFindings'],
    additionalProperties: false
  };
}

function requireAcceptedStageSixInputs(session, acceptedSources, blueprint, existingInstructions = null) {
  const isRevision = Boolean(existingInstructions);
  const expectedStatus = isRevision ? 'stage_6_ready_for_review' : 'blueprint_accepted';
  if (!session?.sessionId || session.status !== expectedStatus) {
    throw new Error('A human-accepted local blueprint is required before Stage 6.');
  }
  if (acceptedSources?.sessionId !== session.sessionId || acceptedSources.status !== 'accepted') {
    throw new Error('Accepted AWS sources from the same session are required.');
  }
  if (blueprint?.sessionId !== session.sessionId || blueprint.status !== 'human_accepted') {
    throw new Error('The accepted blueprint does not match the session.');
  }
  const boundary = blueprint.stageBoundary;
  if (
    boundary?.writtenToAuthor !== false
    || boundary?.connectedToSupabase !== false
    || boundary?.connectedToAws !== false
    || boundary?.candidatePrepared !== false
    || boundary?.published !== false
    || session.boundaries?.authorDraftWritten !== false
    || session.boundaries?.stage6Prepared !== isRevision
  ) {
    throw new Error('Stage 6 stopped because a safety boundary changed.');
  }
  if (isRevision && (
    existingInstructions.sessionId !== session.sessionId
    || existingInstructions.status !== 'awaiting_human_stage_6_review'
    || existingInstructions.stageBoundary?.writtenToAuthor !== false
    || existingInstructions.stageBoundary?.notPrepared?.join(',') !== '7,8,9,10,11,12'
  )) {
    throw new Error('The existing Stage 6 instructions cannot be safely revised.');
  }
  if (!Array.isArray(blueprint.tasks) || !blueprint.tasks.length || !Array.isArray(blueprint.sources)) {
    throw new Error('The accepted blueprint is incomplete.');
  }
  return acceptedSources.sources.map(source => source.url);
}

export function buildStageSixPayload(session, acceptedSources, blueprint, {
  model = DEFAULT_AUTHOR_ASSISTANT_MODEL,
  alignment = null,
  existingInstructions = null
} = {}) {
  const sourceUrls = requireAcceptedStageSixInputs(session, acceptedSources, blueprint, existingInstructions);
  const selectedTaskIds = alignment?.affectedTaskIds || blueprint.tasks.map(task => task.id);
  const selectedTaskIdSet = new Set(selectedTaskIds);
  const taskIds = blueprint.tasks.filter(task => selectedTaskIdSet.has(task.id)).map(task => task.id);
  if (taskIds.length !== selectedTaskIds.length || taskIds.some((taskId, index) => taskId !== selectedTaskIds[index])) {
    throw new Error('The Stage 6 task selection must match the accepted blueprint order.');
  }
  const sourceById = new Map(blueprint.sources.map(source => [source.id, source]));
  const taskRecords = blueprint.tasks.filter(task => selectedTaskIdSet.has(task.id)).map(task => ({
    id: task.id,
    title: task.title,
    goal: task.goal,
    whyItMatters: task.whyItMatters,
    region: task.region,
    approvedInstructionBoundary: alignment?.taskBoundaries?.[task.id] || null,
    acceptedSources: task.sourceIds.map(sourceId => sourceById.get(sourceId)).filter(Boolean).map(source => ({
      title: source.title,
      url: source.url,
      purpose: source.purpose
    }))
  }));
  return {
    model,
    store: false,
    reasoning: { effort: 'low' },
    tools: [{ type: 'web_search', filters: { allowed_domains: [...AUTHOR_ASSISTANT_ALLOWED_DOMAINS] } }],
    tool_choice: 'required',
    include: ['web_search_call.action.sources', 'web_search_call.results'],
    instructions: [
      'Prepare only Author Stage 6 Console instructions for the accepted local Follow Along blueprint.',
      'Use web search only to open and read the exact accepted AWS documentation URLs supplied by the application.',
      'Do not use facts from any URL outside the accepted list, even if web search returns other official pages.',
      'Return every task exactly once and in the supplied order.',
      'Each checkbox instruction must be one short, exact learner action that can be edited independently.',
      'Use the current AWS Console labels supported by the accepted sources. Do not invent labels, values, permissions or results.',
      'Use harmless example names and test data. Never include credentials, secrets, account IDs or personal data.',
      'Do not create CLI commands, resource capture, verification checks, cleanup instructions, Stage 7 content or release content.',
      'Do not instruct deletion of an AWS service resource in Stage 6. A lifecycle-review task may explain the effect without performing deletion.',
      'When an approvedInstructionBoundary is supplied, follow its consoleGoal exactly. Preserve futureCliGuidance as future scope only and keep stage8CleanupGuidance out of the current action steps.',
      'If the accepted sources do not support safe exact instructions for a task, set it to needs_manual_review, return no Console steps and explain why.',
      'For a prepared task, return at least one Console step, a visible expected result and exact accepted source URLs used.',
      'Retain unresolved source or safety issues in manualReviewFindings.'
    ].join(' '),
    input: [
      `AWS service: ${session.inputs.serviceName} (${session.inputs.shortName}).`,
      `Learner level: ${session.inputs.learnerLevel}.`,
      `Preferred Region: ${session.inputs.preferredRegion}.`,
      'Human-accepted blueprint tasks and their accepted source boundaries:',
      JSON.stringify(taskRecords),
      'Existing human review findings that must not be silently discarded:',
      JSON.stringify(blueprint.manualReviewFindings || [])
    ].join('\n'),
    text: {
      verbosity: 'low',
      format: {
        type: 'json_schema',
        name: 'author_stage_6_console_instructions',
        strict: true,
        schema: instructionSchema(taskIds, sourceUrls, taskIds.length)
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
  throw new Error('The AI response did not contain structured Stage 6 instructions.');
}

export function extractStageSixProtectedUrls(response) {
  const urls = [];
  const addUrl = value => {
    if (typeof value !== 'string' || !/^https:\/\//i.test(value)) return;
    try {
      urls.push(normalizeUrl(value));
    } catch {
      // Invalid URL evidence is ignored and can never satisfy source validation.
    }
  };
  const addRecords = records => {
    for (const record of Array.isArray(records) ? records : []) {
      addUrl(record?.url);
      addUrl(record?.link);
    }
  };
  for (const item of response?.output || []) {
    if (item?.type === 'web_search_call') {
      addUrl(item.action?.url);
      addUrl(item.action?.page_url);
      addRecords(item.action?.sources);
      addRecords(item.action?.results);
      addRecords(item.results);
    }
    if (item?.type === 'message') {
      for (const part of item.content || []) {
        for (const annotation of part?.annotations || []) {
          if (annotation?.type !== 'url_citation') continue;
          addUrl(annotation.url);
          addUrl(annotation.url_citation?.url);
        }
      }
    }
  }
  return [...new Set(urls)];
}

function searchActionSummary(response) {
  const actions = (response?.output || [])
    .filter(item => item?.type === 'web_search_call')
    .map(item => clean(item.action?.type) || 'unknown');
  return actions.length ? [...new Set(actions)].join(', ') : 'none';
}

function containsCredential(value) {
  return /AKIA[0-9A-Z]{12,}|aws_secret_access_key|-----BEGIN [A-Z ]*PRIVATE KEY-----/i.test(value);
}

function directsIamPolicyChange(taskProposal) {
  const values = taskProposal.consoleSteps.flatMap(step => [
    step.title,
    step.expectedResult,
    step.warning,
    ...step.instructions.flatMap(instruction => [instruction.text, instruction.detail])
  ]);
  return values.some(value => clean(value).split(/[.!?]+/).some(sentence => {
    if (!/\b(?:iam\s+)?polic(?:y|ies)\b/i.test(sentence)) return false;
    const action = /\b(create|write|add|attach|edit|generate|recommend)\b/i.exec(sentence);
    if (!action) return false;
    const prefix = sentence.slice(Math.max(0, action.index - 80), action.index);
    return !/\b(do not|don't|must not|should not|never|without)\b/i.test(prefix);
  }));
}

function validateStageSixProposal(session, acceptedSources, blueprint, proposal, protectedUrls, selectedTaskIds = null, alignment = null) {
  const selectedSet = new Set(selectedTaskIds || blueprint.tasks.map(task => task.id));
  const expectedTasks = blueprint.tasks.filter(task => selectedSet.has(task.id));
  if (!Array.isArray(proposal?.tasks) || proposal.tasks.length !== expectedTasks.length) {
    throw new Error('Stage 6 must return every accepted blueprint task exactly once.');
  }
  if (!Array.isArray(proposal.manualReviewFindings)) throw new Error('Stage 6 manual review findings are missing.');
  const acceptedUrls = new Set(acceptedSources.sources.map(source => normalizeUrl(source.url)));
  const protectedSourceSet = new Set(protectedUrls);
  const blueprintTaskById = new Map(blueprint.tasks.map(task => [task.id, task]));
  const sourceById = new Map(blueprint.sources.map(source => [source.id, source]));
  const seenTaskIds = new Set();

  proposal.tasks.forEach((taskProposal, index) => {
    const expectedTask = expectedTasks[index];
    if (taskProposal.taskId !== expectedTask.id || seenTaskIds.has(taskProposal.taskId)) {
      throw new Error('Stage 6 tasks must be unique and remain in the accepted blueprint order.');
    }
    seenTaskIds.add(taskProposal.taskId);
    if (!TASK_STATUSES.includes(taskProposal.status) || !Array.isArray(taskProposal.consoleSteps)) {
      throw new Error('A Stage 6 task has an invalid preparation status.');
    }
    if (taskProposal.status === 'needs_manual_review') {
      if (!clean(taskProposal.manualReviewReason) || taskProposal.consoleSteps.length) {
        throw new Error('A task needing manual review must contain a reason and no instructions.');
      }
      return;
    }
    if (clean(taskProposal.manualReviewReason) || !taskProposal.consoleSteps.length) {
      throw new Error('A prepared Stage 6 task must contain instructions without a manual-review reason.');
    }
    if (
      alignment?.boundaries?.createOrRecommendIamPolicy === false
      && directsIamPolicyChange(taskProposal)
    ) {
      throw new Error('Step 84B must not create or recommend an IAM policy.');
    }
    const task = blueprintTaskById.get(taskProposal.taskId);
    const taskSourceUrls = new Set(task.sourceIds.map(sourceId => sourceById.get(sourceId)?.url).filter(Boolean).map(normalizeUrl));
    taskProposal.consoleSteps.forEach(step => {
      if (![step.title, step.expectedResult].every(clean) || !Array.isArray(step.instructions) || !step.instructions.length) {
        throw new Error('Every prepared Console step needs a title, checkbox instructions and expected result.');
      }
      if (!Array.isArray(step.sourceUrls) || !step.sourceUrls.length || new Set(step.sourceUrls).size !== step.sourceUrls.length) {
        throw new Error('Every prepared Console step needs unique accepted source evidence.');
      }
      step.sourceUrls.forEach(sourceUrl => {
        const normalized = normalizeUrl(sourceUrl);
        if (!acceptedUrls.has(normalized) || !taskSourceUrls.has(normalized)) {
          throw new Error('A Stage 6 instruction used a source outside its accepted task boundary.');
        }
        if (!protectedSourceSet.has(normalized)) {
          throw new Error('A Stage 6 instruction source was not returned by protected AWS Docs search.');
        }
      });
      step.instructions.forEach(instruction => {
        if (!clean(instruction.text) || /[\r\n]/.test(instruction.text)) {
          throw new Error('Every checkbox must contain one short editable learner action.');
        }
        if (containsCredential(`${instruction.text} ${instruction.detail}`)) {
          throw new Error('A Stage 6 instruction contains credential-like text.');
        }
      });
    });
  });
  return proposal;
}

function localInstructionDocument(
  session,
  acceptedSources,
  blueprint,
  proposal,
  protectedUrls,
  responseId,
  model,
  now,
  { existingInstructions = null, alignment = null } = {}
) {
  let draft = {
    ...blueprint,
    tasks: blueprint.tasks.map(task => ({
      ...task,
      modeAvailability: {
        console: { status: 'not_applicable', reason: 'Console instructions have not been prepared.' },
        cli: { status: 'not_applicable', reason: 'CLI instructions are outside approved Step 84.' }
      },
      consoleSteps: [],
      cliSteps: []
    }))
  };
  const sourceIdByUrl = new Map(blueprint.sources.map(source => [normalizeUrl(source.url), source.id]));
  const taskResults = [];
  for (const taskProposal of proposal.tasks) {
    if (taskProposal.status === 'needs_manual_review') {
      const unavailable = setAuthorTaskMode(
        draft,
        taskProposal.taskId,
        'console',
        'not_applicable',
        clean(taskProposal.manualReviewReason)
      );
      if (!unavailable.success) throw new Error(unavailable.error);
      draft = unavailable.draft;
      taskResults.push({ taskId: taskProposal.taskId, status: taskProposal.status, manualReviewReason: clean(taskProposal.manualReviewReason) });
      continue;
    }
    let result = setAuthorTaskMode(draft, taskProposal.taskId, 'console', 'available');
    if (!result.success) throw new Error(result.error);
    draft = result.draft;
    for (const stepProposal of taskProposal.consoleSteps) {
      const [first, ...remaining] = stepProposal.instructions;
      result = addAuthorInstructionStep(draft, taskProposal.taskId, 'console', {
        title: stepProposal.title,
        instruction: first.text,
        detail: first.detail,
        expectedResult: stepProposal.expectedResult,
        warning: stepProposal.warning
      });
      if (!result.success) throw new Error(result.error);
      draft = result.draft;
      const stepId = result.step.id;
      for (const instruction of remaining) {
        result = addAuthorInstructionItem(draft, taskProposal.taskId, stepId, instruction);
        if (!result.success) throw new Error(result.error);
        draft = result.draft;
      }
      draft = {
        ...draft,
        tasks: draft.tasks.map(task => task.id !== taskProposal.taskId ? task : {
          ...task,
          consoleSteps: task.consoleSteps.map(step => step.id !== stepId ? step : {
            ...step,
            sourceIds: stepProposal.sourceUrls.map(url => sourceIdByUrl.get(normalizeUrl(url)))
          })
        })
      };
    }
    taskResults.push({ taskId: taskProposal.taskId, status: taskProposal.status, manualReviewReason: '' });
  }
  return {
    schemaVersion: AUTHOR_ASSISTANT_SCHEMA_VERSION,
    kind: 'author_stage_6_local_instructions',
    status: 'awaiting_human_stage_6_review',
    sessionId: session.sessionId,
    responseId: clean(responseId),
    model,
    generatedAt: now().toISOString(),
    basedOnBlueprintGeneratedAt: blueprint.generatedAt,
    stageBoundary: {
      preparedLocally: [6],
      notPrepared: [7, 8, 9, 10, 11, 12],
      writtenToAuthor: false,
      connectedToSupabase: false,
      connectedToAws: false,
      candidatePrepared: false,
      published: false
    },
    tasks: draft.tasks.map(task => {
      const result = taskResults.find(item => item.taskId === task.id);
      if (!result) {
        const existingTask = existingInstructions?.tasks?.find(item => item.taskId === task.id);
        if (!existingTask) throw new Error('A Stage 6 revision did not preserve an unaffected task.');
        return existingTask;
      }
      return {
        taskId: task.id,
        title: task.title,
        status: result.status,
        manualReviewReason: result.manualReviewReason,
        modeAvailability: task.modeAvailability,
        consoleSteps: task.consoleSteps,
        cliSteps: []
      };
    }),
    protectedSourceUrlsUsed: [...new Set([
      ...(existingInstructions?.protectedSourceUrlsUsed || []),
      ...proposal.tasks.flatMap(task => task.consoleSteps.flatMap(step => step.sourceUrls))
    ].map(normalizeUrl))],
    protectedSearchSourceCount: protectedUrls.length,
    manualReviewFindings: alignment
      ? [...alignment.canonicalManualReviewFindings]
      : [...new Set([...(blueprint.manualReviewFindings || []), ...proposal.manualReviewFindings.map(clean).filter(Boolean)])],
    ...(alignment ? {
      boundaryAlignment: {
        alignmentId: alignment.alignmentId,
        approvalStep: alignment.approvalStep,
        appliedAt: now().toISOString(),
        affectedTaskIds: [...alignment.affectedTaskIds],
        futureCliGuidance: {
          ...(existingInstructions?.boundaryAlignment?.futureCliGuidance || {}),
          ...Object.fromEntries(alignment.affectedTaskIds.map(taskId => [
            taskId,
            clean(alignment.taskBoundaries[taskId].futureCliGuidance)
          ]))
        },
        stage8CleanupGuidance: {
          ...(existingInstructions?.boundaryAlignment?.stage8CleanupGuidance || {}),
          ...Object.fromEntries(alignment.affectedTaskIds.map(taskId => [
            taskId,
            clean(alignment.taskBoundaries[taskId].stage8CleanupGuidance)
          ]).filter(([, guidance]) => guidance))
        },
        pendingSourceCandidates: alignment.pendingSourceCandidates.map(source => ({ ...source })),
        alignmentHistory: [
          ...(existingInstructions?.boundaryAlignment?.alignmentHistory || []),
          ...(existingInstructions?.boundaryAlignment ? [{
            alignmentId: existingInstructions.boundaryAlignment.alignmentId,
            approvalStep: existingInstructions.boundaryAlignment.approvalStep,
            appliedAt: existingInstructions.boundaryAlignment.appliedAt
          }] : [])
        ]
      }
    } : {})
  };
}

export function formatStageSixPreview(document) {
  const lines = [
    `AUTHOR STAGE 6 LOCAL INSTRUCTIONS - ${document.tasks.length} TASKS`,
    '',
    'CHECKBOX INSTRUCTIONS'
  ];
  document.tasks.forEach((task, taskIndex) => {
    const checkboxCount = task.consoleSteps.reduce((total, step) => total + step.instructions.length, 0);
    lines.push('', `${taskIndex + 1}. ${task.title}`);
    if (task.status === 'needs_manual_review') lines.push(`   Needs manual review: ${task.manualReviewReason}`);
    else lines.push(`   Console steps: ${task.consoleSteps.length}`, `   Separate editable checkboxes: ${checkboxCount}`);
  });
  lines.push(
    '',
    `Protected accepted AWS sources used: ${document.protectedSourceUrlsUsed.length}`,
    '',
    'NOT PREPARED',
    'Stages 7-12 have not been prepared.',
    'Nothing was written to Author, Supabase or AWS.',
    ''
  );
  return lines.join('\n');
}

export async function requestStageSixInstructions({
  session,
  acceptedSources,
  blueprint,
  apiKey,
  model = DEFAULT_AUTHOR_ASSISTANT_MODEL,
  fetchImpl = globalThis.fetch,
  now = () => new Date(),
  existingInstructions = null,
  alignment = null
} = {}) {
  if (!clean(apiKey)) throw new Error('OPENAI_API_KEY is not configured. No Stage 6 request was made.');
  if (typeof fetchImpl !== 'function') throw new Error('Secure network access is unavailable.');
  const payload = buildStageSixPayload(session, acceptedSources, blueprint, { model, alignment, existingInstructions });
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
  const protectedUrls = extractStageSixProtectedUrls(apiResponse);
  if (!protectedUrls.length) {
    throw new Error(`Protected AWS Docs search returned no readable source URLs for Stage 6. Search actions seen: ${searchActionSummary(apiResponse)}.`);
  }
  let proposal;
  try {
    proposal = JSON.parse(extractOutputText(apiResponse));
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error('The Stage 6 response was not valid structured JSON.');
    throw error;
  }
  const selectedTaskIds = alignment?.affectedTaskIds || null;
  validateStageSixProposal(session, acceptedSources, blueprint, proposal, protectedUrls, selectedTaskIds, alignment);
  return localInstructionDocument(
    session,
    acceptedSources,
    blueprint,
    proposal,
    protectedUrls,
    apiResponse.id,
    model,
    now,
    { existingInstructions, alignment }
  );
}
