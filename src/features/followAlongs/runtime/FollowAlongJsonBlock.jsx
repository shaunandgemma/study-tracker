import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export const formatFollowAlongJsonContent = value => {
  const content = typeof value === 'string' ? value.trim() : '';
  if (!content) return '';
  try {
    const parsed = JSON.parse(content);
    return parsed && typeof parsed === 'object' ? JSON.stringify(parsed, null, 2) : content;
  } catch {
    return content;
  }
};

export const FollowAlongJsonBlock = ({ block }) => {
  const [copied, setCopied] = useState(false);
  if (!block?.content) return null;
  const isStrictJson = block.language !== 'text';
  const displayedContent = formatFollowAlongJsonContent(block.content);

  const copy = async () => {
    try {
      await globalThis.navigator?.clipboard?.writeText(displayedContent);
      setCopied(true);
      globalThis.setTimeout?.(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return <section className="rounded-xl border border-violet-900/60 bg-slate-950/80 overflow-hidden">
    <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-slate-800">
      <strong className="text-xs text-violet-200">{block.title || (isStrictJson ? 'JSON' : 'Reference example')}</strong>
      <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1.5 text-[10px] font-semibold text-slate-200">
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? 'Copied' : isStrictJson ? 'Copy JSON' : 'Copy example'}
      </button>
    </div>
    <pre className="max-h-[36rem] min-h-32 overflow-auto p-4 text-xs leading-relaxed text-emerald-200 whitespace-pre"><code>{displayedContent}</code></pre>
  </section>;
};
