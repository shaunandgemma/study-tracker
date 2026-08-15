import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-emr",
  "topicTitle": "Amazon EMR",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "emr-14",
  "title": "Spot Instances for EMR Task Capacity",
  "plainEnglish": "Amazon EC2 Spot Instances allow you to access unused EC2 compute capacity at steep discounts (up to 90% off On-Demand pricing). In Amazon EMR, using Spot Instances specifically for Task nodes allows you to massively accelerate distributed data processing at minimal cost, because Task nodes do not store state in HDFS and can be interrupted without risking data corruption.",
  "whyItMatters": "Big-data workloads like Apache Spark and MapReduce require substantial CPU and memory during peak processing stages. By allocating Spot Instances to Task nodes, organizations achieve dramatic cost savings while maintaining cluster durability, as the master and HDFS-holding core nodes remain protected on reliable On-Demand instances.",
  "workplaceExample": "A genomics research lab runs genome sequencing pipelines on Spark. They configure an EMR cluster with an On-Demand primary node and two On-Demand core nodes, but attach an Instance Fleet of up to 100 Spot Task nodes across multiple instance types (m5.4xlarge, m5a.4xlarge, c5.4xlarge). If AWS reclaims capacity for one instance type, EMR automatically replaces it from other Spot pools.",
  "examFocus": "Know the architectural best practice for EMR cost optimization: Run Primary (Master) and Core nodes on On-Demand Instances to protect cluster coordination and HDFS data integrity, and run Task nodes on Spot Instances. Use EMR Instance Fleets to diversify across multiple instance types and Availability Zones to maximize Spot fulfillment.",
  "keyPoints": [
    "Task nodes only run YARN containers and do not store persistent or HDFS data, making them resilient to Spot interruptions.",
    "If a Spot Task node is reclaimed, YARN simply reruns the affected tasks on remaining or newly launched nodes.",
    "Instance Fleets allow you to define up to 30 EC2 instance types per fleet, vastly improving Spot availability and diversification across pools.",
    "Supports Spot allocation strategies like 'capacity-optimized' (launches instances from pools with the most available capacity) and 'price-capacity-optimized'.",
    "EMR Graceful Shrink ensures that decommissioning nodes finish active tasks and push shuffle outputs before terminating when capacity changes.",
    "Avoid running Core nodes entirely on Spot Instances unless your workload is completely fault-tolerant and transient."
  ],
  "commonMistake": "Using a single instance type in a single Availability Zone for Spot Task nodes. If that single Spot pool experiences high market demand and capacity is revoked, the cluster may fail to scale; always diversify across multiple instance types and sizes using Instance Fleets.",
  "example": "Configure an EMR Instance Fleet for Task capacity with a target Spot capacity of 50 units, specifying instance specifications for r5.xlarge (1 unit), r5a.xlarge (1 unit), and r5.2xlarge (2 units) with the capacity-optimized allocation strategy.",
  "sources": [
    {
      "title": "Using Spot Instances with Amazon EMR",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-spot-instances.html"
    },
    {
      "title": "Configure Instance Fleets in Amazon EMR",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-instance-fleet.html"
    }
  ]
});
