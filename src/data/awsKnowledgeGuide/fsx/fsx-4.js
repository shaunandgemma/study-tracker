import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-4',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx for OpenZFS (High performance NFS Linux shared storage)',
  status: 'ready',
  plainEnglish: 'Amazon FSx for OpenZFS is a managed NFS file system built on OpenZFS that delivers high IOPS, massive throughput, and sub-millisecond latencies for Linux workloads. It features ZFS instant zero-copy data cloning, ZFS snapshots, and flexible volume management.',
  whyItMatters: 'Software build systems, database developers, and DevOps teams often need to replicate multi-gigabyte dataset environments for testing. OpenZFS zero-copy data cloning allows creating instant independent volume clones in seconds without consuming extra disk space until changes are written.',
  workplaceExample: 'A DevOps team uses FSx for OpenZFS to test database migrations. They take a ZFS snapshot of a 1 TB production database volume and create 10 instant developer clones. Each developer tests in an isolated workspace immediately.',
  examFocus: 'SAA-C03 Architectural Strengths:\n- Best for: Linux/Unix NFS storage requiring ultra-low latency (sub-millisecond) and high IOPS.\n- Zero-Copy Cloning: Instant creation of volume clones from snapshots without copying data blocks.\n- Inline Compression: LZ4 (fast) and ZSTD (high compression ratio) reduce storage footprints.',
  keyPoints: [
    'Ultra-high performance NFS file system for Linux/Unix shared storage.',
    'Sub-millisecond latencies, up to 1,000,000 IOPS, and 20 GB/s throughput.',
    'Instant zero-copy data cloning enables rapid environment provisioning.',
    'Supports ZFS snapshots and inline compression (LZ4/ZSTD).',
    'Independent scaling of storage capacity, throughput capacity, and provisioned IOPS.'
  ],
  commonMistake: 'Using full disk-to-disk file copying for dev/test workspace creation instead of leveraging OpenZFS zero-copy data cloning.',
  example: 'Creating a Zero-Copy OpenZFS Volume Clone via AWS CLI:\n`aws fsx create-volume --volume-type OPENZFS --name dev_clone --openzfs-configuration OriginSnapshot="{SnapshotARN=arn:aws:fsx:...:snapshot/snap-1,CopyStrategy=CLONE}"`',
  sources: [
    { title: 'What is Amazon FSx for OpenZFS?', url: 'https://docs.aws.amazon.com/fsx/latest/OpenZFSGuide/what-is-fsx-openzfs.html' }
  ]
});
