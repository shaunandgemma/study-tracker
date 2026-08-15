import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-13",
  "title": "ALB Layer 7 HTTP and HTTPS Load Balancing",
  "plainEnglish": "An ALB understands HTTP and HTTPS request content because it operates at Layer 7. It can terminate HTTPS, evaluate ordered listener rules, and then forward, redirect, or return a fixed response according to application-level conditions.",
  "whyItMatters": "Layer 7 awareness lets one load balancer route many websites and services, enforce HTTPS redirects, and make routing decisions without adding that logic to every server.",
  "workplaceExample": "An ALB terminates HTTPS for a retail site, redirects HTTP clients to HTTPS, sends API requests to containers, and returns a fixed maintenance response for a temporarily disabled path.",
  "examFocus": "Choose ALB for content-based HTTP routing. Listener rules require exactly one final routing action—forward, redirect, or fixed response—and are evaluated from lowest priority number to highest before the default rule.",
  "keyPoints": [
    "ALB supports HTTP and HTTPS listeners at Layer 7.",
    "HTTPS listeners require a server certificate and can offload encryption work.",
    "Rules can forward to target groups, redirect clients, or return fixed responses.",
    "Rule conditions inspect request attributes such as host, path, headers, methods, query strings, and source IP.",
    "The default rule has no conditions and runs last.",
    "ALB can use HTTP/1.1, HTTP/2, or gRPC protocol versions toward appropriate target groups."
  ],
  "commonMistake": "Assuming an ALB forwards encrypted HTTPS unchanged is wrong when using an HTTPS listener. The ALB terminates the client TLS connection; configure HTTPS to targets separately if back-end encryption is required.",
  "example": "Create port 80 and 443 listeners, redirect port 80 to HTTPS, attach a certificate to port 443, and forward requests to a healthy HTTP target group using ordered rules.",
  "sources": [
    {
      "title": "What is an Application Load Balancer?",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html"
    },
    {
      "title": "Listener rules for Application Load Balancers",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-rules.html"
    }
  ]
});
