import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-22',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx for NetApp ONTAP Multi-Protocol Access',
  status: 'ready',
  plainEnglish: 'FSx for NetApp ONTAP Multi-Protocol Access allows Linux clients accessing data via NFS and Windows clients accessing data via SMB to read and write to the exact same storage volume concurrently. ONTAP automatically translates file permissions and locks between POSIX (Linux) and Windows NTFS ACL security styles in real-time.',
  whyItMatters: 'In collaborative workflows (such as media rendering or engineering design), Linux rendering nodes generate output files while Windows workstations review and edit those exact same files. Multi-Protocol Access eliminates duplicate file copying between Linux and Windows storage shares.',
  workplaceExample: 'A post-production video company uses Linux rendering servers to generate 4K video frames via NFSv4 onto an ONTAP volume. Windows video editors map the exact same volume via SMB 3.1.1 and review rendered frames immediately without file transfer delays.',
  examFocus: 'SAA-C03 Multi-Protocol File Sharing:\n- Concurrent NFS and SMB access to the same underlying NetApp ONTAP volume.\n- Security Styles: UNIX, NTFS, or Mixed security styles control how permissions are evaluated.\n- Active Directory & LDAP Integration: Maps Windows Active Directory users to Linux UNIX UIDs/GIDs seamlessly.',
  keyPoints: [
    'Enables Linux (NFS) and Windows (SMB) clients to share the exact same volume concurrently.',
    'Eliminates data duplication and file transfer pipelines between OS platforms.',
    'Provides real-time permission translation between Windows NTFS ACLs and UNIX POSIX mode bits.',
    'Supports User Name Mapping between Active Directory domain accounts and LDAP UIDs.',
    'Configurable Security Styles (NTFS, UNIX, or Mixed) per ONTAP volume.'
  ],
  commonMistake: 'Setting up manual AWS DataSync copy scripts to duplicate files every hour between a Linux NFS share and a Windows SMB share instead of using ONTAP Multi-Protocol Access on a single shared volume.',
  example: 'ONTAP Volume Security Style Setting:\n`aws fsx create-volume --volume-type ONTAP --ontap-configuration SecurityStyle=MIXED,JunctionPath=/shared_assets`',
  sources: [
    { title: 'FSx for NetApp ONTAP Multi-Protocol Access', url: 'https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/supported-fsx-ontap-protocols.html' }
  ]
});
