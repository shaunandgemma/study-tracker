import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-keyspaces",
  "topicTitle": "Amazon Keyspaces",
  "objectiveCode": "Databases",
  "status": "ready",
  "id": "keyspaces-9",
  "title": "Keyspaces Multi-Region Replication",
  "plainEnglish": "Amazon Keyspaces Multi-Region Replication allows you to create fully managed, active-active multi-Region keyspaces and tables across multiple AWS Regions. Data written to a table in one AWS Region is automatically and asynchronously replicated to all other replica Regions within milliseconds, providing low-latency local read and write access for global users and automated cross-region disaster recovery.",
  "whyItMatters": "Global web and mobile applications require sub-10 millisecond database latencies for users around the world, as well as business continuity if an entire AWS Region experiences an outage. Multi-Region replication provides automated, serverless active-active database replication with an industry-leading 99.999% availability SLA without requiring complex cross-region networking setups or custom replication scripts.",
  "workplaceExample": "A global media streaming platform serves users in North America and Europe. They create a multi-region keyspace across us-east-1 and eu-west-1. American users read and write user watch-history locally to us-east-1, while European users read and write locally to eu-west-1. Keyspaces automatically synchronizes watch progress across both regions in real time.",
  "examFocus": "Understand Multi-Region Keyspaces architecture: (1) Active-Active: Applications can read and write to any replica region locally. (2) Asynchronous replication provides eventual consistency across regions. (3) Conflict resolution uses client-side timestamps (last-write-wins). (4) Keyspaces replication strategy is specified at the keyspace level using 'MultiRegionStrategy' and region list.",
  "keyPoints": [
    "Provides fully managed, active-active cross-region data replication across multiple AWS Regions.",
    "Delivers local read and write latencies for globally distributed applications and users.",
    "Backed by an enterprise 99.999% (five nines) availability Service Level Agreement (SLA).",
    "Uses client-side timestamps for conflict resolution, applying the standard Cassandra 'last-write-wins' rule.",
    "Replication strategy is configured at the keyspace level by specifying 'MultiRegionStrategy' with the desired list of AWS Regions.",
    "Capacity modes (On-Demand or Provisioned) are managed per region, allowing different capacity settings based on regional traffic demand."
  ],
  "commonMistake": "Assuming cross-region replication is strongly consistent synchronously. Multi-region replication is asynchronous; local reads within a single region can use LOCAL_QUORUM for strong consistency locally, but cross-region data propagation is eventually consistent.",
  "example": "Create a multi-region keyspace spanning two AWS Regions in CQL: CREATE KEYSPACE global_ecommerce WITH replication = {'class': 'MultiRegionStrategy', 'region_list': ['us-east-1', 'eu-west-1']};",
  "sources": [
    {
      "title": "Multi-Region Replication in Amazon Keyspaces",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/multiRegion-replication.html"
    },
    {
      "title": "Creating Multi-Region Keyspaces and Tables",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/multiRegion-creating.html"
    }
  ]
});
