import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-30',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx vs EFS',
  status: 'ready',
  plainEnglish: 'Amazon FSx and Amazon EFS (Elastic File System) are both managed AWS shared file storage services, but they target different operating systems, file protocols, and performance profiles:\n- Amazon EFS: Fully serverless, elastic NFS file storage designed for Linux workloads, serverless AWS Lambda, and containerized applications (Amazon ECS/EKS).\n- Amazon FSx: A family of high-performance managed file systems (Windows, Lustre, ONTAP, OpenZFS) tailored for specific native protocols (SMB, iSCSI, POSIX), specialized OS environments (Windows, Linux HPC), and advanced storage engine features (Active Directory, ZFS cloning, NetApp SnapMirror).',
  whyItMatters: 'Selecting between EFS and FSx depends on protocol and OS requirements. Windows applications requiring SMB 3.1.1 and Active Directory MUST use FSx for Windows, while Linux serverless apps benefit from EFS elastic auto-scaling.',
  workplaceExample: 'A company runs Linux microservices on AWS Fargate that need simple elastic shared storage; they select Amazon EFS. For their legacy Windows IIS web farm requiring Active Directory ACLs and SMB 3.1.1, they select FSx for Windows File Server.',
  examFocus: 'SAA-C03 Decision Matrix (FSx vs EFS):\n- Linux + Serverless/Containers + Simple Elastic NFS -> Amazon EFS.\n- Windows + SMB + Active Directory + NTFS ACLs -> FSx for Windows File Server.\n- Linux + HPC / Machine Learning + Sub-ms Latency + S3 Integration -> FSx for Lustre.\n- Multi-Protocol (NFS/SMB/iSCSI) + NetApp Features + Deduplication -> FSx for NetApp ONTAP.\n- Linux + OpenZFS Features (Zero-copy clones) -> FSx for OpenZFS.',
  keyPoints: [
    'Amazon EFS: Serverless elastic NFS storage for Linux/Containers/Lambda.',
    'FSx for Windows: Native Windows SMB file system with Active Directory integration.',
    'FSx for Lustre: Ultra-high throughput parallel file system for Linux HPC/ML.',
    'FSx for NetApp ONTAP: Multi-protocol (NFS/SMB/iSCSI) storage with tiering & deduplication.',
    'FSx for OpenZFS: High-performance NFS storage with OpenZFS snapshots and zero-copy cloning.'
  ],
  commonMistake: 'Attempting to mount Amazon EFS on a native Windows Server EC2 instance requiring Active Directory NTFS ACLs. EFS is designed for POSIX Linux NFS access.',
  example: 'Decision Tree:\n- "Linux containers needing elastic NFS" -> EFS\n- "Windows file share needing Active Directory and SMB 3.1.1" -> FSx for Windows\n- "1000-node GPU cluster training ML models" -> FSx for Lustre.',
  sources: [
    { title: 'Amazon FSx vs Amazon EFS Comparison', url: 'https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is-fsx-w.html' }
  ]
});
