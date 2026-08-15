import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mq-8',
  topicId: 'topic-mq',
  topicTitle: 'Amazon MQ',
  objectiveCode: 'Integration',
  title: 'ActiveMQ Active-Standby High Availability',
  status: 'ready',
  plainEnglish: 'ActiveMQ Active-Standby High Availability focuses on the operational failover and client reconnection behavior when an ActiveMQ broker transitions from Active to Standby state. During a failover event (triggered by hardware failure, AZ outage, or maintenance), the active broker drops connections, the passive broker acquires the shared storage lock, and clients reconnect automatically via their failover transport configuration.',
  whyItMatters: 'Understanding failover mechanics ensures that application developers build resilient, self-healing message producers and consumers that tolerate temporary network disconnections without dropping messages or crashing.',
  workplaceExample: 'During a scheduled AWS maintenance reboot, the ActiveMQ Active broker in `us-west-2a` reboots. The ActiveMQ client SDK receives a socket disconnect, waits 2 seconds, and automatically connects to the Standby broker in `us-west-2b`. Producers resume sending messages seamlessly.',
  examFocus: 'SAA-C03 Operational Failover Rules:\n- Failover Time: Typically takes 15 to 30 seconds for storage lock transfer and broker startup.\n- In-Flight Transactions: Uncommitted transactions in flight during failover are rolled back; clients must retry unacknowledged messages.\n- Idempotency: Consumers must be designed idempotently to handle potential duplicate message redelivery after failover reconnect.\n- CloudWatch Alerts: Monitor `HostHealth` and `BrokerState` metrics to track failover events.',
  keyPoints: [
    'Operational failover mechanism for Amazon MQ ActiveMQ Active/Standby brokers.',
    'Failover duration is typically 15 to 30 seconds for EFS lock acquisition.',
    'Uncommitted in-flight transactions are rolled back during failover.',
    'Client applications require failover connection URLs and automatic reconnect logic.',
    'Consumers must be designed to be idempotent to handle message redelivery.'
  ],
  commonMistake: 'Designing message consumers that assume exactly-once processing during a broker failover event. Always build consumers to tolerate duplicate redelivery.',
  example: 'Java ActiveMQ ConnectionFactory Failover Configuration:\nActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory("failover:(ssl://b-1a.mq.us-east-1.amazonaws.com:61617,ssl://b-1b.mq.us-east-1.amazonaws.com:61617)?initialReconnectDelay=100&maxReconnectAttempts=10");',
  sources: [
    { title: 'ActiveMQ High Availability Failover', url: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/activemq-architecture.html' }
  ]
});
