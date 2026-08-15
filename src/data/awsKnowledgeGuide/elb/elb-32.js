import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-32",
  "title": "ALB vs NLB vs GWLB",
  "plainEnglish": "ALB, NLB, and GWLB solve different routing problems. ALB understands web requests at Layer 7, NLB balances high-performance network flows at Layer 4, and GWLB steers IP traffic through virtual network appliances at Layer 3.",
  "whyItMatters": "Choosing by protocol and traffic behavior prevents unnecessary complexity. The right family supplies the required routing, addressing, security, and target model without forcing the application into an unsuitable interface.",
  "workplaceExample": "A platform uses ALB for customer HTTPS microservices, NLB for a partner TCP service needing fixed public addresses, and GWLB to send VPC traffic through a scalable firewall fleet.",
  "examFocus": "Map requirement words to the family: host/path/header and Lambda mean ALB; TCP/UDP, static IP, extreme Layer 4 performance, or PrivateLink often mean NLB; transparent firewall or inspection appliances and GENEVE mean GWLB.",
  "keyPoints": [
    "ALB operates at Layer 7 and routes HTTP or HTTPS using request content.",
    "NLB operates at Layer 4 and supports transport protocols, static zonal IPs, and optional Elastic IPs.",
    "GWLB operates at Layer 3 and distributes IP traffic to virtual appliances.",
    "ALB target types include instance, IP, and Lambda.",
    "NLB target types include instance, IP, and Application Load Balancer in supported configurations.",
    "GWLB architectures use endpoints, route tables, flow stickiness, and GENEVE port 6081."
  ],
  "commonMistake": "Choosing solely by expected traffic volume misses the core requirement. Start with protocol, inspection level, addressing, target type, and routing behavior, then evaluate performance and cost.",
  "example": "Use ALB for /api path rules, NLB for a TCP endpoint whose addresses partners must allow-list, and GWLB when every packet must traverse centrally managed firewall appliances.",
  "sources": [
    {
      "title": "What is an Application Load Balancer?",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html"
    },
    {
      "title": "What is a Network Load Balancer?",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html"
    },
    {
      "title": "What is a Gateway Load Balancer?",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/introduction.html"
    }
  ]
});
