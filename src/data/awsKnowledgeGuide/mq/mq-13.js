import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mq-13',
  topicId: 'topic-mq',
  topicTitle: 'Amazon MQ',
  objectiveCode: 'Integration',
  title: 'Amazon MQ vs Amazon SQS',
  status: 'ready',
  plainEnglish: 'Amazon MQ and Amazon SQS (Simple Queue Service) are both message queueing services on AWS, but they target fundamentally different architectural use cases:\n- Amazon MQ: A managed message broker for open-source engines (ActiveMQ, RabbitMQ) supporting standard wire protocols (JMS, AMQP, STOMP, MQTT). Best for lift-and-shift migration of legacy enterprise apps.\n- Amazon SQS: A serverless, cloud-native queue service with infinite automatic scaling, zero server management, and simple AWS API access. Best for new cloud-native microservice architectures.',
  whyItMatters: 'Choosing between Amazon MQ and SQS depends on whether you are migrating an existing application or building a new cloud-native app. Choosing SQS for legacy JEE apps forces code rewrites; choosing Amazon MQ for simple serverless apps adds unnecessary broker instance management.',
  workplaceExample: 'An enterprise uses Amazon MQ ActiveMQ to lift-and-shift their legacy Java EE monolith to EC2 without rewriting JMS code. Simultaneously, their new serverless Lambda microservices use Amazon SQS for queueing, benefiting from serverless auto-scaling and zero instance management.',
  examFocus: 'SAA-C03 Decision Matrix (Amazon MQ vs SQS):\n- Protocol Requirement: Standard protocols (JMS, AMQP 0-9-1/1.0, STOMP, MQTT, OpenWire)? -> Choose Amazon MQ.\n- Architectural Model: Serverless, infinite auto-scaling, pay-per-request, HTTP API? -> Choose Amazon SQS.\n- Maintenance: Amazon MQ runs on provisioned broker instances (`mq.m5.large`); SQS is completely serverless.',
  keyPoints: [
    'Amazon MQ is for managed open-source brokers (ActiveMQ/RabbitMQ) with standard wire protocols.',
    'Amazon SQS is a serverless, highly scalable cloud-native queueing service.',
    'Use Amazon MQ when lifting-and-shifting legacy applications requiring JMS/AMQP/STOMP.',
    'Use Amazon SQS for new cloud-native microservices and serverless architectures.',
    'Amazon MQ requires provisioning broker instance types; SQS scales automatically per request.'
  ],
  commonMistake: 'Selecting Amazon MQ for a brand-new serverless AWS Lambda microservice project when Amazon SQS offers serverless auto-scaling and lower cost with zero broker management.',
  example: 'Comparison Summary:\n- Legacy Java App with JMS -> Amazon MQ (ActiveMQ)\n- Python App using AMQP 0-9-1 Exchange Bindings -> Amazon MQ (RabbitMQ)\n- AWS Lambda Serverless Microservice Queue -> Amazon SQS',
  sources: [
    { title: 'Amazon MQ vs Amazon SQS', url: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/welcome.html' }
  ]
});
