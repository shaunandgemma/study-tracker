import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-20', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'VPC DNS Resolution and DNS Hostnames', status: 'ready',
  plainEnglish: 'A VPC has DNS attributes that control whether the Amazon-provided Route 53 Resolver answers DNS queries and whether eligible instances receive public DNS hostnames. DNS support affects name resolution; DNS hostnames affect hostname assignment. Private hosted zones and interface-endpoint private DNS also depend on correct VPC DNS configuration.',
  whyItMatters: 'Applications usually depend on names rather than fixed addresses. A routing path can be correct while the application still fails because DNS is disabled, a private zone is associated incorrectly, an endpoint name resolves publicly, or a custom DNS server does not forward AWS names correctly.',
  workplaceExample: 'Private instances cannot resolve an interface endpoint to private IPs. The engineer verifies enableDnsSupport and enableDnsHostnames, checks private DNS on the endpoint, confirms the VPC association, and tests the resolver path from the affected subnet.',
  examFocus: 'SAA-C03: distinguish DNS resolution from hostname assignment; use the Amazon-provided resolver or correctly configured forwarding; private hosted zones resolve only in associated VPCs; endpoint private DNS can map normal service names to endpoint ENIs.',
  keyPoints: [
    'enableDnsSupport controls use of the Amazon-provided DNS resolver in the VPC.',
    'enableDnsHostnames controls public DNS hostname assignment for eligible instances.',
    'Private hosted zones require VPC associations and suitable resolver access.',
    'Interface endpoint private DNS depends on supported service configuration and VPC DNS attributes.',
    'DNS answers do not create network routes or security permission.',
    'Hybrid DNS commonly requires Route 53 Resolver endpoints and forwarding rules rather than ad hoc public resolution.'
  ],
  commonMistake: 'Troubleshooting only security groups when an AWS service hostname resolves to a public address because private DNS was not enabled or supported for the endpoint.',
  example: 'With private DNS enabled, a supported regional AWS service hostname resolves inside the VPC to private interface-endpoint addresses. Traffic still must be allowed by endpoint and client controls.',
  sources: [
    { title: 'DNS attributes for your VPC', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html' },
    { title: 'Amazon DNS server', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/AmazonDNS-concepts.html' }
  ]
});
