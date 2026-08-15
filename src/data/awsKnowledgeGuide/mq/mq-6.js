import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mq-6',
  topicId: 'topic-mq',
  topicTitle: 'Amazon MQ',
  objectiveCode: 'Integration',
  title: 'Migration of Existing Message Broker Applications',
  status: 'ready',
  plainEnglish: 'Migration of Existing Message Broker Applications to Amazon MQ follows a structured workflow to transition on-premises ActiveMQ or RabbitMQ brokers to managed AWS infrastructure without rewriting application code. The migration process involves inventorying existing queues/topics, exporting broker configurations, provisioning target Amazon MQ brokers in private VPC subnets, updating client connection URLs, and performing cutover testing.',
  whyItMatters: 'Migrating self-managed message brokers to Amazon MQ eliminates hardware maintenance, manual patching, and storage management while maintaining 100% protocol and API compatibility with existing applications.',
  workplaceExample: 'An enterprise migrates a self-hosted 10-node RabbitMQ cluster to Amazon MQ. They export Virtual Host definitions (`definitions.json`), create an Amazon MQ RabbitMQ cluster, import definitions via RabbitMQ Management API, update app connection strings to use the new endpoints, and perform cutover during a planned maintenance window.',
  examFocus: 'SAA-C03 12-Step Migration Workflow:\n1. Inventory engine versions, destinations, users, and wire protocols.\n2. Design target VPC subnets, security groups, and KMS keys.\n3. Provision non-production Amazon MQ broker.\n4. Export/Import broker configurations (`activemq.xml` or RabbitMQ `definitions.json`).\n5. Store credentials in AWS Secrets Manager.\n6. Update client connection strings to failover endpoints.\n7. Validate failover, throughput, and error handling.\n8. Cutover to production Amazon MQ broker.',
  keyPoints: [
    'Structured migration path for self-managed ActiveMQ and RabbitMQ brokers.',
    'Preserves existing client code, SDKs, and wire-level messaging protocols.',
    'ActiveMQ config imported via XML; RabbitMQ config imported via definitions JSON.',
    'Client connection strings updated to point to high-availability failover endpoints.',
    'Eliminates self-managed broker operational overhead post-migration.'
  ],
  commonMistake: 'Attempting to perform a live migration without testing failover reconnection and consumer prefetch settings in a staging environment first.',
  example: 'Importing RabbitMQ Definitions via AWS CLI:\ncurl -i -u "admin:password" -H "Content-Type: application/json" -X POST https://b-1234.mq.us-east-1.amazonaws.com:15671/api/definitions -d @definitions.json',
  sources: [
    { title: 'Migrating to Amazon MQ', url: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/amazon-mq-migrating.html' }
  ]
});
