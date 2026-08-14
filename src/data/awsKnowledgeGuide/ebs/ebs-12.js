import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-12",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Volume Types and Workload Selection",
  "status": "ready",
  "plainEnglish": "EBS Volume Types and Workload Selection is the decision framework for choosing the optimal Amazon EBS storage volume category based on application requirements. EBS offers two broad categories: Solid State Drives (SSD: gp3, gp2, io2, io2 Block Express) optimized for small, random I/O and transactional operations, and Hard Disk Drives (HDD: st1, sc1) optimized for large, sequential throughput and bulk data storage.",
  "whyItMatters": "Selecting the wrong volume type leads either to poor application performance (e.g. putting a relational database on spinning HDD) or massive cost overruns (e.g. storing cold backup logs on io2 Provisioned IOPS SSD). Matching workload characteristics to the appropriate volume type optimizes both cost and performance.",
  "workplaceExample": "An enterprise architects a 3-tier architecture: they choose gp3 for web and application server boot drives, io2 Block Express for their primary production Oracle database, st1 for nightly ETL data processing, and sc1 for 90-day archive logs.",
  "examFocus": "For SAA-C03, memorize this volume decision matrix: (1) System boot volumes / General apps -> gp3 (or gp2). (2) High-performance databases (>16,000 IOPS, sub-ms latency, multi-attach) -> io2 / io2 Block Express. (3) Big data, EMR, streaming logs (frequently accessed sequential) -> st1. (4) Cold archival block data (infrequently accessed sequential) -> sc1.",
  "keyPoints": [
    "SSD category (gp3, gp2, io2): Optimized for transactional workloads, databases, and OS boot volumes.",
    "HDD category (st1, sc1): Optimized for throughput-heavy sequential workloads and big data; CANNOT boot OS.",
    "gp3: Recommended default; includes 3,000 IOPS and 125 MB/s baseline; independent scaling.",
    "io2 / io2 Block Express: Mission-critical databases requiring up to 256,000 IOPS and 99.999% durability.",
    "st1: High-throughput sequential data (up to 500 MB/s); sc1: Lowest-cost cold sequential storage."
  ],
  "commonMistake": "Trying to use HDD volumes (st1 or sc1) as boot volumes. Only SSD volume types (gp3/gp2, io1/io2) can be used as EC2 boot/root devices.",
  "example": "# Comparison Table of EBS Volume Types:\n# | Volume Type | Category | Max IOPS | Max Throughput | Typical Workload |\n# | gp3         | SSD      | 16,000   | 1,000 MB/s     | General / Boot / Apps |\n# | io2         | SSD      | 256,000  | 4,000 MB/s     | Critical Databases |\n# | st1         | HDD      | 500      | 500 MB/s       | Big Data / Log / ETL |\n# | sc1         | HDD      | 250      | 250 MB/s       | Cold / Archive Logs |",
  "sources": [
    {
      "title": "Amazon EBS Volume Types and Performance",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html"
    },
    {
      "title": "Amazon EBS Pricing and Performance Characteristics",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html#volume-type-summary"
    }
  ]
});
