import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "timestream-3",
  "topicId": "topic-timestream",
  "topicTitle": "Amazon Timestream",
  "objectiveCode": "Databases",
  "status": "ready",
  "title": "Timestream Serverless Time-Series Database",
  "plainEnglish": "Amazon Timestream for LiveAnalytics is a fully managed, serverless time-series database service designed to store, process and analyse data that is generated continuously over time and always associated with a timestamp. A time-series database records observations as they happen—such as a temperature sensor reporting 22.4°C at exactly 14:03:00 UTC—and stores them in time-ordered sequences so you can ask questions like 'what was the average reading over the last 6 hours?' or 'when did this metric exceed its threshold?' Timestream is serverless, meaning AWS provisions, scales and manages all underlying compute and storage infrastructure automatically; you never configure servers, storage volumes or database instances.",
  "whyItMatters": "Traditional relational databases (such as Amazon RDS) are designed around rows and columns representing entities, relationships and transactions. Storing millions of sensor readings per day in a relational database requires careful schema design, heavy indexing, and complex partitioning to remain performant—work that grows increasingly difficult as data volumes scale. Timestream's architecture is built specifically for the characteristics of time-series workloads: append-only writes, time-ordered storage, and analytical queries across time ranges, eliminating the infrastructure management burden entirely.",
  "workplaceExample": "A renewable energy company operates 2,000 solar panels spread across five farm sites. Each panel reports power output, panel temperature and inverter voltage every 10 seconds. That generates roughly 3.6 million data points per hour. The engineering team chooses Timestream for LiveAnalytics because they never want to manage database servers, the data is naturally time-stamped, and they need both real-time dashboard queries and long-term historical trend analysis—all without provisioning capacity in advance.",
  "examFocus": "Know the core Timestream for LiveAnalytics service characteristics for the SAA-C03 exam: (1) Serverless: No servers, clusters or instances to provision, patch or scale. Timestream scales automatically. (2) Time-Series Focus: Designed for append-dominant, timestamped workloads such as IoT sensor data, application metrics and operational telemetry. (3) Storage Hierarchy: Uses automatic two-tier storage (memory store for recent data, magnetic store for history) managed transparently. (4) SQL Interface: Queries are written in a Timestream-specific SQL dialect that includes time-series functions not available in standard SQL.",
  "keyPoints": [
    "Timestream for LiveAnalytics is a fully managed, serverless time-series database requiring no infrastructure provisioning.",
    "Every record must include a timestamp representing the moment the measurement was taken.",
    "Designed for append-dominant workloads where data arrives continuously in time order.",
    "Scales storage and query capacity automatically without manual intervention.",
    "Uses a purpose-built SQL query engine with built-in time-series analytical functions.",
    "Suited for IoT sensor data, application performance metrics, DevOps telemetry and operational monitoring."
  ],
  "commonMistake": "Using Timestream for LiveAnalytics as a general-purpose database for entity records, relational transactions or data that does not naturally carry a timestamp. Timestream is purpose-built for time-ordered measurements; for customer profiles, order records or relational data, a purpose-fit service such as Amazon RDS or DynamoDB is more appropriate.",
  "example": "Write a single temperature record for a sensor using the Timestream WriteRecords API via the AWS SDK: specify DatabaseName, TableName, one Dimension (sensor_id), MeasureName (temperature), MeasureValue (22.4), MeasureValueType (DOUBLE) and a current-epoch-milliseconds Time value.",
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
