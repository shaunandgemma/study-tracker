import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-24",
  "title": "Sticky Sessions",
  "plainEnglish": "Sticky sessions, also called session affinity, use a cookie so repeated requests from one client are routed to the same target. ALB configures stickiness as a target-group attribute and supports load-balancer-generated or application-based cookies in applicable scenarios.",
  "whyItMatters": "Some older applications keep session state in local memory and need a returning user to reach the same server. Stickiness can provide continuity while that design is modernized.",
  "workplaceExample": "A legacy shopping application stores carts in instance memory. The ALB sets a cookie that keeps each shopper on one healthy target for the configured duration.",
  "examFocus": "Sticky sessions are not a substitute for shared session storage. They can create uneven load and cannot guarantee a failed target remains available. Know that stickiness is enabled at target-group level and cookie behavior varies by configuration.",
  "keyPoints": [
    "Stickiness keeps requests from a client associated with a selected target.",
    "ALB stickiness is configured as a target-group attribute.",
    "Duration-based stickiness uses an AWS-generated load-balancer cookie.",
    "Application-based stickiness uses a cookie created by the target application.",
    "The initial target is selected by the routing algorithm; later sticky requests bypass normal selection.",
    "If the target becomes unhealthy, the load balancer routes the request to a healthy target."
  ],
  "commonMistake": "Relying on stickiness for durable session data means a target failure can still lose the session. Prefer external shared state when the application supports it.",
  "example": "Enable duration-based stickiness for a short migration period, set a measured cookie duration, monitor uneven target load, and plan to move sessions into a shared database or cache.",
  "sources": [
    {
      "title": "Edit Application Load Balancer target group attributes",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html"
    }
  ]
});
