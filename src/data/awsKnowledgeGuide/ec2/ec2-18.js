import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-18',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Dedicated Instances',
  status: 'ready',
  plainEnglish: 'EC2 Dedicated Instances are virtual servers that run in a Virtual Private Cloud (VPC) on physical hardware dedicated to a single AWS account. Your Dedicated Instances are physically isolated at the host hardware level from instances belonging to other AWS accounts. However, unlike Dedicated Hosts, Dedicated Instances do not give you control over physical sockets or cores, nor do they guarantee that instances re-launch on the exact same physical host.',
  whyItMatters: 'Dedicated Instances satisfy strict compliance mandates (such as PCI-DSS, HIPAA, or government regulations) that prohibit sharing physical server hardware with other tenants, without paying the higher price of managing physical Dedicated Hosts.',
  workplaceExample: 'A payment gateway processes credit card transactions in AWS. To comply with PCI-DSS single-tenant isolation mandates, they configure their VPC tenancy to `dedicated`, ensuring all EC2 instances run on physical hardware isolated from other AWS customers.',
  examFocus: 'SAA-C03 comparison summary:\n- Shared Tenancy (Default): Multi-tenant physical hardware. Standard, cost-effective.\n- Dedicated Instances: Single-tenant physical hardware. Isolated from other accounts. No socket/core control.\n- Dedicated Hosts: Single-tenant physical hardware + Full control over sockets, cores, and host placement (for BYOL licenses).',
  keyPoints: [
    'Instances run on hardware dedicated exclusively to your AWS account.',
    'Physically isolated from other AWS customers at the host level.',
    'Configured at instance launch or set as default VPC tenancy.',
    'Does NOT provide socket/core visibility or host affinity control.',
    'Billed per instance plus a nominal dedicated tenancy fee per region.'
  ],
  commonMistake: 'Purchasing Dedicated Instances for Bring-Your-Own-License (BYOL) per-core software. Dedicated Instances do not expose physical socket/core topology; Dedicated Hosts are required for core-based licensing.',
  example: 'Launching a Dedicated Instance:\n`aws ec2 run-instances --image-id ami-0123456789abcdef0 --instance-type m5.large --placement Tenancy=dedicated`',
  sources: [
    { title: 'Dedicated Instances', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-hosts-overview.html' }
  ]
});
