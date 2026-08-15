import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-12",
  "title": "Weighted Routing Policy",
  "plainEnglish": "Weighted Routing Policy in Amazon Route 53 allows you to associate multiple resources (endpoints) with the same domain name and control the proportion of DNS queries routed to each resource based on assigned numerical weights (e.g., from 0 to 255). Route 53 calculates the probability of returning a specific record based on its individual weight divided by the sum of all weights across the record set.",
  "whyItMatters": "Weighted routing is essential for modern deployment strategies such as Canary Deployments, Blue/Green Deployments, and A/B Testing. Rather than shifting 100% of production traffic to a new software version simultaneously, you can route a tiny fraction (e.g., 5% or 10%) of user traffic to a new release to validate performance and error rates before full rollout.",
  "workplaceExample": "A software team prepares to deploy version 2.0 of an API. They configure two Weighted Alias records for `api.example.com`: (1) Record 1 (v1.0 fleet on ALB-1) with Weight `90`, and (2) Record 2 (v2.0 fleet on ALB-2) with Weight `10`. Route 53 returns ALB-2's IP address for approximately 10% of DNS lookups (`10 / (90 + 10)`). Once telemetry confirms v2.0 is stable, the team updates the weights to 0 and 100.",
  "examFocus": "Understand Weighted Routing behavior: (1) Formula: Probability of a record being returned = `Weight of Record / Total Sum of All Weights`. (2) Weight = 0: Route 53 stops sending traffic to that record completely (unless all other records have weight 0, in which case traffic is distributed equally among all records). (3) Health Checks: When health checks are attached, Route 53 automatically recalculates weights among the remaining healthy records.",
  "keyPoints": [
    "Distributes DNS query responses across multiple endpoints based on relative assigned weights (0 to 255).",
    "Ideal for Canary deployments, A/B testing, and phased workload migrations.",
    "Setting weight to 0 stops routing traffic to that specific endpoint.",
    "If all records in a weighted set are assigned weight 0, traffic is distributed equally to all records.",
    "Supports Route 53 Health Checks to remove unhealthy endpoints and redistribute traffic among survivors.",
    "Does not guarantee exact per-request percentages due to intermediate DNS resolver caching (TTL)."
  ],
  "commonMistake": "Expecting Weighted routing to split live HTTP requests with exact mathematical precision down to the single user. Intermediate recursive DNS resolvers cache DNS answers according to the record's TTL; set a low TTL (e.g., 60 seconds) for responsive canary testing.",
  "example": "Configure a Canary deployment record sending 10% of traffic to a new server: create a weighted record for `api.example.com` with Weight=10, SetIdentifier='Canary-v2', and another record with Weight=90, SetIdentifier='Production-v1'.",
  "sources": [
    {
      "title": "Weighted Routing Policy in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-weighted.html"
    },
    {
      "title": "Choosing a Routing Policy in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html"
    }
  ]
});
