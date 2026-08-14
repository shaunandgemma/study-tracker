import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-7",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS General Purpose SSD - gp3",
  "status": "ready",
  "plainEnglish": "EBS General Purpose SSD (gp3) is the latest-generation, default general-purpose solid-state drive (SSD) volume type for Amazon EBS. Unlike older gp2 volumes where IOPS and throughput were tied directly to the provisioned disk size, gp3 decouples storage capacity from performance. Every gp3 volume includes a baseline performance of 3,000 IOPS and 125 MB/s throughput at any volume size, and allows you to provision up to 16,000 IOPS and 1,000 MB/s independently for a 20% lower price per GB than gp2.",
  "whyItMatters": "With gp3, you no longer need to over-provision hundreds of gigabytes of expensive disk storage just to get higher IOPS or throughput. A small 50 GB database boot disk can be configured with 8,000 IOPS and 500 MB/s without paying for unneeded storage capacity, providing huge cost savings.",
  "workplaceExample": "A DevOps team migrates 300 EC2 instances from gp2 to gp3. On small 100 GB volumes that previously only had 300 IOPS, performance jumps to 3,000 IOPS baseline immediately, and the company cuts its overall EBS storage bill by 20% across the board.",
  "examFocus": "For SAA-C03, remember that gp3 is the recommended default SSD volume type for virtually all general workloads. Key specifications: baseline 3,000 IOPS and 125 MB/s included for free; can scale up to 16,000 IOPS and 1,000 MB/s independently; 20% cheaper than gp2; volume size ranges from 1 GiB to 16 TiB.",
  "keyPoints": [
    "Latest-generation General Purpose SSD volume type; recommended default for EC2.",
    "Provides a baseline of 3,000 IOPS and 125 MB/s throughput regardless of volume size.",
    "Decouples IOPS (up to 16,000) and Throughput (up to 1,000 MB/s) from storage capacity.",
    "Costs 20% less per GB than legacy gp2 volumes.",
    "Volume size scales from 1 GiB to 16 TiB with single-digit millisecond latencies."
  ],
  "commonMistake": "Creating new volumes using legacy gp2 instead of gp3. Unless restricted by legacy software constraints, always choose gp3 for better baseline performance, independent scaling, and 20% cost savings.",
  "example": "# Create a 200 GB gp3 volume with 6000 IOPS and 250 MB/s throughput:\naws ec2 create-volume \\\n  --availability-zone us-east-1a \\\n  --size 200 \\\n  --volume-type gp3 \\\n  --iops 6000 \\\n  --throughput 250 \\\n  --encrypted",
  "sources": [
    {
      "title": "Amazon EBS General Purpose SSD Volumes (gp3)",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html#gp3-volumes"
    },
    {
      "title": "Migrating from gp2 to gp3 Volumes",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html"
    }
  ]
});
