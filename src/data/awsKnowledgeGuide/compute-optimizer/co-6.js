import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "co-6",
  "topicId": "topic-compute-optimizer",
  "topicTitle": "AWS Compute Optimizer",
  "objectiveCode": "Management",
  "title": "EBS Volume Recommendations",
  "status": "ready",
  "plainEnglish": "EBS Volume Recommendations in AWS Compute Optimizer analyze historical read/write IOPS, throughput (MB/s), and burst balance metrics of your Amazon Elastic Block Store (EBS) block storage volumes. Compute Optimizer evaluates whether your EBS volumes are over-provisioned or under-provisioned and recommends optimal volume types (e.g. migrating from older gp2 or io1 volumes to modern gp3 or io2), as well as fine-tuning provisioned IOPS and throughput allocations.",
  "whyItMatters": "Storage costs can silently consume a huge portion of an AWS bill, especially when legacy gp2 volumes or over-provisioned io1/io2 volumes are used. Migrating from gp2 to gp3 typically yields an immediate 20% cost reduction per gigabyte while allowing independent provisioning of IOPS and throughput without paying for unused gigabytes.",
  "workplaceExample": "A database team maintains 50 TB of EBS storage on legacy gp2 volumes. Compute Optimizer flags the volumes as over-provisioned and recommends switching to gp3 with baseline 3,000 IOPS and 125 MB/s throughput, reducing annual EBS spending by $14,000 without requiring any downtime.",
  "examFocus": "For SAA-C03, remember that Compute Optimizer analyzes EBS volume IOPS and throughput metrics. Key recommendations include migrating from gp2 to gp3 (up to 20% savings with independent IOPS/throughput tuning) or rightsizing provisioned IOPS on io1/io2 volumes. Volume changes can be executed live using EBS Elastic Volumes without detaching or stopping instances.",
  "keyPoints": [
    "Analyzes historical EBS read/write IOPS, throughput, and burst metrics.",
    "Recommends migrating legacy gp2 volumes to cost-effective gp3 volumes (20% cost savings).",
    "Suggests optimal provisioned IOPS and throughput settings for io1, io2, and gp3 volumes.",
    "Categorizes volumes as Optimized, NotOptimized (over-provisioned/under-provisioned).",
    "Modifications can be applied online via EBS Elastic Volumes with zero downtime."
  ],
  "commonMistake": "Keeping legacy gp2 volumes because of fear of migration downtime. Using AWS EBS Elastic Volumes, you can modify volume type from gp2 to gp3 in place while the EC2 instance is running and fully processing I/O.",
  "example": "# Get EBS volume recommendations:\naws compute-optimizer get-ebs-volume-recommendations \\\n  --volume-arns arn:aws:ec2:us-east-1:123456789012:volume/vol-0123456789abcdef0 \\\n  --query 'volumeRecommendations[0].recommendationOptions[*].[volumeType,volumeSize,provisionedIops,provisionedThroughput]'",
  "sources": [
    {
      "title": "Viewing EBS Volume Recommendations in AWS Compute Optimizer",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-ebs-recommendations.html"
    },
    {
      "title": "EBS Volume Metrics Analyzed by AWS Compute Optimizer",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/metrics-analyzed.html#ebs-metrics-analyzed"
    }
  ]
});
