import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-28', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'VPC Sharing with AWS RAM', status: 'ready',
  plainEnglish: 'VPC sharing lets a VPC owner share selected subnets with participant accounts in the same AWS Organizations organization through AWS Resource Access Manager. Participants launch supported resources into the shared subnets, while the VPC owner retains control of the VPC, subnets, route tables, network ACLs, gateways, and other central networking components.',
  whyItMatters: 'Sharing centralises network ownership while allowing application teams to own their workloads. It reduces the number of separate VPCs and avoids peering for resources that can share one network, but requires clear responsibility for IP capacity, routes, DNS, security groups, quotas, and incident response.',
  workplaceExample: 'A network account owns production subnets and shares application subnets with workload accounts. The platform team manages routes, NACLs, NAT, and IP allocation; application teams create instances and their own security groups within documented guardrails.',
  examFocus: 'SAA-C03: share subnets, not the entire ownership model; owner and participants must be in the same organization; owner controls central VPC networking; participants create supported resources and manage those resources; sharing is not VPC peering.',
  keyPoints: [
    'AWS RAM shares selected VPC subnets with participant accounts in the same organization.',
    'The VPC owner controls VPC-level networking resources and subnet configuration.',
    'Participants can create and manage supported resources they own in shared subnets.',
    'Participants cannot modify the owner’s route tables, NACLs, NAT gateways, or internet gateways.',
    'Security groups remain account-owned resources and cross-account references follow documented support boundaries.',
    'Capacity planning and responsibility boundaries are essential because several accounts consume one subnet address space.'
  ],
  commonMistake: 'Expecting a participant account to repair a route-table or NACL problem in a shared subnet. Those network controls remain the VPC owner’s responsibility.',
  example: 'The network account shares app-subnet-a and app-subnet-b with a workload account. The workload account launches application resources, but asks the network owner to add a required private route after change approval.',
  sources: [{ title: 'Share your VPC with other accounts', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-sharing.html' }]
});
