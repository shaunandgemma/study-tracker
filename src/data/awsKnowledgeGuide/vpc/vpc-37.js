import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-37', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'VPC Endpoints vs NAT Gateway', status: 'ready',
  plainEnglish: 'A VPC endpoint gives private connectivity to a specific supported AWS service or endpoint service. A NAT gateway provides translated outbound connectivity to broad IPv4 destinations according to routing. Endpoints are preferred for supported service traffic when private access, policy control, availability, and cost requirements fit; NAT remains useful for destinations without a suitable endpoint.',
  whyItMatters: 'Sending all AWS service traffic through NAT can add dependency, processing cost, and public-service routing. Replacing NAT blindly with endpoints also fails because endpoints cover only selected services and have their own charges, policies, DNS, and AZ requirements. Most production VPCs use an intentional combination.',
  workplaceExample: 'Private workloads use gateway endpoints for S3 and DynamoDB and interface endpoints for Systems Manager. General third-party update traffic uses NAT. Route tables, private DNS, endpoint security groups, and policies are tested for each path.',
  examFocus: 'SAA-C03: gateway endpoints are for S3/DynamoDB and use route tables; interface endpoints use PrivateLink ENIs and security groups; NAT supports broad initiated egress. Compare per-hour, processing, cross-AZ, DNS, policy, and availability implications.',
  keyPoints: [
    'Endpoints provide service-specific private access, while NAT provides general translated egress.',
    'Gateway endpoints for S3 and DynamoDB have no additional endpoint charge and use route-table prefix-list entries.',
    'Interface endpoints create ENIs, use security groups, and incur endpoint-related charges.',
    'NAT can reach public service endpoints and third-party destinations but incurs NAT processing and availability dependencies.',
    'Endpoint policies add a control layer but do not replace IAM or resource policies.',
    'A design can use endpoint routes for supported services and NAT as the fallback default path.'
  ],
  commonMistake: 'Deleting the NAT gateway after creating one interface endpoint, without checking all remaining operating-system repositories, external APIs, and AWS services that lack endpoints in the design.',
  example: 'S3 traffic matches a gateway-endpoint prefix-list route, Systems Manager resolves to interface endpoint ENIs, and all remaining approved IPv4 internet destinations follow 0.0.0.0/0 to NAT.',
  sources: [
    { title: 'VPC endpoint concepts', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html' },
    { title: 'NAT gateway basics', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html' }
  ]
});
