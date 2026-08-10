import { readFile } from 'node:fs/promises';
import path from 'node:path';

const SELECT = 'programme_id,candidate_id,source_revision,content_hash,runtime_content,published_at';

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function parseAuthorAssistantEnv(text = '') {
  const values = {};
  for (const rawLine of String(text).split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const separator = line.indexOf('=');
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    values[key] = value;
  }
  return values;
}

export function normalizePublishedFollowAlong(row) {
  const programme = row?.runtime_content?.programme || {};
  const programmeId = clean(row?.programme_id || programme.programmeId);
  const displayName = clean(programme.displayName);
  const serviceName = clean(programme.serviceName);
  const shortName = clean(programme.shortName);
  const serviceSlug = clean(programme.serviceSlug);
  if (!programmeId || !displayName || !serviceName || !shortName || !serviceSlug || !row?.runtime_content) return null;
  return {
    programmeId,
    displayName,
    serviceName,
    shortName,
    serviceSlug,
    sourceRevision: Number(row.source_revision),
    candidateId: clean(row.candidate_id),
    contentHash: clean(row.content_hash),
    publishedAt: clean(row.published_at),
    runtimeContent: row.runtime_content
  };
}

export async function loadPublishedFollowAlongCatalogue({
  projectRoot = process.cwd(),
  environment = process.env,
  fetchImpl = globalThis.fetch,
  timeoutMs = 15000
} = {}) {
  let fileEnvironment = {};
  try {
    fileEnvironment = parseAuthorAssistantEnv(await readFile(path.join(projectRoot, '.env.local'), 'utf8'));
  } catch {
    // Environment variables may be supplied directly.
  }
  const url = clean(environment.VITE_SUPABASE_URL || fileEnvironment.VITE_SUPABASE_URL).replace(/\/$/, '');
  const key = clean(environment.VITE_SUPABASE_PUBLISHABLE_KEY || fileEnvironment.VITE_SUPABASE_PUBLISHABLE_KEY);
  if (!url || !key) throw new Error('The published Follow Along list is unavailable because .env.local is missing the Supabase URL or publishable key.');

  let response;
  try {
    response = await fetchImpl(`${url}/rest/v1/follow_along_published_programmes?select=${encodeURIComponent(SELECT)}&order=published_at.asc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(timeoutMs)
    });
  } catch (error) {
    throw new Error(`The published Follow Along list could not be reached: ${error?.message || 'connection failed'}`);
  }
  if (!response?.ok) throw new Error(`The published Follow Along list returned HTTP ${response?.status || 'error'}. Nothing was generated.`);
  const rows = await response.json();
  const programmes = (Array.isArray(rows) ? rows : []).map(normalizePublishedFollowAlong).filter(Boolean);
  if (!programmes.length) throw new Error('No controlled published Follow Alongs are currently available to update.');
  return programmes;
}
