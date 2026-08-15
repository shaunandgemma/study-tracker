import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-26',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'SQS vs Amazon MQ',
  status: 'ready',
  plainEnglish: 'Amazon SQS and Amazon MQ are managed message broker solutions for different cloud migration requirements:\n- Amazon SQS: Cloud-native, fully managed, serverless queuing service offering nearly unlimited scaling, zero infrastructure management, and simple REST API integration.\n- Amazon MQ: Managed message broker service for industry-standard messaging protocols (Apache ActiveMQ and RabbitMQ) designed for migrating legacy enterprise applications to AWS without rewriting messaging code.',
  whyItMatters: 'Migrating legacy enterprise systems that rely on JMS, AMQP, STOMP, or OpenWire protocols to AWS would require extensive code rewrites to use SQS. Amazon MQ allows lift-and-shift migration of legacy brokers.',
  workplaceExample: 'An enterprise migrates a legacy Java application that relies on JMS and ActiveMQ to AWS. Instead of rewriting the messaging layer to use SQS APIs, they deploy Amazon MQ for ActiveMQ, preserving existing code.',
  examFocus: 'SAA-C03 Decision Matrix (SQS vs Amazon MQ):\n- Cloud-Native New Applications -> Amazon SQS (Serverless, unlimited scaling, AWS API native).\n- Migration of Existing Legacy Applications -> Amazon MQ (Supports ActiveMQ / RabbitMQ, JMS, AMQP 0-9-1 / 1.0, STOMP, MQTT, OpenWire protocols).\n- Scaling & Management: SQS scales serverlessly; Amazon MQ provisions broker instances in Single-AZ or Active/Standby Multi-AZ configurations.',
  keyPoints: [
    'Amazon SQS is a serverless, cloud-native queuing service for modern applications.',
    'Amazon MQ is a managed message broker for open-source ActiveMQ and RabbitMQ engines.',
    'Amazon MQ supports industry protocols: JMS, AMQP, STOMP, MQTT, and OpenWire.',
    'Use Amazon MQ for lift-and-shift migration of legacy enterprise message brokers.',
    'Use Amazon SQS for new cloud-native microservices requiring serverless scaling.'
  ],
  commonMistake: 'Choosing SQS for migrating a legacy Java EE application that uses JMS API calls, forcing developers to rewrite the entire application messaging layer instead of using Amazon MQ.',
  example: 'Selection Decision Summary:\n- "Build new cloud-native microservice decoupling on AWS" -> Amazon SQS\n- "Migrate existing ActiveMQ / RabbitMQ application with JMS code to AWS" -> Amazon MQ',
  sources: [
    { title: 'Comparing Amazon SQS and Amazon MQ', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html' }
  ]
});
