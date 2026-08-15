import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mq-2',
  topicId: 'topic-mq',
  topicTitle: 'Amazon MQ',
  objectiveCode: 'Integration',
  title: 'ActiveMQ High Availability Active/Standby Broker Architecture',
  status: 'ready',
  plainEnglish: 'Amazon MQ ActiveMQ Active/Standby High Availability is a multi-AZ deployment architecture for Apache ActiveMQ brokers. It consists of two broker instances deployed in two different Availability Zones attached to shared, highly available Amazon EFS storage:\n- Active Broker: Handles all client connections and message processing.\n- Standby Broker: Runs synchronously in a passive state, maintaining a shared lock on EFS storage. If the active broker fails, the standby broker automatically takes over the lock and becomes active.',
  whyItMatters: 'Single-instance brokers represent a single point of failure. Active/Standby deployment guarantees automatic failover across Availability Zones with zero message data loss because messages are stored safely on multi-AZ Amazon EFS.',
  workplaceExample: 'An enterprise deploys an ActiveMQ Active/Standby broker (`AZ-1` active, `AZ-2` standby). When an AZ-1 power outage occurs, AWS detects the failure, transfers the EFS lock to AZ-2, and updates DNS. Client applications using the failover connection string automatically reconnect to the standby broker in AZ-2 within seconds.',
  examFocus: 'SAA-C03 Active/Standby HA Architecture Mechanics:\n- Shared Storage: Backed by Amazon EFS (Elastic File System) spanning multiple AZs.\n- Passive Standby: The standby broker instance does NOT accept connections while in standby mode.\n- Storage Lock: Active broker holds exclusive lock on EFS storage; failover releases lock to standby.\n- Client Failover Syntax: Clients MUST use failover connection URLs containing BOTH broker endpoint URLs.',
  keyPoints: [
    'Multi-AZ High Availability deployment mode for Apache ActiveMQ brokers.',
    'Consists of 1 Active broker and 1 Passive Standby broker in separate AZs.',
    'Backed by shared multi-AZ Amazon EFS storage for zero data loss.',
    'Active broker holds exclusive lock on EFS; standby takes over lock during failover.',
    'Client applications require failover transport connection URLs containing both endpoints.'
  ],
  commonMistake: 'Configuring a single broker endpoint URL in application client code, preventing automatic client failover when the Active broker switches Availability Zones.',
  example: 'ActiveMQ Failover Connection String Example:\nfailover:(ssl://b-1234a.mq.us-east-1.amazonaws.com:61617,ssl://b-1234b.mq.us-east-1.amazonaws.com:61617)?randomize=false&priorityBackup=true',
  sources: [
    { title: 'ActiveMQ Active/Standby deployment mode', url: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/activemq-architecture.html#activemq-active-standby' }
  ]
});
