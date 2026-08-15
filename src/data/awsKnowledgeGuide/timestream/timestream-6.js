import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "timestream-6",
  "topicId": "topic-timestream",
  "topicTitle": "Amazon Timestream",
  "objectiveCode": "Databases",
  "status": "ready",
  "title": "Timestream Magnetic Store",
  "plainEnglish": "The magnetic store is the second, long-term tier in Amazon Timestream for LiveAnalytics's two-tier storage model. After data ages past the memory-store retention period, Timestream automatically and durably migrates it to the magnetic store, which uses cost-effective, disk-based columnar storage. The magnetic store retains data for a period you configure in days—from one day to effectively unlimited retention. Queries that span the magnetic store can access months or years of historical measurements, though they may take slightly longer than equivalent queries entirely within the memory store.",
  "whyItMatters": "Most time-series data is read infrequently once it is older than a few hours or days. Keeping terabytes of historical data in expensive in-memory storage is economically impractical. The magnetic store allows organisations to retain years of operational history at a fraction of the cost while still supporting analytical SQL queries across the full history. This enables compliance archiving, long-term trend analysis, capacity planning and root-cause investigation of incidents that occurred weeks ago.",
  "workplaceExample": "A telecommunications company collects network performance metrics—packet loss, latency and throughput—from 10,000 cell towers every minute. The most recent 24 hours of data are held in the memory store for real-time NOC dashboards. Beyond 24 hours, data migrates automatically to the magnetic store, which retains 2 years of history. When a regulatory body requests evidence of network quality for a specific region over the previous 6 months, the operations team queries the magnetic store and generates the report without needing a data warehouse or separate archival system.",
  "examFocus": "Know the magnetic-store characteristics and the late-arriving-data feature: (1) Purpose: Cost-effective long-term storage for historical time-series data. (2) Retention Unit: Configured in days per table. (3) Cost: Significantly cheaper per GB than the memory store. (4) Query Capability: Supports the full Timestream SQL query language, including time-series analytics functions, across the complete historical record. (5) Magnetic-Store Writes: Timestream can be configured to accept late-arriving records written directly to the magnetic store, useful when data pipelines deliver data with a delay. A separate S3 bucket must be configured to receive rejection reports for late-arriving records that exceed the allowed arrival threshold.",
  "keyPoints": [
    "The magnetic store holds data that has aged past the memory-store retention period.",
    "Retention is configured in days per table and can span months or years of history.",
    "Storage cost per GB is substantially lower than the memory store.",
    "Supports full Timestream SQL queries including time-series analytics functions.",
    "Magnetic-store writes can be enabled to ingest records whose timestamps indicate they arrived late.",
    "A configured Amazon S3 location receives rejection reports for records that cannot be written to the magnetic store."
  ],
  "commonMistake": "Assuming that enabling magnetic-store writes is sufficient to accept any late-arriving record without configuration. Magnetic-store writes require an Amazon S3 bucket to be specified for rejection reporting; without the correct S3 configuration and IAM permissions, late-arriving write requests will fail.",
  "example": "Enable magnetic-store writes on a table and specify an S3 location for rejection reports: aws timestream-write update-table --database-name FleetTracking --table-name GpsReadings --magnetic-store-write-properties '{\"EnableMagneticStoreWrites\":true,\"MagneticStoreRejectedDataLocation\":{\"S3Configuration\":{\"BucketName\":\"my-rejection-bucket\",\"EncryptionOption\":\"SSE_S3\"}}}'.",
  "sources": [
    {
      "title": "Storage in Amazon Timestream for LiveAnalytics",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/storage.html"
    },
    {
      "title": "Late Arriving Data and Magnetic Store Writes",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/magnetic-store-writes.html"
    }
  ]
});
