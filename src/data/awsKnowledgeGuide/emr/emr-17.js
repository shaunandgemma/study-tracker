import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-emr",
  "topicTitle": "Amazon EMR",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "emr-17",
  "title": "EMR Auto Scaling",
  "plainEnglish": "EMR Auto Scaling is a scaling mechanism that automatically resizes Amazon EMR instance groups based on custom rules and Amazon CloudWatch metrics. You define explicit scale-out and scale-in policies (such as adding instances when YARN memory is low or removing instances when the cluster is idle) to adapt cluster capacity to fluctuating processing demands.",
  "whyItMatters": "Big-data workloads frequently experience spikes during daily batch runs and troughs during off-peak hours. EMR Auto Scaling helps prevent under-provisioning during heavy workloads and avoids paying for excess compute capacity when clusters are underutilized.",
  "workplaceExample": "A media streaming provider processes daily viewing logs on an EMR cluster. They configure an Auto Scaling policy on the Task instance group that triggers a scale-out of 10 instances whenever the CloudWatch metric YARNMemoryAvailablePercentage drops below 15% for two consecutive 5-minute periods, and scales in when available memory exceeds 80%.",
  "examFocus": "Understand how custom EMR Auto Scaling works: it attaches to Instance Groups (not Instance Fleets) and evaluates CloudWatch metrics (like YARNMemoryAvailablePercentage, ContainerPendingRatio, and IsIdle). Scaling policies specify scale-out and scale-in thresholds, step adjustments, and cooldown periods. Contrast this with EMR Managed Scaling, which requires no custom CloudWatch rules.",
  "keyPoints": [
    "EMR Auto Scaling resizes cluster instance groups dynamically using custom CloudWatch alarm thresholds and scaling policies.",
    "Supported only on clusters configured with Instance Groups; not supported on Instance Fleets (which use EMR Managed Scaling).",
    "Common scaling metrics include YARNMemoryAvailablePercentage, ContainerPendingRatio, MemoryAllocatedMB, and CoreNodesRunning.",
    "Scale-in protection and graceful shrink ensure decommissioning nodes finish running tasks before instances are terminated.",
    "Cooldown periods prevent premature or oscillation-driven scaling actions while recently added or removed nodes stabilize.",
    "Policies define minimum and maximum instance count boundaries to prevent unbounded cost growth."
  ],
  "commonMistake": "Configuring aggressive scale-in rules on Core instance groups with short cooldowns. Scaling in Core nodes causes HDFS data re-replication, which can degrade cluster performance; auto-scaling policies should primarily target Task instance groups.",
  "example": "Attach an auto-scaling policy to a Task instance group using the AWS CLI: aws emr put-auto-scaling-policy --cluster-id j-123456789 --instance-group-id ig-123456789 --auto-scaling-policy file://scaling-policy.json.",
  "sources": [
    {
      "title": "Using Automatic Scaling in Amazon EMR",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-automatic-scaling.html"
    },
    {
      "title": "Understanding EMR CloudWatch Metrics for Scaling",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-manage-view-web-app-metrics.html"
    }
  ]
});
