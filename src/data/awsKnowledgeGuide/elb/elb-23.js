import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-23",
  "title": "Connection Draining and Deregistration Delay",
  "plainEnglish": "Deregistration delay is the period during which a target is marked draining after removal begins. Elastic Load Balancing stops assigning it new requests and allows in-flight work or active connections time to finish before deregistration completes.",
  "whyItMatters": "Deployments and scale-in events can terminate targets while users still have active requests. A suitable delay reduces interrupted uploads, transactions, and other long-running work.",
  "workplaceExample": "An Auto Scaling group replaces an application instance. The target enters draining, receives no new requests, finishes existing requests, and is terminated after the configured delay and lifecycle behavior.",
  "examFocus": "For ALB and current target groups, the setting is deregistration delay; 'connection draining' is the older CLB term. The default ALB deregistration delay is 300 seconds, but it should be tuned to application request duration.",
  "keyPoints": [
    "A deregistering ALB target first enters the draining state.",
    "New requests stop being assigned to the draining target.",
    "The delay allows in-flight requests to complete.",
    "The default ALB deregistration delay is 300 seconds.",
    "After deregistration completes, the target becomes unused and can be replaced.",
    "Application shutdown and Auto Scaling timing must allow the draining period to work."
  ],
  "commonMistake": "Setting deregistration delay to zero for an application with long requests can cause client errors during deployments. An excessive delay can also slow scale-in, so measure real connection duration.",
  "example": "Set the target group's deregistration delay slightly above the observed maximum request time, remove one test target, and confirm active requests finish while new requests go elsewhere.",
  "sources": [
    {
      "title": "Edit Application Load Balancer target group attributes",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html"
    }
  ]
});
