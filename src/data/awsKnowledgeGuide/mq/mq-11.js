import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mq-11',
  topicId: 'topic-mq',
  topicTitle: 'Amazon MQ',
  objectiveCode: 'Integration',
  title: 'Encryption in Transit and at Rest',
  status: 'ready',
  plainEnglish: 'Amazon MQ provides end-to-end security through Encryption in Transit and Encryption at Rest:\n- Encryption in Transit: All client connections to Amazon MQ endpoints use TLS/SSL encryption by default (e.g. AMQPS over port 5671, OpenWire over SSL 61617, STOMP over SSL 61614).\n- Encryption at Rest: All stored messages, queue states, and logs are automatically encrypted on underlying storage (EFS or EBS) using AWS Key Management Service (KMS).',
  whyItMatters: 'Financial and healthcare compliance standards (PCI-DSS, HIPAA) mandate protecting sensitive messages both when traversing network links and when written to persistent disk storage.',
  workplaceExample: 'A HIPAA-compliant medical app configures Amazon MQ to use a Customer Managed KMS Key (`alias/mq-phi-key`) for Encryption at Rest. All client connections use TLS 1.2 (`amqps://`) with credentials retrieved securely from AWS Secrets Manager.',
  examFocus: 'SAA-C03 Security Specifications:\n- Encryption at Rest: Enabled by default using AWS Managed KMS Keys (`aws/mq`) or Customer Managed KMS Keys.\n- Encryption in Transit: Enforced using TLS/SSL wire protocols (AMQPS, OpenWire over SSL, HTTPS).\n- Credentials: Store broker usernames and passwords in AWS Secrets Manager; never hardcode credentials in app code.\n- Compliance: FIPS 140-2 validated cryptographic modules available for compliant endpoints.',
  keyPoints: [
    'Provides complete end-to-end message security for enterprise compliance.',
    'Encryption at Rest uses AWS KMS (AWS Managed or Customer Managed Keys).',
    'Encryption in Transit enforces TLS/SSL wire protocols for all client connections.',
    'Integrates natively with AWS Secrets Manager for secure broker credential storage.',
    'FIPS 140-2 validated endpoints available for government/regulated workloads.'
  ],
  commonMistake: 'Attempting to connect to an Amazon MQ broker using unencrypted plain TCP ports in production, resulting in connection rejection or security compliance violations.',
  example: 'Python AMQP over TLS Connection URL:\namqps://username:password@b-1234a.mq.us-east-1.amazonaws.com:5671/vhost',
  sources: [
    { title: 'Amazon MQ security in transit', url: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/amazon-mq-security-in-transit.html' }
  ]
});
