import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-14',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'FSx File Gateway with FSx for Windows File Server',
  status: 'ready',
  plainEnglish: 'FSx File Gateway with Amazon FSx for Windows File Server provides branch offices with low-latency SMB access to centrally hosted Windows file systems. The FSx file system in AWS is the authoritative storage—fully managed with NTFS, Active Directory integration, DFS namespaces, and VSS shadow copies. The FSx File Gateway appliance at the branch site caches frequently accessed files locally.',
  whyItMatters: 'Centralising file shares in Amazon FSx saves each branch office from managing its own Windows file server hardware. The FSx File Gateway caches hot data locally so users do not experience WAN latency for routine file operations.',
  workplaceExample: 'A law firm has 8 branch offices. The firm\'s case-management shares are hosted on Amazon FSx for Windows File Server in AWS. Each office deploys an FSx File Gateway. Lawyers open case files at local-cache speed; new files synchronise back to the central FSx file system.',
  examFocus: 'SAA-C03 FSx File Gateway Architecture & Requirements:\n- Prerequisite: An existing Amazon FSx for Windows File Server file system.\n- Network: Requires AWS Direct Connect or Site-to-Site VPN between the branch and the AWS VPC hosting FSx.\n- Authentication: Active Directory for user-level and group-level NTFS ACL enforcement.\n- Authoritative Storage: Data lives in Amazon FSx. The gateway is a local read/write cache, not an independent copy.',
  keyPoints: [
    'Provides low-latency local SMB cache for Amazon FSx for Windows File Server shares.',
    'Requires an existing FSx for Windows File Server file system in AWS.',
    'Requires network connectivity (Direct Connect or VPN) between the branch and the FSx VPC.',
    'Supports full Windows file semantics: NTFS ACLs, DFS namespaces, VSS shadow copies.',
    'The gateway is a cache appliance—FSx holds the authoritative, durable data.'
  ],
  commonMistake: 'Deploying an FSx File Gateway without first setting up network connectivity (Direct Connect or VPN) between the on-premises site and the VPC where the FSx file system resides.',
  example: 'FSx File Gateway Architecture:\nBranch Office → SMB → FSx File Gateway (local cache) → Direct Connect / VPN → VPC → Amazon FSx for Windows File Server',
  sources: [
    { title: 'Getting started with Amazon FSx File Gateway', url: 'https://docs.aws.amazon.com/filegateway/latest/filefsxw/getting-started.html' }
  ]
});
