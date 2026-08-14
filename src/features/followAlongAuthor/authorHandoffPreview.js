const HANDOFF_MAX_FILE_BYTES = 2 * 1024 * 1024;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function cleanFingerprint(value) {
  return String(value || '').trim().toLowerCase();
}

async function sha256Json(value, cryptoImpl = globalThis.crypto) {
  if (!cryptoImpl?.subtle?.digest) throw new Error('Secure browser fingerprint checking is unavailable.');
  const bytes = new TextEncoder().encode(stableStringify(value));
  const digest = await cryptoImpl.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export function fingerprintAuthorHandoffJson(value, cryptoImpl = globalThis.crypto) {
  return sha256Json(value, cryptoImpl);
}

function handoffFingerprintContent(handoffPackage) {
  const content = structuredClone(handoffPackage || {});
  delete content.status;
  delete content.preparedAt;
  delete content.handoffFingerprint;
  return content;
}

function acceptanceFingerprintContent(acceptance) {
  const content = structuredClone(acceptance || {});
  delete content.acceptedAt;
  delete content.acceptanceAuditFingerprint;
  return content;
}

function countContent(content) {
  const tasks = content?.tasks || [];
  const sources = content?.sources || [];
  return {
    phaseCount: (content?.phases || []).length,
    taskCount: tasks.length,
    checkboxCount: tasks.flatMap(task => task.consoleSteps || []).flatMap(step => step.instructions || []).length,
    verificationCheckCount: tasks.flatMap(task => task.verification || []).length,
    cleanupItemCount: tasks.flatMap(task => task.cleanup || []).length + (content?.cleanup?.steps || []).length,
    learnerResourceValueCount: content?.resources?.schema?.length || 0,
    officialAwsSourceCount: sources.filter(source => source?.publisher === 'AWS').length
  };
}

function sameCounts(actual, expected) {
  return Object.entries(actual).every(([key, value]) => expected?.[key] === value);
}

function assertReadOnlyBoundaries(handoffPackage, acceptance) {
  const identity = handoffPackage.identityBinding || {};
  const boundary = handoffPackage.handoffBoundary || {};
  if (
    identity.status !== 'required_before_author_write'
    || identity.assignedAuthorId !== null
    || identity.assignedDraftId !== null
    || identity.assignedRevision !== null
    || boundary.localPackageOnly !== true
    || boundary.stage12Started !== false
    || boundary.authorDraftWritten !== false
    || boundary.authorIdentityBound !== false
    || boundary.connectedToAuthor !== false
    || boundary.connectedToSupabase !== false
    || boundary.connectedToAws !== false
    || boundary.releaseCandidatePrepared !== false
    || boundary.candidateIdGenerated !== false
    || boundary.approvalPerformed !== false
    || boundary.published !== false
    || acceptance.packageChanged !== false
    || acceptance.authorIdentityBound !== false
    || acceptance.wroteToAuthor !== false
    || acceptance.connectedToSupabase !== false
    || acceptance.connectedToAws !== false
    || acceptance.preparedReleaseCandidate !== false
    || acceptance.generatedCandidateId !== false
    || acceptance.approved !== false
    || acceptance.published !== false
    || acceptance.beganStage12 !== false
  ) throw new Error('The selected files do not preserve the required read-only handoff boundary.');
}

export async function readAuthorHandoffJsonFile(file, { maxBytes = HANDOFF_MAX_FILE_BYTES } = {}) {
  if (!file || typeof file.text !== 'function') throw new Error('Choose a JSON file.');
  if (Number(file.size) > maxBytes) throw new Error('The selected JSON file is larger than the safe preview limit.');
  let parsed;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    throw new Error('The selected file is not valid JSON.');
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('The selected JSON file does not contain a valid object.');
  return parsed;
}

export async function validateAuthorHandoffImportPreview({ handoffPackage, acceptance, currentUser, cryptoImpl = globalThis.crypto } = {}) {
  if (!currentUser?.id || !currentUser?.email) throw new Error('A signed-in Author is required for the preview.');
  if (
    handoffPackage?.kind !== 'author_local_handoff_package'
    || handoffPackage.status !== 'awaiting_human_handoff_review'
    || acceptance?.kind !== 'author_local_handoff_human_acceptance'
    || acceptance.status !== 'accepted'
    || acceptance.approvalStep !== '90A'
    || acceptance.sessionId !== handoffPackage.sessionId
  ) throw new Error('Choose the matching Step 90 handoff package and Step 90A acceptance audit.');

  const expectedHandoffFingerprint = cleanFingerprint(handoffPackage.handoffFingerprint?.value);
  const expectedAuditFingerprint = cleanFingerprint(acceptance.acceptanceAuditFingerprint?.value);
  if (!SHA256_PATTERN.test(expectedHandoffFingerprint) || !SHA256_PATTERN.test(expectedAuditFingerprint)) {
    throw new Error('A required SHA-256 fingerprint is missing or invalid.');
  }
  const [handoffFingerprint, contentFingerprint, manifestFingerprint, auditFingerprint] = await Promise.all([
    sha256Json(handoffFingerprintContent(handoffPackage), cryptoImpl),
    sha256Json(handoffPackage.authorDraftContent, cryptoImpl),
    sha256Json(handoffPackage.acceptedRecordManifest, cryptoImpl),
    sha256Json(acceptanceFingerprintContent(acceptance), cryptoImpl)
  ]);
  if (
    handoffFingerprint !== expectedHandoffFingerprint
    || cleanFingerprint(acceptance.handoffFingerprint?.value) !== expectedHandoffFingerprint
    || cleanFingerprint(acceptance.authorDraftContentFingerprint?.value) !== contentFingerprint
    || cleanFingerprint(acceptance.acceptedRecordManifestFingerprint?.value) !== manifestFingerprint
    || auditFingerprint !== expectedAuditFingerprint
  ) throw new Error('Fingerprint verification failed. Do not use these files.');

  const manifest = Object.values(handoffPackage.acceptedRecordManifest || {});
  if (!manifest.length || manifest.some(item => item?.algorithm !== 'sha256-json-v1' || !SHA256_PATTERN.test(cleanFingerprint(item.value)))) {
    throw new Error('The accepted Stage 1-11 record manifest is incomplete.');
  }
  const actualCounts = countContent(handoffPackage.authorDraftContent);
  if (!sameCounts(actualCounts, handoffPackage.summary) || !sameCounts(actualCounts, acceptance.acceptedSummary)) {
    throw new Error('The handoff content counts do not match the accepted package.');
  }
  assertReadOnlyBoundaries(handoffPackage, acceptance);

  return {
    valid: true,
    readOnly: true,
    canBindIdentity: false,
    canSaveDraft: false,
    canConnectToSupabase: false,
    canConnectToAws: false,
    canCreateCandidate: false,
    stage12Started: false,
    sessionId: handoffPackage.sessionId,
    programme: {
      programmeId: handoffPackage.authorDraftContent.programme.programmeId,
      displayName: handoffPackage.authorDraftContent.programme.displayName,
      serviceName: handoffPackage.authorDraftContent.programme.serviceName,
      shortName: handoffPackage.authorDraftContent.programme.shortName
    },
    summary: actualCounts,
    handoffFingerprint,
    acceptanceAuditFingerprint: auditFingerprint,
    intendedAuthor: { id: currentUser.id, email: currentUser.email }
  };
}
