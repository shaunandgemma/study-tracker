import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-20",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Snapshots",
  "status": "ready",
  "plainEnglish": "An EBS Snapshot is a point-in-time, crash-consistent backup copy of an Amazon EBS storage volume stored securely in Amazon Simple Storage Service (Amazon S3). When you trigger a snapshot, AWS takes an instantaneous photographic copy of all blocks written to the disk up to that exact millisecond. You can use snapshots to restore new EBS volumes in any Availability Zone within the Region, share volumes with other AWS accounts, or create custom Amazon Machine Images (AMIs).",
  "whyItMatters": "Hardware failure, accidental deletion, ransomware attacks, and data corruption can destroy live block volumes. EBS snapshots provide durable, long-term disaster recovery backups with 99.999999999% (11 9s) durability in Amazon S3, allowing rapid volume restoration in minutes.",
  "workplaceExample": "Before initiating a high-risk operating system kernel upgrade on a production Linux server, a systems administrator takes an EBS snapshot of the root volume named `Pre-Kernel-Upgrade-Snapshot`. When the upgrade panics the kernel, the administrator restores a clean volume from the snapshot and boots the system back up in 4 minutes.",
  "examFocus": "For SAA-C03, remember these key snapshot rules: (1) Snapshots are stored in Amazon S3 internally (though not visible in the S3 bucket console). (2) Snapshots are Regional objects (accessible across all AZs in the Region). (3) Snapshots can be taken while the instance is running, but stopping the instance or unmounting the file system beforehand guarantees strict application consistency.",
  "keyPoints": [
    "Point-in-time backup copy of an EBS volume stored in Amazon S3 with 11 9s durability.",
    "Regional scope: can be restored to a new EBS volume in ANY Availability Zone in that Region.",
    "Can be taken while the volume is active and attached to a running EC2 instance.",
    "Provides crash-consistent backups by default; application-consistent when I/O is paused.",
    "Serves as the foundation for creating custom AMIs and migrating volumes across AZs."
  ],
  "commonMistake": "Taking a snapshot of a high-throughput database during heavy writing without flushing or freezing the database engine cache. While EBS snapshots are crash-consistent, flushing I/O buffers guarantees clean application-consistent database snapshots.",
  "example": "# Create a snapshot of an active EBS volume:\naws ec2 create-snapshot \\\n  --volume-id vol-0123456789abcdef0 \\\n  --description \"Production database weekly snapshot\" \\\n  --tag-specifications 'ResourceType=snapshot,Tags=[{Key=Environment,Value=Production}]'",
  "sources": [
    {
      "title": "Amazon EBS Snapshots Overview",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html"
    },
    {
      "title": "Creating an Amazon EBS Snapshot",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-creating-snapshot.html"
    }
  ]
});
