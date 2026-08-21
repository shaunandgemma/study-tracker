import { PaymentHttpError } from './contracts.mjs';

const JSON_HEADERS = Object.freeze({
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff'
});

export function jsonResponse(status, payload, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders }
  });
}

export function errorResponse(error) {
  if (error instanceof PaymentHttpError) {
    return jsonResponse(error.status, { error: error.code });
  }
  return jsonResponse(503, { error: 'payment_unavailable' });
}

export function methodNotAllowed(allowed) {
  return jsonResponse(405, { error: 'method_not_allowed' }, { Allow: allowed.join(', ') });
}

export function corsHeaders(request, allowedOrigins) {
  const origin = request.headers.get('Origin');
  if (!origin) return { Vary: 'Origin' };
  if (!allowedOrigins.includes(origin)) throw new PaymentHttpError(403, 'origin_not_allowed');
  return {
    'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Origin': origin,
    Vary: 'Origin'
  };
}

export async function readJsonObject(request, { maxBytes = 4096, allowEmpty = false } = {}) {
  const declaredLength = Number(request.headers.get('Content-Length') || 0);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new PaymentHttpError(413, 'request_too_large');
  }

  const raw = await request.text();
  if (raw.length > maxBytes) throw new PaymentHttpError(413, 'request_too_large');
  if (raw.trim() === '' && allowEmpty) return {};

  if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) {
    throw new PaymentHttpError(415, 'json_required');
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
    return parsed;
  } catch {
    throw new PaymentHttpError(400, 'invalid_json');
  }
}

export async function readRawBody(request, { maxBytes = 1024 * 1024 } = {}) {
  const declaredLength = Number(request.headers.get('Content-Length') || 0);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new PaymentHttpError(413, 'request_too_large');
  }
  const raw = await request.text();
  if (raw.length > maxBytes) throw new PaymentHttpError(413, 'request_too_large');
  return raw;
}

export function addHeaders(response, headers) {
  const next = new Headers(response.headers);
  Object.entries(headers).forEach(([key, value]) => next.set(key, value));
  return new Response(response.body, { status: response.status, headers: next });
}
