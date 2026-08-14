import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-9",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "SMB Transfers",
  "status": "ready",
  "plainEnglish": "SMB Transfers in AWS DataSync enable automated, accelerated data movement to and from Server Message Block (SMB) file shares commonly used by Microsoft Windows file servers and corporate NAS appliances. DataSync supports SMB versions 2.0 through 3.1.1. It authenticates using Windows Active Directory domain credentials and can preserve Windows NTFS Access Control Lists (ACLs), file attributes (ReadOnly, Hidden, System), and timestamps during migrations to Amazon FSx for Windows File Server, Amazon S3, or Amazon EFS.",
  "whyItMatters": "Enterprise Windows file shares rely heavily on complex NTFS access permissions and security groups. Manually copying files with legacy tools frequently strips these security descriptors, requiring days of manual permission reapplications. DataSync copies files, directory structures, and their entire NTFS security descriptors in a single automated pass.",
  "workplaceExample": "An architectural firm migrates 80 TB of Autodesk project files from an on-premises Windows Server 2019 cluster to Amazon FSx for Windows File Server. DataSync joins the Active Directory domain, copies all file shares, and preserves full NTFS ACLs, allowing architects to resume working on their mapped network drives immediately after cutover.",
  "examFocus": "For SAA-C03, know that DataSync supports SMB 2.0 to 3.1.1. When migrating Windows file shares to Amazon FSx for Windows File Server, DataSync is the recommended AWS native tool because it preserves NTFS ACLs, file attributes, and timestamps automatically without requiring third-party tools.",
  "keyPoints": [
    "Supports SMB versions 2.0, 2.1, 3.0, 3.0.2, and 3.1.1 file shares.",
    "Preserves Windows NTFS Access Control Lists (ACLs), security descriptors, and attributes.",
    "Authenticates with SMB shares using Active Directory domain credentials.",
    "Ideal migration mechanism for moving Windows file shares to Amazon FSx for Windows File Server.",
    "Performs automatic checksum verification on all transferred files and metadata."
  ],
  "commonMistake": "Using an Active Directory user account that lacks 'Full Control' or 'Backup Operator' rights on the source SMB share. DataSync requires sufficient permissions to read file security descriptors and alternate data streams.",
  "example": "# Create an SMB location with Active Directory credentials:\naws datasync create-location-smb \\\n  --server-hostname win-fs01.corp.example.com \\\n  --subdirectory /ProjectShares \\\n  --user 'CORP\\DataSyncServiceAcct' \\\n  --password 'SecretPassword123!' \\\n  --domain 'corp.example.com' \\\n  --agent-arns arn:aws:datasync:us-east-1:123456789012:agent/agent-0123456789abcdef0",
  "sources": [
    {
      "title": "Creating an SMB Location in AWS DataSync",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/create-smb-location.html"
    },
    {
      "title": "Migrating to Amazon FSx for Windows File Server using DataSync",
      "url": "https://docs.aws.amazon.com/fsx/latest/WindowsGuide/migrate-datasync.html"
    }
  ]
});
