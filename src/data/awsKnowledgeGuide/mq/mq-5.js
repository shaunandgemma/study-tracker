import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mq-5',
  topicId: 'topic-mq',
  topicTitle: 'Amazon MQ',
  objectiveCode: 'Integration',
  title: 'RabbitMQ',
  status: 'ready',
  plainEnglish: 'RabbitMQ is a popular open-source message broker engine supported by Amazon MQ. Unlike ActiveMQ, RabbitMQ uses an Exchange-and-Binding architecture based on the AMQP 0-9-1 protocol. Producers publish messages to an Exchange, which routes messages to bound Queues based on Routing Keys and Exchange types (Direct, Fanout, Topic, Headers).',
  whyItMatters: 'Polyglot environments (Python, Node.js, Go, Ruby, C#) widely use RabbitMQ for high-throughput message routing. Amazon MQ for RabbitMQ provides fully managed 3-AZ cluster deployments with quorum queues.',
  workplaceExample: 'A rideshare app publishes location updates to a RabbitMQ Topic Exchange (`app.locations`). The exchange routes messages to a `BillingQueue` using routing key `trip.completed` and to an `AnalyticsQueue` using routing key `trip.*`.',
  examFocus: 'SAA-C03 RabbitMQ Core Architecture:\n- Supported Protocols: AMQP 0-9-1, STOMP, MQTT, WebSockets.\n- Core Components: Exchanges (Direct, Fanout, Topic, Headers), Bindings, Routing Keys, Queues, Virtual Hosts (vhosts).\n- High Availability Mode: 3-AZ Cluster deployment using Quorum Queues (replicated raft-based queues).\n- Storage: EBS-backed storage managed per cluster node.',
  keyPoints: [
    'Managed RabbitMQ broker engine based on AMQP 0-9-1 exchange/queue routing.',
    'Exchanges route messages to Queues via Routing Keys and Bindings.',
    'Exchange Types: Direct, Fanout, Topic, and Headers.',
    'High Availability: 3-AZ Cluster deployment utilizing Quorum Queues for high durability.',
    'Native support for Virtual Hosts (vhosts) for multi-tenant queue isolation.'
  ],
  commonMistake: 'Attempting to send messages directly to a RabbitMQ Queue without specifying an Exchange or using the default empty exchange string.',
  example: 'RabbitMQ Pika Python Publisher Example:\nimport pika\nconnection = pika.BlockingConnection(pika.URLParameters("amqps://user:pass@b-1234.mq.us-east-1.amazonaws.com:5671/vhost"))\nchannel = connection.channel()\nchannel.basic_publish(exchange="orders_exchange", routing_key="orders.new", body="OrderData")',
  sources: [
    { title: 'RabbitMQ broker architecture', url: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/rabbitmq-architecture.html' }
  ]
});
