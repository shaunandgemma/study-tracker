import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cfg-6',
  topicId: 'topic-config',
  topicTitle: 'AWS Config',
  objectiveCode: 'Management',
  title: 'Configuration Snapshots',
  status: 'ready',
  plainEnglish: 'A Configuration Snapshot is a point-in-time point snapshot of all recorded AWS resources and their current configurations in your AWS account for a specific region. Unlike Configuration History (which tracks changes over time as they happen), a Configuration Snapshot provides a complete point-in-time export of your entire infrastructure inventory.',
  whyItMatters: 'Configuration Snapshots allow organizations to generate full compliance reports, perform complete inventory audits, and export their entire AWS configuration baseline to an S3 bucket or third-party analysis tool on demand or on a scheduled basis.',
  workplaceExample: 'A chief information security officer (CISO) requires a monthly snapshot of all active infrastructure assets across all AWS accounts for regulatory reporting. The DevOps team uses AWS CLI to trigger a CloudFront/AWS Config Configuration Snapshot, delivering a complete inventory JSON file to the compliance S3 bucket.',
  examFocus: 'SAA-C03 distinction: Configuration Item (CI) = single change to 1 resource. Configuration History = timeline of CIs over time for resources. Configuration Snapshot = full baseline export of ALL recorded resources at a specific moment in time delivered to S3.',
  keyPoints: [
    'Point-in-time collection of all recorded resources in an account and region.',
    'Exported as a JSON file directly to a specified Amazon S3 bucket.',
    'Can be generated on demand using the AWS CLI or SDK.',
    'Used for inventory tracking, regulatory reporting, and baseline audits.',
    'Provides a complete state model of all supported resources at a single moment.'
  ],
  commonMistake: 'Confusing AWS Config Configuration Snapshots with EBS Snapshots or RDS Snapshots. EBS/RDS snapshots copy block storage data, whereas AWS Config Snapshots export resource metadata and setting configurations.',
  example: 'AWS CLI Command to deliver snapshot:\n`aws configservice deliver-config-snapshot --delivery-channel-name default`\nResult: JSON file containing all resource states generated in S3.',
  sources: [
    { title: 'AWS Config Concepts - Configuration Snapshot', url: 'https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html' }
  ]
});
