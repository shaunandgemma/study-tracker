import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-27',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx Manual Backups',
  status: 'ready',
  plainEnglish: 'Amazon FSx Manual Backups are point-in-time file system backups created on demand by users or automated scripts. Unlike automatic backups, manual backups are never automatically deleted by AWS retention rules; they persist in Amazon S3 until you explicitly delete them, even if the parent FSx file system is deleted.',
  whyItMatters: 'Before performing major software upgrades, schema migrations, or infrastructure modifications, taking an instant manual backup creates a permanent, safe restore point.',
  workplaceExample: 'Before deploying a major software patch to an enterprise application, a DevOps engineer creates a manual backup named `pre-upgrade-2026-08-15`. The manual backup persists safely in S3 as a long-term milestone archive.',
  examFocus: 'SAA-C03 Manual Backup Details:\n- On-demand point-in-time backup created by user/CLI.\n- Persistence: Persists indefinitely until explicitly deleted (remains intact even if the file system is deleted).\n- Use Case: Pre-upgrade restore points, long-term archival milestones, and cross-region backup copy operations.',
  keyPoints: [
    'User-initiated point-in-time backups created on demand.',
    'Persists indefinitely until explicitly deleted by an administrator.',
    'Remains intact even if the parent FSx file system is deleted.',
    'Ideal for pre-deployment snapshots and baseline regulatory archives.',
    'Can be copied across AWS accounts and AWS Regions for disaster recovery.'
  ],
  commonMistake: 'Relying exclusively on daily automatic backups before running a risky data migration, risking a restore window roll-forward overwrite.',
  example: 'Creating a Manual Backup via AWS CLI:\n`aws fsx create-backup --file-system-id fs-0123456789abcdef0 --tags Key=Name,Value=pre-patch-baseline`',
  sources: [
    { title: 'Working with Backups in Amazon FSx', url: 'https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is-fsx-w.html' }
  ]
});
