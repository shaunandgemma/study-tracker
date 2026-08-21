import React from 'react';
import { Clock3, LockKeyhole, ShieldCheck } from 'lucide-react';
import { getExamAccessDetails } from './applicationAccessPolicy.js';

export function formatExamEntitlementExpiry(expiresAt, locale) {
  if (!expiresAt) return '';
  const timestamp = new Date(expiresAt);
  if (!Number.isFinite(timestamp.getTime())) return '';
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(timestamp);
}

export const ExamAccessStatus = ({ accessPolicy, examId }) => {
  const details = getExamAccessDetails(accessPolicy, examId);
  const formattedExpiry = formatExamEntitlementExpiry(details.expiresAt);

  if (details.kind === 'paid') {
    return (
      <div className="mt-5 flex max-w-2xl items-start gap-3 rounded-2xl border border-emerald-700/60 bg-emerald-950/35 px-4 py-3 text-emerald-100" role="status">
        <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
        <div>
          <p className="text-sm font-bold">Verified exam access</p>
          <p className="mt-1 text-xs leading-5 text-emerald-200/90">
            Complete access is active for this exam
            {formattedExpiry && <> until <time dateTime={details.expiresAt}>{formattedExpiry}</time></>}.
          </p>
        </div>
      </div>
    );
  }

  if (details.kind === 'staff') {
    return (
      <div className="mt-5 flex max-w-2xl items-start gap-3 rounded-2xl border border-indigo-700/60 bg-indigo-950/35 px-4 py-3 text-indigo-100" role="status">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-indigo-300" />
        <div>
          <p className="text-sm font-bold">Trusted staff learning access</p>
          <p className="mt-1 text-xs leading-5 text-indigo-200/90">Complete exam access comes from the server-managed staff role. Author and Approver routes remain separate.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 flex max-w-2xl items-start gap-3 rounded-2xl border border-amber-700/60 bg-amber-950/30 px-4 py-3 text-amber-100" role="status">
      <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
      <div>
        <p className="text-sm font-bold">{details.kind === 'demo' ? 'Demo preview access' : 'Registered Free preview access'}</p>
        <p className="mt-1 text-xs leading-5 text-amber-200/90">This exam is showing its curated preview. Signed-in learner progress remains separate from the content-access decision.</p>
      </div>
    </div>
  );
};
