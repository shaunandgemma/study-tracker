import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-21",
  "title": "Gateway Load Balancer for Virtual Network Appliances",
  "plainEnglish": "Gateway Load Balancer centralizes fleets of virtual appliances such as firewalls, intrusion detection and prevention systems, and packet-inspection products. It transparently distributes routed IP traffic to healthy appliances and keeps each flow on an appropriate target.",
  "whyItMatters": "Without GWLB, teams must build custom routing and scaling around individual appliances. GWLB allows consistent inspection across many application networks while appliance fleets scale or recover.",
  "workplaceExample": "A security team operates firewall appliances in a central VPC. Application VPC route tables send inbound and outbound traffic to local GWLB endpoints, which carry it privately to the inspection fleet.",
  "examFocus": "Look for scalable third-party or virtual network appliances and centralized inspection. The design uses GWLB in the appliance VPC, endpoint services and GWLB endpoints across VPCs, route-table steering, health checks, and GENEVE port 6081.",
  "keyPoints": [
    "GWLB combines a transparent network gateway with load distribution.",
    "Registered targets are virtual appliance instances or IP addresses, depending on supported configuration.",
    "GENEVE encapsulation on port 6081 carries traffic between GWLB and appliances.",
    "Flow stickiness ensures packets from the same flow use a consistent appliance.",
    "Gateway Load Balancer endpoints use AWS PrivateLink connectivity across VPC boundaries.",
    "Route tables must direct both the intended traffic and return path through the inspection architecture."
  ],
  "commonMistake": "Deploying a healthy GWLB and endpoint without changing the relevant route tables sends no traffic through the appliances. Routing is a core part of the design.",
  "example": "Register firewall instances in a GWLB target group, expose it through an endpoint service, create an endpoint in an application VPC, and set application-subnet routes to use that endpoint as the next hop.",
  "sources": [
    {
      "title": "What is a Gateway Load Balancer?",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/introduction.html"
    }
  ]
});
