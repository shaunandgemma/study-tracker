import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-17',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Dedicated Hosts',
  status: 'ready',
  plainEnglish: 'An EC2 Dedicated Host is a physical EC2 server fully dedicated for your organization\'s exclusive use. Dedicated Hosts give you visibility and control over the physical sockets and cores of the host hardware. This allows you to bring your own per-core or per-socket software licenses (such as Windows Server, SQL Server, or Oracle) to AWS to maintain regulatory compliance and licensing requirements.',
  whyItMatters: 'Legacy software licenses often tie licensing fees to physical CPU sockets or physical cores. Running on standard multi-tenant EC2 instances violates these licensing terms; Dedicated Hosts comply with strict per-core/per-socket license agreements.',
  workplaceExample: 'An enterprise holds existing perpetual licenses for Microsoft SQL Server bound to physical CPU sockets. By launching an EC2 Dedicated Host, they allocate instances on that physical host, using their existing licenses without paying additional software licensing fees to AWS.',
  examFocus: 'SAA-C03 distinction: Dedicated Hosts vs Dedicated Instances:\n- Dedicated Hosts: Gives full visibility/control over physical sockets and cores. REQUIRED when software licenses are bound to physical cores/sockets (BYOL), or for strict compliance.\n- Dedicated Instances: Instances run on single-tenant hardware (no other customers on host), but you DO NOT have control over sockets/cores or host placement.',
  keyPoints: [
    'Physical server fully dedicated to a single customer.',
    'Provides full control and visibility over physical CPU sockets and cores.',
    'Essential for Bring-Your-Own-License (BYOL) software (Windows, SQL Server, Oracle).',
    'Supports instance affinity (ensures instances re-launch on the exact same physical host).',
    'Highest cost option, available On-Demand or via Dedicated Host Reservations.'
  ],
  commonMistake: 'Confusing Dedicated Hosts with Dedicated Instances. Only Dedicated Hosts provide socket/core visibility needed for socket-based software licensing compliance.',
  example: 'Dedicated Host Allocation:\n`aws ec2 allocate-hosts --instance-type m5.large --availability-zone us-east-1a --quantity 1`\nResult: Physical server reserved in us-east-1a with full core mapping available.',
  sources: [
    { title: 'Dedicated Hosts', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-hosts-overview.html' }
  ]
});
