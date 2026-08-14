import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-28',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Security Groups',
  status: 'ready',
  plainEnglish: 'An EC2 Security Group acts as a virtual firewall for your EC2 instances to control inbound (incoming) and outbound (outgoing) traffic. Security groups operate at the instance network interface level (ENI). By default, new security groups block ALL inbound traffic and allow ALL outbound traffic. Security Groups are stateful: if an inbound request is allowed, the response traffic is automatically allowed regardless of outbound rules.',
  whyItMatters: 'Security groups are your primary network defense in AWS. Restricting ports to authorized IP addresses or referencing other Security Groups prevents unauthorized network access, brute-force SSH attacks, and database exposures.',
  workplaceExample: 'A 3-tier web app configures three security groups:\n1. `alb-sg`: Allows inbound HTTP/HTTPS (ports 80/443) from `0.0.0.0/0`.\n2. `web-sg`: Allows inbound HTTP (port 80) ONLY from `alb-sg`.\n3. `db-sg`: Allows inbound MySQL (port 3306) ONLY from `web-sg`.',
  examFocus: 'SAA-C03 Security Group Rules to remember:\n- Stateful: Inbound response traffic is automatically allowed outbound.\n- ALLOW rules only: You cannot create DENY rules in Security Groups (use Network ACLs for DENY rules).\n- Security Group Chaining: You can reference another Security Group ID as a source/destination instead of IP CIDR ranges.\n- Multiple SGs can be attached to 1 ENI/instance.',
  keyPoints: [
    'Virtual firewall controlling inbound and outbound traffic at the ENI level.',
    'Stateful: Return traffic is automatically allowed regardless of outbound rules.',
    'Supports ALLOW rules only (no DENY rules).',
    'Supports Security Group Chaining (referencing SG IDs as traffic sources).',
    'Evaluates all rules before making an allow decision.'
  ],
  commonMistake: 'Trying to add an explicit DENY rule in a Security Group to block a malicious IP. Security Groups only support ALLOW rules. Use VPC Network ACLs (NACLs) to block specific IP addresses.',
  example: 'Security Group Rule Chaining Example:\nSecurity Group: `db-security-group`\nInbound Rule: Type = MySQL/Aurora (3306), Source = `sg-0123456789abcdef0` (Web Server SG ID).',
  sources: [
    { title: 'Amazon EC2 security groups for Linux instances', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html' }
  ]
});
