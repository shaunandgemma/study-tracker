import React from 'react';
import { useTask } from '../../context/TaskContext';
import { TaskCard } from './TaskCard';
import { calculateTaskProgress, filterHandsOnTasks, getAvailableTopicOptions } from '../../services/taskService';
import { Search, CheckCircle2, BookOpen, ShieldCheck, Info, AlertTriangle, RefreshCw } from 'lucide-react';

export const TaskCardsGrid = ({ tasks, taskProgress = {}, onSelectTask = () => {} }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {tasks.map(task => (
      <TaskCard
        key={task.id}
        task={task}
        progressRecord={taskProgress[task.id]}
        onSelectTask={onSelectTask}
      />
    ))}
  </div>
);

export const TaskCountSummary = ({ filteredCount, totalCount }) => (
  <p className="text-xs text-slate-400" data-testid="task-count">
    Showing {filteredCount} of {totalCount} published labs
  </p>
);

export const TaskLoadError = ({ message, onRetry = () => {} }) => (
  <div role="alert" className="text-center py-10 bg-rose-950/30 border border-rose-800/60 rounded-2xl p-6">
    <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
    <h3 className="text-base font-semibold text-rose-200 mb-1">Unable to Load Hands-On Labs</h3>
    <p className="text-xs text-rose-300/80 max-w-lg mx-auto mb-4">{message}</p>
    <button type="button" onClick={onRetry} className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold inline-flex items-center gap-2">
      <RefreshCw className="w-3.5 h-3.5" />
      Retry
    </button>
  </div>
);

export const TaskList = () => {
  const {
    tasks,
    loadingTasks,
    taskLoadError,
    taskProgress,
    connectionStatus,
    openAwsSetup,
    selectedExamFilter,
    selectedTopicFilter,
    selectedDifficultyFilter,
    selectedStatusFilter,
    searchQuery,
    setSelectedExamFilter,
    setSelectedTopicFilter,
    setSelectedDifficultyFilter,
    setSelectedStatusFilter,
    setSearchQuery,
    refreshTasks,
    selectTask
  } = useTask();

  // Derive dynamic topic options based on currently loaded task catalogue
  const topicOptions = getAvailableTopicOptions(tasks);

  const filteredTasks = filterHandsOnTasks(tasks, {
    exam: selectedExamFilter,
    topic: selectedTopicFilter,
    difficulty: selectedDifficultyFilter,
    status: selectedStatusFilter,
    search: searchQuery
  }, taskProgress);

  // Calculate overall hands-on lab progress metrics
  let totalTasks = tasks.length;
  let completedTasks = 0;
  tasks.forEach(t => {
    const prog = taskProgress[t.id];
    const metrics = calculateTaskProgress(t, prog || {}, prog?.selectedMode || 'console');
    if (metrics.isCompleted) completedTasks++;
  });

  const overallPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner & Stats */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={openAwsSetup}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Connect AWS Account</span>
              </button>

              {connectionStatus === 'connected' && (
                <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  AWS Connected
                </span>
              )}

              {connectionStatus === 'simulation' && (
                <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  Simulation Mode
                </span>
              )}

              {connectionStatus === 'failed' && (
                <span className="px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  Connection Failed
                </span>
              )}
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shrink-0 min-w-[240px] space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Total Labs Progress</span>
              <span className="text-indigo-400 font-bold">{overallPercent}%</span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${overallPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {completedTasks} of {totalTasks} Completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search labs, services, tags..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          {/* Exam Filter */}
          <select
            value={selectedExamFilter}
            onChange={e => setSelectedExamFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="aws-saa-c03">AWS SAA-C03</option>
            <option value="all">All Certifications</option>
          </select>

          {/* Topic Filter */}
          <select
            value={selectedTopicFilter}
            onChange={e => setSelectedTopicFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Topics</option>
            {topicOptions.map(opt => (
              <option key={opt.id} value={opt.id}>
                {opt.title}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficultyFilter}
            onChange={e => setSelectedDifficultyFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Completion Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <TaskCountSummary filteredCount={filteredTasks.length} totalCount={tasks.length} />

      {/* Task Cards Grid / Loading / Error / Empty State */}
      {loadingTasks ? (
        <div className="text-center py-12 text-sm text-slate-400">Loading published hands-on labs…</div>
      ) : taskLoadError ? (
        <TaskLoadError message={taskLoadError} onRetry={refreshTasks} />
      ) : filteredTasks.length > 0 ? (
        <TaskCardsGrid tasks={filteredTasks} taskProgress={taskProgress} onSelectTask={selectTask} />
      ) : (
        <div className="text-center py-12 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300 mb-1">No Hands-On Labs Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {tasks.length === 0
              ? 'No published hands-on labs are available for the selected exam.'
              : 'Try adjusting your search query or filters to find available guided AWS labs.'}
          </p>
        </div>
      )}
    </div>
  );
};
