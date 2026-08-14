import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-21', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Point-in-Time Recovery', status: 'ready',
  plainEnglish: 'Point-in-time recovery continuously backs up a DynamoDB table and lets you restore its data to a new table at a selected second within the supported recovery window, up to 35 days.',
  whyItMatters: 'PITR protects against accidental updates or deletes without requiring an operator to schedule frequent snapshot backups.',
  workplaceExample: 'A faulty script corrupts records at 14:05. The team restores the table to a new table at 14:04:59, validates it, and uses a controlled recovery process.',
  examFocus: 'A restore creates a new table rather than overwriting the original. PITR protects table data but application recovery still requires validation, permissions, indexes and settings review, and traffic redirection.',
  keyPoints: ['PITR provides continuous backups.', 'Recovery points have per-second granularity.', 'The supported window extends up to 35 days.', 'Restore creates a new DynamoDB table.', 'PITR does not consume table throughput or affect availability.'],
  commonMistake: 'Expecting PITR to roll the existing table backward in place.',
  example: 'Restore to Orders-Recovery, compare critical records, restore required surrounding configuration, then deliberately redirect the application.',
  sources: [{ title: 'Backup and restore for DynamoDB', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Backup-and-Restore.html' }, { title: 'Point-in-time recovery', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/PointInTimeRecovery.html' }]
});
