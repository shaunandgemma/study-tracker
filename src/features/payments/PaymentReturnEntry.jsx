import React from 'react';
import { ArrowLeft, CheckCircle2, CreditCard, ShieldCheck, XCircle } from 'lucide-react';
import { PublicInformationLinks } from '../publicInformation/PublicInformationLinks.jsx';

const screenContent = Object.freeze({
  success: {
    badge: 'Secure checkout return',
    icon: CheckCircle2,
    iconClass: 'border-emerald-700 bg-emerald-950/70 text-emerald-300',
    title: 'Your sandbox checkout returned successfully',
    description: 'LATT has not assumed that access is active. The signed Stripe webhook and protected entitlement record must confirm the subscription first.',
    note: 'When sandbox payments are enabled, return to your exam workspace after verification to see the updated access status.'
  },
  cancelled: {
    badge: 'Checkout cancelled',
    icon: XCircle,
    iconClass: 'border-amber-700 bg-amber-950/70 text-amber-300',
    title: 'No purchase was completed',
    description: 'You returned before completing Stripe Checkout. LATT has not granted exam access or changed your existing learning progress.',
    note: 'You can safely return to LATT. A new checkout can be started later when sandbox payments are enabled.'
  },
  billing: {
    badge: 'Protected billing return',
    icon: CreditCard,
    iconClass: 'border-indigo-700 bg-indigo-950/70 text-indigo-300',
    title: 'Billing management',
    description: 'This is the safe return screen for the Stripe-hosted billing portal. Billing controls are not enabled during the current local preparation stage.',
    note: 'No subscription, payment method or entitlement can be changed from this screen yet.'
  }
});

export function PaymentReturnEntry({ route, signedIn = false, onReturnHome = () => {} }) {
  const content = screenContent[route] || screenContent.cancelled;
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:py-16">
      <main className="mx-auto max-w-2xl">
        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/35 shadow-2xl">
          <div className="p-6 sm:p-10">
            <div className={`mb-6 inline-flex rounded-2xl border p-3 ${content.iconClass}`}>
              <Icon className="h-7 w-7" aria-hidden="true" />
            </div>

            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-300">{content.badge}</p>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-4xl">{content.title}</h1>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">{content.description}</p>

            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-cyan-900/70 bg-cyan-950/25 p-4 text-sm leading-6 text-cyan-100">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" aria-hidden="true" />
              <div>
                <strong className="block text-white">Access remains server verified</strong>
                <span>{content.note}</span>
              </div>
            </div>

            {!signedIn && (
              <p className="mt-5 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-xs leading-5 text-slate-300">
                You are not currently signed in. Return to LATT and sign in with the account used for Checkout before checking exam access.
              </p>
            )}

            <button
              type="button"
              onClick={onReturnHome}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Return to LATT
            </button>
            <PublicInformationLinks className="mt-7" />
          </div>
        </section>
      </main>
    </div>
  );
}
