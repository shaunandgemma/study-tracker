import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-6',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx for Windows File Server',
  status: 'ready',
  plainEnglish: 'Amazon FSx for Windows File Server provides fully managed, highly reliable Windows file storage built natively on Windows Server. It supports the Server Message Block (SMB) protocol (versions 2.0 to 3.1.1), native Microsoft Active Directory integration, Windows Access Control Lists (ACLs), Distributed File System (DFS) Namespaces, Data Deduplication, and Volume Shadow Copies.',
  whyItMatters: 'Windows-based enterprise applications require full compatibility with Windows SMB protocols, Active Directory domain permissions, and Windows ACLs. Running Windows file shares on non-native file systems often leads to broken permission inheritance or file lock bugs.',
  workplaceExample: 'A corporate IT department migrates 50 TB of shared company drives (HR, Finance, Engineering) from on-premises Windows File Servers to FSx for Windows File Server. Employees access shares via standard UNC paths (`\\\\fsx-dns-name\\share`) using their domain credentials.',
  examFocus: 'SAA-C03 Key Features of FSx for Windows File Server:\n- Protocols: SMB 2.0 through 3.1.1.\n- Authentication: AWS Managed Microsoft AD or self-managed Active Directory.\n- Access Control: Native Windows NTFS Access Control Lists (ACLs).\n- Deployment Options: Single-AZ (cost-optimized) or Multi-AZ (automatic failover across AZs).\n- Optimization: Data Deduplication (saves up to 50-60% storage) and DFS Namespaces.',
  keyPoints: [
    'Fully managed Windows Server file system supporting SMB 2.0–3.1.1.',
    'Integrates natively with Microsoft Active Directory (AWS Managed AD or self-managed AD).',
    'Supports Windows NTFS Access Control Lists (ACLs) for fine-grained file permissions.',
    'Offers Single-AZ and Multi-AZ deployment options with automatic failover.',
    'Features Data Deduplication and Volume Shadow Copies for storage efficiency and self-service restore.'
  ],
  commonMistake: 'Attempting to use Amazon EFS for native Windows application shares requiring SMB 3.1.1 and Active Directory NTFS ACLs. Amazon EFS supports NFSv4 for Linux, whereas FSx for Windows File Server is required for native SMB/Windows support.',
  example: 'Accessing an FSx for Windows Share from a Windows EC2 Instance:\n`net use Z: \\\\fs-0123456789abcdef0.corp.example.com\\share /user:CORP\\AdminUser`',
  sources: [
    { title: 'What is Amazon FSx for Windows File Server?', url: 'https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is-fsx-w.html' }
  ]
});
