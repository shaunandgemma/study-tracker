import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-15',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'Volume Gateway Cached Volumes',
  status: 'ready',
  plainEnglish: 'Volume Gateway Cached Volumes keep the primary copy of your data in Amazon S3 while retaining a cache of frequently accessed data on local gateway disks. On-premises applications connect to cached volumes via iSCSI and see standard block devices. Reads hit the local cache when possible; writes are acknowledged locally and then uploaded to S3 asynchronously.',
  whyItMatters: 'Cached Volumes dramatically reduce on-premises storage investment because only the hot working set occupies local disks—the complete dataset can be many terabytes in S3. This model is ideal when the full dataset is too large or expensive to store locally.',
  workplaceExample: 'A geospatial analytics company stores 50 TB of satellite imagery as cached volumes. Only the 5 TB of images actively being analysed reside in the local cache. Analysts access imagery at near-local speed, while the full 50 TB is stored durably and cost-effectively in S3.',
  examFocus: 'SAA-C03 Cached Volume Mechanics:\n- Primary Data Location: Amazon S3 (not directly accessible as S3 objects by the user).\n- Local Cache: Stores frequently accessed blocks; sized to hold the active working set.\n- Upload Buffer: Staging area for writes pending upload to S3.\n- Volume Size Limit: Up to 32 TB per volume.\n- EBS Snapshots: Point-in-time snapshots can be taken and used to create EBS volumes in AWS.',
  keyPoints: [
    'Primary data resides in Amazon S3; frequently accessed data is cached locally.',
    'Minimises on-premises storage costs by keeping only hot data on local disks.',
    'Requires both a cache disk and an upload-buffer disk on the gateway appliance.',
    'Supports individual volumes up to 32 TB in size.',
    'Supports EBS-compatible point-in-time snapshots for disaster recovery.'
  ],
  commonMistake: 'Under-sizing the upload buffer on a cached-volume gateway, causing write-back uploads to S3 to stall and new writes to block when the buffer fills.',
  example: 'Cached Volume Architecture:\nApplication → iSCSI → Volume Gateway → Local Cache (hot data) + Upload Buffer → Amazon S3 (full dataset)\nEBS Snapshots stored in S3 for DR restoration to EC2.',
  sources: [
    { title: 'Volume Gateway cached volumes', url: 'https://docs.aws.amazon.com/storagegateway/latest/vgw/StorageGatewayConcepts.html' }
  ]
});
