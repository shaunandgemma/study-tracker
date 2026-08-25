import { PUBLIC_INFORMATION_ROUTE_HASHES } from './publicInformationRoutes.js';

export const PUBLIC_INFORMATION_PUBLICATION_SCHEMA_VERSION = 2;

export const PUBLIC_INFORMATION_REQUIRED_ROUTES = Object.freeze([
  'terms',
  'privacy',
  'refunds',
  'support'
]);

const requiredDecisions = Object.freeze([
  Object.freeze({ path: 'seller.capacity', label: 'individual seller capacity', type: 'individual' }),
  Object.freeze({ path: 'seller.legalName', label: 'individual seller legal name', type: 'text' }),
  Object.freeze({ path: 'seller.tradingName', label: 'approved trading name', type: 'tradingName' }),
  Object.freeze({ path: 'seller.publicContactAddress', label: 'safe public contact address', type: 'text' }),
  Object.freeze({ path: 'seller.country', label: 'seller country', type: 'uk' }),
  Object.freeze({ path: 'seller.publicContactEmail', label: 'public contact email', type: 'email' }),
  Object.freeze({ path: 'support.monitoredEmail', label: 'monitored support email', type: 'email' }),
  Object.freeze({ path: 'support.responseTarget', label: 'support response target', type: 'text' }),
  Object.freeze({ path: 'support.complaintsRoute', label: 'complaints route', type: 'text' }),
  Object.freeze({ path: 'legal.termsApproved', label: 'Terms legal approval', type: 'true' }),
  Object.freeze({ path: 'legal.refundCancellationApproved', label: 'refund and cancellation legal approval', type: 'true' }),
  Object.freeze({ path: 'legal.reviewRecord', label: 'legal review record', type: 'text' }),
  Object.freeze({ path: 'privacy.controllerIdentityApproved', label: 'privacy controller identity approval', type: 'true' }),
  Object.freeze({ path: 'privacy.lawfulBasisInventoryApproved', label: 'lawful-basis inventory approval', type: 'true' }),
  Object.freeze({ path: 'privacy.rightsAndIcoWordingApproved', label: 'privacy rights and ICO wording approval', type: 'true' }),
  Object.freeze({ path: 'privacy.reviewRecord', label: 'privacy review record', type: 'text' }),
  Object.freeze({ path: 'retention.scheduleApproved', label: 'retention schedule approval', type: 'true' }),
  Object.freeze({ path: 'retention.scheduleReference', label: 'retention schedule reference', type: 'text' }),
  Object.freeze({ path: 'processors.inventoryApproved', label: 'processor inventory approval', type: 'true' }),
  Object.freeze({ path: 'processors.entries', label: 'processor inventory', type: 'processors' }),
  Object.freeze({ path: 'coolingOff.decisionApproved', label: 'cooling-off decision approval', type: 'true' }),
  Object.freeze({ path: 'coolingOff.immediateDigitalAccessWording', label: 'immediate digital-access wording', type: 'text' }),
  Object.freeze({ path: 'tax.priceTreatment', label: 'tax-inclusive price decision', type: 'tax' }),
  Object.freeze({ path: 'tax.customerWording', label: 'customer-facing tax wording', type: 'text' }),
  Object.freeze({ path: 'tax.adviceRecord', label: 'tax decision record', type: 'text' }),
  Object.freeze({ path: 'statementDescriptor.value', label: 'statement descriptor', type: 'descriptor' }),
  Object.freeze({ path: 'statementDescriptor.sellerApproved', label: 'seller statement-descriptor approval', type: 'true' }),
  Object.freeze({ path: 'statementDescriptor.stripeAccepted', label: 'Stripe statement-descriptor acceptance', type: 'true' })
]);

const placeholderPatterns = Object.freeze([
  /(?:OWNER|SELLER)\s+(?:AND\s+PROFESSIONAL\s+)?REVIEW\s+REQUIRED/i,
  /(?:OWNER|SELLER)\s+DECISION\s+REQUIRED/i,
  /NOT\s+APPROVED\s+FOR\s+LIVE\s+SALES/i,
  /(?:OWNER|SELLER)[- ]REVIEW\s+FIELDS?/i,
  /REQUIRES?\s+(?:OWNER|SELLER)\s+REVIEW/i,
  /REVIEW\s+PENDING/i,
  /MUST\s+BE\s+COMPLETED\s+BEFORE/i
]);

