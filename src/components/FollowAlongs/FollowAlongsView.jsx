import React, { useState, useEffect } from 'react';
import { FollowAlongLandingPage } from './FollowAlongLandingPage.jsx';
import { VpcLearningPathView } from '../VpcLearningPath/VpcLearningPathView.jsx';
import { Ec2LearningPathView } from '../Ec2LearningPath/Ec2LearningPathView.jsx';
import { useExam } from '../../context/ExamContext.jsx';

export const FollowAlongsView = ({ initialProgrammeId = null }) => {
  const { currentUser } = useExam();
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

  // If EC2 topic selected, open Ec2LearningPathView with Back button
  if (selectedProgrammeId === 'ec2-learning-path') {
    return (
      <Ec2LearningPathView
        onBackToLanding={() => setSelectedProgrammeId(null)}
      />
    );
  }

  // Otherwise, render landing page
  return (
    <FollowAlongLandingPage
      currentUser={currentUser}
      onSelectProgramme={(progId) => setSelectedProgrammeId(progId)}
    />
  );
};
