export const PAYMENT_ROUTE_HASHES = Object.freeze({
  billing: '#account/billing',
  cancelled: '#payment/cancelled',
  success: '#payment/success'
});

const paymentRouteByHash = new Map(
  Object.entries(PAYMENT_ROUTE_HASHES).map(([route, hash]) => [hash, route])
);

export function getPaymentRoute(location = globalThis.location) {
  const hash = String(location?.hash || '').trim().toLowerCase();
  return paymentRouteByHash.get(hash) || null;
}
