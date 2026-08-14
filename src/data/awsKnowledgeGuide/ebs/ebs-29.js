import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-29",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS IOPS and Throughput",
  "status": "ready",
  "plainEnglish": "EBS IOPS and Throughput are the two fundamental metrics that measure the performance of Amazon EBS storage volumes. Input/Output Operations Per Second (IOPS) measures the number of individual read or write requests processed per second (critical for small-block random database transactions). Throughput (measured in Megabytes Per Second or MB/s) measures the total volume of data moved per second (critical for large-block sequential streaming, backups, and log ingestion). The relationship between them is governed by I/O block size: `Throughput = IOPS * I/O Block Size`.",
  "whyItMatters": "An application bottleneck can stem from hitting either the IOPS ceiling or the throughput ceiling. For instance, reading 16 KB database records requires high IOPS, while streaming 1 MB video chunks quickly exhausts throughput. Understanding how both metrics interact ensures correct volume type selection and eliminates application performance throttling.",
  "workplaceExample": "A database team notices that queries are slowing down on a transactional MySQL instance. Monitoring with Amazon CloudWatch reveals that IOPS is maxed out at 3,000 IOPS while throughput is only 48 MB/s (due to small 16 KB block sizes). They increase provisioned IOPS on their gp3 volume to 8,000, immediately reducing query wait times.",
  "examFocus": "For SAA-C03, know how EBS performance limits work: (1) An EBS volume has its own provisioned limits (e.g. gp3 has 3,000–16,000 IOPS, 125–1,000 MB/s). (2) An EC2 instance also has instance-level EBS bandwidth/IOPS limits (EBS-Optimized instance limits). (3) The overall performance is always capped by whichever limit is lower: the EBS volume limit or the EC2 instance limit.",
  "keyPoints": [
    "IOPS: Measures transactions/second; critical for transactional databases and small random I/O.",
    "Throughput: Measures MB/second transferred; critical for sequential reads/writes and large files.",
    "Relationship formula: `Throughput (MB/s) = IOPS * I/O size (KB) / 1024`.",
    "EBS volume performance is capped by the lower of the EBS volume limit and the EC2 instance limit.",
    "Use EBS-Optimized EC2 instances to prevent network traffic from stealing EBS storage bandwidth."
  ],
  "commonMistake": "Provisioning 20,000 IOPS on an EBS volume attached to a small EC2 instance that only supports 2,000 IOPS of EBS bandwidth. The instance limit bottlenecks disk performance, resulting in wasted money on unutilized volume IOPS.",
  "example": "# Calculation example:\n# Workload: 1,000 IOPS with 256 KB I/O block size\n# Throughput = 1,000 * 256 KB = 256,000 KB/s = 250 MB/s\n# Requires a volume and EC2 instance capable of supporting at least 250 MB/s throughput.",
  "sources": [
    {
      "title": "Amazon EBS Volume Performance and Metrics",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-performance.html"
    },
    {
      "title": "Amazon EBS-Optimized EC2 Instances",
      "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimized.html"
    }
  ]
});
