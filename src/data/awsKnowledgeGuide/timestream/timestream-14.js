import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "timestream-14",
  "topicId": "topic-timestream",
  "topicTitle": "Amazon Timestream",
  "objectiveCode": "Databases",
  "status": "ready",
  "title": "Timestream vs General-Purpose Databases",
  "plainEnglish": "Amazon Timestream for LiveAnalytics is a specialised time-series database and should be compared with general-purpose databases to understand when each is the better choice. A general-purpose relational database such as Amazon RDS (MySQL, PostgreSQL) stores rows and columns representing entities—customers, orders, products—with complex relationships enforced by foreign keys, supports arbitrary JOIN queries and is designed for a mix of read and write operations of unpredictable shape. A general-purpose key-value or document store such as Amazon DynamoDB is optimised for single-item or small-batch lookups by a known partition key and sort key. Timestream is designed for a completely different workload: continuous, append-dominant writes of timestamped measurements and time-range analytical queries that always include a time predicate.",
  "whyItMatters": "Choosing the wrong database for a time-series workload creates technical debt, performance problems and unnecessarily high operational costs. Storing millions of sensor readings per day in an RDS table requires building and maintaining custom time-based partitioning, archiving jobs, index management and storage lifecycle pipelines—engineering work that Timestream handles automatically. Conversely, using Timestream for transactional records that require complex joins, foreign key constraints or multi-row ACID transactions would be inappropriate because Timestream does not support those relational features.",
  "workplaceExample": "An agricultural technology company evaluates its database needs. For its customer and subscription records—names, billing addresses, contract terms—the team selects Amazon RDS PostgreSQL because the data is relational, requires foreign key constraints, and is queried with complex multi-table joins. For the continuous soil moisture, temperature and nitrogen readings from 5,000 field sensors ingested every 10 seconds, the team selects Timestream for LiveAnalytics because the data is timestamped, high-volume, append-only and analysed with time-range aggregations. A DynamoDB table stores the current operational state of each sensor device, queried by device ID with low latency. Three different stores for three different workload shapes.",
  "examFocus": "Know when to choose Timestream for LiveAnalytics over other AWS database services: (1) Choose Timestream when: Data is timestamped, arrives continuously in high volume, is append-dominant, and is queried with time-range predicates and time-series analytical functions. (2) Choose Amazon RDS or Aurora when: Data is relational, requires multi-table joins, foreign key constraints, ACID transactions or general-purpose SQL across non-time-series records. (3) Choose Amazon DynamoDB when: Data is accessed by known partition and sort keys at millisecond latency with predictable read/write patterns. (4) Timestream is not a replacement for Amazon Redshift or Athena when the primary need is ad-hoc, complex analytical SQL across massive, multi-domain business datasets.",
  "keyPoints": [
    "Timestream for LiveAnalytics is purpose-built for timestamped, append-dominant, high-volume measurement data.",
    "General-purpose relational databases such as RDS are better suited to entity records, relationships and ACID transactions.",
    "DynamoDB is better suited to high-throughput, low-latency key-value lookups rather than time-range analytics.",
    "Timestream does not support foreign keys, general-purpose joins or traditional relational transactions.",
    "Using Timestream for time-series workloads eliminates custom partitioning, archiving and lifecycle management code.",
    "Timestream complements rather than replaces services such as RDS, DynamoDB, Redshift and OpenSearch for their respective workloads."
  ],
  "commonMistake": "Storing time-series metrics data in an Amazon RDS MySQL table with a timestamp column and then building a custom nightly cron job to archive old rows to S3, custom indexes for time-range performance and manual table partitioning—all of which Timestream handles automatically as part of its core design.",
  "example": "Decision framework: If your records are primarily identified by a timestamp, arrive continuously from devices or services, are almost never updated after insertion, and are queried with WHERE time > ago(24h) style predicates, Timestream for LiveAnalytics is likely the appropriate choice. If records represent business entities with relationships, need JOIN operations across entity types or require transactional consistency, Amazon RDS or Aurora is more appropriate.",
  "sources": [
    {
      "title": "What is Amazon Timestream for LiveAnalytics?",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/what-is-timestream.html"
    },
    {
      "title": "Amazon Timestream for LiveAnalytics Concepts",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/concepts.html"
    }
  ]
});
