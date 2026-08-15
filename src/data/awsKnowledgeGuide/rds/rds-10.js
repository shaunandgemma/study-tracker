import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-10',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Read Replicas',
  status: 'ready',
  plainEnglish: 'Amazon RDS Read Replicas are read-only database instances created from a primary DB instance. RDS uses asynchronous database engine replication to stream updates from the primary to up to 15 Read Replicas. Client applications send read-only SQL queries (`SELECT`) to Read Replica endpoints, offloading read compute from the primary database.',
  whyItMatters: 'Heavy reporting queries and BI dashboards running on a primary database consume CPU and memory, causing slow transaction processing for web users. Read Replicas offload read traffic, scaling database read capacity horizontally.',
  workplaceExample: 'A reporting dashboard runs thousands of heavy SQL aggregation queries per minute. The DBA provisions 3 RDS Read Replicas. All reporting tools query the replica endpoints, freeing up 100% of primary database CPU for user transactions.',
  examFocus: 'SAA-C03 Read Replica Architecture & Behavior:\n- Replication Mode: Asynchronous engine replication (subject to small replication lag).\n- Scale Capacity: Up to 15 Read Replicas per primary DB instance.\n- Promotion to Standalone: A Read Replica can be promoted to a standalone read/write database instance.\n- Primary Requirement: Automated Backups MUST be enabled (`backupRetentionPeriod > 0`) on the primary DB instance to create Read Replicas.',
  keyPoints: [
    'Horizontal read-scaling mechanism supporting up to 15 Read Replicas per primary DB instance.',
    'Uses asynchronous replication (read queries may experience slight replication lag).',
    'Offloads read-intensive SQL queries (`SELECT`) from the primary database instance.',
    'Requires Automated Backups to be enabled on the primary DB instance.',
    'Can be promoted to an independent standalone read/write database instance.'
  ],
  commonMistake: 'Assuming Read Replica data replication is zero-lag synchronous. Replication is asynchronous; read queries on replicas may occasionally return slightly stale data.',
  example: 'Creating a Read Replica via AWS CLI:\naws rds create-db-instance-read-replica --db-instance-identifier prod-db-replica-1 --source-db-instance-identifier prod-db --db-instance-class db.r6g.large',
  sources: [
    { title: 'Working with Amazon RDS Read Replicas', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html' }
  ]
});
