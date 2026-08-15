import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kinesis-9",
  "title": "Data Stream Retention",
  "plainEnglish": "Data Stream Retention in Amazon Kinesis Data Streams defines the length of time that data records remain accessible in the stream after they are written. By default, records are stored and accessible for 24 hours (1 day). You can extend this retention period up to a maximum of 8,760 hours (365 days) to allow downstream consumers to process data at their own pace or replay historical records.",
  "whyItMatters": "In distributed architectures, downstream consumer services may experience crashes, bug fixes, or long maintenance windows. Extended retention acts as a safety buffer, ensuring that when consumer applications come back online, they can rewind their checkpoints and reprocess historical stream records without data loss.",
  "workplaceExample": "A financial auditing platform configures a 7-day (168-hour) retention period on its transaction stream. When a critical bug is discovered in their accounting reconciliation microservice over the weekend, the team deploys a patch on Monday morning, rewinds the Kinesis consumer iterator to Saturday, and accurately re-processes all weekend transactions from the stream.",
  "examFocus": "Understand retention limits and mechanics: (1) Default retention is 24 hours (included in base shard price). (2) Extended retention can be increased up to 8760 hours (365 days) via IncreaseStreamRetentionPeriod. (3) Differentiate stream retention (how long records stay in the stream) from consumer checkpointing (where a consumer is currently reading). (4) Retention is billed on an hourly shard-hour basis for hours beyond the initial 24 hours.",
  "keyPoints": [
    "Default data retention period is 24 hours (1 day), included in standard shard pricing.",
    "Can be extended up to a maximum of 8,760 hours (365 days) using IncreaseStreamRetentionPeriod.",
    "Records older than the retention period are automatically and permanently deleted from the stream.",
    "Enables data replay: multiple independent consumers can read historical data from any point within the retention window.",
    "Additional charges apply for extended retention (hours 25 to 168) and long-term retention (days 8 to 365).",
    "Stream retention does not affect real-time consumer latency; new records are available for consumption within milliseconds."
  ],
  "commonMistake": "Confusing stream data retention with consumer checkpoints. Stream retention guarantees data remains available in Kinesis; a consumer checkpoint records the consumer's current position in the stream (stored in an external store like DynamoDB). Extending retention does not automatically move consumer checkpoints.",
  "example": "Extend the retention period of a Kinesis stream to 7 days (168 hours) using the AWS CLI: aws kinesis increase-stream-retention-period --stream-name financial-transactions --retention-period-hours 168.",
  "sources": [
    {
      "title": "Changing the Data Retention Period in Amazon Kinesis Data Streams",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/kinesis-extended-retention.html"
    },
    {
      "title": "Amazon Kinesis Data Streams Key Concepts - Retention",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html"
    }
  ]
});
