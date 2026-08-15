import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-21',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx for NetApp ONTAP NFS, SMB and iSCSI',
  status: 'ready',
  plainEnglish: 'FSx for NetApp ONTAP is unique among cloud file services because it simultaneously supports three major storage network protocols from a single unified file system: Network File System (NFS v3/v4 for Linux), Server Message Block (SMB 2.0-3.1.1 for Windows), and internet Small Computer System Interface (iSCSI for raw block storage access).',
  whyItMatters: 'Heterogeneous IT environments run a mix of Linux servers, Windows servers, and VMware / database block storage. Instead of managing three separate AWS storage systems (EFS, FSx Windows, and EBS), FSx for NetApp ONTAP serves all three protocol requirements from one managed platform.',
  workplaceExample: 'An enterprise migrates a hybrid application stack to AWS. Their Linux web servers access media assets via NFSv4, Windows administrative nodes access report folders via SMB 3.1.1, and Oracle database servers attach raw block LUNs via iSCSI—all connected to the same FSx for NetApp ONTAP cluster.',
  examFocus: 'SAA-C03 Protocol Flexibility:\n- NFS (v3, v4.0, v4.1, v4.2): Used for Linux/Unix file shares.\n- SMB (2.0 through 3.1.1): Used for Windows file shares and Active Directory integration.\n- iSCSI: Used for block storage access (LUNs) attached to Windows/Linux hosts.\n- Supported on both Single-AZ and Multi-AZ deployments.',
  keyPoints: [
    'Unified storage system supporting NFS, SMB, and iSCSI protocols simultaneously.',
    'Provides file storage (NFS/SMB) and raw block storage (iSCSI LUNs).',
    'Supports cross-platform access across Linux, Windows, and container environments.',
    'Eliminates managing separate storage services for heterogeneous OS fleets.',
    'Supports NetApp storage virtual machines (SVMs) for tenant isolation.'
  ],
  commonMistake: 'Assuming Amazon EFS or FSx for Windows supports iSCSI block storage. Only FSx for NetApp ONTAP supports iSCSI block storage alongside NFS and SMB file protocols.',
  example: 'Connecting an iSCSI LUN on Windows Server:\n`iscsicli QLoginTarget iqn.1992-08.com.netapp:srv.fsx-ontap`',
  sources: [
    { title: 'Supported FSx for NetApp ONTAP Protocols', url: 'https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/supported-fsx-ontap-protocols.html' }
  ]
});
