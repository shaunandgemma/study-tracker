import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-emr",
  "topicTitle": "Amazon EMR",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "emr-11",
  "title": "EMR Primary, Core and Task Nodes",
  "plainEnglish": "An Amazon EMR cluster is organized into three distinct types of node roles: the Primary node (formerly Master node) manages and coordinates the cluster; Core nodes run computation tasks and store data locally using the Hadoop Distributed File System (HDFS); and Task nodes execute computation tasks only, without storing any HDFS data.",
  "whyItMatters": "Understanding the separation between Primary, Core, and Task nodes is critical for cluster reliability, scaling, and cost efficiency. Because Task nodes do not maintain HDFS data, you can aggressively scale them up and down or run them on Spot Instances without risking cluster data corruption or HDFS replication failure.",
  "workplaceExample": "A data architecture team configures an EMR cluster with 1 On-Demand Primary node, 3 On-Demand Core nodes to provide a stable HDFS baseline for shuffle data, and an auto-scaling group of 20 Spot Task nodes that dynamically scale out during peak morning batch transformation runs and scale to 0 when finished.",
  "examFocus": "Distinguish Core nodes from Task nodes: Core nodes have both compute (YARN NodeManager) and storage (HDFS DataNode); downsizing Core nodes risks HDFS data loss or long re-replication times. Task nodes have only compute (YARN NodeManager) and no HDFS storage, making them safe to scale down rapidly and ideal for Spot Instances.",
  "keyPoints": [
    "Primary (Master) Node: Coordinates the cluster, assigns tasks, monitors node health, and hosts master daemons such as YARN ResourceManager and HDFS NameNode.",
    "Core Nodes: Run processing tasks (YARN NodeManager) and host distributed storage (HDFS DataNode) across attached EBS or instance store volumes.",
    "Task Nodes: Provide pure computational power (YARN NodeManager) and do not participate in HDFS data storage.",
    "Scaling Safety: Scaling down Core nodes requires graceful shrinking to decommission HDFS data blocks; scaling down Task nodes is immediate and carries zero risk of HDFS data loss.",
    "Cost Strategy: Primary and Core nodes typically use On-Demand Instances or Savings Plans for stability, while Task nodes leverage Spot Instances for cost savings.",
    "Single vs. Multi-Primary: Standard clusters have 1 Primary node (single point of failure); high-availability clusters deploy 3 Primary nodes managed by Apache ZooKeeper."
  ],
  "commonMistake": "Running an entire cluster of Core nodes on Spot Instances. If Spot capacity is reclaimed, multiple Core nodes terminating simultaneously can breach HDFS replication tolerance and corrupt cluster storage; use Spot Instances primarily for Task nodes.",
  "example": "Configure an EMR cluster with 1 m6g.xlarge Primary node, 2 m6g.2xlarge Core nodes (with 200 GB gp3 EBS volumes for HDFS), and an auto-scaling Task node group scaling between 0 and 50 r6g.2xlarge Spot Instances.",
  "sources": [
    {
      "title": "Understanding Node Types: Primary, Core, and Task Nodes",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-master-core-task-nodes.html"
    },
    {
      "title": "Cluster Configuration and Node Roles",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-instances-guidelines.html"
    }
  ]
});
