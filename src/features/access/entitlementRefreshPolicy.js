const DEFAULT_ERROR = 'Unable to verify exam access.';

export function resolveEntitlementRefreshResult(result) {
  if (result?.success === true && result?.verified === true && Array.isArray(result.rows)) {
    return Object.freeze({
      accepted: true,
      rows: result.rows,
      error: null
    });
  }

  return Object.freeze({
    accepted: false,
    rows: Object.freeze([]),
    error: typeof result?.error === 'string' && result.error.trim()
      ? result.error.trim()
      : DEFAULT_ERROR
  });
}
