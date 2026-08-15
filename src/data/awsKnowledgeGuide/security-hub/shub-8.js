import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shub-8',
  topicId: 'topic-security-hub',
  topicTitle: 'AWS Security Hub',
  objectiveCode: 'Security',
  title: 'AWS Foundational Security Best Practices',
  status: 'ready',
  plainEnglish: 'The AWS Foundational Security Best Practices (FSBP) standard is the primary, AWS-curated security baseline in Security Hub. It consists of automated security controls developed by AWS security experts to protect AWS accounts, IAM configurations, data stores (S3, RDS, DynamoDB), networking (VPC, Security Groups), and compute resources against common security misconfigurations.',
  whyItMatters: 'FSBP represents AWS\'s recommended security baseline for all cloud workloads. Enabling FSBP ensures your AWS resources are continuously audited against current security best practices without requiring third-party compliance knowledge.',
  workplaceExample: 'A financial startup enables FSBP in Security Hub upon creating their AWS accounts. FSBP automatically flags an unencrypted DynamoDB table (`[DynamoDB.1]`) and an IAM user with attached inline administrator policies (`[IAM.5]`).',
  examFocus: 'SAA-C03 FSBP Standard Features:\n- AWS Core Baseline: AWS\'s recommended default security standard for all AWS environments.\n- High-Priority Controls: Focuses on critical posture checks (MFA on root, EBS encryption by default, S3 public access blocks, KMS key rotation).\n- Continuous Evolution: AWS regularly adds new security controls to FSBP as new AWS services and features are released.\n- Auto-Enablement: Enabled by default in new Security Hub deployments.',
  keyPoints: [
    'AWS-curated primary security standard for hardening AWS infrastructure.',
    'Evaluates accounts, IAM, storage, networking, compute, and database resources.',
    'Focuses on high-impact security misconfigurations (encryption, MFA, public exposure).',
    'Updated continuously by AWS security experts as new services launch.',
    'Enabled by default when activating AWS Security Hub.'
  ],
  commonMistake: 'Assuming third-party compliance standards like PCI-DSS replace FSBP. FSBP should be enabled alongside industry standards for comprehensive AWS security posture.',
  example: 'Checking FSBP Control Statuses via AWS CLI:\naws securityhub describe-standards-controls --standards-subscription-arn "arn:aws:securityhub:us-east-1:123456789012:subscription/aws-foundational-security-best-practices/v/1.0.0"',
  sources: [
    { title: 'AWS Foundational Security Best Practices standard', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/fsbp-standard.html' }
  ]
});
