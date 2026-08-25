export const PUBLIC_INFORMATION_ROUTE_HASHES = Object.freeze({
  privacy: '#legal/privacy',
  refunds: '#legal/refund-cancellation',
  support: '#support',
  terms: '#legal/terms'
});

const publicInformationRouteByHash = new Map(
  Object.entries(PUBLIC_INFORMATION_ROUTE_HASHES).map(([route, hash]) => [hash, route])
);

export function getPublicInformationRoute(location = globalThis.location) {
  const hash = String(location?.hash || '').trim().toLowerCase();
  return publicInformationRouteByHash.get(hash) || null;
}
