import React from 'react';
import { ArrowLeft, CircleHelp, FileText, RefreshCcw, Scale, ShieldCheck, TriangleAlert } from 'lucide-react';
import { PublicInformationLinks } from './PublicInformationLinks.jsx';
import { PUBLIC_INFORMATION_PUBLICATION_GATE } from './publicInformationPublicationReadiness.js';

const annualPriceDisclosure = 'The current offer is £19.99 for one year of access to one selected exact exam. It is designed to renew annually until renewal is cancelled through Stripe’s hosted Customer Portal.';
const reviewRequired = PUBLIC_INFORMATION_PUBLICATION_GATE.ready
  ? 'The publication-readiness manifest is approved.'
  : 'Seller and professional review required before live payments can be enabled.';

const pages = Object.freeze({
  terms: Object.freeze({
    badge: 'Terms of service',
    icon: Scale,
    title: 'Terms for annual exact-exam access',
    summary: annualPriceDisclosure,
    sections: Object.freeze([
      Object.freeze({
        title: 'Seller and contract details',
        paragraphs: Object.freeze([
          'Learning All Things Tech is the trading name used by an individual UK app creator. The seller’s legal name, safe public contact address and monitored support email remain seller-review fields and must be completed before this draft is published.',
          'The paid service provides twelve months of access to the complete learning workspace for one selected exam. AWS SAA-C03, Terraform Associate and CompTIA Security+ are separate purchases and separate entitlements.'
        ])
      }),
      Object.freeze({
        title: 'Price, renewal and cancellation',
        paragraphs: Object.freeze([
          'The current offer is £19.99 per year. The final wording must confirm that this is the total tax-inclusive customer price before live Checkout is enabled.',
          'The subscription is designed to renew automatically each year. A learner can stop a future renewal through Stripe’s hosted Customer Portal. End-of-period cancellation normally keeps verified access active until the paid period ends and does not automatically create a refund.'
        ])
      }),
      Object.freeze({
        title: 'Access and acceptable use',
        paragraphs: Object.freeze([
          'Access is granted only after the signed Stripe webhook and protected entitlement record verify the exact exam. A Checkout return page alone never grants access.',
          'Access is personal to the account holder. Account sharing, redistribution of protected content and attempts to bypass exam-access boundaries are not permitted.'
        ])
      }),
      Object.freeze({
        title: 'Required legal completion',
        paragraphs: Object.freeze([
          'A qualified reviewer must complete the cooling-off, immediate digital-access consent, statutory remedies, governing-law, complaints, liability, intellectual-property and material-change terms before this draft can be relied upon.',
          'Certification names and marks belong to their respective owners. Learning All Things Tech is an independent study service and must not imply endorsement or guarantee exam success.'
        ])
      })
    ])
  }),
  privacy: Object.freeze({
    badge: 'Privacy notice',
    icon: ShieldCheck,
    title: 'How learner and payment-reference data is handled',
    summary: 'This draft describes the current technical boundaries. The individual seller’s controller identity, lawful-basis record, retention schedule and approved contact details require seller review before publication.',
    sections: Object.freeze([
      Object.freeze({
        title: 'Information used by the service',
        paragraphs: Object.freeze([
          'The application uses account identifiers, email, authentication state, exam entitlements, learner progress, exam attempts and support communications to operate the learning service.',
          'Payment processing is hosted by Stripe. Learning All Things Tech stores protected Stripe Customer, Subscription, Invoice and event references needed to reconcile access, but does not receive or store full card details.'
        ])
      }),
      Object.freeze({
        title: 'Purposes and service providers',
        paragraphs: Object.freeze([
          'Data is used to authenticate accounts, provide the purchased exact-exam service, preserve progress, reconcile billing events, prevent abuse, answer support requests and meet applicable legal obligations.',
          'The final notice must list the approved processors and hosting locations, including Stripe and Supabase, plus any other production provider that actually processes learner data.'
        ])
      }),
      Object.freeze({
        title: 'Retention, transfers and rights',
        paragraphs: Object.freeze([
          'Exact retention periods, international-transfer safeguards and deletion rules remain seller-review fields. Payment and webhook evidence may need to be retained for security, accounting, tax and dispute purposes even after an entitlement ends.',
          'The final notice must explain access, correction, deletion, restriction, objection and portability rights where applicable, how to exercise them, and the right to complain to the Information Commissioner’s Office.'
        ])
      }),
      Object.freeze({
        title: 'Cookies and local device storage',
        paragraphs: Object.freeze([
          'The final notice must identify authentication/session storage, learner-device storage and any analytics or non-essential cookies. Non-essential technologies must not be enabled without the required information and consent.',
          'Public privacy contact: SELLER REVIEW REQUIRED.'
        ])
      })
    ])
  }),
  refunds: Object.freeze({
    badge: 'Refunds and cancellation',
    icon: RefreshCcw,
    title: 'Cancelling renewal and requesting a refund',
    summary: 'Cancellation, entitlement access and refunds are separate actions. This draft cannot reduce statutory consumer rights and requires professional review before live sales.',
    sections: Object.freeze([
      Object.freeze({
        title: 'Cancel future renewal',
        paragraphs: Object.freeze([
          'A paid learner can use Stripe’s hosted Customer Portal to schedule cancellation at the end of the current annual period. No cancellation fee is intended.',
          'Scheduling cancellation normally disables renewal while keeping the exact-exam entitlement active until its stored paid expiry. It does not automatically issue a refund.'
        ])
      }),
      Object.freeze({
        title: 'Refund handling',
        paragraphs: Object.freeze([
          'A verified full refund of the payment-backed Invoice revokes only the related active exact-exam entitlement while preserving its historical expiry and learner progress. Partial, pending, failed or ambiguous refunds remain subject to manual review and do not automatically change access.',
          'Approved refunds are returned only through Stripe to the original payment method. Support must never ask a learner to email card details.'
        ])
      }),
      Object.freeze({
        title: 'Cooling-off and digital access',
        paragraphs: Object.freeze([
          'The individual seller and legal reviewer must confirm the applicable UK distance-contract cooling-off rights, the effect of requesting immediate digital access and any express consent or acknowledgement required before access begins.',
          'Duplicate payments, technical non-delivery, faulty or misdescribed services and other statutory remedies must be addressed in the final approved policy.'
        ])
      }),
      Object.freeze({
        title: 'Requesting help',
        paragraphs: Object.freeze([
          'Refund request method, public support email, evidence requirements and response times: SELLER REVIEW REQUIRED.',
          'Statutory rights remain unaffected.'
        ])
      })
    ])
  }),
  support: Object.freeze({
    badge: 'Support',
    icon: CircleHelp,
    title: 'Help with access, billing and learner accounts',
    summary: 'The monitored public support email, optional phone decision and response-time commitment remain seller-review fields. Live payments cannot be enabled until they are completed.',
    sections: Object.freeze([
      Object.freeze({
        title: 'Contact details',
        paragraphs: Object.freeze([
          'Support email: SELLER REVIEW REQUIRED.',
          'Support phone: SELLER DECISION REQUIRED. Do not publish a personal number unless the individual seller has explicitly approved it as a public support contact.'
        ])
      }),
      Object.freeze({
        title: 'What support can help with',
        paragraphs: Object.freeze([
          'Support will cover sign-in, exact-exam access, billing, cancellation, refund, privacy and content-quality questions once an approved contact is published.',
          'For billing questions, provide only the account email and a safe description of the issue. Never send full card details, passwords, verification codes, secret keys or identity documents by email.'
        ])
      }),
      Object.freeze({
        title: 'Billing recognition',
        paragraphs: Object.freeze([
          'Proposed card statement descriptor: LATT LEARNING. Stripe and seller acceptance are required before this wording is final.',
          annualPriceDisclosure
        ])
      }),
      Object.freeze({
        title: 'Response and escalation',
        paragraphs: Object.freeze([
          'Support response target, complaints route, urgent account-security instructions and data-rights verification process: SELLER REVIEW REQUIRED.',
          'Use Stripe’s hosted Customer Portal for routine subscription cancellation and payment-method updates once live billing is enabled.'
        ])
      })
    ])
  })
});

