import { readFile } from 'node:fs/promises';

const ALIGNMENT_URL = new URL('./alignments/stage84a-sqs-console-boundary.json', import.meta.url);

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function validateStage84AAlignment(alignment, session, blueprint, existingInstructions) {
  if (alignment?.kind !== 'approved_stage_6_instruction_boundary_alignment' || !clean(alignment.alignmentId)) {
    throw new Error('The Step 84A alignment record is invalid.');
  }
  if (
    alignment.service?.officialName !== session?.inputs?.serviceName
    || alignment.service?.shortName !== session?.inputs?.shortName
  ) {
    throw new Error('The Step 84A alignment does not match this service.');
  }
  if (
    session?.status !== 'stage_6_ready_for_review'
    || blueprint?.status !== 'human_accepted'
    || existingInstructions?.status !== 'awaiting_human_stage_6_review'
    || blueprint.sessionId !== session.sessionId
    || existingInstructions.sessionId !== session.sessionId
  ) {
    throw new Error('Step 84A requires the matching human-accepted blueprint and local Stage 6 review files.');
  }
  const boundary = alignment.boundaries;
  if (
    boundary?.writeToAuthor !== false
    || boundary?.connectToSupabase !== false
    || boundary?.connectToAws !== false
    || boundary?.beginStage7 !== false
  ) {
    throw new Error('Step 84A stopped because an approved safety boundary changed.');
  }
  const taskIds = new Set(blueprint.tasks.map(task => task.id));
  if (
    !Array.isArray(alignment.affectedTaskIds)
    || !alignment.affectedTaskIds.length
    || new Set(alignment.affectedTaskIds).size !== alignment.affectedTaskIds.length
    || alignment.affectedTaskIds.some(taskId => !taskIds.has(taskId) || !alignment.taskBoundaries?.[taskId])
  ) {
    throw new Error('Step 84A refers to an unknown or duplicated blueprint task.');
  }
  if (!Array.isArray(alignment.canonicalManualReviewFindings) || alignment.canonicalManualReviewFindings.some(item => !clean(item))) {
    throw new Error('Step 84A canonical review findings are invalid.');
  }
  for (const source of alignment.pendingSourceCandidates || []) {
    const url = new URL(source.url);
    if (url.protocol !== 'https:' || url.hostname !== 'docs.aws.amazon.com' || source.status !== 'pending_human_approval') {
      throw new Error('A Step 84A pending source candidate is invalid.');
    }
  }
  return alignment;
}

export async function loadApprovedStage84AAlignment({ session, blueprint, existingInstructions } = {}) {
  if (session?.inputs?.shortName !== 'SQS' || existingInstructions?.boundaryAlignment?.alignmentId) return null;
  const alignment = JSON.parse(await readFile(ALIGNMENT_URL, 'utf8'));
  return validateStage84AAlignment(alignment, session, blueprint, existingInstructions);
}

export function formatStage84APendingSources(alignment) {
  const sources = alignment?.pendingSourceCandidates || [];
  if (!sources.length) return 'No additional AWS sources are pending approval.';
  return [
    'MISSING AWS SOURCES - HUMAN APPROVAL REQUIRED',
    '',
    ...sources.flatMap((source, index) => [
      `${index + 1}. ${source.documentTitle}`,
      `   ${source.url}`,
      `   Purpose: ${source.supports}`,
      '   Status: Pending - not accepted or used'
    ])
  ].join('\n');
}
