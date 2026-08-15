import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shub-9',
  topicId: 'topic-security-hub',
  topicTitle: 'AWS Security Hub',
  objectiveCode: 'Security',
  title: 'CIS AWS Foundations Benchmark',
  status: 'ready',
  plainEnglish: 'The Center for Internet Security (CIS) AWS Foundations Benchmark standard in AWS Security Hub provides a set of industry-recognized vendor-neutral security guidelines for hardening AWS accounts. It covers identity and access management (IAM), logging (CloudTrail, CloudWatch), monitoring, and networking security controls.',
  whyItMatters: 'Enterprise security teams and external auditors frequently mandate compliance with the CIS AWS Foundations Benchmark. Enabling CIS in Security Hub automates continuous compliance auditing against official CIS Level 1 and Level 2 benchmark requirements.',
  workplaceExample: 'An enterprise cloud security architect enables the `CIS AWS Foundations Benchmark v1.4.0` in Security Hub. Automated control checks alert the team that CloudTrail log file validation is disabled on 2 member accounts.',
  examFocus: 'SAA-C03 CIS Benchmark Architecture & Levels:\n- Level 1 Controls: Essential baseline security configurations that can be implemented without causing performance or application operational impact.\n- Level 2 Controls: Deep security defense-in-depth controls intended for high-security environments (may have operational considerations).\n- Key Domains: IAM root accounts, MFA enforcement, CloudTrail multi-region logging, S3 bucket logging, and default VPC security group restrictions.',
  keyPoints: [
    'Vendor-neutral industry security benchmark created by the Center for Internet Security.',
    'Provides Level 1 (essential baseline) and Level 2 (defense-in-depth) security controls.',
    'Audits IAM policies, root user MFA, CloudTrail logging, VPC security, and KMS keys.',
    'Supports CIS AWS Foundations Benchmark versions v1.2.0 and v1.4.0 in Security Hub.',
    'Generates continuous automated compliance findings for external security audits.'
  ],
  commonMistake: 'Failing to enable CloudTrail in all AWS regions, causing multiple CIS Benchmark logging controls to report FAILED status in Security Hub.',
  example: 'Subscribing to CIS AWS Foundations Benchmark via AWS CLI:\naws securityhub batch-enable-standards --standards-subscription-requests \'[{"StandardsArn": "arn:aws:securityhub:us-east-1::standards/cis-aws-foundations-benchmark/v/1.4.0"}]\':',
  sources: [
    { title: 'CIS AWS Foundations Benchmark standard in Security Hub', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/cis-aws-foundations-benchmark.html' }
  ]
});
