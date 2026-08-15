import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-32', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'VPC Subnet Route Design', status: 'ready',
  plainEnglish: 'Subnet route design assigns each subnet a deliberate next-hop policy. Public, application-private, database-isolated, inspection, and hybrid subnets often need different route tables even inside the same VPC. The route table selects the most-specific destination, while security controls decide whether the selected traffic is permitted.',
  whyItMatters: 'A shared default route can accidentally expose a sensitive tier, bypass inspection, create a cross-AZ dependency, or send private service traffic through costly NAT. Explicit per-tier and per-AZ designs make the intended traffic path understandable and testable.',
  workplaceExample: 'Public load-balancer subnets route internet traffic to an IGW. Each application subnet routes IPv4 egress to an appropriate NAT path and S3 traffic to a gateway endpoint. Database subnets contain only local, monitoring, backup, and approved hybrid routes.',
  examFocus: 'SAA-C03: use longest-prefix match; separate public/private/isolated tiers; maintain return paths; keep NAT zonal affinity where using zonal NAT; add separate IPv6 routes; use more-specific endpoint or private-network routes instead of forcing all traffic through a default route.',
  keyPoints: [
    'Each subnet uses one associated route table at a time.',
    'Subnets with different trust or connectivity needs should not inherit an unsuitable shared table.',
    'More-specific routes can direct service, hybrid, inspection, or peer traffic away from the default path.',
    'Forward and return subnet routes must both support the intended flow.',
    'IPv4 and IPv6 require separate route entries and may use different egress components.',
    'Route design should account for availability, cross-AZ cost, inspection symmetry, and failure behaviour.'
  ],
  commonMistake: 'Using one route table for every subnet because it is simpler, then unintentionally giving databases the same internet and hybrid paths as public web resources.',
  example: 'App-a and app-b use AZ-aligned NAT routes, endpoint prefix-list routes, and private routes to shared services. Db-a and db-b omit general internet defaults and allow only documented private destinations.',
  sources: [
    { title: 'Subnet route tables', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html' },
    { title: 'Example route-table options', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/route-table-options.html' }
  ]
});
