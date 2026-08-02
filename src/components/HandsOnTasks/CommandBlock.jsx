import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

export const CommandBlock = ({ command }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy command:', err);
    }
  };

  const isDestructive = command.text.includes('delete-') || command.text.includes('rb ') || command.text.includes('rm -f');

  return (
    <div className={`my-3 rounded-xl overflow-hidden border ${
      isDestructive ? 'border-rose-900/60 bg-rose-950/20' : 'border-slate-800 bg-slate-950/90'
    } shadow-md`}>
      {/* Command Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-mono text-[11px] text-slate-300">AWS CLI Command</span>
          {isDestructive && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-950 text-rose-300 border border-rose-800">
              Destructive Action
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs"
          title="Copy command to clipboard"
          aria-label="Copy command to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Text Area */}
      <div className="p-3 overflow-x-auto">
        <pre className="font-mono text-xs text-emerald-300 leading-relaxed whitespace-pre font-normal selection:bg-indigo-600 selection:text-white">
          <code>{command.text}</code>
        </pre>
      </div>

      {/* Screen reader live notification */}
      <span aria-live="polite" className="sr-only">
        {copied ? 'Command copied to clipboard' : ''}
      </span>
    </div>
  );
};
