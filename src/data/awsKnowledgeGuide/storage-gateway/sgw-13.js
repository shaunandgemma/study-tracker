import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-13',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'File Gateway Local Cache',
  status: 'ready',
  plainEnglish: 'The S3 File Gateway Local Cache is a dedicated local disk on the gateway appliance that stores recently read and recently written file data. When on-premises applications access a file through the gateway, the gateway first checks the local cache. Cache hits return data at local-disk speed; cache misses trigger a download from S3 over the network.',
  whyItMatters: 'Without a local cache, every file read would travel across the WAN to S3, introducing latency of hundreds of milliseconds or more. The cache gives frequently accessed files near-LAN performance while keeping the authoritative dataset in S3.',
  workplaceExample: 'A video editing team frequently re-opens the same project files throughout the day. The S3 File Gateway keeps those project files in its local cache disk, delivering sub-millisecond read latency. Older files evicted from the cache are fetched from S3 on demand.',
  examFocus: 'SAA-C03 File Gateway Cache Behaviour:\n- Cache Hits: Serve data directly from local disk at near-LAN speed.\n- Cache Misses: Trigger asynchronous download from S3 (higher latency on first access).\n- Eviction Policy: Least-recently-used (LRU) data is evicted when the cache fills.\n- Sizing Guidance: Cache should be large enough to hold the working set of actively used files.\n- Not a Backup: The local cache is not an independent durable copy of data.',
  keyPoints: [
    'Dedicated local disk storing recently accessed file data for low-latency reads.',
    'Cache hits return data at local-disk speed; cache misses fetch from S3.',
    'Uses an LRU (least-recently-used) eviction policy when cache capacity is reached.',
    'Must be sized to hold the active working set of frequently accessed files.',
    'The local cache is not a durable backup; authoritative data resides in S3.'
  ],
  commonMistake: 'Provisioning a very small cache disk that cannot hold the daily working set of files, causing frequent cache misses and slow S3 fetches for routine file access.',
  example: 'Cache Sizing Estimate:\nDaily working set: 500 GB of frequently accessed files\nRecommended cache disk: At least 500 GB + headroom for write uploads\nResult: Most reads served from local cache at disk speed',
  sources: [
    { title: 'Sizing local cache storage for File Gateway', url: 'https://docs.aws.amazon.com/storagegateway/latest/userguide/resource-gateway-hardware.html' }
  ]
});
