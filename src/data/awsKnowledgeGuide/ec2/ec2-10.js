import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-10',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'Memory Optimized Instances',
  status: 'ready',
  plainEnglish: 'Memory Optimized Instances (such as R6i, R6g, X2gd, High Memory instances) are designed to deliver fast performance for workloads that process large datasets directly in memory (RAM). They provide a high memory-to-vCPU ratio (typically 8 GiB of RAM or more per vCPU), allowing applications to keep massive datasets in RAM for ultra-fast response times.',
  whyItMatters: 'Disk read operations are thousands of times slower than reading from RAM. Memory Optimized instances allow database engines and in-memory caches to serve millions of operations per second without disk bottlenecks.',
  workplaceExample: 'An e-commerce platform runs an enterprise Redis cache cluster on R6g.2xlarge instances (8 vCPUs, 64 GiB RAM). Storing user shopping sessions in RAM delivers sub-millisecond page response times during peak shopping holidays.',
  examFocus: 'SAA-C03 keyword triggers for Memory Optimized (R / X family):\n- "In-memory database (Redis, Memcached, SAP HANA)"\n- "Large-scale enterprise databases (Oracle, SQL Server, MySQL)"\n- "Real-time big data processing in RAM (Apache Spark)"\n- "High RAM-to-CPU ratio requirement"',
  keyPoints: [
    'Engineered for workloads requiring large RAM capacity.',
    'High memory-to-vCPU ratio (typically 8 GiB RAM per vCPU, up to terabytes in X/High Memory instances).',
    'Essential for in-memory databases, Redis caches, and SAP HANA.',
    'Reduces latency by keeping active datasets in memory instead of disk storage.',
    'R-family (standard memory) and X-family (ultra-high memory).'
  ],
  commonMistake: 'Using Memory Optimized instances for video encoding or batch processing. Paying for high RAM that sits unused wastes money when CPU is the primary bottleneck.',
  example: 'Memory Optimized Instance Spec:\n`r6g.xlarge` -> 4 vCPUs, 32 GiB RAM (8:1 RAM to vCPU ratio).\nUsage: Production PostgreSQL database with large shared buffers.',
  sources: [
    { title: 'Amazon EC2 Instance Types - Memory Optimized', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html' }
  ]
});
