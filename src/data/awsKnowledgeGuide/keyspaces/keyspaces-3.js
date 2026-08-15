import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-keyspaces",
  "topicTitle": "Amazon Keyspaces",
  "objectiveCode": "Databases",
  "status": "ready",
  "id": "keyspaces-3",
  "title": "Keyspaces Apache Cassandra-Compatible Database",
  "plainEnglish": "Amazon Keyspaces is an Apache Cassandra-compatible database service designed for applications that require the wide-column NoSQL data model and high-throughput write speeds of Apache Cassandra. It implements the open-source Cassandra Query Language (CQL) API, enabling applications to interact with AWS-hosted tables using standard Cassandra drivers and familiar CQL queries.",
  "whyItMatters": "Apache Cassandra is renowned for handling high-volume write-heavy workloads (such as IoT telemetry, messaging, time-series data, and recommendation history). However, running self-hosted Cassandra clusters requires specialized database administrator (DBA) expertise to tune operating systems, manage SSD storage nodes, and repair cluster partition rings. Amazon Keyspaces delivers the same data model and query APIs as a fully managed AWS service.",
  "workplaceExample": "An IoT smart-metering company with billions of sensor readings migrates from an on-premises 30-node Cassandra cluster to Amazon Keyspaces. They migrate existing tables using standard CQL schema exports, configure their Python and Java telemetry ingestion microservices to point to the Amazon Keyspaces regional endpoint, and decommission their physical server hardware.",
  "examFocus": "Understand the Cassandra compatibility scope of Keyspaces: Keyspaces supports CQL data definition language (DDL) such as CREATE KEYSPACE and CREATE TABLE, and data manipulation language (DML) including SELECT, INSERT, UPDATE, and DELETE. It supports common Cassandra data types (text, int, bigint, uuid, timestamp, frozen collections, user-defined types). It does not require customer management of nodes, seeds, or gossip protocols.",
  "keyPoints": [
    "Supports Cassandra Query Language (CQL) 3.1.1 API specifications for DDL and DML operations.",
    "Compatible with official open-source Apache Cassandra client drivers across multiple programming languages.",
    "Supports standard Cassandra data types including scalar types (ascii, text, int, bigint, float, double, boolean, uuid, timeuuid, timestamp, inet, blob) and frozen collections (list, set, map).",
    "Preserves wide-column NoSQL data model characteristics: query-driven design, compound partition keys, and clustering columns.",
    "Eliminates server-level administrative burdens such as node replacements, tombstone purges, compaction strategy tuning, and manual backups.",
    "Enables seamless schema migration from open-source Apache Cassandra using cqlsh or the AWS Database Migration Service (DMS)."
  ],
  "commonMistake": "Attempting to run unsupported low-level administrative CQL commands like ALTER CLUSTER, DROP KEYSPACE system, or nodetool commands in Amazon Keyspaces. Server-level operations are not exposed because AWS manages the underlying serverless infrastructure.",
  "example": "Create a keyspace and table using CQL: CREATE KEYSPACE telemetry WITH replication = {'class': 'SingleRegionStrategy'}; CREATE TABLE telemetry.sensor_readings (device_id text, reading_time timestamp, temperature double, humidity double, PRIMARY KEY (device_id, reading_time)) WITH CLUSTERING ORDER BY (reading_time DESC);",
  "sources": [
    {
      "title": "Amazon Keyspaces (for Apache Cassandra) Developer Guide",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/what-is-keyspaces.html"
    },
    {
      "title": "Supported Cassandra CQL Features in Amazon Keyspaces",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/cassandra-apis.html"
    }
  ]
});
