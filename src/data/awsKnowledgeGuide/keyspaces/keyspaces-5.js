import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-keyspaces",
  "topicTitle": "Amazon Keyspaces",
  "objectiveCode": "Databases",
  "status": "ready",
  "id": "keyspaces-5",
  "title": "Keyspaces Tables and Partition Keys",
  "plainEnglish": "In Amazon Keyspaces, data is organized into keyspaces (logical database containers) and tables. Each table row is uniquely identified by a Primary Key, which consists of a mandatory Partition Key and optional Clustering Columns. The Partition Key determines which storage partition holds the row across the distributed cluster, while Clustering Columns determine the physical sort order of rows within that specific partition.",
  "whyItMatters": "Data modeling in Amazon Keyspaces is 'query-first' and fundamentally different from relational SQL databases. Because Keyspaces does not support table joins or cross-partition transactions, choosing a well-distributed partition key prevents 'hot partitions' (overloaded storage nodes) and ensures queries can retrieve required rows with single-digit millisecond latency.",
  "workplaceExample": "A ride-sharing app tracks driver location pings. Designing a table with PRIMARY KEY ((driver_id, date), ping_time) creates a compound partition key on driver_id and date (ensuring each driver's daily pings are evenly distributed without growing into a single infinite partition) and uses ping_time as a clustering column to keep GPS coordinates sorted in chronological order for fast map rendering.",
  "examFocus": "Understand primary key anatomy in Cassandra and Keyspaces: (1) Single Partition Key: PRIMARY KEY (user_id). (2) Compound Partition Key: PRIMARY KEY ((user_id, account_id)). (3) Composite Primary Key (Partition Key + Clustering Columns): PRIMARY KEY ((sensor_id), timestamp, sequence_id). Queries with WHERE clauses MUST specify the complete partition key to avoid expensive full-table scans (which require ALLOW FILTERING).",
  "keyPoints": [
    "A Keyspace acts as the top-level namespace containing tables, analogous to a database schema in relational systems.",
    "The Primary Key consists of one or more partition keys, and zero or more clustering columns.",
    "The Partition Key is hashed to distribute rows evenly across storage partitions and prevent hot-spotting.",
    "Clustering Columns define the physical sorting order (ASC or DESC) of rows stored within the same partition.",
    "Data modeling must follow a query-first approach; tables are designed specifically around the exact queries the application will execute.",
    "Denormalization is standard practice; creating duplicate tables with different partition keys is common when data must be queried by multiple access patterns."
  ],
  "commonMistake": "Designing keyspaces tables with low-cardinality partition keys (such as status='ACTIVE' or country='US'). This concentrates millions of rows into a single partition, creating severe hot-spotting and causing query timeouts or throttling.",
  "example": "Create a query-optimized table with a compound partition key and ordered clustering columns in CQL: CREATE TABLE messaging.chat_history (room_id uuid, message_date date, message_id timeuuid, sender_id text, message_text text, PRIMARY KEY ((room_id, message_date), message_id)) WITH CLUSTERING ORDER BY (message_id DESC);",
  "sources": [
    {
      "title": "Working with Keyspaces and Tables in Amazon Keyspaces",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/working-with-keyspaces.html"
    },
    {
      "title": "Data Modeling Guidelines for Amazon Keyspaces",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/data-modeling.html"
    }
  ]
});
