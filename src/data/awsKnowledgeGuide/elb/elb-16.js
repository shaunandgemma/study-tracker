import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-16",
  "title": "ALB HTTP Header and Query String Routing",
  "plainEnglish": "ALB listener rules can inspect standard or custom HTTP headers and URL query-string values. Matching requests can be forwarded, redirected, or answered differently without changing the public endpoint.",
  "whyItMatters": "Header and query routing supports controlled feature releases, client-version separation, device-specific services, and other application-aware decisions at the load-balancer layer.",
  "workplaceExample": "Requests containing X-Release-Channel: beta go to a canary target group, while ordinary requests use the stable group. A separate rule handles a query parameter used by a legacy client.",
  "examFocus": "Remember that http-header and query-string are ALB Layer 7 conditions. A rule can include multiple such conditions; all conditions on the rule must be satisfied, while multiple values inside one condition provide alternative matches.",
  "keyPoints": [
    "HTTP-header conditions can inspect standard or custom header names.",
    "Header name and value matching is not case-sensitive.",
    "Query-string conditions can match a key/value pair or a value without a named key.",
    "Supported wildcards include * and ? for value matching.",
    "A rule can combine header or query conditions with host, path, method, or source-IP conditions.",
    "Listener priorities determine which matching rule is applied first."
  ],
  "commonMistake": "Using a client-controlled header as the only security boundary is unsafe. Routing conditions choose a destination; authentication and authorization must still protect the application.",
  "example": "Add a high-priority rule matching X-Release-Channel=beta and forward it to a small canary target group. Keep the default rule on the stable group and monitor both before expanding the release.",
  "sources": [
    {
      "title": "Condition types for ALB listener rules",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/rule-condition-types.html"
    }
  ]
});
