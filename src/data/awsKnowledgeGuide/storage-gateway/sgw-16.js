import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-16',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'Volume Gateway Stored Volumes',
  status: 'ready',
  plainEnglish: 'Volume Gateway Stored Volumes keep the entire primary dataset on local on-premises disks, giving applications full-speed local iSCSI access to all data at all times. The gateway asynchronously takes point-in-time snapshots of the local volumes and uploads them to Amazon S3 as EBS snapshots for durable off-site backup and disaster recovery.',
  whyItMatters: 'Applications requiring consistent, low-latency access to the complete dataset (e.g., transactional databases) cannot tolerate cache misses. Stored Volumes guarantee local-disk performance for every read while providing cloud-backed snapshot protection.',
  workplaceExample: 'A small manufacturing company runs an ERP database on a local server. They configure the database disk as a Volume Gateway stored volume. The full database stays on fast local SSDs. Every 4 hours, a snapshot is uploaded to S3, providing off-site recovery if the factory suffers a fire.',
  examFocus: 'SAA-C03 Stored Volume Mechanics:\n- Primary Data Location: Local on-premises disks (full dataset stored locally).\n- Cloud Backup: Asynchronous point-in-time EBS snapshots uploaded to Amazon S3.\n- Volume Size Limit: Up to 16 TB per volume (smaller than cached volumes).\n- Disaster Recovery: Restore EBS snapshots to EBS volumes attached to EC2 instances.\n- Key Difference: Stored = primary local, backup in cloud. Cached = primary in cloud, cache local.',
  keyPoints: [
    'Keeps the entire primary dataset on local on-premises disks for lowest-latency access.',
    'Takes asynchronous point-in-time snapshots uploaded to S3 as EBS snapshots.',
    'Supports individual volumes up to 16 TB in size.',
    'EBS snapshots can be restored to EC2 instances for cloud-based disaster recovery.',
    'Best for workloads requiring full local-speed access to the complete dataset.'
  ],
  commonMistake: 'Choosing Stored Volumes when the on-premises site has limited local storage capacity. Stored Volumes require enough local disk space to hold the entire dataset.',
  example: 'Stored Volume Disaster Recovery Flow:\n1. Application writes to local iSCSI stored volume.\n2. Gateway takes a point-in-time snapshot and uploads it to S3.\n3. If the local server fails, create an EBS volume from the latest snapshot.\n4. Attach the EBS volume to an EC2 instance and resume the application in AWS.',
  sources: [
    { title: 'Volume Gateway stored volumes', url: 'https://docs.aws.amazon.com/storagegateway/latest/vgw/StorageGatewayConcepts.html' }
  ]
});
