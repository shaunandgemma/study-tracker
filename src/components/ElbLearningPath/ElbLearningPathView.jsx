import React from 'react';
import { FollowAlongProgramme } from '../FollowAlongs/shared/FollowAlongProgramme.jsx';
import { ELB_FOLLOW_ALONG_CONFIG } from '../../data/elbLearningPathData.js';
import { elbLearningPathPersistence } from '../../services/elbLearningPathService.js';
import { ELB_FOLLOW_ALONG_EXTENSIONS } from './ElbLearningPathExtensions.jsx';

export const ElbLearningPathView = props => (
  <FollowAlongProgramme config={ELB_FOLLOW_ALONG_CONFIG} persistence={elbLearningPathPersistence} extensions={ELB_FOLLOW_ALONG_EXTENSIONS} {...props} />
);
