import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-emr",
  "topicTitle": "Amazon EMR",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "emr-8",
  "title": "EMR on Amazon EC2",
  "plainEnglish": "Amazon EMR on EC2 is the standard cluster deployment model where EMR provisions, configures, and manages clusters of Amazon Elastic Compute Cloud (EC2) virtual machines. It gives full operational control over instance types, EBS storage volumes, custom AMIs, bootstrap scripts, and networking configurations.",
  "whyItMatters": "Running EMR on EC2 provides maximum customization for large-scale enterprise big-data infrastructure. You can select specialized EC2 instance families (such as memory-optimized r6g instances with Graviton processors or GPU-accelerated g5 instances), attach customized EBS storage, configure custom VPC subnets, and fine-tune operating system and Hadoop/Spark configurations.",
  "workplaceExample": "A global media company runs heavy machine learning training jobs on Spark. They deploy EMR on EC2 using Amazon EC2 Graviton3 instances (c7g and r7g) inside a private VPC subnet, configuring EBS-only storage and running custom bootstrap actions to install proprietary C++ libraries before Spark executors initialize.",
  "examFocus": "Understand the architecture of EMR on EC2: clusters consist of Primary (Master) nodes, Core nodes (running compute and HDFS), and Task nodes (compute only). Know how bootstrap actions run before applications are installed, how instance groups vs. instance fleets function, and how termination protection prevents accidental shutdown of active EC2 clusters.",
  "keyPoints": [
    "EMR on EC2 provisions dedicated clusters of EC2 instances grouped into Primary, Core, and optional Task nodes.",
    "Offers complete control over EC2 instance sizing, AWS Graviton processor adoption, Amazon EBS volume configuration, and custom AMIs.",
    "Supports Bootstrap Actions, which execute custom bash scripts across all nodes to install additional software or modify system settings before EMR applications start.",
    "Supports both Instance Groups (fixed instance type per role, supports Auto Scaling) and Instance Fleets (diverse instance types and allocation strategies across On-Demand and Spot).",
    "Enables SSH access to cluster nodes and debugging via YARN Resource Manager UI, Spark History Server, and Ganglia web interfaces.",
    "Provides Cluster Termination Protection to prevent accidental API or console termination while critical batch workflows are executing."
  ],
  "commonMistake": "Attempting to change instance types or core node storage after an EMR on EC2 cluster has been launched. With uniform instance groups, you can scale the number of instances up or down, but you cannot change the instance family or attached EBS volume size of existing groups without creating a new cluster.",
  "example": "Launch an EMR on EC2 cluster using the AWS CLI: aws emr create-cluster --name 'Spark-Analytics-Cluster' --release-label emr-6.15.0 --applications Name=Spark Name=Hadoop --instance-groups InstanceGroupType=MASTER,InstanceCount=1,InstanceType=m6g.xlarge InstanceGroupType=CORE,InstanceCount=4,InstanceType=r6g.2xlarge --ec2-attributes KeyName=my-key-pair,SubnetId=subnet-0123456789abcdef0 --auto-terminate.",
  "sources": [
    {
      "title": "Amazon EMR on Amazon EC2",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-overview.html"
    },
    {
      "title": "Plan and Configure Amazon EMR on EC2 Instances",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-instances-guidelines.html"
    }
  ]
});
