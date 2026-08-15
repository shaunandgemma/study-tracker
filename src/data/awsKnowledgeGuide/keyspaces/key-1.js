import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-keyspaces",
  "topicTitle": "Amazon Keyspaces",
  "objectiveCode": "Databases",
  "status": "ready",
  "id": "key-1",
  "title": "Serverless Apache Cassandra API compatibility",
  "plainEnglish": "Amazon Keyspaces (for Apache Cassandra) is a serverless, managed database service that is compatible with the Apache Cassandra Query Language (CQL) API. It allows developers to run Cassandra workloads in the AWS cloud using the exact same open-source Cassandra client drivers, CQL syntax, and SDKs they already use, without provisioning, managing, patching, or scaling underlying Cassandra server nodes.",
  "whyItMatters": "Self-managed Apache Cassandra clusters require extensive operational overhead, including manual node provisioning, JVM garbage collection tuning, tombstone compaction, token ring rebalancing, and cluster repair routines. Amazon Keyspaces eliminates all server administration by providing a fully managed, serverless database that scales automatically to support millions of requests per second with single-digit millisecond latency.",
  "workplaceExample": "A global gaming company runs player inventory services on an on-premises 40-node Apache Cassandra cluster. To eliminate operational outages caused by manual node patching and compaction stalls, they migrate the application to Amazon Keyspaces by simply updating their Java Cassandra driver configuration with AWS endpoints and credentials, requiring zero application query code rewrites.",
  "examFocus": "Understand that Amazon Keyspaces is a serverless, wide-column NoSQL database compatible with Apache Cassandra CQL API. Recognize when to choose Keyspaces (existing Cassandra codebase/drivers requiring managed serverless scale) versus Amazon DynamoDB (AWS-native key-value/document store) or Amazon RDS (relational SQL with complex joins).",
  "keyPoints": [
    "Provides wire-level compatibility with Apache Cassandra CQL (Cassandra Query Language) 3.1.1 API specifications.",
    "Works with open-source Apache Cassandra 3.x and 4.x client drivers (Java, Python, Go, Node.js, C#, C++).",
    "Serverless architecture automatically provisions and scales read/write throughput and storage with zero server management.",
    "Data is automatically replicated three times across multiple Availability Zones in an AWS Region for high availability (99.99% SLA).",
    "Integrates natively with AWS services including AWS IAM for access control, AWS KMS for encryption, and Amazon CloudWatch for metrics.",
    "Supports both On-Demand capacity and Provisioned capacity modes with Application Auto Scaling."
  ],
  "commonMistake": "Assuming that Amazon Keyspaces supports every single Apache Cassandra configuration parameter, custom compaction strategy, and internal nodetool command. Keyspaces is an API-compatible managed service; server-level operations (like nodetool repair, custom garbage collection, and raw disk layouts) are managed entirely by AWS.",
  "example": "Connect to Amazon Keyspaces using standard cqlsh with TLS enabled: cqlsh cassandra.us-east-1.amazonaws.com 9142 -u 'ServiceUserName' -p 'ServicePassword' --ssl, then create a keyspace: CREATE KEYSPACE ecommerce WITH replication = {'class': 'SingleRegionStrategy'};.",
  "sources": [
    {
      "title": "What is Amazon Keyspaces (for Apache Cassandra)?",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/what-is-keyspaces.html"
    },
    {
      "title": "Apache Cassandra API Compatibility in Amazon Keyspaces",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/cassandra-apis.html"
    }
  ]
});
