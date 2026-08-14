import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-26",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "FSx Backup",
  "status": "ready",
  "plainEnglish": "FSx Backup in AWS Backup provides centralized, policy-driven protection for all Amazon FSx file system types, including Amazon FSx for Windows File Server, FSx for Lustre, FSx for NetApp ONTAP, and FSx for OpenZFS. AWS Backup automatically coordinates incremental, crash-consistent snapshots across your FSx deployments and allows you to restore file systems into any supported Availability Zone or Region.",
  "whyItMatters": "Enterprise Windows file shares and high-performance computing (HPC) file systems often host critical business documents and research datasets. Managing FSx backups with AWS Backup ensures unified compliance alongside other cloud storage resources with automated retention schedules and cross-Region DR capabilities.",
  "workplaceExample": "A corporate enterprise uses Amazon FSx for Windows File Server to provide shared SMB network drives to 1,000 corporate employees. AWS Backup triggers daily snapshots at 20:00, replicates copies to a disaster recovery region, and retains them for 60 days.",
  "examFocus": "For SAA-C03, know that AWS Backup supports all Amazon FSx file systems (FSx for Windows File Server, Lustre, NetApp ONTAP, and OpenZFS). Restoring an FSx backup creates a brand-new FSx file system with the restored configuration, throughput, and storage capacity.",
  "keyPoints": [
    "Protects Amazon FSx for Windows File Server, Lustre, NetApp ONTAP, and OpenZFS.",
    "Captures incremental, file-system consistent snapshots.",
    "Restoring from a recovery point provisions a brand-new Amazon FSx file system.",
    "Enables cross-Region and cross-account copies for disaster recovery.",
    "Integrates with AWS Organizations for centralized enterprise backup governance."
  ],
  "commonMistake": "Thinking that restoring an FSx backup overwrites the existing live file system in-place. Restoring from an FSx recovery point always provisions a new FSx file system.",
  "example": "ListOfTags:\n  - ConditionType: STRINGEQUALS\n    ConditionKey: StorageType\n    ConditionValue: FSxWindowsShare",
  "sources": [
    {
      "title": "Backing Up Amazon FSx with AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/fsx-backups.html"
    },
    {
      "title": "Restoring Amazon FSx File Systems",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/restoring-fsx.html"
    }
  ]
});
