import React, { useState } from 'react';
import { useExam } from '../../context/ExamContext';
import { TopicCard } from './TopicCard';
import { TerraformKnowledgeGuidePage } from './TerraformKnowledgeGuidePage.jsx';
import {
  TERRAFORM_KNOWLEDGE_GUIDE_ORDER,
  getTerraformKnowledgeGuide
} from '../../data/terraformKnowledgeGuide.js';
import { getAwsKnowledgeGuide } from '../../data/awsKnowledgeGuide.js';
import { DemoContentNotice } from '../../features/demo/DemoContentNotice.jsx';
import {
  DEMO_CONTENT_LIMITS,
  getDemoChecklistTopics,
  getDemoKnowledgeGuideOrder
} from '../../features/demo/demoContentPolicy.js';
import { 
  Search, 
  RotateCcw, 
  Sparkles, 
  CheckCircle, 
  Award, 
  Clock, 
  BookOpen, 
  Target,
  BarChart2,
  Zap,
  Plus,
  Layers,
  X,
  ChevronsUp,
  ChevronsDown,
  CheckSquare
} from 'lucide-react';

export const ChecklistView = ({ onLaunchPrepExam, startKnowledgeGuide = false, onExitKnowledgeGuide = () => {} }) => {
  const { activeExam, activeExamId, checklist, checkGroupTasks, resetExamProgress, addTopic, canManageContent, isDemoAccount } = useExam();
  const isAwsGuide = activeExamId === 'aws-saa-c03';
  const knowledgeGuideOrder = isDemoAccount
    ? getDemoKnowledgeGuideOrder(activeExam)
    : isAwsGuide
      ? (activeExam?.topics || []).flatMap(topic => (topic.items || []).map(item => item.id))
      : TERRAFORM_KNOWLEDGE_GUIDE_ORDER;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicCode, setNewTopicCode] = useState('AWS Service');
  const [newTopicWeight, setNewTopicWeight] = useState(15);
  const [newTopicDesc, setNewTopicDesc] = useState('');
  const [selectedKnowledgeGuide, setSelectedKnowledgeGuide] = useState(() => (
    startKnowledgeGuide
      ? { itemId: knowledgeGuideOrder[0] }
      : null
  ));

  if (!activeExam) return null;

  if ((activeExamId === 'terraform-associate-004' || isAwsGuide) && selectedKnowledgeGuide) {
    const currentIndex = knowledgeGuideOrder.indexOf(selectedKnowledgeGuide.itemId);
    const openGuideAtIndex = index => {
      const itemId = knowledgeGuideOrder[index];
      if (itemId) setSelectedKnowledgeGuide({ itemId });
    };

    return (
      <TerraformKnowledgeGuidePage
        guide={isAwsGuide ? getAwsKnowledgeGuide(selectedKnowledgeGuide.itemId) : getTerraformKnowledgeGuide(selectedKnowledgeGuide.itemId)}
        objectiveCode={selectedKnowledgeGuide.objectiveCode || (isAwsGuide
          ? getAwsKnowledgeGuide(selectedKnowledgeGuide.itemId)?.objectiveCode
          : `Objective ${selectedKnowledgeGuide.itemId.split('-')[1].charAt(0)}`)}
        currentIndex={currentIndex}
        totalLessons={knowledgeGuideOrder.length}
        onPrevious={currentIndex > 0 ? () => openGuideAtIndex(currentIndex - 1) : null}
        onNext={currentIndex < knowledgeGuideOrder.length - 1 ? () => openGuideAtIndex(currentIndex + 1) : null}
        guideName={isAwsGuide ? 'AWS SAA-C03 Knowledge Guide' : 'Terraform Knowledge Guide'}
        onBack={startKnowledgeGuide ? onExitKnowledgeGuide : () => setSelectedKnowledgeGuide(null)}
      />
    );
  }

  const topicsList = isDemoAccount
    ? getDemoChecklistTopics(activeExam)
    : activeExam.topics || activeExam.domains || [];

  // Calculate statistics across active exam
  let totalTasks = 0;
  let completedTasks = 0;

  topicsList.forEach(topic => {
    const items = topic.items || [];
    items.forEach(item => {
      totalTasks++;
      if (checklist[activeExamId]?.[item.id]) {
        completedTasks++;
      }
    });
    if (!items.length && topic.subtopics) {
      topic.subtopics.forEach(sub => {
        (sub.tasks || []).forEach(task => {
          totalTasks++;
          if (checklist[activeExamId]?.[task.id]) {
            completedTasks++;
          }
        });
      });
    }
  });

  const overallPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Readiness status badge text & styling
  let readinessBadge = { text: 'Getting Started', color: 'bg-slate-800 text-slate-300 border-slate-700' };
  if (overallPercent >= 80) {
    readinessBadge = { text: '🔥 Exam Ready!', color: 'bg-emerald-950 text-emerald-300 border-emerald-700' };
  } else if (overallPercent >= 40) {
    readinessBadge = { text: '⚡ Making Great Progress', color: 'bg-indigo-950 text-indigo-300 border-indigo-700' };
  }

  const handleReset = () => {
    if (window.confirm(`Are you sure you want to reset all checklist progress for ${activeExam.code}?`)) {
      resetExamProgress(activeExamId);
    }
  };

  const handleCheckAllGroups = () => {
    const allTaskIds = [];
    topicsList.forEach(topic => {
      const items = topic.items || [];
      items.forEach(item => allTaskIds.push(item.id));
      if (!items.length && topic.subtopics) {
        topic.subtopics.forEach(sub => {
          (sub.tasks || []).forEach(task => allTaskIds.push(task.id));
        });
      }
    });
    const allChecked = allTaskIds.length > 0 && allTaskIds.every(id => checklist[activeExamId]?.[id]);
    checkGroupTasks(activeExamId, allTaskIds, !allChecked);
  };

  const handleCreateTopic = (e) => {
    e.preventDefault();
    if (newTopicTitle.trim()) {
      addTopic(activeExamId, {
        title: newTopicTitle.trim(),
        code: newTopicCode.trim() || 'Service',
        weight: Number(newTopicWeight) || 10,
        description: newTopicDesc.trim() || 'Custom study topic/service.'
      });
      setNewTopicTitle('');
      setNewTopicDesc('');
      setIsAddingTopic(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Active Exam Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/40 p-6 sm:p-8 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                {activeExam.code}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${readinessBadge.color}`}>
                {readinessBadge.text}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                Passing Score: {activeExam.passingScore}%
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {activeExamId === 'terraform-associate-004' ? 'Terraform Knowledge Guide' : activeExam.title}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {activeExamId === 'terraform-associate-004'
                ? 'Start here before the practice exam and Follow Alongs. Open Study beside any row for a simple, detailed lesson, then tick the row when you understand it.'
                : activeExam.description}
            </p>

            <div className="flex items-center gap-6 pt-2 text-xs font-semibold text-slate-400">
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>{topicsList.length} Services / Topics</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>{activeExam.timeLimitMinutes} Mins Exam Duration</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-pink-400" />
                <span>{isDemoAccount ? DEMO_CONTENT_LIMITS.examQuestions : (activeExam.id === 'aws-saa-c03' ? 20 : (activeExam.questions?.length || 0))} Practice Questions</span>
              </div>
            </div>
          </div>

          {/* Overall Progress Gauge Widget */}
          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center min-w-[200px] shrink-0 text-center shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Exam Mastery
            </span>
            <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent my-1">
              {overallPercent}%
            </div>
            <p className="text-xs text-slate-400 mb-3">
              {completedTasks} of {totalTasks} tasks completed
            </p>
            <button
              onClick={() => onLaunchPrepExam()}
              className="w-full py-2 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <Zap className="w-4 h-4" /> Take Practice Exam
            </button>
          </div>
        </div>
      </div>

      {isDemoAccount && (
        <DemoContentNotice>
          The first {DEMO_CONTENT_LIMITS.checklistItems} checklist rows and their matching Knowledge Guide pages are available for this exam. Later objectives are reserved for signed-in learner accounts.
        </DemoContentNotice>
      )}

      {/* Filter Toolbar & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Instant Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services, subtopics, or micro-tasks (e.g. S3, IAM, VPC)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Buttons: Collapse/Expand All, Add Topic & Reset */}
        <div className="flex items-center gap-2.5 flex-wrap justify-end self-end sm:self-auto w-full sm:w-auto">
          
          {/* Segmented Collapse/Expand All Control */}
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1 shadow-sm">
            <button
              onClick={() => setAllCollapsed(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                allCollapsed ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Collapse all checklist topic cards"
            >
              <ChevronsUp className="w-3.5 h-3.5" />
              <span>Collapse All</span>
            </button>
            <button
              onClick={() => setAllCollapsed(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                !allCollapsed ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Expand all checklist topic cards"
            >
              <ChevronsDown className="w-3.5 h-3.5" />
              <span>Expand All</span>
            </button>
          </div>

          <button
            onClick={handleCheckAllGroups}
            className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-800 hover:border-indigo-700/60 transition-all flex items-center gap-2"
            title="Auto check all boxes in each checklist group"
          >
            <CheckSquare className="w-4 h-4 text-indigo-400" />
            <span>Check All Groups</span>
          </button>

          {canManageContent && <button
            onClick={() => setIsAddingTopic(!isAddingTopic)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Topic</span>
          </button>}

          <button
            onClick={handleReset}
            className="px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/60 transition-colors flex items-center gap-2"
            title="Reset Checklist Progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Level 1: Inline Form for Adding New Topic / Service */}
      {canManageContent && isAddingTopic && (
        <form onSubmit={handleCreateTopic} className="p-6 rounded-3xl bg-slate-900 border border-indigo-800/80 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Add New Topic / Service (Level 1)
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingTopic(false)}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
            <div className="sm:col-span-2">
              <label className="text-slate-300 font-bold block mb-1">Topic / Service Title</label>
              <input
                type="text"
                required
                autoFocus
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                placeholder="e.g. Amazon DynamoDB & NoSQL Storage"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Category / Code</label>
              <input
                type="text"
                value={newTopicCode}
                onChange={(e) => setNewTopicCode(e.target.value)}
                placeholder="e.g. AWS Databases"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="text-xs font-medium">
            <label className="text-slate-300 font-bold block mb-1">Description (Optional)</label>
            <input
              type="text"
              value={newTopicDesc}
              onChange={(e) => setNewTopicDesc(e.target.value)}
              placeholder="e.g. Fully managed NoSQL database, single-digit millisecond performance, DAX caching..."
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingTopic(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
            >
              Create Service Topic
            </button>
          </div>
        </form>
      )}

      {/* Topics Accordion List */}
      <div className="space-y-6">
        {topicsList.map(topic => (
          <TopicCard
            key={topic.id}
            topic={topic}
            searchQuery={searchQuery}
            forceCollapsed={allCollapsed}
            onOpenKnowledgeGuide={activeExamId === 'terraform-associate-004' || activeExamId === 'aws-saa-c03'
              ? (itemId, objectiveCode) => setSelectedKnowledgeGuide({ itemId, objectiveCode })
              : null}
            onLaunchTopicQuiz={(topicId) => onLaunchPrepExam({ mode: 'domain', domainId: topicId })}
          />
        ))}
      </div>

    </div>
  );
};
