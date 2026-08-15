import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mq-1',
  topicId: 'topic-mq',
  topicTitle: 'Amazon MQ',
  objectiveCode: 'Integration',
  title: 'Migration Path for Open-Source Legacy Message Queues (JMS, AMQP, STOMP, MQTT)',
  status: 'ready',
  plainEnglish: 'Amazon MQ provides a managed migration path for enterprise applications that rely on open-source message brokers like Apache ActiveMQ or RabbitMQ. Rather than rewriting application code to use AWS-native messaging services (like Amazon SQS or SNS), Amazon MQ allows you to lift-and-shift existing message broker workloads directly to AWS while preserving standard wire-level protocols (JMS, AMQP 0-9-1, AMQP 1.0, STOMP, MQTT, OpenWire).',
  whyItMatters: 'Rewriting legacy Java Enterprise (JEE) apps that use JMS or C++/Python apps using AMQP/STOMP to use proprietary SQS/SNS APIs requires months of code refactoring and regression testing. Amazon MQ allows lift-and-shift migration without changing messaging code.',
  workplaceExample: 'A banking platform uses a legacy Java application that relies on JMS (Java Message Service) with an on-premises ActiveMQ cluster. The team migrates the broker to Amazon MQ ActiveMQ, updating only the broker connection URL endpoints in their Spring configuration.',
  examFocus: 'SAA-C03 Core Concept for Amazon MQ Migration:\n- Migration Strategy: Rehost / Lift-and-Shift for message brokers requiring standard protocols.\n- Protocol Preservation: Preserves JMS, AMQP (0-9-1 & 1.0), STOMP, MQTT, and OpenWire.\n- Amazon MQ vs SQS/SNS: Choose Amazon MQ when migrating existing applications that rely on industry-standard messaging APIs; choose SQS/SNS for new cloud-native applications.',
  keyPoints: [
    'Managed message broker service for migrating Apache ActiveMQ and RabbitMQ workloads.',
    'Eliminates the need to rewrite application messaging code during cloud migration.',
    'Supports industry-standard wire protocols: JMS, AMQP 0-9-1, AMQP 1.0, STOMP, MQTT, OpenWire.',
    'Handles infrastructure provisioning, OS/broker patching, and high availability.',
    'Primary choice for legacy JEE, Spring, and open-source enterprise messaging lift-and-shift.'
  ],
  commonMistake: 'Assuming Amazon MQ automatically converts JMS messages into Amazon SQS queue messages. Amazon MQ is a managed broker hosting ActiveMQ/RabbitMQ engines, not an SQS translation layer.',
  example: 'Spring Boot Application JMS Connection URL Update:\n# Before (On-Premises ActiveMQ):\nspring.activemq.broker-url=tcp://activemq-onprem.internal:61616\n# After (Amazon MQ ActiveMQ):\nspring.activemq.broker-url=failover:(ssl://b-1234.mq.us-east-1.amazonaws.com:61617,ssl://b-5678.mq.us-east-1.amazonaws.com:61617)',
  sources: [
    { title: 'What is Amazon MQ?', url: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/welcome.html' }
  ]
});
