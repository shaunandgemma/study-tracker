import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-8',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'Volume Gateway',
  status: 'ready',
  plainEnglish: 'Volume Gateway presents iSCSI block storage volumes to on-premises servers. Applications and operating systems see standard block devices they can format with a filesystem (NTFS, ext4, XFS) and use like local disks. Behind the scenes, the gateway stores volume data in Amazon S3 and supports creating point-in-time EBS snapshots that can be used to create EBS volumes in AWS.',
  whyItMatters: 'Legacy enterprise applications (databases, ERP systems, email servers) require block storage devices, not file shares or object storage. Volume Gateway lets these applications continue using block storage while gaining cloud-backed durability and snapshot-based disaster recovery.',
  workplaceExample: 'A manufacturing company runs an on-premises SQL database that requires an iSCSI block volume. They deploy a Volume Gateway and present a cached volume to the database server. The data is stored durably in S3, and nightly EBS snapshots provide point-in-time recovery.',
  examFocus: 'SAA-C03 Volume Gateway Modes:\n- Cached Volumes: Primary data lives in S3; frequently accessed data is cached on the local gateway. Supports volumes up to 32 TB each.\n- Stored Volumes: Primary data lives on local disks; asynchronous point-in-time snapshots are uploaded to S3 as EBS snapshots. Supports volumes up to 16 TB each.\n- Snapshot Integration: Both modes create EBS-compatible snapshots in S3 that can be restored to EBS volumes on EC2.',
  keyPoints: [
    'Presents iSCSI block storage volumes to on-premises servers and applications.',
    'Two operational modes: Cached Volumes and Stored Volumes.',
    'Cached mode keeps primary data in S3 with a local hot-data cache.',
    'Stored mode keeps primary data locally and takes cloud-backed EBS snapshots.',
    'EBS snapshots enable disaster-recovery restoration to EC2 instances in AWS.'
  ],
  commonMistake: 'Assuming Cached Volumes and Stored Volumes work the same way. In Cached mode, primary data is in S3 (local cache only); in Stored mode, primary data is local (S3 holds snapshots only).',
  example: 'Volume Gateway Mode Selection:\n- "Minimise local storage investment, tolerate latency for cold data" → Cached Volumes\n- "Need full local dataset for lowest latency, want cloud snapshots for DR" → Stored Volumes',
  sources: [
    { title: 'Using Volume Gateway', url: 'https://docs.aws.amazon.com/storagegateway/latest/vgw/WhatIsStorageGateway.html' }
  ]
});
