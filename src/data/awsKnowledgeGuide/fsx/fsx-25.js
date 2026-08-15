import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-25',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx SSD and HDD Storage Options',
  status: 'ready',
  plainEnglish: 'Amazon FSx file systems offer two physical disk storage types to balance performance against cost:\n- Solid-State Drive (SSD) Storage: High-performance, low-latency storage designed for active, latency-sensitive production workloads, high-IOPS databases, and active user shares.\n- Hard Disk Drive (HDD) Storage: Lower-cost magnetic storage designed for broad throughput-intensive workloads, large home directories, content management systems, and large data archives.',
  whyItMatters: 'Storage hardware accounts for a major portion of cloud infrastructure costs. Selecting HDD storage for large, throughput-heavy file shares (like video archives or home directories) lowers storage costs by up to 80% compared to SSD storage.',
  workplaceExample: 'A law firm manages 100 TB of archived legal case files. They provision FSx for Windows using HDD storage for the case archive, saving thousands of dollars per month, while provisioning SSD storage for their active case management SQL Server database.',
  examFocus: 'SAA-C03 SSD vs HDD Selection Rules:\n- SSD Storage: Recommended for high IOPS, low latency, active databases, small-file workloads, and high-frequency access.\n- HDD Storage: Available on FSx for Windows and FSx for Lustre (Persistent). Recommended for large file shares, home directories, backups, and sequential throughput workloads (minimum storage size limits apply, e.g. 2 TB+ for HDD).',
  keyPoints: [
    'SSD storage offers lowest latencies and highest IOPS for active production workloads.',
    'HDD storage offers lower cost per GB for large throughput-oriented file shares.',
    'HDD storage is available on FSx for Windows File Server and FSx for Lustre.',
    'FSx for NetApp ONTAP combines SSD storage with automatic tiering to S3 capacity pools.',
    'Disk type is selected during file system creation based on workload characteristics.'
  ],
  commonMistake: 'Choosing expensive SSD storage for a 200 TB cold document archive that is accessed only once a month, needlessly inflating storage costs.',
  example: 'Creating an HDD-backed FSx for Windows File System:\n`aws fsx create-file-system --file-system-type WINDOWS --storage-type HDD --storage-capacity 4000 --subnet-ids subnet-11111111 --windows-configuration ThroughputCapacity=16`',
  sources: [
    { title: 'Amazon FSx Storage Options', url: 'https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is-fsx-w.html' }
  ]
});
