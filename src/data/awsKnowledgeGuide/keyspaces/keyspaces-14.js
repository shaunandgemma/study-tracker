import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-keyspaces",
  "topicTitle": "Amazon Keyspaces",
  "objectiveCode": "Databases",
  "status": "ready",
  "id": "keyspaces-14",
  "title": "Keyspaces IAM Authentication and Authorization",
  "plainEnglish": "Amazon Keyspaces integrates with AWS Identity and Access Management (IAM) to manage authentication and authorization. It supports two primary authentication methods: (1) Service-Specific Credentials (a generated username and password associated with an IAM user, passed via standard open-source Cassandra drivers), and (2) AWS SigV4 Authentication Plugins (allowing applications to authenticate using IAM roles, EC2 instance profiles, or ECS/EKS task roles without static credentials).",
  "whyItMatters": "Traditional Apache Cassandra uses internal database user tables and passwords that must be managed, rotated, and synchronized across clusters independently of cloud infrastructure. IAM integration unifies database security with your corporate AWS security policies, enforcing least-privilege permissions, tag-based access control, and temporary role assumption without hardcoded database passwords.",
  "workplaceExample": "A microservice deployed on Amazon ECS needs to read and write to an Amazon Keyspaces customer table. The engineering team attaches an AWS SigV4 authentication plugin to their Java Cassandra driver and assigns an IAM Task Role to the ECS task definition. The application authenticates seamlessly using temporary AWS credentials without storing database usernames or passwords anywhere in configuration files.",
  "examFocus": "Understand the two authentication methods for Keyspaces: (1) Service-Specific Credentials: Generates a dedicated Cassandra username/password under an IAM user, ideal for legacy Cassandra applications without code changes. (2) SigV4 Authentication Plugin: Uses IAM roles, temporary credentials, and Signature Version 4 signing, ideal for native AWS workloads. IAM policies can grant fine-grained permissions down to specific keyspaces and tables (e.g., cassandra:Select, cassandra:Modify).",
  "keyPoints": [
    "Supports Service-Specific Credentials (generated username and password attached to an IAM user for standard driver authentication).",
    "Supports AWS SigV4 Authentication Plugins for open-source Cassandra drivers (Java, Python, Go, Node.js), enabling passwordless authentication via IAM Roles.",
    "IAM action permissions include cassandra:Create, cassandra:Alter, cassandra:Drop, cassandra:Select, cassandra:Modify, and cassandra:TagResource.",
    "Enables resource-level permissions (e.g., arn:aws:cassandra:us-east-1:123456789012:/keyspace/mykeyspace/table/mytable).",
    "Supports Condition keys including aws:PrincipalTag, cassandra:TagKeys, and aws:SourceVpc to enforce network and attribute-based access control.",
    "All authentication requests require TLS encryption in transit over TCP port 9142."
  ],
  "commonMistake": "Attempting to log into Amazon Keyspaces using standard AWS IAM access keys and secret access keys directly in standard Cassandra username/password fields. Standard Cassandra drivers require either generated Service-Specific Credentials or the AWS SigV4 authentication plugin.",
  "example": "Attach an IAM policy granting read-only access to a specific table: {\"Effect\": \"Allow\", \"Action\": [\"cassandra:Select\"], \"Resource\": \"arn:aws:cassandra:us-east-1:123456789012:/keyspace/analytics/table/daily_metrics\"}.",
  "sources": [
    {
      "title": "Authentication and Access Control for Amazon Keyspaces",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/access-control.html"
    },
    {
      "title": "Creating Service-Specific Credentials for Amazon Keyspaces",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/programmatic.credentials.html"
    }
  ]
});
