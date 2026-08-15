import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-11',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx for Windows Active Directory Integration',
  status: 'ready',
  plainEnglish: 'Amazon FSx for Windows File Server integrates directly with Microsoft Active Directory (AD) to provide identity-based access control and user authentication. You can join your FSx file system either to an AWS Managed Microsoft AD domain or to a self-managed Active Directory domain running on-premises or on EC2 instances.',
  whyItMatters: 'Integrating with Active Directory allows organizations to enforce existing domain user accounts, Security Group policies, and fine-grained Windows NTFS file permissions (ACLs) across cloud file shares without recreating user credentials.',
  workplaceExample: 'An enterprise joins their FSx for Windows File Server to their corporate Active Directory domain `corp.example.com` via a VPC AD Connector. Employees log into Windows laptops using standard domain credentials and access cloud file shares mapped according to their AD security group memberships.',
  examFocus: 'SAA-C03 Active Directory Integration options:\n- AWS Managed Microsoft AD: Fully managed AD in AWS.\n- Self-Managed Active Directory: On-premises AD or AD on EC2 connected via VPC / Direct Connect / VPN (requires AD service account permissions and Service Principal Names (SPNs)).\n- Enforces standard Windows NTFS Access Control Lists (ACLs) for file and folder permissions.',
  keyPoints: [
    'Integrates with AWS Managed Microsoft AD or self-managed Active Directory.',
    'Enforces identity-based access control using existing corporate domain accounts.',
    'Supports fine-grained Windows NTFS file and folder permissions (ACLs).',
    'Supports Kerberos authentication and NTLM v2.',
    'Connects to on-premises Active Directory via VPN or AWS Direct Connect.'
  ],
  commonMistake: 'Failing to configure DNS resolution or Security Group rules allowing FSx to reach domain controllers on TCP/UDP ports 53 (DNS), 88 (Kerberos), 389 (LDAP), and 445 (SMB), causing AD join failures.',
  example: 'Joining FSx to Self-Managed AD via AWS CLI:\n`aws fsx create-file-system --file-system-type WINDOWS --windows-configuration SelfManagedActiveDirectoryConfiguration="{DomainName=corp.example.com,OrganizationalUnitDistinguishedName=\"OU=FSx,DC=corp,DC=example,DC=com\",FileSystemAdministratorsGroup=\"Domain Admins\",DomainJoinServiceAccountUserName=fsx-svc,DnsIps=[\"10.0.1.10\",\"10.0.2.10\"]}"`',
  sources: [
    { title: 'Working with Microsoft Active Directory in FSx for Windows', url: 'https://docs.aws.amazon.com/fsx/latest/WindowsGuide/using-active-directory.html' }
  ]
});
