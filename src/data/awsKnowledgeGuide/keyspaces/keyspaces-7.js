import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-keyspaces",
  "topicTitle": "Amazon Keyspaces",
  "objectiveCode": "Databases",
  "status": "ready",
  "id": "keyspaces-7",
  "title": "Keyspaces Provisioned Capacity",
  "plainEnglish": "Provisioned capacity mode in Amazon Keyspaces allows you to specify the exact number of Read Capacity Units (RCUs) and Write Capacity Units (WCUs) your application requires per second. You are billed at a predictable hourly rate for the allocated capacity units, making it the most cost-effective capacity option for workloads with predictable, consistent, or well-profiled traffic patterns.",
  "whyItMatters": "For steady-state enterprise applications processing millions of daily transactions, paying per-request on-demand rates can become expensive. Provisioned capacity lowers total cost of ownership by up to 50% or more when paired with Application Auto Scaling, ensuring that capacity closely follows predictable daily traffic curves while maintaining dedicated throughput reservations.",
  "workplaceExample": "A streaming platform processes telemetry heartbeats from millions of active connected TVs. Traffic is consistent at 20,000 writes per second during the day and drops to 8,000 writes per second overnight. By using Provisioned capacity mode with Auto Scaling targeting 70% utilization, the engineering team maintains guaranteed throughput at substantial cost savings over on-demand billing.",
  "examFocus": "Understand Provisioned mode calculations: 1 RCU = 1 strongly consistent read (LOCAL_QUORUM) per second for an item up to 4 KB (or two eventually consistent LOCAL_ONE reads). 1 WCU = 1 write per second for an item up to 1 KB. If an application exceeds provisioned capacity and burst capacity is exhausted, Keyspaces returns a WriteTimeoutException or ReadTimeoutException with Read/WriteCapacityExceeded.",
  "keyPoints": [
    "You allocate specific Read Capacity Units (RCUs) and Write Capacity Units (WCUs) per table.",
    "1 WCU provides 1 write per second for items up to 1 KB; 1 RCU provides 1 strongly consistent read per second for items up to 4 KB.",
    "Provides burst capacity by storing unused capacity over short periods to accommodate occasional minor traffic spikes.",
    "Integrates seamlessly with AWS Application Auto Scaling to adjust provisioned capacity automatically between min and max limits.",
    "Significantly cheaper per request than On-Demand mode for applications with stable, high-volume utilization.",
    "Can be configured and updated dynamically in CQL using the CUSTOM_PROPERTIES clause or via the AWS Console/CLI."
  ],
  "commonMistake": "Setting static provisioned capacity for workloads with fluctuating demand without enabling Auto Scaling. Static capacity risks throttling during peak hours or paying for wasted idle throughput during off-peak troughs.",
  "example": "Create a table with Provisioned capacity mode in CQL: CREATE TABLE analytics.page_views (page_id uuid, view_time timestamp, user_ip text, PRIMARY KEY (page_id, view_time)) WITH CUSTOM_PROPERTIES = {'capacity_mode': {'throughput_mode': 'PROVISIONED', 'read_capacity_units': 500, 'write_capacity_units': 1000}};",
  "sources": [
    {
      "title": "Provisioned Capacity Mode in Amazon Keyspaces",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/ReadWriteCapacityMode.html#ReadWriteCapacityMode.Provisioned"
    },
    {
      "title": "Managing Throughput Capacity in Amazon Keyspaces",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/ReadWriteCapacityMode.html"
    }
  ]
});
