import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-32",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS vs Instance Store",
  "status": "ready",
  "plainEnglish": "Amazon EBS and EC2 Instance Store are the two primary block storage options for Amazon EC2 instances, but they have fundamentally different persistence and performance architectures. Amazon EBS is network-attached, persistent block storage that automatically replicates within an Availability Zone and survives instance stops and terminations. EC2 Instance Store consists of physical NVMe/SSD or HDD disks physically installed inside the host server hardware that provides ultra-high IOPS and sub-microsecond latency, but is strictly EPHEMERAL (temporary): all data is lost when the instance is stopped, hibernated, or hardware fails.",
  "whyItMatters": "Using Instance Store for long-term database storage without application-level clustering results in catastrophic permanent data loss when an instance stops. Conversely, using standard EBS for high-frequency temporary caching, video transcoding scratch buffers, or Hadoop shuffle files unnecessarily drives up network I/O and storage costs.",
  "workplaceExample": "A distributed search cluster running Elasticsearch uses EC2 Instance Store SSDs on `i3en` instances to achieve 2 million random read IOPS for real-time search indexing, relying on Elasticsearch's internal multi-node replication across three Availability Zones to protect against individual host hardware failures. Their standalone MySQL master uses Amazon EBS gp3 for persistent, durable storage.",
  "examFocus": "For SAA-C03, know the critical differences: (1) Instance Store is ephemeral (data lost on instance STOP, termination, or host failure; survives OS reboot). (2) Instance Store CANNOT be detached or resized dynamically. (3) EBS is persistent (survives instance stops). (4) Instance Store is ideal for caches, scratch space, temp data, and replicated distributed systems (Hadoop, Kafka, Cassandra).",
  "keyPoints": [
    "Instance Store: Physically attached host storage; ephemeral / temporary lifecycle.",
    "EBS: Network-attached virtual storage; persistent lifecycle independently of instance state.",
    "Instance Store data is LOST on instance stop, hibernation, or underlying hardware failure.",
    "Instance Store data SURVIVES an operating system reboot (soft reboot).",
    "Instance Store delivers ultra-high IOPS and microsecond latencies with zero network overhead.",
    "EBS supports snapshots, live volume modifications, and encryption with AWS KMS."
  ],
  "commonMistake": "Stopping an EC2 instance with an Instance Store volume expecting the data to be there when restarted. Stopping an instance deallocates the physical host server, permanently destroying all Instance Store data.",
  "example": "# Comparison Table:\n# | Feature          | Amazon EBS                     | EC2 Instance Store         |\n# | Attachment       | Network-attached               | Physically host-attached   |\n# | Persistence      | Survives STOP and termination  | Ephemeral (LOST on STOP)   |\n# | Snapshots        | Native AWS Snapshots to S3     | None (manual copy required)|\n# | Dynamic Resize   | Yes (Elastic Volumes)          | No (fixed by instance type)|\n# | Primary Use Case | Databases, OS Boot, ERP, Apps  | Caches, Buffers, Temp Data |",
  "sources": [
    {
      "title": "Amazon EC2 Instance Store",
      "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html"
    },
    {
      "title": "Comparing Amazon EBS and Amazon EC2 Instance Store",
      "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Storage.html"
    }
  ]
});
