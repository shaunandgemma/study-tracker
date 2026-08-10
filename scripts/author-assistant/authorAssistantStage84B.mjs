import { readFile } from 'node:fs/promises';
import { addAuthorSource, setAuthorSourceTaskLink } from '../../src/features/followAlongAuthor/authorContent.js';

const ALIGNMENT_URL = new URL('./alignments/stage84b-sqs-safe-scope-sources.json', import.meta.url);

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeUrl(value) {
  const url = new URL(value);
  url.hash = '';
  url.search = '';
  return url.toString().replace(/\/$/, '');
}

export function validateStage84BAmendment(amendment, session, acceptedSources, blueprint, existingInstructions) {
  if (amendment?.kind !== 'approved_stage_6_source_amendment' || amendment.approvalStep !== '84B') {
    throw new Error('The Step 84B source amendment is invalid.');
  }
  if (
    amendment.service?.officialName !== session?.inputs?.serviceName
    || amendment.service?.shortName !== session?.inputs?.shortName
  ) {
    throw new Error('The Step 84B source amendment does not match this service.');
  }
  if (
    session?.status !== 'stage_6_ready_for_review'
    || acceptedSources?.status !== 'accepted'
    || blueprint?.status !== 'human_accepted'
    || existingInstructions?.status !== 'awaiting_human_stage_6_review'
    || acceptedSources.sessionId !== session.sessionId
    || blueprint.sessionId !== session.sessionId
    || existingInstructions.sessionId !== session.sessionId
    || existingInstructions.boundaryAlignment?.approvalStep !== '84A'
  ) {
    throw new Error('Step 84B requires the matching completed Step 84A local review files.');
  }
  const boundary = amendment.boundaries;
  if (
    boundary?.writeToAuthor !== false
    || boundary?.connectToSupabase !== false
    || boundary?.connectToAws !== false
    || boundary?.beginStage7 !== false
    || boundary?.createOrRecommendIamPolicy !== false
  ) {
    throw new Error('Step 84B stopped because an approved safety boundary changed.');
  }
  if (amendment.affectedTaskIds?.length !== 1 || !amendment.taskBoundaries?.[amendment.affectedTaskIds[0]]) {
    throw new Error('Step 84B must affect only the approved safe-scope task.');
  }
  const taskId = amendment.affectedTaskIds[0];
  if (!blueprint.tasks.some(task => task.id === taskId)) throw new Error('The Step 84B task is missing from the accepted blueprint.');
  const existingUrls = new Set(acceptedSources.sources.map(source => normalizeUrl(source.url)));
  if (!Array.isArray(amendment.approvedSources) || amendment.approvedSources.length !== 2) {
    throw new Error('Step 84B must contain exactly the two approved AWS sources.');
  }
  for (const source of amendment.approvedSources) {
    const url = new URL(source.url);
    if (
      url.protocol !== 'https:'
      || url.hostname !== 'docs.aws.amazon.com'
      || existingUrls.has(normalizeUrl(source.url))
      || !clean(source.documentTitle)
      || !clean(source.whyThisSourceApplies)
    ) {
      throw new Error('A Step 84B approved source is invalid or already accepted.');
    }
  }
  if (!Array.isArray(amendment.canonicalManualReviewFindings) || amendment.canonicalManualReviewFindings.some(item => !clean(item))) {
    throw new Error('Step 84B canonical review findings are invalid.');
  }
  return amendment;
}

export async function loadApprovedStage84BAmendment({ session, acceptedSources, blueprint, existingInstructions } = {}) {
  if (session?.inputs?.shortName !== 'SQS' || existingInstructions?.boundaryAlignment?.approvalStep !== '84A') return null;
  const amendment = JSON.parse(await readFile(ALIGNMENT_URL, 'utf8'));
  return validateStage84BAmendment(amendment, session, acceptedSources, blueprint, existingInstructions);
}

export function buildStage84BAmendedInputs({ acceptedSources, blueprint, amendment, now = () => new Date() } = {}) {
  const acceptedAt = now().toISOString();
  const amendedAcceptedSources = {
    ...acceptedSources,
    sources: [
      ...acceptedSources.sources,
      ...amendment.approvedSources.map(source => ({ ...source, checkedAt: acceptedAt }))
    ],
    sourceAmendments: [
      ...(acceptedSources.sourceAmendments || []),
      {
        approvalStep: '84B',
        alignmentId: amendment.alignmentId,
        acceptedAt,
        acceptedUrls: amendment.approvedSources.map(source => source.url),
        linkedTaskIds: [...amendment.affectedTaskIds]
      }
    ]
  };

  let amendedBlueprint = structuredClone(blueprint);
  const addedSourceIds = [];
  for (const source of amendment.approvedSources) {
    let result = addAuthorSource(amendedBlueprint, {
      title: source.documentTitle,
      url: source.url,
      purpose: source.whyThisSourceApplies
    });
    if (!result.success) throw new Error(result.error);
    amendedBlueprint = result.draft;
    addedSourceIds.push(result.source.id);
    result = setAuthorSourceTaskLink(amendedBlueprint, result.source.id, amendment.affectedTaskIds[0], true);
    if (!result.success) throw new Error(result.error);
    amendedBlueprint = result.draft;
  }
  amendedBlueprint = {
    ...amendedBlueprint,
    sourceAmendments: [
      ...(blueprint.sourceAmendments || []),
      {
        approvalStep: '84B',
        alignmentId: amendment.alignmentId,
        acceptedAt,
        addedSourceIds,
        linkedTaskIds: [...amendment.affectedTaskIds]
      }
    ]
  };
  return { acceptedSources: amendedAcceptedSources, blueprint: amendedBlueprint, acceptedAt, addedSourceIds };
}

export function formatStage84BSourceDecision(amendment) {
  return [
    'STEP 84B APPROVED AWS SOURCES',
    '',
    ...amendment.approvedSources.flatMap((source, index) => [
      `${index + 1}. ${source.documentTitle}`,
      `   ${source.url}`,
      `   Linked only to: ${amendment.affectedTaskIds[0]}`
    ]),
    '',
    'No IAM policy will be created or recommended.'
  ].join('\n');
}
