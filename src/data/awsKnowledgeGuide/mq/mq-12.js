import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mq-12',
  topicId: 'topic-mq',
  topicTitle: 'Amazon MQ',
  objectiveCode: 'Integration',
  title: 'VPC and Security Group Integration',
  status: 'ready',
  plainEnglish: 'Amazon MQ VPC and Security Group Integration allows you to deploy private message brokers directly within your private VPC subnets. A Private Broker creates Elastic Network Interfaces (ENIs) inside your subnets, securing broker traffic using VPC Security Groups, Network ACLs, and VPC Route Tables so that only authorized microservices in your VPC or connected hybrid networks can access the broker.',
  whyItMatters: 'Exposing enterprise message brokers to the public internet creates severe security risks. Private Amazon MQ brokers isolate messaging traffic within your private network topology.',
  workplaceExample: 'A bank provisions a Private Amazon MQ broker inside private subnets (`10.0.1.0/24`). A Security Group (`sg-mq-broker`) allows inbound TCP 5671 ONLY from the EC2 Application Security Group (`sg-app-servers`). No public IP addresses are assigned.',
  examFocus: 'SAA-C03 Private Broker VPC Networking:\n- Private vs Public: Default recommendation is Private Broker (`publiclyAccessible: false`).\n- ENIs: Amazon MQ provisions Elastic Network Interfaces in selected VPC subnets.\n- Security Groups: Attach custom security groups to restrict inbound traffic to specific wire ports (e.g. 5671 for AMQPS, 61617 for OpenWire).\n- Hybrid Access: Connect on-premises clients via AWS Direct Connect, AWS Site-to-Site VPN, or VPC Peering.',
  keyPoints: [
    'Private brokers deploy Elastic Network Interfaces (ENIs) inside private VPC subnets.',
    'Restricts network access using VPC Security Groups, Network ACLs, and Private Route Tables.',
    'Default security recommendation: Set `PubliclyAccessible: false`.',
    'Supports hybrid network connections via Direct Connect, VPN, and VPC Peering.',
    'Inbound security group rules should restrict traffic strictly to required protocol ports.'
  ],
  commonMistake: 'Enabling `PubliclyAccessible: true` on production message brokers, exposing internal enterprise message queues to public internet scanners.',
  example: 'AWS CLI Creating a Private VPC Broker:\naws mq create-broker --broker-name PrivateProdBroker --engine-type RABBITMQ --engine-version 3.11.20 --host-instance-type mq.m5.large --deployment-mode CLUSTER_MULTI_AZ --publicly-accessible false --subnet-ids subnet-11111111 subnet-22222222 subnet-33333333 --security-groups sg-0123456789abcdef0',
  sources: [
    { title: 'Amazon MQ security in a VPC', url: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/amazon-mq-security-vpc.html' }
  ]
});
