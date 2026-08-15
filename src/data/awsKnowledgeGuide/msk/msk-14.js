import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-msk",
  "topicTitle": "Amazon MSK (Managed Streaming for Apache Kafka)",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "msk-14",
  "title": "IAM Access Control",
  "plainEnglish": "IAM Access Control (SASL/IAM) in Amazon MSK is a feature that allows you to authenticate and authorize Apache Kafka clients using AWS Identity and Access Management (IAM) policies. Instead of managing separate database usernames, passwords, or X.509 certificates for Kafka, clients use standard AWS IAM roles, temporary credentials (AWS STS), and AWS Signature Version 4 (SigV4) to authenticate securely with MSK brokers over port 9098.",
  "whyItMatters": "Managing independent Kafka access control lists (ACLs), rotating SASL/SCRAM passwords in secrets managers, and issuing client certificates creates heavy administrative overhead. IAM access control centralizes streaming security within AWS IAM, enabling passwordless authentication for AWS Lambda execution roles, EC2 instance profiles, and ECS task roles with fine-grained topic and group permissions.",
  "workplaceExample": "An order-processing microservice deployed on Amazon ECS needs to write records to an MSK topic named `customer-orders`. The DevOps team attaches an open-source AWS MSK IAM auth library to their Java Kafka producer client and assigns an IAM task role to the ECS container. The IAM policy grants `kafka-cluster:Connect` and `kafka-cluster:WriteData` strictly on the `customer-orders` topic ARN, eliminating hardcoded passwords completely.",
  "examFocus": "Understand MSK IAM Access Control actions and resource ARNs: (1) Authentication uses SASL/OAUTHBEARER with the AWS SigV4 signing library over TLS port 9098. (2) Key IAM Actions: `kafka-cluster:Connect`, `kafka-cluster:DescribeCluster`, `kafka-cluster:CreateTopic`, `kafka-cluster:WriteData`, `kafka-cluster:ReadData`, `kafka-cluster:AlterGroup`. (3) Supported on both MSK Provisioned and MSK Serverless (MSK Serverless uses IAM exclusively).",
  "keyPoints": [
    "Uses AWS IAM for centralized authentication and authorization using AWS Signature Version 4 (SigV4).",
    "Clients connect over TLS on dedicated port 9098 using the open-source AWS MSK IAM auth library.",
    "Eliminates hardcoded passwords, static credentials, and manual client certificate management.",
    "Enables passwordless authentication for IAM Roles (Lambda Execution Roles, EC2 Instance Profiles, ECS Task Roles).",
    "Provides fine-grained IAM resource-level permissions on clusters, topics, and consumer groups.",
    "Mandatory authentication mechanism for Amazon MSK Serverless clusters."
  ],
  "commonMistake": "Attempting to use standard AWS IAM access keys and secret keys directly in Kafka SASL/PLAIN username and password fields. MSK IAM authentication requires the official AWS MSK IAM auth callback handler library (`aws-msk-iam-auth`) in the client application classpath.",
  "example": "Attach an IAM policy granting read/write access to a specific Kafka topic: {\"Version\": \"2012-10-17\", \"Statement\": [{\"Effect\": \"Allow\", \"Action\": [\"kafka-cluster:Connect\", \"kafka-cluster:WriteData\", \"kafka-cluster:ReadData\"], \"Resource\": \"arn:aws:kafka:us-east-1:123456789012:topic/prod-cluster/abcd/orders\"}]}.",
  "sources": [
    {
      "title": "IAM Access Control for Amazon MSK",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/iam-access-control.html"
    },
    {
      "title": "Configuring Clients for IAM Access Control in Amazon MSK",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/iam-access-control-clients.html"
    }
  ]
});
