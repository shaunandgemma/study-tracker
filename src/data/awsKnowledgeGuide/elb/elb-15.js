import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-15",
  "title": "ALB Path-Based Routing",
  "plainEnglish": "Path-based routing selects a listener rule from the URL path, such as /api/* or /images/*. It sends different parts of one website to separate target groups behind the same ALB.",
  "whyItMatters": "Path rules are useful for microservices and gradual application decomposition because clients keep one hostname while each service scales and deploys independently.",
  "workplaceExample": "A news site routes /video/* to media containers, /account/* to an identity service, and all other paths to its main web application.",
  "examFocus": "Choose ALB when a question requires routing by URL path. A path-pattern condition examines the normalized path, not query parameters, and routing does not automatically rewrite the request path.",
  "keyPoints": [
    "Path-pattern conditions inspect the path portion of the request URL.",
    "Path matching is case-sensitive.",
    "Wildcards and supported regular expressions can match groups of paths.",
    "The original path is forwarded unless an explicit URL rewrite transform is configured.",
    "Query parameters are not part of a path-pattern comparison.",
    "More specific rules normally need priorities ahead of broad catch-all patterns."
  ],
  "commonMistake": "Expecting /api/* to strip /api before forwarding is incorrect. A path routing condition chooses a target; it does not modify the path by itself.",
  "example": "Give /api/* a lower-numbered priority than a general /* rule, forward it to the API target group, and ensure the API service accepts requests that still include the /api prefix.",
  "sources": [
    {
      "title": "Condition types for ALB listener rules",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/rule-condition-types.html"
    }
  ]
});
