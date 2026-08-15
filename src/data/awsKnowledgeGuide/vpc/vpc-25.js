import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-25', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'VPC Interface Endpoints with AWS PrivateLink', status: 'ready',
  plainEnglish: 'An interface VPC endpoint creates service-managed ENIs with private IP addresses in selected subnets. Clients connect to those private addresses to reach a supported AWS service or endpoint service through AWS PrivateLink. Endpoint security groups control traffic to the ENIs, and private DNS can make the normal service hostname resolve to them when supported and enabled.',
  whyItMatters: 'Interface endpoints let private workloads reach specific services without NAT, an IGW, public addresses, or general routed connectivity between networks. They reduce exposure and can simplify service consumption, but have hourly and data-processing costs plus per-AZ design considerations.',
  workplaceExample: 'Private instances use interface endpoints for Systems Manager services. Endpoints are placed in the required AZs, their security group allows HTTPS from managed-instance groups, private DNS is enabled, and DNS resolution is tested from each subnet.',
  examFocus: 'SAA-C03: interface endpoints use PrivateLink, create ENIs, use security groups, incur endpoint charges, and commonly support private DNS. They expose a specific service rather than providing full network routing.',
  keyPoints: [
    'An interface endpoint creates private endpoint ENIs in selected subnets.',
    'Security groups attached to the endpoint control client traffic to those ENIs.',
    'Private DNS can map a supported service hostname to private endpoint addresses.',
    'Interface endpoints use AWS PrivateLink and support many services beyond S3 and DynamoDB.',
    'They provide service-specific connectivity, not transitive VPC-to-VPC routing.',
    'Availability, cost, DNS, endpoint policy, service policy, and KMS permissions should be considered.'
  ],
  commonMistake: 'Creating an interface endpoint but attaching a security group that has no inbound HTTPS rule from the clients, then diagnosing the failure as DNS or routing.',
  example: 'The endpoint has one ENI in each required AZ. Private DNS resolves the service hostname to those IPs, and its security group allows TCP 443 only from the application security group.',
  sources: [
    { title: 'Access AWS services through interface endpoints', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html' },
    { title: 'AWS PrivateLink concepts', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html' }
  ]
});
