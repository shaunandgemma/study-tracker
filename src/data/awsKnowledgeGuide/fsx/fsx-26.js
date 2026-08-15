import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-26',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx Automatic Backups',
  status: 'ready',
  plainEnglish: 'Amazon FSx Automatic Backups continuously take daily, highly durable file-system-level backups of your FSx file systems during a user-specified daily backup window. Automatic backups are incremental (saving only changes made since the last backup) and are stored in Amazon S3 with 99.999999999% (11 9s) durability, with configurable retention periods from 1 to 90 days.',
  whyItMatters: 'Automating daily backups ensures your data is protected against ransomware, file corruption, or accidental deletion without requiring manual admin intervention or custom backup scripts.',
  workplaceExample: 'A system administrator sets an automatic backup window for 02:00 AM daily with a 30-day retention period. When a user accidentally deletes an important project directory on Tuesday afternoon, the admin restores the directory from Tuesday\'s 02:00 AM automatic backup.',
  examFocus: 'SAA-C03 Automatic Backup Characteristics:\n- Retention: Configurable from 1 to 90 days (default is 7 days).\n- Incremental: Storage-efficient; saves only block-level delta changes.\n- Consistency: File-system-consistent (uses Volume Shadow Copy Service on Windows).\n- AWS Backup Integration: Centralized backup policies across multiple AWS services and accounts.',
  keyPoints: [
    'Automated daily file system backups stored in Amazon S3.',
    'Incremental block-level backups minimize storage consumption.',
    'Configurable retention period from 1 to 90 days.',
    'Consistent backups using native file system snapshot mechanisms.',
    'Centralized management via AWS Backup policies.'
  ],
  commonMistake: 'Deleting an FSx file system assuming automatic backups will persist. When you delete an FSx file system, all automatic backups associated with it are deleted (unless managed by AWS Backup policies).',
  example: 'Configuring Automatic Backups via AWS CLI:\n`aws fsx update-file-system --file-system-id fs-0123456789abcdef0 --windows-configuration AutomaticBackupRetentionDays=30,DailyAutomaticBackupStartTime=02:00`',
  sources: [
    { title: 'Working with Backups in Amazon FSx', url: 'https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is-fsx-w.html' }
  ]
});
