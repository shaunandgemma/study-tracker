import React, { useState } from 'react';
import { useExam } from '../../context/ExamContext';
import { X, Plus, Award } from 'lucide-react';

export const AddExamModal = ({ isOpen, onClose }) => {
  const { addCustomExam } = useExam();

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [passingScore, setPassingScore] = useState(70);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(90);

  // Template domains generator
  const [domain1Name, setDomain1Name] = useState('Domain 1: Core Fundamentals');
  const [domain2Name, setDomain2Name] = useState('Domain 2: Advanced Architecture');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code || !title) return;

    const newExamId = `custom-${Date.now()}`;
    const newExam = {
      id: newExamId,
      code: code.trim(),
      title: title.trim(),
      description: description.trim() || 'Custom user certification exam.',
      passingScore: Number(passingScore) || 70,
      timeLimitMinutes: Number(timeLimitMinutes) || 90,
      domains: [
        {
          id: `${newExamId}-d1`,
          code: 'Domain 1',
          title: domain1Name || 'Domain 1',
          weight: 50,
          description: 'Core concepts and basic architecture.',
          subtopics: [
            {
              id: `${newExamId}-1.1`,
              title: '1.1 Foundations & Standards',
              tasks: [
                { id: `${newExamId}-t1`, text: 'Understand basic architecture design patterns' },
                { id: `${newExamId}-t2`, text: 'Implement security and governance guidelines' }
              ]
            }
          ]
        },
        {
          id: `${newExamId}-d2`,
          code: 'Domain 2',
          title: domain2Name || 'Domain 2',
          weight: 50,
          description: 'Advanced optimization and operational excellence.',
          subtopics: [
            {
              id: `${newExamId}-2.1`,
              title: '2.1 Optimization & Maintenance',
              tasks: [
                { id: `${newExamId}-t3`, text: 'Configure automated monitoring and alerts' },
                { id: `${newExamId}-t4`, text: 'Perform regular audit and performance tuning' }
              ]
            }
          ]
        }
      ],
      questions: [
        {
          id: `${newExamId}-q1`,
          domainId: `${newExamId}-d1`,
          difficulty: 'Medium',
          type: 'single',
          question: `Sample question for ${title}: What is the primary best practice for secure access management?`,
          options: [
            'Sharing root credentials among team members',
            'Applying least-privilege permissions and multi-factor authentication',
            'Disabling password expiration policies',
            'Using HTTP for internal service communication'
          ],
          correctAnswers: [1],
          explanation: 'Applying least privilege ensures users and services have only the permissions required for their tasks, while MFA adds an essential extra layer of security.'
        }
      ]
    };

    addCustomExam(newExam);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-100">Add Custom Certification Exam</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          <div>
            <label className="text-slate-300 font-bold block mb-1">Exam Short Code (e.g. CKA, CISSP, CCNA)</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g., CKA"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Full Exam Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Certified Kubernetes Administrator"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Short Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Validates skills in Kubernetes installation, configuration and management."
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Passing Threshold (%)</label>
              <input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Duration (Minutes)</label>
              <input
                type="number"
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-slate-400 font-bold block mb-2">Default Domain Structure</span>
            <div className="space-y-2">
              <input
                type="text"
                value={domain1Name}
                onChange={(e) => setDomain1Name(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
              />
              <input
                type="text"
                value={domain2Name}
                onChange={(e) => setDomain2Name(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Exam
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
