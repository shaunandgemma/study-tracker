import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-25",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Snapshot Archive",
  "status": "ready",
  "plainEnglish": "EBS Snapshot Archive is a low-cost storage tier for Amazon EBS snapshots designed for long-term retention of rarely accessed snapshots that need to be kept for 90 days or longer for regulatory compliance. By moving full snapshots from the standard EBS Snapshot tier to the Snapshot Archive tier, you can save up to 75% on snapshot storage costs.",
  "whyItMatters": "Many compliance frameworks (such as SEC 17a-4, HIPAA, or ISO 27001) mandate retaining quarterly and annual system state backups for 7 to 10 years. Keeping thousands of snapshots in the standard snapshot tier becomes expensive over time. EBS Snapshot Archive offers low-cost long-term archiving without needing to export disks to tape or S3 Glacier manually.",
  "workplaceExample": "A banking institution retains year-end EBS snapshots of all financial reporting ledger servers for 7 years. They use an Amazon Data Lifecycle Manager (DLM) policy to automatically transition annual snapshots to the EBS Snapshot Archive tier after 30 days, saving $15,000 annually in backup storage costs.",
  "examFocus": "For SAA-C03, remember these Snapshot Archive characteristics: (1) Offers up to 75% cost savings for snapshots retained for 90+ days. (2) Unlike standard incremental snapshots, an archived snapshot is converted into a FULL snapshot. (3) Retrieval is NOT instantaneous: restoring an archived snapshot back to the standard tier takes between 24 and 72 hours (or fast retrieval in 1–15 hours for smaller volumes).",
  "keyPoints": [
    "Low-cost archive storage tier for EBS snapshots retained for 90 days or longer.",
    "Reduces snapshot storage costs by up to 75% compared to standard EBS snapshot tier.",
    "Stores snapshots as complete, full point-in-time images (not incremental).",
    "Restoration back to standard tier requires 24 to 72 hours (asynchronous retrieval).",
    "Can be automated using Amazon Data Lifecycle Manager (DLM) policies."
  ],
  "commonMistake": "Archiving snapshots that you need for rapid daily disaster recovery. Because restoring an archived snapshot to the standard tier takes 24 to 72 hours, never use Snapshot Archive for short-term RTO backups.",
  "example": "# Move an existing snapshot to the archive tier:\naws ec2 archive-snapshot \\\n  --snapshot-id snap-0123456789abcdef0\n\n# Restore an archived snapshot back to standard tier:\naws ec2 restore-snapshot-tier \\\n  --snapshot-id snap-0123456789abcdef0",
  "sources": [
    {
      "title": "Amazon EBS Snapshot Archive",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/snapshot-archive.html"
    },
    {
      "title": "Archiving and Restoring EBS Snapshots",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/snapshot-archive.html#archive-restore"
    }
  ]
});
