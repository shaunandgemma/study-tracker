import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "timestream-7",
  "topicId": "topic-timestream",
  "topicTitle": "Amazon Timestream",
  "objectiveCode": "Databases",
  "status": "ready",
  "title": "Timestream Retention Policies",
  "plainEnglish": "In Amazon Timestream for LiveAnalytics, every table has a retention policy that specifies two independent durations: how long data stays in the memory store (measured in hours) and how long data stays in the magnetic store (measured in days). Once data ages past the memory-store retention period, Timestream automatically moves it to the magnetic store. Once data ages past the magnetic-store retention period, Timestream automatically and permanently deletes it. You configure both periods independently on each table to match the access patterns and cost requirements of that specific dataset.",
  "whyItMatters": "Retention policies are the primary mechanism for controlling the cost, performance and compliance profile of a Timestream table. A table used for a real-time safety monitoring system may require only 1 hour of memory-store retention but 10 years of magnetic-store retention for regulatory compliance. A table holding ephemeral performance metrics for a CI/CD pipeline may need 24 hours of memory-store retention and only 30 days of magnetic-store retention. Configuring retention policies per table prevents expensive over-retention and accidental data deletion.",
  "workplaceExample": "A healthcare monitoring company runs two Timestream tables: one for patient vital signs on ICU monitors (memory retention 2 hours for real-time alerts, magnetic retention 7 years for regulatory compliance) and one for building HVAC system readings (memory retention 24 hours for live dashboards, magnetic retention 90 days for maintenance trend analysis). The different retention configurations ensure that patient data is never prematurely deleted while environmental sensor data with lower legal requirements is cleaned up automatically.",
  "examFocus": "Understand retention policy configuration for the SAA-C03 exam: (1) Memory-Store Retention: Specified in hours, controls how long data remains in the fast in-memory tier before migrating to magnetic storage. (2) Magnetic-Store Retention: Specified in days, controls how long data remains in the durable disk-based tier before permanent deletion. (3) Independent Configuration: Memory and magnetic retention periods are set independently per table. (4) Automatic Enforcement: Timestream enforces both retention periods automatically without requiring application code. (5) Data Loss Risk: After the magnetic-store retention period expires, data is permanently deleted and cannot be recovered.",
  "keyPoints": [
    "Every Timestream for LiveAnalytics table has two separately configured retention periods.",
    "Memory-store retention is set in hours and determines how long fresh data stays in the fast tier.",
    "Magnetic-store retention is set in days and determines how long historical data is retained before deletion.",
    "Timestream automatically migrates and deletes data according to both retention thresholds.",
    "Retention policies should match legal, compliance and operational requirements for each table.",
    "Data that ages past the magnetic-store retention period is permanently and irreversibly deleted."
  ],
  "commonMistake": "Setting the same retention policy on all tables regardless of their data requirements. A DevOps metrics table and a patient-monitoring table have very different legal retention requirements; using a single universal retention policy risks deleting compliance-critical data prematurely or paying to retain ephemeral data far beyond its useful life.",
  "example": "Configure independent retention policies for two tables: aws timestream-write update-table --database-name Hospital --table-name PatientVitals --retention-properties '{\"MemoryStoreRetentionPeriodInHours\":2,\"MagneticStoreRetentionPeriodInDays\":2555}' and separately: aws timestream-write update-table --database-name Hospital --table-name HvacReadings --retention-properties '{\"MemoryStoreRetentionPeriodInHours\":24,\"MagneticStoreRetentionPeriodInDays\":90}'.",
  "sources": [
    {
      "title": "Amazon Timestream for LiveAnalytics – Data Retention",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/data-retention.html"
    },
    {
      "title": "Storage in Amazon Timestream for LiveAnalytics",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/storage.html"
    }
  ]
});
