import React, { useState, useEffect } from 'react';
import { Layers, Search, Sparkles, Network, CheckCircle2 } from 'lucide-react';
import { FOLLOW_ALONG_PROGRAMMES } from '../../data/followAlongProgrammes.js';
import { getProgrammeProgressSummary } from '../../services/vpcLearningPathService.js';
import { FollowAlongCard } from './FollowAlongCard.jsx';
import { createPublishedFollowAlongService, mergePublishedProgrammeCards } from '../../features/followAlongs/published/publishedFollowAlongService.js';

export const FollowAlongLandingPage = ({
  currentUser = null,
  onSelectProgramme = () => {}
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vpcSummary, setVpcSummary] = useState({ loading: true });
  const [programmes, setProgrammes] = useState(FOLLOW_ALONG_PROGRAMMES);

  useEffect(() => {
    let active = true;
    const service = createPublishedFollowAlongService();
    service.listPublishedProgrammes().then(result => {
      if (active && result.success) setProgrammes(mergePublishedProgrammeCards(FOLLOW_ALONG_PROGRAMMES, result.programmes));
    });
    return () => { active = false; };
  }, []);

  // Fetch the retained static VPC summary on mount or user change.
  useEffect(() => {
    let isMounted = true;

    async function loadSummaries() {
      setVpcSummary({ loading: true });
      try {
        const vSummary = await getProgrammeProgressSummary(currentUser?.id, 'vpc-learning-path');

        if (isMounted) {
          setVpcSummary(vSummary || { loading: false, status: 'not-started', completedTasks: 0, totalTasks: 45 });
        }
      } catch (err) {
        console.error('[FollowAlongLandingPage] Error loading summaries:', err);
        if (isMounted) {
          setVpcSummary({ loading: false, status: 'not-started', completedTasks: 0, totalTasks: 45, error: err.message });
        }
      }
    }

    loadSummaries();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // Extract unique categories
  const categories = ['All', ...new Set(programmes.map(p => p.category))];

  // Filter programmes
  const filteredProgrammes = programmes.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const availableProgrammes = filteredProgrammes.filter(p => p.status === 'available');
  const comingSoonProgrammes = filteredProgrammes.filter(p => p.status !== 'available');

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Hero / Intro Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive AWS Guided Learning</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Follow Alongs
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Build complete AWS environments step by step. Each follow-along connects multiple guided tasks, preserves your resources between tasks, and supports both the AWS Console and AWS CLI.
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

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
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
                progressSummary={
                  prog.id === 'vpc-learning-path'
                    ? vpcSummary
                    : null
                }
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
            Coming Soon AWS Topics
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
              onSelectProgramme={onSelectProgramme}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
