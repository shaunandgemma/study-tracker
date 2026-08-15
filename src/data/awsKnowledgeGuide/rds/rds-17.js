import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-17',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Storage Auto Scaling',
  status: 'ready',
  plainEnglish: 'RDS Storage Auto Scaling automatically increases the allocated storage capacity of an RDS DB instance when free disk space falls below a critical threshold. As database data grows, RDS scales storage seamlessly in the background up to a user-defined Maximum Storage Threshold, preventing application outages caused by storage-full conditions.',
  whyItMatters: 'Running out of database storage space causes the database engine to crash or enter a read-only `storage-full` state, creating severe application downtime. Storage Auto Scaling automates storage growth without manual monitoring.',
  workplaceExample: 'A rapidly growing startup enables Storage Auto Scaling with a Max Storage Threshold of 2,000 GB. When automated nightly data ingestion fills disk space past 90%, RDS automatically expands storage from 200 GB to 300 GB with zero downtime.',
  examFocus: 'SAA-C03 Storage Auto Scaling Rules:\n- Trigger Condition: Triggers when free storage space drops below 10% of allocated storage for at least 5 minutes.\n- One-Way Scaling: Storage Auto Scaling ONLY increases storage capacity; it NEVER automatically reduces or shrinks allocated storage space.\n- Maximum Threshold: You must set a Max Storage Threshold (`--max-allocated-storage`) to cap maximum cloud storage spending.\n- Zero Downtime: Storage scaling occurs online without rebooting or interrupting running queries.',
  keyPoints: [
    'Automatically expands RDS storage volume capacity when free space runs low.',
    'Triggers when free space is less than 10% of allocated storage for 5+ minutes.',
    'Prevents database crashes caused by `storage-full` disk exhaustion.',
    'One-way operation: Scales storage UP automatically, but NEVER scales storage DOWN.',
    'Requires setting a Maximum Storage Threshold to enforce cost guardrails.'
  ],
  commonMistake: 'Expecting Storage Auto Scaling to automatically shrink allocated database disk size after large tables are deleted. Storage reduction is not supported.',
  example: 'Enabling Storage Auto Scaling via AWS CLI:\naws rds modify-db-instance --db-instance-identifier prod-db --max-allocated-storage 1000 --apply-immediately',
  sources: [
    { title: 'Managing storage auto scaling in Amazon RDS', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIOPS.StorageScaling.html' }
  ]
});