export function PublicInformationEntry({ route, onReturnHome = () => {} }) {
  const page = pages[route];
  if (!page) return null;
  const Icon = page.icon || FileText;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:py-12">
      <main className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={onReturnHome}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Return to LATT
        </button>

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 shadow-2xl">
          <header className="border-b border-slate-800 p-6 sm:p-9">
            <div className="inline-flex rounded-2xl border border-indigo-800 bg-indigo-950/65 p-3 text-indigo-300">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-300">{page.badge}</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">{page.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">{page.summary}</p>

            <div
              className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-700/60 bg-amber-950/30 p-4 text-sm leading-6 text-amber-100"
              role="status"
              data-publication-ready={String(PUBLIC_INFORMATION_PUBLICATION_GATE.ready)}
              data-review-status="required"
            >
              <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
              <div>
                <strong className="block text-white">Draft — not approved for live sales</strong>
                <span>{reviewRequired} No payment control is enabled by this page.</span>
              </div>
            </div>
          </header>

          <div className="space-y-8 p-6 sm:p-9">
            {page.sections.map(section => (
              <section key={section.title}>
                <h2 className="text-lg font-extrabold text-white">{section.title}</h2>
                <div className="mt-3 space-y-3">
                  {section.paragraphs.map(paragraph => (
                    <p key={paragraph} className="text-sm leading-7 text-slate-300">{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <footer className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-4">
          <PublicInformationLinks />
          <p className="mt-3 text-center text-[10px] leading-4 text-slate-500">Drafted 25 August 2026 · Seller and professional review pending</p>
        </footer>
      </main>
    </div>
  );
}
