import React from 'react';
import { PUBLIC_INFORMATION_ROUTE_HASHES } from './publicInformationRoutes.js';

const PUBLIC_INFORMATION_LINKS = Object.freeze([
  Object.freeze({ href: PUBLIC_INFORMATION_ROUTE_HASHES.terms, label: 'Terms' }),
  Object.freeze({ href: PUBLIC_INFORMATION_ROUTE_HASHES.privacy, label: 'Privacy' }),
  Object.freeze({ href: PUBLIC_INFORMATION_ROUTE_HASHES.refunds, label: 'Refunds & cancellation' }),
  Object.freeze({ href: PUBLIC_INFORMATION_ROUTE_HASHES.support, label: 'Support' })
]);

export function PublicInformationLinks({ className = '', compact = false }) {
  return (
    <nav
      aria-label="Customer information"
      className={`${compact ? 'text-[10px]' : 'text-xs'} flex flex-wrap items-center justify-center gap-x-4 gap-y-2 ${className}`.trim()}
    >
      {PUBLIC_INFORMATION_LINKS.map(link => (
        <a
          key={link.href}
          href={link.href}
          className="font-semibold text-slate-400 underline decoration-slate-700 underline-offset-4 transition hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
