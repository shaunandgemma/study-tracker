import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-7',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx for Lustre',
  status: 'ready',
  plainEnglish: 'Amazon FSx for Lustre is a fully managed, ultra-high-performance parallel file system designed for compute-intensive workloads such as High-Performance Computing (HPC), machine learning, financial analytics, and video rendering. Lustre provides sub-millisecond latencies, hundreds of gigabytes per second of throughput, and millions of IOPS by spreading data across multiple storage servers.',
  whyItMatters: 'Massive parallel processing clusters (thousands of EC2 compute nodes or GPUs) stall if they are bottlenecked waiting for data from a traditional storage system. FSx for Lustre delivers extreme parallel throughput so GPUs and CPU clusters remain operating at 100% utilization.',
  workplaceExample: 'An AI research team trains a large language model across 256 AWS EC2 P4d GPU instances. They link an FSx for Lustre file system to an Amazon S3 bucket. FSx for Lustre loads image datasets into high-speed parallel storage, enabling sub-millisecond data feeding to GPU nodes.',
  examFocus: 'SAA-C03 Core Concept for FSx for Lustre:\n- Designed for Linux-based High-Performance Computing (HPC), ML, and big data.\n- Native integration with Amazon S3: Automatically presents S3 objects as files in the Lustre file system.\n- Deployment Options: Scratch (temporary storage, non-replicated, max performance) vs Persistent (long-term storage, replicated in same AZ).\n- POSIX-compliant file system accessed via Linux Lustre client.',
  keyPoints: [
    'Fully managed parallel file system optimized for HPC, ML, and big data analytics.',
    'Delivers sub-millisecond latencies, hundreds of GB/s throughput, and millions of IOPS.',
    'Integrates directly with Amazon S3 data repositories (lazy loading and exporting).',
    'Deployment options: Scratch (short-term, un-replicated) vs Persistent (long-term, HA within an AZ).',
    'POSIX-compliant file system for Linux compute instances.'
  ],
  commonMistake: 'Using FSx for Lustre as a multi-region corporate Windows file share. FSx for Lustre is designed for Linux parallel HPC/ML workloads, not Windows SMB file shares.',
  example: 'Mounting FSx for Lustre on Amazon Linux EC2:\n`sudo mount -t lustre -o noatime,flock fs-0123456789abcdef0.fsx.us-east-1.amazonaws.com@tcp:/fsx /mnt/lustre`',
  sources: [
    { title: 'What is Amazon FSx for Lustre?', url: 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/what-is.html' }
  ]
});
