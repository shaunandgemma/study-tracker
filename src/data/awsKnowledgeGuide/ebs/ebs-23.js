import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-23",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Cross-Region Snapshot Copy",
  "status": "ready",
  "plainEnglish": "EBS Cross-Region Snapshot Copy is the process of copying an Amazon EBS snapshot from its source AWS Region (e.g. `us-east-1` in Virginia) to a destination AWS Region (e.g. `us-west-2` in Oregon or `eu-west-1` in Ireland). The snapshot copy created in the destination Region receives a unique snapshot ID, is stored in the destination Region's Amazon S3 infrastructure, and can be used to launch EC2 instances or restore EBS volumes in any Availability Zone of the destination Region.",
  "whyItMatters": "Cross-Region Snapshot Copy is foundational for multi-region disaster recovery (DR) architectures, geographical expansion, and cross-region application data replication. In the event of a catastrophic regional disaster, applications can be brought online in a backup AWS Region within minutes using cross-region snapshots.",
  "workplaceExample": "A global SaaS platform configures an automated cross-region backup pipeline using Amazon Data Lifecycle Manager (DLM). Every night, snapshots of primary production databases in `us-east-1` are copied to `us-west-2`, guaranteeing a cross-region Recovery Point Objective (RPO) of under 24 hours.",
  "examFocus": "For SAA-C03, remember these cross-region snapshot rules: (1) The first cross-region copy is full; subsequent cross-region copies of the same volume are INCREMENTAL (only changed blocks are transferred over the wire). (2) An encrypted snapshot copied across regions MUST be encrypted with a KMS key in the destination Region (KMS keys are region-specific and cannot be shared across regions).",
  "keyPoints": [
    "Copies an EBS snapshot to a different geographical AWS Region.",
    "First copy across regions is full; subsequent copies are incremental deltas.",
    "Critical architecture pattern for multi-region disaster recovery (DR) and global expansion.",
    "Destination snapshot must use a KMS key native to the destination Region.",
    "Can be automated using Amazon Data Lifecycle Manager (DLM) or AWS Backup."
  ],
  "commonMistake": "Trying to use the source Region's KMS key ARN when copying an encrypted snapshot to a destination Region. AWS KMS keys are strictly region-locked; you must specify a KMS key ARN belonging to the destination Region.",
  "example": "# Copy snapshot from us-east-1 to us-west-2 with destination KMS encryption:\naws ec2 copy-snapshot \\\n  --source-region us-east-1 \\\n  --source-snapshot-id snap-0123456789abcdef0 \\\n  --destination-region us-west-2 \\\n  --encrypted \\\n  --kms-key-id arn:aws:kms:us-west-2:123456789012:key/87654321-4321-4321-4321-210987654321 \\\n  --description \"Disaster Recovery snapshot in Oregon\"",
  "sources": [
    {
      "title": "Copying an EBS Snapshot to Another AWS Region",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-copying-snapshot.html#copy-across-regions"
    },
    {
      "title": "Automating Cross-Region Snapshot Copies with DLM",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/snapshot-lifecycle.html"
    }
  ]
});
