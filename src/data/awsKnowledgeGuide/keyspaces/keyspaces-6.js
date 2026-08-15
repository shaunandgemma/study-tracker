import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-keyspaces",
  "topicTitle": "Amazon Keyspaces",
  "objectiveCode": "Databases",
  "status": "ready",
  "id": "keyspaces-6",
  "title": "Keyspaces On-Demand Capacity",
  "plainEnglish": "On-Demand capacity mode in Amazon Keyspaces is a flexible, pay-per-request billing option where you do not specify how much read or write throughput your application expects to use. Instead, Amazon Keyspaces instantly accommodates your application's traffic as it ramps up or down, and you are billed strictly for the actual read and write request units (RRUs and WRUs) consumed by your queries.",
  "whyItMatters": "New applications, development environments, and workloads with sporadic or unpredictable traffic spikes often suffer throttling if under-provisioned, or rack up excessive costs if over-provisioned. On-Demand mode eliminates throughput capacity planning entirely, allowing tables to scale to hundreds of thousands of requests per second without configuration changes.",
  "workplaceExample": "A marketing agency runs seasonal sweepstakes campaigns with viral, unpredictable spikes in user registrations. Instead of calculating peak throughput and paying for idle capacity during dormant months, they create their Amazon Keyspaces campaign tables in On-Demand mode. When 50,000 users sign up concurrently during a Super Bowl ad, Keyspaces absorbs the burst without throttling.",
  "examFocus": "Understand On-Demand billing units in Keyspaces: (1) One Write Request Unit (WRU) covers up to 1 KB of data written. (2) One Read Request Unit (RRU) covers up to 4 KB of data read strongly consistently (LOCAL_QUORUM) or two 4 KB reads eventually consistently (LOCAL_ONE). Choose On-Demand when workloads are new, unpredictable, or idle for extended periods.",
  "keyPoints": [
    "Eliminates capacity planning and the need to configure RCUs or WCUs in advance.",
    "Billed strictly per request unit: Write Request Units (WRUs) and Read Request Units (RRUs).",
    "One WRU handles up to 1 KB of data written; one RRU handles up to 4 KB of data read strongly consistently (LOCAL_QUORUM).",
    "Instantly scales up to previously achieved peak traffic levels and ramps up smoothly to absorb sudden traffic surges.",
    "Supports converting existing provisioned tables to On-Demand capacity mode once every 24 hours.",
    "Best suited for unknown traffic patterns, development/testing environments, and spiky or serverless workloads."
  ],
  "commonMistake": "Using On-Demand capacity mode for high-volume, continuous 24/7 baseline traffic. When traffic is steady and predictable, Provisioned capacity mode with Auto Scaling is significantly more economical.",
  "example": "Set a table to On-Demand capacity mode in CQL: ALTER TABLE ecommerce.shopping_carts WITH CUSTOM_PROPERTIES = {'capacity_mode': {'throughput_mode': 'PAY_PER_REQUEST'}};",
  "sources": [
    {
      "title": "On-Demand Throughput Capacity in Amazon Keyspaces",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/ReadWriteCapacityMode.html#ReadWriteCapacityMode.OnDemand"
    },
    {
      "title": "Amazon Keyspaces Pricing and Units",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/ReadWriteCapacityMode.html"
    }
  ]
});
