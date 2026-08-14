import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-9",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Provisioned IOPS SSD - io2",
  "status": "ready",
  "plainEnglish": "EBS Provisioned IOPS SSD (io2 and io2 Block Express) is the highest-performance, enterprise-grade solid-state drive (SSD) volume type offered by Amazon EBS. Designed for mission-critical, I/O-intensive relational databases and latency-sensitive transactional workloads (such as SAP HANA, Oracle, Microsoft SQL Server, and SAS Analytics), io2 provides 99.999% (five nines) volume durability, up to 1,000 IOPS per GiB, sub-millisecond latency, and supports EBS Multi-Attach.",
  "whyItMatters": "While gp3 is ideal for general computing, large multi-terabyte transactional databases need guaranteed consistent sub-millisecond I/O latency and up to 256,000 IOPS with io2 Block Express. Furthermore, io2's 99.999% durability makes volume failure 100 times less likely than gp2/gp3 (99.8%–99.9% durability).",
  "workplaceExample": "A commercial bank runs an Oracle RAC financial ledger requiring 100,000 IOPS with guaranteed sub-millisecond response times. They provision an io2 Block Express volume attached to a memory-optimized Nitro EC2 instance, ensuring zero I/O jitter and five-nines storage durability.",
  "examFocus": "For SAA-C03, choose io2 / io2 Block Express when scenarios demand: (1) More than 16,000 IOPS (up to 64,000 or 256,000 IOPS on io2 Block Express), (2) Consistent sub-millisecond latency, (3) 99.999% durability for critical databases, or (4) EBS Multi-Attach across multiple EC2 instances in the same AZ.",
  "keyPoints": [
    "Highest-performance EBS volume type designed for critical I/O-intensive databases.",
    "Provides 99.999% durability (compared to 99.8%–99.9% for gp3/gp2).",
    "Scales up to 64,000 IOPS (io2) or 256,000 IOPS and 4,000 MB/s throughput (io2 Block Express).",
    "Delivers consistent sub-millisecond latency at a ratio of up to 1,000 IOPS:GiB.",
    "Supports EBS Multi-Attach to connect to up to 16 Nitro-based EC2 instances simultaneously."
  ],
  "commonMistake": "Using Provisioned IOPS SSD for general web servers or development instances where gp3 would deliver identical application performance at a fraction of the cost. Reserve io2 for high-throughput enterprise databases.",
  "example": "# Create a 500 GB io2 volume with 25,000 IOPS (50:1 ratio):\naws ec2 create-volume \\\n  --availability-zone us-east-1a \\\n  --size 500 \\\n  --volume-type io2 \\\n  --iops 25000 \\\n  --encrypted",
  "sources": [
    {
      "title": "Amazon EBS Provisioned IOPS SSD Volumes (io2)",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/provisioned-iops.html#io2-volumes"
    },
    {
      "title": "Amazon EBS io2 Block Express Architecture",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/block-express.html"
    }
  ]
});
