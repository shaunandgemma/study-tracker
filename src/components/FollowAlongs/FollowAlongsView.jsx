import React, { useState, useEffect } from 'react';
import { FollowAlongLandingPage } from './FollowAlongLandingPage.jsx';
import { VpcLearningPathView } from '../VpcLearningPath/VpcLearningPathView.jsx';
import { useAuth } from '../../features/auth/useAuth.js';
import { PublishedFollowAlongView } from './PublishedFollowAlongView.jsx';

export const FollowAlongsView = ({ initialProgrammeId = null, examId = 'aws-saa-c03', examCode = 'AWS SAA-C03' }) => {
  const { currentUser, isDemoAccount } = useAuth();
  const [selectedProgrammeId, setSelectedProgrammeId] = useState(isDemoAccount ? null : initialProgrammeId);

  // Sync state if initialProgrammeId prop changes
  useEffect(() => {
    if (isDemoAccount) {
      setSelectedProgrammeId(null);
    } else if (initialProgrammeId) {
      setSelectedProgrammeId(initialProgrammeId);
    }
  }, [initialProgrammeId, isDemoAccount]);

  // If VPC topic selected, open VpcLearningPathView with Back button
  if (selectedProgrammeId === 'vpc-learning-path') {
    if (isDemoAccount) {
      return <div role="alert" className="rounded-2xl border border-cyan-800 bg-cyan-950/30 p-6 text-sm text-cyan-100">The legacy VPC path is unavailable in the isolated demo. Choose a published Follow Along instead.</div>;
    }
    return (
      <VpcLearningPathView
        onBackToLanding={() => setSelectedProgrammeId(null)}
      />
    );
  }

  if (selectedProgrammeId) {
    return <PublishedFollowAlongView programmeId={selectedProgrammeId} onBackToLanding={() => setSelectedProgrammeId(null)} />;
  }

  // Otherwise, render landing page
  return (
    <FollowAlongLandingPage
      currentUser={currentUser}
      examId={examId}
      examCode={examCode}
      onSelectProgramme={(progId) => setSelectedProgrammeId(progId)}
    />
  );
};
