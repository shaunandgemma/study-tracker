import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-17',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx for Lustre High-Performance File System',
  status: 'ready',
  plainEnglish: 'Amazon FSx for Lustre is a high-performance parallel file system designed for compute-intensive workloads like High-Performance Computing (HPC), machine learning training, and financial modeling. Lustre breaks files into chunks and spreads them across multiple storage servers operating in parallel, delivering sub-millisecond latencies, hundreds of GB/s throughput, and millions of IOPS.',
  whyItMatters: 'Traditional centralized file servers become major performance bottlenecks when hundreds of CPU/GPU compute nodes read from them simultaneously. Lustre parallel architecture scales network throughput lineally as storage capacity increases.',
  workplaceExample: 'An autonomous vehicle engineering firm runs a simulation cluster with 1,000 EC2 Linux instances. They provision an FSx for Lustre file system delivering 50 GB/s throughput to feed sensor telemetry files concurrently to all simulation workers without storage lag.',
  examFocus: 'SAA-C03 Performance Architecture:\n- Parallel file system optimized for Linux POSIX workloads.\n- Throughput scales with storage capacity (up to 1,000 MB/s per TiB of storage).\n- Ideal for HPC, AI/ML, financial modeling, and seismic processing.\n- Supports persistent SSD or HDD storage options for long-term or cost-optimized parallel storage.',
  keyPoints: [
    'Parallel file system architecture delivering hundreds of GB/s throughput.',
    'Provides sub-millisecond latencies and millions of IOPS for Linux workloads.',
    'Scales throughput capacity lineally with provisioned storage size.',
    'Supports POSIX file permissions for Linux compute clusters.',
    'Ideal for AI/ML training, video rendering, HPC simulations, and genomics.'
  ],
  commonMistake: 'Using FSx for Lustre for simple web application static file hosting or Windows desktop shares. FSx for Lustre is designed specifically for high-throughput Linux parallel compute clusters.',
  example: 'Lustre Performance Provisioning:\nProvision 100 TiB Persistent_2 file system with 250 MB/s/TiB -> Achieves 25,000 MB/s (25 GB/s) aggregate throughput.',
  sources: [
    { title: 'What is Amazon FSx for Lustre?', url: 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/what-is.html' }
  ]
});
