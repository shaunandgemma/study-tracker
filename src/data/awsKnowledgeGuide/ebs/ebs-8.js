import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-8",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS General Purpose SSD - gp2",
  "status": "ready",
  "plainEnglish": "EBS General Purpose SSD (gp2) is the previous-generation SSD volume type for Amazon EBS. On gp2 volumes, baseline performance is directly tied to the allocated storage volume size at a fixed ratio of 3 IOPS per GiB of storage (with a baseline minimum of 100 IOPS and a maximum cap of 16,000 IOPS at 5.33 TiB). Volumes under 1 TiB can burst up to 3,000 IOPS using I/O burst credits.",
  "whyItMatters": "While gp3 is now the modern standard, understanding gp2 is critical for managing legacy AWS environments and passing certification exams. On gp2, if an application exhausts its burst credit balance, performance collapses to the 3 IOPS/GiB baseline, causing severe latency spikes on small disks.",
  "workplaceExample": "A legacy monitoring server uses a 100 GB gp2 volume. During a sudden log flood, the volume burns through its 5.4 million I/O burst credits and drops to its baseline of 300 IOPS (3 IOPS * 100 GiB), causing disk queue backlog until the DevOps engineer upgrades the volume to gp3.",
  "examFocus": "For SAA-C03, remember the gp2 performance formula: 3 IOPS per GiB with a minimum of 100 IOPS, burst capability up to 3,000 IOPS (for volumes under 1 TiB via burst credit bucket), and a maximum cap of 16,000 IOPS. AWS recommends migrating from gp2 to gp3 for higher baseline performance and lower cost.",
  "keyPoints": [
    "Previous-generation General Purpose SSD volume type.",
    "Performance scales at a fixed ratio of 3 IOPS per GiB of provisioned storage.",
    "Volumes under 1 TiB can burst up to 3,000 IOPS using I/O burst credit balance.",
    "Maximum IOPS cap is 16,000 IOPS (reached at 5,334 GiB / ~5.3 TiB).",
    "Can be converted dynamically to gp3 in place using Elastic Volumes with zero downtime."
  ],
  "commonMistake": "Overprovisioning disk size on gp2 (e.g. creating a 1 TB volume when only 50 GB is needed) just to get 3,000 baseline IOPS. Migrate to gp3 where 3,000 IOPS is included on any disk size for 20% less cost.",
  "example": "# Check I/O credit balance on a gp2 volume using CloudWatch:\naws cloudwatch get-metric-statistics \\\n  --namespace AWS/EBS \\\n  --metric-name BurstBalance \\\n  --dimensions Name=VolumeId,Value=vol-0123456789abcdef0 \\\n  --start-time 2026-08-14T00:00:00Z \\\n  --end-time 2026-08-14T23:59:59Z \\\n  --period 300 \\\n  --statistics Average",
  "sources": [
    {
      "title": "Amazon EBS General Purpose SSD Volumes (gp2)",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html#gp2-volumes"
    },
    {
      "title": "Understanding EBS Burst Credit Balances",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html#burst-bucket"
    }
  ]
});
