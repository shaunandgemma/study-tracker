import React, { useState, useEffect } from 'react';
import { FollowAlongLandingPage } from './FollowAlongLandingPage.jsx';
import { useAuth } from '../../features/auth/useAuth.js';
import { PublishedFollowAlongView } from './PublishedFollowAlongView.jsx';
import { isExamPreviewOnly } from '../../features/access/applicationAccessPolicy.js';

export const FollowAlongsView = ({ examId = 'aws-saa-c03', examCode = 'AWS SAA-C03' }) => {
  const { currentUser, accessPolicy } = useAuth();
  const previewOnly = isExamPreviewOnly(accessPolicy, examId);
  const [selection, setSelection] = useState(null);
  const selectedProgrammeId = selection?.programmeId || null;

  // Direct or stale programme IDs never auto-open a learner route. The learner
  // must choose a card already filtered to the current exam and access tier.
  useEffect(() => {
    setSelection(null);
  }, [examId, previewOnly]);

  const selectFromCurrentExamCatalogue = programmeId => {
    setSelection({ programmeId, examId });
  };

  if (selectedProgrammeId) {
    return (
      <PublishedFollowAlongView
        programmeId={selectedProgrammeId}
        expectedExamId={examId}
        selectedFromExamCatalogue={selection?.examId === examId}
        onBackToLanding={() => setSelection(null)}
      />
    );
  }

  // Otherwise, render landing page
  return (
    <FollowAlongLandingPage
      currentUser={currentUser}
      previewOnly={previewOnly}
      examId={examId}
      examCode={examCode}
      onSelectProgramme={selectFromCurrentExamCatalogue}
    />
  );
};
