import React from 'react';
import { FollowAlongProgramme } from '../FollowAlongs/shared/FollowAlongProgramme.jsx';
import { RDS_FOLLOW_ALONG_CONFIG } from '../../data/rdsLearningPathData.js';
import { rdsLearningPathPersistence } from '../../services/rdsLearningPathService.js';
import { RDS_FOLLOW_ALONG_EXTENSIONS } from './RdsLearningPathExtensions.jsx';

export const RdsLearningPathView = props => (
  <FollowAlongProgramme config={RDS_FOLLOW_ALONG_CONFIG} persistence={rdsLearningPathPersistence} extensions={RDS_FOLLOW_ALONG_EXTENSIONS} {...props} />
);
