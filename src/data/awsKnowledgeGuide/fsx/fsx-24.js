import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-24',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx Storage Capacity and Throughput Capacity',
  status: 'ready',
  plainEnglish: 'Amazon FSx decouples Storage Capacity from Throughput Capacity, allowing you to provision and scale each parameter independently:\n- Storage Capacity: The total amount of disk space (in GB or TB) available to store files.\n- Throughput Capacity: The network and processing speed (in MB/s) at which file servers can read and write data, which also determines the amount of in-memory caching (RAM) and IOPS allocated to the file system.',
  whyItMatters: 'Decoupling storage size from throughput speed prevents over-paying. A small 100 GB database might require high network throughput (1,024 MB/s), while a large 50 TB archive might require low throughput (64 MB/s). You tune each parameter independently as requirements change.',
  workplaceExample: 'An accounting team hosts a 2 TB file share on FSx for Windows. During monthly financial closing, application access spikes. They dynamically increase Throughput Capacity from 128 MB/s to 1,024 MB/s for 3 days without expanding storage capacity or taking the file system offline.',
  examFocus: 'SAA-C03 Capacity & Scaling Distinction:\n- Storage Capacity: How much data you can store. Can be scaled UP dynamically.\n- Throughput Capacity: How fast data can be read/written (MB/s). Can be scaled UP or DOWN dynamically on demand.\n- Higher throughput capacity automatically provisions larger file server RAM caches and higher IOPS limits.',
  keyPoints: [
    'Storage Capacity and Throughput Capacity scale independently.',
    'Storage Capacity determines file storage volume size (GB/TB).',
    'Throughput Capacity determines network speed (MB/s), file server RAM, and IOPS.',
    'Throughput capacity can be scaled up or down dynamically without downtime.',
    'Avoids over-provisioning storage just to achieve higher network throughput.'
  ],
  commonMistake: 'Confusing Storage Capacity with Throughput Capacity, leading administrators to expand disk storage size when the actual bottleneck was insufficient network throughput speed.',
  example: 'Updating Throughput Capacity via AWS CLI:\n`aws fsx update-file-system --file-system-id fs-0123456789abcdef0 --windows-configuration ThroughputCapacity=1024`',
  sources: [
    { title: 'Managing Storage and Throughput Capacity in Amazon FSx', url: 'https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is-fsx-w.html' }
  ]
});
