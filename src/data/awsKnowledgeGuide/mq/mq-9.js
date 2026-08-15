import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mq-9',
  topicId: 'topic-mq',
  topicTitle: 'Amazon MQ',
  objectiveCode: 'Integration',
  title: 'Multi-AZ Broker Deployment',
  status: 'ready',
  plainEnglish: 'Multi-AZ Broker Deployment refers to the high-availability topology configurations supported by Amazon MQ across multiple Availability Zones:\n- ActiveMQ Engine: Deploys an Active/Standby pair across 2 AZs with shared Amazon EFS storage.\n- RabbitMQ Engine: Deploys a 3-node Cluster across 3 Availability Zones utilizing Raft-replicated Quorum Queues.\nMulti-AZ deployments protect message queues against single-AZ datacenter outages.',
  whyItMatters: 'Production enterprise workloads cannot risk downtime from an AWS Availability Zone failure. Multi-AZ broker deployments ensure high availability and data durability across physical datacenter boundaries.',
  workplaceExample: 'A payment gateway deploys an Amazon MQ RabbitMQ Cluster across `us-east-1a`, `us-east-1b`, and `us-east-1c`. When `us-east-1a` experiences a hardware disruption, the 3-AZ RabbitMQ cluster continues serving traffic via quorum nodes in `1b` and `1c` without message loss.',
  examFocus: 'SAA-C03 Multi-AZ Topology Comparison:\n- ActiveMQ Multi-AZ: 2 instances (Active/Standby) in 2 AZs backed by shared Amazon EFS.\n- RabbitMQ Multi-AZ: 3 instances (Cluster nodes) in 3 AZs using Quorum Queues (replicated EBS storage).\n- SLA & Availability: Multi-AZ deployments qualify for the Amazon MQ SLA uptime commitment; Single-instance brokers do NOT.',
  keyPoints: [
    'Provides multi-datacenter high availability and data durability.',
    'ActiveMQ Multi-AZ: Active/Standby pair in 2 AZs backed by shared EFS.',
    'RabbitMQ Multi-AZ: 3-node Cluster across 3 AZs using Quorum Queues.',
    'Protects messaging infrastructure against single Availability Zone failures.',
    'Required for production workloads to qualify for the Amazon MQ SLA.'
  ],
  commonMistake: 'Deploying a Single-Instance broker in production and expecting automatic multi-AZ failover during an Availability Zone outage.',
  example: 'Creating a 3-AZ RabbitMQ Cluster Broker via AWS CLI:\naws mq create-broker --broker-name ProdRabbitMQCluster --engine-type RABBITMQ --engine-version 3.11.20 --host-instance-type mq.m5.large --deployment-mode CLUSTER_MULTI_AZ --publicly-accessible false',
  sources: [
    { title: 'Amazon MQ deployment modes', url: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/amazon-mq-broker-architecture.html' }
  ]
});
