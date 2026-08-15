import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-9',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx for OpenZFS',
  status: 'ready',
  plainEnglish: 'Amazon FSx for OpenZFS is a fully managed, high-performance file storage service powered by the open-source OpenZFS file system engine. Accessed via standard NFS (NFSv3, NFSv4.0, NFSv4.1, NFSv4.2) protocols, FSx for OpenZFS provides sub-millisecond latencies, hundreds of thousands of IOPS, ZFS snapshots, instant data cloning, and ZFS inline data compression.',
  whyItMatters: 'Linux and Unix developers using OpenZFS or FreeBSD/Linux file servers get native ZFS capabilities in a fully managed AWS service without managing storage pools, ZFS arc caches, or manual snapshot replication scripts.',
  workplaceExample: 'A software engineering company uses FSx for OpenZFS to power their CI/CD build farm. Using OpenZFS instant data cloning, every build job creates a near-instant copy of a 500 GB repository workspace in under 1 second without duplicating disk blocks.',
  examFocus: 'SAA-C03 Core Concept for FSx for OpenZFS:\n- Engine: Powered by open-source OpenZFS file system.\n- Protocol: NFSv3, NFSv4.0, NFSv4.1, NFSv4.2 for Linux and Unix workloads.\n- Performance: Up to 1,000,000+ IOPS and 20 GB/s throughput with sub-millisecond latencies.\n- Features: Instant zero-copy data cloning, ZFS snapshots, inline ZFS compression (LZ4/ZSTD).\n- Deployment Options: Single-AZ or Multi-AZ with automatic failover.',
  keyPoints: [
    'Fully managed OpenZFS file system accessed via standard NFS (v3/v4).',
    'Delivers sub-millisecond latencies and up to 1,000,000+ IOPS performance.',
    'Provides instant zero-copy data cloning for rapid dev/test workspace creation.',
    'Supports ZFS snapshots, point-in-time restores, and inline compression (LZ4/ZSTD).',
    'Single-AZ and Multi-AZ deployment options with automated failover.'
  ],
  commonMistake: 'Assuming FSx for OpenZFS supports native Windows SMB protocols or Active Directory ACLs out of the box. OpenZFS is accessed via NFS for Linux/Unix clients.',
  example: 'Mounting FSx for OpenZFS on Linux via NFSv4:\n`sudo mount -t nfs -o nfsvers=4.1 fs-0123456789abcdef0.fsx.us-east-1.amazonaws.com:/fsx /mnt/zfs`',
  sources: [
    { title: 'What is Amazon FSx for OpenZFS?', url: 'https://docs.aws.amazon.com/fsx/latest/OpenZFSGuide/what-is-fsx-openzfs.html' }
  ]
});
