import React from 'react';
import {
  ArrowLeft,
  CircleHelp,
  Cookie,
  FileText,
  RefreshCcw,
  Scale,
  ShieldCheck,
  TriangleAlert
} from 'lucide-react';
import { PublicInformationLinks } from './PublicInformationLinks.jsx';
import { PUBLIC_INFORMATION_PUBLICATION_GATE } from './publicInformationPublicationReadiness.js';

const policyDate = '23 September 2026';
const annualPriceDisclosure = 'The total price is £19.99 for twelve months of access to one selected available exam. £19.99 is charged when the order is placed and then every twelve months until renewal is cancelled. The price includes any applicable tax and no additional mandatory fee is added at checkout.';
const sellerDetailsNotice = 'Learning All Things Tech is the trading name of an individual UK trader. The trader’s legal name, safe public service address and monitored public email will be inserted before live sales are enabled.';
const reviewRequired = PUBLIC_INFORMATION_PUBLICATION_GATE.ready
  ? 'The publication-readiness manifest is approved.'
  : 'The policy content has been prepared, but seller identity, public contact details and independent legal and privacy approval remain required before live payments can be enabled.';

const pages = Object.freeze({
  terms: Object.freeze({
    badge: 'Terms of service',
    icon: Scale,
    title: 'Terms for annual exact-exam access',
    summary: 'These terms explain the paid learning service, annual subscription, account rules and customer rights.',
    sections: Object.freeze([
      Object.freeze({
        title: '1. Seller and these terms',
        paragraphs: Object.freeze([
          sellerDetailsNotice,
          'These terms apply when a learner buys annual access through this website. The Privacy notice, Cookies & storage notice and Refunds & cancellation policy form part of the customer information supplied with these terms.'
        ])
      }),
      Object.freeze({
        title: '2. The learning service',
        paragraphs: Object.freeze([
          'A paid subscription provides one account with twelve months of access to the complete learning workspace for the exact exam named at checkout. Each exam is a separate product and entitlement. Access to one exam does not include another exam unless the checkout description expressly says otherwise.',
          'Only exam workspaces shown as available in the application can be opened or purchased. CompTIA Security+ is marked Coming Soon and cannot be opened or purchased. The checkout description shown immediately before payment controls what is included in an order.',
          'Learning All Things Tech is an independent study service. Certification names and marks belong to their respective owners. The service is not endorsed by a certification provider and does not guarantee an exam pass, employment or any professional outcome.'
        ])
      }),
      Object.freeze({
        title: '3. Price, payment and contract formation',
        paragraphs: Object.freeze([
          annualPriceDisclosure,
          'Stripe securely collects and processes the payment. Learning All Things Tech does not receive or store the full card number. A contract begins only when Stripe confirms successful payment and the service confirms the purchased exact-exam entitlement. A checkout return page by itself does not prove payment or grant access.',
          'The learner must check the selected exam, price, renewal information and account email before paying. The payment button clearly states that pressing it starts a paid annual subscription.'
        ])
      }),
      Object.freeze({
        title: '4. Annual renewal and cancellation',
        paragraphs: Object.freeze([
          'The subscription renews automatically every twelve months at the price disclosed before the renewal unless the learner cancels. If a price change is proposed, it will be communicated before it applies and any rights to reject or cancel will be respected.',
          'A learner may turn off future renewal at any time through Stripe’s hosted Customer Portal. Cancellation is free, prevents the next annual charge and normally leaves access active until the end of the already-paid period. A cancellation confirmation states when access is due to end.',
          'Cancellation of future renewal and a refund request are different actions. The Refunds & cancellation policy explains the separate 14-day refund promise and statutory remedies.'
        ])
      }),
      Object.freeze({
        title: '5. Immediate access and the 14-day promise',
        paragraphs: Object.freeze([
          'The learner asks for the digital learning service to start as soon as payment is confirmed, rather than waiting fourteen days. Where the law treats part of the service as digital content, beginning immediate supply can affect the statutory cancellation right.',
          'Regardless of that classification, Learning All Things Tech separately promises a full refund when the learner requests one within fourteen days of the initial charge or an annual renewal, even if access has started. This contractual promise does not replace or restrict statutory rights.'
        ])
      }),
      Object.freeze({
        title: '6. Accounts and permitted use',
        paragraphs: Object.freeze([
          'Access is personal to the account holder. The learner must provide accurate account information, protect sign-in credentials and promptly report suspected unauthorised access. Account sharing, resale, automated extraction, redistribution of protected material and attempts to bypass access controls are prohibited.',
          'Learners may download only the exports and study records the application deliberately offers. They retain ownership of their own notes and answers. The application, original learning content, design and software remain protected by the rights of their respective owners.'
        ])
      }),
      Object.freeze({
        title: '7. Availability, changes and fair use',
        paragraphs: Object.freeze([
          'Reasonable maintenance, security work and events outside the seller’s control may temporarily interrupt access. Reasonable efforts will be made to restore the service and preserve saved progress. Material reductions to a paid service will be communicated and applicable remedies will be provided.',
          'Access may be restricted to protect accounts, investigate fraud or stop a serious breach of these terms. Except where urgent security action is required, the learner will be told why and given a reasonable opportunity to resolve the issue. Statutory rights are not excluded.'
        ])
      }),
      Object.freeze({
        title: '8. Service standards and liability',
        paragraphs: Object.freeze([
          'The service will be provided with reasonable care and skill. Digital content must be as described, of satisfactory quality and fit for a purpose made known to the seller where the law requires it. Nothing in these terms excludes liability that cannot legally be excluded, including liability for fraud or fraudulent misrepresentation, death or personal injury caused by negligence, or the learner’s statutory consumer rights.',
          'The service provides educational material and practical guidance, not professional, legal, financial or security advice. Learners remain responsible for examination bookings and for reviewing cloud commands before running them. Cost and cleanup warnings in labs must be followed.'
        ])
      }),
      Object.freeze({
        title: '9. Support and complaints',
        paragraphs: Object.freeze([
          'Billing, access and service problems can be raised through the Support route. The published complaints process explains acknowledgement, investigation and escalation. A learner should never send a password, verification code, secret key or complete card number.',
          'These terms do not remove any mandatory protection available under the law applying to the learner. UK consumers can obtain independent advice from the Citizens Advice consumer service.'
        ]),
        links: Object.freeze([
          Object.freeze({ label: 'UK consumer rights guidance', href: 'https://www.gov.uk/consumer-protection-rights' })
        ])
      })
    ])
  }),
  privacy: Object.freeze({
    badge: 'Privacy notice',
    icon: ShieldCheck,
    title: 'How personal information is used',
    summary: 'This notice explains the personal information used to run learner accounts, preserve progress and reconcile Stripe subscriptions.',
    sections: Object.freeze([
      Object.freeze({
        title: '1. Controller and scope',
        paragraphs: Object.freeze([
          sellerDetailsNotice,
          'The individual trader behind Learning All Things Tech will be the data controller for account, learning and customer-service information. Stripe also acts as an independent controller for some payment, fraud-prevention and legal-compliance processing described in Stripe’s own privacy information.'
        ])
      }),
      Object.freeze({
        title: '2. Information collected',
        items: Object.freeze([
          'Account information: email address, Supabase user identifier, authentication state and sign-in security information.',
          'Learning information: selected exam, checklist and item progress, flags, exam attempts, scores, study history, Follow Along progress, learner-entered notes and saved resource identifiers.',
          'Purchase information: purchased exam, entitlement status and expiry, Stripe Customer, Checkout Session, Subscription, Invoice, Price, Product and event references. Full card details are handled by Stripe and are not stored by Learning All Things Tech.',
          'Support information: messages, complaint details, refund requests and the information supplied to resolve them.',
          'Technical and security information: timestamps, request and authentication records, error information and limited hosting logs such as IP address, device or browser information where generated by the service providers.',
          'Device information: the functional browser-storage entries described in the Cookies & storage notice.'
        ])
      }),
      Object.freeze({
        title: '3. Purposes and lawful bases',
        items: Object.freeze([
          'Contract: create and authenticate the account, provide the selected learning service, save progress, process the order, reconcile entitlement and provide billing or support functions.',
          'Legitimate interests: secure the service, prevent duplicate subscriptions and abuse, diagnose faults, maintain reliable records and defend legal claims. These interests are balanced against learner rights.',
          'Legal obligation: retain and disclose records where accounting, tax, fraud-prevention, consumer-protection or other law requires it.',
          'Consent: used only where processing genuinely requires a choice, such as any future non-essential analytics or marketing. Consent can be withdrawn without affecting earlier lawful processing.'
        ])
      }),
      Object.freeze({
        title: '4. Where information comes from',
        paragraphs: Object.freeze([
          'Most information comes directly from the learner through registration, use of the learning tools and support contact. Stripe supplies verified billing events and payment references. The hosting and authentication providers generate limited technical and security records as the service is used.',
          'The service does not buy personal information and does not sell learner personal information.'
        ])
      }),
      Object.freeze({
        title: '5. Service providers and sharing',
        items: Object.freeze([
          'Supabase provides authentication, database storage, row-level access control and server-side functions.',
          'Stripe provides hosted checkout, subscription billing, the Customer Portal, fraud prevention, refunds and payment records.',
          'Amazon Web Services provides Amplify website hosting, content delivery, TLS and related operational hosting services.',
          'Professional advisers, insurers, courts, regulators or law-enforcement bodies receive information only when reasonably necessary or legally required.'
        ]),
        paragraphs: Object.freeze([
          'Providers receive only the information needed for their functions and are governed by their contracts and applicable data-protection responsibilities. No full card number is copied into the application database.'
        ])
      }),
      Object.freeze({
        title: '6. International transfers',
        paragraphs: Object.freeze([
          'Providers may process information in the United Kingdom, European Economic Area, United States or another location used by their approved service providers. Where UK personal information is transferred to a country without UK adequacy regulations, the applicable provider agreement uses a recognised safeguard such as the UK International Data Transfer Agreement or UK Addendum to approved standard contractual clauses, together with relevant security measures.',
          'The production Supabase project region and the active provider agreements must be recorded in the internal processor inventory before live sales.'
        ]),
        links: Object.freeze([
          Object.freeze({ label: 'Stripe Privacy Center', href: 'https://stripe.com/gb/legal/privacy-center' }),
          Object.freeze({ label: 'Supabase security and compliance', href: 'https://supabase.com/docs/guides/security' })
        ])
      }),
      Object.freeze({
        title: '7. Retention',
        items: Object.freeze([
          'Account, entitlement and cloud-saved learning records are kept while the account is active and then reviewed for deletion when the account is closed, unless a legal or dispute-related reason requires longer retention.',
          'Transaction, invoice, subscription, refund and associated reconciliation records are retained for at least the period required for tax, accounting, fraud and legal-claim records. For an individual UK trader this is normally at least five years after the relevant Self Assessment filing deadline.',
          'Routine resolved support messages are scheduled for deletion after twenty-four months. Complaint, refund, fraud or legal-dispute records may be kept with the related transaction record for the applicable limitation or legal-record period.',
          'Security and diagnostic logs are kept only as long as reasonably necessary to investigate faults, secure the service and meet provider or legal requirements.',
          'Browser storage remains on the learner’s device until the application removes it, the learner clears it or the browser does so. Provider backups may retain inaccessible copies until their normal secure rotation completes.'
        ])
      }),
      Object.freeze({
        title: '8. Rights and complaints',
        paragraphs: Object.freeze([
          'Depending on the circumstances, learners may ask for access, correction, deletion, restriction, objection or portability of their personal information. They may also withdraw consent where consent is the lawful basis. Identity may need to be verified before a request is completed.',
          'A data-protection request can be sent using the public privacy contact that will be inserted before live sales. Learners also have the right to complain to the UK Information Commissioner’s Office. Exercising a privacy right does not affect contractual or statutory consumer rights.'
        ]),
        links: Object.freeze([
          Object.freeze({ label: 'ICO individual rights', href: 'https://ico.org.uk/for-the-public/your-data-protection-rights/' }),
          Object.freeze({ label: 'Complain to the ICO', href: 'https://ico.org.uk/make-a-complaint/' })
        ])
      }),
      Object.freeze({
        title: '9. Automated processing and security',
        paragraphs: Object.freeze([
          'Signed Stripe events automatically activate, continue or revoke only the matching exact-exam entitlement. This is contract administration based on payment state, not profiling. A learner can ask support to review an entitlement or billing mismatch.',
          'Security controls include HTTPS, Stripe-hosted collection of card details, verified Stripe webhook signatures, authenticated server functions, database row-level security and access limited to operational need. No internet service can promise absolute security, so suspected account compromise should be reported promptly.'
        ])
      })
    ])
  }),
  refunds: Object.freeze({
    badge: 'Refunds and cancellation',
    icon: RefreshCcw,
    title: 'Cancelling renewal and requesting a refund',
    summary: 'Cancellation stops a future renewal; a refund returns a charge. This policy explains both and preserves statutory rights.',
    sections: Object.freeze([
      Object.freeze({
        title: '1. Cancel future renewal',
        paragraphs: Object.freeze([
          'A learner may turn off automatic renewal at any time through Stripe’s hosted Customer Portal. There is no cancellation fee. Cancellation normally takes effect at the end of the current paid twelve-month period, so access continues until the displayed paid-through date.',
          'After cancellation, Stripe or the service provides confirmation that renewal has been turned off and identifies when the subscription is due to end. If the portal is unavailable, the learner may use the published support route.'
        ])
      }),
      Object.freeze({
        title: '2. Fourteen-day full-refund promise',
        paragraphs: Object.freeze([
          'A learner may request a full refund within fourteen calendar days after the initial £19.99 charge. The same promise applies for fourteen calendar days after each annual renewal charge. No reason is required, and the promise applies even if learning access has started.',
          'This contractual promise is at least as favourable as the stated policy and does not replace any longer or additional statutory remedy. A request is in time when it is sent through the published support route before the fourteen-day period ends.'
        ])
      }),
      Object.freeze({
        title: '3. Faults, non-delivery and incorrect charges',
        paragraphs: Object.freeze([
          'The fourteen-day limit does not remove remedies for duplicate charges, access that was not supplied, digital content that is faulty or misdescribed, a service not provided with reasonable care and skill, or another breach of statutory rights.',
          'A duplicate verified charge will be refunded. A technical problem should first be reported so it can be corrected promptly; requesting assistance does not waive a refund or consumer right.'
        ])
      }),
      Object.freeze({
        title: '4. How to request a refund',
        items: Object.freeze([
          'Use the published Support route and state that the message is a refund request.',
          'Provide the account email, selected exam, approximate payment date and Stripe Invoice or receipt reference if available.',
          'Do not send a complete card number, card security code, password, authentication token or secret key.',
          'Support will acknowledge the request within two working days and aims to decide routine requests within ten working days.'
        ])
      }),
      Object.freeze({
        title: '5. Refund method and timing',
        paragraphs: Object.freeze([
          'Approved refunds are issued through Stripe to the original payment method. Learning All Things Tech does not ask for bank or card details by email. After Stripe confirms the refund, the bank or card provider controls when the credit appears; this commonly takes several working days.',
          'A full refund of the payment-backed invoice ends the related exact-exam paid entitlement when the signed Stripe event is verified. Historical learning progress is preserved unless the learner separately asks for deletion and the law permits it. A partial or ambiguous refund is reviewed manually before access changes.'
        ])
      }),
      Object.freeze({
        title: '6. Refunds outside the fourteen-day promise',
        paragraphs: Object.freeze([
          'After the fourteen-day promise ends, cancelling renewal does not automatically refund the unused portion of the current year. A refund will still be provided where required by law, where the paid service was not supplied as agreed, or where Learning All Things Tech expressly agrees after reviewing exceptional circumstances.',
          'Nothing in this policy excludes or restricts statutory rights.'
        ])
      })
    ])
  }),
  cookies: Object.freeze({
    badge: 'Cookies and browser storage',
    icon: Cookie,
    title: 'Technologies stored on your device',
    summary: 'The application currently uses functional browser storage for sign-in, preferences and learning progress. It does not include advertising or behavioural-analytics technology.',
    sections: Object.freeze([
      Object.freeze({
        title: '1. Current position',
        paragraphs: Object.freeze([
          'Learning All Things Tech does not currently set advertising cookies or use a behavioural analytics, cross-site tracking or advertising package. The application primarily uses localStorage, which is a browser-storage technology covered by similar transparency rules to cookies.',
          'Because the current entries support a service requested by the learner, account security, saved preferences or learning progress, they are treated as strictly necessary or functional storage. No non-essential technology is enabled before consent.'
        ])
      }),
      Object.freeze({
        title: '2. Authentication storage',
        items: Object.freeze([
          'Supabase authentication session entry, normally named with an sb- prefix and the project reference: keeps a signed-in learner authenticated, refreshes the session securely and supports sign-out.',
          'Temporary Supabase PKCE verification entries may be created during a secure sign-in or account-verification flow and are removed when the flow completes or expires.'
        ])
      }),
      Object.freeze({
        title: '3. Learning and preference storage',
        items: Object.freeze([
          'exampulse_theme_v1: remembers the selected display theme.',
          'exampulse_active_exam_v1 and exampulse_exams_v1: remember the active exam and locally available exam configuration.',
          'exampulse_checklist_v1, exampulse_flagged_v1 and exampulse_history_v1: save checklist choices, flagged items and local exam-result summaries.',
          'exampulse_task_progress_v1 and programme-specific progress/resource entries: preserve Follow Along and practical-task progress, selected modes and learner-recorded resource identifiers.',
          'exampulse_troubleshooting_progress_v1: saves troubleshooting notes, evidence, hints, answers and completion state.',
          'Guest learning-path entries, including vpc_learning_path_progress_guest and vpc_learning_path_resources_guest: preserve unsigned-in progress on the current device.'
        ]),
        paragraphs: Object.freeze([
          'The exact programme-specific key names can vary as new learning programmes are published, but their purpose remains saving the learner’s requested progress and recorded lab-resource details.'
        ])
      }),
      Object.freeze({
        title: '4. Stripe-hosted pages',
        paragraphs: Object.freeze([
          'Selecting purchase or billing management redirects the learner to a Stripe-hosted domain. Stripe may use its own storage for checkout security, fraud prevention, authentication, payment processing and saved payment preferences. Stripe controls those technologies under its own privacy and cookie information.',
          'Learning All Things Tech does not receive the full card details entered on Stripe’s hosted page.'
        ]),
        links: Object.freeze([
          Object.freeze({ label: 'Stripe cookie settings', href: 'https://stripe.com/gb/cookie-settings' }),
          Object.freeze({ label: 'Stripe Privacy Center', href: 'https://stripe.com/gb/legal/privacy-center' })
        ])
      }),
      Object.freeze({
        title: '5. Browser controls and consequences',
        paragraphs: Object.freeze([
          'A learner can inspect or clear site data using browser privacy settings. Clearing authentication storage signs the learner out. Clearing local learning storage removes guest progress and device-only preferences; cloud-saved progress associated with a signed-in account is not deleted merely by clearing the browser.',
          'Blocking all local storage may prevent sign-in, saved preferences or progress from functioning correctly. A learner can sign out without clearing unrelated site data.'
        ])
      }),
      Object.freeze({
        title: '6. If non-essential technology is added',
        paragraphs: Object.freeze([
          'Advertising, behavioural analytics or any other non-essential storage will not be activated merely because a visitor continues browsing. Before such technology is enabled, this notice will identify the provider, purpose and duration, and the site will request a clear opt-in choice with an equally accessible way to refuse or withdraw consent.',
          'The current absence of non-essential technology is why no cookie-consent banner is displayed.'
        ]),
        links: Object.freeze([
          Object.freeze({ label: 'ICO cookies and similar technologies guidance', href: 'https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/' })
        ])
      })
    ])
  }),
  support: Object.freeze({
    badge: 'Support and complaints',
    icon: CircleHelp,
    title: 'Help with access, billing and learner accounts',
    summary: 'This process covers support requests, refund requests, privacy questions and formal complaints.',
    sections: Object.freeze([
      Object.freeze({
        title: '1. Contact route',
        paragraphs: Object.freeze([
          'Support email and the public privacy contact: SELLER REVIEW REQUIRED. A monitored address on the learningallthingstech.co.uk domain will be published before live sales.',
          'A public telephone number is not currently offered. This does not prevent a learner from making a support request, cancellation or complaint in writing once the monitored address is published.'
        ])
      }),
      Object.freeze({
        title: '2. What support covers',
        items: Object.freeze([
          'Sign-in, account verification and suspected account compromise.',
          'Exact-exam access, saved progress and content-quality problems.',
          'Stripe checkout, subscription status, cancellation and payment-method management.',
          'Refund requests, duplicate charges and billing discrepancies.',
          'Privacy rights, browser storage and account-deletion requests.',
          'Feedback and formal complaints about the learning service.'
        ])
      }),
      Object.freeze({
        title: '3. Response targets',
        paragraphs: Object.freeze([
          'Support will acknowledge a message within two working days and aims to resolve a routine request within ten working days. If more time is needed, the learner will receive an update explaining what is being checked and when the next update is expected.',
          'Urgent suspected account compromise is prioritised. Response targets are service aims and do not reduce any statutory deadline or consumer right.'
        ])
      }),
      Object.freeze({
        title: '4. Formal complaints process',
        items: Object.freeze([
          'Send the complaint to the published support address with “Formal complaint” in the subject line.',
          'Include the account email, what happened, relevant dates, the selected exam, any safe Stripe Invoice reference and the outcome requested.',
          'Support acknowledges the complaint within two working days and records it separately from routine support.',
          'The evidence, account history and applicable terms are reviewed. A reasoned written response is targeted within fifteen working days.',
          'If the learner remains dissatisfied, they may reply requesting a final review. The final response will identify any ADR or other dispute-resolution arrangement that the trader is required or prepared to use at that time.'
        ]),
        paragraphs: Object.freeze([
          'Consumers may obtain independent advice from the Citizens Advice consumer service. Privacy complaints may also be made to the Information Commissioner’s Office. These routes do not remove the right to use the courts where applicable.'
        ]),
        links: Object.freeze([
          Object.freeze({ label: 'UK consumer rights and advice', href: 'https://www.gov.uk/consumer-protection-rights' }),
          Object.freeze({ label: 'Information Commissioner’s Office', href: 'https://ico.org.uk/make-a-complaint/' })
        ])
      }),
      Object.freeze({
        title: '5. Safe information for support',
        paragraphs: Object.freeze([
          'Provide only the account email, a description of the problem and a Stripe Invoice or receipt reference if available. Never send a complete card number, card security code, password, one-time verification code, Stripe secret, Supabase key, cloud credential or identity document unless a separately verified legal process specifically requires it.',
          'Approved refunds are returned through Stripe to the original payment method. Support will never ask for card or bank details by email to process a normal refund.'
        ])
      }),
      Object.freeze({
        title: '6. Billing recognition',
        paragraphs: Object.freeze([
          'The proposed card statement descriptor is LATT LEARNING. It must be accepted in the Stripe live account before publication.',
          annualPriceDisclosure
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
                <strong className="block text-white">Not yet approved for live sales</strong>
                <span>{reviewRequired} No payment control is enabled by this page.</span>
              </div>
            </div>
          </header>

          <div className="space-y-8 p-6 sm:p-9">
            {page.sections.map(section => (
              <section key={section.title}>
                <h2 className="text-lg font-extrabold text-white">{section.title}</h2>
                {section.paragraphs && (
                  <div className="mt-3 space-y-3">
                    {section.paragraphs.map(paragraph => (
                      <p key={paragraph} className="text-sm leading-7 text-slate-300">{paragraph}</p>
                    ))}
                  </div>
                )}
                {section.items && (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-300">
                    {section.items.map(item => <li key={item}>{item}</li>)}
                  </ul>
                )}
                {section.links && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {section.links.map(link => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-indigo-300 underline decoration-indigo-800 underline-offset-4 hover:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </section>

        <footer className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-4">
          <PublicInformationLinks />
          <p className="mt-3 text-center text-[10px] leading-4 text-slate-500">Policy content updated {policyDate} · Seller identity, contact details and independent review pending</p>
        </footer>
      </main>
    </div>
  );
}
