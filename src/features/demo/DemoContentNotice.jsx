import React from 'react';
import { LockKeyhole } from 'lucide-react';

export const DemoContentNotice = ({ children }) => (
  <div role="status" className="flex items-start gap-3 rounded-2xl border border-cyan-800/70 bg-cyan-950/30 p-4 text-xs leading-5 text-cyan-100">
    <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
    <div>
      <strong className="block text-cyan-200">Demo preview</strong>
      <span>{children}</span>
    </div>
  </div>
);
