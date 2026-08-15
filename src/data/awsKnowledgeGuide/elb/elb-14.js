import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-14",
  "title": "ALB Host-Based Routing",
  "plainEnglish": "Host-based routing uses the HTTP Host header to choose a listener rule. It lets one ALB serve several domain names or subdomains and forward each hostname to a different target group.",
  "whyItMatters": "Organizations can share one scalable entry point across multiple sites while keeping the applications, deployments, and health checks separate.",
  "workplaceExample": "Requests for api.example.com go to an API target group, admin.example.com goes to an administration service, and unmatched hosts receive the listener's default action.",
  "examFocus": "Look for multiple domains or subdomains on one ALB. Host-header conditions support exact values, wildcards, and regular-expression matching; rule priority still determines which matching rule wins.",
  "keyPoints": [
    "Host routing examines the hostname in the HTTP Host header.",
    "A single ALB can route multiple domains and subdomains.",
    "Host conditions can use value or regular-expression matching.",
    "Wildcards such as *.example.com do not necessarily match the base domain example.com.",
    "Rules are checked in priority order, not in the order targets were registered.",
    "DNS records for each hostname still need to point clients to the ALB."
  ],
  "commonMistake": "Creating the listener rule without configuring DNS does not send clients to the ALB. Also test the base domain separately when using a wildcard host condition.",
  "example": "Point api.example.com and images.example.com to the same ALB, then add a higher-priority host-header rule for api.example.com and another for images.example.com, each forwarding to its own target group.",
  "sources": [
    {
      "title": "Condition types for ALB listener rules",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/rule-condition-types.html"
    }
  ]
});
