import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mq-4',
  topicId: 'topic-mq',
  topicTitle: 'Amazon MQ',
  objectiveCode: 'Integration',
  title: 'Apache ActiveMQ',
  status: 'ready',
  plainEnglish: 'Apache ActiveMQ is one of the two managed message broker engines supported by Amazon MQ. ActiveMQ is a traditional Java-based enterprise message broker that supports standard messaging paradigms including Point-to-Point (Queues) and Publish-and-Subscribe (Topics), along with enterprise features like Durable Subscriptions, Virtual Topics, and JMS 1.1 / 2.0 APIs.',
  whyItMatters: 'Java Enterprise Edition (JEE) applications rely heavily on Java Message Service (JMS) features like transactions, message selectors, and durable subscribers. Amazon MQ for ActiveMQ provides a 100% compatible environment for these legacy Java systems.',
  workplaceExample: 'A logistics company runs a legacy Java application that publishes tracking updates to an ActiveMQ Virtual Topic (`VirtualTopic.Orders`). Multiple microservices subscribe via Queue consumer endpoints (`Consumer.PaymentService.VirtualTopic.Orders`), receiving isolated copies of each order message.',
  examFocus: 'SAA-C03 Apache ActiveMQ Core Characteristics:\n- Supported Protocols: JMS 1.1/2.0, OpenWire, AMQP 1.0, STOMP, MQTT, WebSocket.\n- High Availability Mode: Active/Standby deployment across 2 Availability Zones backed by shared AWS EFS storage.\n- Configurations: Customized via XML configuration files (e.g. `activemq.xml`).\n- Destinations: Standard Queues, Topics, Durable Subscriptions, and Virtual Topics.',
  keyPoints: [
    'Managed ActiveMQ engine supporting JEE and Java Message Service (JMS) standards.',
    'Supports Point-to-Point (Queues) and Publish-Subscribe (Topics / Durable Subscriptions).',
    'Wire Protocols: OpenWire, AMQP 1.0, STOMP, MQTT, and WebSockets.',
    'High Availability: Active/Standby deployment spanning 2 AZs backed by shared Amazon EFS.',
    'Configured using ActiveMQ XML configuration templates in Amazon MQ.'
  ],
  commonMistake: 'Attempting to configure RabbitMQ-specific features (such as Exchanges, Bindings, or Routing Keys) on an Amazon MQ ActiveMQ broker. ActiveMQ uses Queues and Topics.',
  example: 'ActiveMQ Failover Connection String for Java JMS Clients:\nString brokerUrl = "failover:(ssl://b-1234a.mq.us-east-1.amazonaws.com:61617,ssl://b-1234b.mq.us-east-1.amazonaws.com:61617)?randomize=false";',
  sources: [
    { title: 'ActiveMQ broker architecture', url: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/activemq-architecture.html' }
  ]
});
