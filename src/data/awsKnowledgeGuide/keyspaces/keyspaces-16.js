import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-keyspaces",
  "topicTitle": "Amazon Keyspaces",
  "objectiveCode": "Databases",
  "status": "ready",
  "id": "keyspaces-16",
  "title": "Keyspaces Use Cases for Cassandra Workloads",
  "plainEnglish": "Amazon Keyspaces is purpose-built for applications that require high-throughput, low-latency write and read operations on wide-column datasets without the administrative burden of running self-managed Apache Cassandra clusters. Ideal use cases include time-series telemetry, IoT device logging, online retail shopping carts, messaging chat history, recommendation engines, and seamless cloud migration of existing Cassandra applications.",
  "whyItMatters": "Selecting the right database engine for high-scale NoSQL workloads determines system reliability and developer velocity. While Amazon DynamoDB is the preferred choice for greenfield AWS-native key-value applications, Amazon Keyspaces is the premier solution when organizations have existing investments in Apache Cassandra CQL code, third-party Cassandra tools, or wide-column data models and want a fully serverless AWS experience.",
  "workplaceExample": "A smart-energy grid operator collects electricity consumption metrics every 10 seconds from 5 million smart meters. Using Amazon Keyspaces, they ingest 500,000 writes per second into a time-series table partitioned by meter_id and date. The serverless engine automatically absorbs peak morning surges, replicates data across three AZs, and uses TTL to purge 90-day-old raw metrics after daily rollups are generated.",
  "examFocus": "Compare database selection criteria for AWS certification exams: (1) Amazon Keyspaces: Choose when the requirement specifically mentions Apache Cassandra, CQL, wide-column data modeling, or migrating existing Cassandra clusters to serverless. (2) Amazon DynamoDB: Choose for native AWS key-value/document workloads, single-digit millisecond latency, Global Tables, and DynamoDB Streams. (3) Amazon RDS/Aurora: Choose for relational SQL data requiring complex multi-table joins and ACID transactions across multiple entities.",
  "keyPoints": [
    "Ideal for migrating existing Apache Cassandra applications to AWS with zero or minimal application code changes.",
    "Optimal for high-throughput write workloads including IoT telemetry, time-series metrics, clickstream analysis, and event logging.",
    "Excels at high-concurrency read/write applications like user profiles, shopping carts, session stores, and gaming state.",
    "Eliminates complex Cassandra cluster operations (token ring rebalancing, compaction, node recovery, disk scaling).",
    "Provides seamless serverless scaling, pay-per-request On-Demand pricing, and multi-region active-active replication.",
    "Integrates with AWS Database Migration Service (DMS) to replicate data from on-premises Cassandra clusters to Amazon Keyspaces."
  ],
  "commonMistake": "Choosing Amazon Keyspaces for complex relational applications that rely heavily on SQL JOINs, foreign key constraints, and multi-table transactions. Keyspaces is a wide-column NoSQL database; use Amazon Aurora or Amazon RDS for relational workloads.",
  "example": "Migrate an on-premises Cassandra user-profile table to Amazon Keyspaces using AWS DMS: create a DMS replication task with Cassandra as source and Keyspaces as target, then switch application driver endpoints to Amazon Keyspaces once initial replication sync completes.",
  "sources": [
    {
      "title": "Amazon Keyspaces (for Apache Cassandra) Overview",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/what-is-keyspaces.html"
    },
    {
      "title": "Migrating Apache Cassandra to Amazon Keyspaces with AWS DMS",
      "url": "https://docs.aws.amazon.com/whitepapers/latest/aws-database-migration-service-best-practices/amazon-keyspaces-as-a-target.html"
    }
  ]
});
