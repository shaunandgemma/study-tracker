import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'os-15',
  topicId: 'topic-opensearch',
  topicTitle: 'Amazon OpenSearch Service',
  objectiveCode: 'Analytics',
  title: 'VPC Access',
  status: 'ready',
  plainEnglish: 'VPC Access provisions your Amazon OpenSearch Service domain directly inside private subnets of your Amazon Virtual Private Cloud (VPC). AWS places Elastic Network Interfaces (ENIs) inside your subnets, assigning private IP addresses to your OpenSearch domain nodes and preventing public internet exposure.',
  whyItMatters: 'Exposing search clusters to the public internet creates severe security vulnerabilities. VPC Access isolates OpenSearch traffic within your private network, restricting access using Security Groups and Network ACLs.',
  workplaceExample: 'A health-tech firm provisions an OpenSearch domain inside private VPC subnets (`10.0.2.0/24`). A Security Group (`sg-opensearch`) permits inbound HTTPS (port 443) strictly from EC2 application servers in `sg-web`. The domain has no public IP address.',
  examFocus: 'SAA-C03 VPC Deployment & Security:\n- VPC vs Public Domain: Recommended security best practice is VPC Access.\n- ENIs: AWS creates Elastic Network Interfaces in your designated subnets (1 per data node).\n- Multi-AZ Subnets: Subnet group must contain subnets matching the domain\'s Availability Zone count.\n- Cross-VPC Access: Accessible from other VPCs or on-premises networks via VPC Peering, Transit Gateway, or AWS VPN.',
  keyPoints: [
    'Deploys OpenSearch cluster nodes directly into private VPC subnets.',
    'Places Elastic Network Interfaces (ENIs) with private IPs inside customer subnets.',
    'Prevents public internet exposure of search indices and OpenSearch Dashboards.',
    'Secured via VPC Security Groups, Network ACLs, and IAM Policies.',
    'Supports hybrid access via Direct Connect, Site-to-Site VPN, and VPC Peering.'
  ],
  commonMistake: 'Assuming an OpenSearch Domain Access Policy with `Principal: "*"` makes a VPC domain publicly accessible over the internet. Network reachability is enforced independently by VPC security groups.',
  example: 'Creating a VPC-Enabled OpenSearch Domain via AWS CLI:\naws opensearch create-domain --domain-name private-search --engine-version OpenSearch_2.11 --vpc-options SubnetIds=subnet-11111111,subnet-22222222,SecurityGroupIds=sg-0123456789abcdef0',
  sources: [
    { title: 'VPC support for Amazon OpenSearch Service domains', url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/vpc.html' }
  ]
});
