import React, { useEffect, useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronRight, GitBranch, Layers, Lock } from 'lucide-react';

export const FollowAlongNavigator = ({ config, activeTaskId, completedTaskIds, onSelectTask, isBusy }) => {
  const completed = new Set(completedTaskIds);
  const activePhaseId = config.tasks.find(task => task.id === activeTaskId)?.phaseId || config.phases[0]?.id;
  const [expanded, setExpanded] = useState(() => activePhaseId ? { [activePhaseId]: true } : {});

  useEffect(() => {
    const phaseId = config.tasks.find(task => task.id === activeTaskId)?.phaseId;
    if (phaseId) setExpanded(previous => previous[phaseId] ? previous : { ...previous, [phaseId]: true });
  }, [activeTaskId, config.tasks]);

  const locked = task => (task.prerequisites || []).some(id => !completed.has(id));

  return (
    <aside className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2"><Layers className="w-4 h-4 text-cyan-400" /> Programme Navigator</h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{config.phases.length} Phases</span>
      </div>
      <div className="space-y-2">
        {config.phases.map(phase => {
          const tasks = config.tasks.filter(task => task.phaseId === phase.id);
          const done = tasks.filter(task => completed.has(task.id)).length;
          const open = Boolean(expanded[phase.id]);
          return (
            <div key={phase.id} className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/50">
              <button type="button" onClick={() => setExpanded(value => ({ ...value, [phase.id]: !value[phase.id] }))} className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-800/50">
                <span className="flex items-center gap-2 min-w-0">{open ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}<span className="text-xs font-bold text-slate-200 truncate">{phase.title}</span></span>
                <span className="flex items-center gap-2">{done === tasks.length && tasks.length > 0 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}<span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">{done}/{tasks.length}</span></span>
              </button>
              {open && (
                <div className="p-2 pt-0 space-y-1 border-t border-slate-800/60">
                  {tasks.map(task => {
                    const isDone = completed.has(task.id);
                    const isActive = task.id === activeTaskId;
                    const isLocked = locked(task);
                    return (
                      <button key={task.id} type="button" disabled={isBusy || isLocked} onClick={() => onSelectTask(task.id)} className={`w-full p-2.5 rounded-lg text-left text-xs flex items-start gap-2 ${isActive ? 'bg-cyan-600/20 border border-cyan-500/50 text-white' : isLocked ? 'text-slate-600 opacity-60' : 'text-slate-300 hover:bg-slate-800/60'}`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : isLocked ? <Lock className="w-4 h-4 shrink-0" /> : <span className="w-2 h-2 rounded-full bg-slate-600 mt-1.5 shrink-0" />}
                        <span className="min-w-0"><span className="block truncate">{task.title}</span>{task.isOptional && <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 mt-1"><GitBranch className="w-3 h-3" /> Optional</span>}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
