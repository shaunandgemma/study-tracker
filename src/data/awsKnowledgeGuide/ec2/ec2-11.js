import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-11',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'Storage Optimized Instances',
  status: 'ready',
  plainEnglish: 'Storage Optimized Instances (such as I3, I4i, D3, D3en) are virtual servers built for workloads that require high, sequential read and write access to very large datasets on local physical storage. They come equipped with direct-attached NVMe SSDs or high-density HDD storage capable of delivering tens of thousands of low-latency IOPS (Input/Output Operations Per Second).',
  whyItMatters: 'Network-attached storage (like EBS) can introduce network overhead for massive high-frequency read/write workloads. Storage Optimized instances deliver raw local NVMe disk throughput directly connected to the host hypervisor.',
  workplaceExample: 'A real-time analytics provider runs an Apache Cassandra NoSQL cluster on I4i.2xlarge instances. The high-speed local NVMe SSDs handle 300,000 read/write IOPS per second, processing clickstream data with sub-millisecond storage latency.',
  examFocus: 'SAA-C03 keyword triggers for Storage Optimized (I / D family):\n- "High local disk IOPS / low latency local storage"\n- "Data warehousing / Hadoop / MapReduce"\n- "High-performance NoSQL databases (Cassandra, MongoDB)"\n- "Local NVMe SSD or high-density HDD storage requirements"',
  keyPoints: [
    'Equipped with direct-attached local NVMe SSDs or HDDs.',
    'Delivers millions of low-latency IOPS for storage-intensive workloads.',
    'Ideal for NoSQL databases (Cassandra, MongoDB), log processing, and data warehouses.',
    'Local storage is ephemeral (Instance Store): data is lost if the instance is terminated.',
    'I-series (NVMe SSD for IOPS) and D/H-series (HDD for capacity).'
  ],
  commonMistake: 'Storing critical application database files solely on a Storage Optimized instance\'s local Instance Store NVMe drive without application-level replication. If the instance is stopped or hardware fails, local Instance Store data is permanently lost.',
  example: 'Storage Optimized Instance Spec:\n`i4i.xlarge` -> 4 vCPUs, 32 GiB RAM, 1 x 937 GB NVMe SSD local drive.\nUsage: High-throughput log indexing node running OpenSearch.',
  sources: [
    { title: 'Amazon EC2 Instance Types - Storage Optimized', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html' }
  ]
});
