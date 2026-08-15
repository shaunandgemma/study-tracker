import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-17', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'Security Groups vs Network ACLs', status: 'ready',
  plainEnglish: 'Security groups and network ACLs filter traffic at different layers. A security group is stateful, attaches to supported network interfaces or resources, and has allow rules. A NACL is stateless, attaches to subnets, uses ordered allow and deny rules, and requires explicit return-path rules. They can work together as defence in depth.',
  whyItMatters: 'Troubleshooting requires checking both layers. An allowed security-group flow can still be blocked by a NACL, and a permissive NACL cannot override a restrictive security group. Choosing the correct layer prevents fragile rules and overly broad access.',
  workplaceExample: 'Application groups define least-privilege communication between a load balancer, application servers, and a database. NACLs retain broad subnet guardrails and a specific emergency deny list without duplicating every workload rule.',
  examFocus: 'SAA-C03 comparison: SG = resource-level, stateful, allow only, all rules considered. NACL = subnet-level, stateless, allow and deny, lowest numbered match first. Both still depend on correct routes.',
  keyPoints: [
    'Security groups protect associated resource interfaces; NACLs protect associated subnet boundaries.',
    'Security groups are stateful, while NACLs are stateless.',
    'Security groups contain allow rules; NACLs contain allow and deny rules.',
    'All applicable security-group rules are combined, while NACL processing stops at the first numbered match.',
    'NACLs require explicit return-traffic and ephemeral-port planning.',
    'Neither control creates a route or replaces identity and application-layer security.'
  ],
  commonMistake: 'Opening response ports in a security group because NACLs require them. Stateful security groups automatically permit return traffic; the stateless NACL is the layer that needs matching directional rules.',
  example: 'An HTTPS request must match a route, the subnet NACL inbound rule, and the resource security-group inbound rule. Its response is statefully allowed by the SG but must match the NACL outbound rule.',
  sources: [{ title: 'Compare security groups and network ACLs', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html' }]
});
