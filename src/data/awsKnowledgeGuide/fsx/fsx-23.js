import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-23',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx for OpenZFS NFS',
  status: 'ready',
  plainEnglish: 'Amazon FSx for OpenZFS uses the Network File System (NFS) protocol (supporting versions NFSv3, NFSv4.0, NFSv4.1, and NFSv4.2) to export ZFS file volumes to Linux, Unix, macOS, and containerized workloads. It provides high-performance shared storage with sub-millisecond response times and up to 1,000,000+ IOPS.',
  whyItMatters: 'Linux application servers and container clusters require reliable, low-latency NFS shared storage. FSx for OpenZFS provides native NFS interfaces backed by enterprise ZFS features like LZ4/ZSTD compression and ZFS snapshots.',
  workplaceExample: 'A Linux web farm runs 50 NGINX web servers on EC2. All 50 instances mount an FSx for OpenZFS volume via NFSv4.1 to read shared web assets with sub-millisecond latencies.',
  examFocus: 'SAA-C03 NFS Protocol & Performance:\n- Protocols: NFSv3, NFSv4.0, NFSv4.1, NFSv4.2.\n- Client Support: Linux, Unix, macOS, and Amazon ECS / EKS containers.\n- Security: Export rules control client IP access permissions (Root Squash, Read-Only, Read-Write).\n- Performance: Up to 1,000,000+ IOPS and 20 GB/s throughput capacity.',
  keyPoints: [
    'Exports OpenZFS file volumes via standard NFSv3 and NFSv4 protocols.',
    'Delivers sub-millisecond response times and up to 1,000,000 IOPS.',
    'NFS export rules control client IP access permissions and root squashing.',
    'Provides native shared storage for Linux, Unix, macOS, and containerized applications.',
    'Supports inline LZ4 and ZSTD data compression.'
  ],
  commonMistake: 'Failing to configure NFS Export Rules on FSx for OpenZFS volumes, preventing Linux EC2 instances from mounting the NFS export.',
  example: 'Linux Mount Command for FSx for OpenZFS NFS Share:\n`sudo mount -t nfs -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2 fs-0123456789abcdef0.fsx.us-east-1.amazonaws.com:/fsx /mnt/zfs`',
  sources: [
    { title: 'Amazon FSx for OpenZFS Performance', url: 'https://docs.aws.amazon.com/fsx/latest/OpenZFSGuide/performance.html' }
  ]
});
