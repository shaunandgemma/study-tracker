import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-22', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB On-Demand Backups', status: 'ready',
  plainEnglish: 'An on-demand backup is a full point-in-time snapshot of a DynamoDB table created when requested. DynamoDB manages and encrypts it, and a restore creates a new table containing the data captured at backup time.',
  whyItMatters: 'On-demand backups suit long-term retention, audit milestones, pre-change protection, and scheduled backup policies managed through AWS Backup.',
  workplaceExample: 'Before a major data transformation, a team creates and labels an on-demand backup with the change record and retention requirement.',
  examFocus: 'On-demand backup creation does not consume provisioned throughput or affect table availability. Use PITR for continuous recent recovery and on-demand backups for retained snapshots and policy-driven archival.',
  keyPoints: ['A backup captures the entire table at one time.', 'Backup creation does not consume table throughput.', 'Backups are encrypted.', 'Restore creates a new table.', 'AWS Backup can centrally schedule and govern backups.'],
  commonMistake: 'Assuming one on-demand backup automatically contains every later table change.',
  example: 'Retain a monthly compliance snapshot through AWS Backup while PITR provides recovery from recent accidental changes.',
  sources: [{ title: 'Backup and restore for DynamoDB', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Backup-and-Restore.html' }, { title: 'On-demand backup and restore', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/BackupRestore.html' }]
});
