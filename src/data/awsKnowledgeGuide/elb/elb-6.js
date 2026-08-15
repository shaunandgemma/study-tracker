import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-6",
  "title": "Network Load Balancer - NLB",
  "plainEnglish": "A Network Load Balancer (NLB) distributes connections and network flows at Layer 4, the transport layer. It selects a healthy target using connection information such as protocol, addresses, and ports rather than inspecting web paths or headers.",
  "whyItMatters": "NLB is designed for very high-performance network traffic, low latency, static load-balancer IP addresses, and protocols that an HTTP-aware load balancer does not handle.",
  "workplaceExample": "A payment service exposes a TLS endpoint that partner firewalls must allow by IP address. An internet-facing NLB uses one Elastic IP address in each enabled Availability Zone and forwards traffic to healthy service instances.",
  "examFocus": "Choose NLB for TCP, TLS, UDP, or other supported Layer 4 flow requirements, millions of requests per second, static IP addresses, source-IP behavior, or PrivateLink service endpoints. Choose ALB when routing must inspect HTTP content.",
  "keyPoints": [
    "NLB operates at OSI Layer 4 and selects targets for network flows.",
    "Network target groups support TCP, UDP, TCP_UDP, TLS, QUIC, and TCP_QUIC protocols.",
    "Each enabled Availability Zone receives a load-balancer node and static IP address.",
    "An internet-facing NLB can use one Elastic IP address per enabled subnet.",
    "A listener forwards traffic to a target group using its configured protocol and port.",
    "Enable multiple Availability Zones and place healthy targets in each for fault tolerance."
  ],
  "commonMistake": "Expecting host-based or path-based routing from an NLB confuses Layer 4 and Layer 7 features. Use an ALB when rules must inspect HTTP request content.",
  "example": "Create an NLB with a TLS listener on port 443, register application instances in a TCP target group, enable two Availability Zones, and confirm health checks succeed before changing DNS.",
  "sources": [
    {
      "title": "What is a Network Load Balancer?",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html"
    }
  ]
});
