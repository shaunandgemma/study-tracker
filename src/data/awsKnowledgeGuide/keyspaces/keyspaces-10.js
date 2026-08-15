import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-keyspaces",
  "topicTitle": "Amazon Keyspaces",
  "objectiveCode": "Databases",
  "status": "ready",
  "id": "keyspaces-10",
  "title": "Keyspaces Consistency",
  "plainEnglish": "Consistency in Amazon Keyspaces defines the level of data freshness and agreement among replica nodes returned when an application executes read and write queries. Amazon Keyspaces supports standard Cassandra Query Language (CQL) consistency levels, primarily LOCAL_QUORUM (strongly consistent reads and writes within the local region) and LOCAL_ONE (eventually consistent reads), allowing developers to balance latency, cost, and consistency.",
  "whyItMatters": "Choosing the appropriate consistency level ensures that your application meets its business accuracy requirements while optimizing database performance and cost. Strongly consistent reads (LOCAL_QUORUM) guarantee that queries always return the most recent write, but consume 1 full Read Capacity Unit per 4 KB. Eventually consistent reads (LOCAL_ONE) offer the lowest read latency and consume only 0.5 Read Capacity Unit per 4 KB (a 50% cost discount).",
  "workplaceExample": "A banking system uses Amazon Keyspaces to track account balances and transaction logs. When processing wire transfers, the payment service queries account balances using LOCAL_QUORUM to ensure it always reads the exact, up-to-the-millisecond balance before debiting funds. For generating monthly read-only historical statement archives, the reporting service uses LOCAL_ONE to cut read capacity consumption in half.",
  "examFocus": "Understand supported consistency levels in Keyspaces: (1) Reads: LOCAL_QUORUM (strongly consistent, reads from a majority of AZ replicas, 1 RCU per 4 KB) and LOCAL_ONE (eventually consistent, reads from one AZ replica, 0.5 RCU per 4 KB). (2) Writes: LOCAL_QUORUM (writes committed synchronously across majority of AZ replicas). (3) Unsupported Cassandra levels (like ALL, ANY, TWO, THREE, EACH_QUORUM) are not permitted.",
  "keyPoints": [
    "Supports CQL consistency levels: LOCAL_QUORUM (strong consistency) and LOCAL_ONE (eventual consistency).",
    "All writes in Amazon Keyspaces are committed using LOCAL_QUORUM across 3 Availability Zones in the Region.",
    "LOCAL_QUORUM reads return the latest acknowledged write, consuming 1 Read Capacity Unit per 4 KB.",
    "LOCAL_ONE reads provide lowest read latency and cost, consuming only 0.5 Read Capacity Unit per 4 KB.",
    "Unsupported Cassandra consistency levels (such as ALL, ANY, ONE, TWO, THREE, QUORUM, EACH_QUORUM) will return an error if submitted.",
    "Consistency levels are configured at the client driver session or query statement level."
  ],
  "commonMistake": "Attempting to use Cassandra consistency level 'QUORUM' or 'ALL' instead of 'LOCAL_QUORUM'. In Amazon Keyspaces, cluster replication across AZs is scoped regionally; using global 'QUORUM' or 'ALL' will fail with an unsupported consistency level exception.",
  "example": "Configure the consistency level in a Python Cassandra driver statement: from cassandra import ConsistencyLevel; statement = SimpleStatement('SELECT * FROM accounts.balances WHERE account_id = %s', consistency_level=ConsistencyLevel.LOCAL_QUORUM); session.execute(statement, (account_id,)).",
  "sources": [
    {
      "title": "Read and Write Consistency Levels in Amazon Keyspaces",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/consistency.html"
    },
    {
      "title": "Amazon Keyspaces Cassandra Drivers and Query Options",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/programmatic.html"
    }
  ]
});
