export const annualExamPromotion = Object.freeze({
  billingInterval: 'year',
  currency: 'GBP',
  currentAmountMinor: 1999,
  label: 'Annual subscription price'
});

export function formatAnnualExamPrice(amountMinor, locale = 'en-GB') {
  return new Intl.NumberFormat(locale, {
    currency: annualExamPromotion.currency,
    style: 'currency'
  }).format(amountMinor / 100);
}
