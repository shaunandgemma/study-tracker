import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-20',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx for Lustre Persistent File Systems',
  status: 'ready',
  plainEnglish: 'FSx for Lustre Persistent File Systems are designed for longer-term storage and ongoing production workloads. Unlike Scratch file systems, Persistent file systems replicate data within the same Availability Zone, ensuring data remains available and resilient even if an underlying storage server hardware component fails.',
  whyItMatters: 'Production analytical pipelines and recurring AI model development require persistent storage that remains intact across compute restarts and hardware maintenance without relying on external S3 re-imports.',
  workplaceExample: 'A financial trading firm runs continuous daily quantitative modeling. They store their analytical codebase, historical tick data, and intermediate results on an FSx for Lustre Persistent_2 file system, ensuring high availability within their primary AZ.',
  examFocus: 'SAA-C03 Persistent Deployment Types:\n- Persistent_1 & Persistent_2: Replicated storage within 1 Availability Zone.\n- Automatically detects and replaces failed storage servers within minutes without data loss.\n- Throughput Levels: 125, 250, 500, or 1000 MB/s per TiB of provisioned SSD storage.\n- Supports automatic daily backups to AWS Backup.',
  keyPoints: [
    'Replicated, highly available parallel storage within a single Availability Zone.',
    'Protects data against storage server hardware failures.',
    'Designed for longer-term production analytical workloads and recurring jobs.',
    'Provides configurable throughput tiers (up to 1,000 MB/s per TiB).',
    'Supports automated daily backups and snapshot retention.'
  ],
  commonMistake: 'Assuming Persistent file systems replicate data across multiple Availability Zones. FSx for Lustre Persistent file systems are highly available WITHIN a single AZ.',
  example: 'Creating a Persistent_2 File System via AWS CLI:\n`aws fsx create-file-system --file-system-type LUSTRE --storage-capacity 2400 --subnet-ids subnet-prod1111 --lustre-configuration DeploymentType=PERSISTENT_2,PerUnitStorageThroughput=250`',
  sources: [
    { title: 'Amazon FSx for Lustre Deployment Types', url: 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/deployment-types.html' }
  ]
});
