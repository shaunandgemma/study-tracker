import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-30",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Capacity Rebalancing for Spot Instances",
  "status": "ready",
  "plainEnglish": "Capacity Rebalancing for Spot Instances in Amazon EC2 Auto Scaling is an automated proactive management feature that monitors EC2 Spot Instance rebalance recommendations. When AWS detects that a Spot Instance is at elevated risk of interruption (often sent minutes before the standard 2-minute interruption notice), Capacity Rebalancing proactively launches a replacement Spot instance in a less vulnerable pool, warms it up, and only terminates the at-risk instance once the replacement is fully healthy.",
  "whyItMatters": "The standard EC2 Spot Interruption Notice gives only 2 minutes of warning before an instance is terminated, which may not be enough time to drain connections, checkpoint progress, or boot a replacement. Capacity Rebalancing gives applications proactive lead time, minimizing workload degradation and connection drops.",
  "workplaceExample": "A distributed data processing pipeline on Spot instances enables Capacity Rebalancing. When AWS detects that `c5.large` Spot capacity in `us-east-1a` is tightening, Auto Scaling receives an EC2 Rebalance Recommendation signal, immediately launches a replacement `c5a.large` Spot instance in `us-east-1b`, and migrates active worker tasks before the old instance is ever interrupted.",
  "examFocus": "For SAA-C03, know that Capacity Rebalancing is the AWS-recommended feature for improving workload resilience on Spot ASGs: (1) It acts on EC2 Instance Rebalance Recommendations (sent earlier than the 2-minute Spot interruption warning). (2) Proactively launches a replacement before terminating the at-risk instance. (3) Enabled with a single toggle (`CapacityRebalance: true`) on the ASG.",
  "keyPoints": [
    "Proactively replaces Spot instances at elevated risk of interruption.",
    "Triggers based on EC2 Instance Rebalance Recommendation signals.",
    "Launches and warms a replacement Spot instance BEFORE terminating the at-risk instance.",
    "Gives workloads significantly more lead time than the 2-minute Spot interruption notice.",
    "Improves application availability and reduces dropped requests on Spot fleets."
  ],
  "commonMistake": "Relying strictly on the 2-minute Spot interruption notice for graceful shutdown when application initialization takes 3 minutes. Enable Capacity Rebalancing so that replacements are launched in advance.",
  "example": "# Enable Capacity Rebalancing on an existing Auto Scaling Group:\naws autoscaling update-auto-scaling-group \\\n  --auto-scaling-group-name SpotWorker-ASG \\\n  --capacity-rebalance",
  "sources": [
    {
      "title": "Use Capacity Rebalance to Handle Amazon EC2 Spot Interruptions",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/capacity-rebalance.html"
    },
    {
      "title": "EC2 Spot Instance Rebalance Recommendations",
      "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/rebalance-recommendations.html"
    }
  ]
});
