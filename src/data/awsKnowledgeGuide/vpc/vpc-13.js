import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-13', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'NAT Gateway High Availability per Availability Zone', status: 'ready',
  plainEnglish: 'A standard zonal NAT gateway is redundant within one Availability Zone, not across an entire Region. The traditional resilient design creates one zonal NAT gateway per active AZ and routes each private subnet to the NAT in its own AZ. AWS also offers regional NAT gateways, which automatically expand across Availability Zones for supported public NAT use cases and use one regional NAT gateway ID.',
  whyItMatters: 'Routing several AZs through one zonal NAT creates an AZ dependency and cross-AZ data paths. Per-AZ zonal NAT removes that shared failure point. Regional NAT can simplify supported designs, but it has different behaviour and restrictions, including no private NAT support, so architects must choose the correct availability mode.',
  workplaceExample: 'A legacy production VPC uses one zonal NAT in each of three AZs and separate private route tables. A new VPC evaluates regional NAT automatic mode to reduce route-table repetition while confirming Region support, expansion timing, costs, and the absence of a private-NAT requirement.',
  examFocus: 'SAA-C03 classic pattern: zonal NAT per active AZ with same-AZ routes. Current AWS also supports regional NAT for automatic multi-AZ public egress. Do not route every private subnet through one zonal NAT and call it highly available.',
  keyPoints: [
    'A zonal NAT gateway is implemented with redundancy inside its Availability Zone.',
    'One zonal NAT per active AZ avoids making other AZs depend on that NAT’s AZ.',
    'Same-AZ routing also avoids unnecessary cross-AZ processing paths.',
    'Regional NAT uses one gateway ID and can expand with workload presence across supported AZs.',
    'Regional NAT does not support private NAT, so private translation uses a supported zonal design.',
    'Route tables, endpoints, monitoring, quotas, and failure testing remain part of the availability design.'
  ],
  commonMistake: 'Deploying a single zonal NAT gateway for private subnets in multiple AZs, which leaves all of them without that egress path if the NAT AZ becomes unavailable.',
  example: 'Private-a routes to nat-a and private-b routes to nat-b in the zonal pattern. In a supported regional pattern, both can route to the regional NAT ID after its requirements and constraints are validated.',
  sources: [
    { title: 'NAT gateway basics and zonal resilience', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html' },
    { title: 'Regional NAT gateways', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html' }
  ]
});
