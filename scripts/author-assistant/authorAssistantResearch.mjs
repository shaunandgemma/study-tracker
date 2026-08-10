import { AUTHOR_ASSISTANT_ALLOWED_DOMAINS, AUTHOR_ASSISTANT_SCHEMA_VERSION } from './authorAssistantCore.mjs';

export const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
export const DEFAULT_AUTHOR_ASSISTANT_MODEL = 'gpt-5.6-terra';

const SOURCE_TYPES = Object.freeze(['service_guide', 'cli_reference', 'service_authorization']);

function buildResearchSchema(allowedSourceUrls) {
  const urlSchema = Array.isArray(allowedSourceUrls)
    ? { type: 'string', enum: allowedSourceUrls }
    : { type: 'string' };
  return {
    type: 'object',
    properties: {
      summary: { type: 'string' },
      proposedSources: {
        type: 'array',
        minItems: 3,
        maxItems: 12,
        items: {
          type: 'object',
          properties: {
            sourceType: { type: 'string', enum: SOURCE_TYPES },
            documentTitle: { type: 'string' },
            url: urlSchema,
            supports: { type: 'array', minItems: 1, items: { type: 'string' } },
            whyThisSourceApplies: { type: 'string' }
          },
          required: ['sourceType', 'documentTitle', 'url', 'supports', 'whyThisSourceApplies'],
          additionalProperties: false
        }
      },
      manualReviewFindings: { type: 'array', items: { type: 'string' } }
    },
    required: ['summary', 'proposedSources', 'manualReviewFindings'],
    additionalProperties: false
  };
}

const RESEARCH_SCHEMA = buildResearchSchema();

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isOfficialAwsDocsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === 'docs.aws.amazon.com' || url.hostname.endsWith('.docs.aws.amazon.com'));
  } catch {
    return false;
  }
}

function normalizedUrl(value) {
  const url = new URL(value);
  url.hash = '';
  url.search = '';
  return url.toString().replace(/\/$/, '');
}

function extractOutputText(response) {
  for (const item of response?.output || []) {
    if (item?.type !== 'message') continue;
    for (const part of item.content || []) {
      if (part?.type === 'output_text' && clean(part.text)) return part.text;
    }
  }
  throw new Error('The AI response did not contain structured research text.');
}

function extractWebSearchSources(response) {
  const sources = [];
  for (const item of response?.output || []) {
    if (item?.type === 'web_search_call') sources.push(...(item.action?.sources || []));
    if (item?.type === 'message') {
      for (const part of item.content || []) {
        for (const annotation of part?.annotations || []) {
          if (annotation?.type === 'url_citation') sources.push({ title: annotation.title, url: annotation.url });
        }
      }
    }
  }
  return sources.filter(source => isOfficialAwsDocsUrl(source?.url));
}

function uniqueProtectedSources(sources) {
  const unique = new Map();
  for (const source of sources) {
    if (!isOfficialAwsDocsUrl(source?.url)) continue;
    const url = normalizedUrl(source.url);
    if (!unique.has(url)) unique.set(url, { title: clean(source.title), url });
  }
  return [...unique.values()];
}

function hasUnmatchedProtectedSource(proposal, webSearchSources) {
  const returnedUrls = new Set(webSearchSources.map(source => normalizedUrl(source.url)));
  return proposal?.proposedSources?.some(source => (
    isOfficialAwsDocsUrl(source?.url) && !returnedUrls.has(normalizedUrl(source.url))
  ));
}

export function formatOpenAiRequestError(status, apiError = {}) {
  const code = clean(apiError?.code) || clean(apiError?.type) || 'unknown';
  const guidance = {
    credit_balance_exhausted: 'The API credit balance is empty. Add API credits before retrying.',
    organization_spend_limit_exceeded: 'The organization spend limit has been reached. Review the organization limit before retrying.',
    project_spend_limit_exceeded: 'The project spend limit has been reached. Review the project limit before retrying.',
    organization_usage_limit_exceeded: 'The organization usage limit has been reached. Review the approved usage limit before retrying.',
    insufficient_quota: 'API quota is unavailable. Check API credits and organization or project spend limits before retrying.',
    rate_limit_exceeded: 'The request rate limit was reached. Wait before retrying.'
  }[code] || (Number(status) === 429
    ? 'Check API credits and organization or project limits. If those are available, wait before retrying.'
    : 'Review the API project access and request settings before retrying.');
  return `OpenAI research request failed (HTTP ${status || 'unknown'}, code ${code}). ${guidance}`;
}

