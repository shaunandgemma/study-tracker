import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-global-accelerator",
  "topicTitle": "AWS Global Accelerator",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "ga-11",
  "title": "Global Accelerator Automatic Failover",
  "plainEnglish": "When a standard accelerator detects an unhealthy endpoint, it stops selecting it for new connections and searches for a healthy endpoint, including in another endpoint group when necessary. Established connections are not automatically moved to a new endpoint.",
  "whyItMatters": "Health-based redirection supports Regional resilience without changing the accelerator's client-facing addresses or waiting for clients to refresh a DNS routing answer.",
  "workplaceExample": "An active-passive service normally routes to a primary Region. During a simulated outage, new connections use the standby Region, while clients with broken existing sessions reconnect through the unchanged accelerator address.",
  "examFocus": "Failover is for new connections and does not promise zero downtime or packet loss. Established connections can continue toward their chosen endpoint until reset or idle timeout. Custom routing accelerators do not perform health-check failover.",
  "keyPoints": [
    "Standard accelerators consider endpoint health when selecting destinations.",
    "An unhealthy endpoint is excluded from normal new-connection routing.",
    "Global Accelerator can search other Regional endpoint groups for healthy capacity.",
    "Failover logic can ignore a zero traffic dial while searching for a usable healthy endpoint.",
    "Established connections are not migrated simply because health or weight changes.",
    "If no suitable healthy endpoint is found, Global Accelerator can fail open to an endpoint."
  ],
  "commonMistake": "Expecting an in-progress TCP session to move seamlessly to another Region is unrealistic. Applications and clients need reconnection, retry, and state-recovery behavior.",
  "example": "Deploy active and standby Regional endpoint groups, test application data recovery, mark the primary endpoint unhealthy, and measure how new connections recover while documenting behavior for existing sessions.",
  "sources": [
    {
      "title": "How failover works for unhealthy endpoints",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoints-endpoint-weights.unhealthy-endpoints.html"
    },
    {
      "title": "How AWS Global Accelerator works",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/introduction-how-it-works.html"
    }
  ]
});
