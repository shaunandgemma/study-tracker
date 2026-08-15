import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mq-3',
  topicId: 'topic-mq',
  topicTitle: 'Amazon MQ',
  objectiveCode: 'Integration',
  title: 'Amazon MQ Managed Message Broker',
  status: 'ready',
  plainEnglish: 'Amazon MQ is a managed message broker service for Apache ActiveMQ and RabbitMQ that handles administrative overhead like hardware provisioning, broker setup, software patching, storage management, and high-availability failover. It provides managed endpoints for client connections while giving you control over broker configurations, queues, topics, and user authorizations.',
  whyItMatters: 'Self-managing message brokers requires handling OS security patches, disk space alerts, cluster failover testing, and SSL certificate management. Amazon MQ offloads these operational burdens to AWS.',
  workplaceExample: 'An e-commerce firm uses Amazon MQ to manage their order processing broker. AWS automatically applies minor engine patches during scheduled maintenance windows, monitors disk storage health via CloudWatch, and manages broker failover across Availability Zones.',
  examFocus: 'SAA-C03 Managed Broker Architecture:\n- Supported Engines: Apache ActiveMQ and RabbitMQ.\n- Single-Instance vs Multi-AZ: Single-instance for development/testing; Multi-AZ Active/Standby (ActiveMQ) or 3-AZ Clusters (RabbitMQ) for production HA.\n- Maintenance Windows: Automatic minor version upgrades during user-defined maintenance windows.\n- Monitoring: Native CloudWatch integration for queue depth, memory, CPU, and connection metrics.',
  keyPoints: [
    'Managed messaging service supporting Apache ActiveMQ and RabbitMQ engines.',
    'Automates broker provisioning, operating system patching, and storage management.',
    'Offers Single-Instance and Multi-AZ High Availability deployment modes.',
    'Integrates natively with CloudWatch, CloudTrail, AWS KMS, and IAM.',
    'Provides direct access to native web consoles (ActiveMQ Web Console / RabbitMQ Management).'
  ],
  commonMistake: 'Treating Amazon MQ as a serverless queue with infinite auto-scaling. Amazon MQ brokers run on specific EC2 instance types (`mq.m5.large`) with finite CPU, memory, and connection limits.',
  example: 'Creating a Managed ActiveMQ Broker via AWS CLI:\naws mq create-broker --broker-name ProductionOrderBroker --engine-type ACTIVEMQ --engine-version 5.17.6 --host-instance-type mq.m5.large --deployment-mode ACTIVE_STANDBY_MULTI_AZ --publicly-accessible false',
  sources: [
    { title: 'Amazon MQ broker architecture', url: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/amazon-mq-broker-architecture.html' }
  ]
});
