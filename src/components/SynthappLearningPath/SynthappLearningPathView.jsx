import React from 'react';
import { FollowAlongProgramme } from '../FollowAlongs/shared/FollowAlongProgramme.jsx';
import { SYNTHAPP_FOLLOW_ALONG_CONFIG } from '../../data/synthappLearningPathData.js';
import { synthappLearningPathPersistence } from '../../services/synthappLearningPathService.js';
import { SYNTHAPP_FOLLOW_ALONG_EXTENSIONS } from './SynthappLearningPathExtensions.jsx';

export const SynthappLearningPathView = props => (
  <FollowAlongProgramme config={SYNTHAPP_FOLLOW_ALONG_CONFIG} persistence={synthappLearningPathPersistence} extensions={SYNTHAPP_FOLLOW_ALONG_EXTENSIONS} {...props} />
);
