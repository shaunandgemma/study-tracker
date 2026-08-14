import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-13",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Availability Zone Scope",
  "status": "ready",
  "plainEnglish": "EBS Availability Zone Scope means that an Amazon EBS volume is physically bound to the specific Availability Zone (AZ) in which it was created. An EBS volume created in `us-east-1a` can only be directly attached to EC2 instances running inside `us-east-1a`; it cannot be directly attached to an instance running in `us-east-1b` or another AZ.",
  "whyItMatters": "Because EBS volumes deliver low-latency, high-IOPS block storage over high-speed local data center networking, they must reside in the same physical facility as the EC2 compute instance. To move an EBS volume's data to another AZ or Region, you must take an EBS snapshot (stored in S3) and restore a new volume in the target AZ.",
  "workplaceExample": "A database instance in `us-east-1a` suffers an AZ outage. To recover in `us-east-1b`, the disaster recovery engineer takes the latest EBS snapshot of the database volume, creates a new EBS volume specifying `AvailabilityZone: us-east-1b`, and attaches it to a newly launched EC2 instance in `us-east-1b`.",
  "examFocus": "For SAA-C03, remember the fundamental rule: EBS volumes are strictly Availability Zone-scoped. They cannot span multiple AZs. To migrate an EBS volume to a different AZ within the same Region: (1) Take a snapshot of the EBS volume (snapshots are Regional/stored in S3), (2) Create a new volume from that snapshot and select the target AZ, (3) Attach the new volume to an EC2 instance in the target AZ.",
  "keyPoints": [
    "EBS volumes are strictly tied to a single Availability Zone (AZ).",
    "Can only be attached to Amazon EC2 instances residing in the exact same AZ.",
    "Data automatically replicates across multiple servers within that single AZ for durability.",
    "To move a volume to another AZ: Snapshot the volume -> Create a new volume in target AZ.",
    "To move a volume to another Region: Snapshot -> Copy snapshot to target Region -> Create volume."
  ],
  "commonMistake": "Attempting to attach an EBS volume to an EC2 instance in a different Availability Zone. The AWS API will immediately reject the attachment request with an `InvalidVolume.ZoneMismatch` error.",
  "example": "# Step 1: Create a snapshot of the volume in us-east-1a:\naws ec2 create-snapshot --volume-id vol-0123456789abcdef0 --description \"Snapshot for AZ migration\"\n\n# Step 2: Restore the snapshot as a new volume in us-east-1b:\naws ec2 create-volume --availability-zone us-east-1b --snapshot-id snap-0123456789abcdef0 --volume-type gp3",
  "sources": [
    {
      "title": "Amazon EBS Availability Zone Scope and Architecture",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html"
    },
    {
      "title": "Restoring an Amazon EBS Volume from a Snapshot",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-restoring-volume.html"
    }
  ]
});
