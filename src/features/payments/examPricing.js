export const annualExamPromotion = Object.freeze({
  billingInterval: 'year',
  comparisonAmountMinor: 2999,
  currency: 'GBP',
  currentAmountMinor: 1999,
  label: 'Limited-time annual price'
});

export function formatAnnualExamPrice(amountMinor, locale = 'en-GB') {
  return new Intl.NumberFormat(locale, {
    currency: annualExamPromotion.currency,
    style: 'currency'
  }).format(amountMinor / 100);
}
