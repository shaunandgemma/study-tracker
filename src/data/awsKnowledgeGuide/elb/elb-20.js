import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-20",
  "title": "NLB Elastic IP Addresses",
  "plainEnglish": "When creating an internet-facing NLB, you can associate one Elastic IP address with the load-balancer node in each enabled subnet. Elastic IP addresses are public IPv4 addresses allocated to your AWS account.",
  "whyItMatters": "Account-owned public addresses make external firewall allow lists and controlled migrations easier because the chosen addresses can be known before clients connect.",
  "workplaceExample": "A payments team allocates two Elastic IP addresses, assigns one to each NLB subnet in separate Availability Zones during creation, and sends both addresses to a bank for allow-listing.",
  "examFocus": "Elastic IP association is an NLB feature for internet-facing load balancers and is per enabled subnet. Distinguish a chosen Elastic IP from the static address AWS automatically assigns to an NLB node.",
  "keyPoints": [
    "An internet-facing NLB can associate one Elastic IP address per enabled subnet.",
    "Elastic IP mappings are selected while the NLB is created.",
    "Each address belongs to the NLB node in one Availability Zone.",
    "Using multiple zones therefore requires multiple Elastic IP addresses.",
    "The NLB still has a DNS name even when Elastic IP addresses are assigned.",
    "Elastic IPs solve fixed public IPv4 addressing, not HTTP content routing."
  ],
  "commonMistake": "Allocating one Elastic IP for a two-zone NLB is insufficient because the mapping is per subnet. Plan one address for every enabled Availability Zone.",
  "example": "Allocate two Elastic IP addresses, create an internet-facing NLB with two subnet mappings, assign one allocation to each mapping, and verify partner connectivity through both addresses.",
  "sources": [
    {
      "title": "What is a Network Load Balancer?",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html"
    }
  ]
});
