import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-14', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'Egress-Only Internet Gateway for IPv6', status: 'ready',
  plainEnglish: 'An egress-only internet gateway lets IPv6 resources in a VPC initiate outbound internet connections while preventing hosts on the internet from initiating new connections through that gateway. It is an IPv6 routing component, not an IPv4 NAT device, because globally unique IPv6 addresses do not normally require address translation.',
  whyItMatters: 'A private dual-stack workload needs separate egress designs for each family. NAT commonly handles IPv4, while an egress-only IGW handles outbound-only IPv6. Without this distinction, adding an ordinary IGW IPv6 route can unintentionally create a path for inbound traffic when security rules permit it.',
  workplaceExample: 'Private application subnets route 0.0.0.0/0 to NAT and ::/0 to an egress-only IGW. The team adds explicit IPv6 security-group and NACL rules, then tests outbound package retrieval and blocked unsolicited inbound sessions.',
  examFocus: 'SAA-C03: egress-only IGW is for initiated outbound IPv6 with stateful return traffic. It does not translate IPv6, does not handle IPv4, and requires a ::/0 or more-specific IPv6 route.',
  keyPoints: [
    'An egress-only internet gateway operates on IPv6 traffic.',
    'It allows VPC resources to initiate outbound connections and permits associated response traffic.',
    'It blocks new connections initiated from the internet through that gateway.',
    'It performs no IPv4-style NAT for normal IPv6 traffic.',
    'The subnet route table must direct the intended IPv6 prefix, often ::/0, to the gateway.',
    'Security groups and NACLs still require correct IPv6 rules.'
  ],
  commonMistake: 'Creating an egress-only internet gateway but adding only an IPv4 default route, which never matches the IPv6 traffic.',
  example: 'A dual-stack private instance uses NAT for IPv4 and eigw-example for IPv6. Both paths have separate routes and are tested independently.',
  sources: [{ title: 'Enable outbound IPv6 using an egress-only internet gateway', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/egress-only-internet-gateway.html' }]
});
