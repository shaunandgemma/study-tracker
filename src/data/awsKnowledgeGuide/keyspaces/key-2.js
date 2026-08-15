import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-keyspaces",
  "topicTitle": "Amazon Keyspaces",
  "objectiveCode": "Databases",
  "status": "ready",
  "id": "key-2",
  "title": "On-Demand vs Provisioned Capacity Modes & KMS Data Encryption",
  "plainEnglish": "Amazon Keyspaces provides flexible billing models and enterprise security by offering two capacity modes—On-Demand and Provisioned—alongside mandatory default encryption at rest using AWS Key Management Service (AWS KMS). On-Demand mode charges per request for unpredictable workloads, while Provisioned mode allows you to specify expected read/write throughput with Auto Scaling. All data, metadata, and backups are encrypted at rest with KMS keys.",
  "whyItMatters": "Matching capacity mode to application traffic patterns prevents overpaying for idle capacity or being throttled during traffic spikes. On-Demand mode is ideal for new or bursty applications because it scales automatically from zero with no capacity planning. Provisioned mode lowers costs for predictable, steady workloads. Mandatory KMS encryption ensures compliance with security regulations without performance penalties.",
  "workplaceExample": "A fintech startup deploys a new payment logging table in Amazon Keyspaces. During launch week, they set the table to On-Demand capacity mode to absorb unpredictable burst traffic without throttling. After observing steady 5,000 WCU and 2,000 RCU usage over three months, they switch the table to Provisioned capacity mode with Auto Scaling and customer-managed KMS encryption, cutting monthly database costs by 45%.",
  "examFocus": "Know the two capacity modes and encryption behavior: (1) On-Demand: Pay per read/write request unit (RRU/WRU), accommodates spiky traffic instantly, no capacity planning. (2) Provisioned: Specify read/write capacity units (RCU/WCU), supports Application Auto Scaling to adjust capacity based on target utilization, cheaper for predictable traffic. (3) Encryption at rest is enabled by default using AWS owned keys or customer-managed KMS keys (CMKs).",
  "keyPoints": [
    "On-Demand Capacity Mode charges strictly for the read and write request units (RRUs and WRUs) consumed by your application.",
    "Provisioned Capacity Mode charges for allocated Read and Write Capacity Units (RCUs and WCUs), supporting Auto Scaling based on target utilization percentages.",
    "You can switch between On-Demand and Provisioned capacity modes once per day per table.",
    "1 Read Capacity/Request Unit covers 1 strongly consistent read per second for items up to 4 KB (or 2 eventual consistent reads).",
    "1 Write Capacity/Request Unit covers 1 write per second for items up to 1 KB.",
    "Data is encrypted at rest by default using AWS Key Management Service (AWS KMS) with either an AWS owned key (free) or a Customer Managed Key (CMK)."
  ],
  "commonMistake": "Leaving high-volume, highly predictable 24/7 steady-state workloads in On-Demand mode indefinitely. For steady traffic, Provisioned mode with Application Auto Scaling is significantly more cost-effective than On-Demand pricing.",
  "example": "Create a table with Provisioned capacity mode and a customer-managed KMS key in CQL: CREATE TABLE ecommerce.orders (order_id uuid, customer_id uuid, total decimal, PRIMARY KEY (order_id)) WITH CUSTOM_PROPERTIES = {'capacity_mode': {'throughput_mode': 'PROVISIONED', 'read_capacity_units': 100, 'write_capacity_units': 200}, 'encryption_specification': {'encryption_type': 'CUSTOMER_MANAGED_KMS_KEY', 'kms_key_identifier': 'arn:aws:kms:us-east-1:123456789012:key/abcd-1234'}};",
  "sources": [
    {
      "title": "Read and Write Throughput Capacity Modes in Amazon Keyspaces",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/ReadWriteCapacityMode.html"
    },
    {
      "title": "Encryption at Rest in Amazon Keyspaces",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/encryption-at-rest.html"
    }
  ]
});
