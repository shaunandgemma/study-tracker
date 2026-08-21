import React, { useState, useEffect, useRef } from 'react';
import { useExam } from '../../context/ExamContext';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Circle, 
  Zap, 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles,
  Check,
  X,
  ClipboardList,
  CheckSquare,
  ChevronRight
} from 'lucide-react';

export const TopicCard = ({
  topic,
  searchQuery,
  onLaunchTopicQuiz,
  forceCollapsed,
  onOpenKnowledgeGuide = null,
  contentManagementEnabled = true
}) => {
  const { 
    activeExamId, 
    checklist, 
    toggleTask, 
    checkGroupTasks,
    highlightedTopicId,
    editTopic,
    deleteTopic,
    addItem,
    addBulkItems,
    editItem,
    deleteItem,
    canManageContent
  } = useExam();
  const canEditContent = canManageContent && contentManagementEnabled;

  const [isOpen, setIsOpen] = useState(true);
  const cardRef = useRef(null);

  // Sync with global collapse/expand signal
  useEffect(() => {
    if (forceCollapsed !== undefined && forceCollapsed !== null) {
      setIsOpen(!forceCollapsed);
    }
  }, [forceCollapsed]);

  // In-app inline editing states
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [editTopicTitle, setEditTopicTitle] = useState(topic.title);
  const [editTopicCode, setEditTopicCode] = useState(topic.code || 'Service');

  // Single Item addition
  const [newItemText, setNewItemText] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Bulk Paste addition
  const [showBulkPasteModal, setShowBulkPasteModal] = useState(false);
  const [bulkText, setBulkText] = useState('');

  // Item inline edit state
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemText, setEditItemText] = useState('');

  const isHighlighted = highlightedTopicId === topic.id;

  // Auto-scroll and highlight if targeted by diagnostic jump
  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      setIsOpen(true);
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isHighlighted]);

  // Extract flat list of items (supporting both topic.items or legacy topic.subtopics)
  let flatItems = topic.items || [];
  if (!flatItems.length && topic.subtopics && topic.subtopics.length) {
    flatItems = [];
    topic.subtopics.forEach(sub => {
      (sub.tasks || []).forEach(t => {
        flatItems.push({ id: t.id, text: `${sub.title}: ${t.text}` });
      });
    });
  }

  // Calculate completion statistics
  let totalCount = flatItems.length;
  let completedCount = 0;

  flatItems.forEach(item => {
    if (checklist[activeExamId]?.[item.id]) {
      completedCount++;
    }
  });

  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Search filter
  const matchesSearch = (text) => {
    if (!searchQuery) return true;
    return (text || '').toLowerCase().includes(searchQuery.toLowerCase());
  };

  const topicMatches = matchesSearch(topic.title) || matchesSearch(topic.code);

  const filteredItems = flatItems.filter(item => matchesSearch(item.text) || topicMatches);

  if (searchQuery && filteredItems.length === 0) {
    return null;
  }

  // Save Topic Header Edits
  const handleSaveTopicEdit = () => {
    if (editTopicTitle.trim()) {
      editTopic(activeExamId, topic.id, {
        title: editTopicTitle.trim(),
        code: editTopicCode.trim()
      });
      setIsEditingTopic(false);
    }
  };

  // Add Single Item
  const handleCreateSingleItem = (e) => {
    e.preventDefault();
    if (newItemText.trim()) {
      addItem(activeExamId, topic.id, newItemText.trim());
      setNewItemText('');
      setIsAddingItem(false);
    }
  };

  // Add Bulk Items
  const handleCreateBulkItems = (e) => {
    e.preventDefault();
    if (bulkText.trim()) {
      const lines = bulkText.split(/\r?\n/).filter(line => line.trim().length > 0);
      addBulkItems(activeExamId, topic.id, lines);
      setBulkText('');
      setShowBulkPasteModal(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`rounded-3xl transition-all duration-300 border ${
        isHighlighted
          ? 'bg-indigo-950/70 border-indigo-500 shadow-2xl shadow-indigo-500/30 ring-2 ring-indigo-400'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700/80 shadow-xl'
      }`}
    >
      {/* Level 1: Service / Topic Header */}
      <div className="p-5 sm:p-6 border-b border-slate-800/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-start gap-4 flex-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mt-1 p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors shrink-0"
            >
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            <div className="flex-1">
              {canEditContent && isEditingTopic ? (
                <div className="space-y-2 max-w-lg">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editTopicCode}
                      onChange={(e) => setEditTopicCode(e.target.value)}
                      placeholder="Category (e.g. Storage)"
                      className="px-2.5 py-1 text-xs rounded-lg bg-slate-950 border border-slate-700 text-indigo-300 w-32"
                    />
                    <input
                      type="text"
                      value={editTopicTitle}
                      onChange={(e) => setEditTopicTitle(e.target.value)}
                      placeholder="Service Name (e.g. Amazon S3)"
                      className="flex-1 px-2.5 py-1 text-sm font-bold rounded-lg bg-slate-950 border border-slate-700 text-slate-100"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleSaveTopicEdit}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Save
                    </button>
                    <button
                      onClick={() => setIsEditingTopic(false)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {topic.code || 'Service'}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {completedCount} / {totalCount} checked ({percent}%)
                    </span>
                    {isHighlighted && (
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Focus Target
                      </span>
                    )}

                    {/* Topic Edit & Delete Buttons */}
                    {canEditContent && <div className="flex items-center gap-1 ml-auto sm:ml-2">
                      <button
                        onClick={() => {
                          setEditTopicTitle(topic.title);
                          setEditTopicCode(topic.code || 'Service');
                          setIsEditingTopic(true);
                        }}
                        className="p-1 rounded text-slate-500 hover:text-indigo-400 hover:bg-slate-800/60 transition-colors"
                        title="Edit Header"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete service topic "${topic.title}" and all its items?`)) {
                            deleteTopic(activeExamId, topic.id);
                          }
                        }}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800/60 transition-colors"
                        title="Delete Topic"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>}
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-100 mt-1 flex items-center gap-2">
                    {topic.title}
                  </h3>
                  {topic.description && (
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                      {topic.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions & Progress bar */}
          <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
            <button
              onClick={() => {
                const itemIds = flatItems.map(item => item.id);
                const allChecked = itemIds.length > 0 && itemIds.every(id => checklist[activeExamId]?.[id]);
                checkGroupTasks(activeExamId, itemIds, !allChecked);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-indigo-300 border border-slate-700/80 flex items-center gap-1.5 transition-all hover:scale-105"
              title={flatItems.length > 0 && flatItems.every(item => checklist[activeExamId]?.[item.id]) ? "Uncheck all boxes in this group" : "Auto check all boxes in this group"}
            >
              <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>{flatItems.length > 0 && flatItems.every(item => checklist[activeExamId]?.[item.id]) ? 'Uncheck Group' : 'Check All'}</span>
            </button>

            <button
              onClick={() => onLaunchTopicQuiz(topic.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/20 flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Quiz Service</span>
            </button>

            <div className="text-right min-w-[70px]">
              <span className="text-base font-extrabold text-indigo-400">
                {percent}%
              </span>
            </div>
          </div>

        </div>

        {/* Topic Progress Bar */}
        <div className="w-full bg-slate-950 h-2 rounded-full mt-4 overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Level 2: Flat Single-Level Items List */}
      {isOpen && (
        <div className="p-5 sm:p-6 space-y-4 bg-slate-950/40 rounded-b-3xl">
          
          {/* List of Checkable Items */}
          <div className="space-y-2.5">
            {filteredItems.map(item => {
              const isChecked = !!checklist[activeExamId]?.[item.id];
              const isEditingThisItem = canEditContent && editingItemId === item.id;

              return (
                <div
                  key={item.id}
                  className={`group relative flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all duration-150 ${
                    isChecked
                      ? 'bg-indigo-950/30 border-indigo-800/60 text-slate-300'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-200 shadow-sm'
                  }`}
                >
                  {isEditingThisItem ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        value={editItemText}
                        onChange={(e) => setEditItemText(e.target.value)}
                        className="flex-1 p-1.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-medium"
                      />
                      <button
                        onClick={() => {
                          if (editItemText.trim()) {
                            editItem(activeExamId, topic.id, item.id, editItemText.trim());
                            setEditingItemId(null);
                          }
                        }}
                        className="p-1.5 bg-emerald-600 text-white rounded-xl"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingItemId(null)}
                        className="p-1.5 bg-slate-800 text-slate-400 rounded-xl"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <label
                        onClick={() => toggleTask(activeExamId, item.id)}
                        className="flex items-start gap-3 cursor-pointer flex-1"
                      >
                        <div className="mt-0.5 shrink-0">
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                        <span className={`text-xs sm:text-sm leading-relaxed font-medium ${isChecked ? 'line-through opacity-60 text-slate-400' : ''}`}>
                          {item.text}
                        </span>
                      </label>

                      {onOpenKnowledgeGuide && (
                        <button
                          type="button"
                          onClick={() => onOpenKnowledgeGuide(item.id, topic.code)}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-violet-800/70 bg-violet-950/40 px-3 py-2 text-xs font-bold text-violet-200 transition hover:border-violet-500 hover:bg-violet-900/60"
                          aria-label={`Study ${item.text}`}
                          title="Open this Knowledge Guide lesson"
                        >
                          <span className="hidden sm:inline">Study</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}

                      {/* Edit & Delete Action Buttons */}
                      {canEditContent && <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setEditItemText(item.text);
                            setEditingItemId(item.id);
                          }}
                          className="p-1 text-slate-500 hover:text-indigo-400"
                          title="Edit Item"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteItem(activeExamId, topic.id, item.id)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Item Actions Toolbar */}
          {canEditContent && <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80">
            
            {/* Inline Add Single Item Form */}
            {isAddingItem ? (
              <form onSubmit={handleCreateSingleItem} className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  autoFocus
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder="Enter new subtopic or feature (e.g. CloudWatch Logs)..."
                  className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shrink-0"
                >
                  Add Subtopic
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="px-3 py-2.5 bg-slate-800 text-slate-400 rounded-xl text-xs font-medium shrink-0"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 w-full justify-between">
                <button
                  onClick={() => setIsAddingItem(true)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/60 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> + Add Subtopic
                </button>

                <button
                  onClick={() => setShowBulkPasteModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-800/60 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ClipboardList className="w-4 h-4" /> Bulk Import / Paste List
                </button>
              </div>
            )}

          </div>}

        </div>
      )}

      {/* Bulk Paste Modal */}
      {canEditContent && showBulkPasteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-slate-100">Bulk Paste Subtopics for {topic.title}</h3>
              </div>
              <button
                onClick={() => setShowBulkPasteModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Paste a newline-separated list of subtopics below (e.g. copied from study notes or AWS documentation). Each line will become a separate checkmark row.
            </p>

            <form onSubmit={handleCreateBulkItems} className="space-y-4">
              <textarea
                rows={8}
                autoFocus
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`CloudWatch Logs\nCloudWatch Metrics\nCloudWatch Alarms\nContainer Insights`}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500 leading-relaxed"
              />

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBulkPasteModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add All Subtopics
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
