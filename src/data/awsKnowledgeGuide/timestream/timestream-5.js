import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "timestream-5",
  "topicId": "topic-timestream",
  "topicTitle": "Amazon Timestream",
  "objectiveCode": "Databases",
  "status": "ready",
  "title": "Timestream Memory Store",
  "plainEnglish": "The memory store is the first tier in Amazon Timestream for LiveAnalytics's two-tier storage model. When your application writes a record to Timestream, that record initially lands in the memory store. The memory store holds data in fast, in-memory structures optimised for high-throughput writes and low-latency queries. Because in-memory storage is significantly more expensive per gigabyte than disk-based storage, the memory store is configured with a relatively short retention period—typically measured in hours—after which data is automatically and durably moved to the magnetic store.",
  "whyItMatters": "Operational and monitoring workloads—such as watching live dashboards, triggering real-time alerts and feeding streaming analytics pipelines—require sub-second query response times for the most recent data. The memory store satisfies this requirement by keeping fresh data immediately accessible without disk I/O. Without a fast in-memory tier, real-time dashboards would suffer the higher latency of querying magnetic storage, making live monitoring impractical.",
  "workplaceExample": "A DevOps team monitors the error rate of a payment API across four production regions. Their Grafana dashboard refreshes every 10 seconds and queries the last 2 hours of error-rate measurements. By setting memory-store retention to 12 hours, all data displayed on the live dashboard is always served from the memory store, delivering consistent sub-second panel refresh times. Data older than 12 hours moves automatically to the magnetic store for trend analysis and capacity planning reports.",
  "examFocus": "Key memory-store facts for the SAA-C03 exam: (1) Purpose: Holds the most recently written data for fast ingestion and low-latency queries. (2) Retention Unit: Configured in hours per table. (3) Cost: Memory-store storage costs more per GB than magnetic-store storage because of the underlying in-memory infrastructure. (4) Durability: The memory store is durable—data is not lost if a node fails; Timestream replicates it across Availability Zones. (5) Transition: When data ages beyond memory-store retention, Timestream automatically and durably migrates it to the magnetic store.",
  "keyPoints": [
    "The memory store is the first tier where all newly written records arrive in Timestream for LiveAnalytics.",
    "It is optimised for high-throughput writes and low-latency queries on the most recent data.",
    "Memory-store retention is configured per table in hours.",
    "Memory-store storage is more expensive per GB than magnetic-store storage.",
    "Data in the memory store is durable and replicated across Availability Zones—it is not a volatile cache.",
    "When memory-store retention expires for a record, Timestream automatically migrates it to the magnetic store."
  ],
  "commonMistake": "Assuming the memory store is a volatile cache that can silently lose data when instances restart. The memory store is fully durable and replicated; it simply retains data for a configured time window before migrating records to the magnetic store rather than deleting them.",
  "example": "Set the memory-store retention on an existing table to 6 hours using the AWS CLI: aws timestream-write update-table --database-name AppMonitoring --table-name ApiMetrics --retention-properties '{\"MemoryStoreRetentionPeriodInHours\":6,\"MagneticStoreRetentionPeriodInDays\":90}'.",
  "sources": [
    {
      "title": "Storage in Amazon Timestream for LiveAnalytics",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/storage.html"
    },
    {
      "title": "Amazon Timestream for LiveAnalytics – Data Retention",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/data-retention.html"
    }
  ]
});
