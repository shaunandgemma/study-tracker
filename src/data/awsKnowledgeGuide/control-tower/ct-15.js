import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ct-15', topicId: 'topic-control-tower', topicTitle: 'AWS Control Tower', objectiveCode: 'Management', title: 'Centralized Logging', status: 'ready',
  plainEnglish: 'Control Tower configures centralized governance logging across enrolled accounts and governed Regions, with logs delivered into the shared Log Archive account. CloudTrail records account activity and AWS Config records supported resource configuration changes and compliance evidence.',
  whyItMatters: 'Central collection makes organization-wide searches, retention, incident reconstruction, and compliance reporting possible even when individual workload accounts change.',
  workplaceExample: 'A central security pipeline analyses organization CloudTrail logs for suspicious API activity and Config history for the resulting resource state.',
  examFocus: 'CloudTrail answers who performed API activity; Config records configuration history and evaluates compliance. Protect central buckets and encryption keys and plan retention, lifecycle, replication, query, and access separately.',
  keyPoints: ['The Log Archive account centralizes governance logs.', 'CloudTrail and Config provide complementary evidence.', 'Policies authorize delivery from multiple accounts.', 'Centralized access should be separated from workload administration.', 'Logging coverage depends on enrolled accounts and governed Regions.'],
  commonMistake: 'Assuming the central buckets automatically include every application log, VPC Flow Log, or service log. Those require their own collection configuration.',
  example: 'Use Control Tower governance logs as the foundation, then add workload-specific CloudWatch Logs, flow logs, and security-service findings to the organization monitoring design.',
  sources: [{ title: 'Logging and monitoring in AWS Control Tower', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/logging-and-monitoring.html' }, { title: 'How AWS Control Tower works', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/how-control-tower-works.html' }]
});
