import React, { useState, useEffect } from 'react';
import { Layers, Search, Sparkles, Network, CheckCircle2, ListFilter, ChevronDown, ShieldCheck } from 'lucide-react';
import { FollowAlongCard } from './FollowAlongCard.jsx';
import { createPublishedProgressLoadingSummaries, loadPublishedFollowAlongProgressSummaries } from '../../features/followAlongs/published/publishedFollowAlongProgress.js';
import { ALL_FOLLOW_ALONG_CATEGORIES, getSortedFollowAlongCategories } from '../../features/followAlongs/published/followAlongCategoryFilter.js';
import { getTerraformFollowAlongNumber, sortTerraformFollowAlongs } from '../../features/followAlongs/published/terraformFollowAlongOrder.js';
import { createFollowAlongPersistence } from '../../services/followAlongPersistenceService.js';
import { demoProgressStorage, isDemoUser } from '../../features/demo/demoMode.js';
import { DemoContentNotice } from '../../features/demo/DemoContentNotice.jsx';
import {
  applyProtectedFollowAlongVisibility,
  protectedFollowAlongContentService
} from '../../services/protectedFollowAlongContentService.js';

const ProtectedFollowAlongState = ({ status, onRetry }) => {
  if (status === 'loading') {
    return (
      <div role="status" className="rounded-2xl border border-cyan-900/60 bg-slate-900/70 p-8 text-center">
        <ShieldCheck className="mx-auto h-8 w-8 text-cyan-400" />
        <p className="mt-3 text-sm font-bold text-slate-200">Loading protected Follow Alongs…</p>
        <p className="mt-2 text-xs text-slate-500">Only programmes available for this exact exam and account will be shown.</p>
      </div>
    );
  }

  if (status === 'unavailable') {
    return (
      <div role="alert" className="rounded-2xl border border-amber-800/60 bg-amber-950/20 p-8 text-center">
        <p className="text-sm font-bold text-amber-200">Protected Follow Alongs are temporarily unavailable.</p>
        <p className="mt-2 text-xs text-amber-200/80">No bundled or legacy paid content was substituted.</p>
        <button type="button" onClick={onRetry} className="mt-4 rounded-xl border border-amber-700 bg-amber-900/50 px-4 py-2 text-xs font-bold text-amber-100 hover:bg-amber-900">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div role="status" className="rounded-2xl border border-slate-700 bg-slate-900/70 p-8 text-center">
      <p className="text-sm font-bold text-slate-200">No published Follow Alongs are available for this exam.</p>
      <p className="mt-2 text-xs text-slate-500">Content from another exam or a bundled fallback was not substituted.</p>
    </div>
  );
};

export const FollowAlongLandingPage = ({
  currentUser = null,
  previewOnly = false,
  examId = 'aws-saa-c03',
  examCode = 'AWS SAA-C03',
  onSelectProgramme = () => {}
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL_FOLLOW_ALONG_CATEGORIES);
  const [contentRequestRevision, setContentRequestRevision] = useState(0);
  const [contentStatus, setContentStatus] = useState('loading');
  const [programmes, setProgrammes] = useState([]);
  const [progressSummaries, setProgressSummaries] = useState({});
  const demoAccount = isDemoUser(currentUser);

  useEffect(() => {
    let active = true;
    setContentStatus('loading');
    setProgrammes([]);
    setProgressSummaries({});
    protectedFollowAlongContentService.listForExam(examId).then(async result => {
      if (!active) return;
      if (!result.success) {
        setContentStatus('unavailable');
        return;
      }
      const visible = applyProtectedFollowAlongVisibility({
        followAlongs: result.followAlongs,
        examId,
        previewOnly
      });
      if (!visible.success) {
        setContentStatus('unavailable');
        return;
      }
      const protectedFollowAlongs = visible.followAlongs;
      setProgrammes(protectedFollowAlongs.map(item => item.programme));
      setContentStatus(protectedFollowAlongs.length ? 'ready' : 'empty');
      setProgressSummaries(createPublishedProgressLoadingSummaries(protectedFollowAlongs));
      const summaries = await loadPublishedFollowAlongProgressSummaries(
        protectedFollowAlongs,
        demoAccount ? null : currentUser?.id || null,
        demoAccount
          ? { persistenceFactory: config => createFollowAlongPersistence(config, { storage: demoProgressStorage }) }
          : {}
      );
      if (active) setProgressSummaries(summaries);
    });
    return () => { active = false; };
  }, [contentRequestRevision, currentUser?.id, demoAccount, examId, previewOnly]);

  if (contentStatus !== 'ready') {
    return (
      <ProtectedFollowAlongState
        status={contentStatus}
        onRetry={() => setContentRequestRevision(revision => revision + 1)}
      />
    );
  }

  const orderedProgrammes = examId === 'terraform-associate-004'
    ? sortTerraformFollowAlongs(programmes)
    : programmes;
  const displayedProgrammes = orderedProgrammes;

  // Extract unique categories from only the content this account can open.
  const categories = getSortedFollowAlongCategories(displayedProgrammes);

  // Filter programmes
  const filteredProgrammes = displayedProgrammes.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === ALL_FOLLOW_ALONG_CATEGORIES || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const availableProgrammes = examId === 'terraform-associate-004'
    ? sortTerraformFollowAlongs(filteredProgrammes.filter(p => p.status === 'available'))
    : filteredProgrammes.filter(p => p.status === 'available');
  const comingSoonProgrammes = filteredProgrammes.filter(p => p.status !== 'available');
  const isAwsExam = examId.startsWith('aws-');
  const numberedProgrammeIds = examId === 'terraform-associate-004'
    ? new Map(programmes
      .filter(programme => programme.status === 'available')
      .map(programme => [programme.id, getTerraformFollowAlongNumber(programme.id, programmes)]))
    : new Map();

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Hero / Intro Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAwsExam ? 'Interactive AWS Guided Learning' : `${examCode} Guided Learning`}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Follow Alongs
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {isAwsExam
              ? 'Build complete AWS environments step by step. Each follow-along connects multiple guided tasks, preserves your resources between tasks, and supports both the AWS Console and AWS CLI.'
              : `Guided learning assigned specifically to ${examCode} will appear here. Follow Alongs from other exams stay hidden.`}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Multi-Task Connectivity
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Resource Preservation
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Console and CLI when available
            </span>
          </div>
        </div>

        {/* Ambient Glow Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-600/10 via-cyan-500/5 to-transparent pointer-events-none" />
      </div>

      {previewOnly && (
        <DemoContentNotice>
          Preview access includes two Follow Alongs in this exam workspace. Signed-in progress is saved. An active exam entitlement unlocks the complete assigned Follow Along library.
        </DemoContentNotice>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search follow-along topics..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Compact category filter */}
        <div className="w-full sm:w-80">
          <label htmlFor="follow-along-category" className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Filter by category
          </label>
          <div className="relative">
            <ListFilter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" />
            <select
              id="follow-along-category"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-10 text-xs font-semibold text-slate-200 outline-none transition-colors hover:border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === ALL_FOLLOW_ALONG_CATEGORIES ? 'All categories' : category}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Available Programmes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            Available Follow Alongs
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            {availableProgrammes.length} Available Topic
          </span>
        </div>

        {availableProgrammes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableProgrammes.map(prog => (
              <FollowAlongCard
                key={prog.id}
                programme={prog}
                cardNumber={numberedProgrammeIds.get(prog.id) ?? null}
                progressSummary={progressSummaries[prog.id] || null}
                onSelectProgramme={onSelectProgramme}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 text-xs">
            No active topics match your search filters.
          </div>
        )}
      </div>

      {/* Coming Soon Programmes Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            Coming Soon {isAwsExam ? 'AWS ' : ''}Topics
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            {comingSoonProgrammes.length} Upcoming Topics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comingSoonProgrammes.map(prog => (
            <FollowAlongCard
              key={prog.id}
              programme={prog}
              cardNumber={numberedProgrammeIds.get(prog.id) ?? null}
              onSelectProgramme={onSelectProgramme}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
