import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mgn-10',
  topicId: 'topic-mgn',
  topicTitle: 'AWS MGN (Application Migration Service)',
  objectiveCode: 'Management',
  title: 'Launch Settings',
  status: 'ready',
  plainEnglish: 'AWS MGN Launch Settings define how target Amazon EC2 instances are provisioned and configured when you launch Test or Cutover instances. Launch Settings consist of General Launch Settings (such as EC2 Instance Rightsizing, Licensing, and Post-Launch Script actions) and an attached EC2 Launch Template (subnet, security groups, instance type, and IAM roles).',
  whyItMatters: 'Incorrect launch settings can cause converted target servers to fail to boot or lack network connectivity. Pre-configuring Launch Settings ensures that test and cutover launches spin up production-ready EC2 instances automatically.',
  workplaceExample: 'An engineer configures Launch Settings for a database server: they enable automatic EC2 Instance Rightsizing based on 14-day utilization metrics, select BYOL (Bring Your Own License) for Windows Server, and attach a custom post-launch script to reconfigure database IPs.',
  examFocus: 'SAA-C03 Launch Settings Components:\n- General Launch Settings: Controls instance rightsizing recommendations, OS licensing (AWS-provided vs BYOL), and Post-Launch Automation actions.\n- EC2 Launch Template: Specifies target VPC subnet, security group IDs, EC2 instance type, key pair, and IAM instance profile.\n- Test vs Cutover: The same Launch Settings configuration is used for both Test and Cutover instance launches.',
  keyPoints: [
    'Defines target Amazon EC2 configuration for Test and Cutover instances.',
    'Includes General Launch Settings (rightsizing, licensing, post-launch scripts).',
    'Integrates directly with Amazon EC2 Launch Templates for network/security specs.',
    'Supports BYOL (Bring Your Own License) and AWS-provided OS licensing.',
    'Ensures consistent, automated EC2 instance provisioning during cutovers.'
  ],
  commonMistake: 'Forgetting to update Launch Settings with a valid target VPC subnet and security group, resulting in EC2 instance launch failures during cutover.',
  example: 'Updating Source Server Launch Settings via AWS CLI:\naws mgn update-launch-configuration --source-server-id s-1234567890abcdef0 --target-instance-type-rightsizing-severby-evaluation-type SYSTEM_DEFINED',
  sources: [
    { title: 'Launch settings', url: 'https://docs.aws.amazon.com/mgn/latest/ug/launch-settings.html' }
  ]
});
