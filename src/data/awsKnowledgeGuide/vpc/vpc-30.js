import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-30', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'VPC Reachability Analyzer', status: 'ready',
  plainEnglish: 'VPC Reachability Analyzer performs static configuration analysis between a source and destination in a VPC networking path. It models routes and supported network components to show a reachable path or the blocking component. It does not send packets, run an application request, inspect DNS behaviour, or prove that the operating system is listening.',
  whyItMatters: 'Network paths can involve route tables, security groups, NACLs, gateways, peering, Transit Gateway, load balancers, and endpoints. Static path analysis quickly identifies configuration blockers before engineers resort to packet captures, but it must be paired with runtime tests for application and host issues.',
  workplaceExample: 'A new application instance cannot reach an RDS database. Reachability Analyzer identifies a missing security-group reference. After the approved correction, the path becomes reachable; a database client test then verifies DNS, credentials, TLS, and the database listener.',
  examFocus: 'SAA-C03: Reachability Analyzer diagnoses configuration paths without transmitting packets. Define source, destination, protocol, and port; inspect the hop-by-hop result; then use runtime tools for DNS, OS, application, and intermittent problems.',
  keyPoints: [
    'Reachability Analyzer uses network configuration rather than sending test traffic.',
    'A path includes a source, destination, protocol, and applicable port information.',
    'The analysis can identify supported blocking components and explain the modeled path.',
    'A reachable result does not prove an application is running or credentials are valid.',
    'A failed DNS lookup is outside a path analysis that uses already selected resource endpoints.',
    'Configuration changes require a new analysis to evaluate the updated path.'
  ],
  commonMistake: 'Interpreting a reachable result as proof that the application must work. The host firewall, listener, TLS, credentials, application code, and DNS can still fail.',
  example: 'Static analysis confirms the route, NACL, and security-group path from an EC2 ENI to a database ENI on TCP 5432. A separate client connection verifies the actual database service.',
  sources: [{ title: 'How VPC Reachability Analyzer works', url: 'https://docs.aws.amazon.com/vpc/latest/reachability/what-is-reachability-analyzer.html' }]
});
