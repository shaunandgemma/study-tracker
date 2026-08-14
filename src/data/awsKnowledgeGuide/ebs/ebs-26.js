import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-26",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Recycle Bin for Snapshots",
  "status": "ready",
  "plainEnglish": "EBS Recycle Bin (AWS Recycle Bin) is a safety and data-recovery feature that protects Amazon EBS snapshots and EBS-backed AMIs from accidental deletion or malicious purging (such as by compromised credentials or ransomware). When a retention rule is configured in Recycle Bin, deleting an EBS snapshot does not permanently delete it immediately; instead, the snapshot moves to the Recycle Bin and remains fully restorable for a configured retention period (from 1 day up to 365 days).",
  "whyItMatters": "A rogue script, disgruntled employee, or compromised IAM credential running `aws ec2 delete-snapshot` could wipe out your entire disaster recovery capability in seconds. Recycle Bin provides a critical safety net and allows you to apply Lock Rules (which prevent anyone, including the AWS account root user, from modifying or disabling the retention rule).",
  "workplaceExample": "A security operations team configures a Recycle Bin retention rule specifying that any deleted snapshot tagged `Environment=Production` is retained in the Recycle Bin for 30 days. When a junior engineer accidentally runs a cleanup script that deletes production snapshots, the team restores all snapshots from the Recycle Bin in 2 minutes.",
  "examFocus": "For SAA-C03, remember these Recycle Bin details: (1) Protects EBS Snapshots and AMIs from accidental or malicious deletion. (2) Retention rules define how long deleted items remain restorable (1 to 365 days). (3) Rule locks (Unlock Delay) prevent rules from being disabled or deleted by attackers. (4) While in the Recycle Bin, snapshots are billed at standard snapshot rates.",
  "keyPoints": [
    "Safety net against accidental or malicious deletion of EBS snapshots and AMIs.",
    "Retains deleted snapshots for a configurable period between 1 and 365 days.",
    "Restores deleted snapshots back to active status with a single API call.",
    "Supports Rule Locks with Unlock Delay to prevent attackers from disabling protection.",
    "Rules can apply to all snapshots or target specific tags (e.g. `Environment=Production`)."
  ],
  "commonMistake": "Believing that deleting an EBS snapshot frees up S3 snapshot costs immediately when a 30-day Recycle Bin rule is active. Snapshots in the Recycle Bin continue to incur standard snapshot storage charges until their retention window expires.",
  "example": "# Create a Recycle Bin rule retaining production snapshots for 14 days:\naws rbin create-rule \\\n  --retention-period RetentionPeriodValue=14,RetentionPeriodUnit=DAYS \\\n  --description \"Protect Production Snapshots\" \\\n  --resource-type EBS_SNAPSHOT \\\n  --resource-tags ResourceTagKey=Environment,ResourceTagValue=Production",
  "sources": [
    {
      "title": "Recycle Bin for Amazon EBS Snapshots",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/recycle-bin.html"
    },
    {
      "title": "Locking Retention Rules in Recycle Bin",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/recycle-bin-working-with-rules.html#recycle-bin-lock-rule"
    }
  ]
});
