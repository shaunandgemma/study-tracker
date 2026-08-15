import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-28",
  "title": "S3 Object Lock",
  "plainEnglish": "Amazon S3 Object Lock is a data protection feature that enforces a Write Once, Read Many (WORM) storage model on S3 objects. When Object Lock is enabled on a versioned bucket, you can prevent objects from being deleted, overwritten, or modified for a fixed retention period or an indefinite legal hold. S3 Object Lock satisfies strict regulatory requirements (such as SEC Rule 17a-4, FINRA, and CFTC) and provides immutable protection against malicious insider threats and ransomware.",
  "whyItMatters": "Ransomware and rogue administrators with root or administrative credentials can bypass standard IAM policies, delete backup buckets, and wipe out company disaster recovery data. S3 Object Lock in Compliance Mode prevents ANY user—including the AWS Account Root User—from deleting or modifying locked object versions until the retention timer has fully expired.",
  "workplaceExample": "A financial brokerage must store audited trade confirmations immutably for 7 years under SEC 17a-4 compliance rules. The compliance officer creates a bucket with S3 Object Lock enabled in Compliance Mode with a default retention period of 2,555 days (7 years). Even if a malicious actor gains full AdministratorAccess to the AWS account, S3 refuses any delete or overwrite API calls for those trade confirmation versions until the 7-year retention expires.",
  "examFocus": "Understand the two retention modes and Legal Holds: (1) Governance Mode: Protects objects from deletion, BUT users with the specific IAM permission `s3:BypassGovernanceRetention` can alter retention settings or delete the object version early. (2) Compliance Mode: STRICTEST mode; NO ONE (including the AWS Account Root User) can overwrite, delete, or reduce the retention period until it expires. (3) Legal Hold: Can be placed/removed independently of retention periods; prevents deletion until explicitly removed. (4) Prerequisite: Requires S3 Versioning enabled.",
  "keyPoints": [
    "Enforces Write Once, Read Many (WORM) storage compliance on Amazon S3 object versions.",
    "Governance Mode: Prevents deletion by default, but allows authorized IAM principals with bypass permissions to override.",
    "Compliance Mode: Absolute immutability; cannot be deleted or shortened by ANY user, including the root account.",
    "Legal Hold: Indefinite retention status that blocks deletion until explicitly removed (no expiration timer).",
    "Requires S3 Versioning enabled on the bucket at creation time.",
    "Protects against ransomware encryption, malicious deletion, and satisfies strict financial/legal regulatory mandates."
  ],
  "commonMistake": "Applying Compliance Mode casually in testing or development environments. Because Compliance Mode cannot be overridden or deleted by anyone—not even AWS Support or the root account—you will be billed for storing those objects until the retention period expires.",
  "example": "Put an object with a 90-day Compliance Mode retention lock using the AWS CLI: aws s3api put-object-retention --bucket compliance-records --key trade-101.json --retention 'Mode=COMPLIANCE,RetainUntilDate=2026-11-15T00:00:00Z'.",
  "sources": [
    {
      "title": "Locking Objects with Amazon S3 Object Lock",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html"
    },
    {
      "title": "Amazon S3 Object Lock Overview and Modes",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-overview.html"
    }
  ]
});
