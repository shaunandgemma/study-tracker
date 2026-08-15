import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-10',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx for Windows SMB Protocol',
  status: 'ready',
  plainEnglish: 'Server Message Block (SMB) is the native network file-sharing protocol used by Windows operating systems. FSx for Windows File Server fully supports SMB versions 2.0 through 3.1.1, providing features like continuous availability (CA), SMB multichannel (combining network bandwidth across multiple NICs for higher throughput), and end-to-end AES-256 encryption in transit.',
  whyItMatters: 'Legacy Windows applications, SQL Server Failover Cluster Instances (FCI), and IIS web server farms depend on specific SMB 3.0+ capabilities like Continuous Availability and SMB Multichannel to operate without single points of failure.',
  workplaceExample: 'An enterprise deploys a Microsoft SQL Server Failover Cluster Instance (FCI) on AWS. They store database files on an FSx for Windows File Server SMB share created with SMB Continuous Availability enabled, ensuring SQL Server survives file server failover without database corruption.',
  examFocus: 'SAA-C03 SMB Protocol Details:\n- Supports SMB 2.0, 2.1, 3.0, 3.0.2, 3.1.1.\n- SMB Encryption in Transit: AES-128-GCM and AES-256-GCM encryption without requiring IPSec VPNs.\n- SMB Multichannel: Aggregates network bandwidth across multiple network connections to increase throughput.\n- Continuous Availability (CA): Enables transparent failover for database workloads like SQL Server.',
  keyPoints: [
    'Native Windows file sharing protocol supporting SMB 2.0 through 3.1.1.',
    'SMB Multichannel combines multiple network paths to maximize throughput.',
    'SMB Continuous Availability (CA) enables transparent failover for SQL Server FCI.',
    'Built-in end-to-end SMB Encryption in Transit using AES-256-GCM.',
    'Allows mounting shares from Windows, Linux (via CIFS/SMB client), and macOS.'
  ],
  commonMistake: 'Attempting to run a Microsoft SQL Server Failover Cluster Instance (FCI) on a standard SMB share without enabling SMB Continuous Availability (CA), leading to database crashes during failover events.',
  example: 'PowerShell Command to Check SMB Encryption Status:\n`Get-SmbConnection | Select-Object ServerName, ShareName, Dialect, Encrypted`',
  sources: [
    { title: 'Amazon FSx for Windows File Server Features - SMB Support', url: 'https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is-fsx-w.html' }
  ]
});
