import React from 'react';
import { FollowAlongProgramme } from '../FollowAlongs/shared/FollowAlongProgramme.jsx';
import { DYNAMODB_FOLLOW_ALONG_CONFIG } from '../../data/dynamodbLearningPathData.js';
import { dynamodbLearningPathPersistence } from '../../services/dynamodbLearningPathService.js';
import { DYNAMODB_FOLLOW_ALONG_EXTENSIONS } from './DynamodbLearningPathExtensions.jsx';

export const DynamodbLearningPathView = props => (
  <FollowAlongProgramme config={DYNAMODB_FOLLOW_ALONG_CONFIG} persistence={dynamodbLearningPathPersistence} extensions={DYNAMODB_FOLLOW_ALONG_EXTENSIONS} {...props} />
);