const sha256Pattern = /^[a-f0-9]{64}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const descriptorPattern = /^[A-Z0-9 .,'&+\-/]{5,22}$/;

const blockedScreen = route => Object.freeze({
  contentFingerprint: null,
  hash: PUBLIC_INFORMATION_ROUTE_HASHES[route],
  reviewedAt: null,
  status: 'draft'
});

export const PUBLIC_INFORMATION_PUBLICATION_MANIFEST = Object.freeze({
  schemaVersion: PUBLIC_INFORMATION_PUBLICATION_SCHEMA_VERSION,
  publicationStatus: 'blocked',
  screens: Object.freeze({
    terms: blockedScreen('terms'),
    privacy: blockedScreen('privacy'),
    refunds: blockedScreen('refunds'),
    support: blockedScreen('support')
  }),
  seller: Object.freeze({
    capacity: 'individual',
    legalName: null,
    tradingName: 'Learning All Things Tech',
    publicContactAddress: null,
    country: 'United Kingdom',
    publicContactEmail: null
  }),
  support: Object.freeze({
    monitoredEmail: null,
    responseTarget: null,
    complaintsRoute: null
  }),
  legal: Object.freeze({
    termsApproved: false,
    refundCancellationApproved: false,
    reviewRecord: null
  }),
  privacy: Object.freeze({
    controllerIdentityApproved: false,
    lawfulBasisInventoryApproved: false,
    rightsAndIcoWordingApproved: false,
    reviewRecord: null
  }),
  retention: Object.freeze({
    scheduleApproved: false,
    scheduleReference: null
  }),
  processors: Object.freeze({
    inventoryApproved: false,
    entries: Object.freeze([])
  }),
  coolingOff: Object.freeze({
    decisionApproved: false,
    immediateDigitalAccessWording: null
  }),
  tax: Object.freeze({
    priceTreatment: null,
    customerWording: null,
    adviceRecord: null
  }),
  statementDescriptor: Object.freeze({
    value: 'LATT LEARNING',
    sellerApproved: false,
    stripeAccepted: false
  })
});

const getPath = (value, path) => path.split('.').reduce((current, key) => current?.[key], value);
const isNonBlankText = value => typeof value === 'string' && value.trim().length > 0;
const isApprovedDate = value => isNonBlankText(value) && !Number.isNaN(Date.parse(value));

function validateDecision(value, type) {
  if (type === 'true') return value === true;
  if (type === 'email') return isNonBlankText(value) && emailPattern.test(value.trim());
  if (type === 'individual') return value === 'individual';
  if (type === 'tradingName') return value === 'Learning All Things Tech';
  if (type === 'uk') return value === 'United Kingdom';
  if (type === 'tax') return value === 'tax_inclusive' || value === 'tax_exclusive';
  if (type === 'descriptor') return isNonBlankText(value) && descriptorPattern.test(value.trim()) && /[A-Z]/.test(value);
  if (type === 'processors') {
    if (!Array.isArray(value) || value.length < 2) return false;
    const names = value.map(entry => String(entry?.name || '').trim().toLowerCase());
    return names.includes('stripe') && names.includes('supabase') && value.every(entry => (
      isNonBlankText(entry?.name) &&
      isNonBlankText(entry?.purpose) &&
      isNonBlankText(entry?.locationOrTransferSafeguard)
    ));
  }
  return isNonBlankText(value);
}

function containsPlaceholder(value) {
  return placeholderPatterns.some(pattern => pattern.test(String(value || '')));
}

function validatePublicationStructure(
  manifest,
  screenContentByRoute = {}
) {
  const blockers = [];

  if (!manifest || typeof manifest !== 'object') {
    return ['Publication manifest is missing.'];
  }

  if (manifest.schemaVersion !== PUBLIC_INFORMATION_PUBLICATION_SCHEMA_VERSION) {
    blockers.push('Publication manifest schema version is not approved.');
  }

  if (manifest.publicationStatus !== 'approved') {
    blockers.push('Publication manifest status is not approved.');
  }

  for (const requirement of requiredDecisions) {
    if (!validateDecision(getPath(manifest, requirement.path), requirement.type)) {
      blockers.push(`Missing or unapproved ${requirement.label}.`);
    }
  }

  for (const route of PUBLIC_INFORMATION_REQUIRED_ROUTES) {
    const screen = manifest.screens?.[route];
    if (!screen || screen.hash !== PUBLIC_INFORMATION_ROUTE_HASHES[route]) {
      blockers.push(`The ${route} screen does not use its exact approved route.`);
      continue;
    }
    if (screen.status !== 'approved') blockers.push(`The ${route} screen is not approved.`);
    if (!isApprovedDate(screen.reviewedAt)) blockers.push(`The ${route} screen has no valid review date.`);
    if (!sha256Pattern.test(String(screen.contentFingerprint || ''))) {
      blockers.push(`The ${route} screen has no approved SHA-256 content fingerprint.`);
    }

    const content = screenContentByRoute?.[route];
    if (!isNonBlankText(content)) {
      blockers.push(`The ${route} screen content was not supplied for validation.`);
    } else if (containsPlaceholder(content)) {
      blockers.push(`The ${route} screen still contains a review placeholder.`);
    }
  }

  return blockers;
}

export async function fingerprintPublicInformationContent(content) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Publication validation requires Web Crypto SHA-256 support.');
  }
  const bytes = new TextEncoder().encode(String(content));
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('');
}

export async function validatePublicInformationPublicationReadiness(
  manifest,
  screenContentByRoute = {}
) {
  const blockers = validatePublicationStructure(manifest, screenContentByRoute);

  if (manifest && typeof manifest === 'object') {
    for (const route of PUBLIC_INFORMATION_REQUIRED_ROUTES) {
      const screen = manifest.screens?.[route];
      const content = screenContentByRoute?.[route];
      if (!sha256Pattern.test(String(screen?.contentFingerprint || '')) || !isNonBlankText(content)) continue;
      try {
        const actualFingerprint = await fingerprintPublicInformationContent(content);
        if (actualFingerprint !== screen.contentFingerprint) {
          blockers.push(`The ${route} screen content does not match its approved SHA-256 fingerprint.`);
        }
      } catch {
        blockers.push(`The ${route} screen SHA-256 fingerprint could not be verified.`);
      }
    }
  }

  return Object.freeze({
    ready: blockers.length === 0,
    blockers: Object.freeze(blockers)
  });
}

const checkedInGateBlockers = validatePublicationStructure(PUBLIC_INFORMATION_PUBLICATION_MANIFEST);

export const PUBLIC_INFORMATION_PUBLICATION_GATE = Object.freeze({
  ready: false,
  blockers: Object.freeze(checkedInGateBlockers)
});
