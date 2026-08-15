import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-7",
  "title": "Gateway Load Balancer - GWLB",
  "plainEnglish": "A Gateway Load Balancer (GWLB) inserts and scales virtual network appliances such as firewalls and intrusion prevention systems. It acts as a transparent gateway at Layer 3 and distributes IP packets to healthy appliance instances.",
  "whyItMatters": "Security inspection often needs all traffic to pass through a fleet of appliances without changing application endpoints. GWLB combines traffic steering, appliance health checks, load distribution, and scaling.",
  "workplaceExample": "Several application VPCs send traffic through Gateway Load Balancer endpoints to a central inspection VPC. GWLB distributes each flow across a fleet of third-party firewall appliances and returns inspected traffic.",
  "examFocus": "Choose GWLB for transparent deployment of virtual network appliances. Remember Gateway Load Balancer endpoints, route-table steering, Layer 3 operation, flow stickiness, and GENEVE encapsulation on port 6081.",
  "keyPoints": [
    "GWLB operates at OSI Layer 3 and listens for IP packets across all ports.",
    "Typical targets are virtual firewalls, intrusion detection systems, and deep packet inspection appliances.",
    "GWLB and appliances exchange traffic using GENEVE on port 6081.",
    "Flow stickiness keeps a flow on the same appliance target.",
    "Gateway Load Balancer endpoints provide private connectivity across VPC boundaries.",
    "Route tables direct application traffic through the endpoint and inspection path."
  ],
  "commonMistake": "Using GWLB as a normal web front end is incorrect. It is for transparent network-appliance insertion; ALB and NLB serve application endpoints directly.",
  "example": "Deploy firewall instances in an inspection VPC, register them in a GWLB target group, create endpoints in consumer VPCs, and update application-subnet routes so traffic passes through the endpoints.",
  "sources": [
    {
      "title": "What is a Gateway Load Balancer?",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/introduction.html"
    }
  ]
});
