import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-msk",
  "topicTitle": "Amazon MSK (Managed Streaming for Apache Kafka)",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "msk-12",
  "title": "TLS Encryption",
  "plainEnglish": "TLS Encryption in Amazon MSK protects streaming data in transit across two distinct network paths: (1) Inter-broker encryption (encrypting internal replication traffic traveling between Kafka brokers within the cluster using TLS 1.2+), and (2) Client-broker encryption (encrypting traffic traveling between producer/consumer client applications and the MSK brokers). MSK also supports Mutual TLS (mTLS) for certificate-based client authentication.",
  "whyItMatters": "Unencrypted network traffic exposes sensitive streaming payloads, financial transactions, and login tokens to packet sniffing or man-in-the-middle attacks. Enforcing TLS in transit ensures end-to-end data confidentiality, satisfies strict compliance frameworks (such as PCI DSS and HIPAA), and authenticates client identities cryptographically.",
  "workplaceExample": "A healthcare analytics platform configures an MSK cluster with client-broker encryption set to `TLS` only and inter-broker encryption enabled. They issue client certificates from an AWS Certificate Manager Private Certificate Authority (ACM Private CA) and configure mutual TLS (mTLS) authentication. When a patient vitals ingestion service connects, it presents its TLS certificate to port 9094 to authenticate securely and encrypt all streaming health metrics.",
  "examFocus": "Understand MSK in-transit encryption options and ports: (1) Inter-broker: Always encrypted by default using TLS. (2) Client-Broker: Configurable as `TLS`, `PLAINTEXT`, or `TLS_PLAINTEXT` (supports both). (3) Standard Port mappings: Port 9092 = Plaintext, Port 9094 = TLS / mTLS, Port 9096 = SASL/SCRAM over TLS, Port 9098 = IAM over TLS. (4) Mutual TLS (mTLS) requires an ACM Private CA.",
  "keyPoints": [
    "Protects data in transit across internal inter-broker replication and external client-to-broker traffic.",
    "Inter-broker encryption uses TLS 1.2+ encryption automatically between brokers.",
    "Client-broker communication can be configured for TLS only, Plaintext only, or TLS_PLAINTEXT.",
    "Supports Mutual TLS (mTLS) authentication for client identity verification using AWS Certificate Manager Private CA.",
    "Dedicated broker ports correspond to specific encryption and auth modes (9092: Plaintext, 9094: TLS/mTLS, 9096: SASL/SCRAM, 9098: IAM).",
    "Clients must configure Java truststore/keystore SSL properties (`ssl.truststore.location`, `security.protocol=SSL`) to connect via TLS."
  ],
  "commonMistake": "Connecting to the plaintext port (9092) when client-broker encryption is configured for 'TLS only'. If TLS is enforced, plaintext connection attempts will immediately fail with connection reset or SSL handshake errors.",
  "example": "Retrieve the TLS-encrypted bootstrap broker endpoints using the AWS CLI: aws kafka get-bootstrap-brokers --cluster-arn arn:aws:kafka:us-east-1:123456789012:cluster/secure-cluster/abcd, which returns endpoints formatted with port 9094 (TLS) or 9098 (IAM).",
  "sources": [
    {
      "title": "Amazon MSK Encryption in Transit",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/msk-encryption.html#in-transit-encryption"
    },
    {
      "title": "Mutual TLS Authentication in Amazon MSK",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/msk-authentication.html#msk-mtls"
    }
  ]
});
