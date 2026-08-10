import React, { useState, useEffect } from 'react';
import { FollowAlongLandingPage } from './FollowAlongLandingPage.jsx';
import { VpcLearningPathView } from '../VpcLearningPath/VpcLearningPathView.jsx';
import { useAuth } from '../../features/auth/useAuth.js';
import { PublishedFollowAlongView } from './PublishedFollowAlongView.jsx';

export const FollowAlongsView = ({ initialProgrammeId = null }) => {
  const { currentUser } = useAuth();
  const [selectedProgrammeId, setSelectedProgrammeId] = useState(initialProgrammeId);

  // Sync state if initialProgrammeId prop changes
  useEffect(() => {
    if (initialProgrammeId) {
      setSelectedProgrammeId(initialProgrammeId);
    }
  }, [initialProgrammeId]);

  // If VPC topic selected, open VpcLearningPathView with Back button
  if (selectedProgrammeId === 'vpc-learning-path') {
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
      onSelectProgramme={(progId) => setSelectedProgrammeId(progId)}
    />
  );
};
