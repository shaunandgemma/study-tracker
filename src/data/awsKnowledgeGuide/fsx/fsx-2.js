import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-2',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx for Lustre (HPC high-throughput, sub-millisecond latencies, S3 Data Repository integration)',
  status: 'ready',
  plainEnglish: 'Amazon FSx for Lustre is specialized for High-Performance Computing (HPC) environments requiring parallel disk access, sub-millisecond network latencies, and direct integration with Amazon S3 data repositories. It bridges object storage with file-based HPC applications by automatically synchronizing S3 buckets with high-speed parallel file systems.',
  whyItMatters: 'HPC applications written in C/C++/Fortran expect traditional POSIX file systems and low latencies, while cloud architectures prefer S3 for object durability and cheap storage. FSx for Lustre reconciles both models seamlessly.',
  workplaceExample: 'A oil and gas company executes seismic processing algorithms across 500 HPC compute instances. Raw seismic files are stored in Amazon S3. FSx for Lustre streams dataset chunks in parallel at 100 GB/s to compute nodes, completing analysis 10x faster than traditional NFS mounts.',
  examFocus: 'SAA-C03 Architectural Decision:\n- When to choose FSx for Lustre: High-Performance Computing (HPC), AI/ML training, sub-millisecond latency requirements, parallel Linux file access, and S3 data repository integration.\n- Contrast with EFS: EFS is elastic general-purpose NFS; Lustre is ultra-high-throughput parallel storage for compute clusters.',
  keyPoints: [
    'Parallel POSIX storage engineered specifically for HPC and ML workloads.',
    'Sub-millisecond latencies and up to hundreds of GB/s parallel throughput.',
    'Bi-directional synchronization with Amazon S3 object repositories.',
    'Eliminates storage bottlenecks for multi-node GPU and CPU compute clusters.',
    'Flexible deployment options (Scratch for temporary jobs, Persistent for ongoing projects).'
  ],
  commonMistake: 'Selecting Amazon EFS for a 500-node parallel AI training cluster requiring 50 GB/s throughput. FSx for Lustre is purpose-built for parallel compute throughput.',
  example: 'Syncing S3 Bucket with FSx for Lustre via DRA:\nS3 Object Path: `s3://my-genomics-bucket/sample1.raw` <-> FSx File Path: `/mnt/lustre/sample1.raw`.',
  sources: [
    { title: 'What is Amazon FSx for Lustre?', url: 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/what-is.html' }
  ]
});
