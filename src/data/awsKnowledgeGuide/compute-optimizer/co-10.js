import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "co-10",
  "topicId": "topic-compute-optimizer",
  "topicTitle": "AWS Compute Optimizer",
  "objectiveCode": "Management",
  "title": "Utilization Metrics",
  "status": "ready",
  "plainEnglish": "Utilization Metrics in AWS Compute Optimizer represent the actual hardware consumption data points tracked over time for your compute and storage resources. For Amazon EC2 instances, utilization metrics include CPU utilization (percentage), Memory utilization (percentage, when CloudWatch Agent is active), Network in/out throughput and packets per second, Local storage IOPS/throughput, and EBS volume read/write IOPS and throughput. Compute Optimizer evaluates both average consumption and peak 99th-percentile (p99) demand.",
  "whyItMatters": "Sizing decisions based on average utilization alone are dangerous because averages flatten out critical traffic spikes. Compute Optimizer analyzes peak percentiles across all hardware vectors, ensuring that recommended instance sizes can comfortably absorb traffic surges without experiencing hardware saturation or packet drops.",
  "workplaceExample": "A streaming service runs an instance with an average CPU utilization of 12% across 14 days, but daily evening peaks hit 85% CPU for two hours. Compute Optimizer evaluates these peak utilization metrics and avoids recommending a drastic 4x downsize that would fail during the evening rush.",
  "examFocus": "For SAA-C03, remember what utilization metrics are evaluated: CPU, Network, Disk I/O, and Memory. Memory utilization is NOT available by default through basic EC2 CloudWatch metrics; the CloudWatch Unified Agent must be installed and configured on the OS to feed memory metrics to Compute Optimizer for full-dimension rightsizing.",
  "keyPoints": [
    "Tracks CPU utilization, memory utilization, network bandwidth, and disk I/O metrics.",
    "Analyzes both baseline average demand and peak 99th percentile (p99) traffic bursts.",
    "Memory metrics require the Amazon CloudWatch Agent to be installed and running on the instance OS.",
    "Default lookback window evaluates 14 days of metric history at 5-minute granularity.",
    "Enhanced Infrastructure Metrics extends lookback history up to 3 months (93 days)."
  ],
  "commonMistake": "Assuming Compute Optimizer automatically analyzes memory utilization without configuring the CloudWatch Agent. Without the agent, Compute Optimizer makes recommendations based only on CPU, network, and disk I/O, noting memory as 'Unavailable'.",
  "example": "# Query utilization metrics for an EC2 instance recommendation:\naws compute-optimizer get-ec2-instance-recommendations \\\n  --instance-arns arn:aws:ec2:us-east-1:123456789012:instance/i-1234567890abcdef0 \\\n  --query 'instanceRecommendations[0].utilizationMetrics[*].[name,statistic,value]' \\\n  --output table",
  "sources": [
    {
      "title": "Metrics Analyzed by AWS Compute Optimizer",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/metrics-analyzed.html"
    },
    {
      "title": "Enabling Memory Utilization Metrics with CloudWatch Agent",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/metrics-analyzed.html#cw-agent"
    }
  ]
});
