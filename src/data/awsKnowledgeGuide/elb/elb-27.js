import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-27",
  "title": "Internet-Facing vs Internal Load Balancers",
  "plainEnglish": "A load balancer's scheme controls who can reach its nodes. Internet-facing load balancers have publicly reachable addresses and accept internet traffic when network controls allow it. Internal load balancers use only private addresses for clients with connectivity to the VPC.",
  "whyItMatters": "The scheme establishes the application's exposure boundary. Public web entry points and private service-to-service endpoints often need different load balancers even when they use similar listeners and targets.",
  "workplaceExample": "A public ALB receives customer HTTPS requests for a web tier. The web tier calls an internal ALB for private application services, so those services have no direct internet entry point.",
  "examFocus": "Choose internet-facing for public clients and internal for VPC-connected clients. Both schemes send traffic to registered targets using private IP addresses, so targets behind an internet-facing load balancer do not need public IPs.",
  "keyPoints": [
    "Internet-facing load-balancer nodes have public addresses.",
    "Internal load-balancer nodes have only private addresses.",
    "An internal load balancer can be reached only by clients with network access to its VPC addresses.",
    "Both schemes route from load-balancer nodes to targets through private IP addresses.",
    "The scheme does not replace security groups, network access control lists, routes, or application authorization.",
    "A multi-tier design can use a public load balancer in front and an internal one between private tiers."
  ],
  "commonMistake": "Giving every target a public IP because the load balancer is internet-facing unnecessarily exposes infrastructure. Place targets in suitable private subnets and allow traffic from the load balancer.",
  "example": "Deploy an internet-facing ALB across public subnets for the website and an internal ALB across private subnets for the application API, with target groups containing private instances.",
  "sources": [
    {
      "title": "How Elastic Load Balancing works",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html"
    }
  ]
});
