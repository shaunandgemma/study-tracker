import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-5',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'Amazon FSx Managed File Systems',
  status: 'ready',
  plainEnglish: 'Amazon FSx is a service portfolio of four fully managed, high-performance file systems tailored to popular enterprise storage engines: FSx for Windows File Server, FSx for Lustre, FSx for NetApp ONTAP, and FSx for OpenZFS. Instead of provisioning storage hardware or managing software updates, AWS handles hardware maintenance, backups, and software patching while giving you native access to feature-rich file storage systems.',
  whyItMatters: 'Self-hosting enterprise file servers (such as Windows file servers or NetApp appliances) on EC2 requires complex storage management, manual patching, and manual high-availability configuration. Amazon FSx automates infrastructure operational overhead while preserving 100% native file system feature compatibility.',
  workplaceExample: 'An enterprise wants to migrate legacy application file shares to AWS without rewriting application code or changing file access protocols. They deploy Amazon FSx for Windows File Server for Windows applications and Amazon FSx for NetApp ONTAP for multi-protocol Linux/Windows shares.',
  examFocus: 'SAA-C03 Core Concept:\n- Amazon FSx is a FAMILY of managed file system offerings, not a single file system.\n- FSx for Windows File Server: Native Windows SMB file system with Active Directory integration.\n- FSx for Lustre: Ultra-high-performance parallel file system for Linux HPC, AI/ML, and S3 data integration.\n- FSx for NetApp ONTAP: Multi-protocol (NFS, SMB, iSCSI) enterprise storage with deduplication and tiering.\n- FSx for OpenZFS: High-performance NFS file system based on OpenZFS for Linux/Unix workloads.',
  keyPoints: [
    'Family of four managed, high-performance file systems (Windows, Lustre, ONTAP, OpenZFS).',
    'Eliminates storage hardware management, software patching, and backup administration.',
    'Provides native protocol support (SMB, NFS, iSCSI, POSIX).',
    'Supports independent scaling of storage capacity and throughput capacity.',
    'Integrates with AWS KMS for encryption at rest and AWS Backup for automated backups.'
  ],
  commonMistake: 'Treating Amazon FSx as a single file system engine rather than matching the specific application protocol and feature requirements to the appropriate FSx family member.',
  example: 'FSx Service Selection:\n- Windows App + SMB + Active Directory -> FSx for Windows File Server\n- Machine Learning + High-throughput S3 integration -> FSx for Lustre\n- Enterprise SAN/NAS + Multiprotocol + Deduplication -> FSx for NetApp ONTAP.',
  sources: [
    { title: 'What is Amazon FSx?', url: 'https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is-fsx-w.html' }
  ]
});
