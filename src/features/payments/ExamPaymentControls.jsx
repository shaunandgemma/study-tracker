import React, { useState } from 'react';
import { CalendarDays, CreditCard, LoaderCircle, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { formatExamEntitlementExpiry } from '../access/ExamAccessStatus.jsx';
import { annualExamPromotion, formatAnnualExamPrice } from './examPricing.js';
import {
  PAYMENT_RUNTIME_INVOCATION_ENABLED,
  paymentBrowserService
} from './paymentBrowserService.js';
import { getExamPaymentControlPolicy } from './examPaymentControlPolicy.js';
import { PublicInformationLinks } from '../publicInformation/PublicInformationLinks.jsx';

const comparisonPrice = formatAnnualExamPrice(annualExamPromotion.comparisonAmountMinor);
const currentPrice = formatAnnualExamPrice(annualExamPromotion.currentAmountMinor);

function PaymentAction({ children, disabled, loading, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      onClick={onClick}
      className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-extrabold transition ${
        disabled || loading
          ? 'cursor-not-allowed border-slate-700 bg-slate-800/70 text-slate-400'
          : 'border-amber-500/70 bg-amber-500 text-slate-950 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200'
      }`}
    >
      {loading
        ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        : <LockKeyhole className="h-4 w-4" aria-hidden="true" />}
      {children}
    </button>
  );
}

function browserRedirect(url) {
  globalThis.location.assign(url);
}

export const ExamPaymentControls = ({
  accessPolicy,
  examId,
  paymentService = paymentBrowserService,
  redirectTo = browserRedirect,
  runtimeEnabled = PAYMENT_RUNTIME_INVOCATION_ENABLED
}) => {
  const policy = getExamPaymentControlPolicy(accessPolicy, examId, runtimeEnabled);
  const { access } = policy;
  const [actionState, setActionState] = useState({ error: '', loading: false });

  const startProtectedAction = async () => {
    if (!policy.actionEnabled || !policy.action || actionState.loading) return;
    setActionState({ error: '', loading: true });

    try {
      const result = policy.action === 'checkout'
        ? await paymentService.createExamCheckout({ examId })
        : await paymentService.createBillingPortalSession();
      if (!result?.success || !result.url) {
        setActionState({ error: result?.error || 'The protected payment service was unavailable.', loading: false });
        return;
      }
      redirectTo(result.url);
    } catch {
      setActionState({ error: 'The protected payment service was unavailable.', loading: false });
    }
  };

  const actionError = actionState.error && (
    <p className="mt-3 rounded-lg border border-rose-800/70 bg-rose-950/40 px-3 py-2 text-xs leading-5 text-rose-200" role="alert">
      {actionState.error}
    </p>
  );

  if (access.kind === 'staff') {
    return (
      <div className="mt-5 rounded-2xl border border-indigo-800/70 bg-indigo-950/25 p-4 text-xs leading-5 text-indigo-100">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-indigo-300" aria-hidden="true" />
          <span>Trusted staff access is already complete. No purchase or billing action is required.</span>
        </div>
      </div>
    );
  }

  if (access.kind === 'paid') {
    const expiry = formatExamEntitlementExpiry(access.expiresAt);
    return (
      <div className="mt-5 rounded-2xl border border-emerald-800/70 bg-emerald-950/25 p-4">
        <div className="flex items-start gap-2 text-xs leading-5 text-emerald-100">
          <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
          <span>
            This exam has verified paid access{expiry ? ` until ${expiry}` : ''}. Billing is managed only through Stripe’s hosted portal.
          </span>
        </div>
        <PaymentAction
          disabled={!policy.actionEnabled}
          loading={actionState.loading}
          onClick={startProtectedAction}
        >
          {actionState.loading
            ? 'Opening protected billing…'
            : policy.actionEnabled ? 'Manage Billing' : 'Manage Billing — activation pending'}
        </PaymentAction>
        {actionError}
        <PublicInformationLinks compact className="mt-3" />
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-2xl border border-amber-700/60 bg-gradient-to-br from-amber-950/45 to-slate-950/80 p-4">
      <div className="flex items-center gap-2 text-amber-200">
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        <p className="text-[10px] font-black uppercase tracking-wider">Limited-time annual access</p>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <del className="pb-0.5 text-sm font-bold text-slate-500">{comparisonPrice}</del>
        <span className="text-2xl font-black text-white">{currentPrice}</span>
        <span className="pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">per year</span>
      </div>
      <div className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-300">
        <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
        <span>Unlock this exact exam’s complete workspace for twelve months. Other exams remain separate.</span>
      </div>
      <PaymentAction
        disabled={!policy.actionEnabled}
        loading={actionState.loading}
        onClick={startProtectedAction}
      >
        {actionState.loading
          ? 'Opening secure Stripe Checkout…'
          : access.kind === 'demo'
            ? 'Sign in with a learner account to purchase'
            : policy.actionEnabled
              ? `Purchase annual access — ${currentPrice}`
              : 'Purchase annual access — activation pending'}
      </PaymentAction>
      {!runtimeEnabled && (
        <p className="mt-2 text-center text-[10px] leading-4 text-slate-500">
          The protected payment connection remains disabled during local preparation.
        </p>
      )}
      {actionError}
      <p className="mt-3 text-[10px] leading-4 text-slate-400">
        £19.99 is the proposed tax-inclusive annual charge for this exact exam and is designed to renew yearly until cancelled through Stripe’s hosted Customer Portal. Proposed card statement: LATT LEARNING. Seller and professional review remain required before live payments.
      </p>
      <PublicInformationLinks compact className="mt-3" />
    </div>
  );
};
