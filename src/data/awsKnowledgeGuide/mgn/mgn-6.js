import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mgn-6',
  topicId: 'topic-mgn',
  topicTitle: 'AWS MGN (Application Migration Service)',
  objectiveCode: 'Management',
  title: 'Block-Level Continuous Replication',
  status: 'ready',
  plainEnglish: 'Block-Level Continuous Replication is the core data transfer mechanism in AWS MGN. Rather than copying individual files or taking periodic file system backups, MGN captures modified storage disk sectors (blocks) at the operating system storage layer as writes occur and streams them continuously into staging Amazon EBS volumes in AWS.',
  whyItMatters: 'File-based copy mechanisms lock files or fail on active database files. Block-level replication operates below the file system, enabling seamless, transparent continuous synchronization of live SQL databases and active file servers without downtime.',
  workplaceExample: 'An enterprise migrates a busy Oracle database server. MGN performs an initial full sync of all disk blocks, followed by continuous block replication. As new transactions write to local disk blocks on-premises, MGN streams the modified blocks to staging EBS volumes within seconds.',
  examFocus: 'SAA-C03 Continuous Replication Lifecycle:\n1. Initial Sync: Full block-by-block copy of source disks to staging EBS volumes.\n2. Continuous Sync: Asynchronous streaming of changed disk blocks (near-zero lag).\n3. Resiliency: Automatically resumes from the last confirmed block checkpoint after temporary network drops.\n4. Encryption: Data is encrypted in transit (TLS) and at rest (KMS EBS encryption) in staging.',
  keyPoints: [
    'Operates at the OS storage driver level below the file system layer.',
    'Streams modified disk blocks continuously to maintain near-real-time synchronization.',
    'Handles active databases and locked files seamlessly without application downtime.',
    'Resumes automatically after network interruptions without restarting full sync.',
    'Encrypts data in transit over TLS and at rest on staging EBS volumes via AWS KMS.'
  ],
  commonMistake: 'Assuming block-level continuous replication guarantees zero data loss without quiescing active database writes during final cutover.',
  example: 'Checking Replication Lag via AWS CLI:\naws mgn describe-source-servers --query "items[*].dataReplicationInfo.replicationLagTicks"',
  sources: [
    { title: 'Data replication in AWS Application Migration Service', url: 'https://docs.aws.amazon.com/mgn/latest/ug/data-replication.html' }
  ]
});
