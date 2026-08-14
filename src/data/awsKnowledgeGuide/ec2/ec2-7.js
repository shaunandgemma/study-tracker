import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-7',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Instance Families and Workload Selection',
  status: 'ready',
  plainEnglish: 'EC2 Instance Families categorize virtual servers based on hardware optimizations for specific workloads: General Purpose (M/T), Compute Optimized (C), Memory Optimized (R/X/High Memory), Storage Optimized (I/D/H), and Accelerated Computing (P/G/F/Trainium/Inferentia). The instance naming convention (e.g. c6g.2xlarge) indicates the family (c), generation (6), processor architecture (g for AWS Graviton), and instance size (2xlarge).',
  whyItMatters: 'Choosing the wrong instance family causes overspending or poor performance (e.g. running a memory-heavy database on a compute-optimized instance causes out-of-memory crashes).',
  workplaceExample: 'A gaming company uses C6i compute-optimized instances for real-time physics calculation servers, R6i memory-optimized instances for Redis caching, and M6i general-purpose instances for web frontends.',
  examFocus: 'SAA-C03 instance selection mnemonic:\n- General Purpose (M/T): Balanced CPU/Memory (web servers, small DBs).\n- Compute (C): High CPU-to-RAM ratio (batch processing, media encoding, HPC).\n- Memory (R/X): High RAM-to-CPU ratio (in-memory databases, Redis, SAP HANA).\n- Storage (I/D): High local NVMe storage IOPS (NoSQL DBs, Cassandra, data warehouses).\n- Accelerated (P/G): GPUs for AI/ML training, deep learning, 3D rendering.',
  keyPoints: [
    'Instance families optimize for CPU, Memory, Storage, or GPU balance.',
    'Naming format: Family (c) + Generation (6) + Attribute (g) + Size (2xlarge).',
    'AWS Graviton (g) instances offer up to 40% better price-performance.',
    'Match workloads to appropriate families to optimize cost and speed.',
    'Sizes scale vertically from nano up to 32xlarge or metal.'
  ],
  commonMistake: 'Using General Purpose t3.micro for continuous high-CPU batch processing without realizing T3 instances use CPU burst credits and will slow down when credits deplete.',
  example: 'Instance Naming Breakdown:\n`m6g.xlarge` -> `m` = General Purpose, `6` = 6th Generation, `g` = Graviton (ARM) processor, `xlarge` = Size (4 vCPUs, 16 GiB RAM).',
  sources: [
    { title: 'Amazon EC2 Instance Types', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html' }
  ]
});
