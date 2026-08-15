import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-7',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'FSx File Gateway',
  status: 'ready',
  plainEnglish: 'Amazon FSx File Gateway provides low-latency, on-premises SMB file-share access to data stored in Amazon FSx for Windows File Server. The gateway caches frequently accessed files on local disks so that on-premises Windows users and applications experience fast read and write performance, while the authoritative data resides in a fully managed FSx file system in AWS.',
  whyItMatters: 'Windows enterprise workloads such as home directories, department shares, and CRM data files need native Windows NTFS features (ACLs, DFS namespaces, shadow copies). FSx File Gateway extends this access to branch offices without deploying full Windows file servers locally.',
  workplaceExample: 'A retail company runs Amazon FSx for Windows File Server in AWS for their point-of-sale reporting. Each branch office deploys an FSx File Gateway, giving local Windows workstations fast SMB access to FSx shares without crossing the internet for every file read.',
  examFocus: 'SAA-C03 FSx File Gateway vs S3 File Gateway:\n- FSx File Gateway: Caches SMB access to Amazon FSx for Windows File Server. Data lives in FSx (NTFS, full Windows semantics).\n- S3 File Gateway: Stores files as S3 objects. Data lives in S3 (object storage).\n- Use FSx File Gateway when applications require Windows-native NTFS features, Active Directory, DFS, or shadow copies.',
  keyPoints: [
    'Provides low-latency on-premises SMB access to Amazon FSx for Windows File Server shares.',
    'Caches frequently accessed files locally for fast read and write operations.',
    'Supports full Windows file semantics including NTFS ACLs, DFS namespaces, and shadow copies.',
    'Authoritative data remains in Amazon FSx for Windows File Server in AWS.',
    'Ideal for branch offices needing fast access to centrally hosted Windows file shares.'
  ],
  commonMistake: 'Confusing an FSx File Gateway with an Amazon FSx file system. The gateway is a local cache appliance; it does not host or replace the FSx file system itself.',
  example: 'FSx File Gateway Architecture:\nBranch Office Windows PC → SMB → FSx File Gateway (local cache) → AWS Direct Connect / VPN → Amazon FSx for Windows File Server (AWS Region)',
  sources: [
    { title: 'Using Amazon FSx File Gateway', url: 'https://docs.aws.amazon.com/filegateway/latest/filefsxw/what-is-file-fsxw.html' }
  ]
});
