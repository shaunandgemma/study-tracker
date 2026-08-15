import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-22",
  "title": "Cross-Zone Load Balancing",
  "plainEnglish": "Cross-zone load balancing controls whether a load-balancer node can send traffic to healthy targets in every enabled Availability Zone or only to targets in its own zone.",
  "whyItMatters": "When target counts are uneven, cross-zone routing can distribute work more evenly. The choice also affects zonal independence, architecture behavior, and possible regional data-transfer considerations.",
  "workplaceExample": "An NLB has two targets in one zone and eight in another. Enabling cross-zone load balancing lets both NLB nodes select from all ten targets instead of overloading the smaller zonal pool.",
  "examFocus": "With cross-zone enabled, every node uses targets in all enabled zones; disabled means local-zone targets only. ALB enables it at load-balancer level, though it can be disabled per target group. NLB and GWLB have it disabled by default.",
  "keyPoints": [
    "Cross-zone enabled means each load-balancer node can route to targets in all enabled zones.",
    "Cross-zone disabled limits a node to targets in its own Availability Zone.",
    "ALB always enables cross-zone behavior at the load-balancer level.",
    "ALB target groups can override by disabling cross-zone load balancing.",
    "NLB and GWLB have cross-zone load balancing disabled by default.",
    "Balanced healthy capacity in every enabled zone remains important for resilience."
  ],
  "commonMistake": "Assuming all ELB types have the same default leads to incorrect traffic predictions. Check both the load-balancer family and any target-group override.",
  "example": "For an NLB with uneven zonal capacity, enable cross-zone balancing and monitor target load. If zonal isolation is required instead, leave it disabled and provision enough healthy targets in each zone.",
  "sources": [
    {
      "title": "How Elastic Load Balancing works",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html"
    }
  ]
});
