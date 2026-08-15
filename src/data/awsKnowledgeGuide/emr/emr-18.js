import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-emr",
  "topicTitle": "Amazon EMR",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "emr-18",
  "title": "EMR Managed Scaling",
  "plainEnglish": "Amazon EMR Managed Scaling is an intelligent, fully managed scaling feature that automatically resizes an EMR cluster based on real-time workload demands. Unlike custom auto-scaling that requires configuring and tuning CloudWatch alarms, Managed Scaling continuously monitors YARN application metrics and resizes Core and Task nodes within your specified minimum and maximum capacity limits.",
  "whyItMatters": "Writing and tuning manual Auto Scaling rules is complex and prone to lagging or overshooting workload demands. EMR Managed Scaling evaluates cluster resource utilization every few seconds, making sub-minute scaling decisions that reduce overall cluster compute costs by up to 60% while optimizing job runtime.",
  "workplaceExample": "A data platform team runs a multi-tenant EMR cluster shared by data science, BI, and ETL teams with unpredictable job submission patterns. Instead of maintaining complex CloudWatch scaling scripts, they enable EMR Managed Scaling with a minimum of 5 nodes and a maximum of 100 nodes, letting AWS automatically allocate On-Demand Core and Spot Task capacity as queues fluctuate.",
  "examFocus": "Know that EMR Managed Scaling is the modern AWS recommendation for cluster auto-scaling. It works on both Instance Groups and Instance Fleets (unlike custom auto-scaling, which only works on Instance Groups). You define minimum/maximum boundaries (in instances, vCPU, or capacity units) and an optional On-Demand limit; AWS handles the rest.",
  "keyPoints": [
    "EMR Managed Scaling continuously monitors cluster workload metrics (YARN pending memory, allocated vCPUs) and resizes clusters automatically.",
    "Supported across both Instance Groups and Instance Fleets, as well as Apache Spark, Apache Hive, and Presto workloads.",
    "Requires only minimum and maximum capacity limits (e.g., Minimum: 2, Maximum: 50, Maximum Core: 10, Maximum On-Demand: 10).",
    "Scales both Core and Task nodes intelligently, prioritizing scaling of Task nodes to avoid unnecessary HDFS re-balancing.",
    "Prevents cluster over-provisioning and reduces cluster compute costs by up to 60% compared to static or manually scaled clusters.",
    "Evaluates cluster resource utilization every few seconds and executes scale-up and scale-down decisions smoothly."
  ],
  "commonMistake": "Attempting to use both custom EMR Auto Scaling policies and EMR Managed Scaling simultaneously on the same cluster. Managed Scaling replaces custom CloudWatch rules; enabling both creates conflicting scaling operations.",
  "example": "Attach a managed scaling policy to an EMR cluster via AWS CLI: aws emr put-managed-scaling-policy --cluster-id j-123456789 --managed-scaling-policy 'ComputeLimits={\"UnitType\":\"Instances\",\"MinimumCapacityUnits\":2,\"MaximumCapacityUnits\":60,\"MaximumOnDemandCapacityUnits\":10,\"MaximumCoreCapacityUnits\":8}'.",
  "sources": [
    {
      "title": "Using Managed Scaling in Amazon EMR",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-managed-scaling.html"
    },
    {
      "title": "Configuring Compute Limits for Managed Scaling",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-managed-scaling-limits.html"
    }
  ]
});
