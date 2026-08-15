import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-34', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'Bastion Hosts and Private Instance Access', status: 'ready',
  plainEnglish: 'A bastion host is a hardened, tightly controlled entry server used to reach private resources. It commonly sits in a public or otherwise reachable management subnet and forwards administrator connections. AWS Systems Manager Session Manager and EC2 Instance Connect Endpoint can provide private-instance access without operating a traditional internet-facing bastion when their prerequisites fit the workload.',
  whyItMatters: 'Administration paths are highly privileged and frequent attack targets. A bastion adds patching, logging, key, availability, and exposure responsibilities. Managed private-access methods can reduce inbound ports and public addresses, but still require correct IAM, agents or endpoints, security groups, routes, and audit configuration.',
  workplaceExample: 'A company replaces shared SSH bastions with Session Manager for supported instances. Instance roles, SSM Agent connectivity, session logging, least-privilege user access, and emergency procedures are tested before the public bastion and its inbound SSH rule are retired.',
  examFocus: 'SAA-C03: bastions provide controlled jump access but must be hardened and highly available. Session Manager avoids inbound SSH/RDP and public IPs when configured. EC2 Instance Connect Endpoint offers supported private connectivity without an IGW. Choose by protocol, platform, audit, and operational requirements.',
  keyPoints: [
    'A bastion concentrates administrative entry and therefore requires strict hardening and monitoring.',
    'Its security group should allow administration only from approved sources, not the entire internet.',
    'Private targets should allow the management protocol only from the intended bastion or endpoint path.',
    'Session Manager requires supported managed-node setup, IAM permissions, and connectivity to Systems Manager services.',
    'EC2 Instance Connect Endpoint has its own IAM, security-group, and supported-instance requirements.',
    'No management design is complete without identity control, session evidence, patching, recovery, and emergency access planning.'
  ],
  commonMistake: 'Creating a bastion with SSH open to 0.0.0.0/0 and treating its existence as a security control. It instead becomes a broadly exposed privileged entry point.',
  example: 'Administrators use Session Manager to reach private Amazon Linux instances without inbound port 22. A narrowly controlled break-glass path is documented, logged, regularly tested, and not used for daily access.',
  sources: [
    { title: 'Connect to a managed node using Session Manager', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-sessions-start.html' },
    { title: 'Connect using EC2 Instance Connect Endpoint', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-with-ec2-instance-connect-endpoint.html' }
  ]
});
