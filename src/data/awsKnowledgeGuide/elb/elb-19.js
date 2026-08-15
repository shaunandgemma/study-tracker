import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-19",
  "title": "NLB Static IP Addresses",
  "plainEnglish": "A Network Load Balancer creates one load-balancer node and network interface in each enabled Availability Zone. Each node receives a static IP address, giving clients stable zonal addresses as well as the NLB's Domain Name System (DNS) name.",
  "whyItMatters": "Some partners, firewalls, and legacy clients need allow-listed destination addresses. NLB supplies stable addresses while still distributing flows across healthy targets and scaling the load-balancing service.",
  "workplaceExample": "A business-to-business service gives partners the two static zonal IP addresses of its NLB to add to outbound firewall rules, while publishing a Route 53 alias to the NLB for normal DNS-based access.",
  "examFocus": "Static IP is a strong NLB clue. Each enabled Availability Zone has its own static address; an internet-facing NLB can instead associate one chosen Elastic IP address per enabled subnet at creation.",
  "keyPoints": [
    "NLB creates a network interface in each enabled Availability Zone.",
    "Each NLB node uses a static IP address for its Availability Zone.",
    "The NLB DNS name can return the zonal node addresses.",
    "Static load-balancer IPs are different from the changing IP addresses of registered targets.",
    "Multiple Availability Zones provide multiple zonal addresses and improve fault tolerance.",
    "Clients should normally use DNS unless a documented allow-list requirement needs addresses."
  ],
  "commonMistake": "Treating one zonal IP as the whole multi-zone NLB creates a single-zone dependency. Allow or resolve every enabled zone required by the design.",
  "example": "Enable an NLB in two Availability Zones, record both zonal IP addresses for a partner allow list, publish a DNS alias, and test that traffic continues when one zone's targets are unavailable.",
  "sources": [
    {
      "title": "What is a Network Load Balancer?",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html"
    },
    {
      "title": "How Elastic Load Balancing works",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html"
    }
  ]
});
