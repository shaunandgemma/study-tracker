import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-global-accelerator",
  "topicTitle": "AWS Global Accelerator",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "ga-16",
  "title": "Global Accelerator Multi-Region Applications",
  "plainEnglish": "A standard accelerator can connect one global entry point to endpoint groups in several AWS Regions. It supports active-active designs where multiple Regions serve traffic and active-passive designs where a standby Region is brought into use through traffic controls and health-based redirection.",
  "whyItMatters": "Multi-Region deployment can reduce latency for distant users and improve recovery from a Regional application failure. Global routing solves the connection path, while the application must separately handle replicated data, state, capacity, and recovery procedures.",
  "workplaceExample": "A booking platform runs active-active in Europe and North America with local databases and conflict-aware replication. A third Region is warm standby with its traffic dial lowered until disaster-recovery testing or an emergency.",
  "examFocus": "Global Accelerator can redirect new connections to healthy Regional endpoints without changing static entry addresses. It does not replicate application data, create standby capacity, or move established sessions, so recovery time and recovery point goals still need an application design.",
  "keyPoints": [
    "A listener can use endpoint groups in multiple AWS Regions.",
    "Active-active deployments keep usable capacity serving traffic in more than one Region.",
    "Active-passive deployments keep a primary path and standby capacity for recovery.",
    "Traffic dials control Regional intake, while health and endpoint weights affect destination selection.",
    "Health-based redirection applies to new connections rather than migrating active sessions.",
    "Data replication, consistency, secrets, dependencies, and sufficient failover capacity remain application responsibilities."
  ],
  "commonMistake": "Adding a second endpoint group without replicating data or provisioning enough standby capacity does not create a complete disaster-recovery solution.",
  "example": "Build two Regional stacks, validate data replication and dependencies, register both endpoint groups, rehearse primary failure with synthetic clients, and record reconnection time and application recovery results.",
  "sources": [
    {
      "title": "Understanding Global Accelerator use cases",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/introduction-benefits-of-migrating.html"
    },
    {
      "title": "How failover works for unhealthy endpoints",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoints-endpoint-weights.unhealthy-endpoints.html"
    }
  ]
});