export function buildOpenAiResearchPayload(researchRequest, { model = DEFAULT_AUTHOR_ASSISTANT_MODEL } = {}) {
  if (JSON.stringify(researchRequest?.allowedDomains) !== JSON.stringify(AUTHOR_ASSISTANT_ALLOWED_DOMAINS)) {
    throw new Error('The research request must allow only docs.aws.amazon.com.');
  }

  return {
    model,
    store: false,
    reasoning: { effort: 'low' },
    tools: [{ type: 'web_search', filters: { allowed_domains: [...AUTHOR_ASSISTANT_ALLOWED_DOMAINS] } }],
    tool_choice: 'auto',
    include: ['web_search_call.action.sources'],
    instructions: [
      'Research an AWS Follow Along using only the allowed official AWS documentation domain.',
      'Return only pages you actually found through web search.',
      'Copy every proposed source URL exactly from the web search results; do not rewrite or canonicalize URLs.',
      'Find the service guide for Console steps, the AWS CLI Command Reference, and the AWS Service Authorization Reference.',
      'Do not invent commands, permissions, URLs or unsupported facts.',
      'Put uncertainty or missing coverage in manualReviewFindings.'
    ].join(' '),
    input: [
      `AWS service: ${researchRequest.service.officialName} (${researchRequest.service.shortName}).`,
      `Learner level: ${researchRequest.learner.level}.`,
      `Learner outcome: ${researchRequest.learner.buildOutcome}`,
      `Preferred Region: ${researchRequest.learner.preferredRegion}.`,
      `Required coverage: ${researchRequest.requiredSourceTypes.join('; ')}.`
    ].join('\n'),
    text: {
      format: {
        type: 'json_schema',
        name: 'aws_follow_along_source_research',
        strict: true,
        schema: RESEARCH_SCHEMA
      }
    }
  };
}

export function buildProtectedSourceCorrectionPayload(researchRequest, webSearchSources, { model = DEFAULT_AUTHOR_ASSISTANT_MODEL } = {}) {
  const protectedSources = uniqueProtectedSources(webSearchSources);
  if (protectedSources.length < 3) {
    throw new Error('The protected web search did not return enough official AWS sources for correction.');
  }
  const allowedSourceUrls = protectedSources.map(source => source.url);
  return {
    model,
    store: false,
    reasoning: { effort: 'low' },
    instructions: [
      'Select and classify AWS Follow Along sources only from the protected source list supplied by the application.',
      'Copy each selected URL exactly. The response schema prevents any other URL.',
      'Select at least one service guide, one AWS CLI Command Reference, and one AWS Service Authorization Reference.',
      'Do not invent commands, permissions, URLs or unsupported facts.',
      'Put uncertainty or missing coverage in manualReviewFindings.'
    ].join(' '),
    input: [
      `AWS service: ${researchRequest.service.officialName} (${researchRequest.service.shortName}).`,
      `Learner level: ${researchRequest.learner.level}.`,
      `Learner outcome: ${researchRequest.learner.buildOutcome}`,
      `Preferred Region: ${researchRequest.learner.preferredRegion}.`,
      'Protected sources returned by the restricted AWS Docs search:',
      JSON.stringify(protectedSources)
    ].join('\n'),
    text: {
      format: {
        type: 'json_schema',
        name: 'aws_follow_along_protected_source_correction',
        strict: true,
        schema: buildResearchSchema(allowedSourceUrls)
      }
    }
  };
}

async function sendOpenAiRequest(payload, apiKey, fetchImpl) {
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
      // The status and safe fallback guidance remain available without a JSON body.
    }
    throw new Error(formatOpenAiRequestError(response?.status, apiError));
  }
  const apiResponse = await response.json();
  if (apiResponse?.error) throw new Error('OpenAI returned an error before research completed.');
  return apiResponse;
}

