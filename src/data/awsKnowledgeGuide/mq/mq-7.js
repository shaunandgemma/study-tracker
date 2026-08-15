import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mq-7',
  topicId: 'topic-mq',
  topicTitle: 'Amazon MQ',
  objectiveCode: 'Integration',
  title: 'Industry-Standard Messaging Protocols',
  status: 'ready',
  plainEnglish: 'Industry-Standard Messaging Protocols are open, non-proprietary wire-level specifications that define how applications format, transmit, and acknowledge messages over a network connection to a message broker. Amazon MQ supports a wide range of standard protocols—including JMS, AMQP 0-9-1, AMQP 1.0, STOMP, MQTT, OpenWire, and WebSockets.',
  whyItMatters: 'Proprietary cloud messaging APIs lock applications into a specific cloud vendor. Industry-standard protocols ensure cross-platform interoperability, allowing applications written in Java, Python, C++, C#, Node.js, and IoT firmware to communicate seamlessly across clouds and on-premises datacenters.',
  workplaceExample: 'An IoT fleet uses lightweight MQTT over TLS to publish sensor telemetry to an Amazon MQ broker. A backend Java service consumes the telemetry over AMQP 1.0, while a web dashboard monitors events over WebSockets.',
  examFocus: 'SAA-C03 Messaging Protocol Mapping:\n- JMS (Java Message Service): Standard Java messaging API (ActiveMQ).\n- AMQP 0-9-1: Advanced Message Queuing Protocol used natively by RabbitMQ.\n- AMQP 1.0: ISO standard inter-broker protocol (ActiveMQ).\n- STOMP: Simple text-oriented protocol for lightweight web clients.\n- MQTT: Ultra-lightweight publish-subscribe protocol for IoT devices.\n- OpenWire: High-speed native binary protocol for ActiveMQ.',
  keyPoints: [
    'Supports open, non-proprietary wire-level messaging standards.',
    'Prevents vendor lock-in by maintaining application protocol compatibility.',
    'Protocols include JMS, AMQP 0-9-1, AMQP 1.0, STOMP, MQTT, and OpenWire.',
    'Allows heterogeneous clients (Java, Python, C++, IoT, WebSockets) to interoperate.',
    'Enables secure encrypted wire transmission using TLS ports (e.g. 5671, 61617).'
  ],
  commonMistake: 'Attempting to use AMQP 0-9-1 on an ActiveMQ broker or OpenWire on a RabbitMQ broker. Check engine-specific protocol compatibility before connecting clients.',
  example: 'Protocol Port Mappings in Amazon MQ:\n- ActiveMQ OpenWire (SSL): Port 61617\n- ActiveMQ AMQP 1.0 (SSL): Port 5672\n- ActiveMQ / RabbitMQ STOMP (SSL): Port 61614\n- RabbitMQ AMQP 0-9-1 (SSL): Port 5671',
  sources: [
    { title: 'Connecting to Amazon MQ', url: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/connecting-to-amazon-mq.html' }
  ]
});
