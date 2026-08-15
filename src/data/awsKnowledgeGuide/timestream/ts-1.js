import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ts-1",
  "topicId": "topic-timestream",
  "topicTitle": "Amazon Timestream",
  "objectiveCode": "Databases",
  "status": "ready",
  "title": "Auto-Tiering Storage: In-Memory Store (Fast recent writes) to Magnetic Store (Cost-effective analytics)",
  "plainEnglish": "Amazon Timestream for LiveAnalytics automatically manages two distinct physical storage tiers for every table. The memory store holds the most recently written data in a fast, in-memory layer optimised for real-time ingestion and low-latency queries. The magnetic store holds older data on cost-effective magnetic media optimised for long-term retention and analytical queries across months or years of history. Timestream continuously and automatically moves data from the memory store to the magnetic store based on the retention configuration you set, without requiring you to write migration jobs or manage the transition yourself.",
  "whyItMatters": "Time-series workloads have a natural 'hot versus cold' access pattern: engineers query the last hour or day of sensor readings frequently, but queries against six-month-old operational data are rare and can tolerate slightly higher latency. Forcing all data into an expensive in-memory layer would make long-term retention prohibitively costly. Auto-tiering lets you keep recent data instantly accessible while automatically shifting ageing data to dramatically cheaper storage, reducing total cost of ownership without sacrificing query capability on historical data.",
  "workplaceExample": "A smart-building company collects temperature, humidity and CO2 readings from 40,000 room sensors every 30 seconds. Engineers view live dashboard panels covering the last 24 hours and rely on sub-second query response times. Security audits occasionally query six months of environmental data for compliance reports. The team configures memory-store retention of 24 hours and magnetic-store retention of 365 days. Recent readings land in the memory store and deliver real-time dashboard performance. Data older than 24 hours automatically migrates to the magnetic store, where analytical queries across historical records complete in seconds at a fraction of the cost of keeping everything in memory.",
  "examFocus": "Know the two-tier storage model for the SAA-C03 exam: (1) Memory Store: Fast, in-memory tier for recent data; higher cost per GB; supports real-time ingestion and low-latency queries; retention is configured per table and measured in hours. (2) Magnetic Store: Cost-effective durable storage for older data; lower cost per GB; supports analytical queries; retention is configured in days. (3) Auto-Tiering: Timestream automatically moves data from memory to magnetic storage when the memory-store retention period expires—no custom migration code is required. (4) Query Across Both Tiers: A single SQL query can span both stores transparently.",
  "keyPoints": [
    "Timestream for LiveAnalytics maintains two storage tiers per table: memory store (recent, fast) and magnetic store (historical, cost-effective).",
    "Memory-store retention is configured in hours; magnetic-store retention is configured in days.",
    "Data automatically migrates from the memory store to the magnetic store when memory retention expires.",
    "A single Timestream SQL query can span both storage tiers transparently without application changes.",
    "The memory store is optimised for low-latency writes and real-time queries, not as a simple cache to be discarded.",
    "Separate retention settings let you balance query performance, data availability and storage cost for your specific access pattern."
  ],
  "commonMistake": "Treating the memory store as a disposable cache and setting an extremely short retention period without considering that data moved to the magnetic store may still be needed for recent analytical queries. If memory retention is set too aggressively short, data that operators expect to query in near-real time will already be in the magnetic store and queries will incur higher latency.",
  "example": "When creating a Timestream table via the AWS CLI, configure memory-store retention to 24 hours and magnetic-store retention to 365 days: aws timestream-write create-table --database-name SmartBuilding --table-name RoomSensors --retention-properties '{\"MemoryStoreRetentionPeriodInHours\":24,\"MagneticStoreRetentionPeriodInDays\":365}'.",
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
