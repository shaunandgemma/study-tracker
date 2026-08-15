import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-3',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx for NetApp ONTAP (Multi-protocol SMB/NFS/iSCSI, Data Compression & Deduplication)',
  status: 'ready',
  plainEnglish: 'Amazon FSx for NetApp ONTAP combines multi-protocol file and block access (NFS, SMB, iSCSI) with enterprise data efficiency features including block-level Data Deduplication, Data Compression, and Data Compaction. These features run automatically in the background to reduce the physical SSD storage required for your data by up to 50% to 65%.',
  whyItMatters: 'Enterprise storage costs scale quickly. Built-in deduplication and compression reduce active SSD storage consumption automatically. When combined with automatic tiering to low-cost Capacity Pool storage, total cost of ownership (TCO) drops significantly.',
  workplaceExample: 'An enterprise hosts 100 virtual machine disk images and database backups on FSx for NetApp ONTAP. Because the VM images share identical operating system files, ONTAP Data Deduplication eliminates redundant blocks, reducing 50 TB of logical data down to 18 TB of physical SSD storage.',
  examFocus: 'SAA-C03 Data Efficiency & Storage Tiers:\n- Storage Efficiency: Inline & background Data Deduplication, Compression, and Compaction (reduces storage usage by up to 60%).\n- Storage Tiers: Primary SSD storage pool (for active data) + Capacity Pool tier (auto-tiered pool backed by low-cost S3 storage for cold data).\n- Data Management: NetApp Snapshots (instant point-in-time copies) and SnapMirror (cross-region replication).',
  keyPoints: [
    'Multi-protocol enterprise storage supporting NFS, SMB, and iSCSI.',
    'Built-in inline and background Data Deduplication and Compression reduce disk footprint up to 60%.',
    'Automatic data tiering moves cold data to a low-cost Capacity Pool tier.',
    'Supports NetApp Snapshots (zero-impact point-in-time volume backups).',
    'Supports NetApp SnapMirror for fast, efficient cross-region disaster recovery.'
  ],
  commonMistake: 'Manually expanding primary SSD storage capacity before enabling ONTAP Data Deduplication and Compression, missing out on immediate storage savings.',
  example: 'Checking Storage Efficiency Savings via NetApp CLI:\n`volume show-footprint -volume eng_vol` -> Reports 62% storage space saved via Deduplication & Compression.',
  sources: [
    { title: 'What is Amazon FSx for NetApp ONTAP?', url: 'https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/what-is-fsx-ontap.html' }
  ]
});
