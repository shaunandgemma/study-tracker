import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-27",
  "title": "S3 Versioning",
  "plainEnglish": "Amazon S3 Versioning is a bucket-level feature that preserves every version of every object stored in your bucket. When versioning is enabled, modifying or overwriting an existing file creates a new version with a unique Version ID rather than replacing the original data. When an object is deleted, S3 inserts a 'Delete Marker' as the current version; the underlying historical versions remain intact and can be restored at any time.",
  "whyItMatters": "S3 Versioning is the foundational protection mechanism against accidental human deletion, application overwrite bugs, and ransomware attacks. It allows organizations to easily roll back files to previous timestamps and is a mandatory prerequisite for advanced S3 features including S3 Cross-Region Replication (CRR) and S3 Object Lock.",
  "workplaceExample": "A software company stores production application deployment artifacts in a versioned S3 bucket. A junior engineer accidentally deletes `config/production.json`. Because versioning is active, S3 creates a Delete Marker. The senior engineer lists object versions, deletes the top Delete Marker via the AWS CLI, and immediately restores `config/production.json` to its active state with zero data loss or downtime.",
  "examFocus": "Understand Versioning states and deletion mechanics: (1) Three States: Unversioned (default), Versioning-Enabled, and Versioning-Suspended (once enabled, versioning can NEVER be disabled back to unversioned; it can only be suspended). (2) Deleting an Object: Normal `s3:DeleteObject` creates a Delete Marker. (3) Permanent Deletion: Requires specifying the exact `versionId` in the delete request (`s3:DeleteObjectVersion`). (4) Cost: Every version is stored and billed as full storage until permanently deleted or transitioned via S3 Lifecycle rules.",
  "keyPoints": [
    "Preserves complete historical revisions of every object stored in an S3 bucket.",
    "Bucket versioning states: Unversioned (default), Enabled, and Suspended.",
    "Overwriting an existing key creates a new version with a unique Version ID.",
    "Deleting an object creates a Delete Marker; removing the Delete Marker restores the previous version.",
    "Permanent deletion requires explicitly passing the specific object Version ID in the API call.",
    "Mandatory prerequisite for S3 Same-Region/Cross-Region Replication and S3 Object Lock.",
    "Requires S3 Lifecycle rules to manage noncurrent versions and control storage costs."
  ],
  "commonMistake": "Believing that enabling S3 Versioning does not increase storage costs. S3 stores and bills for every noncurrent version of every object; configure S3 Lifecycle rules (`NoncurrentVersionExpiration`) to clean up old versions automatically.",
  "example": "Permanently delete a specific historical object version using the AWS CLI: aws s3api delete-object --bucket my-versioned-bucket --key database-backup.sql --version-id 3/L4kqtJlcpXroDTDmJ+rmSpXd3dIbrHY.",
  "sources": [
    {
      "title": "Using Versioning in Amazon S3 Buckets",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html"
    },
    {
      "title": "How S3 Versioning Works and Workflows",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/versioning-workflows.html"
    }
  ]
});
