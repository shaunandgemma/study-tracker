/**
 * Follow Along Programmes Catalogue Definition
 *
 * Central registry of all AWS follow-along learning paths.
 * Integrates VPC Learning Path as the first active topic and defines
 * coming-soon AWS topic cards.
 */

import { VPC_LEARNING_PATH_PHASES, VPC_PATH_TASKS } from './vpcLearningPathData.js';

export const FOLLOW_ALONG_PROGRAMMES = [
  {
    id: 'vpc-learning-path',
    slug: 'vpc',
    title: 'VPC Learning Path',
    shortTitle: 'VPC',
    subtitle: 'Virtual Private Cloud & Networking',
    description: 'Build a multi-AZ AWS network step by step using connected tasks, route tables, subnets, NAT gateways, endpoints, and security controls.',
    service: 'Amazon VPC',
    status: 'available', // 'available' | 'coming-soon'
    taskCount: VPC_PATH_TASKS.length,
    phaseCount: VPC_LEARNING_PATH_PHASES.length,
    supportedModes: ['console', 'cli', 'both'],
    icon: 'Network',
    category: 'Networking & Content Delivery',
    difficulty: 'Intermediate to Advanced',
    estimatedHours: '6 - 8 hours',
    pathId: 'vpc-learning-path',
    examId: 'aws-saa-c03'
  },
  {
    id: 'rds-learning-path',
    slug: 'rds',
    title: 'RDS Follow Along',
    shortTitle: 'RDS',
    subtitle: 'Relational Database Service',
    description: 'Deploy Multi-AZ relational databases, configure read replicas, automated backups, parameter groups, and KMS encryption.',
    service: 'Amazon RDS',
    status: 'coming-soon',
    taskCount: null,
    phaseCount: null,
    supportedModes: ['console', 'cli', 'both'],
    icon: 'Database',
    category: 'Databases',
    difficulty: 'Intermediate',
    estimatedHours: '4 - 5 hours'
  },
  {
    id: 'dynamodb-learning-path',
    slug: 'dynamodb',
    title: 'DynamoDB Follow Along',
    shortTitle: 'DynamoDB',
    subtitle: 'NoSQL Key-Value & Document Database',
    description: 'Design single-table schemas, secondary indexes (GSI/LSI), DynamoDB Streams, TTL, and Global Tables replication.',
    service: 'Amazon DynamoDB',
    status: 'coming-soon',
    taskCount: null,
    phaseCount: null,
    supportedModes: ['console', 'cli', 'both'],
    icon: 'Table',
    category: 'Databases',
    difficulty: 'Intermediate to Advanced',
    estimatedHours: '3 - 4 hours'
  },
  {
    id: 'lambda-learning-path',
    slug: 'lambda',
    title: 'Lambda Follow Along',
    shortTitle: 'Lambda',
    subtitle: 'Serverless Event-Driven Compute',
    description: 'Build event-driven serverless functions with S3/DynamoDB triggers, VPC integration, layers, and DLQ error handling.',
    service: 'AWS Lambda',
    status: 'coming-soon',
    taskCount: null,
    phaseCount: null,
    supportedModes: ['console', 'cli', 'both'],
    icon: 'Zap',
    category: 'Compute & Serverless',
    difficulty: 'Intermediate',
    estimatedHours: '4 - 5 hours'
  },
  {
    id: 'api-gateway-learning-path',
    slug: 'api-gateway',
    title: 'API Gateway Follow Along',
    shortTitle: 'API Gateway',
    subtitle: 'REST & HTTP API Management',
    description: 'Construct secure REST and HTTP APIs with Lambda integrations, Cognito authorizers, usage plans, and CORS controls.',
    service: 'Amazon API Gateway',
    status: 'coming-soon',
    taskCount: null,
    phaseCount: null,
    supportedModes: ['console', 'cli', 'both'],
    icon: 'Globe',
    category: 'App Integration',
    difficulty: 'Intermediate',
    estimatedHours: '3 - 4 hours'
  }
];

// Retain the original VPC implementation and catalogue record for compatibility,
// but keep it out of the normal learner catalogue while a replacement is planned.
export const HIDDEN_FOLLOW_ALONG_PROGRAMME_IDS = Object.freeze(['vpc-learning-path']);

export function isFollowAlongProgrammeVisible(programme) {
  return Boolean(programme?.id) && !HIDDEN_FOLLOW_ALONG_PROGRAMME_IDS.includes(programme.id);
}

export function isFollowAlongProgrammeForExam(programme, examId) {
  if (!programme || !examId) return false;
  const assignedExamIds = Array.isArray(programme.examIds) ? programme.examIds : [];
  if (assignedExamIds.length) return assignedExamIds.includes(examId);
  return (programme.examId || 'aws-saa-c03') === examId;
}

export const FOLLOW_ALONG_LANDING_PROGRAMMES = FOLLOW_ALONG_PROGRAMMES.filter(isFollowAlongProgrammeVisible);

export function getFollowAlongProgramme(idOrSlug) {
  if (!idOrSlug) return null;
  return FOLLOW_ALONG_PROGRAMMES.find(
    p => p.id === idOrSlug || p.slug === idOrSlug
  ) || null;
}
