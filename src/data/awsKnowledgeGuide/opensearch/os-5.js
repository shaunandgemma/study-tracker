import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'os-5',
  topicId: 'topic-opensearch',
  topicTitle: 'Amazon OpenSearch Service',
  objectiveCode: 'Analytics',
  title: 'Data Nodes',
  status: 'ready',
  plainEnglish: 'Data Nodes are the worker instances in an OpenSearch domain responsible for storing index shards, processing document indexing requests, executing full-text search queries, and computing aggregations. They perform the heavy compute and disk I/O operations of the cluster.',
  whyItMatters: 'Proper data node sizing determines cluster throughput and latency. Choosing memory-optimized (`r6g.search`) or storage-optimized (`i3.search`) instances prevents JVM memory pressure and disk bottlenecking during heavy search or ingestion workloads.',
  workplaceExample: 'An analytics platform experiences high search query loads. They scale out their data node fleet from 4 to 8 `r6g.large.search` instances, distributing index shards evenly and reducing average search response times from 250 ms to 35 ms.',
  examFocus: 'SAA-C03 Data Node Sizing & Roles:\n- Responsibilities: Store index data (Primary & Replica Shards), process search queries, perform aggregations, handle bulk indexing.\n- Instance Families: Standard (`m6g`), Memory-Optimized (`r6g`), Storage-Optimized (`i3`).\n- High Availability: Data nodes should be distributed across 2 or 3 Availability Zones.\n- JVM Heap Rule: Data node RAM is allocated 50% to JVM heap (up to 32 GB max) and 50% to OS file system cache.',
  keyPoints: [
    'Worker instances that store index shards and process search/indexing traffic.',
    'Execute complex full-text search queries, term filtering, and aggregations.',
    'Attached to EBS storage or instance store NVMe SSDs for fast disk I/O.',
    'Distributed across multiple Availability Zones for high availability.',
    'Monitored via CloudWatch `JVMMemoryPressure` and `CPUUtilization` metrics.'
  ],
  commonMistake: 'Sizing data node JVM heap beyond 32 GB RAM, which disables compressed object pointers (CompressedOops) and degrades garbage collection performance.',
  example: 'Checking Data Node Shard Allocations via REST API:\nGET /_cat/nodes?v&h=ip,role,master,heap.percent,ram.percent,cpu,node.role',
  sources: [
    { title: 'Sizing Amazon OpenSearch Service domains', url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/sizedomains.html' }
  ]
});
