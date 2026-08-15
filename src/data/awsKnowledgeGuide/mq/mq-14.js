import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mq-14',
  topicId: 'topic-mq',
  topicTitle: 'Amazon MQ',
  objectiveCode: 'Integration',
  title: 'Amazon MQ vs Amazon SNS',
  status: 'ready',
  plainEnglish: 'Amazon MQ Topics and Amazon SNS (Simple Notification Service) are both publish-and-subscribe messaging solutions on AWS, but they cater to different integration models:\n- Amazon MQ Topics / Exchanges: Managed broker pub/sub messaging supporting industry-standard wire protocols (JMS Topics, MQTT, RabbitMQ Fanout/Topic Exchanges) for enterprise broker clients.\n- Amazon SNS: Serverless push-notification fan-out service that delivers messages via HTTP/S, SQS queues, Lambda functions, SMS, and Mobile Push Notifications with infinite scaling.',
  whyItMatters: 'Using Amazon MQ for pub/sub is essential when legacy enterprise clients or IoT devices publish over JMS/MQTT protocols. Using Amazon SNS is ideal for cloud-native fan-out to SQS queues, Lambda functions, or mobile push notifications.',
  workplaceExample: 'An enterprise publishes core order events. Legacy Java apps subscribe to an Amazon MQ ActiveMQ Virtual Topic via JMS. Modern cloud applications subscribe via Amazon SNS fan-out, delivering JSON payloads directly to multiple SQS queues and Lambda processing functions.',
  examFocus: 'SAA-C03 Decision Matrix (Amazon MQ vs SNS):\n- Protocol & Legacy API: Standard JMS Topics, MQTT, or AMQP Topic Exchanges? -> Choose Amazon MQ.\n- AWS Native Fan-Out: Fan out messages to SQS queues, AWS Lambda, Email, SMS, Mobile Push? -> Choose Amazon SNS.\n- Scaling & Management: Amazon SNS is serverless with zero broker provisioning; Amazon MQ runs on provisioned broker instances.',
  keyPoints: [
    'Amazon MQ Topics support open protocols (JMS Topics, MQTT, AMQP Topic Exchanges).',
    'Amazon SNS is a serverless push notification service for AWS-native fan-out.',
    'Use Amazon MQ when legacy or IoT applications require standard broker wire protocols.',
    'Use Amazon SNS to push messages to SQS queues, Lambda functions, SMS, and HTTPS endpoints.',
    'Amazon SNS scales automatically with zero server management; Amazon MQ runs on broker instances.'
  ],
  commonMistake: 'Using Amazon MQ to send SMS mobile push notifications to end-user smartphones. Amazon SNS is the dedicated service for SMS and mobile push notifications.',
  example: 'Comparison Summary:\n- MQTT IoT Sensors -> Amazon MQ (MQTT Protocol)\n- JMS Virtual Topic to Java Subscribers -> Amazon MQ (ActiveMQ)\n- Fan-Out Order Events to 5 SQS Queues + Lambda -> Amazon SNS',
  sources: [
    { title: 'Amazon MQ messaging patterns', url: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/welcome.html' }
  ]
});
