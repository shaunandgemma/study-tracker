import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cfg-13',
  topicId: 'topic-config',
  topicTitle: 'AWS Config',
  objectiveCode: 'Management',
  title: 'Resource Relationships',
  status: 'ready',
  plainEnglish: 'Resource Relationships is the feature of AWS Config that maps and records dependencies between different AWS resources. When AWS Config captures a Configuration Item (CI) for a resource, it also records related resources (such as an EC2 instance linked to a specific Subnet, VPC, IAM Role, Security Group, and EBS Volume).',
  whyItMatters: 'Cloud resources rarely exist in isolation. Understanding resource relationships helps engineers perform impact analysis (e.g. "If I delete this security group, which EC2 instances will lose access?") and security investigations (e.g. "Which IAM role gave this EC2 instance permission to read the S3 bucket?").',
  workplaceExample: 'A cloud architect needs to dismantle an old legacy application. By viewing the Resource Relationships map in AWS Config for the target EC2 instance, they instantly see all attached Elastic Network Interfaces, Security Groups, IAM Instance Profiles, and EBS Volumes, preventing accidental deletion of shared resources.',
  examFocus: 'For SAA-C03, AWS Config is unique in capturing resource dependency graphs over time. When analyzing resource changes or investigating security incidents, AWS Config displays related resources directly on the resource timeline.',
  keyPoints: [
    'Maps dependencies and connections between AWS resources.',
    'Captured automatically as part of each Configuration Item (CI).',
    'Includes relationships like EC2 -> Security Group, EC2 -> EBS Volume, VPC -> Subnet.',
    'Helps perform impact analysis before modifying or deleting infrastructure.',
    'Aids security forensics by tracing attack paths across related resources.'
  ],
  commonMistake: 'Assuming resource relationships are static. As resources are attached, detached, or reconfigured, AWS Config updates relationship mappings dynamically on the timeline.',
  example: 'Resource Relationship Mapping for Instance `i-0abc123456789def0`:\n- Attached to VPC: `vpc-11223344`\n- Attached to Subnet: `subnet-aabbccdd`\n- Security Group: `sg-99887766`\n- EBS Volume: `vol-00112233445566778`\n- IAM Role: `EC2-S3-Access-Role`',
  sources: [
    { title: 'AWS Config Concepts - Configuration Item', url: 'https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html' }
  ]
});
