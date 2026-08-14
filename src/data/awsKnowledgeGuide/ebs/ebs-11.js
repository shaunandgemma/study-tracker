import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-11",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Cold HDD - sc1",
  "status": "ready",
  "plainEnglish": "EBS Cold HDD (sc1) is the lowest-cost block storage volume type offered by Amazon EBS. Like st1, sc1 is a magnetic spinning hard disk drive (HDD) volume, but it is engineered specifically for infrequently accessed, cold workloads that require low-cost bulk sequential storage rather than frequent access. It provides baseline throughput of 12 MB/s per TiB, burst throughput up to 250 MB/s per volume, and up to 250 IOPS.",
  "whyItMatters": "When applications require large amounts of raw local block storage for historical data archives, secondary compliance backups, or rarely referenced file repositories attached to EC2 instances, sc1 provides the lowest cost per gigabyte of all EBS volume types.",
  "workplaceExample": "A legal firm attaches a 10 TB sc1 volume to a document retrieval server to store 7 years of archived courtroom transcripts. The records are queried only a few times per month, making sc1 the most economical choice at a fraction of SSD costs.",
  "examFocus": "For SAA-C03, remember the rules for sc1: (1) Lowest-cost EBS volume type for infrequently accessed sequential workloads. (2) CANNOT be used as an EC2 Root Volume (cannot boot OS). (3) Volume size ranges from 125 GiB to 16 TiB. (4) If the exam asks for lowest-cost block storage for infrequently accessed sequential data, choose sc1.",
  "keyPoints": [
    "Lowest-cost EBS block storage volume type for Amazon EC2.",
    "Engineered for infrequently accessed, sequential, cold workloads.",
    "Throughput scales up to 250 MB/s per volume with up to 250 IOPS.",
    "CANNOT be used as an EC2 Root Volume (boot disk).",
    "Volume size ranges from 125 GiB to 16 TiB."
  ],
  "commonMistake": "Using `sc1` for small random read/write workloads (like active MySQL or Postgres databases). The spinning disk heads result in high latency and low random IOPS. Use SSD volumes (gp3/io2) for transactional databases.",
  "example": "# Create a 5 TB Cold HDD (sc1) volume for archival storage:\naws ec2 create-volume \\\n  --availability-zone us-east-1a \\\n  --size 5000 \\\n  --volume-type sc1 \\\n  --encrypted",
  "sources": [
    {
      "title": "Amazon EBS Cold HDD Volumes (sc1)",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html#cold-hdd"
    },
    {
      "title": "Amazon EBS Volume Types and Pricing Characteristics",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html"
    }
  ]
});
