import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-16', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'Network ACLs - NACLs', status: 'ready',
  plainEnglish: 'A network ACL is a stateless set of numbered allow and deny rules applied at a subnet boundary. Inbound and outbound packets are evaluated separately in ascending rule-number order, and the first matching rule decides the result. Because it is stateless, response traffic must be explicitly permitted, often including the relevant ephemeral-port range.',
  whyItMatters: 'NACLs provide a coarse subnet-level control and can explicitly block address ranges. They are useful as defence in depth, but incorrect rule order or missing return rules can disrupt every resource in associated subnets. Security groups usually provide the primary workload-level policy.',
  workplaceExample: 'A security response temporarily denies a known malicious CIDR in the NACL protecting a public subnet. Engineers choose an earlier rule number than the broad allow, add the required outbound and return behaviour, test legitimate traffic, and document removal criteria.',
  examFocus: 'SAA-C03: NACLs are stateless, subnet-scoped, numbered, first-match, and support allow plus deny. Each subnet uses one NACL; one NACL can cover multiple subnets. Return traffic requires explicit rules.',
  keyPoints: [
    'Network ACLs apply to all traffic entering or leaving associated subnets.',
    'Rules are evaluated from the lowest number upward until the first match.',
    'NACLs support both allow and deny actions.',
    'Stateless evaluation means inbound and outbound response traffic must both be permitted.',
    'The default NACL and a newly created custom NACL begin with different default rule behaviour.',
    'Ephemeral ports often need explicit allowance for response connections.'
  ],
  commonMistake: 'Adding an allow rule after a lower-numbered deny rule and expecting it to take effect. The first matching NACL rule has already decided the packet.',
  example: 'Inbound HTTPS is allowed to a public subnet, and outbound ephemeral response ports are allowed to clients. A low-numbered deny for an abusive CIDR takes precedence over the broader allow.',
  sources: [{ title: 'Control subnet traffic with network ACLs', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html' }]
});
