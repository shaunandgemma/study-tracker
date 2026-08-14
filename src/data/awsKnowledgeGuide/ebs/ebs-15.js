import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-15",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Multi-Attach for Supported io1 and io2 Volumes",
  "status": "ready",
  "plainEnglish": "EBS Multi-Attach is an advanced storage feature that allows a single Provisioned IOPS SSD volume (io1 or io2) to be concurrently attached with read/write permissions to up to 16 AWS Nitro System-based EC2 instances within the same Availability Zone. This enables clustered, multi-node enterprise applications to share a high-performance raw block device without using network file protocols.",
  "whyItMatters": "Traditional enterprise failover clusters (such as Oracle RAC or Pacemaker/Corosync cluster suites) require shared physical SAN or block storage across active and standby nodes to maintain instant failover and shared state. Multi-Attach allows cloud architects to lift-and-shift these clustered architectures into AWS without refactoring code for distributed object storage.",
  "workplaceExample": "A financial exchange runs a high-availability active/active clustered database on two Nitro EC2 instances. They attach a shared 1 TB io2 volume with Multi-Attach enabled, using a cluster-aware file system (OCFS2) to coordinate concurrent read/write transactions between both nodes.",
  "examFocus": "For SAA-C03, remember these Multi-Attach constraints: (1) Supported ONLY on Provisioned IOPS SSD volumes (io1 and io2) on AWS Nitro-based instance types. (2) All attached instances must reside in the SAME Availability Zone. (3) Up to 16 instances can attach concurrently. (4) Requires a cluster-aware file system (e.g. GFS2, OCFS2) to prevent data corruption from concurrent uncoordinated writes.",
  "keyPoints": [
    "Attaches a single io1 or io2 volume to up to 16 Nitro-based EC2 instances concurrently.",
    "All attached EC2 instances must be in the same Availability Zone.",
    "Supported only on Provisioned IOPS SSD (io1 and io2) volume types.",
    "Requires a cluster-aware file system (e.g. GFS2, OCFS2, Oracle RAC) to manage write locks.",
    "Not supported on General Purpose SSD (gp2/gp3) or HDD (st1/sc1) volumes."
  ],
  "commonMistake": "Formatting an EBS Multi-Attach volume with a standard non-clustered file system (like ext4 or XFS) and mounting it read/write on multiple instances. Standard file systems have no distributed write locking, causing immediate data corruption.",
  "example": "# Create an io2 volume with Multi-Attach enabled:\naws ec2 create-volume \\\n  --availability-zone us-east-1a \\\n  --size 500 \\\n  --volume-type io2 \\\n  --iops 25000 \\\n  --multi-attach-enabled \\\n  --encrypted",
  "sources": [
    {
      "title": "Amazon EBS Multi-Attach for io1 and io2 Volumes",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes-multi.html"
    },
    {
      "title": "Considerations and Requirements for EBS Multi-Attach",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes-multi.html#considerations"
    }
  ]
});
