import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-5",
  "title": "Application Load Balancer - ALB",
  "plainEnglish": "An Application Load Balancer (ALB) distributes HTTP and HTTPS requests at Layer 7, the application layer of the Open Systems Interconnection (OSI) model. It reads request details and applies listener rules before sending each request to a healthy target.",
  "whyItMatters": "ALB can expose several web applications or microservices through one endpoint and route each request by content. This reduces duplicated load balancers and lets each service use its own target group and health check.",
  "workplaceExample": "A company uses one ALB for shop.example.com. Requests to /orders go to an order-service target group, while /images goes to a media-service target group running on different containers.",
  "examFocus": "Choose ALB for HTTP or HTTPS workloads that need Layer 7 routing, redirects, fixed responses, user authentication, WebSockets, or targets such as IP addresses and Lambda functions. Do not choose it merely for static IP addresses or non-HTTP traffic.",
  "keyPoints": [
    "ALB operates at OSI Layer 7 and supports HTTP and HTTPS listeners.",
    "Listener rules are evaluated in priority order, followed by the required default rule.",
    "Rules can route by host, path, HTTP header, method, query string, and source IP address.",
    "Targets are organized into target groups with independent health checks and routing settings.",
    "Supported ALB target types include instance, IP, and Lambda.",
    "Deploy across multiple Availability Zones and keep healthy targets available in each selected zone."
  ],
  "commonMistake": "Assuming ALB is the best choice for every protocol is incorrect. A raw TCP, UDP, or fixed-IP requirement generally points to a Network Load Balancer instead.",
  "example": "Create an HTTPS listener on port 443, attach an AWS Certificate Manager certificate, add a /api/* rule forwarding to an API target group, and retain a default rule for the web target group.",
  "sources": [
    {
      "title": "What is an Application Load Balancer?",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html"
    }
  ]
});
