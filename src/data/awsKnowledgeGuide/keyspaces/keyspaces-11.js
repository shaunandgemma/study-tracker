import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-keyspaces",
  "topicTitle": "Amazon Keyspaces",
  "objectiveCode": "Databases",
  "status": "ready",
  "id": "keyspaces-11",
  "title": "Keyspaces Time to Live - TTL",
  "plainEnglish": "Time to Live (TTL) in Amazon Keyspaces is a feature that automatically expires and deletes rows or specific column values after a defined duration (in seconds). When TTL is enabled on a table, Keyspaces automatically purges expired records in the background without incurring write capacity charges or requiring manual cleanup scripts.",
  "whyItMatters": "In self-managed Apache Cassandra, deleting data or relying on TTL creates 'tombstone' records that degrade read query performance and require heavy disk compaction routines to purge. Amazon Keyspaces manages TTL serverlessly in the underlying storage engine without generating performance-degrading tombstones, making it ideal for temporary data storage.",
  "workplaceExample": "A cybersecurity SaaS platform stores temporary user session tokens and one-time verification codes in Amazon Keyspaces. They set a default TTL of 86,400 seconds (24 hours) on the session table. Keyspaces automatically removes expired tokens without the application having to run scheduled DELETE queries or manage database cleanup jobs.",
  "examFocus": "Understand how TTL functions in Keyspaces: (1) Enable TTL on a table using the 'default_time_to_live' property in CQL (e.g., WITH default_time_to_live = 86400). (2) Override TTL for specific INSERT or UPDATE statements using the USING TTL <seconds> clause. (3) Expired items are deleted automatically without consuming write throughput capacity.",
  "keyPoints": [
    "Automatically deletes rows or column attributes after a specified expiration time (in seconds).",
    "Can be configured as a table default ('default_time_to_live') or specified per statement ('USING TTL').",
    "Does not consume Write Capacity Units (WCUs) or Write Request Units (WRUs) when deleting expired items.",
    "Unlike self-managed Cassandra, TTL expiration in Keyspaces does not generate performance-impacting tombstones.",
    "Ideal for temporary session stores, rate-limiting caches, verification codes, and time-series telemetry data.",
    "Can be enabled or disabled on existing tables at any time using standard ALTER TABLE CQL statements."
  ],
  "commonMistake": "Writing scheduled batch cron jobs that execute bulk DELETE queries to purge old data instead of using TTL. Manual bulk DELETE queries consume significant write capacity and can trigger throttling; always use TTL for automatic expiration.",
  "example": "Create a table with a 30-day default TTL in CQL: CREATE TABLE sessions.user_tokens (session_id uuid, user_id uuid, created_at timestamp, PRIMARY KEY (session_id)) WITH default_time_to_live = 2592000; or insert an item with a custom 1-hour TTL: INSERT INTO sessions.user_tokens (session_id, user_id) VALUES (uuid(), uuid()) USING TTL 3600;",
  "sources": [
    {
      "title": "Time to Live (TTL) in Amazon Keyspaces",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/TTL.html"
    },
    {
      "title": "Configuring Default TTL on Tables",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/TTL-how-it-works.html"
    }
  ]
});