export function validateResearchProposal(proposal, webSearchSources) {
  if (!clean(proposal?.summary)) throw new Error('The research summary is missing.');
  if (!Array.isArray(proposal?.proposedSources) || proposal.proposedSources.length < 3) {
    throw new Error('Research must provide at least three official AWS sources.');
  }
  if (!Array.isArray(proposal?.manualReviewFindings)) throw new Error('Manual review findings are missing.');

  const citedUrls = new Set(webSearchSources.map(source => normalizedUrl(source.url)));
  const seen = new Set();
  for (const source of proposal.proposedSources) {
    if (!SOURCE_TYPES.includes(source?.sourceType)) throw new Error('A proposed source has an invalid source type.');
    if (!clean(source?.documentTitle) || !clean(source?.whyThisSourceApplies)) throw new Error('A proposed source is incomplete.');
    if (!Array.isArray(source?.supports) || !source.supports.some(clean)) throw new Error('A proposed source must explain what it supports.');
    if (!isOfficialAwsDocsUrl(source?.url)) throw new Error('A proposed source is outside docs.aws.amazon.com.');
    const url = normalizedUrl(source.url);
    if (!citedUrls.has(url)) throw new Error('A proposed source was not returned by the protected web search.');
    if (seen.has(url)) throw new Error('The research contains a duplicate source URL.');
    seen.add(url);
  }
  for (const requiredType of SOURCE_TYPES) {
    if (!proposal.proposedSources.some(source => source.sourceType === requiredType)) {
      throw new Error(`Research is missing the required ${requiredType} source.`);
    }
  }
  return proposal;
}

export async function requestAwsDocumentationResearch({
  researchRequest,
  apiKey,
  model = DEFAULT_AUTHOR_ASSISTANT_MODEL,
  fetchImpl = globalThis.fetch,
  now = () => new Date()
} = {}) {
  if (!clean(apiKey)) throw new Error('OPENAI_API_KEY is not configured. No AI request was made.');
  if (typeof fetchImpl !== 'function') throw new Error('Secure network access is unavailable.');

  const payload = buildOpenAiResearchPayload(researchRequest, { model });
  const apiResponse = await sendOpenAiRequest(payload, apiKey, fetchImpl);
  const webSearchSources = extractWebSearchSources(apiResponse);
  if (!webSearchSources.length) throw new Error('The protected web search returned no official AWS sources.');

  let proposal;
  try {
    proposal = JSON.parse(extractOutputText(apiResponse));
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error('The AI research result was not valid structured JSON.');
    throw error;
  }
  let protectedSourceCorrectionApplied = false;
  let protectedSourceCorrectionResponseId = '';
  if (hasUnmatchedProtectedSource(proposal, webSearchSources)) {
    const correctionPayload = buildProtectedSourceCorrectionPayload(researchRequest, webSearchSources, { model });
    const correctionResponse = await sendOpenAiRequest(correctionPayload, apiKey, fetchImpl);
    try {
      proposal = JSON.parse(extractOutputText(correctionResponse));
    } catch (error) {
      if (error instanceof SyntaxError) throw new Error('The protected source correction was not valid structured JSON.');
      throw error;
    }
    protectedSourceCorrectionApplied = true;
    protectedSourceCorrectionResponseId = clean(correctionResponse.id);
  }
  validateResearchProposal(proposal, webSearchSources);

  const checkedAt = now().toISOString();
  return {
    schemaVersion: AUTHOR_ASSISTANT_SCHEMA_VERSION,
    kind: 'aws_documentation_research_result',
    status: 'awaiting_source_acceptance',
    sessionId: researchRequest.sessionId,
    responseId: clean(apiResponse.id),
    model,
    protectedSourceCorrectionApplied,
    protectedSourceCorrectionResponseId,
    completedAt: checkedAt,
    allowedDomains: [...AUTHOR_ASSISTANT_ALLOWED_DOMAINS],
    summary: clean(proposal.summary),
    proposedSources: proposal.proposedSources.map(source => ({
      sourceType: source.sourceType,
      documentTitle: clean(source.documentTitle),
      url: normalizedUrl(source.url),
      checkedAt,
      supports: source.supports.map(clean).filter(Boolean),
      whyThisSourceApplies: clean(source.whyThisSourceApplies)
    })),
    manualReviewFindings: proposal.manualReviewFindings.map(clean).filter(Boolean)
  };
}

export function buildAcceptedSourcesDocument(researchResult, acceptedUrls, { now = () => new Date() } = {}) {
  const accepted = new Set((acceptedUrls || []).map(normalizedUrl));
  return {
    schemaVersion: AUTHOR_ASSISTANT_SCHEMA_VERSION,
    kind: 'accepted_aws_documentation_sources',
    status: accepted.size ? 'accepted' : 'needs_review',
    sessionId: researchResult.sessionId,
    acceptedAt: now().toISOString(),
    sources: researchResult.proposedSources.filter(source => accepted.has(normalizedUrl(source.url))),
    rejectedSourceUrls: researchResult.proposedSources
      .filter(source => !accepted.has(normalizedUrl(source.url)))
      .map(source => source.url),
    manualReviewFindings: [...researchResult.manualReviewFindings]
  };
}
