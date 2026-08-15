import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-emr",
  "topicTitle": "Amazon EMR",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "emr-19",
  "title": "EMR Cluster High Availability",
  "plainEnglish": "Amazon EMR Cluster High Availability (Multi-Primary / Multi-Master) is an architectural deployment mode that eliminates the single point of failure in an EMR cluster. Instead of running a single Primary node, EMR launches three Primary nodes managed by Apache ZooKeeper, ensuring that if the active Primary node fails, a standby Primary node automatically takes over without interrupting running applications.",
  "whyItMatters": "In a standard single-primary EMR cluster, a hardware failure or operating system crash on the primary node causes the entire cluster and all running jobs to fail. For mission-critical 24/7 data pipelines, streaming jobs, and enterprise data lake query services, multi-master high availability provides continuous uptime and automated failover.",
  "workplaceExample": "A banking institution operates a long-running EMR cluster running Apache Spark Structured Streaming for 24/7 fraud scoring on credit card transactions. To prevent stream processing downtime and meet strict financial SLA requirements, they deploy an EMR High Availability cluster with 3 Primary nodes and termination protection enabled.",
  "examFocus": "Know that EMR High Availability requires launching exactly three Primary nodes (not two, due to ZooKeeper quorum requirements). In HA mode, master daemons (YARN ResourceManager, HDFS NameNode, Spark History Server, Ganglia) run in active-standby pairs. Failover is automatic and transparent to applications.",
  "keyPoints": [
    "Launches three Primary (Master) nodes in a cluster to eliminate the master node as a single point of failure.",
    "Uses Apache ZooKeeper for cluster coordination, leader election, and distributed state consensus across the three primary nodes.",
    "Runs YARN ResourceManager and HDFS NameNode in active-standby configurations, switching roles automatically upon primary node failure.",
    "Critical applications, in-flight steps, and long-running streaming jobs continue executing seamlessly during a failover event.",
    "Requires three master nodes to form an odd-numbered quorum (preventing split-brain scenarios in ZooKeeper).",
    "Once created as a single-master or multi-master cluster, this architecture cannot be changed; you must launch a new cluster to switch topologies."
  ],
  "commonMistake": "Assuming you can configure an EMR High Availability cluster with 2 master nodes. ZooKeeper leader election requires an odd number of nodes to reach a majority quorum; AWS EMR specifically provisions 3 master nodes for HA mode.",
  "example": "Launch a high availability EMR cluster via the AWS CLI by specifying 3 master instances: aws emr create-cluster --name 'HA-Streaming-Cluster' --release-label emr-6.15.0 --applications Name=Spark Name=Hadoop --instance-groups InstanceGroupType=MASTER,InstanceCount=3,InstanceType=m6g.xlarge InstanceGroupType=CORE,InstanceCount=3,InstanceType=r6g.2xlarge.",
  "sources": [
    {
      "title": "Plan for High Availability in Amazon EMR",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-ha.html"
    },
    {
      "title": "Configuring Multi-Master Clusters in Amazon EMR",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-ha-launch.html"
    }
  ]
});
