import React, { useState, useEffect } from 'react';
import { Layers, Search, Sparkles, Network, CheckCircle2, ListFilter, ChevronDown } from 'lucide-react';
import { FOLLOW_ALONG_LANDING_PROGRAMMES, isFollowAlongProgrammeForExam, isFollowAlongProgrammeVisible } from '../../data/followAlongProgrammes.js';
import { FollowAlongCard } from './FollowAlongCard.jsx';
import { createPublishedFollowAlongService, mergePublishedProgrammeCards } from '../../features/followAlongs/published/publishedFollowAlongService.js';
import { createPublishedProgressLoadingSummaries, loadPublishedFollowAlongProgressSummaries } from '../../features/followAlongs/published/publishedFollowAlongProgress.js';
import { ALL_FOLLOW_ALONG_CATEGORIES, getSortedFollowAlongCategories } from '../../features/followAlongs/published/followAlongCategoryFilter.js';
import { getTerraformFollowAlongNumber, sortTerraformFollowAlongs } from '../../features/followAlongs/published/terraformFollowAlongOrder.js';
import { createFollowAlongPersistence } from '../../services/followAlongPersistenceService.js';
import { demoProgressStorage, isDemoUser } from '../../features/demo/demoMode.js';

export const FollowAlongLandingPage = ({
  currentUser = null,
  examId = 'aws-saa-c03',
  examCode = 'AWS SAA-C03',
  onSelectProgramme = () => {}
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL_FOLLOW_ALONG_CATEGORIES);
  const [programmes, setProgrammes] = useState(() => FOLLOW_ALONG_LANDING_PROGRAMMES.filter(programme => isFollowAlongProgrammeForExam(programme, examId)));
  const [progressSummaries, setProgressSummaries] = useState({});
  const demoAccount = isDemoUser(currentUser);

  useEffect(() => {
    let active = true;
    const service = createPublishedFollowAlongService();
    setProgressSummaries({});
    service.listPublishedProgrammes().then(async result => {
      if (!active || !result.success) return;
      setProgrammes(
        mergePublishedProgrammeCards(FOLLOW_ALONG_LANDING_PROGRAMMES, result.programmes)
          .filter(isFollowAlongProgrammeVisible)
          .filter(programme => isFollowAlongProgrammeForExam(programme, examId))
      );
      setProgressSummaries(createPublishedProgressLoadingSummaries(result.rows));
      const summaries = await loadPublishedFollowAlongProgressSummaries(
        result.rows,
        demoAccount ? null : currentUser?.id || null,
        demoAccount
          ? { persistenceFactory: config => createFollowAlongPersistence(config, { storage: demoProgressStorage }) }
          : {}
      );
      if (active) setProgressSummaries(summaries);
    });
    return () => { active = false; };
  }, [currentUser?.id, demoAccount, examId]);

  // Extract unique categories
  const categories = getSortedFollowAlongCategories(programmes);

  // Filter programmes
  const filteredProgrammes = programmes.filter(p => {
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
