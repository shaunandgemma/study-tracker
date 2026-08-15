import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-25',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'Storage Gateway Local Cache',
  status: 'ready',
  plainEnglish: 'The Storage Gateway Local Cache is a dedicated local disk (or EBS volume in EC2 deployments) that stores frequently accessed data near the workload. Each gateway type uses local cache differently: S3 File Gateway caches recently read and written files, Volume Gateway (cached mode) caches hot blocks, and Tape Gateway caches recently written tape data pending upload. The cache improves read latency and buffers writes before they are uploaded to AWS.',
  whyItMatters: 'WAN bandwidth to AWS is limited and has higher latency than local storage. The local cache absorbs reads for hot data and stages writes locally before asynchronous upload, making on-premises applications perform as if data were on a local disk.',
  workplaceExample: 'An engineering team monitors their S3 File Gateway\'s CachePercentDirty CloudWatch metric. When it consistently exceeds 80%, they add a larger SSD cache disk to the gateway VM to prevent the upload buffer from falling behind during peak write hours.',
  examFocus: 'SAA-C03 Cache Monitoring & Sizing:\n- CacheHitPercent: Percentage of reads served from cache. Low values indicate the cache is too small.\n- CachePercentDirty: Percentage of cache data not yet uploaded to AWS. High values indicate upload backlog.\n- Upload Buffer: Staging area for data awaiting upload. Distinct from cache in Volume and Tape Gateways.\n- Sizing Rule: Cache should hold at least the active working set; upload buffer must handle peak write throughput.',
  keyPoints: [
    'Dedicated local disk storing frequently accessed data for low-latency reads.',
    'Stages written data locally before asynchronous upload to AWS storage.',
    'Used by S3 File Gateway (file cache), Volume Gateway (block cache), and Tape Gateway (tape cache).',
    'Key CloudWatch metrics: CacheHitPercent, CachePercentDirty, UploadBufferPercentUsed.',
    'Local cache is not a durable backup—it is a performance optimisation layer.'
  ],
  commonMistake: 'Relying on the local cache as a backup. If the gateway appliance fails and the cache disk is lost, any data not yet uploaded to AWS is also lost.',
  example: 'Monitoring Cache Health with CloudWatch:\n- CacheHitPercent < 60%: Cache is too small; consider adding more local disk.\n- CachePercentDirty > 80%: Upload backlog; check bandwidth or increase upload-buffer size.\n- UploadBufferPercentUsed > 90%: Writes may stall; increase upload bandwidth or buffer capacity.',
  sources: [
    { title: 'Monitoring Storage Gateway cache performance', url: 'https://docs.aws.amazon.com/storagegateway/latest/userguide/monitoring-cache.html' }
  ]
});
