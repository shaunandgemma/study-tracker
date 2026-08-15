import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-10',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'File Gateway NFS Access',
  status: 'ready',
  plainEnglish: 'S3 File Gateway NFS Access allows Linux, macOS, and Unix clients to mount file shares using the Network File System (NFS) protocol (versions 3 and 4.1). Clients read and write files through the NFS mount exactly as they would with any NFS server. The gateway translates these file operations into S3 object operations, storing each file as an object in the configured S3 bucket.',
  whyItMatters: 'Linux and Unix workloads (genomics pipelines, media rendering, log processing) depend on NFS mounts. NFS access through the gateway lets these workloads write to virtually unlimited S3 storage without application code changes.',
  workplaceExample: 'A media production studio mounts an NFS share from their S3 File Gateway at `/mnt/renders`. Artists save large render output files to the mount. Each file appears in S3 as an object, where cloud-based transcoding pipelines pick it up for processing.',
  examFocus: 'SAA-C03 NFS File Share Configuration:\n- Supported Versions: NFS v3 and NFS v4.1.\n- Client Restrictions: Access is controlled by allowed-clients lists (IP address or CIDR ranges).\n- Root Squash: Maps the NFS root user to a non-privileged user to prevent unrestricted root access.\n- POSIX Metadata: File ownership (UID/GID), permissions, and timestamps are stored as S3 object user-metadata.',
  keyPoints: [
    'Provides NFS v3 and v4.1 file share access for Linux, macOS, and Unix clients.',
    'Files written via NFS are stored as individual objects in an Amazon S3 bucket.',
    'Supports allowed-client IP/CIDR restrictions to limit which hosts can mount the share.',
    'Root-squash maps the NFS root user to a non-privileged user for security.',
    'POSIX file metadata (UID, GID, permissions) is preserved as S3 user-metadata.'
  ],
  commonMistake: 'Leaving the NFS allowed-clients list open to all IP addresses (0.0.0.0/0) on a network with untrusted hosts, allowing any machine to mount the share and access S3 data.',
  example: 'Mounting an S3 File Gateway NFS Share on a Linux Client:\nmount -t nfs -o nolock,hard 192.168.1.100:/example-research-bucket /mnt/gateway-share',
  sources: [
    { title: 'Creating an NFS file share on S3 File Gateway', url: 'https://docs.aws.amazon.com/storagegateway/latest/userguide/GettingStartedCreateFileShare.html' }
  ]
});
