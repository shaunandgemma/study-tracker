import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-10",
  "title": "Target Groups",
  "plainEnglish": "A target group is a logical collection of destinations that receive traffic from a load balancer. It defines how the load balancer contacts targets and how their health is checked, while listeners and rules choose which target group receives traffic.",
  "whyItMatters": "Target groups separate routing for different applications and versions. Teams can give each service its own ports, health endpoint, target type, and deployment lifecycle without creating a separate load balancer.",
  "workplaceExample": "An ALB listener sends /api/* to an API target group on port 8080 and all other requests to a website target group on port 80. Each group uses a health check suited to its application.",
  "examFocus": "Know the relationship: listener accepts traffic, rule selects a target group, target group selects a healthy registered target. Health checks and attributes such as deregistration delay and stickiness belong to the target group.",
  "keyPoints": [
    "A target group defines a target type, protocol, port, registered targets, and health-check settings.",
    "A listener rule forwards matching traffic to one or more target groups.",
    "Health checks run for registered targets in target groups used by the load balancer.",
    "One target can be registered with multiple target groups.",
    "A target can be registered on a port that differs from the target group's default port.",
    "Target groups are associated with one load balancer type and are not interchangeable across load-balancer families."
  ],
  "commonMistake": "Registering targets does not expose them automatically. The target group must be referenced by a listener action, targets must pass health checks, and network controls must permit the data and health-check traffic.",
  "example": "Create a target group for an application on HTTP port 8080, configure /health as its check path, register two instances, and point an ALB listener rule at the group only after both targets become healthy.",
  "sources": [
    {
      "title": "Target groups for Application Load Balancers",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html"
    }
  ]
});
